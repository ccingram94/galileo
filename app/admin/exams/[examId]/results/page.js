import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import ExamResultsInterface from './ExamResultsInterface';

const prisma = new PrismaClient();

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  try {
    const exam = await prisma.unitExam.findUnique({
      where: { id: resolvedParams.examId },
      include: {
        unit: {
          include: {
            course: {
              select: { title: true }
            }
          }
        }
      }
    });
    
    return {
      title: exam ? `Results - ${exam.title}` : 'Exam Results',
      description: `View and manage grading results for ${exam?.title || 'exam'}`
    };
  } catch {
    return {
      title: 'Exam Results',
      description: 'View exam results and grading statistics'
    };
  }
}

// Helper function to calculate grade distribution
function calculateGradeDistribution(attempts, passingScore) {
  const completed = attempts.filter(a => a.gradingStatus === 'completed' && a.score !== null);
  
  if (completed.length === 0) {
    return {
      A: 0, B: 0, C: 0, D: 0, F: 0,
      distribution: [],
      averageScore: 0,
      passRate: 0
    };
  }

  const grades = completed.reduce((acc, attempt) => {
    const score = attempt.score;
    if (score >= 90) acc.A++;
    else if (score >= 80) acc.B++;
    else if (score >= 70) acc.C++;
    else if (score >= 60) acc.D++;
    else acc.F++;
    return acc;
  }, { A: 0, B: 0, C: 0, D: 0, F: 0 });

  const totalScore = completed.reduce((sum, attempt) => sum + attempt.score, 0);
  const averageScore = totalScore / completed.length;
  const passedCount = completed.filter(a => a.score >= passingScore).length;
  const passRate = (passedCount / completed.length) * 100;

  return {
    ...grades,
    distribution: [
      { label: 'A (90-100%)', count: grades.A, percentage: (grades.A / completed.length) * 100, color: 'bg-success' },
      { label: 'B (80-89%)', count: grades.B, percentage: (grades.B / completed.length) * 100, color: 'bg-info' },
      { label: 'C (70-79%)', count: grades.C, percentage: (grades.C / completed.length) * 100, color: 'bg-warning' },
      { label: 'D (60-69%)', count: grades.D, percentage: (grades.D / completed.length) * 100, color: 'bg-error/60' },
      { label: 'F (0-59%)', count: grades.F, percentage: (grades.F / completed.length) * 100, color: 'bg-error' }
    ],
    averageScore,
    passRate
  };
}

// Helper function to calculate grading workload
function calculateGradingWorkload(attempts, questions) {
  const frQuestions = questions.filter(q => q.type !== 'MULTIPLE_CHOICE');
  const totalFRResponses = attempts.length * frQuestions.length;
  
  let gradedResponses = 0;
  attempts.forEach(attempt => {
    attempt.responses.forEach(response => {
      if (response.question.type !== 'MULTIPLE_CHOICE' && response.gradingStatus === 'graded') {
        gradedResponses++;
      }
    });
  });

  return {
    totalFRResponses,
    gradedResponses,
    pendingResponses: totalFRResponses - gradedResponses,
    completionPercentage: totalFRResponses > 0 ? (gradedResponses / totalFRResponses) * 100 : 100
  };
}

