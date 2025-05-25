import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import EditUnitForm from './EditUnitForm';

const prisma = new PrismaClient();

export default async function EditUnitPage({ params }) {
  try {
    const [course, unit] = await Promise.all([
      prisma.course.findUnique({
        where: { id: params.id },
        include: {
          units: {
            orderBy: { order: 'asc' }
          }
        }
      }),
      prisma.unit.findUnique({
        where: { 
          id: params.unitId,
          courseId: params.id 
        },
        include: {
          lessons: {
            orderBy: { order: 'asc' }
          },
          unitExams: true
        }
      })
    ]);

    if (!course || !unit) {
      notFound();
    }

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <EditUnitForm course={course} unit={unit} />
      </div>
    );

  } catch (error) {
    console.error('Error loading edit unit page:', error);
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-error mb-2">Error Loading Unit</h1>
        <p className="text-base-content/70">Failed to load unit for editing.</p>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}
