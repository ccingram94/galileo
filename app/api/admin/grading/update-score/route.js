import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'INSTRUCTOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { attemptId, questionId, score, feedback = '', graderId } = body;

    // Validate input
    if (!attemptId || !questionId || score === undefined || score === null) {
      return NextResponse.json(
        { error: 'Missing required fields: attemptId, questionId, and score are required' },
        { status: 400 }
      );
    }

    // Validate that the grader is the current user
    if (graderId !== session.user.id) {
      return NextResponse.json({ error: 'Invalid grader ID' }, { status: 400 });
    }

    // Start a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // 1. Verify the exam attempt exists and get exam info
      const attempt = await tx.examAttempt.findUnique({
        where: { id: attemptId },
        include: {
          unitExam: {
            include: {
              questions: true
            }
          }
        }
      });

      if (!attempt) {
        throw new Error('Exam attempt not found');
      }

      // 2. Verify the question exists and get question details
      const question = attempt.unitExam.questions.find(q => q.id === questionId);
      if (!question) {
        throw new Error('Question not found in this exam');
      }

      // 3. Validate score is within acceptable range
      const maxPoints = question.points || 1;
      if (score < 0 || score > maxPoints) {
        throw new Error(`Score must be between 0 and ${maxPoints} points`);
      }

      // 4. Find or create the exam response
      let examResponse = await tx.examResponse.findFirst({
        where: {
          attemptId,
          questionId
        }
      });

      if (examResponse) {
        // Update existing response
        examResponse = await tx.examResponse.update({
          where: { id: examResponse.id },
          data: {
            instructorScore: score,
            instructorFeedback: feedback,
            pointsEarned: score,
            gradingStatus: 'graded',
            gradedAt: new Date(),
            gradedBy: graderId
          }
        });
      } else {
        // Create new response if it doesn't exist (shouldn't happen normally)
        examResponse = await tx.examResponse.create({
          data: {
            attemptId,
            questionId,
            answer: { content: 'No response submitted' },
            isCorrect: score > 0,
            pointsEarned: score,
            instructorScore: score,
            instructorFeedback: feedback,
            gradingStatus: 'graded',
            gradedAt: new Date(),
            gradedBy: graderId
          }
        });
      }

      // 5. Calculate and update the attempt grading status and scores
      const allResponses = await tx.examResponse.findMany({
        where: { attemptId },
        include: { question: true }
      });

      // Separate MC and FR responses
      const mcResponses = allResponses.filter(r => r.question.type === 'MULTIPLE_CHOICE');
      const frResponses = allResponses.filter(r => r.question.type !== 'MULTIPLE_CHOICE');

      // Calculate MC score (auto-graded)
      const mcCorrectCount = mcResponses.filter(r => r.isCorrect).length;
      const mcTotalCount = mcResponses.length;
      const autoGradedScore = mcTotalCount > 0 ? (mcCorrectCount / mcTotalCount) * 100 : 0;

      // Calculate FR score (manually graded)
      const frTotalPoints = frResponses.reduce((sum, r) => sum + (r.question.points || 0), 0);
      const frEarnedPoints = frResponses.reduce((sum, r) => sum + (r.instructorScore || 0), 0);
      const manualGradedScore = frTotalPoints > 0 ? (frEarnedPoints / frTotalPoints) * 100 : 0;

      // Calculate weighted final score
      const mcWeight = attempt.unitExam.multipleChoiceWeight || 0.6;
      const frWeight = attempt.unitExam.freeResponseWeight || 0.4;
      const finalScore = (autoGradedScore * mcWeight) + (manualGradedScore * frWeight);

      // Determine if all FR questions are graded
      const ungradedFRCount = frResponses.filter(r => r.gradingStatus === 'pending').length;
      const isFullyGraded = ungradedFRCount === 0;

      // Update attempt with new scores and status
      const updatedAttempt = await tx.examAttempt.update({
        where: { id: attemptId },
        data: {
          autoGradedScore,
          manualGradedScore,
          score: isFullyGraded ? finalScore : null, // Only set final score when fully graded
          passed: isFullyGraded ? finalScore >= attempt.unitExam.passingScore : false,
          gradingStatus: isFullyGraded ? 'completed' : 'in_progress',
          gradedBy: graderId,
          // Only set gradedAt when fully complete
          ...(isFullyGraded && { gradedAt: new Date() })
        }
      });

      return {
        examResponse,
        updatedAttempt,
        calculatedScores: {
          autoGradedScore,
          manualGradedScore,
          finalScore,
          isFullyGraded,
          ungradedFRCount
        }
      };
    });

    // 6. Log the grading action for audit trail
    console.log(`Question graded: User ${session.user.name} graded question ${questionId} in attempt ${attemptId} with score ${score}/${question?.points}`);

    return NextResponse.json({
      success: true,
      message: 'Score updated successfully',
      data: {
        responseId: result.examResponse.id,
        score,
        feedback,
        gradedAt: result.examResponse.gradedAt,
        attemptStatus: result.updatedAttempt.gradingStatus,
        calculatedScores: result.calculatedScores
      }
    });

  } catch (error) {
    console.error('Error updating question score:', error);
    
    // Handle specific error types
    if (error.message.includes('not found')) {
      return NextResponse.json(
        { error: error.message },
        { status: 404 }
      );
    }
    
    if (error.message.includes('must be between')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to update question score',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// API endpoint to get current grading progress for an attempt
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || !['ADMIN', 'INSTRUCTOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const attemptId = searchParams.get('attemptId');

    if (!attemptId) {
      return NextResponse.json(
        { error: 'attemptId is required' },
        { status: 400 }
      );
    }

    // Get attempt with all responses and questions
    const attempt = await prisma.examAttempt.findUnique({
      where: { id: attemptId },
      include: {
        unitExam: {
          include: {
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
      return NextResponse.json(
        { error: 'Exam attempt not found' },
        { status: 404 }
      );
    }

    // Calculate progress statistics
    const allQuestions = attempt.unitExam.questions;
    const mcQuestions = allQuestions.filter(q => q.type === 'MULTIPLE_CHOICE');
    const frQuestions = allQuestions.filter(q => q.type !== 'MULTIPLE_CHOICE');

    const frResponses = attempt.responses.filter(r => 
      frQuestions.some(q => q.id === r.questionId)
    );

    const gradedFRCount = frResponses.filter(r => r.gradingStatus === 'graded').length;
    const ungradedFRCount = frQuestions.length - gradedFRCount;

    const progress = {
      totalQuestions: allQuestions.length,
      mcQuestions: mcQuestions.length,
      frQuestions: frQuestions.length,
      gradedFRQuestions: gradedFRCount,
      ungradedFRQuestions: ungradedFRCount,
      gradingProgress: frQuestions.length > 0 ? (gradedFRCount / frQuestions.length) * 100 : 100,
      isComplete: ungradedFRCount === 0,
      autoGradedScore: attempt.autoGradedScore,
      manualGradedScore: attempt.manualGradedScore,
      finalScore: attempt.score,
      gradingStatus: attempt.gradingStatus
    };

    return NextResponse.json({
      success: true,
      data: progress
    });

  } catch (error) {
    console.error('Error getting grading progress:', error);
    return NextResponse.json(
      { error: 'Failed to get grading progress' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
