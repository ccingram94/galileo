import { notFound, redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import ExamAttemptInterface from './ExamAttemptInterface';

const prisma = new PrismaClient();

export const metadata = {
  title: 'Take Assessment',
  description: 'Student exam taking interface'
};

export default async function ExamAttemptPage({ params, searchParams }) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  // Get user session
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect('/auth/signin');
  }

  try {
    // Fetch exam with all related data
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
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!exam) {
      notFound();
    }

    // Verify user is enrolled in the course
    const enrollment = exam.unit.course.enrollments[0];
    if (!enrollment || enrollment.status !== 'ACTIVE') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-base-200">
          <div className="bg-base-100 rounded-box shadow-xl p-8 max-w-md text-center">
            <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-error mb-2">Access Denied</h1>
            <p className="text-base-content/70">You are not enrolled in this course or your enrollment is not active.</p>
          </div>
        </div>
      );
    }

    // Check exam availability
    const now = new Date();
    const availabilityCheck = checkExamAvailability(exam, now);
    
    if (!availabilityCheck.available) {
      return renderUnavailableExam(exam, availabilityCheck);
    }

    // Check attempt limits
    const completedAttempts = exam.attempts.filter(attempt => attempt.completedAt);
    const inProgressAttempt = exam.attempts.find(attempt => !attempt.completedAt);
    
    if (completedAttempts.length >= exam.maxAttempts && !inProgressAttempt) {
      return renderMaxAttemptsReached(exam, completedAttempts);
    }

    // Determine current attempt
    let currentAttempt = inProgressAttempt;
    
    // If starting a new attempt
    if (!currentAttempt && resolvedSearchParams.action === 'start') {
      currentAttempt = await createNewAttempt(exam.id, session.user.id);
    }

    // Show exam start screen if no current attempt
    if (!currentAttempt) {
      return renderExamStartScreen(exam, completedAttempts);
    }

    // Prepare exam data for interface
    const examData = prepareExamData(exam, currentAttempt);
    const isAPPrecalculus = exam.unit.course.apExamType === 'AP-PRECALCULUS';

    return (
      <div className="min-h-screen bg-base-200">
        <ExamAttemptInterface 
          exam={examData}
          attempt={currentAttempt}
          user={session.user}
          isAPPrecalculus={isAPPrecalculus}
        />
      </div>
    );

  } catch (error) {
    console.error('Error loading exam attempt:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="bg-base-100 rounded-box shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-error mb-2">Error Loading Exam</h1>
          <p className="text-base-content/70 mb-4">An unexpected error occurred while loading the exam.</p>
          <a href="/dashboard" className="btn btn-primary">Return to Dashboard</a>
        </div>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Helper function to check exam availability
function checkExamAvailability(exam, now) {
  // Check if exam is published
  if (!exam.isPublished) {
    return {
      available: false,
      reason: 'NOT_PUBLISHED',
      message: 'This exam is not yet published.'
    };
  }

  // Check availability window
  if (exam.availableFrom && new Date(exam.availableFrom) > now) {
    return {
      available: false,
      reason: 'NOT_YET_AVAILABLE',
      message: 'This exam is not yet available.',
      availableFrom: exam.availableFrom
    };
  }

  if (exam.availableUntil && new Date(exam.availableUntil) < now) {
    return {
      available: false,
      reason: 'EXPIRED',
      message: 'The deadline for this exam has passed.',
      availableUntil: exam.availableUntil
    };
  }

  return { available: true };
}

// Helper function to create new attempt
async function createNewAttempt(examId, userId) {
  return await prisma.examAttempt.create({
    data: {
      examId,
      userId,
      startedAt: new Date(),
      answers: {},
      currentSection: 0,
      currentQuestion: 0,
      timeRemaining: null, // Will be calculated in interface
      status: 'IN_PROGRESS'
    }
  });
}

// Helper function to prepare exam data
function prepareExamData(exam, attempt) {
  // Calculate total time and sections
  const sections = [];
  let totalTime = 0;

  if (exam.questions?.multipleChoice?.partA?.length > 0) {
    sections.push({
      id: 'mc-part-a',
      title: 'Section I, Part A: Multiple Choice',
      subtitle: 'No Calculator',
      type: 'multiple-choice',
      calculatorRequired: false,
      timeLimit: exam.structure?.multipleChoice?.partA?.timeLimit || 45,
      questions: exam.questions.multipleChoice.partA
    });
    totalTime += exam.structure?.multipleChoice?.partA?.timeLimit || 45;
  }

  if (exam.questions?.multipleChoice?.partB?.length > 0) {
    sections.push({
      id: 'mc-part-b',
      title: 'Section I, Part B: Multiple Choice',
      subtitle: 'Graphing Calculator Required',
      type: 'multiple-choice',
      calculatorRequired: true,
      timeLimit: exam.structure?.multipleChoice?.partB?.timeLimit || 15,
      questions: exam.questions.multipleChoice.partB
    });
    totalTime += exam.structure?.multipleChoice?.partB?.timeLimit || 15;
  }

  if (exam.questions?.freeResponse?.partA?.length > 0) {
    sections.push({
      id: 'fr-part-a',
      title: 'Section II, Part A: Free Response',
      subtitle: 'Graphing Calculator Required',
      type: 'free-response',
      calculatorRequired: true,
      timeLimit: exam.structure?.freeResponse?.partA?.timeLimit || 20,
      questions: exam.questions.freeResponse.partA
    });
    totalTime += exam.structure?.freeResponse?.partA?.timeLimit || 20;
  }

  if (exam.questions?.freeResponse?.partB?.length > 0) {
    sections.push({
      id: 'fr-part-b',
      title: 'Section II, Part B: Free Response',
      subtitle: 'No Calculator',
      type: 'free-response',
      calculatorRequired: false,
      timeLimit: exam.structure?.freeResponse?.partB?.timeLimit || 10,
      questions: exam.questions.freeResponse.partB
    });
    totalTime += exam.structure?.freeResponse?.partB?.timeLimit || 10;
  }

  return {
    ...exam,
    sections,
    totalTime,
    totalQuestions: sections.reduce((total, section) => total + section.questions.length, 0)
  };
}

// Component to render unavailable exam
function renderUnavailableExam(exam, availabilityCheck) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="bg-base-100 rounded-box shadow-xl p-8 max-w-md text-center">
        <div className="w-16 h-16 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-warning mb-2">Exam Unavailable</h1>
        <h2 className="text-lg font-semibold mb-2">{exam.title}</h2>
        <p className="text-base-content/70 mb-4">{availabilityCheck.message}</p>
        
        {availabilityCheck.availableFrom && (
          <div className="bg-info/10 p-4 rounded-box mb-4">
            <p className="text-sm text-info">
              <span className="font-medium">Available from:</span><br />
              {new Date(availabilityCheck.availableFrom).toLocaleString()}
            </p>
          </div>
        )}
        
        {availabilityCheck.availableUntil && (
          <div className="bg-error/10 p-4 rounded-box mb-4">
            <p className="text-sm text-error">
              <span className="font-medium">Deadline was:</span><br />
              {new Date(availabilityCheck.availableUntil).toLocaleString()}
            </p>
          </div>
        )}

        <a href="/dashboard" className="btn btn-primary">Return to Dashboard</a>
      </div>
    </div>
  );
}

