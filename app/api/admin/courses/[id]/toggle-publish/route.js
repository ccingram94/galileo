import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function PATCH(request, { params }) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });
    
    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { isPublished } = await request.json();

    const updatedCourse = await prisma.course.update({
      where: { id: params.id },
      data: { 
        isPublished,
        updatedAt: new Date()
      }
    });

    return NextResponse.json({ 
      message: 'Course status updated successfully', 
      course: updatedCourse 
    });

  } catch (error) {
    console.error('Error updating course status:', error);
    return NextResponse.json(
      { error: 'Failed to update course status' }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
