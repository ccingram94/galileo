import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import UnitForm from './UnitForm';

const prisma = new PrismaClient();

export default async function NewUnitPage({ params }) {
  const resolvedParams = await params;
  try {
    const course = await prisma.course.findUnique({
      where: { id: resolvedParams.id },
      include: {
        units: {
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!course) {
      notFound();
    }

    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <UnitForm course={course} />
      </div>
    );

  } catch (error) {
    console.error('Error loading new unit page:', error);
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-error mb-2">Error Loading Page</h1>
        <p className="text-base-content/70">Failed to load the new unit page.</p>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}
