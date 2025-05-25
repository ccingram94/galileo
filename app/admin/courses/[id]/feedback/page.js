import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import CourseFeedback from './CourseFeedback';

const prisma = new PrismaClient();

export default async function CourseFeedbackPage({ params }) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        enrollments: {
          include: {
            user: true
          }
        }
      }
    });

    if (!course) {
      notFound();
    }

    // Get course reviews/feedback
    const feedback = await prisma.courseFeedback.findMany({
      where: { courseId: params.id },
      include: {
        user: true,
        enrollment: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get survey responses if they exist
    const surveyResponses = await prisma.surveyResponse.findMany({
      where: {
        enrollment: {
          courseId: params.id
        }
      },
      include: {
        user: true,
        enrollment: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return (
      <div className="space-y-6">
        <CourseFeedback 
          course={course} 
          feedback={feedback}
          surveyResponses={surveyResponses}
        />
      </div>
    );

  } catch (error) {
    console.error('Error loading course feedback:', error);
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-error mb-2">Error Loading Feedback</h1>
        <p className="text-base-content/70">Failed to load course feedback.</p>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}
