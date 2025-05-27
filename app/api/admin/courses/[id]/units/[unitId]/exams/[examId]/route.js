import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../../../../../../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// GET - Get a specific exam with full details
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id: courseId, unitId, examId } = resolvedParams;

    // Get exam with full details including attempts
    const exam = await prisma.unitExam.findUnique({
      where: { id: examId },
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
        attempts: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: { startedAt: 'desc' }
        },
        _count: {
          select: {
            attempts: true
          }
        }
      }
    });

    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    // Verify exam belongs to the correct course and unit
    if (exam.unitId !== unitId || exam.unit.courseId !== courseId) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    // Calculate detailed statistics
    const stats = calculateExamStats(exam.attempts);

    // Parse questions to get detailed structure
    const questionAnalysis = analyzeQuestions(exam.questions);

    // Format the response
    const examWithDetails = {
      ...exam,
      stats,
      questionAnalysis,
      attempts: exam.attempts.map(attempt => ({
        id: attempt.id,
        userId: attempt.userId,
        user: attempt.user,
        score: attempt.score,
        passed: attempt.passed,
        timeSpent: attempt.timeSpent,
        startedAt: attempt.startedAt,
        completedAt: attempt.completedAt,
        // Don't include full answers in list view for performance
        hasAnswers: !!attempt.answers
      })),
      _count: undefined
    };

    return NextResponse.json(examWithDetails);

  } catch (error) {
    console.error('Error fetching exam:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exam' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT - Update an existing exam
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id: courseId, unitId, examId } = resolvedParams;

    // Verify exam exists and belongs to correct course/unit
    const existingExam = await prisma.unitExam.findUnique({
      where: { id: examId },
      include: {
        unit: {
          select: {
            id: true,
            courseId: true
          }
        },
        attempts: {
          select: {
            id: true,
            completedAt: true
          }
        }
      }
    });

    if (!existingExam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    if (existingExam.unitId !== unitId || existingExam.unit.courseId !== courseId) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Check if exam has completed attempts - restrict some changes
    const hasCompletedAttempts = existingExam.attempts.some(attempt => attempt.completedAt);
    
    if (hasCompletedAttempts) {
      // Limited fields can be changed after attempts
      const allowedFields = [
        'title', 'description', 'instructions', 'availableFrom', 'availableUntil',
        'isPublished', 'showCorrectAnswers', 'allowReviewAfterSubmission'
      ];
      
      const restrictedChanges = [];
      
      // Check if user is trying to change restricted fields
      if (body.questions && JSON.stringify(body.questions) !== JSON.stringify(existingExam.questions)) {
        restrictedChanges.push('questions');
      }
      if (body.scoring?.passingScore && body.scoring.passingScore !== existingExam.passingScore) {
        restrictedChanges.push('passing score');
      }
      if (body.totalTimeLimit && body.totalTimeLimit !== existingExam.timeLimit) {
        restrictedChanges.push('time limit');
      }
      
      if (restrictedChanges.length > 0) {
        return NextResponse.json(
          { 
            error: `Cannot modify ${restrictedChanges.join(', ')} after students have completed attempts. Create a new exam version instead.`,
            restrictedFields: restrictedChanges
          },
          { status: 400 }
        );
      }
    }

    // Validate questions if provided
    let totalQuestions = 0;
    let totalPoints = body.totalPoints;
    
    if (body.questions) {
      if (typeof body.questions !== 'object') {
        return NextResponse.json(
          { error: 'Questions must be a valid object' },
          { status: 400 }
        );
      }

      // Count and validate questions
      try {
        const { questions } = body;
        if (questions.multipleChoice) {
          totalQuestions += (questions.multipleChoice.partA?.length || 0);
          totalQuestions += (questions.multipleChoice.partB?.length || 0);
        }
        if (questions.freeResponse) {
          totalQuestions += (questions.freeResponse.partA?.length || 0);
          totalQuestions += (questions.freeResponse.partB?.length || 0);
        }
        
        if (totalQuestions === 0) {
          return NextResponse.json(
            { error: 'At least one question is required' },
            { status: 400 }
          );
        }
        
        // Recalculate total points if questions changed
        if (!totalPoints) {
          totalPoints = calculateTotalPoints(body.questions);
        }
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid questions structure' },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData = {
      title: body.title.trim(),
      ...(body.description !== undefined && { description: body.description?.trim() || null }),
      ...(body.instructions !== undefined && { instructions: body.instructions?.trim() || null }),
      ...(body.examType !== undefined && { examType: body.examType }),
      ...(body.questions !== undefined && { questions: body.questions }),
      ...(body.structure !== undefined && { structure: body.structure }),
      ...(body.order !== undefined && { order: body.order }),
      ...(totalPoints !== undefined && { totalPoints }),
      ...(body.totalTimeLimit !== undefined && { timeLimit: body.totalTimeLimit }),
      ...(body.allowTimeExtensions !== undefined && { allowTimeExtensions: body.allowTimeExtensions }),
      ...(body.isPublished !== undefined && { isPublished: body.isPublished }),
      ...(body.availableFrom !== undefined && { 
        availableFrom: body.availableFrom ? new Date(body.availableFrom) : null 
      }),
      ...(body.availableUntil !== undefined && { 
        availableUntil: body.availableUntil ? new Date(body.availableUntil) : null 
      }),
      ...(body.requiresProctoring !== undefined && { requiresProctoring: body.requiresProctoring })
    };

    // Update scoring fields if provided
    if (body.scoring) {
      if (body.scoring.passingScore !== undefined) {
        updateData.passingScore = Math.max(0, Math.min(100, body.scoring.passingScore));
      }
      if (body.scoring.multipleChoiceWeight !== undefined) {
        updateData.multipleChoiceWeight = body.scoring.multipleChoiceWeight;
      }
      if (body.scoring.freeResponseWeight !== undefined) {
        updateData.freeResponseWeight = body.scoring.freeResponseWeight;
      }
      if (body.scoring.apStyleScoring !== undefined) {
        updateData.apStyleScoring = body.scoring.apStyleScoring;
      }
      if (body.scoring.allowPartialCredit !== undefined) {
        updateData.allowPartialCredit = body.scoring.allowPartialCredit;
      }
    }

    // Update behavior settings if provided
    if (body.maxAttempts !== undefined) {
      updateData.maxAttempts = Math.max(1, Math.min(10, body.maxAttempts));
    }
    if (body.shuffleQuestions !== undefined) {
      updateData.shuffleQuestions = body.shuffleQuestions;
    }
    if (body.shuffleOptions !== undefined) {
      updateData.shuffleOptions = body.shuffleOptions;
    }
    if (body.showCorrectAnswers !== undefined) {
      updateData.showCorrectAnswers = body.showCorrectAnswers;
    }
    if (body.allowReviewAfterSubmission !== undefined) {
      updateData.allowReviewAfterSubmission = body.allowReviewAfterSubmission;
    }

    // Validate date ranges
    const availableFrom = updateData.availableFrom || existingExam.availableFrom;
    const availableUntil = updateData.availableUntil || existingExam.availableUntil;
    
    if (availableFrom && availableUntil && availableFrom >= availableUntil) {
      return NextResponse.json(
        { error: 'Available from date must be before available until date' },
        { status: 400 }
      );
    }

    // Update the exam
    const updatedExam = await prisma.unitExam.update({
      where: { id: examId },
      data: updateData,
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
        _count: {
          select: {
            attempts: true
          }
        }
      }
    });

    // Add basic stats for consistency
    const examWithStats = {
      ...updatedExam,
      stats: {
        totalAttempts: updatedExam._count.attempts,
        hasAttempts: hasCompletedAttempts,
        questionCounts: analyzeQuestions(updatedExam.questions)
      },
      _count: undefined
    };

    return NextResponse.json(examWithStats);

  } catch (error) {
    console.error('Error updating exam:', error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'An exam with this title already exists in this unit' },
        { status: 409 }
      );
    }
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Exam not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update exam' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE - Delete an exam
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id: courseId, unitId, examId } = resolvedParams;

    // Verify exam exists and belongs to correct course/unit
    const existingExam = await prisma.unitExam.findUnique({
      where: { id: examId },
      include: {
        unit: {
          select: {
            id: true,
            courseId: true
          }
        },
        attempts: {
          select: {
            id: true,
            completedAt: true
          }
        }
      }
    });

    if (!existingExam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    if (existingExam.unitId !== unitId || existingExam.unit.courseId !== courseId) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    // Check if exam has completed attempts
    const hasCompletedAttempts = existingExam.attempts.some(attempt => attempt.completedAt);
    
    if (hasCompletedAttempts) {
      return NextResponse.json(
        { 
          error: 'Cannot delete exam with completed student attempts. Consider unpublishing instead.',
          hasAttempts: true,
          attemptCount: existingExam.attempts.length
        },
        { status: 400 }
      );
    }

    // Delete the exam (this will cascade delete attempts due to schema)
    await prisma.unitExam.delete({
      where: { id: examId }
    });

    return NextResponse.json({ 
      message: 'Exam deleted successfully',
      deletedExamId: examId 
    });

  } catch (error) {
    console.error('Error deleting exam:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Exam not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete exam' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Helper function to calculate detailed exam statistics
function calculateExamStats(attempts) {
  if (!attempts || attempts.length === 0) {
    return {
      totalAttempts: 0,
      completedAttempts: 0,
      inProgressAttempts: 0,
      passedAttempts: 0,
      failedAttempts: 0,
      passRate: 0,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      averageTimeSpent: 0,
      medianScore: 0,
      scoreDistribution: {
        'A (90-100%)': 0,
        'B (80-89%)': 0,
        'C (70-79%)': 0,
        'D (60-69%)': 0,
        'F (0-59%)': 0
      }
    };
  }

  const completedAttempts = attempts.filter(attempt => attempt.completedAt);
  const inProgressAttempts = attempts.filter(attempt => !attempt.completedAt);
  const passedAttempts = completedAttempts.filter(attempt => attempt.passed);
  const failedAttempts = completedAttempts.filter(attempt => !attempt.passed);

  // Score statistics
  const scores = completedAttempts.map(attempt => attempt.score);
  const averageScore = scores.length > 0 ? scores.reduce((sum, score) => sum + score, 0) / scores.length : 0;
  const highestScore = scores.length > 0 ? Math.max(...scores) : 0;
  const lowestScore = scores.length > 0 ? Math.min(...scores) : 0;
  
  // Median score
  const sortedScores = [...scores].sort((a, b) => a - b);
  const medianScore = sortedScores.length > 0 ? 
    sortedScores.length % 2 === 0 ? 
      (sortedScores[sortedScores.length / 2 - 1] + sortedScores[sortedScores.length / 2]) / 2 :
      sortedScores[Math.floor(sortedScores.length / 2)] : 0;

  // Time statistics
  const timesSpent = completedAttempts.filter(attempt => attempt.timeSpent).map(attempt => attempt.timeSpent);
  const averageTimeSpent = timesSpent.length > 0 ? timesSpent.reduce((sum, time) => sum + time, 0) / timesSpent.length : 0;

  // Score distribution
  const scoreDistribution = {
    'A (90-100%)': scores.filter(score => score >= 90).length,
    'B (80-89%)': scores.filter(score => score >= 80 && score < 90).length,
    'C (70-79%)': scores.filter(score => score >= 70 && score < 80).length,
    'D (60-69%)': scores.filter(score => score >= 60 && score < 70).length,
    'F (0-59%)': scores.filter(score => score < 60).length
  };

  return {
    totalAttempts: attempts.length,
    completedAttempts: completedAttempts.length,
    inProgressAttempts: inProgressAttempts.length,
    passedAttempts: passedAttempts.length,
    failedAttempts: failedAttempts.length,
    passRate: completedAttempts.length > 0 ? (passedAttempts.length / completedAttempts.length) * 100 : 0,
    averageScore: Math.round(averageScore * 100) / 100,
    highestScore: Math.round(highestScore * 100) / 100,
    lowestScore: Math.round(lowestScore * 100) / 100,
    medianScore: Math.round(medianScore * 100) / 100,
    averageTimeSpent: Math.round(averageTimeSpent),
    scoreDistribution
  };
}

// Helper function to analyze question structure
function analyzeQuestions(questions) {
  const analysis = {
    total: 0,
    multipleChoice: { total: 0, partA: 0, partB: 0 },
    freeResponse: { total: 0, partA: 0, partB: 0 },
    totalPoints: 0,
    avgPointsPerQuestion: 0,
    hasCalculatorRequired: false,
    hasCalculatorRestricted: false,
    difficultyDistribution: { easy: 0, medium: 0, hard: 0 },
    skillDistribution: {}
  };

  if (!questions || typeof questions !== 'object') {
    return analysis;
  }

  try {
    // Analyze multiple choice questions
    if (questions.multipleChoice) {
      if (questions.multipleChoice.partA && Array.isArray(questions.multipleChoice.partA)) {
        analysis.multipleChoice.partA = questions.multipleChoice.partA.length;
        analysis.hasCalculatorRestricted = true;
        
        questions.multipleChoice.partA.forEach(q => {
          analysis.totalPoints += q.points || 1;
          if (q.difficulty) analysis.difficultyDistribution[q.difficulty]++;
          if (q.skill) analysis.skillDistribution[q.skill] = (analysis.skillDistribution[q.skill] || 0) + 1;
        });
      }
      
      if (questions.multipleChoice.partB && Array.isArray(questions.multipleChoice.partB)) {
        analysis.multipleChoice.partB = questions.multipleChoice.partB.length;
        analysis.hasCalculatorRequired = true;
        
        questions.multipleChoice.partB.forEach(q => {
          analysis.totalPoints += q.points || 1;
          if (q.difficulty) analysis.difficultyDistribution[q.difficulty]++;
          if (q.skill) analysis.skillDistribution[q.skill] = (analysis.skillDistribution[q.skill] || 0) + 1;
        });
      }
      
      analysis.multipleChoice.total = analysis.multipleChoice.partA + analysis.multipleChoice.partB;
    }

    // Analyze free response questions
    if (questions.freeResponse) {
      if (questions.freeResponse.partA && Array.isArray(questions.freeResponse.partA)) {
        analysis.freeResponse.partA = questions.freeResponse.partA.length;
        analysis.hasCalculatorRequired = true;
        
        questions.freeResponse.partA.forEach(q => {
          let questionPoints = 0;
          if (q.parts && Array.isArray(q.parts)) {
            q.parts.forEach(part => {
              if (part.subParts && Array.isArray(part.subParts)) {
                part.subParts.forEach(subPart => {
                  questionPoints += subPart.points || 0;
                });
              }
            });
          } else {
            questionPoints = q.totalPoints || 6;
          }
          analysis.totalPoints += questionPoints;
          if (q.difficulty) analysis.difficultyDistribution[q.difficulty]++;
          if (q.skill) analysis.skillDistribution[q.skill] = (analysis.skillDistribution[q.skill] || 0) + 1;
        });
      }
      
      if (questions.freeResponse.partB && Array.isArray(questions.freeResponse.partB)) {
        analysis.freeResponse.partB = questions.freeResponse.partB.length;
        analysis.hasCalculatorRestricted = true;
        
        questions.freeResponse.partB.forEach(q => {
          let questionPoints = 0;
          if (q.parts && Array.isArray(q.parts)) {
            q.parts.forEach(part => {
              if (part.subParts && Array.isArray(part.subParts)) {
                part.subParts.forEach(subPart => {
                  questionPoints += subPart.points || 0;
                });
              }
            });
          } else {
            questionPoints = q.totalPoints || 6;
          }
          analysis.totalPoints += questionPoints;
          if (q.difficulty) analysis.difficultyDistribution[q.difficulty]++;
          if (q.skill) analysis.skillDistribution[q.skill] = (analysis.skillDistribution[q.skill] || 0) + 1;
        });
      }
      
      analysis.freeResponse.total = analysis.freeResponse.partA + analysis.freeResponse.partB;
    }

    analysis.total = analysis.multipleChoice.total + analysis.freeResponse.total;
    analysis.avgPointsPerQuestion = analysis.total > 0 ? analysis.totalPoints / analysis.total : 0;

  } catch (error) {
    console.error('Error analyzing questions:', error);
  }

  return analysis;
}

// Helper function to calculate total points (reused from main route)
function calculateTotalPoints(questions) {
  let total = 0;
  
  try {
    if (questions.multipleChoice) {
      if (questions.multipleChoice.partA) {
        questions.multipleChoice.partA.forEach(q => {
          total += q.points || 1;
        });
      }
      if (questions.multipleChoice.partB) {
        questions.multipleChoice.partB.forEach(q => {
          total += q.points || 1;
        });
      }
    }
    
    if (questions.freeResponse) {
      if (questions.freeResponse.partA) {
        questions.freeResponse.partA.forEach(q => {
          if (q.parts && Array.isArray(q.parts)) {
            q.parts.forEach(part => {
              if (part.subParts && Array.isArray(part.subParts)) {
                part.subParts.forEach(subPart => {
                  total += subPart.points || 0;
                });
              }
            });
          } else {
            total += q.totalPoints || 6;
          }
        });
      }
      if (questions.freeResponse.partB) {
        questions.freeResponse.partB.forEach(q => {
          if (q.parts && Array.isArray(q.parts)) {
            q.parts.forEach(part => {
              if (part.subParts && Array.isArray(part.subParts)) {
                part.subParts.forEach(subPart => {
                  total += subPart.points || 0;
                });
              }
            });
          } else {
            total += q.totalPoints || 6;
          }
        });
      }
    }
  } catch (error) {
    console.error('Error calculating total points:', error);
    return 100;
  }
  
  return total || 100;
}
