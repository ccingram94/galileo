import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import AnalyticsClient from './AnalyticsClient';

const prisma = new PrismaClient();

// Helper function to format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

export default async function AdminAnalyticsPage() {
  try {
    // Get date ranges for analytics
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneYearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);

    // Fetch comprehensive analytics data
    const [
      courses,
      enrollments,
      students,
      quizAttempts,
      examAttempts,
      recentEnrollments,
      recentStudents
    ] = await Promise.all([
      // Courses with enrollment counts
      prisma.course.findMany({
        include: {
          enrollments: {
            include: {
              user: {
                select: { id: true, createdAt: true }
              }
            }
          },
          units: {
            include: {
              lessons: {
                include: {
                  lessonQuizzes: true
                }
              },
              unitExams: true
            }
          }
        }
      }),

      // All enrollments for revenue and completion analysis
      prisma.enrollment.findMany({
        include: {
          course: {
            select: {
              id: true,
              title: true,
              price: true,
              isFree: true
            }
          },
          user: {
            select: {
              id: true,
              createdAt: true
            }
          }
        }
      }),

      // Student data for user analytics
      prisma.user.findMany({
        where: {
          role: 'STUDENT'
        },
        include: {
          enrollments: {
            include: {
              course: {
                select: {
                  price: true,
                  isFree: true
                }
              }
            }
          }
        }
      }),

      // Quiz performance data
      prisma.quizAttempt.findMany({
        include: {
          lessonQuiz: {
            include: {
              lesson: {
                include: {
                  unit: {
                    include: {
                      course: {
                        select: {
                          id: true,
                          title: true
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          user: {
            select: {
              id: true
            }
          }
        },
        where: {
          completedAt: {
            gte: thirtyDaysAgo
          }
        }
      }),

      // Exam performance data
      prisma.examAttempt.findMany({
        include: {
          unitExam: {
            include: {
              unit: {
                include: {
                  course: {
                    select: {
                      id: true,
                      title: true
                    }
                  }
                }
              }
            }
          },
          user: {
            select: {
              id: true
            }
          }
        },
        where: {
          startedAt: {
            gte: thirtyDaysAgo
          }
        }
      }),

      // Recent enrollments for trend analysis
      prisma.enrollment.findMany({
        where: {
          enrolledAt: {
            gte: thirtyDaysAgo
          }
        },
        include: {
          course: {
            select: {
              price: true,
              isFree: true
            }
          }
        },
        orderBy: {
          enrolledAt: 'asc'
        }
      }),

      // Recent student signups
      prisma.user.findMany({
        where: {
          role: 'STUDENT',
          createdAt: {
            gte: thirtyDaysAgo
          }
        },
        orderBy: {
          createdAt: 'asc'
        }
      })
    ]);

    // Calculate key metrics
    const totalStudents = students.length;
    const totalCourses = courses.length;
    const totalEnrollments = enrollments.length;

    // Revenue calculations
    const totalRevenue = enrollments
      .filter(e => e.paymentStatus === 'PAID')
      .reduce((sum, e) => sum + (e.course.price || 0), 0);

    const monthlyRevenue = enrollments
      .filter(e => 
        e.paymentStatus === 'PAID' && 
        new Date(e.enrolledAt) >= thirtyDaysAgo
      )
      .reduce((sum, e) => sum + (e.course.price || 0), 0);

    // Student engagement metrics
    const activeStudents = students.filter(student =>
      student.enrollments.some(e => 
        e.paymentStatus === 'PAID' || e.course.isFree
      )
    ).length;

    const newStudentsThisWeek = students.filter(s => 
      new Date(s.createdAt) >= sevenDaysAgo
    ).length;

    const newStudentsThisMonth = students.filter(s => 
      new Date(s.createdAt) >= thirtyDaysAgo
    ).length;

    // Course performance
    const publishedCourses = courses.filter(c => c.isPublished).length;
    const averageEnrollmentPerCourse = totalCourses > 0 ? 
      Math.round(totalEnrollments / totalCourses) : 0;

    // Completion rates
    const completedEnrollments = enrollments.filter(e => e.completedAt).length;
    const completionRate = totalEnrollments > 0 ? 
      Math.round((completedEnrollments / totalEnrollments) * 100) : 0;

    // Assessment performance
    const totalQuizAttempts = quizAttempts.length;
    const passedQuizAttempts = quizAttempts.filter(a => a.passed).length;
    const quizPassRate = totalQuizAttempts > 0 ? 
      Math.round((passedQuizAttempts / totalQuizAttempts) * 100) : 0;

    const totalExamAttempts = examAttempts.length;
    const passedExamAttempts = examAttempts.filter(a => a.passed).length;
    const examPassRate = totalExamAttempts > 0 ? 
      Math.round((passedExamAttempts / totalExamAttempts) * 100) : 0;

    // Top performing courses
    const coursePerformance = courses.map(course => {
      const courseEnrollments = course.enrollments.length;
      const courseRevenue = course.enrollments
        .filter(e => e.paymentStatus === 'PAID')
        .reduce((sum, e) => sum + (course.price || 0), 0);
      const courseCompletions = course.enrollments.filter(e => e.completedAt).length;
      const courseCompletionRate = courseEnrollments > 0 ? 
        Math.round((courseCompletions / courseEnrollments) * 100) : 0;

      return {
        ...course,
        enrollmentCount: courseEnrollments,
        revenue: courseRevenue,
        completionRate: courseCompletionRate,
        totalContent: course.units.length,
        totalQuizzes: course.units.reduce((sum, unit) => 
          sum + unit.lessons.reduce((lessonSum, lesson) => 
            lessonSum + (lesson.lessonQuizzes ? 1 : 0), 0), 0),
        totalExams: course.units.reduce((sum, unit) => sum + unit.unitExams.length, 0)
      };
    }).sort((a, b) => b.enrollmentCount - a.enrollmentCount);

    // Prepare trend data for charts
    const enrollmentTrends = prepareTimeSeriesData(recentEnrollments, 'enrolledAt');
    const studentSignupTrends = prepareTimeSeriesData(recentStudents, 'createdAt');

    const analyticsData = {
      summary: {
        totalStudents,
        totalCourses,
        totalEnrollments,
        totalRevenue,
        monthlyRevenue,
        activeStudents,
        newStudentsThisWeek,
        newStudentsThisMonth,
        publishedCourses,
        averageEnrollmentPerCourse,
        completionRate,
        quizPassRate,
        examPassRate
      },
      coursePerformance: coursePerformance.slice(0, 10), // Top 10 courses
      trends: {
        enrollments: enrollmentTrends,
        studentSignups: studentSignupTrends
      },
      assessmentData: {
        quizAttempts: quizAttempts.slice(0, 100), // Recent quiz data
        examAttempts: examAttempts.slice(0, 100)  // Recent exam data
      }
    };

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-base-content/70 mt-1">
              Comprehensive insights into your platform performance
            </p>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-ghost gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Report
            </button>
            <div className="dropdown dropdown-end">
              <div tabIndex={0} role="button" className="btn btn-outline gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-6 0a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1V8a1 1 0 00-1-1M8 7H3l1 1m4-1h8M7 8v8a2 2 0 002 2h6a2 2 0 002-2V8" />
                </svg>
                Time Range
              </div>
              <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-40 border border-base-300">
                <li><button>Last 7 days</button></li>
                <li><button>Last 30 days</button></li>
                <li><button>Last 3 months</button></li>
                <li><button>Last year</button></li>
                <li><button>All time</button></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Revenue */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-box border border-green-200 dark:border-green-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">Total Revenue</p>
                <p className="text-2xl font-bold text-green-800 dark:text-green-100">{formatCurrency(totalRevenue)}</p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  +{formatCurrency(monthlyRevenue)} this month
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/10 rounded-btn flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          {/* Students */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-box border border-blue-200 dark:border-blue-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Active Students</p>
                <p className="text-2xl font-bold text-blue-800 dark:text-blue-100">{activeStudents}</p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  +{newStudentsThisMonth} this month
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-500/10 rounded-btn flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Enrollments */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-box border border-purple-200 dark:border-purple-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Total Enrollments</p>
                <p className="text-2xl font-bold text-purple-800 dark:text-purple-100">{totalEnrollments}</p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  {completionRate}% completion rate
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/10 rounded-btn flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
            </div>
          </div>

          {/* Performance */}
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-box border border-orange-200 dark:border-orange-800 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">Avg. Performance</p>
                <p className="text-2xl font-bold text-orange-800 dark:text-orange-100">
                  {Math.round((quizPassRate + examPassRate) / 2)}%
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  Quiz: {quizPassRate}% | Exam: {examPassRate}%
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-500/10 rounded-btn flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Analytics Client Component */}
        <AnalyticsClient data={analyticsData} />
      </div>
    );

  } catch (error) {
    console.error('Admin analytics page error:', error);
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-error mb-2">Error Loading Analytics</h1>
          <p className="text-base-content/70 mb-4">We encountered an error while loading the analytics data.</p>
          <Link href="/admin" className="btn btn-primary">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Helper function to prepare time series data
function prepareTimeSeriesData(data, dateField) {
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return {
      date: date.toISOString().split('T')[0],
      count: 0,
      revenue: 0
    };
  });

  data.forEach(item => {
    const itemDate = new Date(item[dateField]).toISOString().split('T')[0];
    const dayData = last30Days.find(day => day.date === itemDate);
    if (dayData) {
      dayData.count += 1;
      if (item.course?.price && item.paymentStatus === 'PAID') {
        dayData.revenue += item.course.price;
      }
    }
  });

  return last30Days;
}
