import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/admin/courses/[id]/units - Get all units for a course
export async function GET(request, { params }) {
  const resolvedParams = await params;
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

    const units = await prisma.unit.findMany({
      where: { courseId: params.id },
      include: {
        lessons: {
          orderBy: { order: 'asc' }
        },
        unitExams: true
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(units);

  } catch (error) {
    console.error('Error fetching units:', error);
    return NextResponse.json(
      { error: 'Failed to fetch units' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/admin/courses/[id]/units - Create a new unit
export async function POST(request, { params }) {
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
      where: { id: resolvedParams.id  }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const { title, description, order } = await request.json();

    // Validate required fields
    if (!title || title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (title.trim().length < 3) {
      return NextResponse.json({ error: 'Title must be at least 3 characters' }, { status: 400 });
    }

    // Check if a unit with the same order already exists
    const existingUnit = await prisma.unit.findFirst({
      where: { 
        courseId: resolvedParams.id , 
        order: parseInt(order) 
      }
    });

    if (existingUnit) {
      // Shift existing units to make room
      await prisma.unit.updateMany({
        where: {
          courseId: params.id,
          order: { gte: parseInt(order) }
        },
        data: {
          order: { increment: 1 }
        }
      });
    }

    const unit = await prisma.unit.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        order: parseInt(order),
        courseId: resolvedParams.id
      },
      include: {
        lessons: {
          orderBy: { order: 'asc' }
        },
        unitExams: true
      }
    });

    return NextResponse.json(unit, { status: 201 });

  } catch (error) {
    console.error('Error creating unit:', error);
    return NextResponse.json(
      { error: 'Failed to create unit' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
