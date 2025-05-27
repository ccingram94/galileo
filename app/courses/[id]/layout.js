import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  
  try {
    const course = await prisma.course.findUnique({
      where: { id: resolvedParams.id },
      select: {
        title: true,
        description: true,
        imageUrl: true,
        apExamType: true
      }
    });

    if (!course) {
      return {
        title: 'Course Not Found',
        description: 'The requested course could not be found.'
      };
    }

    return {
      title: `${course.title} | Galileo Learning`,
      description: course.description || `Learn ${course.apExamType} with comprehensive curriculum and expert instruction.`,
      openGraph: {
        title: course.title,
        description: course.description,
        images: course.imageUrl ? [course.imageUrl] : undefined,
      },
    };
  } catch (error) {
    return {
      title: 'Course | Galileo Learning',
      description: 'Comprehensive courses for academic success'
    };
  } finally {
    await prisma.$disconnect();
  }
}

export default function CourseLayout({ children }) {
  return children;
}
