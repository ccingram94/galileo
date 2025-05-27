import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'all';
    const sort = searchParams.get('sort') || 'recent';

    const userId = session.user.id;

    // Fetch user's enrollments with comprehensive course data
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            units: {
              include: {
                lessons: {
                  orderBy: { order: 'asc' }
                },
                unitExams: {
                  include: {
                    attempts: {
                      where: { userId },
                      orderBy: { startedAt: 'desc' }
                    }
                  },
                  orderBy: { order: 'asc' }
                }
              },
              orderBy: { order: 'asc' }
            }
          }
        }
      },
      orderBy: { enrolledAt: 'desc' }
    });

    // Process course data (similar to the page component)
    const coursesData = enrollments.map(enrollment => {
      const course = enrollment.course;
      const progress = enrollment.progress || {};
      
      // Calculate statistics
      const totalLessons = course.units.reduce((sum, unit) => sum + unit.lessons.length, 0);
      const completedLessons = course.units.reduce((sum, unit) => 
        sum + unit.lessons.filter(lesson => progress[`lesson_${lesson.id}`]?.completed).length, 0);
      
      const totalExams = course.units.reduce((sum, unit) => sum + unit.unitExams.length, 0);
      const completedExams = course.units.reduce((sum, unit) => 
        sum + unit.unitExams.filter(exam => 
          exam.attempts.some(attempt => attempt.completedAt)
        ).length, 0);
      
      const courseProgress = totalLessons + totalExams > 0 ? 
        Math.round(((completedLessons + completedExams) / (totalLessons + totalExams)) * 100) : 0;

      // Determine course status
      const totalUnits = course.units.length;
      const completedUnits = course.units.filter(unit => progress[`unit_${unit.id}`]?.completed).length;
      const startedUnits = course.units.filter(unit => progress[`unit_${unit.id}`]?.started).length;

      let courseStatus;
      if (completedUnits === totalUnits && totalUnits > 0) {
        courseStatus = { status: 'completed', label: 'Completed' };
      } else if (startedUnits > 0) {
        courseStatus = { status: 'in-progress', label: 'In Progress' };
      } else {
        courseStatus = { status: 'not-started', label: 'Not Started' };
      }

      return {
        id: course.id,
        title: course.title,
        description: course.description,
        apExamType: course.apExamType,
        enrolledAt: enrollment.enrolledAt,
        progress: courseProgress,
        status: courseStatus,
        stats: {
          totalUnits: course.units.length,
          completedUnits,
          totalLessons,
          completedLessons,
          totalExams,
          completedExams
        }
      };
    });

    // Filter courses
    let filteredCourses = coursesData;
    if (status !== 'all') {
      filteredCourses = coursesData.filter(course => course.status.status === status);
    }

    // Sort courses
    switch (sort) {
      case 'name':
        filteredCourses.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'progress':
        filteredCourses.sort((a, b) => b.progress - a.progress);
        break;
      case 'recent':
      default:
        filteredCourses.sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt));
        break;
    }

    return NextResponse.json({
      courses: filteredCourses,
      total: coursesData.length
    });

  } catch (error) {
    console.error('Error fetching student courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
