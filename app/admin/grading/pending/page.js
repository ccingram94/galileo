import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

export const metadata = {
  title: 'Pending Grading',
  description: 'Queue of ungraded free response questions'
};

// Helper function to calculate grading priority
function calculateGradingPriority(attempt) {
  const now = new Date();
  const daysSinceSubmission = Math.floor((now - new Date(attempt.completedAt)) / (1000 * 60 * 60 * 24));
  
  // Priority factors: days since submission, course importance, student need
  let priority = 0;
  
  // Urgency based on time
  if (daysSinceSubmission >= 7) priority += 5;      // Very urgent
  else if (daysSinceSubmission >= 3) priority += 3; // Urgent  
  else if (daysSinceSubmission >= 1) priority += 1; // Normal
  
  // Course importance (AP courses get higher priority)
  if (attempt.exam.unit.course.apExamType) priority += 2;
  
  // Student factor (if they have no graded attempts yet)
  if (attempt.user.examAttempts.every(a => a.gradingStatus === 'pending')) priority += 1;
  
  return priority;
}

// Helper function to format timing
function formatTimeAgo(date) {
  const now = new Date();
  const diff = Math.floor((now - new Date(date)) / (1000 * 60 * 60 * 24));
  
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  if (diff < 7) return `${diff} days ago`;
  if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
  return `${Math.floor(diff / 30)} months ago`;
}

