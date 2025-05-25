import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import LessonEditForm from './LessonEditForm';

const prisma = new PrismaClient();

export default async function EditLessonPage({ params }) {
  const resolvedParams = await params;
  
  try {
    const [course, unit, lesson] = await Promise.all([
      prisma.course.findUnique({
        where: { id: resolvedParams.id }
      }),
      prisma.unit.findUnique({
        where: { 
          id: resolvedParams.unitId,
          courseId: resolvedParams.id 
        },
        include: {
          lessons: {
            orderBy: { order: 'asc' }
          }
        }
      }),
      prisma.lesson.findUnique({
        where: {
          id: resolvedParams.lessonId,
          unitId: resolvedParams.unitId
        }
      })
    ]);

    if (!course || !unit || !lesson) {
      notFound();
    }

    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <LessonEditForm course={course} unit={unit} lesson={lesson} />
      </div>
    );

  } catch (error) {
    console.error('Error loading edit lesson page:', error);
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-error mb-2">Error Loading Page</h1>
        <p className="text-base-content/70">Failed to load the lesson edit page.</p>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}
