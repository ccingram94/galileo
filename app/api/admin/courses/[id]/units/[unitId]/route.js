import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/admin/courses/[id]/units/[unitId] - Get a specific unit
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

    const unit = await prisma.unit.findUnique({
      where: { 
        id: params.unitId,
        courseId: params.id 
      },
      include: {
        lessons: {
          orderBy: { order: 'asc' }
        },
        unitExams: true,
        course: true
      }
    });

    if (!unit) {
      return NextResponse.json({ error: 'Unit not found' }, { status: 404 });
    }

    return NextResponse.json(unit);

  } catch (error) {
    console.error('Error fetching unit:', error);
    return NextResponse.json(
      { error: 'Failed to fetch unit' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// PUT /api/admin/courses/[id]/units/[unitId] - Update a unit
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

    // Verify unit exists and belongs to the course
    const existingUnit = await prisma.unit.findUnique({
      where: { 
        id: params.unitId,
        courseId: params.id 
      }
    });

    if (!existingUnit) {
      return NextResponse.json({ error: 'Unit not found' }, { status: 404 });
    }

    const { title, description, order } = await request.json();

    // Validate required fields
    if (!title || title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (title.trim().length < 3) {
      return NextResponse.json({ error: 'Title must be at least 3 characters' }, { status: 400 });
    }

    // Handle order changes
    if (parseInt(order) !== existingUnit.order) {
      const newOrder = parseInt(order);
      const oldOrder = existingUnit.order;

      if (newOrder < oldOrder) {
        // Moving up: increment order of units between newOrder and oldOrder
        await prisma.unit.updateMany({
          where: {
            courseId: params.id,
            order: { gte: newOrder, lt: oldOrder }
          },
          data: {
            order: { increment: 1 }
          }
        });
      } else {
        // Moving down: decrement order of units between oldOrder and newOrder
        await prisma.unit.updateMany({
          where: {
            courseId: params.id,
            order: { gt: oldOrder, lte: newOrder }
          },
          data: {
            order: { decrement: 1 }
          }
        });
      }
    }

    const unit = await prisma.unit.update({
      where: { id: params.unitId },
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        order: parseInt(order),
        updatedAt: new Date()
      },
      include: {
        lessons: {
          orderBy: { order: 'asc' }
        },
        unitExams: true
      }
    });

    return NextResponse.json(unit);

  } catch (error) {
    console.error('Error updating unit:', error);
    return NextResponse.json(
      { error: 'Failed to update unit' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE /api/admin/courses/[id]/units/[unitId] - Delete a unit
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

    // Verify unit exists and belongs to the course
    const existingUnit = await prisma.unit.findUnique({
      where: { 
        id: params.unitId,
        courseId: params.id 
      },
      include: {
        lessons: true,
        unitExams: true
      }
    });

    if (!existingUnit) {
      return NextResponse.json({ error: 'Unit not found' }, { status: 404 });
    }

    // Delete all related data in the correct order
    await prisma.$transaction(async (tx) => {
      // Delete lesson quizzes first
      await tx.lessonQuiz.deleteMany({
        where: {
          lesson: {
            unitId: params.unitId
          }
        }
      });

      // Delete lessons
      await tx.lesson.deleteMany({
        where: { unitId: params.unitId }
      });

      // Delete unit exams
      await tx.unitExam.deleteMany({
        where: { unitId: params.unitId }
      });

      // Delete the unit itself
      await tx.unit.delete({
        where: { id: params.unitId }
      });

      // Reorder remaining units to fill the gap
      await tx.unit.updateMany({
        where: {
          courseId: params.id,
          order: { gt: existingUnit.order }
        },
        data: {
          order: { decrement: 1 }
        }
      });
    });

    return NextResponse.json({ message: 'Unit deleted successfully' });

  } catch (error) {
    console.error('Error deleting unit:', error);
    return NextResponse.json(
      { error: 'Failed to delete unit' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
