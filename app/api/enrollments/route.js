import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId } = await request.json();

    // Check if course exists and is published
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        isPublished: true,
        isFree: true,
        title: true,
        price: true
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    if (!course.isPublished) {
      return NextResponse.json({ error: 'Course is not available for enrollment' }, { status: 400 });
    }

    // Check if user is already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: session.user.id,
          courseId: courseId
        }
      }
    });

    if (existingEnrollment) {
      return NextResponse.json({ error: 'Already enrolled in this course' }, { status: 400 });
    }

    // For free courses, create enrollment immediately
    if (course.isFree) {
      const enrollment = await prisma.enrollment.create({
        data: {
          userId: session.user.id,
          courseId: courseId,
          paymentStatus: 'PAID' // Free courses are considered "paid"
        }
      });

      return NextResponse.json({ 
        message: 'Successfully enrolled in course',
        enrollment 
      });
    } else {
      // For paid courses, this endpoint shouldn't be used directly
      // The frontend should redirect to checkout
      return NextResponse.json({ 
        error: 'Paid courses require payment processing',
        requiresPayment: true,
        courseId: courseId
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Enrollment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
