import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    const userId = session.user.id;

    let whereClause = { userId };
    if (courseId) {
      whereClause.courseId = courseId;
    }

    // Fetch user's enrollments with detailed progress
    const enrollments = await prisma.enrollment.findMany({
      where: whereClause,
      include: {
        course: {
          include: {
            units: {
              include: {
                lessons: true,
                unitExams: {
                  include: {
                    attempts: {
                      where: { userId },
                      orderBy: { startedAt: 'desc' }
                    }
                  }
                }
              },
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    });

    const progressData = enrollments.map(enrollment => {
      const course = enrollment.course;
      const progress = enrollment.progress || {};

      const units = course.units.map(unit => {
        const unitProgress = progress[`unit_${unit.id}`];
        
        const lessons = unit.lessons.map(lesson => ({
          id: lesson.id,
          title: lesson.title,
          order: lesson.order,
          completed: progress[`lesson_${lesson.id}`]?.completed || false,
          completedAt: progress[`lesson_${lesson.id}`]?.completedAt || null
        }));

        const exams = unit.unitExams.map(exam => {
          const attempts = exam.attempts;
          const completedAttempts = attempts.filter(a => a.completedAt);
          const bestAttempt = completedAttempts.length > 0 ? 
            completedAttempts.reduce((best, current) => 
              (current.score || 0) > (best.score || 0) ? current : best
            ) : null;

          return {
            id: exam.id,
            title: exam.title,
            order: exam.order,
            completed: completedAttempts.length > 0,
            bestScore: bestAttempt?.score || null,
            passed: bestAttempt?.passed || false,
            attempts: completedAttempts.length,
            maxAttempts: exam.maxAttempts
          };
        });

        const totalItems = lessons.length + exams.length;
        const completedItems = lessons.filter(l => l.completed).length + 
                              exams.filter(e => e.completed).length;

        return {
          id: unit.id,
          title: unit.title,
          order: unit.order,
          started: unitProgress?.started || false,
          completed: unitProgress?.completed || false,
          progress: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0,
          lessons,
          exams
        };
      });

      const totalUnits = units.length;
      const completedUnits = units.filter(u => u.completed).length;

      return {
        courseId: course.id,
        courseTitle: course.title,
        enrolledAt: enrollment.enrolledAt,
        overallProgress: totalUnits > 0 ? Math.round((completedUnits / totalUnits) * 100) : 0,
        units
      };
    });

    return NextResponse.json({
      progress: courseId ? progressData[0] || null : progressData
    });

  } catch (error) {
    console.error('Error fetching progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress data' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Update progress
export async function PATCH(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { courseId, unitId, lessonId, type, completed } = body;

    const userId = session.user.id;

    // Find the enrollment
    const enrollment = await prisma.enrollment.findFirst({
      where: { userId, courseId }
    });

    if (!enrollment) {
      return NextResponse.json({ error: 'Enrollment not found' }, { status: 404 });
    }

    const progress = enrollment.progress || {};

    // Update progress based on type
    if (type === 'lesson' && lessonId) {
      progress[`lesson_${lessonId}`] = {
        completed,
        completedAt: completed ? new Date().toISOString() : null
      };
    } else if (type === 'unit' && unitId) {
      progress[`unit_${unitId}`] = {
        started: true,
        completed,
        completedAt: completed ? new Date().toISOString() : null
      };
    }

    // Update the enrollment
    await prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { progress }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating progress:', error);
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
