import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import StudentCourseView from './StudentCourseView';

const prisma = new PrismaClient();

export default async function CoursePreviewPage({ params }) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        units: {
          include: {
            lessons: {
              include: {
                lessonQuizzes: true
              },
              orderBy: { order: 'asc' }
            },
            unitExams: true
          },
          orderBy: { order: 'asc' }
        },
        enrollments: true
      }
    });

    if (!course) {
      notFound();
    }

    return (
      <div className="space-y-6">
        <StudentCourseView course={course} />
      </div>
    );

  } catch (error) {
    console.error('Error loading course preview:', error);
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-error mb-2">Error Loading Preview</h1>
        <p className="text-base-content/70">Failed to load course preview.</p>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}
