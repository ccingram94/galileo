import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  try {
    const course = await prisma.course.findUnique({
      where: { id: resolvedParams.courseId },
      select: { title: true }
    });
    
    return {
      title: course ? `${course.title} - Exams` : 'Course Exams',
      description: `View and take exams for ${course?.title || 'this course'}`
    };
  } catch {
    return {
      title: 'Course Exams',
      description: 'View and take course exams'
    };
  }
}

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
      return { 
        status: 'upcoming', 
        label: 'Opens ' + new Date(exam.availableFrom).toLocaleDateString(), 
        color: 'badge-info',
        canTake: false
      };
    }
    if (exam.availableUntil && new Date(exam.availableUntil) <= now) {
      return { 
        status: 'expired', 
        label: 'Expired', 
        color: 'badge-error',
        canTake: false
      };
    }
    return { 
      status: 'unavailable', 
      label: 'Not Available', 
      color: 'badge-neutral',
      canTake: false
    };
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

// Helper function to get exam action
function getExamAction(examStatus, examId) {
  if (!examStatus.canTake) return null;

  switch (examStatus.status) {
    case 'available':
      return { text: 'Start Exam', href: `/student/exams/${examId}/attempt`, style: 'btn-primary' };
    case 'in-progress':
      return { text: 'Continue Exam', href: `/student/exams/${examId}/attempt`, style: 'btn-warning' };
    case 'retake':
    case 'passed':
      return { text: 'Retake Exam', href: `/student/exams/${examId}/attempt`, style: 'btn-secondary' };
    default:
      return null;
  }
}

// Helper function to calculate unit completion
function calculateUnitCompletion(unit, progress, userId) {
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

  return {
    percentage: totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0,
    completedLessons,
    totalLessons: lessons.length,
    completedExams,
    totalExams: exams.length
  };
}

