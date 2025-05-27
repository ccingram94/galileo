import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

export const metadata = {
  title: 'My Courses',
  description: 'View all your enrolled courses and progress'
};

// Helper function to calculate course progress
function calculateCourseProgress(units, progress) {
  let totalItems = 0;
  let completedItems = 0;

  units.forEach(unit => {
    // Count lessons
    totalItems += unit.lessons.length;
    unit.lessons.forEach(lesson => {
      if (progress[`lesson_${lesson.id}`]?.completed) {
        completedItems++;
      }
    });

    // Count exams
    totalItems += unit.unitExams.length;
    unit.unitExams.forEach(exam => {
      if (exam.attempts.some(attempt => attempt.completedAt)) {
        completedItems++;
      }
    });
  });

  return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
}

// Helper function to get next item for a course
function getNextItem(units, progress, userId) {
  for (const unit of units) {
    const unitProgress = progress[`unit_${unit.id}`];
    
    // Skip if unit hasn't started or is completed
    if (!unitProgress?.started || unitProgress?.completed) continue;

    // Check for incomplete lessons first
    for (const lesson of unit.lessons) {
      const lessonProgress = progress[`lesson_${lesson.id}`];
      if (!lessonProgress?.completed) {
        return {
          type: 'lesson',
          item: lesson,
          unit: unit,
          link: `/courses/${units[0].courseId}/units/${unit.id}/lessons/${lesson.id}`
        };
      }
    }

    // Check for available but incomplete exams
    for (const exam of unit.unitExams) {
      const now = new Date();
      const isAvailable = exam.isPublished &&
        (!exam.availableFrom || new Date(exam.availableFrom) <= now) &&
        (!exam.availableUntil || new Date(exam.availableUntil) > now);

      if (isAvailable && !exam.attempts.some(attempt => attempt.completedAt)) {
        return {
          type: 'exam',
          item: exam,
          unit: unit,
          link: `/student/exams/${exam.id}/attempt`
        };
      }
    }
  }

  return null;
}

// Helper function to get course status
function getCourseStatus(units, progress) {
  const totalUnits = units.length;
  if (totalUnits === 0) return { status: 'empty', label: 'No Content', color: 'badge-ghost' };

  const completedUnits = units.filter(unit => progress[`unit_${unit.id}`]?.completed).length;
  const startedUnits = units.filter(unit => progress[`unit_${unit.id}`]?.started).length;

  if (completedUnits === totalUnits) {
    return { status: 'completed', label: 'Completed', color: 'badge-success' };
  }
  
  if (startedUnits > 0) {
    return { status: 'in-progress', label: 'In Progress', color: 'badge-primary' };
  }
  
  return { status: 'not-started', label: 'Not Started', color: 'badge-ghost' };
}

// Helper function to get recent activity for a course
function getRecentActivity(units) {
  const activities = [];

  units.forEach(unit => {
    // Get recent exam attempts
    unit.unitExams.forEach(exam => {
      exam.attempts.forEach(attempt => {
        activities.push({
          type: 'exam',
          title: exam.title,
          unit: unit.title,
          date: attempt.completedAt || attempt.startedAt,
          score: attempt.score,
          completed: !!attempt.completedAt,
          link: attempt.completedAt ? 
            `/student/exams/${exam.id}/results?attemptId=${attempt.id}` :
            `/student/exams/${exam.id}/attempt`
        });
      });
    });
  });

  return activities
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);
}

