import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PATCH /api/admin/courses/[id]/units/[unitId]/lessons/[lessonId]/publish - Toggle lesson publish status
export async function PATCH(request, { params }) {
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

    const { isPublished } = await request.json();

    const lesson = await prisma.lesson.update({
      where: { id: params.lessonId },
      data: {
        isPublished: Boolean(isPublished),
        updatedAt: new Date()
      },
      include: {
        lessonQuizzes: true
      }
    });

    return NextResponse.json(lesson);

  } catch (error) {
    console.error('Error updating lesson publish status:', error);
    return NextResponse.json(
      { error: 'Failed to update lesson publish status' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
