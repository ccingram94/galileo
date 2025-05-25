import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
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

    const courses = await prisma.course.findMany({
      include: {
        enrollments: true,
        units: {
          include: {
            lessons: true,
            unitExams: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(courses);

  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request) {
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

    const { title, description, apExamType, isFree, price, imageUrl } = await request.json();

    // Validation
    if (!title || !apExamType) {
      return NextResponse.json(
        { error: 'Title and AP Exam Type are required' },
        { status: 400 }
      );
    }

    if (!isFree && (!price || price <= 0)) {
      return NextResponse.json(
        { error: 'Price is required for paid courses' },
        { status: 400 }
      );
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        apExamType,
        isFree,
        price: isFree ? null : price,
        imageUrl
      }
    });

    return NextResponse.json(course, { status: 201 });

  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
