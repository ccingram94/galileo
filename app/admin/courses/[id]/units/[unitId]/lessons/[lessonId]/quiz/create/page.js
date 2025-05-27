import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import QuizForm from './QuizForm';

const prisma = new PrismaClient();

export default async function NewQuizPage({ params }) {
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
        }
      }),
      prisma.lesson.findUnique({
        where: {
          id: resolvedParams.lessonId,
          unitId: resolvedParams.unitId
        },
        include: {
          lessonQuizzes: true // Check if quiz already exists
        }
      })
    ]);

    if (!course || !unit || !lesson) {
      notFound();
    }

    // If quiz already exists, redirect to edit page
    if (lesson.lessonQuizzes) {
      return (
        <div className="max-w-4xl mx-auto py-12 text-center">
          <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-2">Quiz Already Exists</h1>
          <p className="text-base-content/70 mb-6">This lesson already has a quiz. You can edit the existing quiz instead.</p>
          <div className="flex gap-3 justify-center">
            <a 
              href={`/admin/courses/${course.id}/units/${unit.id}/lessons/${lesson.id}/quiz/edit`}
              className="btn btn-primary"
            >
              Edit Existing Quiz
            </a>
            <a 
              href={`/admin/courses/${course.id}/units/${unit.id}/lessons/${lesson.id}/quiz`}
              className="btn btn-ghost"
            >
              Back to Quiz
            </a>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <QuizForm course={course} unit={unit} lesson={lesson} />
      </div>
    );

  } catch (error) {
    console.error('Error loading new quiz page:', error);
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-error mb-2">Error Loading Page</h1>
        <p className="text-base-content/70">Failed to load the new quiz page.</p>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}
