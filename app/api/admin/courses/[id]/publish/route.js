import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await params before using its properties
    const resolvedParams = await params;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { isPublished } = await request.json();

    const course = await prisma.course.findUnique({
      where: { id: resolvedParams.id }, // Use resolvedParams.id instead of params.id
      include: {
        units: {
          include: {
            lessons: true
          }
        }
      }
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Don't allow publishing if course has no content
    if (isPublished && course.units.length === 0) {
      return NextResponse.json(
        { error: 'Cannot publish course without content' },
        { status: 400 }
      );
    }

    const updatedCourse = await prisma.course.update({
      where: { id: resolvedParams.id }, // Use resolvedParams.id instead of params.id
      data: { isPublished }
    });

    return NextResponse.json(updatedCourse);

  } catch (error) {
    console.error('Error updating publish status:', error);
    return NextResponse.json(
      { error: 'Failed to update publish status' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
