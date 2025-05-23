import Link from 'next/link';
import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to calculate days between dates
function daysBetween(date1, date2) {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((date2 - date1) / oneDay);
}

// Helper function to calculate study streak
function calculateStudyStreak(attempts) {
  if (!attempts.length) return 0;
  
  const today = new Date();
  const dates = [...new Set(attempts.map(attempt => 
    new Date(attempt.completedAt || attempt.startedAt).toDateString()
  ))].sort((a, b) => new Date(b) - new Date(a));
  
  let streak = 0;
  let currentDate = new Date(today);
  
  for (const dateStr of dates) {
    const attemptDate = new Date(dateStr);
    const daysDiff = daysBetween(attemptDate, currentDate);
    
    if (daysDiff <= 1) {
      streak++;
      currentDate = attemptDate;
    } else {
      break;
    }
  }
  
  return streak;
}

export default async function Dashboard() {
  const session = await auth();
  
  // Redirect to sign-in if not authenticated
  if (!session) {
    redirect('/signin');
  }

  const user = session.user;
  const userId = user.id;

  try {
    // Fetch user's enrollments with course data
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            units: {
              include: {
                lessons: true,
                unitExams: true
              },
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    });

    // Fetch quiz attempts
    const quizAttempts = await prisma.quizAttempt.findMany({
      where: { userId },
      include: {
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

    // Fetch exam attempts
    const examAttempts = await prisma.examAttempt.findMany({
      where: { userId },
      include: {
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

    // Calculate progress data
    let totalUnits = 0;
    let completedUnits = 0;
    let totalLessons = 0;
    let completedLessons = 0;
    let totalTimeSpent = 0;
    const allScores = [];
    const courseProgress = [];

    enrollments.forEach(enrollment => {
      const progress = enrollment.progress || {};
      const course = enrollment.course;
      
      totalUnits += course.units.length;
      
      course.units.forEach(unit => {
        totalLessons += unit.lessons.length;
        
        // Check if unit is completed (you can adjust this logic)
        const unitProgress = progress[`unit_${unit.id}`];
        if (unitProgress?.completed) {
          completedUnits++;
        }
        
        unit.lessons.forEach(lesson => {
          const lessonProgress = progress[`lesson_${lesson.id}`];
          if (lessonProgress?.completed) {
            completedLessons++;
          }
        });
      });

      // Build course progress for display
      courseProgress.push({
        courseId: course.id,
        title: course.title,
        apExamType: course.apExamType,
        units: course.units.map((unit, index) => {
          const unitProgress = progress[`unit_${unit.id}`];
          const lessonCount = unit.lessons.length;
          const completedLessonCount = unit.lessons.filter(lesson => 
            progress[`lesson_${lesson.id}`]?.completed
          ).length;
          
          return {
            number: index + 1,
            id: unit.id,
            title: unit.title,
            progress: lessonCount > 0 ? Math.round((completedLessonCount / lessonCount) * 100) : 0,
            status: unitProgress?.completed ? 'completed' : 
                    unitProgress?.started ? 'current' : 'locked'
          };
        })
      });
    });

    // Collect scores and time spent
    quizAttempts.forEach(attempt => {
      allScores.push(attempt.score);
      if (attempt.timeSpent) totalTimeSpent += attempt.timeSpent;
    });

    examAttempts.forEach(attempt => {
      allScores.push(attempt.score);
      if (attempt.timeSpent) totalTimeSpent += attempt.timeSpent;
    });

    // Calculate averages and streaks
    const averageScore = allScores.length > 0 ? 
      Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length) : 0;
    
    const allAttempts = [...quizAttempts, ...examAttempts];
    const studyStreak = calculateStudyStreak(allAttempts);

    // Convert time spent to hours
    const timeSpentHours = (totalTimeSpent / 3600).toFixed(1);

    // Find current course and lesson
    let currentCourse = null;
    let currentUnit = null;
    let nextLesson = null;

    for (const enrollment of enrollments) {
      const progress = enrollment.progress || {};
      for (const unit of enrollment.course.units) {
        const unitProgress = progress[`unit_${unit.id}`];
        if (unitProgress?.started && !unitProgress?.completed) {
          currentCourse = enrollment.course;
          currentUnit = unit;
          
          // Find next incomplete lesson
          for (const lesson of unit.lessons) {
            const lessonProgress = progress[`lesson_${lesson.id}`];
            if (!lessonProgress?.completed) {
              nextLesson = lesson;
              break;
            }
          }
          break;
        }
      }
      if (currentUnit) break;
    }

    // Build recent activity
    const recentActivity = [...quizAttempts.slice(0, 4).map(attempt => ({
      type: 'quiz',
      title: attempt.lessonQuiz.lesson.title,
      unit: attempt.lessonQuiz.lesson.unit.title,
      course: attempt.lessonQuiz.lesson.unit.course.title,
      date: new Date(attempt.completedAt).toLocaleDateString(),
      score: Math.round(attempt.score)
    })), ...examAttempts.slice(0, 2).map(attempt => ({
      type: 'exam',
      title: attempt.unitExam.title,
      unit: attempt.unitExam.unit.title,
      course: attempt.unitExam.unit.course.title,
      date: new Date(attempt.startedAt).toLocaleDateString(),
      score: Math.round(attempt.score)
    }))].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);

    // Mock upcoming deadlines (you can enhance this based on your course structure)
    const upcomingDeadlines = [
      { title: "Unit 3 Test: Dynamics", date: "Nov 15, 2024", type: "exam", priority: "high" },
      { title: "Lab Report: Friction Analysis", date: "Nov 20, 2024", type: "lab", priority: "medium" },
      { title: "Problem Set 4", date: "Nov 25, 2024", type: "homework", priority: "low" }
    ];

    const progressData = {
      unitsCompleted: completedUnits,
      totalUnits: totalUnits || 1,
      lessonsCompleted: completedLessons,
      totalLessons: totalLessons || 1,
      currentUnit: currentUnit?.title || "No active unit",
      currentCourse: currentCourse?.title || "No active course",
      nextLesson: nextLesson?.title || "No next lesson",
      studyStreak,
      averageScore,
      timeSpent: totalTimeSpent > 0 ? `${timeSpentHours} hours` : "0 hours"
    };

    // Get the first course's units for the course progress section
    const displayUnits = courseProgress.length > 0 ? courseProgress[0].units : [];

    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/30 to-primary/5 relative">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/3 rounded-full blur-3xl"></div>
        </div>

        {/* Dashboard Header */}
        <div className="relative z-10 bg-base-100/80 backdrop-blur-sm border-b border-base-300 sticky top-16">
          <div className="container mx-auto max-w-7xl px-6 py-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="avatar">
                  <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    {user?.image ? (
                      <img src={user.image} alt={user.name || 'User'} />
                    ) : (
                      <div className="bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold">
                    Welcome back, {user?.name?.split(' ')[0] || 'Student'}!
                  </h1>
                  <p className="text-base-content/70">Ready to continue your AP Physics journey?</p>
                </div>
              </div>
              
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

        <div className="relative z-10 container mx-auto max-w-7xl px-6 py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-base-100 rounded-box border border-base-300 p-6 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base-content/70 text-sm font-medium">Units Completed</p>
                  <p className="text-2xl font-bold text-primary">{progressData.unitsCompleted}/{progressData.totalUnits}</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-btn flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-base-content/60 mb-1">
                  <span>Progress</span>
                  <span>{Math.round((progressData.unitsCompleted / progressData.totalUnits) * 100)}%</span>
                </div>
                <progress className="progress progress-primary w-full" value={progressData.unitsCompleted} max={progressData.totalUnits}></progress>
              </div>
            </div>

            <div className="bg-base-100 rounded-box border border-base-300 p-6 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base-content/70 text-sm font-medium">Average Score</p>
                  <p className="text-2xl font-bold text-secondary">{progressData.averageScore}%</p>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-btn flex items-center justify-center">
                  <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="mt-3">
                <div className={`badge badge-sm ${progressData.averageScore >= 80 ? 'badge-success' : progressData.averageScore >= 70 ? 'badge-warning' : 'badge-error'}`}>
                  {progressData.averageScore >= 80 ? 'Above Target' : progressData.averageScore >= 70 ? 'On Target' : 'Needs Improvement'}
                </div>
              </div>
            </div>

            <div className="bg-base-100 rounded-box border border-base-300 p-6 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base-content/70 text-sm font-medium">Study Streak</p>
                  <p className="text-2xl font-bold text-accent">{progressData.studyStreak} days</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-btn flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="mt-3">
                <div className="badge badge-accent badge-sm">
                  {progressData.studyStreak > 7 ? 'Amazing!' : progressData.studyStreak > 3 ? 'Keep it up!' : 'Getting started'}
                </div>
              </div>
            </div>

            <div className="bg-base-100 rounded-box border border-base-300 p-6 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base-content/70 text-sm font-medium">Time Studied</p>
                  <p className="text-2xl font-bold text-info">{progressData.timeSpent}</p>
                </div>
                <div className="w-12 h-12 bg-info/10 rounded-btn flex items-center justify-center">
                  <svg className="w-6 h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-xs text-base-content/60">Total time</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8">
              {/* Continue Learning Section */}
              <div className="bg-base-100 rounded-box border border-base-300 shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 p-6 border-b border-base-300">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-6-3a3 3 0 106 0v2a3 3 0 11-6 0v-2z" />
                    </svg>
                    Continue Learning
                  </h2>
                  <p className="text-base-content/70 mt-1">Pick up where you left off</p>
                </div>
                <div className="p-6">
                  {currentUnit && nextLesson ? (
                    <div className="flex flex-col sm:flex-row gap-6 items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="badge badge-primary">{currentCourse?.title || 'Course'}</div>
                          <h3 className="font-semibold">{progressData.currentUnit}</h3>
                        </div>
                        <h4 className="text-lg font-medium mb-2">{progressData.nextLesson}</h4>
                        <p className="text-base-content/70 mb-4">
                          Continue with your next lesson in {progressData.currentUnit}.
                        </p>
                        <div className="flex gap-3">
                          <Link href={`/courses/${currentCourse?.id}/units/${currentUnit.id}/lessons/${nextLesson.id}`} className="btn btn-primary gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-6-3a3 3 0 106 0v2a3 3 0 11-6 0v-2z" />
                            </svg>
                            Continue Lesson
                          </Link>
                          <Link href="/courses" className="btn btn-outline btn-secondary gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            All Courses
                          </Link>
                        </div>
                      </div>
                      <div className="w-full sm:w-48">
                        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-box p-4 text-center">
                          <div className="text-3xl font-bold text-primary mb-1">
                            {displayUnits.find(u => u.status === 'current')?.progress || 0}%
                          </div>
                          <div className="text-sm text-base-content/70 mb-3">Unit Progress</div>
                          <progress className="progress progress-primary w-full" value={displayUnits.find(u => u.status === 'current')?.progress || 0} max="100"></progress>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="text-base-content/70 mb-4">No active courses found</div>
                      <Link href="/courses" className="btn btn-primary">Browse Courses</Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Course Progress Section */}
              <div className="bg-base-100 rounded-box border border-base-300 shadow-xl">
                <div className="p-6 border-b border-base-300">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Course Progress
                  </h2>
                  <p className="text-base-content/70 mt-1">
                    {courseProgress.length > 0 ? `Track your progress through ${courseProgress[0].title}` : 'No enrolled courses'}
                  </p>
                </div>
                <div className="p-6">
                  {displayUnits.length > 0 ? (
                    <div className="space-y-4">
                      {displayUnits.map((topic) => (
                        <div key={topic.number} 
                             className={`flex items-center gap-4 p-4 rounded-box border transition-all duration-200 ${
                               topic.status === 'completed' ? 'bg-success/5 border-success/20' :
                               topic.status === 'current' ? 'bg-primary/5 border-primary/20' :
                               'bg-base-200/50 border-base-300'
                             }`}>
                          <div className={`w-10 h-10 rounded-btn flex items-center justify-center font-bold ${
                            topic.status === 'completed' ? 'bg-success text-success-content' :
                            topic.status === 'current' ? 'bg-primary text-primary-content' :
                            'bg-base-300 text-base-content/50'
                          }`}>
                            {topic.status === 'completed' ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                            ) : topic.status === 'locked' ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            ) : (
                              topic.number
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">{topic.title}</h3>
                              <div className={`badge badge-sm ${
                                topic.status === 'completed' ? 'badge-success' :
                                topic.status === 'current' ? 'badge-primary' :
                                'badge-ghost'
                              }`}>
                                {topic.status === 'completed' ? 'Completed' :
                                 topic.status === 'current' ? 'In Progress' :
                                 'Locked'}
                              </div>
                            </div>
                            {topic.status !== 'locked' && (
                              <div className="flex items-center gap-2">
                                <progress className={`progress w-full ${
                                  topic.status === 'completed' ? 'progress-success' : 'progress-primary'
                                }`} value={topic.progress} max="100"></progress>
                                <span className="text-xs text-base-content/60 min-w-[3rem]">{topic.progress}%</span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-base-content/70">
                      No course progress to display. Enroll in a course to get started!
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-base-100 rounded-box border border-base-300 shadow-xl">
                <div className="p-6 border-b border-base-300">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Recent Activity
                  </h2>
                  <p className="text-base-content/70 mt-1">Your latest learning activities</p>
                </div>
                <div className="p-6">
                  {recentActivity.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 hover:bg-base-200/50 rounded-box transition-colors duration-200">
                          <div className={`w-10 h-10 rounded-btn flex items-center justify-center ${
                            activity.type === 'quiz' ? 'bg-secondary/10 text-secondary' :
                            activity.type === 'exam' ? 'bg-accent/10 text-accent' :
                            'bg-primary/10 text-primary'
                          }`}>
                            {activity.type === 'quiz' ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            ) : activity.type === 'exam' ? (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-6-3a3 3 0 106 0v2a3 3 0 11-6 0v-2z" />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">{activity.title}</h3>
                              <div className="flex items-center gap-2">
                                <div className={`badge badge-sm ${
                                  activity.score >= 90 ? 'badge-success' :
                                  activity.score >= 80 ? 'badge-warning' :
                                  'badge-error'
                                }`}>
                                  {activity.score}%
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-base-content/70">
                              <span>{activity.unit}</span>
                              <span>•</span>
                              <span>{activity.date}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-base-content/70">
                      No recent activity. Start learning to see your progress here!
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Deadlines */}
              <div className="bg-base-100 rounded-box border border-base-300 shadow-xl">
                <div className="p-6 border-b border-base-300">
                  <h3 className="font-bold flex items-center gap-2">
                    <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Upcoming Deadlines
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {upcomingDeadlines.map((deadline, index) => (
                      <div key={index} className={`border-l-4 pl-4 py-2 ${
                        deadline.priority === 'high' ? 'border-error' :
                        deadline.priority === 'medium' ? 'border-warning' :
                        'border-info'
                      }`}>
                        <h4 className="font-medium text-sm">{deadline.title}</h4>
                        <p className="text-xs text-base-content/70">{deadline.date}</p>
                        <div className={`badge badge-xs mt-1 ${
                          deadline.priority === 'high' ? 'badge-error' :
                          deadline.priority === 'medium' ? 'badge-warning' :
                          'badge-info'
                        }`}>
                          {deadline.type}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

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
                  <Link href="/courses" className="btn btn-outline btn-primary btn-sm w-full justify-start gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Browse Courses
                  </Link>
                  
                  <Link href="/tutoring" className="btn btn-outline btn-secondary btn-sm w-full justify-start gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Book Tutoring
                  </Link>
                  
                  <Link href="/practice-tests" className="btn btn-outline btn-accent btn-sm w-full justify-start gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Practice Test
                  </Link>
                  
                  <Link href="/help" className="btn btn-outline btn-info btn-sm w-full justify-start gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Get Help
                  </Link>
                </div>
              </div>

              {/* Achievement Badge */}
              {progressData.studyStreak >= 7 && (
                <div className="bg-gradient-to-br from-success/10 via-primary/5 to-secondary/10 rounded-box border border-success/20 p-6 text-center">
                  <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-success mb-2">Great Progress!</h3>
                  <p className="text-sm text-base-content/70 mb-3">
                    You've maintained a {progressData.studyStreak}-day study streak. Keep up the excellent work!
                  </p>
                  <div className="badge badge-success">Streak Master</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );

  } catch (error) {
    console.error('Dashboard error:', error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-error mb-2">Error Loading Dashboard</h1>
          <p className="text-base-content/70 mb-4">We encountered an error while loading your dashboard.</p>
          <Link href="/courses" className="btn btn-primary">Browse Courses</Link>
        </div>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}
