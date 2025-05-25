import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import CourseSettingsForm from './CourseSettingsForm';

const prisma = new PrismaClient();

export default async function CourseSettingsPage({ params }) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        enrollments: {
          include: {
            user: true
          }
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

    // Get all published courses for prerequisites
    const allCourses = await prisma.course.findMany({
      where: {
        isPublished: true,
        id: { not: params.id } // Exclude current course
      },
      select: {
        id: true,
        title: true,
        apExamType: true
      }
    });

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <CourseSettingsForm course={course} availableCourses={allCourses} />
      </div>
    );

  } catch (error) {
    console.error('Error loading course settings:', error);
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-error mb-2">Error Loading Settings</h1>
        <p className="text-base-content/70">Failed to load course settings.</p>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}
