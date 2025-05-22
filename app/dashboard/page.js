import Link from 'next/link';
import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';

export default async function Dashboard() {
  const session = await auth();
  
  // Redirect to sign-in if not authenticated
  if (!session) {
    redirect('/signin');
  }

  const user = session.user;

  // Sample progress data - in a real app, this would come from your database
  const progressData = {
    unitsCompleted: 3,
    totalUnits: 10,
    lessonsCompleted: 15,
    totalLessons: 40,
    currentUnit: "Dynamics",
    nextLesson: "Newton's Second Law Applications",
    studyStreak: 7,
    averageScore: 87,
    timeSpent: "24.5 hours"
  };

  const recentActivity = [
    { type: "lesson", title: "Forces and Motion", unit: "Dynamics", date: "2 hours ago", score: 92 },
    { type: "quiz", title: "Kinematics Quiz", unit: "Kinematics", date: "1 day ago", score: 85 },
    { type: "assignment", title: "Projectile Motion Problems", unit: "Kinematics", date: "2 days ago", score: 90 },
    { type: "lesson", title: "Vector Addition", unit: "Kinematics", date: "3 days ago", score: 88 }
  ];

  const upcomingDeadlines = [
    { title: "Unit 3 Test: Dynamics", date: "Nov 15, 2024", type: "exam", priority: "high" },
    { title: "Lab Report: Friction Analysis", date: "Nov 20, 2024", type: "lab", priority: "medium" },
    { title: "Problem Set 4", date: "Nov 25, 2024", type: "homework", priority: "low" }
  ];

  const courseTopics = [
    { number: 1, title: "Kinematics", progress: 100, status: "completed" },
    { number: 2, title: "Dynamics", progress: 60, status: "current" },
    { number: 3, title: "Circular Motion", progress: 0, status: "locked" },
    { number: 4, title: "Energy", progress: 0, status: "locked" },
    { number: 5, title: "Momentum", progress: 0, status: "locked" },
    { number: 6, title: "Simple Harmonic Motion", progress: 0, status: "locked" }
  ];

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
              <div className="badge badge-success badge-sm">Above Target</div>
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
              <div className="badge badge-accent badge-sm">Keep it up!</div>
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
              <div className="text-xs text-base-content/60">This month</div>
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
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="badge badge-primary">Unit 2</div>
                      <h3 className="font-semibold">{progressData.currentUnit}</h3>
                    </div>
                    <h4 className="text-lg font-medium mb-2">{progressData.nextLesson}</h4>
                    <p className="text-base-content/70 mb-4">
                      Explore how to apply Newton's second law in complex scenarios with multiple forces and accelerations.
                    </p>
                    <div className="flex gap-3">
                      <Link href="/learn/dynamics/newtons-second-law" className="btn btn-primary gap-2">
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
                      <div className="text-3xl font-bold text-primary mb-1">60%</div>
                      <div className="text-sm text-base-content/70 mb-3">Unit Progress</div>
                      <progress className="progress progress-primary w-full" value="60" max="100"></progress>
                    </div>
                  </div>
                </div>
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
                <p className="text-base-content/70 mt-1">Track your progress through AP Physics 1</p>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {courseTopics.map((topic) => (
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
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 hover:bg-base-200/50 rounded-box transition-colors duration-200">
                      <div className={`w-10 h-10 rounded-btn flex items-center justify-center ${
                        activity.type === 'lesson' ? 'bg-primary/10 text-primary' :
                        activity.type === 'quiz' ? 'bg-secondary/10 text-secondary' :
                        'bg-accent/10 text-accent'
                      }`}>
                        {activity.type === 'lesson' ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-6-3a3 3 0 106 0v2a3 3 0 11-6 0v-2z" />
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
                <Link href="/tutoring" className="btn btn-outline btn-primary btn-sm w-full justify-start gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Book Tutoring
                </Link>
                
                <Link href="/practice-tests" className="btn btn-outline btn-secondary btn-sm w-full justify-start gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Practice Test
                </Link>
                
                <Link href="/resources" className="btn btn-outline btn-accent btn-sm w-full justify-start gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Study Resources
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
            <div className="bg-gradient-to-br from-success/10 via-primary/5 to-secondary/10 rounded-box border border-success/20 p-6 text-center">
              <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-success mb-2">Great Progress!</h3>
              <p className="text-sm text-base-content/70 mb-3">You've maintained a 7-day study streak. Keep up the excellent work!</p>
              <div className="badge badge-success">Streak Master</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
