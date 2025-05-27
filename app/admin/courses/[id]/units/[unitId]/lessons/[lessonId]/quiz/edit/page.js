import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import QuizEditClient from './QuizEditClient';

const prisma = new PrismaClient();

export default async function QuizEditPage({ params }) {
  const resolvedParams = await params;
  
  try {
    // Fetch course, unit, lesson, and quiz data
    const [course, unit, lesson] = await Promise.all([
      prisma.course.findUnique({
        where: { id: resolvedParams.id },
        select: {
          id: true,
          title: true,
          apExamType: true,
          description: true
        }
      }),
      prisma.unit.findUnique({
        where: { 
          id: resolvedParams.unitId,
          courseId: resolvedParams.id
        },
        select: {
          id: true,
          title: true,
          description: true,
          order: true
        }
      }),
      prisma.lesson.findUnique({
        where: {
          id: resolvedParams.lessonId,
          unitId: resolvedParams.unitId
        },
        include: {
          lessonQuizzes: true
        }
      })
    ]);

    if (!course || !unit || !lesson || !lesson.lessonQuizzes) {
      notFound();
    }

    const quiz = lesson.lessonQuizzes;

    // Parse questions
    let questions = [];
    try {
      if (Array.isArray(quiz.questions)) {
        questions = quiz.questions;
      } else if (typeof quiz.questions === 'object' && quiz.questions) {
        questions = Object.values(quiz.questions).flat();
      }
    } catch (error) {
      console.error('Error parsing questions:', error);
    }

    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link 
                href={`/admin/courses/${course.id}/units/${unit.id}/lessons/${lesson.id}/quiz`}
                className="btn btn-ghost btn-sm gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Quiz
              </Link>
              <div className="text-sm breadcrumbs">
                <ul>
                  <li><span className="text-base-content/60">{course.title}</span></li>
                  <li><span className="text-base-content/60">{unit.title}</span></li>
                  <li><span className="text-base-content/60">{lesson.title}</span></li>
                  <li><span className="text-base-content/60">Quiz</span></li>
                  <li>Edit</li>
                </ul>
              </div>
            </div>
            <h1 className="text-3xl font-bold">Edit Quiz</h1>
            <p className="text-base-content/70 mt-1">
              Modify quiz settings and questions
            </p>
          </div>

          <div className="flex gap-2">
            <Link 
              href={`/admin/courses/${course.id}/units/${unit.id}/lessons/${lesson.id}/quiz/preview`}
              className="btn btn-ghost btn-sm gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </Link>
          </div>
        </div>

        {/* Edit Form */}
        <QuizEditClient 
          quiz={quiz}
          questions={questions}
          lesson={lesson}
          course={course}
          unit={unit}
        />
      </div>
    );

  } catch (error) {
    console.error('Error loading quiz edit page:', error);
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-error mb-2">Error Loading Quiz</h1>
          <p className="text-base-content/70 mb-4">Failed to load the quiz edit page.</p>
          <Link href={`/admin/courses/${resolvedParams.id}/units/${resolvedParams.unitId}/lessons/${resolvedParams.lessonId}/quiz`} className="btn btn-primary btn-sm">
            Return to Quiz
          </Link>
        </div>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}
