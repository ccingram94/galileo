import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import CourseEditForm from './CourseEditForm';

const prisma = new PrismaClient();

const AP_EXAM_TYPES = [
  'AP-CALCULUS-AB',
  'AP-CALCULUS-BC',
  'AP-PHYSICS-1',
  'AP-PHYSICS-2',
  'AP-PHYSICS-C-MECHANICS',
  'AP-PHYSICS-C-ELECTRICITY',
  'AP-CHEMISTRY',
  'AP-BIOLOGY',
  'AP-STATISTICS',
  'AP-COMPUTER-SCIENCE-A'
];

export default async function CourseEditPage({ params }) {
  const resolvedParams = await params;
  try {
    const course = await prisma.course.findUnique({
      where: { id: resolvedParams.id },
      include: {
        enrollments: true,
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

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <CourseEditForm 
          course={course} 
          apExamTypes={AP_EXAM_TYPES}
        />
      </div>
    );

  } catch (error) {
    console.error('Error loading course:', error);
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-error mb-2">Error Loading Course</h1>
        <p className="text-base-content/70">Failed to load course details.</p>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}
