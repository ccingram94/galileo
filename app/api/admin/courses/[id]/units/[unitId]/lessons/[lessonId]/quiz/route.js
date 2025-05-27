import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request, { params }) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    
    // Validate lesson exists and doesn't already have a quiz
    const lesson = await prisma.lesson.findUnique({
      where: {
        id: resolvedParams.lessonId,
        unitId: resolvedParams.unitId
      },
      include: {
        lessonQuizzes: true
      }
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    if (lesson.lessonQuizzes) {
      return NextResponse.json({ error: 'Quiz already exists for this lesson' }, { status: 400 });
    }

    // Create the quiz
    const quiz = await prisma.lessonQuiz.create({
      data: {
        title: body.title,
        description: body.description,
        lessonId: resolvedParams.lessonId,
        questions: body.questions,
        passingScore: body.passingScore,
        isPublished: body.isPublished,
        // Add the new fields with default values
        timeLimit: body.timeLimit || null,
        allowRetakes: body.allowRetakes || false,
        maxAttempts: body.maxAttempts || null,
        showCorrectAnswers: body.showCorrectAnswers !== undefined ? body.showCorrectAnswers : true,
        randomizeQuestions: body.randomizeQuestions || false,
        randomizeOptions: body.randomizeOptions || false
      }
    });

    return NextResponse.json(quiz);
  } catch (error) {
    console.error('Error creating quiz:', error);
    return NextResponse.json({ error: 'Failed to create quiz' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request, { params }) {
  try {
    const resolvedParams = await params;
    const body = await request.json();

    // Validate required fields
    if (!body.title || body.passingScore === undefined) {
      return NextResponse.json(
        { error: 'Title and passing score are required' },
        { status: 400 }
      );
    }

    // Validate passing score range
    if (body.passingScore < 0 || body.passingScore > 100) {
      return NextResponse.json(
        { error: 'Passing score must be between 0 and 100' },
        { status: 400 }
      );
    }

    // Validate questions if provided
    if (body.questions && Array.isArray(body.questions) && body.questions.length > 0) {
      for (let i = 0; i < body.questions.length; i++) {
        const question = body.questions[i];
        
        if (!question.question || question.question.trim() === '') {
          return NextResponse.json(
            { error: `Question ${i + 1} is missing question text` },
            { status: 400 }
          );
        }
        
        if (question.type === 'multiple-choice') {
          if (!question.options || !Array.isArray(question.options) || question.options.length < 2) {
            return NextResponse.json(
              { error: `Question ${i + 1} needs at least 2 options` },
              { status: 400 }
            );
          }
          
          // Check that all options have content
          const emptyOptions = question.options.filter(opt => !opt || opt.trim() === '');
          if (emptyOptions.length > 0) {
            return NextResponse.json(
              { error: `Question ${i + 1} has empty answer options` },
              { status: 400 }
            );
          }
          
          if (question.correctAnswer === undefined || 
              question.correctAnswer < 0 || 
              question.correctAnswer >= question.options.length) {
            return NextResponse.json(
              { error: `Question ${i + 1} needs a valid correct answer` },
              { status: 400 }
            );
          }
        }
        
        if (question.type === 'true-false') {
          if (question.correctAnswer !== true && question.correctAnswer !== false) {
            return NextResponse.json(
              { error: `Question ${i + 1} (True/False) needs a valid correct answer` },
              { status: 400 }
            );
          }
        }
      }
    }

    // Validate time limit if provided
    if (body.timeLimit !== null && body.timeLimit !== undefined) {
      if (body.timeLimit < 1) {
        return NextResponse.json(
          { error: 'Time limit must be at least 1 minute' },
          { status: 400 }
        );
      }
    }

    // Validate max attempts if retakes are allowed
    if (body.allowRetakes && body.maxAttempts !== null && body.maxAttempts !== undefined) {
      if (body.maxAttempts < 1) {
        return NextResponse.json(
          { error: 'Max attempts must be at least 1' },
          { status: 400 }
        );
      }
    }

    // Check if quiz exists
    const existingQuiz = await prisma.lessonQuiz.findUnique({
      where: { lessonId: resolvedParams.lessonId }
    });

    if (!existingQuiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Update the quiz
    const updatedQuiz = await prisma.lessonQuiz.update({
      where: { lessonId: resolvedParams.lessonId },
      data: {
        title: body.title,
        description: body.description || null,
        questions: body.questions || [],
        passingScore: body.passingScore,
        timeLimit: body.timeLimit || null,
        isPublished: body.isPublished !== undefined ? body.isPublished : false,
        allowRetakes: body.allowRetakes !== undefined ? body.allowRetakes : false,
        maxAttempts: body.maxAttempts || null,
        showCorrectAnswers: body.showCorrectAnswers !== undefined ? body.showCorrectAnswers : true,
        randomizeQuestions: body.randomizeQuestions !== undefined ? body.randomizeQuestions : false,
        randomizeOptions: body.randomizeOptions !== undefined ? body.randomizeOptions : false,
        updatedAt: new Date()
      }
    });

    return NextResponse.json(updatedQuiz);

  } catch (error) {
    console.error('Error updating quiz:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update quiz' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request, { params }) {
  try {
    const resolvedParams = await params;

    // Check if quiz exists
    const existingQuiz = await prisma.lessonQuiz.findUnique({
      where: { lessonId: resolvedParams.lessonId },
      include: {
        attempts: {
          select: { id: true }
        }
      }
    });

    if (!existingQuiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Check if there are any attempts
    if (existingQuiz.attempts && existingQuiz.attempts.length > 0) {
      return NextResponse.json(
        { 
          error: 'Cannot delete quiz with existing student attempts',
          hasAttempts: true,
          attemptCount: existingQuiz.attempts.length
        },
        { status: 400 }
      );
    }

    // Delete the quiz
    await prisma.lessonQuiz.delete({
      where: { lessonId: resolvedParams.lessonId }
    });

    return NextResponse.json({ message: 'Quiz deleted successfully' });

  } catch (error) {
    console.error('Error deleting quiz:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to delete quiz' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
