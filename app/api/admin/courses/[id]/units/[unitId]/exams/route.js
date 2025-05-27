import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';

const prisma = new PrismaClient();

// GET - List all exams for a unit
export async function GET(request, { params }) {
  try {
    const session = await auth()
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id: courseId, unitId } = resolvedParams;

    // Verify course and unit exist and belong together
    const unit = await prisma.unit.findUnique({
      where: { 
        id: unitId,
        courseId: courseId 
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            apExamType: true
          }
        }
      }
    });

    if (!unit) {
      return NextResponse.json({ error: 'Unit not found' }, { status: 404 });
    }

    // Get all exams for this unit
    const exams = await prisma.unitExam.findMany({
      where: { unitId },
      include: {
        attempts: {
          select: {
            id: true,
            userId: true,
            score: true,
            passed: true,
            completedAt: true,
            user: {
              select: {
                name: true,
                email: true
              }
            }
          },
          orderBy: { completedAt: 'desc' }
        },
        _count: {
          select: {
            attempts: true
          }
        }
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'asc' }
      ]
    });

    // Add computed fields for each exam
    const examsWithStats = exams.map(exam => {
      const totalAttempts = exam._count.attempts;
      const passedAttempts = exam.attempts.filter(attempt => attempt.passed).length;
      const averageScore = totalAttempts > 0 
        ? exam.attempts.reduce((sum, attempt) => sum + attempt.score, 0) / totalAttempts
        : 0;

      // Parse questions to get counts
      let questionCounts = { total: 0, multipleChoice: 0, freeResponse: 0 };
      try {
        if (exam.questions && typeof exam.questions === 'object') {
          const questions = exam.questions;
          if (questions.multipleChoice) {
            questionCounts.multipleChoice = 
              (questions.multipleChoice.partA?.length || 0) + 
              (questions.multipleChoice.partB?.length || 0);
          }
          if (questions.freeResponse) {
            questionCounts.freeResponse = 
              (questions.freeResponse.partA?.length || 0) + 
              (questions.freeResponse.partB?.length || 0);
          }
          questionCounts.total = questionCounts.multipleChoice + questionCounts.freeResponse;
        }
      } catch (error) {
        console.error('Error parsing questions for exam:', exam.id, error);
      }

      return {
        ...exam,
        stats: {
          totalAttempts,
          passedAttempts,
          passRate: totalAttempts > 0 ? (passedAttempts / totalAttempts) * 100 : 0,
          averageScore: Math.round(averageScore * 100) / 100,
          questionCounts
        },
        // Remove the full attempts array for cleaner response
        recentAttempts: exam.attempts.slice(0, 5),
        attempts: undefined,
        _count: undefined
      };
    });

    return NextResponse.json({
      exams: examsWithStats,
      unit: {
        id: unit.id,
        title: unit.title,
        order: unit.order
      },
      course: unit.course
    });

  } catch (error) {
    console.error('Error fetching unit exams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exams' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST - Create a new exam
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await params;
    const { id: courseId, unitId } = resolvedParams;

    // Verify course and unit exist and belong together
    const unit = await prisma.unit.findUnique({
      where: { 
        id: unitId,
        courseId: courseId 
      },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            apExamType: true
          }
        }
      }
    });

    if (!unit) {
      return NextResponse.json({ error: 'Unit not found' }, { status: 404 });
    }

    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['title', 'questions'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate exam structure
    if (!body.questions || typeof body.questions !== 'object') {
      return NextResponse.json(
        { error: 'Questions must be a valid object' },
        { status: 400 }
      );
    }

    // Count total questions for validation
    let totalQuestions = 0;
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
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid questions structure' },
        { status: 400 }
      );
    }

    if (totalQuestions === 0) {
      return NextResponse.json(
        { error: 'At least one question is required' },
        { status: 400 }
      );
    }

    // Calculate total points if not provided
    const totalPoints = body.totalPoints || calculateTotalPoints(body.questions);

    // Prepare exam data
    const examData = {
      title: body.title.trim(),
      description: body.description?.trim() || null,
      instructions: body.instructions?.trim() || null,
      unitId,
      
      // Structure and content
      examType: body.examType || 'UNIT_ASSESSMENT',
      questions: body.questions,
      structure: body.structure || null,
      
      // Scoring
      passingScore: Math.max(0, Math.min(100, body.scoring?.passingScore || 70)),
      totalPoints,
      multipleChoiceWeight: body.scoring?.multipleChoiceWeight || 0.6,
      freeResponseWeight: body.scoring?.freeResponseWeight || 0.4,
      apStyleScoring: body.scoring?.apStyleScoring || false,
      allowPartialCredit: body.scoring?.allowPartialCredit !== false,
      
      // Timing
      timeLimit: body.totalTimeLimit || null,
      allowTimeExtensions: body.allowTimeExtensions || false,
      
      // Behavior
      order: body.order || 1,
      maxAttempts: Math.max(1, Math.min(10, body.maxAttempts || 1)),
      shuffleQuestions: body.shuffleQuestions || false,
      shuffleOptions: body.shuffleOptions !== false,
      showCorrectAnswers: body.showCorrectAnswers || false,
      allowReviewAfterSubmission: body.allowReviewAfterSubmission !== false,
      
      // Availability
      availableFrom: body.availableFrom ? new Date(body.availableFrom) : null,
      availableUntil: body.availableUntil ? new Date(body.availableUntil) : null,
      requiresProctoring: body.requiresProctoring || false,
      
      // Publishing
      isPublished: body.isPublished || false
    };

    // Validate date ranges
    if (examData.availableFrom && examData.availableUntil) {
      if (examData.availableFrom >= examData.availableUntil) {
        return NextResponse.json(
          { error: 'Available from date must be before available until date' },
          { status: 400 }
        );
      }
    }

    // Create the exam
    const exam = await prisma.unitExam.create({
      data: examData,
      include: {
        unit: {
          select: {
            id: true,
            title: true,
            order: true
          }
        },
        _count: {
          select: {
            attempts: true
          }
        }
      }
    });

    // Add computed stats for consistency
    const examWithStats = {
      ...exam,
      stats: {
        totalAttempts: 0,
        passedAttempts: 0,
        passRate: 0,
        averageScore: 0,
        questionCounts: {
          total: totalQuestions,
          multipleChoice: (body.questions.multipleChoice?.partA?.length || 0) + 
                         (body.questions.multipleChoice?.partB?.length || 0),
          freeResponse: (body.questions.freeResponse?.partA?.length || 0) + 
                       (body.questions.freeResponse?.partB?.length || 0)
        }
      },
      recentAttempts: [],
      _count: undefined
    };

    return NextResponse.json(examWithStats, { status: 201 });

  } catch (error) {
    console.error('Error creating exam:', error);
    
    // Handle specific Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'An exam with this title already exists in this unit' },
        { status: 409 }
      );
    }
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Unit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create exam' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Helper function to calculate total points from questions
function calculateTotalPoints(questions) {
  let total = 0;
  
  try {
    // Multiple Choice questions (typically 1 point each)
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
     
    // Free Response questions (typically 6 points each, but sum sub-parts)
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
    return 100; // Default fallback
  }
  
  return total || 100; // Default to 100 if calculation fails
}
