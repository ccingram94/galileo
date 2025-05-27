import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to determine exam status (same as above)
function getExamStatus(exam, userAttempts) {
  const now = new Date();
  const completedAttempts = userAttempts?.filter(attempt => attempt.completedAt) || [];
  const incompleteAttempts = userAttempts?.filter(attempt => !attempt.completedAt) || [];

  const isAvailable = exam.isPublished &&
    (!exam.availableFrom || new Date(exam.availableFrom) <= now) &&
    (!exam.availableUntil || new Date(exam.availableUntil) > now);

  if (!isAvailable) {
    if (exam.availableFrom && new Date(exam.availableFrom) > now) {
      return { status: 'upcoming', label: 'Upcoming', color: 'badge-info', canTake: false };
    }
    if (exam.availableUntil && new Date(exam.availableUntil) <= now) {
      return { status: 'expired', label: 'Expired', color: 'badge-error', canTake: false };
    }
    return { status: 'unavailable', label: 'Not Available', color: 'badge-neutral', canTake: false };
  }

  if (incompleteAttempts.length > 0) {
    return { 
      status: 'in-progress', 
      label: 'In Progress', 
      color: 'badge-warning',
      canTake: true,
      continueAttemptId: incompleteAttempts[0].id
    };
  }

  if (completedAttempts.length > 0) {
    const bestAttempt = completedAttempts.reduce((best, current) => 
      (current.score || 0) > (best.score || 0) ? current : best
    );
    
    if (bestAttempt.passed) {
      return { 
        status: 'passed', 
        label: 'Passed', 
        color: 'badge-success',
        canTake: completedAttempts.length < exam.maxAttempts,
        bestScore: bestAttempt.score
      };
    } else {
      if (completedAttempts.length >= exam.maxAttempts) {
        return { 
          status: 'failed', 
          label: 'Failed', 
          color: 'badge-error',
          canTake: false,
          bestScore: bestAttempt.score
        };
      } else {
        return { 
          status: 'retake', 
          label: 'Retake Available', 
          color: 'badge-warning',
          canTake: true,
          bestScore: bestAttempt.score
        };
      }
    }
  }

  return { 
    status: 'available', 
    label: 'Available', 
    color: 'badge-primary',
    canTake: true
  };
}

export async function GET(request, { params }) {
  try {
    const resolvedParams = await params;
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId } = resolvedParams;
    const userId = session.user.id;

    // Verify user enrollment and fetch course data
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
        courseId
      },
      include: {
        course: {
          include: {
            units: {
              include: {
                lessons: {
                  orderBy: { order: 'asc' }
                },
                unitExams: {
                  include: {
                    attempts: {
                      where: { userId },
                      orderBy: { startedAt: 'desc' }
                    }
                  },
                  orderBy: { order: 'asc' }
                }
              },
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    });

    if (!enrollment) {
      return NextResponse.json({ error: 'Course not found or not enrolled' }, { status: 404 });
    }

    const course = enrollment.course;
    const progress = enrollment.progress || {};

    // Process all exams
    const allExams = [];
    const unitData = [];

    course.units.forEach(unit => {
      // Calculate unit completion
      const lessons = unit.lessons || [];
      const exams = unit.unitExams || [];
      
      const completedLessons = lessons.filter(lesson => 
        progress[`lesson_${lesson.id}`]?.completed
      ).length;
      
      const completedExams = exams.filter(exam =>
        exam.attempts?.some(attempt => attempt.completedAt)
      ).length;

      const totalItems = lessons.length + exams.length;
      const completedItems = completedLessons + completedExams;

      const unitCompletion = {
        percentage: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0,
        completedLessons,
        totalLessons: lessons.length,
        completedExams,
        totalExams: exams.length
      };

      const unitExams = unit.unitExams.map(exam => {
        const examStatus = getExamStatus(exam, exam.attempts);
        
        const completedAttempts = exam.attempts.filter(a => a.completedAt);
        const bestAttempt = completedAttempts.length > 0 ? 
          completedAttempts.reduce((best, current) => 
            (current.score || 0) > (best.score || 0) ? current : best
          ) : null;

        const examData = {
          id: exam.id,
          title: exam.title,
          description: exam.description,
          order: exam.order,
          timeLimit: exam.timeLimit,
          maxAttempts: exam.maxAttempts,
          passingScore: exam.passingScore,
          availableFrom: exam.availableFrom,
          availableUntil: exam.availableUntil,
          isPublished: exam.isPublished,
          status: examStatus,
          attempts: {
            completed: completedAttempts.length,
            total: exam.attempts.length,
            remaining: Math.max(0, exam.maxAttempts - completedAttempts.length)
          },
          bestScore: bestAttempt?.score || null,
          bestAttemptId: bestAttempt?.id || null,
          lastAttempt: exam.attempts[0]?.startedAt || null,
          passed: bestAttempt?.passed || false,
          unitId: unit.id,
          unitTitle: unit.title
        };

        allExams.push(examData);
        return examData;
      });

      unitData.push({
        id: unit.id,
        title: unit.title,
        order: unit.order,
        description: unit.description,
        completion: unitCompletion,
        exams: unitExams,
        hasAvailableExams: unitExams.some(exam => exam.status.canTake && exam.status.status === 'available'),
        hasInProgressExams: unitExams.some(exam => exam.status.status === 'in-progress')
      });
    });

    // Calculate course statistics
    const stats = {
      totalExams: allExams.length,
      availableExams: allExams.filter(exam => exam.status.canTake && exam.status.status === 'available').length,
      inProgressExams: allExams.filter(exam => exam.status.status === 'in-progress').length,
      completedExams: allExams.filter(exam => ['passed', 'failed'].includes(exam.status.status)).length,
      passedExams: allExams.filter(exam => exam.status.status === 'passed').length,
      retakeAvailable: allExams.filter(exam => exam.status.status === 'retake').length,
      upcomingExams: allExams.filter(exam => exam.status.status === 'upcoming').length,
      averageScore: allExams.filter(exam => exam.bestScore !== null).length > 0 ?
        Math.round(allExams.filter(exam => exam.bestScore !== null)
          .reduce((sum, exam) => sum + exam.bestScore, 0) / 
          allExams.filter(exam => exam.bestScore !== null).length) : 0,
      passRate: allExams.filter(exam => ['passed', 'failed'].includes(exam.status.status)).length > 0 ?
        Math.round((allExams.filter(exam => exam.status.status === 'passed').length / 
          allExams.filter(exam => ['passed', 'failed'].includes(exam.status.status)).length) * 100) : 0
    };

    return NextResponse.json({
      course: {
        id: course.id,
        title: course.title,
        description: course.description,
        apExamType: course.apExamType
      },
      units: unitData,
      exams: allExams,
      stats
    });

  } catch (error) {
    console.error('Error fetching course exams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course exams' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
