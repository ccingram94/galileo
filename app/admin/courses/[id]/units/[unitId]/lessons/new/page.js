import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import LessonForm from './LessonForm';

const prisma = new PrismaClient();

export default async function NewLessonPage({ params }) {
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
            orderBy: { order: 'asc' }
          }
        }
      })
    ]);

    if (!course || !unit) {
      notFound();
    }

    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <LessonForm course={course} unit={unit} />
      </div>
    );

  } catch (error) {
    console.error('Error loading new lesson page:', error);
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-error mb-2">Error Loading Page</h1>
        <p className="text-base-content/70">Failed to load the new lesson page.</p>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}
