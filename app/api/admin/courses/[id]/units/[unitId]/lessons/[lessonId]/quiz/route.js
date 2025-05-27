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
        isPublished: body.isPublished
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
