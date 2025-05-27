import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import QuizPreviewClient from './QuizPreviewClient';

const prisma = new PrismaClient();

export default async function QuizPreviewPage({ params }) {
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

    if (questions.length === 0) {
      return (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <Link 
              href={`/admin/courses/${course.id}/units/${unit.id}/lessons/${lesson.id}/quiz`}
              className="btn btn-ghost btn-sm gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Quiz
            </Link>
          </div>
          
          <div className="bg-base-100 rounded-box border border-base-300 shadow-xl p-12 text-center">
            <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">No Questions Available</h1>
            <p className="text-base-content/70 mb-6">This quiz doesn't have any questions to preview.</p>
            <Link 
              href={`/admin/courses/${course.id}/units/${unit.id}/lessons/${lesson.id}/quiz/edit`}
              className="btn btn-primary"
            >
              Add Questions
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-4xl mx-auto space-y-6">
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
                  <li>Preview</li>
                </ul>
              </div>
            </div>
            <h1 className="text-3xl font-bold">Quiz Preview</h1>
            <p className="text-base-content/70 mt-1">
              Preview how students will see this quiz
            </p>
          </div>

          <div className="flex gap-2">
            <Link 
              href={`/admin/courses/${course.id}/units/${unit.id}/lessons/${lesson.id}/quiz/edit`}
              className="btn btn-secondary btn-sm gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Quiz
            </Link>
          </div>
        </div>

        {/* Preview Notice */}
        <div className="bg-info/10 border border-info/20 rounded-box p-4">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-info shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-medium text-info">Preview Mode</h3>
              <p className="text-sm text-base-content/70">
                This is how students will see the quiz. Responses won't be saved.
              </p>
            </div>
          </div>
        </div>

        {/* Quiz Preview Component */}
        <QuizPreviewClient 
          quiz={quiz}
          questions={questions}
          lesson={lesson}
          course={course}
          unit={unit}
        />
      </div>
    );

  } catch (error) {
    console.error('Error loading quiz preview:', error);
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-error mb-2">Error Loading Preview</h1>
          <p className="text-base-content/70 mb-4">Failed to load the quiz preview.</p>
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
