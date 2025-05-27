import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to determine exam status
function getExamStatus(exam, userAttempts) {
  const now = new Date();
  const completedAttempts = userAttempts?.filter(attempt => attempt.completedAt) || [];
  const incompleteAttempts = userAttempts?.filter(attempt => !attempt.completedAt) || [];

  // Check if exam is available
  const isAvailable = exam.isPublished &&
    (!exam.availableFrom || new Date(exam.availableFrom) <= now) &&
    (!exam.availableUntil || new Date(exam.availableUntil) > now);

  if (!isAvailable) {
    if (exam.availableFrom && new Date(exam.availableFrom) > now) {
      return { status: 'upcoming', label: 'Upcoming', color: 'badge-info' };
    }
    if (exam.availableUntil && new Date(exam.availableUntil) <= now) {
      return { status: 'expired', label: 'Expired', color: 'badge-error' };
    }
    return { status: 'unavailable', label: 'Not Available', color: 'badge-neutral' };
  }

  if (incompleteAttempts.length > 0) {
    return { status: 'in-progress', label: 'In Progress', color: 'badge-warning' };
  }

  if (completedAttempts.length > 0) {
    const bestAttempt = completedAttempts.reduce((best, current) => 
      (current.score || 0) > (best.score || 0) ? current : best
    );
    
    if (bestAttempt.passed) {
      return { status: 'passed', label: 'Passed', color: 'badge-success' };
    } else {
      if (completedAttempts.length >= exam.maxAttempts) {
        return { status: 'failed', label: 'Failed', color: 'badge-error' };
      } else {
        return { status: 'retake', label: 'Retake Available', color: 'badge-warning' };
      }
    }
  }

  return { status: 'available', label: 'Available', color: 'badge-primary' };
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status') || 'all';
    const courseFilter = searchParams.get('course') || 'all';

    const userId = session.user.id;

    // Fetch user's enrollments with exams and attempts
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            units: {
              include: {
                unitExams: {
                  include: {
                    attempts: {
                      where: { userId },
                      orderBy: { startedAt: 'desc' }
                    }
                  }
                }
              },
              orderBy: { order: 'asc' }
            }
          }
        }
      },
      orderBy: { enrolledAt: 'desc' }
    });

    // Process all exams
    const allExams = [];

    enrollments.forEach(enrollment => {
      const course = enrollment.course;

      course.units.forEach(unit => {
        unit.unitExams.forEach(exam => {
          const examStatus = getExamStatus(exam, exam.attempts);

          const completedAttempts = exam.attempts.filter(a => a.completedAt);
          const bestAttempt = completedAttempts.length > 0 ? 
            completedAttempts.reduce((best, current) => 
              (current.score || 0) > (best.score || 0) ? current : best
            ) : null;

          allExams.push({
            id: exam.id,
            title: exam.title,
            courseTitle: course.title,
            courseId: course.id,
            unitTitle: unit.title,
            unitId: unit.id,
            description: exam.description,
            timeLimit: exam.timeLimit,
            maxAttempts: exam.maxAttempts,
            passingScore: exam.passingScore,
            availableFrom: exam.availableFrom,
            availableUntil: exam.availableUntil,
            isAPExam: course.apExamType === 'AP-PRECALCULUS',
            status: examStatus,
            attempts: {
              completed: completedAttempts.length,
              total: exam.attempts.length,
              max: exam.maxAttempts,
              remaining: Math.max(0, exam.maxAttempts - completedAttempts.length)
            },
            bestScore: bestAttempt?.score || 0,
            lastAttempt: exam.attempts[0]?.startedAt || null,
            passed: bestAttempt?.passed || false,
            bestAttemptId: bestAttempt?.id || null
          });
        });
      });
    });

    // Filter exams
    let filteredExams = allExams;

    if (statusFilter !== 'all') {
      filteredExams = filteredExams.filter(exam => exam.status.status === statusFilter);
    }

    if (courseFilter !== 'all') {
      filteredExams = filteredExams.filter(exam => exam.courseId === courseFilter);
    }

    // Sort exams by priority
    const statusPriority = {
      'in-progress': 1,
      'available': 2,
      'retake': 3,
      'upcoming': 4,
      'passed': 5,
      'failed': 6,
      'expired': 7,
      'unavailable': 8
    };

    filteredExams.sort((a, b) => {
      const priorityDiff = statusPriority[a.status.status] - statusPriority[b.status.status];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Secondary sort by due date (if available)
      if (a.availableUntil && b.availableUntil) {
        return new Date(a.availableUntil) - new Date(b.availableUntil);
      }
      
      return a.title.localeCompare(b.title);
    });

    // Calculate statistics
    const stats = {
      total: allExams.length,
      available: allExams.filter(e => e.status.status === 'available').length,
      inProgress: allExams.filter(e => e.status.status === 'in-progress').length,
      completed: allExams.filter(e => ['passed', 'failed'].includes(e.status.status)).length,
      passed: allExams.filter(e => e.status.status === 'passed').length,
      retakeAvailable: allExams.filter(e => e.status.status === 'retake').length,
      upcoming: allExams.filter(e => e.status.status === 'upcoming').length,
      averageScore: allExams.length > 0 ? 
        Math.round(allExams.reduce((sum, exam) => sum + exam.bestScore, 0) / allExams.length) : 0,
      passRate: allExams.filter(e => ['passed', 'failed'].includes(e.status.status)).length > 0 ?
        Math.round((allExams.filter(e => e.status.status === 'passed').length / 
          allExams.filter(e => ['passed', 'failed'].includes(e.status.status)).length) * 100) : 0
    };

    return NextResponse.json({
      exams: filteredExams,
      stats,
      total: allExams.length
    });

  } catch (error) {
    console.error('Error fetching student exams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exams' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
