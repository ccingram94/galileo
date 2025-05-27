import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import ExamFilters from './ExamFilters';

const prisma = new PrismaClient();

export const metadata = {
  title: 'My Exams',
  description: 'View all your exams and assessments'
};

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

// Helper function to get exam action
function getExamAction(status, examId, incompleteAttemptId = null) {
  switch (status) {
    case 'available':
      return { text: 'Start Exam', href: `/student/exams/${examId}/attempt`, style: 'btn-primary' };
    case 'in-progress':
      return { text: 'Continue Exam', href: `/student/exams/${examId}/attempt`, style: 'btn-warning' };
    case 'retake':
      return { text: 'Retake Exam', href: `/student/exams/${examId}/attempt`, style: 'btn-secondary' };
    case 'passed':
    case 'failed':
      return { text: 'View Results', href: `/student/exams/${examId}/results`, style: 'btn-ghost' };
    default:
      return null;
  }
}

export default async function MyExamsPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  const userId = session.user.id;
  const statusFilter = resolvedSearchParams.status || 'all';
  const courseFilter = resolvedSearchParams.course || 'all';

  try {
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
    const courseOptions = [];

    enrollments.forEach(enrollment => {
      const course = enrollment.course;
      courseOptions.push({ id: course.id, title: course.title });

      course.units.forEach(unit => {
        unit.unitExams.forEach(exam => {
          const examStatus = getExamStatus(exam, exam.attempts);
          const action = getExamAction(examStatus.status, exam.id, 
            exam.attempts.find(a => !a.completedAt)?.id
          );

          const completedAttempts = exam.attempts.filter(a => a.completedAt);
          const bestAttempt = completedAttempts.length > 0 ? 
            completedAttempts.reduce((best, current) => 
              (current.score || 0) > (best.score || 0) ? current : best
            ) : null;

          allExams.push({
            id: exam.id,
            title: exam.title,
            courseTitle: course.title,
            courseTitleShort: course.title.length > 20 ? course.title.substring(0, 20) + '...' : course.title,
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
            action,
            attempts: {
              completed: completedAttempts.length,
              total: exam.attempts.length,
              max: exam.maxAttempts,
              remaining: Math.max(0, exam.maxAttempts - completedAttempts.length)
            },
            bestScore: bestAttempt?.score || 0,
            lastAttempt: exam.attempts[0]?.startedAt || null,
            passed: bestAttempt?.passed || false
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

    return (
      <div className="min-h-screen bg-base-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link 
                  href="/dashboard"
                  className="btn btn-ghost btn-sm gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Dashboard
                </Link>
                <div className="text-sm breadcrumbs">
                  <ul>
                    <li><span className="text-base-content/60">Student Portal</span></li>
                    <li>My Exams</li>
                  </ul>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold">My Exams</h1>
              <p className="text-base-content/70 mt-1">
                All your assessments and exam results in one place
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link 
                href="/student/my-courses"
                className="btn btn-ghost btn-sm gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                My Courses
              </Link>
              <Link 
                href="/student/grades"
                className="btn btn-ghost btn-sm gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                View Grades
              </Link>
            </div>
          </div>

          {/* Statistics Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-4">
                <div className="stat-title text-xs">Total Exams</div>
                <div className="stat-value text-lg text-primary">{stats.total}</div>
              </div>
            </div>
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-4">
                <div className="stat-title text-xs">Available</div>
                <div className="stat-value text-lg text-warning">{stats.available}</div>
                {stats.inProgress > 0 && <div className="stat-desc text-xs">+{stats.inProgress} in progress</div>}
              </div>
            </div>
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-4">
                <div className="stat-title text-xs">Completed</div>
                <div className="stat-value text-lg text-secondary">{stats.completed}</div>
                <div className="stat-desc text-xs">{stats.passed} passed</div>
              </div>
            </div>
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-4">
                <div className="stat-title text-xs">Pass Rate</div>
                <div className="stat-value text-lg text-success">{stats.passRate}%</div>
              </div>
            </div>
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-4">
                <div className="stat-title text-xs">Avg Score</div>
                <div className="stat-value text-lg text-accent">{stats.averageScore}%</div>
              </div>
            </div>
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-4">
                <div className="stat-title text-xs">Retakes</div>
                <div className="stat-value text-lg text-info">{stats.retakeAvailable}</div>
                <div className="stat-desc text-xs">available</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <ExamFilters courseOptions={courseOptions} />

          {/* Priority Actions */}
          {(stats.inProgress > 0 || stats.available > 0 || stats.retakeAvailable > 0) && (
            <div className="bg-gradient-to-r from-primary/10 via-warning/10 to-success/10 rounded-box border border-primary/20 p-6 mb-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Action Required
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredExams
                  .filter(exam => ['in-progress', 'available', 'retake'].includes(exam.status.status))
                  .slice(0, 3)
                  .map(exam => (
                    <div key={exam.id} className="bg-base-100 border border-base-300 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-sm truncate">{exam.title}</h3>
                        <div className={`badge badge-sm ${exam.status.color}`}>
                          {exam.status.label}
                        </div>
                      </div>
                      <p className="text-xs text-base-content/70 mb-3">
                        {exam.courseTitleShort} • {exam.unitTitle}
                      </p>
                      <Link 
                        href={exam.action.href}
                        className={`btn btn-sm w-full ${exam.action.style}`}
                      >
                        {exam.action.text}
                      </Link>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Exams List */}
          <div className="bg-base-100 rounded-box border border-base-300 shadow-lg">
            <div className="p-6 border-b border-base-300">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  All Exams 
                  <span className="text-sm font-normal text-base-content/60 ml-2">
                    ({filteredExams.length} {filteredExams.length === 1 ? 'exam' : 'exams'})
                  </span>
                </h2>
                <div className="text-sm text-base-content/60">
                  Sorted by priority and due date
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-base-300">
              {filteredExams.length > 0 ? (
                filteredExams.map(exam => (
                  <div key={exam.id} className="p-6 hover:bg-base-50 transition-colors">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{exam.title}</h3>
                          <div className={`badge ${exam.status.color}`}>
                            {exam.status.label}
                          </div>
                          {exam.isAPExam && (
                            <div className="badge badge-accent badge-outline">AP Format</div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-base-content/70 mb-3">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            {exam.courseTitle}
                          </span>
                          <span>•</span>
                          <span>{exam.unitTitle}</span>
                          <span>•</span>
                          <span>{exam.timeLimit || 90} min</span>
                        </div>

                        {exam.description && (
                          <p className="text-sm text-base-content/80 mb-3 line-clamp-2">
                            {exam.description}
                          </p>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                          <div>
                            <span className="text-base-content/60">Attempts:</span>
                            <span className="font-medium ml-1">
                              {exam.attempts.completed}/{exam.attempts.max}
                            </span>
                          </div>
                          <div>
                            <span className="text-base-content/60">Passing Score:</span>
                            <span className="font-medium ml-1">{exam.passingScore}%</span>
                          </div>
                          {exam.attempts.completed > 0 && (
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
                            {exam.action.text === 'View Results' && (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
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
                        
                        <Link 
                          href={`/student/courses/${exam.courseId}/units/${exam.unitId}`}
                          className="btn btn-ghost btn-xs gap-1"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                          </svg>
                          View Unit
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">No Exams Found</h3>
                  <p className="text-base-content/70 mb-4">
                    {statusFilter !== 'all' || courseFilter !== 'all' 
                      ? 'No exams match your current filters. Try adjusting the filters above.'
                      : 'You don\'t have any exams yet. Check back later or contact your instructor.'
                    }
                  </p>
                  {(statusFilter !== 'all' || courseFilter !== 'all') && (
                    <Link href="/student/my-exams" className="btn btn-primary">
                      Clear Filters
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );

  } catch (error) {
    console.error('Error loading exams:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="bg-base-100 rounded-box shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-error mb-2">Error Loading Exams</h1>
          <p className="text-base-content/70 mb-4">Failed to load your exam data.</p>
          <Link href="/dashboard" className="btn btn-primary">Return to Dashboard</Link>
        </div>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}
