import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import ExamForm from './ExamForm';

const prisma = new PrismaClient();

export const metadata = {
  title: 'Edit Unit Assessment',
  description: 'Edit unit assessment exam'
};

export default async function EditExamPage({ params }) {
  const resolvedParams = await params;
  
  try {
    // Fetch course, unit, and exam data
    const [course, unit, exam] = await Promise.all([
      prisma.course.findUnique({
        where: { id: resolvedParams.id },
        select: {
          id: true,
          title: true,
          apExamType: true,
          description: true,
          isPublished: true
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
          order: true,
          courseId: true
        }
      }),
      prisma.unitExam.findUnique({
        where: { id: resolvedParams.examId },
        include: {
          attempts: {
            select: {
              id: true,
              userId: true,
              completedAt: true,
              score: true,
              passed: true,
              user: {
                select: {
                  name: true,
                  email: true
                }
              }
            },
            orderBy: { startedAt: 'desc' },
            take: 10 // Recent attempts for context
          },
          _count: {
            select: {
              attempts: true
            }
          },
          unit: {
            select: {
              id: true,
              title: true,
              courseId: true
            }
          }
        }
      })
    ]);

    // Verify all resources exist
    if (!course || !unit || !exam) {
      notFound();
    }

    // Verify exam belongs to correct course and unit
    if (exam.unitId !== unit.id || exam.unit.courseId !== course.id) {
      notFound();
    }

    // Check if exam has completed attempts - affects what can be edited
    const hasCompletedAttempts = exam.attempts.some(attempt => attempt.completedAt);
    const completedAttempts = exam.attempts.filter(attempt => attempt.completedAt);

    // Determine if this is AP Precalculus
    const isAPPrecalculus = course.apExamType === 'AP-PRECALCULUS' || 
                           course.title.toLowerCase().includes('precalculus') ||
                           course.title.toLowerCase().includes('pre-calculus');

    // Format initial data for the ExamForm
    const initialExamData = {
      // Basic Details
      title: exam.title,
      description: exam.description || '',
      instructions: exam.instructions || '',
      examType: exam.examType,
      order: exam.order,

      // Questions Structure
      questions: exam.questions || {
        multipleChoice: { partA: [], partB: [] },
        freeResponse: { partA: [], partB: [] }
      },
      structure: exam.structure,

      // Timing
      totalTimeLimit: exam.timeLimit,
      allowTimeExtensions: exam.allowTimeExtensions,

      // Scoring
      scoring: {
        passingScore: exam.passingScore,
        totalPoints: exam.totalPoints,
        multipleChoiceWeight: exam.multipleChoiceWeight,
        freeResponseWeight: exam.freeResponseWeight,
        apStyleScoring: exam.apStyleScoring,
        allowPartialCredit: exam.allowPartialCredit
      },

      // Behavior Settings  
      maxAttempts: exam.maxAttempts,
      shuffleQuestions: exam.shuffleQuestions,
      shuffleOptions: exam.shuffleOptions,
      showCorrectAnswers: exam.showCorrectAnswers,
      allowReviewAfterSubmission: exam.allowReviewAfterSubmission,

      // Availability
      availableFrom: exam.availableFrom ? exam.availableFrom.toISOString().slice(0, 16) : '',
      availableUntil: exam.availableUntil ? exam.availableUntil.toISOString().slice(0, 16) : '',
      requiresProctoring: exam.requiresProctoring,

      // Publishing
      isPublished: exam.isPublished
    };

    // Calculate question statistics for display
    const questionStats = calculateQuestionStats(exam.questions);

    // Calculate performance statistics
    const performanceStats = {
      totalAttempts: exam._count.attempts,
      completedAttempts: completedAttempts.length,
      averageScore: completedAttempts.length > 0 
        ? completedAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / completedAttempts.length
        : 0,
      passRate: completedAttempts.length > 0
        ? (completedAttempts.filter(attempt => attempt.passed).length / completedAttempts.length) * 100
        : 0,
      highestScore: completedAttempts.length > 0 
        ? Math.max(...completedAttempts.map(attempt => attempt.score))
        : 0,
      recentAttempts: exam.attempts.slice(0, 5)
    };

    return (
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link 
                href={`/admin/courses/${course.id}/units/${unit.id}/exams`}
                className="btn btn-ghost btn-sm gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Exams
              </Link>
              <div className="text-sm breadcrumbs">
                <ul>
                  <li><span className="text-base-content/60">{course.title}</span></li>
                  <li><span className="text-base-content/60">{unit.title}</span></li>
                  <li><span className="text-base-content/60">Assessments</span></li>
                  <li>Edit</li>
                </ul>
              </div>
            </div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              Edit Assessment
              <div className={`badge ${exam.isPublished ? 'badge-success' : 'badge-warning'}`}>
                {exam.isPublished ? 'Published' : 'Draft'}
              </div>
            </h1>
            <p className="text-base-content/70 mt-1">
              Editing "{exam.title}" 
              {isAPPrecalculus && ' • AP Precalculus Format'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Preview Button */}
            <Link
              href={`/admin/courses/${course.id}/units/${unit.id}/exams/${exam.id}/preview`}
              className="btn btn-ghost btn-sm gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </Link>
            
            {/* Analytics Button (if has attempts) */}
            {performanceStats.totalAttempts > 0 && (
              <Link
                href={`/admin/courses/${course.id}/units/${unit.id}/exams/${exam.id}/analytics`}
                className="btn btn-ghost btn-sm gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analytics
              </Link>
            )}
          </div>
        </div>

        {/* Warning about attempts */}
        {hasCompletedAttempts && (
          <div className="alert alert-warning">
            <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-bold">Students Have Taken This Exam</h3>
              <div className="text-sm">
                {performanceStats.completedAttempts} student{performanceStats.completedAttempts !== 1 ? 's have' : ' has'} completed this assessment. 
                Some changes (questions, scoring, time limits) are restricted to protect data integrity.
                <span className="ml-2">
                  <Link href={`/admin/courses/${course.id}/units/${unit.id}/exams/${exam.id}/analytics`} className="link">
                    View detailed analytics →
                  </Link>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Current Exam Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <ExamForm
              course={course}
              unit={unit}
              isAPPrecalculus={isAPPrecalculus}
              initialData={initialExamData}
              examId={exam.id}
              mode="edit"
              restrictions={hasCompletedAttempts ? {
                questionsLocked: true,
                scoringLocked: true,
                timeLimitLocked: true,
                message: 'Questions, scoring, and time limits cannot be changed after students complete attempts'
              } : null}
            />
          </div>

          {/* Sidebar with current info */}
          <div className="space-y-4">
            {/* Current Stats */}
            <div className="bg-base-100 rounded-box border border-base-300 p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Current Exam Stats
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Questions:</span>
                  <span className="font-medium">
                    {questionStats.total} ({questionStats.multipleChoice}MC, {questionStats.freeResponse}FR)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Points:</span>
                  <span className="font-medium">{exam.totalPoints || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Time Limit:</span>
                  <span className="font-medium">
                    {exam.timeLimit ? `${exam.timeLimit} minutes` : 'No limit'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className={`badge badge-xs ${exam.isPublished ? 'badge-success' : 'badge-warning'}`}>
                    {exam.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Stats (if has attempts) */}
            {performanceStats.totalAttempts > 0 && (
              <div className="bg-base-100 rounded-box border border-base-300 p-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Student Performance
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Total Attempts:</span>
                    <span className="font-medium">{performanceStats.totalAttempts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completed:</span>
                    <span className="font-medium">{performanceStats.completedAttempts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Score:</span>
                    <span className="font-medium">{Math.round(performanceStats.averageScore)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pass Rate:</span>
                    <span className="font-medium text-success">{Math.round(performanceStats.passRate)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Highest Score:</span>
                    <span className="font-medium">{Math.round(performanceStats.highestScore)}%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Activity (if has attempts) */}
            {performanceStats.recentAttempts.length > 0 && (
              <div className="bg-base-100 rounded-box border border-base-300 p-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Recent Activity
                </h3>
                <div className="space-y-2">
                  {performanceStats.recentAttempts.map((attempt, index) => (
                    <div key={attempt.id} className="flex items-center justify-between text-xs p-2 bg-base-50 rounded">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${attempt.passed ? 'bg-success' : 'bg-error'}`}></div>
                        <span className="font-medium truncate max-w-24">
                          {attempt.user?.name || 'Anonymous'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={attempt.passed ? 'text-success' : 'text-error'}>
                          {Math.round(attempt.score)}%
                        </span>
                        <span className="text-base-content/50">
                          {attempt.completedAt ? 
                            new Date(attempt.completedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) :
                            'In progress'
                          }
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-base-100 rounded-box border border-base-300 p-4">
              <h3 className="font-medium mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <Link
                  href={`/admin/courses/${course.id}/units/${unit.id}/exams/${exam.id}/preview`}
                  className="btn btn-ghost btn-sm w-full justify-start gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Preview Exam
                </Link>
                <button className="btn btn-ghost btn-sm w-full justify-start gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Duplicate Exam
                </button>
                <Link
                  href={`/admin/courses/${course.id}/units/${unit.id}/exams`}
                  className="btn btn-ghost btn-sm w-full justify-start gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  All Unit Exams
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  } catch (error) {
    console.error('Error loading exam edit page:', error);
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-error mb-2">Error Loading Exam</h1>
          <p className="text-base-content/70 mb-4">Failed to load the exam editing page.</p>
          <Link href={`/admin/courses`} className="btn btn-primary btn-sm">
            Return to Courses
          </Link>
        </div>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Helper function to calculate question statistics
function calculateQuestionStats(questions) {
  const stats = {
    total: 0,
    multipleChoice: 0,
    freeResponse: 0
  };

  if (!questions || typeof questions !== 'object') {
    return stats;
  }

  try {
    // Count multiple choice questions
    if (questions.multipleChoice) {
      if (questions.multipleChoice.partA && Array.isArray(questions.multipleChoice.partA)) {
        stats.multipleChoice += questions.multipleChoice.partA.length;
      }
      if (questions.multipleChoice.partB && Array.isArray(questions.multipleChoice.partB)) {
        stats.multipleChoice += questions.multipleChoice.partB.length;
      }
    }

    // Count free response questions
    if (questions.freeResponse) {
      if (questions.freeResponse.partA && Array.isArray(questions.freeResponse.partA)) {
        stats.freeResponse += questions.freeResponse.partA.length;
      }
      if (questions.freeResponse.partB && Array.isArray(questions.freeResponse.partB)) {
        stats.freeResponse += questions.freeResponse.partB.length;
      }
    }

    stats.total = stats.multipleChoice + stats.freeResponse;
  } catch (error) {
    console.error('Error calculating question stats:', error);
  }

  return stats;
}
