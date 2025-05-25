import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import LessonsManager from './LessonsManager';

const prisma = new PrismaClient();

export default async function LessonsPage({ params }) {
    const resolvedParams = await params;
  try {
    const [course, unit] = await Promise.all([
      prisma.course.findUnique({
        where: { id: resolvedParams.id }
      }),
      prisma.unit.findUnique({
        where: { 
          id: resolvedParams.id,
          courseId: resolvedParams.id 
        },
        include: {
          lessons: {
            include: {
              lessonQuizzes: true
            },
            orderBy: { order: 'asc' }
          }
        }
      })
    ]);

    if (!course || !unit) {
      notFound();
    }

    return (
      <div className="space-y-6">
        <LessonsManager course={course} unit={unit} />
      </div>
    );

  } catch (error) {
    console.error('Error loading unit lessons:', error);
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-error mb-2">Error Loading Lessons</h1>
        <p className="text-base-content/70">Failed to load unit lessons.</p>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}
