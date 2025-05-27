import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import LessonQuizClient from './LessonQuizClient';

const prisma = new PrismaClient();

export default async function LessonQuizPage({ params }) {
  const resolvedParams = await params;
  
  try {
    // Fetch course, unit, lesson, and quiz data
    const [course, unit, lesson] = await Promise.all([
      prisma.course.findUnique({
        where: { id: resolvedParams.id },
        select: {
          id: true,
          title: true,
          apExamType: true,
          description: true
        }
      }),
      prisma.unit.findUnique({
        where: { 
          id: resolvedParams.unitId,
          courseId: resolvedParams.id
        },
        select: {
          id: true,
          title: true,
          description: true,
          order: true
        }
      }),
      prisma.lesson.findUnique({
        where: {
          id: resolvedParams.lessonId,
          unitId: resolvedParams.unitId
        },
        include: {
          lessonQuizzes: {
            include: {
              attempts: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true
                    }
                  }
                },
                orderBy: { completedAt: 'desc' }
              },
              _count: {
                select: {
                  attempts: true
                }
              }
            }
          }
        }
      })
    ]);

    if (!course || !unit || !lesson) {
      notFound();
    }

    // Process quiz data and calculate stats
    let quizWithStats = null;
    if (lesson.lessonQuizzes) {
      const quiz = lesson.lessonQuizzes;
      const completedAttempts = quiz.attempts || [];
      const passedAttempts = completedAttempts.filter(attempt => attempt.passed);
      const averageScore = completedAttempts.length > 0 
        ? completedAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / completedAttempts.length
        : 0;

      // Parse questions to get count
      let questionCount = 0;
      try {
        if (quiz.questions && Array.isArray(quiz.questions)) {
          questionCount = quiz.questions.length;
        } else if (quiz.questions && typeof quiz.questions === 'object') {
          // Handle different question format structures
          questionCount = Object.keys(quiz.questions).length;
        }
      } catch (error) {
        console.error('Error parsing questions for quiz:', quiz.id, error);
      }

      quizWithStats = {
        ...quiz,
        stats: {
          totalAttempts: quiz._count?.attempts || 0,
          completedAttempts: completedAttempts.length,
          passedAttempts: passedAttempts.length,
          passRate: completedAttempts.length > 0 ? (passedAttempts.length / completedAttempts.length) * 100 : 0,
          averageScore: Math.round(averageScore * 100) / 100,
          questionCount,
          averageTimeSpent: completedAttempts.length > 0 
            ? completedAttempts.reduce((sum, attempt) => sum + (attempt.timeSpent || 0), 0) / completedAttempts.length 
            : 0,
          lastAttempt: completedAttempts.length > 0 ? completedAttempts[0].completedAt : null,
          hasAttempts: (quiz._count?.attempts || 0) > 0
        },
        // Only include recent attempts for preview
        attempts: completedAttempts.slice(0, 5),
        _count: undefined
      };
    }

    return (
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link 
                href={`/admin/courses/${course.id}/units/${unit.id}/lessons`}
                className="btn btn-ghost btn-sm gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Lessons
              </Link>
              <div className="text-sm breadcrumbs">
                <ul>
                  <li><span className="text-base-content/60">{course.title}</span></li>
                  <li><span className="text-base-content/60">{unit.title}</span></li>
                  <li><span className="text-base-content/60">{lesson.title}</span></li>
                  <li>Quiz</li>
                </ul>
              </div>
            </div>
            <h1 className="text-3xl font-bold">Lesson Quiz</h1>
            <p className="text-base-content/70 mt-1">
              Manage quiz for "{lesson.title}"
            </p>
          </div>

          {!quizWithStats ? (
            <Link 
              href={`/admin/courses/${course.id}/units/${unit.id}/lessons/${lesson.id}/quiz/create`}
              className="btn btn-primary gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Create Quiz
            </Link>
          ) : (
            <div className="flex gap-2">
              <Link 
                href={`/admin/courses/${course.id}/units/${unit.id}/lessons/${lesson.id}/quiz/edit`}
                className="btn btn-secondary gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Quiz
              </Link>
              <Link 
                href={`/admin/courses/${course.id}/units/${unit.id}/lessons/${lesson.id}/quiz/preview`}
                className="btn btn-ghost gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview
              </Link>
            </div>
          )}
        </div>

        {/* Lesson Context */}
        <div className="bg-base-100 rounded-box border border-base-300 shadow-sm p-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-box flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-lg">{lesson.title}</h3>
              <p className="text-base-content/70 text-sm">
                {lesson.description || 'No description available'}
              </p>
              <div className="flex items-center gap-4 mt-1 text-xs text-base-content/60">
                <span>Unit: {unit.title}</span>
                <span>•</span>
                <span>Course: {course.title}</span>
                {lesson.duration && (
                  <>
                    <span>•</span>
                    <span>{lesson.duration} min duration</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {!quizWithStats ? (
          /* No Quiz State */
          <div className="bg-base-100 rounded-box border border-base-300 shadow-xl">
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">No Quiz Created</h3>
              <p className="text-base-content/70 mb-6 max-w-md mx-auto">
                Create a quiz to assess student understanding of this lesson's content.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link 
                  href={`/admin/courses/${course.id}/units/${unit.id}/lessons/${lesson.id}/quiz/create`}
                  className="btn btn-primary gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Create Quiz
                </Link>
                <button className="btn btn-ghost gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Quiz Guidelines
                </button>
              </div>
              
              <div className="mt-8 p-4 bg-info/5 border border-info/20 rounded-box max-w-2xl mx-auto">
                <h4 className="font-medium text-info mb-2">Quiz Best Practices</h4>
                <ul className="text-sm text-base-content/70 text-left space-y-1">
                  <li>• Keep quizzes short (5-10 questions) to maintain engagement</li>
                  <li>• Set a reasonable passing score (70-80%)</li>
                  <li>• Include a mix of question types when possible</li>
                  <li>• Provide clear explanations for correct answers</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          /* Quiz Exists */
          <>
            {/* Quiz Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="stat bg-base-100 border border-base-300 rounded-box shadow-sm">
                <div className="stat-figure">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="stat-title">Questions</div>
                <div className="stat-value text-primary">{quizWithStats.stats.questionCount}</div>
                <div className="stat-desc">Passing: {quizWithStats.passingScore}%</div>
              </div>

              <div className="stat bg-base-100 border border-base-300 rounded-box shadow-sm">
                <div className="stat-figure">
                  <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="stat-title">Attempts</div>
                <div className="stat-value text-secondary">{quizWithStats.stats.totalAttempts}</div>
                <div className="stat-desc">{quizWithStats.stats.completedAttempts} completed</div>
              </div>

              <div className="stat bg-base-100 border border-base-300 rounded-box shadow-sm">
                <div className="stat-figure">
                  <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="stat-title">Pass Rate</div>
                <div className="stat-value text-success">{Math.round(quizWithStats.stats.passRate)}%</div>
                <div className="stat-desc">{quizWithStats.stats.passedAttempts} passed</div>
              </div>

              <div className="stat bg-base-100 border border-base-300 rounded-box shadow-sm">
                <div className="stat-figure">
                  <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <div className="stat-title">Avg Score</div>
                <div className="stat-value text-accent">{quizWithStats.stats.averageScore}%</div>
                <div className="stat-desc">
                  {quizWithStats.stats.averageTimeSpent > 0 && 
                    `${Math.round(quizWithStats.stats.averageTimeSpent)} min avg`
                  }
                </div>
              </div>
            </div>

            {/* Quiz Details and Management */}
            <div className="bg-base-100 rounded-box border border-base-300 shadow-xl">
              {/* Quiz Header */}
              <div className="p-6 border-b border-base-300">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-xl font-semibold">{quizWithStats.title}</h2>
                      <div className={`badge ${quizWithStats.isPublished ? 'badge-success' : 'badge-warning'}`}>
                        {quizWithStats.isPublished ? 'Published' : 'Draft'}
                      </div>
                    </div>
                    <p className="text-base-content/70 text-sm">
                      {quizWithStats.description || 'No description provided'}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-base-content/60">
                      <span>Created: {new Date(quizWithStats.createdAt).toLocaleDateString()}</span>
                      {quizWithStats.updatedAt !== quizWithStats.createdAt && (
                        <>
                          <span>•</span>
                          <span>Updated: {new Date(quizWithStats.updatedAt).toLocaleDateString()}</span>
                        </>
                      )}
                      {quizWithStats.stats.lastAttempt && (
                        <>
                          <span>•</span>
                          <span>Last attempt: {new Date(quizWithStats.stats.lastAttempt).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="dropdown dropdown-end">
                      <div tabIndex={0} role="button" className="btn btn-ghost btn-sm gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                        Actions
                      </div>
                      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border border-base-300">
                        <li>
                          <Link href={`/admin/courses/${course.id}/units/${unit.id}/lessons/${lesson.id}/quiz/edit`}>
                            Edit Quiz
                          </Link>
                        </li>
                        <li>
                          <Link href={`/admin/courses/${course.id}/units/${unit.id}/lessons/${lesson.id}/quiz/preview`}>
                            Preview Quiz
                          </Link>
                        </li>
                        <li><button className="text-sm">Export Results</button></li>
                        <li><button className="text-sm">Reset All Attempts</button></li>
                        <div className="divider my-0"></div>
                        <li><button className="text-sm text-error">Delete Quiz</button></li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quiz Content */}
              <div className="p-6">
                <LessonQuizClient 
                  quiz={quizWithStats}
                  lesson={lesson}
                  courseId={course.id}
                  unitId={unit.id}
                />
              </div>
            </div>
          </>
        )}

        {/* Quick Actions and Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Lesson Info */}
          <div className="bg-base-100 rounded-box border border-base-300 p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Lesson Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Publication Status:</span>
                <div className={`badge badge-xs ${lesson.isPublished ? 'badge-success' : 'badge-warning'}`}>
                  {lesson.isPublished ? 'Published' : 'Draft'}
                </div>
              </div>
              {lesson.duration && (
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">{lesson.duration} minutes</span>
                </div>
              )}
              {lesson.videoUrl && (
                <div className="flex justify-between">
                  <span>Has Video:</span>
                  <span className="text-success">✓</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Has Quiz:</span>
                <span className={quizWithStats ? 'text-success' : 'text-warning'}>
                  {quizWithStats ? '✓' : '✗'}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Activity or Quiz Tips */}
          <div className="bg-base-100 rounded-box border border-base-300 p-4">
            {quizWithStats && quizWithStats.attempts.length > 0 ? (
              <>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Recent Attempts
                </h3>
                <div className="space-y-2">
                  {quizWithStats.attempts.slice(0, 4).map((attempt, index) => (
                    <div key={attempt.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${attempt.passed ? 'bg-success' : 'bg-error'}`}></div>
                        <span className="truncate max-w-32">{attempt.user.name || attempt.user.email}</span>
                      </div>
                      <div className="text-xs text-base-content/60 flex items-center gap-2">
                        <span className={attempt.passed ? 'text-success' : 'text-error'}>
                          {Math.round(attempt.score)}%
                        </span>
                        <span>•</span>
                        <span>{new Date(attempt.completedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                  {quizWithStats.attempts.length > 4 && (
                    <div className="text-xs text-base-content/50 text-center pt-2">
                      +{quizWithStats.attempts.length - 4} more attempts
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Quiz Tips
                </h3>
                <div className="space-y-2 text-sm text-base-content/70">
                  <div>• Keep questions focused on lesson objectives</div>
                  <div>• Use clear, unambiguous language</div>
                  <div>• Provide helpful feedback for wrong answers</div>
                  <div>• Test the quiz yourself before publishing</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );

  } catch (error) {
    console.error('Error loading lesson quiz page:', error);
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-error mb-2">Error Loading Quiz</h1>
          <p className="text-base-content/70 mb-4">Failed to load the lesson quiz page.</p>
          <Link href={`/admin/courses/${resolvedParams.id}/units/${resolvedParams.unitId}/lessons`} className="btn btn-primary btn-sm">
            Return to Lessons
          </Link>
        </div>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}
