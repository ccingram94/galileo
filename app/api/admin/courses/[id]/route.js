import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        enrollments: {
          include: {
            user: true
          }
        },
        units: {
          include: {
            lessons: {
              include: {
                lessonQuizzes: true
              }
            },
            unitExams: true
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    return NextResponse.json(course);

  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

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

    const { title, description, apExamType, isFree, price, imageUrl, isPublished } = await request.json();

    // Check if course exists and get enrollment count
    const existingCourse = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        enrollments: true
      }
    });

    if (!existingCourse) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    const hasEnrollments = existingCourse.enrollments.length > 0;

    // Validation
    if (!title || !apExamType) {
      return NextResponse.json(
        { error: 'Title and AP Exam Type are required' },
        { status: 400 }
      );
    }

    // Don't allow pricing changes if there are enrollments
    const updateData = {
      title,
      description,
      apExamType,
      imageUrl,
      isPublished
    };

    if (!hasEnrollments) {
      updateData.isFree = isFree;
      updateData.price = isFree ? null : price;
    }

    const course = await prisma.course.update({
      where: { id: params.id },
      data: updateData
    });

    return NextResponse.json(course);

  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

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

    // Check if course has enrollments
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        enrollments: true
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (course.enrollments.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete course with active enrollments' },
        { status: 400 }
      );
    }

    await prisma.course.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Course deleted successfully' });

  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
