import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import UnitsManager from './UnitsManager';

const prisma = new PrismaClient();

export default async function UnitsPage({ params }) {
  const resolvedParams = await params;
  try {
    const course = await prisma.course.findUnique({
      where: { id: resolvedParams.id },
      include: {
        units: {
          include: {
            lessons: {
              orderBy: { order: 'asc' }
            },
            unitExams: true
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!course) {
      notFound();
    }

    return (
      <div className="space-y-6">
        <UnitsManager course={course} />
      </div>
    );

  } catch (error) {
    console.error('Error loading course units:', error);
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-error mb-2">Error Loading Units</h1>
        <p className="text-base-content/70">Failed to load course units.</p>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}
