import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/admin/courses/[id]/units/[unitId]/lessons/[lessonId] - Get a specific lesson
export async function GET(request, { params }) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const lesson = await prisma.lesson.findUnique({
      where: { 
        id: params.lessonId,
        unitId: params.unitId 
      },
      include: {
        lessonQuizzes: {
          include: {
            questions: true
          }
        },
        unit: {
          include: {
            course: true
          }
        }
      }
    });

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Verify lesson belongs to the correct course
    if (lesson.unit.courseId !== params.id) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    return NextResponse.json(lesson);

  } catch (error) {
    console.error('Error fetching lesson:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lesson' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT /api/admin/courses/[id]/units/[unitId]/lessons/[lessonId] - Update a lesson
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Verify lesson exists and belongs to the unit/course
    const existingLesson = await prisma.lesson.findUnique({
      where: { 
        id: params.lessonId,
        unitId: params.unitId 
      },
      include: {
        unit: true
      }
    });

    if (!existingLesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    if (existingLesson.unit.courseId !== params.id) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    const { 
      title, 
      description, 
      content, 
      videoUrl, 
      duration, 
      order, 
      isPublished 
    } = await request.json();

    // Validate required fields
    if (!title || title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (title.trim().length < 3) {
      return NextResponse.json({ error: 'Title must be at least 3 characters' }, { status: 400 });
    }

    // Validate video URL if provided
    if (videoUrl && videoUrl.trim()) {
      try {
        new URL(videoUrl);
      } catch {
        return NextResponse.json({ error: 'Invalid video URL' }, { status: 400 });
      }
    }

    // Handle order changes
    if (parseInt(order) !== existingLesson.order) {
      const newOrder = parseInt(order);
      const oldOrder = existingLesson.order;

      if (newOrder < oldOrder) {
        // Moving up: increment order of lessons between newOrder and oldOrder
        await prisma.lesson.updateMany({
          where: {
            unitId: params.unitId,
            order: { gte: newOrder, lt: oldOrder }
          },
          data: {
            order: { increment: 1 }
          }
        });
      } else {
        // Moving down: decrement order of lessons between oldOrder and newOrder
        await prisma.lesson.updateMany({
          where: {
            unitId: params.unitId,
            order: { gt: oldOrder, lte: newOrder }
          },
          data: {
            order: { decrement: 1 }
          }
        });
      }
    }

    const lesson = await prisma.lesson.update({
      where: { id: params.lessonId },
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        content: content?.trim() || null,
        videoUrl: videoUrl?.trim() || null,
        duration: duration ? parseInt(duration) : null,
        order: parseInt(order),
        isPublished: Boolean(isPublished),
        updatedAt: new Date()
      },
      include: {
        lessonQuizzes: true
      }
    });

    return NextResponse.json(lesson);

  } catch (error) {
    console.error('Error updating lesson:', error);
    return NextResponse.json(
      { error: 'Failed to update lesson' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE /api/admin/courses/[id]/units/[unitId]/lessons/[lessonId] - Delete a lesson
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Verify lesson exists and belongs to the unit/course
    const existingLesson = await prisma.lesson.findUnique({
      where: { 
        id: params.lessonId,
        unitId: params.unitId 
      },
      include: {
        unit: true,
        lessonQuizzes: {
          include: {
            questions: true
          }
        }
      }
    });

    if (!existingLesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    if (existingLesson.unit.courseId !== params.id) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
    }

    // Delete all related data in the correct order
    await prisma.$transaction(async (tx) => {
      // Delete quiz questions first
      for (const quiz of existingLesson.lessonQuizzes) {
        await tx.quizQuestion.deleteMany({
          where: { lessonQuizId: quiz.id }
        });
      }

      // Delete lesson quizzes
      await tx.lessonQuiz.deleteMany({
        where: { lessonId: params.lessonId }
      });

      // Delete the lesson itself
      await tx.lesson.delete({
        where: { id: params.lessonId }
      });

      // Reorder remaining lessons to fill the gap
      await tx.lesson.updateMany({
        where: {
          unitId: params.unitId,
          order: { gt: existingLesson.order }
        },
        data: {
          order: { decrement: 1 }
        }
      });
    });

    return NextResponse.json({ message: 'Lesson deleted successfully' });

  } catch (error) {
    console.error('Error deleting lesson:', error);
    return NextResponse.json(
      { error: 'Failed to delete lesson' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