export default async function CourseExamsPage({ params }) {
  const resolvedParams = await params;
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  const { courseId } = resolvedParams;
  const userId = session.user.id;

  try {
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
      notFound();
    }

    const course = enrollment.course;
    const progress = enrollment.progress || {};

    // Process all exams
    const allExams = [];
    const unitData = [];

    course.units.forEach(unit => {
      const unitCompletion = calculateUnitCompletion(unit, progress, userId);
      
      const unitExams = unit.unitExams.map(exam => {
        const examStatus = getExamStatus(exam, exam.attempts);
        const action = getExamAction(examStatus, exam.id);
        
        const completedAttempts = exam.attempts.filter(a => a.completedAt);
        const bestAttempt = completedAttempts.length > 0 ? 
          completedAttempts.reduce((best, current) => 
            (current.score || 0) > (best.score || 0) ? current : best
          ) : null;

        return {
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
          action,
          attempts: {
            completed: completedAttempts.length,
            total: exam.attempts.length,
            remaining: Math.max(0, exam.maxAttempts - completedAttempts.length)
          },
          bestScore: bestAttempt?.score || null,
          bestAttemptId: bestAttempt?.id || null,
          lastAttempt: exam.attempts[0]?.startedAt || null,
          passed: bestAttempt?.passed || false
        };
      });

      allExams.push(...unitExams);
      
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

    return (
      <div className="min-h-screen bg-base-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Link 
                href="/student/my-courses"
                className="btn btn-ghost btn-sm gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                My Courses
              </Link>
              <div className="text-sm breadcrumbs">
                <ul>
                  <li><span className="text-base-content/60">Student Portal</span></li>
                  <li><Link href="/student/my-courses" className="hover:text-primary">My Courses</Link></li>
                  <li><Link href={`/student/courses/${courseId}`} className="hover:text-primary">{course.title}</Link></li>
                  <li>Exams</li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold flex items-center gap-3">
                  {course.title} - Exams
                  {course.apExamType === 'AP-PRECALCULUS' && (
                    <div className="badge badge-accent badge-outline">AP Course</div>
                  )}
                </h1>
                <p className="text-base-content/70 mt-1">
                  All assessments and examinations for this course
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link 
                  href={`/student/courses/${courseId}`}
                  className="btn btn-ghost btn-sm gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Course Overview
                </Link>
                <Link 
                  href="/student/my-exams"
                  className="btn btn-ghost btn-sm gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  All Exams
                </Link>
              </div>
            </div>
          </div>

          {/* Statistics Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-3">
                <div className="stat-title text-xs">Total</div>
                <div className="stat-value text-lg text-primary">{stats.totalExams}</div>
              </div>
            </div>
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-3">
                <div className="stat-title text-xs">Available</div>
                <div className="stat-value text-lg text-warning">{stats.availableExams}</div>
              </div>
            </div>
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-3">
                <div className="stat-title text-xs">In Progress</div>
                <div className="stat-value text-lg text-info">{stats.inProgressExams}</div>
              </div>
            </div>
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-3">
                <div className="stat-title text-xs">Completed</div>
                <div className="stat-value text-lg text-secondary">{stats.completedExams}</div>
              </div>
            </div>
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-3">
                <div className="stat-title text-xs">Passed</div>
                <div className="stat-value text-lg text-success">{stats.passedExams}</div>
              </div>
            </div>
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-3">
                <div className="stat-title text-xs">Avg Score</div>
                <div className="stat-value text-lg text-accent">{stats.averageScore}%</div>
              </div>
            </div>
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-3">
                <div className="stat-title text-xs">Pass Rate</div>
                <div className="stat-value text-lg text-accent">{stats.passRate}%</div>
              </div>
            </div>
          </div>

          {/* Priority Actions */}
          {(stats.inProgressExams > 0 || stats.availableExams > 0) && (
            <div className="bg-gradient-to-r from-warning/10 via-primary/10 to-success/10 rounded-box border border-warning/20 p-6 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-2 mb-2">
                    <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Action Required
                  </h2>
                  <p className="text-sm text-base-content/70">
                    {stats.inProgressExams > 0 && `You have ${stats.inProgressExams} exam(s) in progress. `}
                    {stats.availableExams > 0 && `${stats.availableExams} exam(s) are ready to take.`}
                  </p>
                </div>
                <Link 
                  href="#priority-exams"
                  className="btn btn-warning gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  View Priority Exams
                </Link>
              </div>
            </div>
          )}

          {/* Units with Exams */}
          <div className="space-y-8" id="priority-exams">
            {unitData.length > 0 ? (
              unitData.map(unit => (
                <div key={unit.id} className="bg-base-100 rounded-box border border-base-300 shadow-lg overflow-hidden">
                  {/* Unit Header */}
                  <div className="p-6 border-b border-base-300 bg-gradient-to-r from-primary/5 to-secondary/5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h2 className="text-xl font-bold flex items-center gap-3">
                          Unit {unit.order}: {unit.title}
                          {unit.hasInProgressExams && (
                            <div className="badge badge-warning">In Progress</div>
                          )}
                          {unit.hasAvailableExams && (
                            <div className="badge badge-primary">Available</div>
                          )}
                        </h2>
                        {unit.description && (
                          <p className="text-sm text-base-content/70 mt-1">{unit.description}</p>
                        )}
                      </div>
                      <Link 
                        href={`/student/courses/${courseId}/units/${unit.id}`}
                        className="btn btn-ghost btn-sm gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        View Unit
                      </Link>
                    </div>

                    {/* Unit Progress */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="md:col-span-2">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Unit Progress</span>
                          <span className="text-sm text-base-content/70">{unit.completion.percentage}%</span>
                        </div>
                        <progress 
                          className={`progress w-full ${
                            unit.completion.percentage >= 100 ? 'progress-success' : 
                            unit.completion.percentage >= 50 ? 'progress-primary' : 'progress-warning'
                          }`} 
                          value={unit.completion.percentage} 
                          max="100"
                        ></progress>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-base-content/60">Lessons</div>
                        <div className="font-semibold">{unit.completion.completedLessons}/{unit.completion.totalLessons}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-base-content/60">Exams</div>
                        <div className="font-semibold">{unit.completion.completedExams}/{unit.completion.totalExams}</div>
                      </div>
                    </div>
                  </div>

                  {/* Unit Exams */}
                  <div className="p-6">
                    {unit.exams.length > 0 ? (
                      <div className="space-y-4">
                        {unit.exams.map(exam => (
                          <div key={exam.id} className={`border rounded-lg p-4 transition-colors ${
                            exam.status.status === 'in-progress' ? 'border-warning bg-warning/5' :
                            exam.status.status === 'available' ? 'border-primary bg-primary/5' :
                            exam.status.status === 'passed' ? 'border-success bg-success/5' :
                            exam.status.status === 'failed' ? 'border-error bg-error/5' :
                            'border-base-300 bg-base-50'
                          }`}>
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-lg font-semibold">{exam.title}</h3>
                                  <div className={`badge ${exam.status.color}`}>
                                    {exam.status.label}
                                  </div>
                                  {course.apExamType === 'AP-PRECALCULUS' && (
                                    <div className="badge badge-accent badge-outline">AP Format</div>
                                  )}
                                </div>
                                
                                {exam.description && (
                                  <p className="text-sm text-base-content/80 mb-3 line-clamp-2">
                                    {exam.description}
                                  </p>
                                )}

                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                                  <div>
                                    <span className="text-base-content/60">Time Limit:</span>
                                    <span className="font-medium ml-1">{exam.timeLimit || 90} min</span>
                                  </div>
                                  <div>
                                    <span className="text-base-content/60">Passing Score:</span>
                                    <span className="font-medium ml-1">{exam.passingScore}%</span>
                                  </div>
                                  <div>
                                    <span className="text-base-content/60">Attempts:</span>
                                    <span className="font-medium ml-1">
                                      {exam.attempts.completed}/{exam.maxAttempts}
                                      {exam.attempts.remaining > 0 && ` (${exam.attempts.remaining} left)`}
                                    </span>
                                  </div>
                                  {exam.bestScore !== null && (
                                    <div>
                                      <span className="text-base-content/60">Best Score:</span>
                                      <span className={`font-medium ml-1 ${
                                        exam.bestScore >= exam.passingScore ? 'text-success' : 'text-error'
                                      }`}>
                                        {Math.round(exam.bestScore)}%
                                      </span>
                                    </div>
                                  )}
                                  {exam.availableUntil && (
                                    <div>
                                      <span className="text-base-content/60">Due:</span>
                                      <span className="font-medium ml-1">
                                        {new Date(exam.availableUntil).toLocaleDateString()}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-col items-end gap-2">
                                {exam.action && (
                                  <Link 
                                    href={exam.action.href}
                                    className={`btn btn-sm ${exam.action.style} gap-2`}
                                  >
                                    {exam.action.text === 'Start Exam' && (
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-6-3a3 3 0 106 0v2a3 3 0 11-6 0v-2z" />
                                      </svg>
                                    )}
                                    {exam.action.text === 'Continue Exam' && (
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-6-3a3 3 0 106 0v2a3 3 0 11-6 0v-2z" />
                                      </svg>
                                    )}
                                    {exam.action.text === 'Retake Exam' && (
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                      </svg>
                                    )}
                                    {exam.action.text}
                                  </Link>
                                )}
                                
                                {exam.bestAttemptId && (
                                  <Link 
                                    href={`/student/exams/${exam.id}/results?attemptId=${exam.bestAttemptId}`}
                                    className="btn btn-ghost btn-xs gap-1"
                                  >
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    View Results
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-base-content/50">
                        <svg className="w-12 h-12 mx-auto mb-4 text-base-content/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                        <p className="text-sm">No exams in this unit yet</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-base-100 rounded-box border border-base-300 shadow-lg p-12 text-center">
                <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">No Exams Available</h3>
                <p className="text-base-content/70 mb-4">
                  This course doesn't have any exams available yet. Check back later or contact your instructor.
                </p>
                <Link 
                  href={`/student/courses/${courseId}`}
                  className="btn btn-primary"
                >
                  View Course Content
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );

  } catch (error) {
    console.error('Error loading course exams:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="bg-base-100 rounded-box shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-error mb-2">Error Loading Course</h1>
          <p className="text-base-content/70 mb-4">Failed to load course exam data.</p>
          <Link href="/student/my-courses" className="btn btn-primary">Back to Courses</Link>
        </div>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}
