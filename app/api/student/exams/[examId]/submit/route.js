import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request, context) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get examId from params
    const { examId } = await context.params;
    const body = await request.json();
    const { attemptId, answers, timeUsed } = body;

    // Validate required fields
    if (!attemptId || !answers) {
      return NextResponse.json({ 
        error: 'Attempt ID and answers are required' 
      }, { status: 400 });
    }

    // Verify the attempt belongs to the current user and is not already completed
    const attempt = await prisma.examAttempt.findFirst({
      where: {
        id: attemptId,
        userId: session.user.id,
        examId: examId,
        completedAt: null
      },
      include: {
        exam: {
          include: {
            unit: {
              include: {
                course: {
                  include: {
                    enrollments: {
                      where: { userId: session.user.id },
                      select: { status: true }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!attempt) {
      return NextResponse.json({ 
        error: 'Attempt not found, already completed, or access denied' 
      }, { status: 404 });
    }

    // Verify user is still enrolled
    const enrollment = attempt.exam.unit.course.enrollments[0];
    if (!enrollment || enrollment.status !== 'ACTIVE') {
      return NextResponse.json({ 
        error: 'You are no longer enrolled in this course' 
      }, { status: 403 });
    }

    // Calculate the score
    const scoreResult = await calculateExamScore(attempt.exam, answers);

    // Determine if passed
    const passed = scoreResult.percentage >= (attempt.exam.passingScore || 70);

    // Complete the attempt
    const completedAttempt = await prisma.examAttempt.update({
      where: { id: attemptId },
      data: {
        answers: answers,
        completedAt: new Date(),
        score: scoreResult.percentage,
        pointsEarned: scoreResult.pointsEarned,
        totalPoints: scoreResult.totalPoints,
        passed: passed,
        timeUsed: timeUsed,
        status: 'COMPLETED',
        scoreBreakdown: scoreResult.breakdown
      }
    });

    // Update course progress if this is the student's best score
    await updateCourseProgress(session.user.id, attempt.exam, scoreResult.percentage, passed);

    // Log the submission
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'EXAM_SUBMITTED',
        entityType: 'EXAM_ATTEMPT',
        entityId: attemptId,
        details: {
          examId: examId,
          score: scoreResult.percentage,
          passed: passed,
          timeUsed: timeUsed,
          attempt: completedAttempt.attemptNumber || getAttemptNumber(session.user.id, examId)
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Exam submitted successfully',
      attempt: {
        id: completedAttempt.id,
        score: completedAttempt.score,
        pointsEarned: completedAttempt.pointsEarned,
        totalPoints: completedAttempt.totalPoints,
        passed: completedAttempt.passed,
        completedAt: completedAttempt.completedAt,
        timeUsed: completedAttempt.timeUsed
      },
      scoreBreakdown: scoreResult.breakdown
    });

  } catch (error) {
    console.error('Error submitting exam:', error);
    return NextResponse.json(
      { error: 'Failed to submit exam' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Helper function to calculate exam score
async function calculateExamScore(exam, answers) {
  let totalPoints = 0;
  let earnedPoints = 0;
  const breakdown = {
    multipleChoice: { total: 0, earned: 0, count: 0 },
    freeResponse: { total: 0, earned: 0, count: 0 },
    sections: {}
  };

  if (!exam.questions || typeof exam.questions !== 'object') {
    return {
      percentage: 0,
      pointsEarned: 0,
      totalPoints: 0,
      breakdown
    };
  }

  // Score Multiple Choice sections
  if (exam.questions.multipleChoice) {
    // Part A
    if (exam.questions.multipleChoice.partA && Array.isArray(exam.questions.multipleChoice.partA)) {
      const partAResult = scoreMultipleChoiceSection(
        exam.questions.multipleChoice.partA,
        answers,
        0, // section index
        'mc-part-a'
      );
      totalPoints += partAResult.totalPoints;
      earnedPoints += partAResult.earnedPoints;
      breakdown.multipleChoice.total += partAResult.totalPoints;
      breakdown.multipleChoice.earned += partAResult.earnedPoints;
      breakdown.multipleChoice.count += partAResult.count;
      breakdown.sections['mc-part-a'] = partAResult;
    }

    // Part B
    if (exam.questions.multipleChoice.partB && Array.isArray(exam.questions.multipleChoice.partB)) {
      const partBResult = scoreMultipleChoiceSection(
        exam.questions.multipleChoice.partB,
        answers,
        1, // section index (assuming part B is section 1)
        'mc-part-b'
      );
      totalPoints += partBResult.totalPoints;
      earnedPoints += partBResult.earnedPoints;
      breakdown.multipleChoice.total += partBResult.totalPoints;
      breakdown.multipleChoice.earned += partBResult.earnedPoints;
      breakdown.multipleChoice.count += partBResult.count;
      breakdown.sections['mc-part-b'] = partBResult;
    }
  }

  // Score Free Response sections (auto-grading for demo - in real implementation, this would need manual grading)
  if (exam.questions.freeResponse) {
    // Part A
    if (exam.questions.freeResponse.partA && Array.isArray(exam.questions.freeResponse.partA)) {
      const partAResult = scoreFreeResponseSection(
        exam.questions.freeResponse.partA,
        answers,
        2, // section index
        'fr-part-a'
      );
      totalPoints += partAResult.totalPoints;
      earnedPoints += partAResult.earnedPoints;
      breakdown.freeResponse.total += partAResult.totalPoints;
      breakdown.freeResponse.earned += partAResult.earnedPoints;
      breakdown.freeResponse.count += partAResult.count;
      breakdown.sections['fr-part-a'] = partAResult;
    }

    // Part B
    if (exam.questions.freeResponse.partB && Array.isArray(exam.questions.freeResponse.partB)) {
      const partBResult = scoreFreeResponseSection(
        exam.questions.freeResponse.partB,
        answers,
        3, // section index
        'fr-part-b'
      );
      totalPoints += partBResult.totalPoints;
      earnedPoints += partBResult.earnedPoints;
      breakdown.freeResponse.total += partBResult.totalPoints;
      breakdown.freeResponse.earned += partBResult.earnedPoints;
      breakdown.freeResponse.count += partBResult.count;
      breakdown.sections['fr-part-b'] = partBResult;
    }
  }

  const percentage = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;

  return {
    percentage,
    pointsEarned: earnedPoints,
    totalPoints,
    breakdown
  };
}

// Helper function to score multiple choice section
function scoreMultipleChoiceSection(questions, answers, sectionIndex, sectionId) {
  let totalPoints = 0;
  let earnedPoints = 0;
  const questionResults = [];

  questions.forEach((question, questionIndex) => {
    const questionKey = `${sectionIndex}-${questionIndex}`;
    const studentAnswer = answers[questionKey];
    const correctAnswer = question.correctAnswer;
    const points = question.points || 1;
    
    totalPoints += points;
    
    const isCorrect = studentAnswer !== undefined && studentAnswer === correctAnswer;
    if (isCorrect) {
      earnedPoints += points;
    }

    questionResults.push({
      questionIndex,
      studentAnswer,
      correctAnswer,
      isCorrect,
      pointsEarned: isCorrect ? points : 0,
      totalPoints: points
    });
  });

  return {
    totalPoints,
    earnedPoints,
    count: questions.length,
    questions: questionResults,
    sectionId
  };
}

// Helper function to score free response section (simplified auto-scoring)
function scoreFreeResponseSection(questions, answers, sectionIndex, sectionId) {
  let totalPoints = 0;
  let earnedPoints = 0;
  const questionResults = [];

  questions.forEach((question, questionIndex) => {
    const questionKey = `${sectionIndex}-${questionIndex}`;
    const studentAnswer = answers[questionKey];
    const points = question.totalPoints || 6;
    
    totalPoints += points;
    
    // Simplified scoring: give partial credit if answer exists and has content
    let questionScore = 0;
    if (studentAnswer && typeof studentAnswer === 'object') {
      // Count how many parts/sub-parts have answers
      const totalSubParts = question.parts?.reduce((total, part) => 
        total + (part.subParts?.length || 0), 0) || 1;
      
      let answeredSubParts = 0;
      Object.values(studentAnswer).forEach(answer => {
        if (answer && answer.toString().trim().length > 10) { // Minimum answer length
          answeredSubParts++;
        }
      });
      
      // Give partial credit based on completion
      questionScore = Math.round((answeredSubParts / totalSubParts) * points * 0.6); // Max 60% for auto-grading
    }
    
    earnedPoints += questionScore;

    questionResults.push({
      questionIndex,
      studentAnswer,
      pointsEarned: questionScore,
      totalPoints: points,
      needsManualGrading: true // Flag for instructor review
    });
  });

  return {
    totalPoints,
    earnedPoints,
    count: questions.length,
    questions: questionResults,
    sectionId,
    needsManualGrading: true
  };
}

// Helper function to update course progress
async function updateCourseProgress(userId, exam, score, passed) {
  try {
    // Find existing progress record
    const existingProgress = await prisma.unitProgress.findFirst({
      where: {
        userId: userId,
        unitId: exam.unitId
      }
    });

    const progressData = {
      userId: userId,
      unitId: exam.unitId,
      lastAccessedAt: new Date()
    };

    if (passed) {
      progressData.completedAt = new Date();
      progressData.status = 'COMPLETED';
    } else if (!existingProgress || !existingProgress.completedAt) {
      progressData.status = 'IN_PROGRESS';
    }

    // Update or create progress
    await prisma.unitProgress.upsert({
      where: {
        userId_unitId: {
          userId: userId,
          unitId: exam.unitId
        }
      },
      update: progressData,
      create: progressData
    });

  } catch (error) {
    console.error('Error updating course progress:', error);
    // Don't fail the submission if progress update fails
  }
}

// Helper function to get attempt number for a user
async function getAttemptNumber(userId, examId) {
  try {
    const count = await prisma.examAttempt.count({
      where: {
        userId: userId,
        examId: examId
      }
    });
    return count;
  } catch (error) {
    return 1;
  }
}
