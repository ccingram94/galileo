import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT /api/admin/courses/[id]/units/[unitId]/lessons/reorder - Reorder lessons
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

    // Verify unit exists and belongs to course
    const unit = await prisma.unit.findUnique({
      where: { 
        id: params.unitId,
        courseId: params.id 
      }
    });

    if (!unit) {
      return NextResponse.json({ error: 'Unit not found' }, { status: 404 });
    }

    const { lessonOrder } = await request.json();

    // Validate lessonOrder array
    if (!Array.isArray(lessonOrder) || lessonOrder.length === 0) {
      return NextResponse.json({ error: 'Invalid lesson order data' }, { status: 400 });
    }

    // Validate all lessons belong to the unit
    const lessonIds = lessonOrder.map(item => item.id);
    const existingLessons = await prisma.lesson.findMany({
      where: { 
        id: { in: lessonIds },
        unitId: params.unitId
      }
    });

    if (existingLessons.length !== lessonIds.length) {
      return NextResponse.json({ error: 'Some lessons do not belong to this unit' }, { status: 400 });
    }

    // Update lesson orders in a transaction
    await prisma.$transaction(async (tx) => {
      for (const item of lessonOrder) {
        await tx.lesson.update({
          where: { id: item.id },
          data: { order: item.order }
        });
      }
    });

    // Fetch updated lessons
    const updatedLessons = await prisma.lesson.findMany({
      where: { unitId: params.unitId },
      include: {
        lessonQuizzes: true
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(updatedLessons);

  } catch (error) {
    console.error('Error reordering lessons:', error);
    return NextResponse.json(
      { error: 'Failed to reorder lessons' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
