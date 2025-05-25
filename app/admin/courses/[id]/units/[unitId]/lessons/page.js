import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import LessonsClient from './LessonsClient';

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
          id: resolvedParams.unitId,
          courseId: resolvedParams.id 
        },
        include: {
          lessons: {
            orderBy: { order: 'asc' },
            select: {
              id: true,
              title: true,
              description: true,
              order: true,
              isPublished: true,
              duration: true,
              videoUrl: true,
              createdAt: true,
              updatedAt: true
            }
          }
        }
      })
    ]);

    if (!course || !unit) {
      notFound();
    }

    return (
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Lessons</h1>
            <p className="text-base-content/70 mt-1">
              Managing lessons for "{unit.title}" in "{course.title}"
            </p>
          </div>
          <div className="flex gap-3">
            <Link href={`/admin/courses/${course.id}/content`} className="btn btn-ghost gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
              Back to Course
            </Link>
            <Link href={`/admin/courses/${course.id}/units/${unit.id}/lessons/new`} className="btn btn-primary gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              New Lesson
            </Link>
          </div>
        </div>

        {/* Pass data to client component */}
        <LessonsClient course={course} unit={unit} />

        {/* Unit Info */}
        <div className="bg-base-100 rounded-box border border-base-300 shadow-xl p-6">
          <h3 className="font-semibold text-lg mb-4">Unit Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-base-content/70">Unit Title:</span>
              <p className="font-medium">{unit.title}</p>
            </div>
            <div>
              <span className="text-base-content/70">Total Lessons:</span>
              <p className="font-medium">{unit.lessons.length}</p>
            </div>
            <div>
              <span className="text-base-content/70">Published Lessons:</span>
              <p className="font-medium">{unit.lessons.filter(l => l.isPublished).length}</p>
            </div>
          </div>
        </div>
      </div>
    );

  } catch (error) {
    console.error('Error loading unit lessons:', error);
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-error mb-2">Error Loading Lessons</h1>
        <p className="text-base-content/70">Failed to load the lessons for this unit.</p>
        <Link href="/admin/courses" className="btn btn-primary mt-4">
          Back to Courses
        </Link>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}
