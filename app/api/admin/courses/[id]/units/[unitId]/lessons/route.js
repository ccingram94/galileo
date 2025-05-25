import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/admin/courses/[id]/units/[unitId]/lessons - Get all lessons for a unit
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

    // Verify unit belongs to course
    const unit = await prisma.unit.findUnique({
      where: { 
        id: resolvedParams.unitId,
        courseId: resolvedParams.id 
      }
    });

    if (!unit) {
      return NextResponse.json({ error: 'Unit not found' }, { status: 404 });
    }

    const lessons = await prisma.lesson.findMany({
      where: { unitId: params.unitId },
      include: {
        lessonQuizzes: true
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(lessons);

  } catch (error) {
    console.error('Error fetching lessons:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// POST /api/admin/courses/[id]/units/[unitId]/lessons - Create a new lesson
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

    // Verify unit belongs to course
    const unit = await prisma.unit.findUnique({
      where: { 
        id: params.unitId,
        courseId: params.id 
      }
    });

    if (!unit) {
      return NextResponse.json({ error: 'Unit not found' }, { status: 404 });
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

    // Check if a lesson with the same order already exists
    const existingLesson = await prisma.lesson.findFirst({
      where: { 
        unitId: resolvedParams.unitId, 
        order: parseInt(order) 
      }
    });

    if (existingLesson) {
      // Shift existing lessons to make room
      await prisma.lesson.updateMany({
        where: {
          unitId: params.unitId,
          order: { gte: parseInt(order) }
        },
        data: {
          order: { increment: 1 }
        }
      });
    }

    const lesson = await prisma.lesson.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        content: content?.trim() || null,
        videoUrl: videoUrl?.trim() || null,
        duration: duration ? parseInt(duration) : null,
        order: parseInt(order),
        isPublished: Boolean(isPublished),
        unitId: resolvedParams.unitId
      },
      include: {
        lessonQuizzes: true
      }
    });

    return NextResponse.json(lesson, { status: 201 });

  } catch (error) {
    console.error('Error creating lesson:', error);
    return NextResponse.json(
      { error: 'Failed to create lesson' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