export default async function MyCoursesPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  const userId = session.user.id;
  const statusFilter = resolvedSearchParams.status || 'all';
  const sortBy = resolvedSearchParams.sort || 'recent';

  try {
    // Fetch user's enrollments with comprehensive course data
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
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
      },
      orderBy: { enrolledAt: 'desc' }
    });

    // Process course data
    const coursesData = enrollments.map(enrollment => {
      const course = enrollment.course;
      const progress = enrollment.progress || {};
      
      // Calculate statistics
      const totalLessons = course.units.reduce((sum, unit) => sum + unit.lessons.length, 0);
      const completedLessons = course.units.reduce((sum, unit) => 
        sum + unit.lessons.filter(lesson => progress[`lesson_${lesson.id}`]?.completed).length, 0);
      
      const totalExams = course.units.reduce((sum, unit) => sum + unit.unitExams.length, 0);
      const completedExams = course.units.reduce((sum, unit) => 
        sum + unit.unitExams.filter(exam => 
          exam.attempts.some(attempt => attempt.completedAt)
        ).length, 0);
      
      const availableExams = course.units.reduce((sum, unit) => {
        return sum + unit.unitExams.filter(exam => {
          const now = new Date();
          return exam.isPublished &&
            (!exam.availableFrom || new Date(exam.availableFrom) <= now) &&
            (!exam.availableUntil || new Date(exam.availableUntil) > now) &&
            !exam.attempts.some(attempt => attempt.completedAt);
        }).length;
      }, 0);

      // Calculate exam statistics
      const allExamAttempts = course.units.flatMap(unit => 
        unit.unitExams.flatMap(exam => exam.attempts.filter(attempt => attempt.completedAt))
      );
      
      const averageExamScore = allExamAttempts.length > 0 ?
        Math.round(allExamAttempts.reduce((sum, attempt) => sum + (attempt.score || 0), 0) / allExamAttempts.length) : 0;
      
      const passedExams = allExamAttempts.filter(attempt => attempt.passed).length;
      const examPassRate = completedExams > 0 ? Math.round((passedExams / completedExams) * 100) : 0;

      const courseProgress = calculateCourseProgress(course.units, progress);
      const courseStatus = getCourseStatus(course.units, progress);
      const nextItem = getNextItem(course.units, progress, userId);
      const recentActivity = getRecentActivity(course.units);

      return {
        id: course.id,
        title: course.title,
        description: course.description,
        apExamType: course.apExamType,
        isAPCourse: course.apExamType === 'AP-PRECALCULUS',
        enrolledAt: enrollment.enrolledAt,
        progress: courseProgress,
        status: courseStatus,
        nextItem,
        recentActivity,
        stats: {
          totalUnits: course.units.length,
          completedUnits: course.units.filter(unit => progress[`unit_${unit.id}`]?.completed).length,
          totalLessons,
          completedLessons,
          totalExams,
          completedExams,
          availableExams,
          averageExamScore,
          examPassRate
        },
        units: course.units.map(unit => {
          const unitProgress = progress[`unit_${unit.id}`];
          const unitLessonCount = unit.lessons.length;
          const unitExamCount = unit.unitExams.length;
          const unitCompletedLessons = unit.lessons.filter(lesson => 
            progress[`lesson_${lesson.id}`]?.completed
          ).length;
          const unitCompletedExams = unit.unitExams.filter(exam =>
            exam.attempts.some(attempt => attempt.completedAt)
          ).length;
          
          return {
            id: unit.id,
            title: unit.title,
            order: unit.order,
            status: unitProgress?.completed ? 'completed' : 
                   unitProgress?.started ? 'in-progress' : 'not-started',
            lessonCount: unitLessonCount,
            examCount: unitExamCount,
            completedLessons: unitCompletedLessons,
            completedExams: unitCompletedExams,
            progress: unitLessonCount + unitExamCount > 0 ? 
              Math.round(((unitCompletedLessons + unitCompletedExams) / (unitLessonCount + unitExamCount)) * 100) : 0
          };
        })
      };
    });

    // Filter courses
    let filteredCourses = coursesData;
    if (statusFilter !== 'all') {
      filteredCourses = coursesData.filter(course => course.status.status === statusFilter);
    }

    // Sort courses
    switch (sortBy) {
      case 'name':
        filteredCourses.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'progress':
        filteredCourses.sort((a, b) => b.progress - a.progress);
        break;
      case 'recent':
      default:
        filteredCourses.sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt));
        break;
    }

    // Calculate overall statistics
    const overallStats = {
      totalCourses: coursesData.length,
      inProgressCourses: coursesData.filter(c => c.status.status === 'in-progress').length,
      completedCourses: coursesData.filter(c => c.status.status === 'completed').length,
      totalAvailableExams: coursesData.reduce((sum, course) => sum + course.stats.availableExams, 0),
      averageProgress: coursesData.length > 0 ? 
        Math.round(coursesData.reduce((sum, course) => sum + course.progress, 0) / coursesData.length) : 0,
      totalExamsCompleted: coursesData.reduce((sum, course) => sum + course.stats.completedExams, 0)
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
                    <li>My Courses</li>
                  </ul>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold">My Courses</h1>
              <p className="text-base-content/70 mt-1">
                Track your progress and access course materials
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link 
                href="/student/my-exams"
                className="btn btn-ghost btn-sm gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                My Exams
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

          {/* Overall Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-4">
                <div className="stat-title text-xs">Total Courses</div>
                <div className="stat-value text-lg text-primary">{overallStats.totalCourses}</div>
              </div>
            </div>
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-4">
                <div className="stat-title text-xs">In Progress</div>
                <div className="stat-value text-lg text-secondary">{overallStats.inProgressCourses}</div>
              </div>
            </div>
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-4">
                <div className="stat-title text-xs">Completed</div>
                <div className="stat-value text-lg text-success">{overallStats.completedCourses}</div>
              </div>
            </div>
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-4">
                <div className="stat-title text-xs">Available Exams</div>
                <div className="stat-value text-lg text-warning">{overallStats.totalAvailableExams}</div>
              </div>
            </div>
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-4">
                <div className="stat-title text-xs">Avg Progress</div>
                <div className="stat-value text-lg text-accent">{overallStats.averageProgress}%</div>
              </div>
            </div>
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-4">
                <div className="stat-title text-xs">Exams Done</div>
                <div className="stat-value text-lg text-info">{overallStats.totalExamsCompleted}</div>
              </div>
            </div>
          </div>

          {/* Filters and Sort */}
          <div className="bg-base-100 rounded-box border border-base-300 shadow-lg mb-6">
            <div className="p-6">
              <h2 className="text-lg font-bold mb-4">Filter & Sort</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status Filter */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Status</span>
                  </label>
                  <select 
                    className="select select-bordered"
                    value={statusFilter}
                    onChange={(e) => {
                      const params = new URLSearchParams(resolvedSearchParams);
                      params.set('status', e.target.value);
                      window.location.href = `/student/my-courses?${params.toString()}`;
                    }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="not-started">Not Started</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
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
                      window.location.href = `/student/my-courses?${params.toString()}`;
                    }}
                  >
                    <option value="recent">Recently Enrolled</option>
                    <option value="name">Course Name</option>
                    <option value="progress">Progress</option>
                  </select>
                </div>
              </div>
              
              {(statusFilter !== 'all' || sortBy !== 'recent') && (
                <div className="mt-4">
                  <Link 
                    href="/student/my-courses"
                    className="btn btn-ghost btn-sm gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reset Filters
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          {overallStats.totalAvailableExams > 0 && (
            <div className="bg-gradient-to-r from-warning/10 via-primary/10 to-success/10 rounded-box border border-warning/20 p-6 mb-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Available Exams ({overallStats.totalAvailableExams})
              </h2>
              <p className="text-sm text-base-content/70 mb-4">
                You have exams ready to take. Don't miss your deadlines!
              </p>
              <Link 
                href="/student/my-exams?status=available"
                className="btn btn-warning gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                View Available Exams
              </Link>
            </div>
          )}

          {/* Courses Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">
                Your Courses 
                <span className="text-sm font-normal text-base-content/60 ml-2">
                  ({filteredCourses.length} {filteredCourses.length === 1 ? 'course' : 'courses'})
                </span>
              </h2>
            </div>

            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredCourses.map(course => (
                  <div key={course.id} className="bg-base-100 rounded-box border border-base-300 shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    {/* Course Header */}
                    <div className="p-6 border-b border-base-300">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold">{course.title}</h3>
                            <div className={`badge ${course.status.color}`}>
                              {course.status.label}
                            </div>
                            {course.isAPCourse && (
                              <div className="badge badge-accent badge-outline">AP Course</div>
                            )}
                          </div>
                          {course.description && (
                            <p className="text-sm text-base-content/70 line-clamp-2 mb-3">
                              {course.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Overall Progress</span>
                          <span className="text-sm text-base-content/70">{course.progress}%</span>
                        </div>
                        <progress 
                          className={`progress w-full ${
                            course.progress >= 100 ? 'progress-success' : 
                            course.progress >= 50 ? 'progress-primary' : 'progress-warning'
                          }`} 
                          value={course.progress} 
                          max="100"
                        ></progress>
                      </div>

                      {/* Course Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-semibold text-primary">{course.stats.completedUnits}/{course.stats.totalUnits}</div>
                          <div className="text-xs text-base-content/60">Units</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-secondary">{course.stats.completedLessons}/{course.stats.totalLessons}</div>
                          <div className="text-xs text-base-content/60">Lessons</div>
                        </div>
                        <div className="text-center">
                          <div className="font-semibold text-accent">{course.stats.completedExams}/{course.stats.totalExams}</div>
                          <div className="text-xs text-base-content/60">Exams</div>
                        </div>
                        <div className="text-center">
                          <div className={`font-semibold ${course.stats.averageExamScore >= 70 ? 'text-success' : 'text-warning'}`}>
                            {course.stats.averageExamScore}%
                          </div>
                          <div className="text-xs text-base-content/60">Avg Score</div>
                        </div>
                      </div>
                    </div>

                    {/* Next Action */}
                    {course.nextItem && (
                      <div className="p-4 bg-primary/5 border-b border-base-300">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-sm">Continue Learning</h4>
                            <p className="text-xs text-base-content/70">
                              {course.nextItem.type === 'lesson' ? 'Next Lesson' : 'Available Exam'}: {course.nextItem.item.title}
                            </p>
                          </div>
                          <Link 
                            href={course.nextItem.link}
                            className="btn btn-primary btn-sm gap-2"
                          >
                            {course.nextItem.type === 'lesson' ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-6-3a3 3 0 106 0v2a3 3 0 11-6 0v-2z" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                            )}
                            Continue
                          </Link>
                        </div>
                      </div>
                    )}

                    {/* Units Overview */}
                    <div className="p-6">
                      <h4 className="font-semibold mb-4">Units</h4>
                      <div className="space-y-3">
                        {course.units.slice(0, 4).map(unit => (
                          <div key={unit.id} className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              unit.status === 'completed' ? 'bg-success text-success-content' :
                              unit.status === 'in-progress' ? 'bg-primary text-primary-content' :
                              'bg-base-300 text-base-content/50'
                            }`}>
                              {unit.status === 'completed' ? (
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                              ) : (
                                unit.order
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{unit.title}</span>
                                <span className="text-xs text-base-content/60">{unit.progress}%</span>
                              </div>
                              <div className="text-xs text-base-content/60">
                                {unit.completedLessons}/{unit.lessonCount} lessons • {unit.completedExams}/{unit.examCount} exams
                              </div>
                            </div>
                          </div>
                        ))}
                        
                        {course.units.length > 4 && (
                          <div className="text-center mt-3">
                            <span className="text-sm text-base-content/60">
                              +{course.units.length - 4} more units
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Recent Activity */}
                    {course.recentActivity.length > 0 && (
                      <div className="p-6 border-t border-base-300 bg-base-50">
                        <h4 className="font-semibold mb-3 text-sm">Recent Activity</h4>
                        <div className="space-y-2">
                          {course.recentActivity.map((activity, index) => (
                            <Link
                              key={index}
                              href={activity.link}
                              className="flex items-center justify-between p-2 hover:bg-base-100 rounded transition-colors"
                            >
                              <div>
                                <div className="text-xs font-medium">{activity.title}</div>
                                <div className="text-xs text-base-content/60">
                                  {activity.unit} • {new Date(activity.date).toLocaleDateString()}
                                </div>
                              </div>
                              {activity.score && (
                                <div className={`badge badge-xs ${
                                  activity.score >= 70 ? 'badge-success' : 'badge-error'
                                }`}>
                                  {Math.round(activity.score)}%
                                </div>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="p-6 border-t border-base-300 bg-base-50">
                      <div className="flex gap-2">
                        <Link 
                          href={`/student/courses/${course.id}`}
                          className="btn btn-primary btn-sm flex-1 gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          View Course
                        </Link>
                        <Link 
                          href={`/student/courses/${course.id}/exams`}
                          className="btn btn-outline btn-secondary btn-sm gap-2"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                          Exams ({course.stats.availableExams})
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-base-100 rounded-box border border-base-300 shadow-lg p-12 text-center">
                <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">No Courses Found</h3>
                <p className="text-base-content/70 mb-4">
                  {statusFilter !== 'all' 
                    ? 'No courses match your current filter. Try adjusting the filter above.'
                    : 'You haven\'t enrolled in any courses yet. Contact your instructor to get started.'
                  }
                </p>
                {statusFilter !== 'all' && (
                  <Link href="/student/my-courses" className="btn btn-primary">
                    Show All Courses
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );

  } catch (error) {
    console.error('Error loading courses:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="bg-base-100 rounded-box shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-error mb-2">Error Loading Courses</h1>
          <p className="text-base-content/70 mb-4">Failed to load your course data.</p>
          <Link href="/dashboard" className="btn btn-primary">Return to Dashboard</Link>
        </div>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}
