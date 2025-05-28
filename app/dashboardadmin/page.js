import Link from 'next/link';
import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to calculate percentage change
function calculatePercentageChange(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

// Helper function to format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

export default async function AdminDashboard() {
  const session = await auth();
  
  // Redirect to sign-in if not authenticated
  if (!session) {
    redirect('/signin');
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user || user.role !== 'ADMIN') {
    redirect('/dashboard'); // Redirect to regular dashboard
  }

  try {
    // Date ranges for analytics
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    // Fetch all courses with comprehensive data for management
    const courses = await prisma.course.findMany({
      include: {
        enrollments: {
          include: {
            user: true
          }
        },
        units: {
          include: {
            lessons: {
              include: {
                lessonQuiz: {  // Changed from lessonQuizzes to lessonQuiz
                  include: {
                    attempts: true
                  }
                },
                vocabulary: true,
                contentBlocks: true,
                examples: true,
                resources: true
              }
            },
            unitExams: {
              include: {
                attempts: true
              }
            }
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Fetch all students
    const students = await prisma.user.findMany({
      where: { role: 'STUDENT' },
      include: {
        enrollments: {
          include: {
            course: true
          }
        },
        quizAttempts: true,
        examAttempts: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // Recent enrollments and analytics calculations
    const recentEnrollments = await prisma.enrollment.findMany({
      where: {
        enrolledAt: {
          gte: thirtyDaysAgo
        }
      },
      include: {
        user: true,
        course: true
      },
      orderBy: { enrolledAt: 'desc' }
    });

    const previousEnrollments = await prisma.enrollment.findMany({
      where: {
        enrolledAt: {
          gte: sixtyDaysAgo,
          lt: thirtyDaysAgo
        }
      }
    });

    // Recent quiz attempts
    const recentQuizAttempts = await prisma.quizAttempt.findMany({
      where: {
        completedAt: {
          gte: thirtyDaysAgo
        }
      },
      include: {
        user: true,
        lessonQuiz: {
          include: {
            lesson: {
              include: {
                unit: {
                  include: {
                    course: true
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { completedAt: 'desc' },
      take: 10
    });

    // Recent exam attempts
    const recentExamAttempts = await prisma.examAttempt.findMany({
      where: {
        startedAt: {
          gte: thirtyDaysAgo
        }
      },
      include: {
        user: true,
        unitExam: {
          include: {
            unit: {
              include: {
                course: true
              }
            }
          }
        }
      },
      orderBy: { startedAt: 'desc' },
      take: 10
    });

    // Calculate overview statistics
    const totalStudents = students.length;
    const totalCourses = courses.length;
    const totalEnrollments = courses.reduce((sum, course) => sum + course.enrollments.length, 0);
    const recentEnrollmentCount = recentEnrollments.length;
    const enrollmentGrowth = calculatePercentageChange(recentEnrollmentCount, previousEnrollments.length);

    // Calculate revenue (from paid enrollments)
    const totalRevenue = courses.reduce((sum, course) => {
      if (!course.isFree && course.price) {
        const paidEnrollments = course.enrollments.filter(e => e.paymentStatus === 'PAID');
        return sum + (paidEnrollments.length * course.price);
      }
      return sum;
    }, 0);

    const recentRevenue = courses.reduce((sum, course) => {
      if (!course.isFree && course.price) {
        const recentPaidEnrollments = course.enrollments.filter(e => 
          e.paymentStatus === 'PAID' && new Date(e.enrolledAt) >= thirtyDaysAgo
        );
        return sum + (recentPaidEnrollments.length * course.price);
      }
      return sum;
    }, 0);

    // Calculate average quiz/exam scores (handle null/undefined scores)
    const allQuizScores = recentQuizAttempts
      .map(attempt => attempt.score)
      .filter(score => score != null);
    const allExamScores = recentExamAttempts
      .map(attempt => attempt.score)
      .filter(score => score != null);
    const allScores = [...allQuizScores, ...allExamScores];
    const averageScore = allScores.length > 0 ? 
      allScores.reduce((sum, score) => sum + score, 0) / allScores.length : 0;

    // Most popular courses
    const popularCourses = courses
      .sort((a, b) => b.enrollments.length - a.enrollments.length)
      .slice(0, 5);

    // Students needing attention (low scores)
    const studentsNeedingAttention = students.filter(student => {
      const studentScores = [
        ...student.quizAttempts.map(a => a.score).filter(score => score != null),
        ...student.examAttempts.map(a => a.score).filter(score => score != null)
      ];
      if (studentScores.length === 0) return false;
      const avgScore = studentScores.reduce((sum, score) => sum + score, 0) / studentScores.length;
      return avgScore < 70 && studentScores.length >= 3;
    }).slice(0, 5);

    // Recent activity feed
    const recentActivity = [
      ...recentEnrollments.slice(0, 5).map(enrollment => ({
        type: 'enrollment',
        user: enrollment.user,
        course: enrollment.course,
        timestamp: enrollment.enrolledAt,
        description: `enrolled in ${enrollment.course.title}`
      })),
      ...recentQuizAttempts.slice(0, 3).map(attempt => ({
        type: 'quiz',
        user: attempt.user,
        course: attempt.lessonQuiz.lesson.unit.course,
        lesson: attempt.lessonQuiz.lesson,
        score: attempt.score,
        timestamp: attempt.completedAt,
        description: `completed quiz for ${attempt.lessonQuiz.lesson.title}`
      })),
      ...recentExamAttempts.slice(0, 3).map(attempt => ({
        type: 'exam',
        user: attempt.user,
        course: attempt.unitExam.unit.course,
        unit: attempt.unitExam.unit,
        score: attempt.score,
        timestamp: attempt.startedAt,
        description: `took exam for ${attempt.unitExam.unit.title}`
      }))
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10);

    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/30 to-primary/5 relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/3 rounded-full blur-3xl"></div>
        </div>

        {/* Admin Header */}
        <div className="relative z-10 bg-base-100/80 backdrop-blur-sm border-b border-base-300 sticky top-16">
          <div className="container mx-auto max-w-7xl px-6 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="avatar">
                  <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    {user?.image ? (
                      <img src={user.image} alt={user.name || 'Admin'} />
                    ) : (
                      <div className="bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                        {user?.name?.charAt(0) || 'A'}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">
                      Admin Dashboard
                    </h1>
                    <div className="badge badge-primary">Administrator</div>
                  </div>
                  <p className="text-base-content/70">Welcome back, {user?.name?.split(' ')[0] || 'Admin'}</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Link href="/dashboard" className="btn btn-ghost btn-sm">
                  Student View
                </Link>
                <form action={async () => {
                  "use server"
                  await signOut({ redirectTo: "/" })
                }}>
                  <button className="btn btn-ghost btn-sm gap-2 hover:btn-error hover:text-error-content transition-all duration-200">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 container mx-auto max-w-7xl px-6 py-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-base-100 rounded-box border border-base-300 p-6 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base-content/70 text-sm font-medium">Total Students</p>
                  <p className="text-2xl font-bold text-primary">{totalStudents}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-btn flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex items-center gap-1 text-xs">
                  <span className={`badge badge-sm ${enrollmentGrowth >= 0 ? 'badge-success' : 'badge-error'}`}>
                    {enrollmentGrowth >= 0 ? '+' : ''}{enrollmentGrowth.toFixed(1)}%
                  </span>
                  <span className="text-base-content/60">vs last month</span>
                </div>
              </div>
            </div>

            <div className="bg-base-100 rounded-box border border-base-300 p-6 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base-content/70 text-sm font-medium">Active Courses</p>
                  <p className="text-2xl font-bold text-secondary">{courses.filter(c => c.isPublished).length}</p>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-btn flex items-center justify-center">
                  <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-xs text-base-content/60">
                  {courses.filter(c => !c.isPublished).length} draft courses
                </div>
              </div>
            </div>

            <div className="bg-base-100 rounded-box border border-base-300 p-6 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base-content/70 text-sm font-medium">Total Revenue</p>
                  <p className="text-2xl font-bold text-accent">{formatCurrency(totalRevenue)}</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-btn flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-xs text-base-content/60">
                  {formatCurrency(recentRevenue)} this month
                </div>
              </div>
            </div>

            <div className="bg-base-100 rounded-box border border-base-300 p-6 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base-content/70 text-sm font-medium">Avg. Score</p>
                  <p className="text-2xl font-bold text-info">{averageScore.toFixed(1)}%</p>
                </div>
                <div className="w-12 h-12 bg-info/10 rounded-btn flex items-center justify-center">
                  <svg className="w-6 h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="mt-3">
                <div className={`badge badge-sm ${averageScore >= 80 ? 'badge-success' : averageScore >= 70 ? 'badge-warning' : 'badge-error'}`}>
                  {averageScore >= 80 ? 'Excellent' : averageScore >= 70 ? 'Good' : 'Needs Attention'}
                </div>
              </div>
            </div>
          </div>

          {/* Course Management Section */}
          <div className="bg-base-100 rounded-box border border-base-300 shadow-xl mb-8">
            <div className="p-6 border-b border-base-300">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Course Management
                  </h2>
                  <p className="text-base-content/70 mt-1">Manage your courses, content, and structure</p>
                </div>
                <Link href="/admin/courses/new" className="btn btn-primary gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  New Course
                </Link>
              </div>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Status</th>
                      <th>Content</th>
                      <th>Enrollments</th>
                      <th>Revenue</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => {
                      const totalLessons = course.units.reduce((sum, unit) => sum + unit.lessons.length, 0);
                      const revenue = course.isFree ? 0 : (course.enrollments.filter(e => e.paymentStatus === 'PAID').length * (course.price || 0));
                      
                      return (
                        <tr key={course.id} className="hover">
                          <td>
                            <div className="flex items-center gap-3">
                              <div>
                                <div className="font-bold">{course.title}</div>
                                <div className="text-sm opacity-70">{course.apExamType}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="flex flex-col gap-1">
                              <div className={`badge ${course.isPublished ? 'badge-success' : 'badge-warning'}`}>
                                {course.isPublished ? 'Published' : 'Draft'}
                              </div>
                              {course.isFree ? (
                                <div className="badge badge-info badge-sm">Free</div>
                              ) : (
                                <div className="badge badge-accent badge-sm">{formatCurrency(course.price || 0)}</div>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="text-sm">
                              <div>{course.units.length} Units</div>
                              <div className="opacity-70">{totalLessons} Lessons</div>
                            </div>
                          </td>
                          <td>
                            <div className="text-sm">
                              <div className="font-semibold">{course.enrollments.length}</div>
                              <div className="opacity-70">students</div>
                            </div>
                          </td>
                          <td>
                            <div className="text-sm">
                              <div className="font-semibold">{formatCurrency(revenue)}</div>
                              <div className="opacity-70">total</div>
                            </div>
                          </td>
                          <td>
                            <div className="flex gap-2">
                              <Link 
                                href={`/admin/courses/${course.id}/edit`}
                                className="btn btn-ghost btn-xs"
                              >
                                Edit
                              </Link>
                              <Link 
                                href={`/admin/courses/${course.id}/content`}
                                className="btn btn-ghost btn-xs"
                              >
                                Content
                              </Link>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {courses.length === 0 && (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-base-content/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <h3 className="text-lg font-semibold text-base-content/70 mb-2">No courses found</h3>
                  <p className="text-base-content/50 mb-4">Create your first course to get started</p>
                  <Link href="/admin/courses/new" className="btn btn-primary">
                    Create First Course
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <div className="lg:col-span-2">
              <div className="bg-base-100 rounded-box border border-base-300 shadow-xl">
                <div className="p-6 border-b border-base-300">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Recent Activity
                  </h2>
                  <p className="text-base-content/70 mt-1">Latest platform activity</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 hover:bg-base-200/50 rounded-box transition-colors duration-200">
                        <div className={`w-10 h-10 rounded-btn flex items-center justify-center ${
                          activity.type === 'enrollment' ? 'bg-primary/10 text-primary' :
                          activity.type === 'quiz' ? 'bg-secondary/10 text-secondary' :
                          'bg-accent/10 text-accent'
                        }`}>
                          {activity.type === 'enrollment' ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                          ) : activity.type === 'quiz' ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">
                              {activity.user.name} {activity.description}
                            </p>
                            {(activity.type === 'quiz' || activity.type === 'exam') && activity.score != null && (
                              <div className={`badge badge-sm ${
                                activity.score >= 90 ? 'badge-success' :
                                activity.score >= 80 ? 'badge-warning' :
                                'badge-error'
                              }`}>
                                {activity.score.toFixed(1)}%
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-base-content/70">
                            {activity.course.title} • {new Date(activity.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {recentActivity.length === 0 && (
                    <div className="text-center py-8 text-base-content/50">
                      <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p>No recent activity</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-base-100 rounded-box border border-base-300 shadow-xl">
                <div className="p-6 border-b border-base-300">
                  <h3 className="font-bold flex items-center gap-2">
                    <svg className="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Quick Actions
                  </h3>
                </div>
                <div className="p-6 space-y-3">
                  <Link href="/admin/courses/new" className="btn btn-primary btn-sm w-full justify-start gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Create Course
                  </Link>

                  <Link href="/admin/courses" className="btn btn-outline btn-secondary btn-sm w-full justify-start gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    Manage Courses
                  </Link>

                  <Link href="/admin/students" className="btn btn-outline btn-secondary btn-sm w-full justify-start gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                    Manage Students
                  </Link>
                  
                  <Link href="/admin/analytics" className="btn btn-outline btn-info btn-sm w-full justify-start gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    View Analytics
                  </Link>
                </div>
              </div>

              {/* Students Needing Attention */}
              {studentsNeedingAttention.length > 0 && (
                <div className="bg-base-100 rounded-box border border-base-300 shadow-xl">
                  <div className="p-6 border-b border-base-300">
                    <h3 className="font-bold flex items-center gap-2">
                      <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      Students Needing Attention
                    </h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {studentsNeedingAttention.map((student) => {
                        const studentScores = [
                          ...student.quizAttempts.map(a => a.score).filter(score => score != null),
                          ...student.examAttempts.map(a => a.score).filter(score => score != null)
                        ];
                        const avgScore = studentScores.reduce((sum, score) => sum + score, 0) / studentScores.length;
                        
                        return (
                          <div key={student.id} className="border-l-4 border-warning pl-4 py-2">
                            <h4 className="font-medium text-sm">{student.name}</h4>
                            <p className="text-xs text-base-content/70">{student.email}</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-base-content/60">Avg: {avgScore.toFixed(1)}%</span>
                              <span className="text-xs text-base-content/60">{studentScores.length} attempts</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Popular Courses */}
              <div className="bg-base-100 rounded-box border border-base-300 shadow-xl">
                <div className="p-6 border-b border-base-300">
                  <h3 className="font-bold flex items-center gap-2">
                    <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Most Popular Courses
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {popularCourses.map((course, index) => (
                      <div key={course.id} className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-sm">{course.title}</h4>
                          <p className="text-xs text-base-content/70">{course.apExamType}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-sm">{course.enrollments.length}</div>
                          <div className="text-xs text-base-content/60">students</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {popularCourses.length === 0 && (
                    <div className="text-center py-4 text-base-content/50">
                      <p className="text-sm">No course data yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  } catch (error) {
    console.error('Admin dashboard error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-error mb-2">Error Loading Admin Dashboard</h1>
          <p className="text-base-content/70 mb-4">We encountered an error while loading the admin dashboard.</p>
          <Link href="/dashboard" className="btn btn-primary">Go to Student Dashboard</Link>
        </div>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}