export default async function PendingGradingPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const session = await getServerSession(authOptions);
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/auth/signin');
  }

  const courseFilter = resolvedSearchParams.course || 'all';
  const priorityFilter = resolvedSearchParams.priority || 'all';
  const sortBy = resolvedSearchParams.sort || 'priority';
  const graderId = resolvedSearchParams.grader || 'all';

  try {
    // Fetch pending attempts with comprehensive data
    const pendingAttempts = await prisma.examAttempt.findMany({
      where: {
        completedAt: { not: null },
        gradingStatus: { in: ['pending', 'in_progress'] },
        exam: {
          questions: {
            some: {
              type: 'FREE_RESPONSE' // Only include attempts with FR questions
            }
          }
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            examAttempts: {
              select: {
                gradingStatus: true
              }
            }
          }
        },
        exam: {
          include: {
            unit: {
              include: {
                course: {
                  select: {
                    id: true,
                    title: true,
                    apExamType: true
                  }
                }
              }
            },
            questions: {
              where: {
                type: 'FREE_RESPONSE'
              }
            }
          }
        },
        responses: {
          where: {
            question: {
              type: 'FREE_RESPONSE'
            },
            gradingStatus: 'pending'
          },
          include: {
            question: {
              select: {
                id: true,
                title: true,
                points: true,
                type: true
              }
            }
          }
        },
        grader: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Process and calculate priorities
    const processedAttempts = pendingAttempts.map(attempt => {
      const priority = calculateGradingPriority(attempt);
      const frQuestions = attempt.exam.questions.filter(q => q.type === 'FREE_RESPONSE');
      const ungradedResponses = attempt.responses.filter(r => r.gradingStatus === 'pending');
      
      return {
        ...attempt,
        priority,
        priorityLabel: priority >= 5 ? 'Very High' : priority >= 3 ? 'High' : priority >= 1 ? 'Medium' : 'Low',
        priorityColor: priority >= 5 ? 'text-error' : priority >= 3 ? 'text-warning' : priority >= 1 ? 'text-info' : 'text-base-content',
        timeAgo: formatTimeAgo(attempt.completedAt),
        frQuestionCount: frQuestions.length,
        ungradedCount: ungradedResponses.length,
        totalFRPoints: frQuestions.reduce((sum, q) => sum + (q.points || 0), 0)
      };
    });

    // Get unique courses for filtering
    const courses = [...new Set(processedAttempts.map(a => a.exam.unit.course))];
    
    // Get unique graders for filtering
    const graders = await prisma.user.findMany({
      where: {
        OR: [
          { role: 'ADMIN' },
          { role: 'INSTRUCTOR' }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        _count: {
          select: {
            gradedAttempts: true
          }
        }
      }
    });

    // Filter attempts
    let filteredAttempts = processedAttempts;

    if (courseFilter !== 'all') {
      filteredAttempts = filteredAttempts.filter(a => a.exam.unit.course.id === courseFilter);
    }

    if (priorityFilter !== 'all') {
      const priorityThreshold = priorityFilter === 'high' ? 3 : priorityFilter === 'medium' ? 1 : 0;
      filteredAttempts = filteredAttempts.filter(a => a.priority >= priorityThreshold);
    }

    if (graderId !== 'all') {
      if (graderId === 'unassigned') {
        filteredAttempts = filteredAttempts.filter(a => !a.gradedBy);
      } else {
        filteredAttempts = filteredAttempts.filter(a => a.gradedBy === graderId);
      }
    }

    // Sort attempts
    switch (sortBy) {
      case 'priority':
        filteredAttempts.sort((a, b) => b.priority - a.priority);
        break;
      case 'oldest':
        filteredAttempts.sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));
        break;
      case 'newest':
        filteredAttempts.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
        break;
      case 'student':
        filteredAttempts.sort((a, b) => a.user.name.localeCompare(b.user.name));
        break;
      case 'course':
        filteredAttempts.sort((a, b) => a.exam.unit.course.title.localeCompare(b.exam.unit.course.title));
        break;
      default:
        break;
    }

    // Calculate statistics
    const stats = {
      totalPending: processedAttempts.length,
      veryHighPriority: processedAttempts.filter(a => a.priority >= 5).length,
      highPriority: processedAttempts.filter(a => a.priority >= 3).length,
      inProgress: processedAttempts.filter(a => a.gradingStatus === 'in_progress').length,
      unassigned: processedAttempts.filter(a => !a.gradedBy).length,
      totalFRResponses: processedAttempts.reduce((sum, a) => sum + a.ungradedCount, 0),
      averageWaitTime: processedAttempts.length > 0 ? 
        Math.round(processedAttempts.reduce((sum, a) => {
          const days = Math.floor((new Date() - new Date(a.completedAt)) / (1000 * 60 * 60 * 24));
          return sum + days;
        }, 0) / processedAttempts.length) : 0
    };

    return (
      <div className="min-h-screen bg-base-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link 
                  href="/admin/dashboard"
                  className="btn btn-ghost btn-sm gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Admin Dashboard
                </Link>
                <div className="text-sm breadcrumbs">
                  <ul>
                    <li><span className="text-base-content/60">Admin</span></li>
                    <li><span className="text-base-content/60">Grading</span></li>
                    <li>Pending Queue</li>
                  </ul>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold flex items-center gap-3">
                Pending Grading Queue
                {stats.totalPending > 0 && (
                  <div className="badge badge-error badge-lg">
                    {stats.totalPending}
                  </div>
                )}
              </h1>
              <p className="text-base-content/70 mt-1">
                Free response questions waiting for manual grading
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link 
                href="/admin/grading/completed"
                className="btn btn-ghost btn-sm gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Completed Grading
              </Link>
              <Link 
                href="/admin/grading/analytics"
                className="btn btn-ghost btn-sm gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analytics
              </Link>
            </div>
          </div>

          {/* Statistics Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-3">
                <div className="stat-title text-xs">Total Pending</div>
                <div className="stat-value text-lg text-error">{stats.totalPending}</div>
              </div>
            </div>
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-3">
                <div className="stat-title text-xs">Very High Priority</div>
                <div className="stat-value text-lg text-error">{stats.veryHighPriority}</div>
              </div>
            </div>
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-3">
                <div className="stat-title text-xs">High Priority</div>
                <div className="stat-value text-lg text-warning">{stats.highPriority}</div>
              </div>
            </div>
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-3">
                <div className="stat-title text-xs">In Progress</div>
                <div className="stat-value text-lg text-info">{stats.inProgress}</div>
              </div>
            </div>
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-3">
                <div className="stat-title text-xs">Unassigned</div>
                <div className="stat-value text-lg text-secondary">{stats.unassigned}</div>
              </div>
            </div>
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-3">
                <div className="stat-title text-xs">FR Responses</div>
                <div className="stat-value text-lg text-primary">{stats.totalFRResponses}</div>
              </div>
            </div>
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-3">
                <div className="stat-title text-xs">Avg Wait</div>
                <div className="stat-value text-lg text-accent">{stats.averageWaitTime}d</div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-base-100 rounded-box border border-base-300 shadow-lg mb-6">
            <div className="p-6">
              <h2 className="text-lg font-bold mb-4">Filters & Sorting</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Course Filter */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Course</span>
                  </label>
                  <select 
                    className="select select-bordered"
                    value={courseFilter}
                    onChange={(e) => {
                      const params = new URLSearchParams(resolvedSearchParams);
                      params.set('course', e.target.value);
                      window.location.href = `/admin/grading/pending?${params.toString()}`;
                    }}
                  >
                    <option value="all">All Courses</option>
                    {courses.map(course => (
                      <option key={course.id} value={course.id}>{course.title}</option>
                    ))}
                  </select>
                </div>

                {/* Priority Filter */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Priority</span>
                  </label>
                  <select 
                    className="select select-bordered"
                    value={priorityFilter}
                    onChange={(e) => {
                      const params = new URLSearchParams(resolvedSearchParams);
                      params.set('priority', e.target.value);
                      window.location.href = `/admin/grading/pending?${params.toString()}`;
                    }}
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                  </select>
                </div>

                {/* Grader Filter */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Assigned To</span>
                  </label>
                  <select 
                    className="select select-bordered"
                    value={graderId}
                    onChange={(e) => {
                      const params = new URLSearchParams(resolvedSearchParams);
                      params.set('grader', e.target.value);
                      window.location.href = `/admin/grading/pending?${params.toString()}`;
                    }}
                  >
                    <option value="all">All Graders</option>
                    <option value="unassigned">Unassigned</option>
                    {graders.map(grader => (
                      <option key={grader.id} value={grader.id}>
                        {grader.name} ({grader._count.gradedAttempts} graded)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort Options */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Sort By</span>
                  </label>
                  <select 
                    className="select select-bordered"
                    value={sortBy}
                    onChange={(e) => {
                      const params = new URLSearchParams(resolvedSearchParams);
                      params.set('sort', e.target.value);
                      window.location.href = `/admin/grading/pending?${params.toString()}`;
                    }}
                  >
                    <option value="priority">Priority</option>
                    <option value="oldest">Oldest First</option>
                    <option value="newest">Newest First</option>
                    <option value="student">Student Name</option>
                    <option value="course">Course</option>
                  </select>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Actions</span>
                  </label>
                  <div className="flex gap-2">
                    <button 
                      className="btn btn-outline btn-primary btn-sm"
                      onClick={() => {
                        // TODO: Implement bulk assignment
                        alert('Bulk assignment feature coming soon!');
                      }}
                    >
                      Bulk Assign
                    </button>
                    <Link 
                      href="/admin/grading/pending"
                      className="btn btn-ghost btn-sm"
                    >
                      Clear Filters
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Priority Alert */}
          {stats.veryHighPriority > 0 && (
            <div className="alert alert-error mb-6">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h3 className="font-bold">Urgent Attention Required!</h3>
                <p>{stats.veryHighPriority} exam(s) have been waiting for over a week for grading.</p>
              </div>
            </div>
          )}

          {/* Pending Attempts Queue */}
          <div className="bg-base-100 rounded-box border border-base-300 shadow-lg">
            <div className="p-6 border-b border-base-300">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  Grading Queue
                  <span className="text-sm font-normal text-base-content/60 ml-2">
                    ({filteredAttempts.length} {filteredAttempts.length === 1 ? 'attempt' : 'attempts'})
                  </span>
                </h2>
                <div className="text-sm text-base-content/60">
                  Sorted by {sortBy === 'priority' ? 'priority' : sortBy}
                </div>
              </div>
            </div>
            
            <div className="divide-y divide-base-300">
              {filteredAttempts.length > 0 ? (
                filteredAttempts.map(attempt => (
                  <div 
                    key={attempt.id} 
                    className={`p-6 hover:bg-base-50 transition-colors ${
                      attempt.priority >= 5 ? 'bg-error/5 border-l-4 border-error' :
                      attempt.priority >= 3 ? 'bg-warning/5 border-l-4 border-warning' :
                      attempt.gradingStatus === 'in_progress' ? 'bg-info/5 border-l-4 border-info' :
                      ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold">{attempt.exam.title}</h3>
                          <div className={`badge ${attempt.priorityColor}`}>
                            {attempt.priorityLabel} Priority
                          </div>
                          {attempt.gradingStatus === 'in_progress' && (
                            <div className="badge badge-info">In Progress</div>
                          )}
                          {attempt.exam.unit.course.apExamType && (
                            <div className="badge badge-accent badge-outline">AP Course</div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-6 text-sm text-base-content/70 mb-3">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {attempt.user.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            {attempt.exam.unit.course.title}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Submitted {attempt.timeAgo}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-base-content/60">FR Questions:</span>
                            <span className="font-medium ml-1">{attempt.ungradedCount}</span>
                          </div>
                          <div>
                            <span className="text-base-content/60">Total FR Points:</span>
                            <span className="font-medium ml-1">{attempt.totalFRPoints}</span>
                          </div>
                          <div>
                            <span className="text-base-content/60">Auto Score:</span>
                            <span className="font-medium ml-1">
                              {attempt.autoGradedScore ? `${Math.round(attempt.autoGradedScore)}%` : 'N/A'}
                            </span>
                          </div>
                          {attempt.grader && (
                            <div>
                              <span className="text-base-content/60">Assigned to:</span>
                              <span className="font-medium ml-1">{attempt.grader.name}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <Link 
                          href={`/admin/grading/${attempt.id}`}
                          className="btn btn-primary btn-sm gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                          {attempt.gradingStatus === 'in_progress' ? 'Continue Grading' : 'Start Grading'}
                        </Link>
                        
                        <div className="flex gap-1">
                          <button 
                            className="btn btn-ghost btn-xs"
                            onClick={() => {
                              // TODO: Implement assign to self
                              alert('Assign to self feature coming soon!');
                            }}
                          >
                            Assign to Me
                          </button>
                          <button 
                            className="btn btn-ghost btn-xs"
                            onClick={() => {
                              // TODO: Implement view exam overview
                              window.open(`/admin/exams/${attempt.exam.id}/results`, '_blank');
                            }}
                          >
                            View Exam
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">All Caught Up! 🎉</h3>
                  <p className="text-base-content/70 mb-4">
                    {stats.totalPending === 0 
                      ? 'No pending grading tasks. Great job keeping up with the workload!'
                      : 'No items match your current filters. Try adjusting the filters above.'
                    }
                  </p>
                  {stats.totalPending > 0 && (
                    <Link href="/admin/grading/pending" className="btn btn-primary">
                      View All Pending Items
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
    console.error('Error loading pending grading:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="bg-base-100 rounded-box shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-error mb-2">Error Loading Grading Queue</h1>
          <p className="text-base-content/70 mb-4">Failed to load the pending grading data.</p>
          <Link href="/admin/dashboard" className="btn btn-primary">Return to Dashboard</Link>
        </div>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}