export default async function ExamResultsPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const session = await getServerSession(authOptions);
  
  if (!session?.user || !['ADMIN', 'INSTRUCTOR'].includes(session.user.role)) {
    redirect('/auth/signin');
  }

  const { examId } = resolvedParams;
  const statusFilter = resolvedSearchParams.status || 'all';
  const sortBy = resolvedSearchParams.sort || 'recent';
  const showOnlyNeedsGrading = resolvedSearchParams.pending === 'true';

  try {
    // Fetch comprehensive exam data
    const exam = await prisma.unitExam.findUnique({
      where: { id: examId },
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
          orderBy: { order: 'asc' }
        },
        attempts: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                gradeLevel: true
              }
            },
            responses: {
              include: {
                question: {
                  select: {
                    id: true,
                    type: true,
                    points: true,
                    title: true
                  }
                },
                grader: {
                  select: {
                    id: true,
                    name: true
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
          },
          orderBy: { startedAt: 'desc' }
        }
      }
    });

    if (!exam) {
      notFound();
    }

    // Process attempts with enhanced data
    const processedAttempts = exam.attempts.map(attempt => {
      // Calculate individual scores
      const mcQuestions = exam.questions.filter(q => q.type === 'MULTIPLE_CHOICE');
      const frQuestions = exam.questions.filter(q => q.type !== 'MULTIPLE_CHOICE');
      
      const mcResponses = attempt.responses.filter(r => 
        mcQuestions.some(q => q.id === r.questionId)
      );
      
      const frResponses = attempt.responses.filter(r => 
        frQuestions.some(q => q.id === r.questionId)
      );

      const mcCorrect = mcResponses.filter(r => r.isCorrect).length;
      const mcScore = mcQuestions.length > 0 ? (mcCorrect / mcQuestions.length) * 100 : 0;

      const frTotalPoints = frQuestions.reduce((sum, q) => sum + (q.points || 0), 0);
      const frEarnedPoints = frResponses.reduce((sum, r) => sum + (r.instructorScore || 0), 0);
      const frScore = frTotalPoints > 0 ? (frEarnedPoints / frTotalPoints) * 100 : 0;

      const gradedFRCount = frResponses.filter(r => r.gradingStatus === 'graded').length;
      const gradingProgress = frQuestions.length > 0 ? (gradedFRCount / frQuestions.length) * 100 : 100;

      // Determine time taken
      const timeUsed = attempt.timeUsed || 0;
      const timeFormatted = timeUsed > 0 ? 
        `${Math.floor(timeUsed / 60)}h ${timeUsed % 60}m` : 
        'N/A';

      // Priority for grading (higher number = higher priority)
      let gradingPriority = 0;
      if (attempt.gradingStatus === 'pending') {
        const daysSinceSubmission = Math.floor((new Date() - new Date(attempt.completedAt)) / (1000 * 60 * 60 * 24));
        if (daysSinceSubmission >= 7) gradingPriority = 3;      // Urgent
        else if (daysSinceSubmission >= 3) gradingPriority = 2; // High
        else gradingPriority = 1;                               // Normal
      }

      return {
        ...attempt,
        mcScore,
        frScore,
        gradingProgress,
        timeFormatted,
        gradingPriority,
        hasUnreadFeedback: attempt.instructorFeedback && !attempt.feedbackRead,
        attemptNumber: exam.attempts.filter(a => 
          a.userId === attempt.userId && 
          a.startedAt <= attempt.startedAt
        ).length,
        isLatestAttempt: exam.attempts
          .filter(a => a.userId === attempt.userId)
          .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))[0]?.id === attempt.id,
        questionBreakdown: {
          mcTotal: mcQuestions.length,
          mcCorrect,
          frTotal: frQuestions.length,
          frGraded: gradedFRCount,
          frTotalPoints,
          frEarnedPoints
        }
      };
    });

    // Apply filters
    let filteredAttempts = processedAttempts;

    if (statusFilter !== 'all') {
      filteredAttempts = filteredAttempts.filter(attempt => {
        switch (statusFilter) {
          case 'pending': return attempt.gradingStatus === 'pending';
          case 'in-progress': return attempt.gradingStatus === 'in_progress';
          case 'completed': return attempt.gradingStatus === 'completed';
          case 'passed': return attempt.gradingStatus === 'completed' && attempt.passed;
          case 'failed': return attempt.gradingStatus === 'completed' && !attempt.passed;
          case 'needs-review': return attempt.needsReview;
          default: return true;
        }
      });
    }

    if (showOnlyNeedsGrading) {
      filteredAttempts = filteredAttempts.filter(attempt => 
        ['pending', 'in_progress'].includes(attempt.gradingStatus)
      );
    }

    // Apply sorting
    switch (sortBy) {
      case 'student':
        filteredAttempts.sort((a, b) => a.user.name.localeCompare(b.user.name));
        break;
      case 'score':
        filteredAttempts.sort((a, b) => (b.score || 0) - (a.score || 0));
        break;
      case 'time':
        filteredAttempts.sort((a, b) => (b.timeUsed || 0) - (a.timeUsed || 0));
        break;
      case 'grading-priority':
        filteredAttempts.sort((a, b) => b.gradingPriority - a.gradingPriority);
        break;
      case 'recent':
      default:
        filteredAttempts.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
        break;
    }

    // Calculate statistics
    const stats = {
      totalAttempts: exam.attempts.length,
      uniqueStudents: new Set(exam.attempts.map(a => a.userId)).size,
      completedAttempts: exam.attempts.filter(a => a.completedAt).length,
      pendingGrading: exam.attempts.filter(a => a.gradingStatus === 'pending').length,
      inProgressGrading: exam.attempts.filter(a => a.gradingStatus === 'in_progress').length,
      fullyGraded: exam.attempts.filter(a => a.gradingStatus === 'completed').length,
      needsReview: exam.attempts.filter(a => a.needsReview).length,
      averageTimeUsed: exam.attempts.reduce((sum, a) => sum + (a.timeUsed || 0), 0) / exam.attempts.length || 0,
      gradeDistribution: calculateGradeDistribution(exam.attempts, exam.passingScore),
      gradingWorkload: calculateGradingWorkload(exam.attempts, exam.questions)
    };

    // Question-level analytics
    const questionAnalytics = exam.questions.map(question => {
      const responses = exam.attempts.flatMap(attempt => 
        attempt.responses.filter(r => r.questionId === question.id)
      );

      if (question.type === 'MULTIPLE_CHOICE') {
        const correctCount = responses.filter(r => r.isCorrect).length;
        const totalResponses = responses.length;
        return {
          ...question,
          correctRate: totalResponses > 0 ? (correctCount / totalResponses) * 100 : 0,
          difficulty: totalResponses > 0 ? 
            (correctCount / totalResponses) >= 0.8 ? 'Easy' :
            (correctCount / totalResponses) >= 0.6 ? 'Medium' : 'Hard' : 'N/A',
          responses: totalResponses
        };
      } else {
        const gradedResponses = responses.filter(r => r.gradingStatus === 'graded');
        const avgScore = gradedResponses.length > 0 ?
          gradedResponses.reduce((sum, r) => sum + (r.instructorScore || 0), 0) / gradedResponses.length : 0;
        const maxPoints = question.points || 1;
        
        return {
          ...question,
          averageScore: avgScore,
          scorePercentage: maxPoints > 0 ? (avgScore / maxPoints) * 100 : 0,
          gradedCount: gradedResponses.length,
          totalResponses: responses.length,
          pendingGrading: responses.length - gradedResponses.length
        };
      }
    });

    // Recent grading activity
    const recentGrading = exam.attempts
      .filter(a => a.gradedAt)
      .sort((a, b) => new Date(b.gradedAt) - new Date(a.gradedAt))
      .slice(0, 10)
      .map(attempt => ({
        id: attempt.id,
        studentName: attempt.user.name,
        score: attempt.score,
        passed: attempt.passed,
        gradedAt: attempt.gradedAt,
        graderName: attempt.grader?.name
      }));

    const examData = {
      exam: {
        id: exam.id,
        title: exam.title,
        description: exam.description,
        passingScore: exam.passingScore,
        timeLimit: exam.timeLimit,
        maxAttempts: exam.maxAttempts,
        totalPoints: exam.totalPoints,
        mcWeight: exam.multipleChoiceWeight,
        frWeight: exam.freeResponseWeight,
        unit: exam.unit,
        course: exam.unit.course,
        questionCount: {
          total: exam.questions.length,
          mc: exam.questions.filter(q => q.type === 'MULTIPLE_CHOICE').length,
          fr: exam.questions.filter(q => q.type !== 'MULTIPLE_CHOICE').length
        }
      },
      attempts: filteredAttempts,
      stats,
      questionAnalytics,
      recentGrading,
      filters: {
        status: statusFilter,
        sort: sortBy,
        pending: showOnlyNeedsGrading
      }
    };

    return (
      <div className="min-h-screen bg-base-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
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
                    <li><Link href="/admin/exams" className="hover:text-primary">Exams</Link></li>
                    <li>Results</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-3xl font-bold">{exam.title}</h1>
                {exam.unit.course.apExamType && (
                  <div className="badge badge-accent badge-lg">AP Course</div>
                )}
                <div className={`badge badge-lg ${
                  stats.pendingGrading > 0 ? 'badge-warning' : 'badge-success'
                }`}>
                  {stats.pendingGrading > 0 ? `${stats.pendingGrading} Pending` : 'All Graded'}
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-base-content/70">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {exam.unit.course.title}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {exam.unit.title}
                </span>
                <span>
                  {exam.questionCount.total} Questions 
                  ({exam.questionCount.mc} MC, {exam.questionCount.fr} FR)
                </span>
                <span>
                  Passing: {exam.passingScore}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link 
                href={`/admin/exams/${examId}/edit`}
                className="btn btn-ghost btn-sm gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit Exam
              </Link>
              <Link 
                href="/admin/grading/pending"
                className="btn btn-primary btn-sm gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Grade Pending
              </Link>
              <button 
                className="btn btn-outline btn-secondary btn-sm"
                onClick={() => window.print()}
              >
                Export Results
              </button>
            </div>
          </div>

          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4 mb-6">
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-3">
                <div className="stat-title text-xs">Total Attempts</div>
                <div className="stat-value text-lg text-primary">{stats.totalAttempts}</div>
                <div className="stat-desc">{stats.uniqueStudents} students</div>
              </div>
            </div>
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-3">
                <div className="stat-title text-xs">Pending Grading</div>
                <div className="stat-value text-lg text-warning">{stats.pendingGrading}</div>
                <div className="stat-desc">Need attention</div>
              </div>
            </div>
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-3">
                <div className="stat-title text-xs">In Progress</div>
                <div className="stat-value text-lg text-info">{stats.inProgressGrading}</div>
                <div className="stat-desc">Being graded</div>
              </div>
            </div>
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-3">
                <div className="stat-title text-xs">Completed</div>
                <div className="stat-value text-lg text-success">{stats.fullyGraded}</div>
                <div className="stat-desc">Fully graded</div>
              </div>
            </div>
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-3">
                <div className="stat-title text-xs">Average Score</div>
                <div className="stat-value text-lg text-accent">
                  {Math.round(stats.gradeDistribution.averageScore)}%
                </div>
                <div className="stat-desc">
                  Pass rate: {Math.round(stats.gradeDistribution.passRate)}%
                </div>
              </div>
            </div>
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-3">
                <div className="stat-title text-xs">Needs Review</div>
                <div className="stat-value text-lg text-error">{stats.needsReview}</div>
                <div className="stat-desc">Require attention</div>
              </div>
            </div>
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-3">
                <div className="stat-title text-xs">Avg Time</div>
                <div className="stat-value text-lg text-secondary">
                  {Math.round(stats.averageTimeUsed)}m
                </div>
                <div className="stat-desc">
                  Limit: {exam.timeLimit || 'None'}
                </div>
              </div>
            </div>
          </div>

          {/* Main Results Interface */}
          <ExamResultsInterface 
            initialData={examData}
          />
          
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
          <h1 className="text-2xl font-bold text-error mb-2">Error Loading Exam Results</h1>
          <p className="text-base-content/70 mb-4">Failed to load the exam results data.</p>
          <Link href="/admin/dashboard" className="btn btn-primary">Back to Dashboard</Link>
        </div>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}
