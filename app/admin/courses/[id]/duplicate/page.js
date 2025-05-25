import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import CourseDuplicateForm from './CourseDuplicateForm';

const prisma = new PrismaClient();

export default async function CourseDuplicatePage({ params }) {
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
        }
      }
    });

    if (!course) {
      notFound();
    }

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <CourseDuplicateForm course={course} />
      </div>
    );

  } catch (error) {
    console.error('Error loading course for duplication:', error);
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-error mb-2">Error Loading Course</h1>
        <p className="text-base-content/70">Failed to load course for duplication.</p>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}
