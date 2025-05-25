import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request, { params }) {
  // ✅ Await params before using its properties
  const resolvedParams = await params;
  
  try {
    const body = await request.json();
    const { title, description, content, videoUrl, duration, order, isPublished } = body;

    // Validate required fields
    if (!title?.trim()) {
      return NextResponse.json(
        { error: 'Lesson title is required' },
        { status: 400 }
      );
    }

    // Verify the unit exists and belongs to the course
    const unit = await prisma.unit.findUnique({
      where: { 
        id: resolvedParams.unitId,    // ✅ Use resolvedParams
        courseId: resolvedParams.id   // ✅ Use resolvedParams
      }
    });

    if (!unit) {
      return NextResponse.json(
        { error: 'Unit not found' },
        { status: 404 }
      );
    }

    // Check if a lesson with this order already exists
    const existingLesson = await prisma.lesson.findFirst({
      where: { 
        unitId: resolvedParams.unitId,  // ✅ Use resolvedParams
        order: parseInt(order) 
      }
    });

    // If lesson exists at this order, shift other lessons
    if (existingLesson) {
      await prisma.lesson.updateMany({
        where: {
          unitId: resolvedParams.unitId,  // ✅ Use resolvedParams
          order: {
            gte: parseInt(order)
          }
        },
        data: {
          order: {
            increment: 1
          }
        }
      });
    }

    // Create the lesson
    const lesson = await prisma.lesson.create({
      data: {
        title: title.trim(),
        description: description?.trim() || null,
        content: content || null,
        videoUrl: videoUrl?.trim() || null,
        duration: duration ? parseInt(duration) : null,
        order: parseInt(order),
        isPublished: Boolean(isPublished),
        unitId: resolvedParams.unitId,  // ✅ Use resolvedParams
        // Add any other fields your Lesson model requires
      },
      include: {
        unit: {
          select: {
            id: true,
            title: true,
            course: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(lesson, { status: 201 });

  } catch (error) {
    console.error('Error creating lesson:', error);
    
    // Handle Prisma validation errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A lesson with this title already exists in this unit' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create lesson' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Optional: Add GET method if you need to fetch lessons
export async function GET(request, { params }) {
  const resolvedParams = await params;
  
  try {
    const lessons = await prisma.lesson.findMany({
      where: {
        unitId: resolvedParams.unitId,
        unit: {
          courseId: resolvedParams.id
        }
      },
      orderBy: {
        order: 'asc'
      },
      include: {
        unit: {
          select: {
            id: true,
            title: true
          }
        }
      }
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
