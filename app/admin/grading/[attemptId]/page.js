import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import GradingInterface from './GradingInterface';

const prisma = new PrismaClient();

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  try {
    const attempt = await prisma.examAttempt.findUnique({
      where: { id: resolvedParams.attemptId },
      include: {
        user: { select: { name: true } },
        unitExam: { select: { title: true } }
      }
    });
    
    return {
      title: attempt ? `Grading - ${attempt.user.name} - ${attempt.unitExam.title}` : 'Grading Interface',
      description: `Grade free response questions for ${attempt?.user.name || 'student'}`
    };
  } catch {
    return {
      title: 'Grading Interface',
      description: 'Grade student exam responses'
    };
  }
}

export default async function IndividualGradingPage({ params }) {
  const resolvedParams = await params;
  const session = await auth()
  
  if (!session?.user || !['ADMIN', 'INSTRUCTOR'].includes(session.user.role)) {
    redirect('/auth/signin');
  }

  const { attemptId } = resolvedParams;

  try {
    // Fetch comprehensive attempt data with all related information
    const attempt = await prisma.examAttempt.findUnique({
      where: { id: attemptId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            gradeLevel: true,
            examAttempts: {
              where: {
                unitExamId: undefined // Will be filled below
              },
              select: {
                id: true,
                score: true,
                passed: true,
                completedAt: true,
                gradingStatus: true
              },
              orderBy: { completedAt: 'desc' }
            }
          }
        },
        unitExam: {
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
            }
          }
        },
        responses: {
          include: {
            question: true,
            grader: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            question: {
              order: 'asc'
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

    if (!attempt) {
      notFound();
    }

    // Update the user query to get attempts for this specific exam
    const studentExamHistory = await prisma.examAttempt.findMany({
      where: {
        userId: attempt.userId,
        unitExamId: attempt.unitExamId
      },
      select: {
        id: true,
        score: true,
        passed: true,
        completedAt: true,
        gradingStatus: true
      },
      orderBy: { completedAt: 'desc' }
    });

    // Calculate attempt statistics
    const attemptStats = {
      attemptNumber: studentExamHistory.findIndex(a => a.id === attemptId) + 1,
      totalAttempts: studentExamHistory.length,
      previousBestScore: studentExamHistory
        .filter(a => a.id !== attemptId && a.score !== null)
        .reduce((best, curr) => curr.score > best ? curr.score : best, 0)
    };

    // Separate MC and FR questions with responses
    const mcQuestions = [];
    const frQuestions = [];

    attempt.unitExam.questions.forEach(question => {
      const response = attempt.responses.find(r => r.questionId === question.id);
      
      const questionData = {
        ...question,
        response: response || null,
        isGraded: response?.gradingStatus === 'graded' || question.type === 'MULTIPLE_CHOICE'
      };

      if (question.type === 'MULTIPLE_CHOICE') {
        mcQuestions.push(questionData);
      } else {
        frQuestions.push(questionData);
      }
    });

    // Calculate current scores
    const mcScore = mcQuestions.length > 0 ? 
      (mcQuestions.filter(q => q.response?.isCorrect).length / mcQuestions.length) * 100 : 0;
    
    const frTotalPoints = frQuestions.reduce((sum, q) => sum + (q.points || 0), 0);
    const frEarnedPoints = frQuestions.reduce((sum, q) => sum + (q.response?.instructorScore || 0), 0);
    const frScore = frTotalPoints > 0 ? (frEarnedPoints / frTotalPoints) * 100 : 0;

    // Calculate weighted final score based on exam settings
    const mcWeight = attempt.unitExam.multipleChoiceWeight || 0.6;
    const frWeight = attempt.unitExam.freeResponseWeight || 0.4;
    const currentScore = (mcScore * mcWeight) + (frScore * frWeight);

    // Determine grading progress
    const totalFRQuestions = frQuestions.length;
    const gradedFRQuestions = frQuestions.filter(q => q.response?.gradingStatus === 'graded').length;
    const gradingProgress = totalFRQuestions > 0 ? (gradedFRQuestions / totalFRQuestions) * 100 : 100;

    // Check if grading can be completed
    const canCompleteGrading = gradedFRQuestions === totalFRQuestions;
    const needsReview = frQuestions.some(q => q.response?.instructorScore === 0 && q.points > 5); // Flag high-value zero scores

    // Prepare data for the client component
    const gradingData = {
      attempt: {
        id: attempt.id,
        userId: attempt.userId,
        startedAt: attempt.startedAt,
        completedAt: attempt.completedAt,
        timeUsed: attempt.timeUsed,
        gradingStatus: attempt.gradingStatus,
        autoGradedScore: mcScore,
        manualGradedScore: frScore,
        currentScore,
        passed: currentScore >= attempt.unitExam.passingScore,
        instructorFeedback: attempt.instructorFeedback,
        needsReview: attempt.needsReview
      },
      student: {
        id: attempt.user.id,
        name: attempt.user.name,
        email: attempt.user.email,
        gradeLevel: attempt.user.gradeLevel
      },
      exam: {
        id: attempt.unitExam.id,
        title: attempt.unitExam.title,
        description: attempt.unitExam.description,
        passingScore: attempt.unitExam.passingScore,
        totalPoints: attempt.unitExam.totalPoints,
        mcWeight,
        frWeight,
        allowPartialCredit: attempt.unitExam.allowPartialCredit,
        apStyleScoring: attempt.unitExam.apStyleScoring
      },
      course: {
        id: attempt.unitExam.unit.course.id,
        title: attempt.unitExam.unit.course.title,
        apExamType: attempt.unitExam.unit.course.apExamType
      },
      unit: {
        id: attempt.unitExam.unit.id,
        title: attempt.unitExam.unit.title
      },
      mcQuestions,
      frQuestions,
      stats: {
        ...attemptStats,
        mcScore,
        frScore,
        currentScore,
        gradingProgress,
        canCompleteGrading,
        needsReview,
        totalMCQuestions: mcQuestions.length,
        totalFRQuestions,
        gradedFRQuestions,
        totalMCPoints: mcQuestions.reduce((sum, q) => sum + (q.points || 1), 0),
        totalFRPoints: frTotalPoints,
        earnedFRPoints: frEarnedPoints
      },
      grader: {
        id: session.user.id,
        name: session.user.name,
        currentGrader: attempt.grader
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
                  href="/admin/grading/pending"
                  className="btn btn-ghost btn-sm gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Grading Queue
                </Link>
                <div className="text-sm breadcrumbs">
                  <ul>
                    <li><span className="text-base-content/60">Admin</span></li>
                    <li><Link href="/admin/grading/pending" className="hover:text-primary">Grading</Link></li>
                    <li>Individual Grading</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mb-2">
                <h1 className="text-2xl font-bold">Grading Interface</h1>
                <div className={`badge badge-lg ${
                  attempt.gradingStatus === 'completed' ? 'badge-success' :
                  attempt.gradingStatus === 'in_progress' ? 'badge-warning' :
                  'badge-error'
                }`}>
                  {attempt.gradingStatus === 'completed' ? 'Completed' :
                   attempt.gradingStatus === 'in_progress' ? 'In Progress' :
                   'Pending'}
                </div>
                {gradingData.course.apExamType && (
                  <div className="badge badge-accent badge-outline">AP Course</div>
                )}
              </div>
              
              <div className="flex items-center gap-6 text-sm text-base-content/70">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {gradingData.student.name}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  {gradingData.exam.title}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  {gradingData.course.title}
                </span>
                <span>
                  Attempt {attemptStats.attemptNumber} of {attemptStats.totalAttempts}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link 
                href={`/admin/exams/${attempt.unitExamId}/results`}
                className="btn btn-ghost btn-sm gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Exam Results
              </Link>
              <button 
                className="btn btn-outline btn-secondary btn-sm"
                onClick={() => window.print()}
              >
                Print/Export
              </button>
            </div>
          </div>

          {/* Grading Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-4">
                <div className="stat-title text-xs">Progress</div>
                <div className="stat-value text-lg text-primary">{Math.round(gradingProgress)}%</div>
                <div className="stat-desc">{gradedFRQuestions}/{totalFRQuestions} FR graded</div>
              </div>
            </div>
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-4">
                <div className="stat-title text-xs">MC Score</div>
                <div className="stat-value text-lg text-info">{Math.round(mcScore)}%</div>
                <div className="stat-desc">{mcQuestions.filter(q => q.response?.isCorrect).length}/{mcQuestions.length} correct</div>
              </div>
            </div>
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-4">
                <div className="stat-title text-xs">FR Score</div>
                <div className="stat-value text-lg text-secondary">{Math.round(frScore)}%</div>
                <div className="stat-desc">{frEarnedPoints}/{frTotalPoints} points</div>
              </div>
            </div>
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-4">
                <div className="stat-title text-xs">Current Total</div>
                <div className={`stat-value text-lg ${
                  currentScore >= attempt.unitExam.passingScore ? 'text-success' : 'text-error'
                }`}>
                  {Math.round(currentScore)}%
                </div>
                <div className="stat-desc">
                  {currentScore >= attempt.unitExam.passingScore ? 'Passing' : 'Not Passing'}
                </div>
              </div>
            </div> 
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-4">
                <div className="stat-title text-xs">Status</div>
                <div className={`stat-value text-sm ${
                  canCompleteGrading ? 'text-success' : 'text-warning'
                }`}>
                  {canCompleteGrading ? 'Ready' : 'In Progress'}
                </div>
                <div className="stat-desc">
                  {canCompleteGrading ? 'Can finalize' : 'Need to grade FR'}
                </div>
              </div>
            </div>
          </div>

          {/* Main Grading Interface */}
          <GradingInterface initialData={gradingData} />
          
        </div>
      </div>
    );

  } catch (error) {
    console.error('Error loading grading interface:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="bg-base-100 rounded-box shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-error mb-2">Error Loading Grading Interface</h1>
          <p className="text-base-content/70 mb-4">Failed to load the grading data.</p>
          <Link href="/admin/grading/pending" className="btn btn-primary">Back to Queue</Link>
        </div>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}
