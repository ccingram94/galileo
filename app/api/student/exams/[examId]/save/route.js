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
    const { attemptId, answers, currentSection, currentQuestion, timeRemaining, status } = body;

    // Validate required fields
    if (!attemptId) {
      return NextResponse.json({ error: 'Attempt ID is required' }, { status: 400 });
    }

    // Verify the attempt belongs to the current user
    const attempt = await prisma.examAttempt.findFirst({
      where: {
        id: attemptId,
        userId: session.user.id,
        examId: examId,
        completedAt: null // Only allow saving for incomplete attempts
      },
      include: {
        exam: {
          select: { 
            id: true, 
            maxAttempts: true,
            timeLimit: true,
            structure: true 
          }
        }
      }
    });

    if (!attempt) {
      return NextResponse.json({ 
        error: 'Attempt not found or already completed' 
      }, { status: 404 });
    }

    // Check if exam time has expired
    const startTime = new Date(attempt.startedAt);
    const elapsed = Date.now() - startTime.getTime();
    
    // Calculate total allowed time in milliseconds
    let totalTimeLimit = 90 * 60 * 1000; // Default 90 minutes
    if (attempt.exam.structure) {
      totalTimeLimit = (
        (attempt.exam.structure.multipleChoice?.partA?.timeLimit || 0) +
        (attempt.exam.structure.multipleChoice?.partB?.timeLimit || 0) +
        (attempt.exam.structure.freeResponse?.partA?.timeLimit || 0) +
        (attempt.exam.structure.freeResponse?.partB?.timeLimit || 0)
      ) * 60 * 1000;
    } else if (attempt.exam.timeLimit) {
      totalTimeLimit = attempt.exam.timeLimit * 60 * 1000;
    }

    // If time has expired, don't allow further saves
    if (elapsed > totalTimeLimit) {
      return NextResponse.json({ 
        error: 'Time limit exceeded',
        timeExpired: true 
      }, { status: 400 });
    }

    // Validate answers format
    if (answers && typeof answers !== 'object') {
      return NextResponse.json({ error: 'Invalid answers format' }, { status: 400 });
    }

    // Update the attempt
    const updatedAttempt = await prisma.examAttempt.update({
      where: { id: attemptId },
      data: {
        answers: answers || attempt.answers,
        currentSection: currentSection !== undefined ? currentSection : attempt.currentSection,
        currentQuestion: currentQuestion !== undefined ? currentQuestion : attempt.currentQuestion,
        timeRemaining: timeRemaining !== undefined ? timeRemaining : attempt.timeRemaining,
        status: status || attempt.status,
        lastSavedAt: new Date()
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Progress saved successfully',
      attempt: {
        id: updatedAttempt.id,
        currentSection: updatedAttempt.currentSection,
        currentQuestion: updatedAttempt.currentQuestion,
        lastSavedAt: updatedAttempt.lastSavedAt
      }
    });

  } catch (error) {
    console.error('Error saving exam progress:', error);
    return NextResponse.json(
      { error: 'Failed to save progress' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// GET endpoint to retrieve current progress (if needed)
export async function GET(request, context) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { examId } = await context.params;
    const { searchParams } = new URL(request.url);
    const attemptId = searchParams.get('attemptId');

    if (!attemptId) {
      return NextResponse.json({ error: 'Attempt ID is required' }, { status: 400 });
    }

    const attempt = await prisma.examAttempt.findFirst({
      where: {
        id: attemptId,
        userId: session.user.id,
        examId: examId
      },
      include: {
        exam: {
          select: {
            id: true,
            title: true,
            structure: true,
            questions: true
          }
        }
      }
    });

    if (!attempt) {
      return NextResponse.json({ error: 'Attempt not found' }, { status: 404 });
    }

    return NextResponse.json({
      attempt: {
        id: attempt.id,
        answers: attempt.answers,
        currentSection: attempt.currentSection,
        currentQuestion: attempt.currentQuestion,
        timeRemaining: attempt.timeRemaining,
        status: attempt.status,
        startedAt: attempt.startedAt,
        lastSavedAt: attempt.lastSavedAt
      }
    });

  } catch (error) {
    console.error('Error retrieving exam progress:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve progress' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
