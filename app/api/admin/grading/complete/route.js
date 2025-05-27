import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to send email notification (placeholder for now)
async function sendGradeNotification(studentEmail, studentName, examTitle, courseTitle, score, passed, feedback) {
  // TODO: Implement email sending with your preferred service (SendGrid, Resend, etc.)
  console.log(`Email notification sent to ${studentEmail}:
    Subject: Your exam "${examTitle}" has been graded
    Score: ${Math.round(score)}% ${passed ? '(PASSED)' : '(NOT PASSED)'}
    Course: ${courseTitle}
    Feedback: ${feedback || 'No additional feedback provided'}`);
  
  // For now, we'll just log it. In production, you'd implement actual email sending here.
  return { success: true, message: 'Notification logged' };
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'INSTRUCTOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { attemptId, instructorFeedback = '', needsReview = false } = body;

    // Validate input
    if (!attemptId) {
      return NextResponse.json(
        { error: 'attemptId is required' },
        { status: 400 }
      );
    }

    // Start a comprehensive transaction
    const result = await prisma.$transaction(async (tx) => {
      // 1. Get the exam attempt with all related data
      const attempt = await tx.examAttempt.findUnique({
        where: { id: attemptId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          unitExam: {
            include: {
              unit: {
                include: {
                  course: {
                    select: {
                      id: true,
                      title: true,
                      apExamType: true
                    }
                  }
                }
              },
              questions: {
                orderBy: { order: 'asc' }
              }
            }
          },
          responses: {
            include: {
              question: true
            }
          }
        }
      });

      if (!attempt) {
        throw new Error('Exam attempt not found');
      }

      // 2. Verify all FR questions are graded
      const frQuestions = attempt.unitExam.questions.filter(q => q.type !== 'MULTIPLE_CHOICE');
      const frResponses = attempt.responses.filter(r => 
        frQuestions.some(q => q.id === r.questionId)
      );
      
      const ungradedFRQuestions = frResponses.filter(r => r.gradingStatus === 'pending');
      
      if (ungradedFRQuestions.length > 0) {
        throw new Error(`Cannot complete grading: ${ungradedFRQuestions.length} FR question(s) still pending`);
      }

      // 3. Calculate final scores
      const mcQuestions = attempt.unitExam.questions.filter(q => q.type === 'MULTIPLE_CHOICE');
      const mcResponses = attempt.responses.filter(r => 
        mcQuestions.some(q => q.id === r.questionId)
      );

      // MC Score calculation
      const mcCorrectCount = mcResponses.filter(r => r.isCorrect).length;
      const mcTotalCount = mcQuestions.length;
      const autoGradedScore = mcTotalCount > 0 ? (mcCorrectCount / mcTotalCount) * 100 : 0;

      // FR Score calculation
      const frTotalPoints = frQuestions.reduce((sum, q) => sum + (q.points || 0), 0);
      const frEarnedPoints = frResponses.reduce((sum, r) => sum + (r.instructorScore || 0), 0);
      const manualGradedScore = frTotalPoints > 0 ? (frEarnedPoints / frTotalPoints) * 100 : 0;

      // Weighted final score
      const mcWeight = attempt.unitExam.multipleChoiceWeight || 0.6;
      const frWeight = attempt.unitExam.freeResponseWeight || 0.4;
      const finalScore = (autoGradedScore * mcWeight) + (manualGradedScore * frWeight);

      // Determine pass/fail
      const passed = finalScore >= attempt.unitExam.passingScore;

      // 4. Update the exam attempt with final results
      const completedAttempt = await tx.examAttempt.update({
        where: { id: attemptId },
        data: {
          score: finalScore,
          passed,
          gradingStatus: 'completed',
          gradedAt: new Date(),
          gradedBy: session.user.id,
          instructorFeedback,
          needsReview,
          autoGradedScore,
          manualGradedScore
        }
      });

      // 5. Update enrollment progress if this is a passing attempt
      if (passed) {
        const enrollment = await tx.enrollment.findFirst({
          where: {
            userId: attempt.userId,
            courseId: attempt.unitExam.unit.courseId
          }
        });

        if (enrollment) {
          const currentProgress = enrollment.progress || {};
          
          // Mark exam as completed in progress
          const examProgressKey = `exam_${attempt.unitExamId}`;
          currentProgress[examProgressKey] = {
            completed: true,
            completedAt: new Date().toISOString(),
            score: finalScore,
            passed: true
          };

          // Check if all exams in the unit are completed
          const unitExams = await tx.unitExam.findMany({
            where: { unitId: attempt.unitExam.unitId },
            select: { id: true }
          });

          const allUnitExamsPassed = unitExams.every(exam => {
            const examKey = `exam_${exam.id}`;
            return currentProgress[examKey]?.passed === true;
          });

          // If all unit exams passed, mark unit as completed
          if (allUnitExamsPassed) {
            const unitProgressKey = `unit_${attempt.unitExam.unitId}`;
            currentProgress[unitProgressKey] = {
              completed: true,
              completedAt: new Date().toISOString()
            };
          }

          await tx.enrollment.update({
            where: { id: enrollment.id },
            data: { progress: currentProgress }
          });
        }
      }

      // 6. Create a grading summary for analytics
      const gradingSummary = {
        attemptId: attempt.id,
        studentId: attempt.userId,
        examId: attempt.unitExamId,
        courseId: attempt.unitExam.unit.courseId,
        graderId: session.user.id,
        completedAt: new Date(),
        scores: {
          mcScore: autoGradedScore,
          frScore: manualGradedScore,
          finalScore,
          passed
        },
        breakdown: {
          mcQuestions: mcTotalCount,
          mcCorrect: mcCorrectCount,
          frQuestions: frQuestions.length,
          frTotalPoints,
          frEarnedPoints,
          weights: { mc: mcWeight, fr: frWeight }
        },
        feedback: instructorFeedback,
        needsReview
      };

      return {
        completedAttempt,
        gradingSummary,
        studentInfo: attempt.user,
        examInfo: attempt.unitExam,
        courseInfo: attempt.unitExam.unit.course
      };
    });

    // 7. Send notification to student (outside transaction for performance)
    try {
      await sendGradeNotification(
        result.studentInfo.email,
        result.studentInfo.name,
        result.examInfo.title,
        result.courseInfo.title,
        result.gradingSummary.scores.finalScore,
        result.gradingSummary.scores.passed,
        instructorFeedback
      );
    } catch (emailError) {
      console.error('Failed to send grade notification:', emailError);
      // Don't fail the entire request if email fails
    }

    // 8. Log completion for audit trail
    console.log(`Grading completed: ${session.user.name} completed grading for attempt ${attemptId}
      Student: ${result.studentInfo.name}
      Exam: ${result.examInfo.title}
      Final Score: ${Math.round(result.gradingSummary.scores.finalScore)}%
      Status: ${result.gradingSummary.scores.passed ? 'PASSED' : 'FAILED'}`);

    return NextResponse.json({
      success: true,
      message: 'Grading completed successfully',
      data: {
        attemptId: result.completedAttempt.id,
        finalScore: result.gradingSummary.scores.finalScore,
        passed: result.gradingSummary.scores.passed,
        gradedAt: result.completedAttempt.gradedAt,
        breakdown: result.gradingSummary.breakdown,
        studentNotified: true,
        needsReview: needsReview
      }
    });

  } catch (error) {
    console.error('Error completing grading:', error);
    
    // Handle specific error types
    if (error.message.includes('not found')) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    if (error.message.includes('Cannot complete grading')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to complete grading',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET endpoint to retrieve completion status and statistics
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'INSTRUCTOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const attemptId = searchParams.get('attemptId');
    const examId = searchParams.get('examId');

    if (!attemptId && !examId) {
      return NextResponse.json(
        { error: 'Either attemptId or examId is required' },
        { status: 400 }
      );
    }

    if (attemptId) {
      // Get completion status for specific attempt
      const attempt = await prisma.examAttempt.findUnique({
        where: { id: attemptId },
        include: {
          user: { select: { id: true, name: true, email: true } },
          unitExam: { select: { id: true, title: true, passingScore: true } },
          grader: { select: { id: true, name: true } }
        }
      });

      if (!attempt) {
        return NextResponse.json(
          { error: 'Exam attempt not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          attemptId: attempt.id,
          status: attempt.gradingStatus,
          score: attempt.score,
          passed: attempt.passed,
          gradedAt: attempt.gradedAt,
          gradedBy: attempt.grader?.name,
          feedback: attempt.instructorFeedback,
          needsReview: attempt.needsReview,
          student: attempt.user,
          exam: attempt.unitExam
        }
      });
    }

    if (examId) {
      // Get completion statistics for entire exam
      const examStats = await prisma.examAttempt.groupBy({
        by: ['gradingStatus'],
        where: { unitExamId: examId },
        _count: { _all: true }
      });

      const completedAttempts = await prisma.examAttempt.findMany({
        where: {
          unitExamId: examId,
          gradingStatus: 'completed'
        },
        include: {
          user: { select: { name: true } }
        },
        orderBy: { gradedAt: 'desc' },
        take: 10
      });

      const stats = {
        total: examStats.reduce((sum, stat) => sum + stat._count._all, 0),
        pending: examStats.find(s => s.gradingStatus === 'pending')?._count._all || 0,
        inProgress: examStats.find(s => s.gradingStatus === 'in_progress')?._count._all || 0,
        completed: examStats.find(s => s.gradingStatus === 'completed')?._count._all || 0,
        recentlyCompleted: completedAttempts
      };

      return NextResponse.json({
        success: true,
        data: {
          examId,
          statistics: stats
        }
      });
    }

  } catch (error) {
    console.error('Error getting completion status:', error);
    return NextResponse.json(
      { error: 'Failed to get completion status' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