// Component to render max attempts reached
function renderMaxAttemptsReached(exam, attempts) {
  const bestAttempt = attempts.reduce((best, current) => 
    (current.score || 0) > (best.score || 0) ? current : best
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="bg-base-100 rounded-box shadow-xl p-8 max-w-md text-center">
        <div className="w-16 h-16 bg-info/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-2">All Attempts Used</h1>
        <h2 className="text-lg font-semibold mb-2">{exam.title}</h2>
        <p className="text-base-content/70 mb-4">
          You have used all {exam.maxAttempts} attempt{exam.maxAttempts !== 1 ? 's' : ''} for this exam.
        </p>

        <div className="bg-base-50 p-4 rounded-box mb-4">
          <h3 className="font-medium mb-2">Your Best Score</h3>
          <div className="text-2xl font-bold text-primary">
            {bestAttempt.score !== null ? `${Math.round(bestAttempt.score)}%` : 'Not graded'}
          </div>
          <div className="text-sm text-base-content/70">
            {bestAttempt.passed ? 'Passed' : 'Did not pass'} • 
            {new Date(bestAttempt.completedAt).toLocaleDateString()}
          </div>
        </div>

        <div className="flex gap-2">
          <a href="/dashboard" className="btn btn-primary btn-sm flex-1">Dashboard</a>
          <a href={`/student/exams/${exam.id}/results`} className="btn btn-ghost btn-sm flex-1">
            View Results
          </a>
        </div>
      </div>
    </div>
  );
}

