import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT /api/admin/courses/[id]/units/reorder - Reorder units
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

    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: params.id }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const { unitOrder } = await request.json();

    // Validate unitOrder array
    if (!Array.isArray(unitOrder) || unitOrder.length === 0) {
      return NextResponse.json({ error: 'Invalid unit order data' }, { status: 400 });
    }

    // Validate all units belong to the course
    const unitIds = unitOrder.map(item => item.id);
    const existingUnits = await prisma.unit.findMany({
      where: { 
        id: { in: unitIds },
        courseId: params.id
      }
    });

    if (existingUnits.length !== unitIds.length) {
      return NextResponse.json({ error: 'Some units do not belong to this course' }, { status: 400 });
    }

    // Update unit orders in a transaction
    await prisma.$transaction(async (tx) => {
      for (const item of unitOrder) {
        await tx.unit.update({
          where: { id: item.id },
          data: { order: item.order }
        });
      }
    });

    // Fetch updated units
    const updatedUnits = await prisma.unit.findMany({
      where: { courseId: params.id },
      include: {
        lessons: {
          orderBy: { order: 'asc' }
        },
        unitExams: true
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(updatedUnits);

  } catch (error) {
    console.error('Error reordering units:', error);
    return NextResponse.json(
      { error: 'Failed to reorder units' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
