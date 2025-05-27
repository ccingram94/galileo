import { NextResponse } from 'next/server';
import { auth } from '@/auth';
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

    // Verify exam exists and user has access
    const exam = await prisma.unitExam.findUnique({
      where: { id: examId },
      include: {
        unit: {
          include: {
            course: {
              include: {
                enrollments: {
                  where: { 
                    userId: session.user.id,
                    status: 'ACTIVE'
                  }
                }
              }
            }
          }
        },
        attempts: {
          where: { userId: session.user.id }
        }
      }
    });

    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    // Check enrollment
    if (exam.unit.course.enrollments.length === 0) {
      return NextResponse.json({ 
        error: 'You are not enrolled in this course' 
      }, { status: 403 });
    }

    // Check if exam is published and available
    if (!exam.isPublished) {
      return NextResponse.json({ 
        error: 'Exam is not published' 
      }, { status: 403 });
    }

    const now = new Date();
    if (exam.availableFrom && new Date(exam.availableFrom) > now) {
      return NextResponse.json({ 
        error: 'Exam is not yet available' 
      }, { status: 403 });
    }

    if (exam.availableUntil && new Date(exam.availableUntil) < now) {
      return NextResponse.json({ 
        error: 'Exam deadline has passed' 
      }, { status: 403 });
    }

    // Check attempt limits
    const completedAttempts = exam.attempts.filter(attempt => attempt.completedAt);
    const inProgressAttempt = exam.attempts.find(attempt => !attempt.completedAt);

    if (inProgressAttempt) {
      return NextResponse.json({ 
        error: 'You already have an attempt in progress',
        attemptId: inProgressAttempt.id
      }, { status: 400 });
    }

    if (completedAttempts.length >= exam.maxAttempts) {
      return NextResponse.json({ 
        error: 'Maximum attempts reached' 
      }, { status: 403 });
    }

    // Create new attempt
    const newAttempt = await prisma.examAttempt.create({
      data: {
        examId: examId,
        userId: session.user.id,
        startedAt: new Date(),
        answers: {},
        currentSection: 0,
        currentQuestion: 0,
        status: 'IN_PROGRESS'
      }
    });

    // Log the attempt creation
    await prisma.activityLog.create({
      data: {
        userId: session.user.id,
        action: 'EXAM_STARTED',
        entityType: 'EXAM_ATTEMPT',
        entityId: newAttempt.id,
        details: {
          examId: examId,
          attemptNumber: completedAttempts.length + 1
        }
      }
    });

    return NextResponse.json({
      success: true,
      attemptId: newAttempt.id,
      message: 'Exam attempt created successfully'
    });

  } catch (error) {
    console.error('Error creating exam attempt:', error);
    return NextResponse.json(
      { error: 'Failed to create exam attempt' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request, context) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { examId } = await context.params;

    // Get user's attempts for this exam
    const attempts = await prisma.examAttempt.findMany({
      where: {
        examId: examId,
        userId: session.user.id
      },
      orderBy: { createdAt: 'desc' },
      include: {
        exam: {
          select: {
            id: true,
            title: true,
            maxAttempts: true
          }
        }
      }
    });

    const completedAttempts = attempts.filter(attempt => attempt.completedAt);
    const inProgressAttempt = attempts.find(attempt => !attempt.completedAt);

    return NextResponse.json({
      attempts: attempts.map(attempt => ({
        id: attempt.id,
        startedAt: attempt.startedAt,
        completedAt: attempt.completedAt,
        score: attempt.score,
        passed: attempt.passed,
        timeUsed: attempt.timeUsed,
        status: attempt.status
      })),
      summary: {
        totalAttempts: attempts.length,
        completedAttempts: completedAttempts.length,
        maxAttempts: attempts[0]?.exam.maxAttempts || 1,
        hasInProgress: !!inProgressAttempt,
        inProgressAttemptId: inProgressAttempt?.id,
        bestScore: completedAttempts.length > 0 ? 
          Math.max(...completedAttempts.map(a => a.score || 0)) : null
      }
    });

  } catch (error) {
    console.error('Error retrieving exam attempts:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve attempts' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