// Component to render exam start screen
function renderExamStartScreen(exam, previousAttempts) {
  const timeDisplay = calculateTimeDisplay(exam);
  const questionCount = calculateQuestionCount(exam);

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-base-100 rounded-box shadow-xl">
          {/* Header */}
          <div className="p-8 border-b border-base-300 bg-primary/5">
            <div className="text-center">
              <h1 className="text-3xl font-bold mb-2">{exam.title}</h1>
              <p className="text-lg text-base-content/70 mb-4">
                {exam.unit.title} • {exam.unit.course.title}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="stat bg-base-100/50 rounded-box">
                  <div className="stat-title">Questions</div>
                  <div className="stat-value text-primary">{questionCount}</div>
                </div>
                <div className="stat bg-base-100/50 rounded-box">
                  <div className="stat-title">Time Limit</div>
                  <div className="stat-value text-secondary">{timeDisplay}</div>
                </div>
                <div className="stat bg-base-100/50 rounded-box">
                  <div className="stat-title">Points</div>
                  <div className="stat-value text-accent">{exam.totalPoints || 'TBD'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Exam Information */}
          <div className="p-8 space-y-6">
            {/* Description */}
            {exam.description && (
              <div>
                <h3 className="text-xl font-semibold mb-3">About This Exam</h3>
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: exam.description }}
                />
              </div>
            )}

            {/* Instructions */}
            <div>
              <h3 className="text-xl font-semibold mb-3">Instructions</h3>
              <div 
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: exam.instructions || 'No specific instructions provided.' }}
              />
            </div>

            {/* Important Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Attempt Info */}
              <div className="bg-info/10 p-4 rounded-box">
                <h4 className="font-semibold text-info mb-2">Attempt Information</h4>
                <ul className="text-sm space-y-1 text-info/80">
                  <li>• Attempt {previousAttempts.length + 1} of {exam.maxAttempts}</li>
                  <li>• You must complete the exam in one session</li>
                  <li>• Your answers will be auto-saved as you work</li>
                  <li>• You cannot return to previous sections</li>
                  {exam.shuffleQuestions && <li>• Questions will be shown in random order</li>}
                  {exam.shuffleOptions && <li>• Answer choices will be shuffled</li>}
                </ul>
              </div>

              {/* Requirements */}
              <div className="bg-warning/10 p-4 rounded-box">
                <h4 className="font-semibold text-warning mb-2">Requirements</h4>
                <ul className="text-sm space-y-1 text-warning/80">
                  <li>• Stable internet connection required</li>
                  <li>• Calculator policies vary by section</li>
                  <li>• Close any unnecessary browser tabs</li>
                  {exam.requiresProctoring && <li>• Proctoring/supervision required</li>}
                  <li>• Ensure you have adequate time to complete</li>
                </ul>
              </div>
            </div>

            {/* Previous Attempts */}
            {previousAttempts.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-3">Previous Attempts</h3>
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <thead>
                      <tr>
                        <th>Attempt</th>
                        <th>Date</th>
                        <th>Score</th>
                        <th>Result</th>
                        <th>Time Used</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previousAttempts.map((attempt, index) => (
                        <tr key={attempt.id}>
                          <td>{index + 1}</td>
                          <td>{new Date(attempt.completedAt).toLocaleDateString()}</td>
                          <td>
                            {attempt.score !== null ? 
                              `${Math.round(attempt.score)}%` : 
                              'Not graded'
                            }
                          </td>
                          <td>
                            <span className={`badge badge-sm ${attempt.passed ? 'badge-success' : 'badge-error'}`}>
                              {attempt.passed ? 'Passed' : 'Failed'}
                            </span>
                          </td>
                          <td>{attempt.timeUsed ? `${attempt.timeUsed} min` : 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Start Button */}
          <div className="p-8 border-t border-base-300 text-center">
            <div className="max-w-md mx-auto space-y-4">
              <div className="text-sm text-base-content/70">
                By starting this exam, you agree to complete it according to the course policies and academic integrity guidelines.
              </div>
              
              <a 
                href={`/student/exams/${exam.id}/attempt?action=start`}
                className="btn btn-primary btn-lg gap-2 w-full"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Start Exam
              </a>

              <a href="/dashboard" className="btn btn-ghost">
                Return to Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function calculateTimeDisplay(exam) {
  if (exam.structure) {
    const total = (exam.structure.multipleChoice?.partA?.timeLimit || 0) +
                  (exam.structure.multipleChoice?.partB?.timeLimit || 0) +
                  (exam.structure.freeResponse?.partA?.timeLimit || 0) +
                  (exam.structure.freeResponse?.partB?.timeLimit || 0);
    return `${total} min`;
  }
  return `${exam.timeLimit || 90} min`;
}

function calculateQuestionCount(exam) {
  if (!exam.questions) return 0;
  
  return (exam.questions.multipleChoice?.partA?.length || 0) +
         (exam.questions.multipleChoice?.partB?.length || 0) +
         (exam.questions.freeResponse?.partA?.length || 0) +
         (exam.questions.freeResponse?.partB?.length || 0);
}
