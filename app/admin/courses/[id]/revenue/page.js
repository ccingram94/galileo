import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import CourseRevenue from './CourseRevenue';

const prisma = new PrismaClient();

export default async function CourseRevenuePage({ params }) {
  try {
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        enrollments: {
          include: {
            user: true
          },
          orderBy: { enrolledAt: 'desc' }
        }
      }
    });

    if (!course) {
      notFound();
    }

    // Get payment transactions for this course
    const payments = await prisma.payment.findMany({
      where: {
        enrollment: {
          courseId: params.id
        }
      },
      include: {
        user: true,
        enrollment: {
          include: {
            course: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get refunds for this course
    const refunds = await prisma.refund.findMany({
      where: {
        payment: {
          enrollment: {
            courseId: params.id
          }
        }
      },
      include: {
        payment: {
          include: {
            user: true,
            enrollment: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get discount usage for this course
    const discountUsage = await prisma.discountUsage.findMany({
      where: {
        enrollment: {
          courseId: params.id
        }
      },
      include: {
        discount: true,
        enrollment: {
          include: {
            user: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return (
      <div className="space-y-6">
        <CourseRevenue 
          course={course} 
          payments={payments}
          refunds={refunds}
          discountUsage={discountUsage}
        />
      </div>
    );

  } catch (error) {
    console.error('Error loading course revenue:', error);
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-error mb-2">Error Loading Revenue</h1>
        <p className="text-base-content/70">Failed to load course revenue data.</p>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}
