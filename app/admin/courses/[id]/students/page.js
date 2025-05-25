import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import CourseStudents from './CourseStudents';

const prisma = new PrismaClient();

export default async function CourseStudentsPage({ params }) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        enrollments: {
          include: {
            user: {
              include: {
                quizAttempts: {
                  include: {
                    lessonQuiz: {
                      include: {
                        lesson: {
                          include: {
                            unit: true
                          }
                        }
                      }
                    }
                  },
                  where: {
                    lessonQuiz: {
                      lesson: {
                        unit: {
                          courseId: params.id
                        }
                      }
                    }
                  }
                },
                examAttempts: {
                  include: {
                    unitExam: {
                      include: {
                        unit: true
                      }
                    }
                  },
                  where: {
                    unitExam: {
                      unit: {
                        courseId: params.id
                      }
                    }
                  }
                }
              }
            }
          },
          orderBy: { enrolledAt: 'desc' }
        },
        units: {
          include: {
            lessons: true
          }
        }
      }
    });

    if (!course) {
      notFound();
    }

    return (
      <div className="space-y-6">
        <CourseStudents course={course} />
      </div>
    );

  } catch (error) {
    console.error('Error loading course students:', error);
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-error mb-2">Error Loading Students</h1>
        <p className="text-base-content/70">Failed to load course students.</p>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}
