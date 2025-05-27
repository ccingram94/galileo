import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import ExamResultsDisplay from './ExamResultsDisplay';
import ScoreBreakdownChart from './ScoreBreakdownChart';
import PerformanceAnalytics from './PerformanceAnalytics';

const prisma = new PrismaClient();

export const metadata = {
  title: 'Assessment Results',
  description: 'View your exam scores and feedback'
};

export default async function ExamResultsPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  // Get user session
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/auth/signin');
  }

  try {
    // Get attemptId from search params or find latest attempt
    const attemptId = resolvedSearchParams.attemptId;
    
    // Fetch exam with attempts
    const exam = await prisma.unitExam.findUnique({
      where: { id: resolvedParams.examId },
      include: {
        unit: {
          include: {
            course: {
              include: {
                enrollments: {
                  where: { userId: session.user.id },
                  select: { id: true, status: true }
                }
              }
            }
          }
        },
        attempts: {
          where: { userId: session.user.id },
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: { name: true, email: true }
            }
          }
        }
      }
    });

    if (!exam) {
      notFound();
    }

    // Verify user enrollment
    const enrollment = exam.unit.course.enrollments[0];
    if (!enrollment) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
          <div className="bg-base-100 rounded-box shadow-xl p-8 max-w-md text-center">
            <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-error mb-2">Access Denied</h1>
            <p className="text-base-content/70">You are not enrolled in this course.</p>
          </div>
        </div>
      );
    }

    // Find the specific attempt or get the latest one
    let currentAttempt;
    if (attemptId) {
      currentAttempt = exam.attempts.find(attempt => attempt.id === attemptId);
      if (!currentAttempt) {
        notFound();
      }
    } else {
      currentAttempt = exam.attempts[0]; // Latest attempt
    }

    // If no attempts exist, redirect to exam
    if (!currentAttempt) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
          <div className="bg-base-100 rounded-box shadow-xl p-8 max-w-md text-center">
            <div className="w-16 h-16 bg-info/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">No Results Available</h1>
            <p className="text-base-content/70 mb-4">You haven't taken this exam yet.</p>
            <Link href={`/student/exams/${exam.id}/attempt`} className="btn btn-primary">
              Take Exam
            </Link>
          </div>
        </div>
      );
    }

    // If attempt is not completed, redirect to continue exam
    if (!currentAttempt.completedAt) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
          <div className="bg-base-100 rounded-box shadow-xl p-8 max-w-md text-center">
            <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-warning mb-2">Exam In Progress</h1>
            <p className="text-base-content/70 mb-4">
              You have an incomplete exam attempt. You must complete it to see results.
            </p>
            <Link href={`/student/exams/${exam.id}/attempt`} className="btn btn-primary">
              Continue Exam
            </Link>
          </div>
        </div>
      );
    }

    // Calculate statistics
    const completedAttempts = exam.attempts.filter(attempt => attempt.completedAt);
    const examStats = calculateExamStats(exam, completedAttempts);
    const attemptStats = calculateAttemptStats(currentAttempt, completedAttempts);
    const performanceData = calculatePerformanceData(currentAttempt, exam);
    
    // Determine if this is AP Precalculus
    const isAPPrecalculus = exam.unit.course.apExamType === 'AP-PRECALCULUS';

    return (
      <div className="min-h-screen bg-base-200 py-8">
        <div className="max-w-7xl mx-auto px-4 space-y-6">
          
          {/* Header */}
          <div className="flex items-start justify-between">
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
                    <li><span className="text-base-content/60">{exam.unit.course.title}</span></li>
                    <li><span className="text-base-content/60">{exam.unit.title}</span></li>
                    <li><span className="text-base-content/60">{exam.title}</span></li>
                    <li>Results</li>
                  </ul>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold">Assessment Results</h1>
              <p className="text-base-content/70 mt-1">
                {exam.title} • Completed {new Date(currentAttempt.completedAt).toLocaleDateString()}
                {isAPPrecalculus && ' • AP Precalculus Format'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Attempt Selector */}
              {completedAttempts.length > 1 && (
                <select 
                  className="select select-bordered select-sm"
                  value={currentAttempt.id}
                  onChange={(e) => {
                    const newAttemptId = e.target.value;
                    window.location.href = `/student/exams/${exam.id}/results?attemptId=${newAttemptId}`;
                  }}
                >
                  {completedAttempts.map((attempt, index) => (
                    <option key={attempt.id} value={attempt.id}>
                      Attempt {completedAttempts.length - index} ({Math.round(attempt.score || 0)}%)
                    </option>
                  ))}
                </select>
              )}

              {/* Action Buttons */}
              <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-sm gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                  Actions
                </div>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <button onClick={() => window.print()}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                      </svg>
                      Print Results
                    </button>
                  </li>
                  {completedAttempts.length < exam.maxAttempts && (
                    <li>
                      <Link href={`/student/exams/${exam.id}/attempt`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Retake Exam
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link href={`/student/courses/${exam.unit.courseId}/exams`}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                      All Course Exams
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Score Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Final Score */}
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat">
                <div className="stat-figure">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    currentAttempt.passed ? 'bg-success/20 text-success' : 'bg-error/20 text-error'
                  }`}>
                    {currentAttempt.passed ? (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="stat-title">Final Score</div>
                <div className={`stat-value text-3xl ${
                  currentAttempt.passed ? 'text-success' : 'text-error'
                }`}>
                  {Math.round(currentAttempt.score || 0)}%
                </div>
                <div className="stat-desc">
                  {currentAttempt.pointsEarned}/{currentAttempt.totalPoints} points • 
                  {currentAttempt.passed ? ' Passed' : ' Did not pass'}
                </div>
              </div>
            </div>

            {/* Time Used */}
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat">
                <div className="stat-figure">
                  <svg className="w-8 h-8 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="stat-title">Time Used</div>
                <div className="stat-value text-info text-3xl">
                  {currentAttempt.timeUsed || 0}
                </div>
                <div className="stat-desc">
                  minutes • {examStats.avgTime ? 
                    `${currentAttempt.timeUsed > examStats.avgTime ? 'Above' : 'Below'} average` :
                    'First attempt'
                  }
                </div>
              </div>
            </div>

            {/* Attempt Number */}
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat">
                <div className="stat-figure">
                  <svg className="w-8 h-8 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-1.414.586H7a4 4 0 01-4-4V7a4 4 0 014-4z" />
                  </svg>
                </div>
                <div className="stat-title">Attempt</div>
                <div className="stat-value text-warning text-3xl">
                  {attemptStats.attemptNumber}
                </div>
                <div className="stat-desc">
                  of {exam.maxAttempts} allowed • 
                  {attemptStats.attemptsRemaining > 0 ? 
                    ` ${attemptStats.attemptsRemaining} remaining` : 
                    ' No attempts remaining'
                  }
                </div>
              </div>
            </div>

            {/* Class Rank */}
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat">
                <div className="stat-figure">
                  <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div className="stat-title">Performance</div>
                <div className="stat-value text-accent text-2xl">
                  {attemptStats.percentile}%
                </div>
                <div className="stat-desc">
                  percentile • {attemptStats.rank} of {examStats.totalStudents} students
                </div>
              </div>
            </div>
          </div>

          {/* Results Display Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Results Display */}
            <div className="lg:col-span-2 space-y-6">
              {/* Score Breakdown */}
              <div className="bg-base-100 rounded-box border border-base-300 shadow-lg">
                <div className="p-6 border-b border-base-300">
                  <h2 className="text-xl font-bold flex items-center gap-3">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Score Breakdown
                  </h2>
                  <p className="text-base-content/70 mt-1">
                    Performance by section and question type
                  </p>
                </div>
                
                <div className="p-6">
                  <ScoreBreakdownChart 
                    scoreBreakdown={currentAttempt.scoreBreakdown}
                    isAPPrecalculus={isAPPrecalculus}
                  />
                </div>
              </div>

              {/* Detailed Question Results */}
              <ExamResultsDisplay 
                attempt={currentAttempt}
                exam={exam}
                showCorrectAnswers={exam.showCorrectAnswers}
                allowReview={exam.allowReviewAfterSubmission}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Performance Analytics */}
              <PerformanceAnalytics 
                currentAttempt={currentAttempt}
                allAttempts={completedAttempts}
                examStats={examStats}
                performanceData={performanceData}
              />

              {/* Improvement Suggestions */}
              <div className="bg-base-100 rounded-box border border-base-300 shadow-lg">
                <div className="p-6 border-b border-base-300">
                  <h3 className="font-bold flex items-center gap-2">
                    <svg className="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Study Recommendations
                  </h3>
                </div>
                
                <div className="p-6 space-y-3">
                  {generateStudyRecommendations(currentAttempt, performanceData).map((rec, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-info rounded-full mt-2"></div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{rec.title}</div>
                        <div className="text-xs text-base-content/70">{rec.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Exam Information */}
              <div className="bg-base-100 rounded-box border border-base-300 shadow-lg">
                <div className="p-6 border-b border-base-300">
                  <h3 className="font-bold">Exam Information</h3>
                </div>
                
                <div className="p-6 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Passing Score:</span>
                    <span className="font-medium">{exam.passingScore}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Points:</span>
                    <span className="font-medium">{currentAttempt.totalPoints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Question Count:</span>
                    <span className="font-medium">{examStats.totalQuestions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Limit:</span>
                    <span className="font-medium">{examStats.timeLimit} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Exam Type:</span>
                    <span className="font-medium">
                      {isAPPrecalculus ? 'AP Precalculus' : 'Unit Assessment'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed:</span>
                    <span className="font-medium">
                      {new Date(currentAttempt.completedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-base-100 rounded-box border border-base-300 shadow-lg">
                <div className="p-6 border-b border-base-300">
                  <h3 className="font-bold">Next Steps</h3>
                </div>
                
                <div className="p-6 space-y-3">
                  {attemptStats.attemptsRemaining > 0 && !currentAttempt.passed && (
                    <Link 
                      href={`/student/exams/${exam.id}/attempt`}
                      className="btn btn-primary btn-sm w-full gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Retake Exam
                    </Link>
                  )}
                  
                  <Link 
                    href={`/student/courses/${exam.unit.courseId}`}
                    className="btn btn-ghost btn-sm w-full gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Continue Course
                  </Link>

                  <Link 
                    href="/dashboard"
                    className="btn btn-ghost btn-sm w-full gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2V7" />
                    </svg>
                    Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Study Materials Recommendations */}
          {!currentAttempt.passed && (
            <div className="bg-base-100 rounded-box border border-base-300 shadow-lg">
              <div className="p-6 border-b border-base-300">
                <h2 className="text-xl font-bold flex items-center gap-3">
                  <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.168 18.477 18.582 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Recommended Study Materials
                </h2>
                <p className="text-base-content/70 mt-1">
                  Resources to help you improve your performance
                </p>
              </div>
              
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {generateStudyMaterials(performanceData, exam.unit).map((material, index) => (
                    <div key={index} className="border border-base-300 rounded-lg p-4 hover:bg-base-50">
                      <h4 className="font-medium mb-2">{material.title}</h4>
                      <p className="text-sm text-base-content/70 mb-3">{material.description}</p>
                      <div className="flex items-center gap-2 text-xs text-primary">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                        {material.type}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );

  } catch (error) {
    console.error('Error loading exam results:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="bg-base-100 rounded-box shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-error mb-2">Error Loading Results</h1>
          <p className="text-base-content/70 mb-4">Failed to load the exam results.</p>
          <Link href="/dashboard" className="btn btn-primary">Return to Dashboard</Link>
        </div>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Helper function to calculate exam statistics
function calculateExamStats(exam, attempts) {
  const scores = attempts.map(attempt => attempt.score || 0);
  const times = attempts.map(attempt => attempt.timeUsed || 0);
  
  // Calculate question count
  let totalQuestions = 0;
  if (exam.questions) {
    Object.values(exam.questions).forEach(section => {
      if (typeof section === 'object') {
        Object.values(section).forEach(part => {
          if (Array.isArray(part)) {
            totalQuestions += part.length;
          }
        });
      }
    });
  }

  // Calculate time limit
  let timeLimit = exam.timeLimit || 90;
  if (exam.structure) {
    timeLimit = Object.values(exam.structure).reduce((total, section) => {
      if (typeof section === 'object') {
        return total + Object.values(section).reduce((sectionTotal, part) => {
          return sectionTotal + (part.timeLimit || 0);
        }, 0);
      }
      return total;
    }, 0);
  }

  return {
    totalStudents: attempts.length,
    avgScore: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
    avgTime: times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0,
    passRate: attempts.length > 0 ? Math.round((attempts.filter(a => a.passed).length / attempts.length) * 100) : 0,
    totalQuestions,
    timeLimit
  };
}

// Helper function to calculate attempt-specific stats
function calculateAttemptStats(currentAttempt, allAttempts) {
  const scores = allAttempts.map(attempt => attempt.score || 0).sort((a, b) => b - a);
  const currentScore = currentAttempt.score || 0;
  
  const rank = scores.findIndex(score => score <= currentScore) + 1;
  const percentile = allAttempts.length > 1 ? 
    Math.round(((allAttempts.length - rank + 1) / allAttempts.length) * 100) : 100;
    
  // Find attempt number
  const attemptNumber = allAttempts.length - allAttempts.findIndex(a => a.id === currentAttempt.id);
  
  return {
    attemptNumber,
    attemptsRemaining: Math.max(0, (currentAttempt.exam?.maxAttempts || 1) - allAttempts.length),
    rank,
    percentile: Math.max(1, percentile),
    scoreImprovement: attemptNumber > 1 ? 
      currentScore - (allAttempts[allAttempts.length - 2]?.score || 0) : 0
  };
}

// Helper function to calculate performance data
function calculatePerformanceData(attempt, exam) {
  const breakdown = attempt.scoreBreakdown || {};
  
  return {
    strengthAreas: [],
    weaknessAreas: [],
    timeManagement: attempt.timeUsed ? {
      efficient: attempt.timeUsed < (exam.timeLimit || 90) * 0.8,
      timeUsed: attempt.timeUsed,
      timeLimit: exam.timeLimit || 90
    } : null,
    questionTypes: {
      multipleChoice: breakdown.multipleChoice || { total: 0, earned: 0 },
      freeResponse: breakdown.freeResponse || { total: 0, earned: 0 }
    }
  };
}

// Helper function to generate study recommendations
function generateStudyRecommendations(attempt, performanceData) {
  const recommendations = [];
  
  if (attempt.score < 70) {
    recommendations.push({
      title: "Review Fundamental Concepts",
      description: "Focus on core mathematical principles and formulas"
    });
  }
  
  if (performanceData.timeManagement && !performanceData.timeManagement.efficient) {
    recommendations.push({
      title: "Practice Time Management",
      description: "Work on solving problems more efficiently under time constraints"
    });
  }
  
  const mcScore = performanceData.questionTypes.multipleChoice.total > 0 ?
    (performanceData.questionTypes.multipleChoice.earned / performanceData.questionTypes.multipleChoice.total) * 100 : 100;
  
  if (mcScore < 70) {
    recommendations.push({
      title: "Multiple Choice Strategies",
      description: "Learn test-taking strategies for multiple choice questions"
    });
  }
  
  const frScore = performanceData.questionTypes.freeResponse.total > 0 ?
    (performanceData.questionTypes.freeResponse.earned / performanceData.questionTypes.freeResponse.total) * 100 : 100;
  
  if (frScore < 70) {
    recommendations.push({
      title: "Show Your Work",
      description: "Practice explaining your reasoning clearly for free response questions"
    });
  }
  
  return recommendations.slice(0, 4); // Limit to 4 recommendations
}

// Helper function to generate study materials
function generateStudyMaterials(performanceData, unit) {
  return [
    {
      title: `${unit.title} Practice Problems`,
      description: "Additional practice exercises for this unit",
      type: "Practice Exercises"
    },
    {
      title: "Video Lessons",
      description: "Step-by-step video explanations of key concepts",
      type: "Video Content"
    },
    {
      title: "Study Guide",
      description: "Comprehensive review of unit material",
      type: "Study Material"
    },
    {
      title: "Formula Sheet",
      description: "Quick reference for important formulas",
      type: "Reference"
    },
    {
      title: "Previous Exam Questions",
      description: "Practice with similar exam-style questions",
      type: "Practice Test"
    },
    {
      title: "Office Hours",
      description: "Get help from your instructor",
      type: "Support"
    }
  ];
}
