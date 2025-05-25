import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import CourseAnalytics from './CourseAnalytics';

const prisma = new PrismaClient();

export default async function CourseAnalyticsPage({ params }) {
  try {
    // Get course with comprehensive data for analytics
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
                lessonQuizzes: {
                  include: {
                    attempts: {
                      include: {
                        user: true
                      }
                    }
                  }
                }
              }
            },
            unitExams: {
              include: {
                attempts: {
                  include: {
                    user: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!course) {
      notFound();
    }

    // Calculate date ranges for analytics
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // Get additional analytics data
    const recentEnrollments = await prisma.enrollment.findMany({
      where: {
        courseId: params.id,
        enrolledAt: {
          gte: thirtyDaysAgo
        }
      },
      include: {
        user: true
      },
      orderBy: { enrolledAt: 'desc' }
    });

    const completedEnrollments = await prisma.enrollment.findMany({
      where: {
        courseId: params.id,
        completedAt: {
          not: null
        }
      },
      include: {
        user: true
      }
    });

    return (
      <div className="space-y-6">
        <CourseAnalytics 
          course={course}
          recentEnrollments={recentEnrollments}
          completedEnrollments={completedEnrollments}
        />
      </div>
    );

  } catch (error) {
    console.error('Error loading course analytics:', error);
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-error mb-2">Error Loading Analytics</h1>
        <p className="text-base-content/70">Failed to load course analytics.</p>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}
