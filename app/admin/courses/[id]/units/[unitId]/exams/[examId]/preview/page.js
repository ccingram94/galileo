import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import ExamPreviewInterface from './ExamPreviewInterface';

const prisma = new PrismaClient();

export const metadata = {
  title: 'Preview Assessment',
  description: 'Preview unit assessment exam'
};

export default async function ExamPreviewPage({ params }) {
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
              passed: true
            },
            take: 5
          },
          unit: {
            select: {
              id: true,
              title: true,
              courseId: true
            }
          },
          _count: {
            select: {
              attempts: true
            }
          }
        }
      })
    ]);

    // Verify all resources exist and belong together
    if (!course || !unit || !exam) {
      notFound();
    }

    if (exam.unitId !== unit.id || exam.unit.courseId !== course.id) {
      notFound();
    }

    // Determine if this is AP Precalculus
    const isAPPrecalculus = course.apExamType === 'AP-PRECALCULUS' || 
                           course.title.toLowerCase().includes('precalculus') ||
                           course.title.toLowerCase().includes('pre-calculus');

    // Calculate exam statistics
    const questionStats = calculateQuestionStats(exam.questions);
    const totalQuestions = questionStats.total;
    const totalTime = calculateTotalTime(exam);
    const completedAttempts = exam.attempts.filter(attempt => attempt.completedAt);

    // Prepare exam sections for preview
    const examSections = prepareExamSections(exam, isAPPrecalculus);

    return (
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link 
                href={`/admin/courses/${course.id}/units/${unit.id}/exams/${exam.id}/edit`}
                className="btn btn-ghost btn-sm gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Edit
              </Link>
              <div className="text-sm breadcrumbs">
                <ul>
                  <li><span className="text-base-content/60">{course.title}</span></li>
                  <li><span className="text-base-content/60">{unit.title}</span></li>
                  <li><span className="text-base-content/60">Assessments</span></li>
                  <li>Preview</li>
                </ul>
              </div>
            </div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              Preview Assessment
              <div className={`badge ${exam.isPublished ? 'badge-success' : 'badge-warning'}`}>
                {exam.isPublished ? 'Published' : 'Draft'}
              </div>
            </h1>
            <p className="text-base-content/70 mt-1">
              Preview "{exam.title}" as students will see it
              {isAPPrecalculus && ' • AP Precalculus Format'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/admin/courses/${course.id}/units/${unit.id}/exams/${exam.id}/edit`}
              className="btn btn-ghost btn-sm gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Exam
            </Link>
            
            {exam._count.attempts > 0 && (
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

        {/* Exam Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stats shadow border border-base-300">
            <div className="stat">
              <div className="stat-title">Total Questions</div>
              <div className="stat-value text-primary text-2xl">{totalQuestions}</div>
              <div className="stat-desc">
                {questionStats.multipleChoice} MC, {questionStats.freeResponse} FR
              </div>
            </div>
          </div>

          <div className="stats shadow border border-base-300">
            <div className="stat">
              <div className="stat-title">Total Time</div>
              <div className="stat-value text-secondary text-2xl">{totalTime}</div>
              <div className="stat-desc">minutes</div>
            </div>
          </div>

          <div className="stats shadow border border-base-300">
            <div className="stat">
              <div className="stat-title">Total Points</div>
              <div className="stat-value text-accent text-2xl">{exam.totalPoints || 'TBD'}</div>
              <div className="stat-desc">possible</div>
            </div>
          </div>

          <div className="stats shadow border border-base-300">
            <div className="stat">
              <div className="stat-title">Attempts</div>
              <div className="stat-value text-info text-2xl">{exam._count.attempts}</div>
              <div className="stat-desc">
                {completedAttempts.length} completed
              </div>
            </div>
          </div>
        </div>

        {/* Validation Warnings */}
        {renderValidationWarnings(exam, questionStats, isAPPrecalculus)}

        {/* Main Preview Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Preview Interface */}
          <div className="lg:col-span-3">
            <ExamPreviewInterface 
              exam={exam}
              course={course}
              unit={unit}
              isAPPrecalculus={isAPPrecalculus}
              examSections={examSections}
            />
          </div>

          {/* Info Sidebar */}
          <div className="space-y-4">
            {/* Exam Settings */}
            <div className="bg-base-100 rounded-box border border-base-300 p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
                Exam Settings
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Max Attempts:</span>
                  <span className="font-medium">{exam.maxAttempts}</span>
                </div>
                <div className="flex justify-between">
                  <span>Passing Score:</span>
                  <span className="font-medium">{exam.passingScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Shuffle Questions:</span>
                  <span className={`badge badge-xs ${exam.shuffleQuestions ? 'badge-success' : 'badge-ghost'}`}>
                    {exam.shuffleQuestions ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shuffle Options:</span>
                  <span className={`badge badge-xs ${exam.shuffleOptions ? 'badge-success' : 'badge-ghost'}`}>
                    {exam.shuffleOptions ? 'Yes' : 'No'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Show Answers:</span>
                  <span className={`badge badge-xs ${exam.showCorrectAnswers ? 'badge-success' : 'badge-ghost'}`}>
                    {exam.showCorrectAnswers ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-base-100 rounded-box border border-base-300 p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Availability
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium">Available From:</span>
                  <div className="text-base-content/70">
                    {exam.availableFrom ? 
                      new Date(exam.availableFrom).toLocaleString() : 
                      'Immediately'
                    }
                  </div>
                </div>
                <div>
                  <span className="font-medium">Available Until:</span>
                  <div className="text-base-content/70">
                    {exam.availableUntil ? 
                      new Date(exam.availableUntil).toLocaleString() : 
                      'No end date'
                    }
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">Requires Proctoring:</span>
                  <span className={`badge badge-xs ${exam.requiresProctoring ? 'badge-warning' : 'badge-ghost'}`}>
                    {exam.requiresProctoring ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            {/* Section Breakdown */}
            <div className="bg-base-100 rounded-box border border-base-300 p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Section Breakdown
              </h3>
              <div className="space-y-3 text-sm">
                {examSections.map((section, index) => (
                  <div key={index} className="border-l-2 border-base-300 pl-3">
                    <div className="font-medium flex items-center gap-2">
                      {section.title}
                      <div className={`badge badge-xs ${section.calculatorRequired ? 'badge-success' : 'badge-warning'}`}>
                        {section.calculatorRequired ? 'Calculator' : 'No Calculator'}
                      </div>
                    </div>
                    <div className="text-base-content/70">
                      {section.questions.length} questions • {section.timeLimit} min
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-base-100 rounded-box border border-base-300 p-4">
              <h3 className="font-medium mb-3">Quick Actions</h3>
              <div className="space-y-2">
                <button className="btn btn-primary btn-sm w-full gap-2" 
                        onClick={() => window.location.reload()}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh Preview
                </button>
                <Link
                  href={`/admin/courses/${course.id}/units/${unit.id}/exams/${exam.id}/edit`}
                  className="btn btn-ghost btn-sm w-full gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Exam
                </Link>
                <Link
                  href={`/admin/courses/${course.id}/units/${unit.id}/exams`}
                  className="btn btn-ghost btn-sm w-full gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                  All Exams
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  } catch (error) {
    console.error('Error loading exam preview:', error);
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-error mb-2">Error Loading Preview</h1>
          <p className="text-base-content/70 mb-4">Failed to load the exam preview.</p>
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

// Helper function to calculate total time
function calculateTotalTime(exam) {
  if (!exam.structure) {
    return exam.timeLimit || 90;
  }

  let totalTime = 0;
  
  if (exam.structure.multipleChoice) {
    totalTime += exam.structure.multipleChoice.partA?.timeLimit || 0;
    totalTime += exam.structure.multipleChoice.partB?.timeLimit || 0;
  }
  
  if (exam.structure.freeResponse) {
    totalTime += exam.structure.freeResponse.partA?.timeLimit || 0;
    totalTime += exam.structure.freeResponse.partB?.timeLimit || 0;
  }

  return totalTime || exam.timeLimit || 90;
}

// Helper function to prepare exam sections for preview
function prepareExamSections(exam, isAPPrecalculus) {
  const sections = [];
  
  if (!exam.questions) {
    return sections;
  }

  // Multiple Choice Part A
  if (exam.questions.multipleChoice?.partA?.length > 0) {
    sections.push({
      id: 'mc-part-a',
      title: 'Section I, Part A: Multiple Choice',
      subtitle: 'No Calculator',
      type: 'multiple-choice',
      calculatorRequired: false,
      timeLimit: exam.structure?.multipleChoice?.partA?.timeLimit || 45,
      questions: exam.questions.multipleChoice.partA,
      instructions: 'Choose the best answer for each question.'
    });
  }

  // Multiple Choice Part B
  if (exam.questions.multipleChoice?.partB?.length > 0) {
    sections.push({
      id: 'mc-part-b',
      title: 'Section I, Part B: Multiple Choice',
      subtitle: 'Graphing Calculator Required',
      type: 'multiple-choice',
      calculatorRequired: true,
      timeLimit: exam.structure?.multipleChoice?.partB?.timeLimit || 15,
      questions: exam.questions.multipleChoice.partB,
      instructions: 'Choose the best answer for each question. A graphing calculator is required for this section.'
    });
  }

  // Free Response Part A
  if (exam.questions.freeResponse?.partA?.length > 0) {
    sections.push({
      id: 'fr-part-a',
      title: 'Section II, Part A: Free Response',
      subtitle: 'Graphing Calculator Required',
      type: 'free-response',
      calculatorRequired: true,
      timeLimit: exam.structure?.freeResponse?.partA?.timeLimit || 20,
      questions: exam.questions.freeResponse.partA,
      instructions: 'Show all work and justify your reasoning. A graphing calculator is required for this section.'
    });
  }

  // Free Response Part B
  if (exam.questions.freeResponse?.partB?.length > 0) {
    sections.push({
      id: 'fr-part-b',
      title: 'Section II, Part B: Free Response',
      subtitle: 'No Calculator',
      type: 'free-response',
      calculatorRequired: false,
      timeLimit: exam.structure?.freeResponse?.partB?.timeLimit || 10,
      questions: exam.questions.freeResponse.partB,
      instructions: 'Show all work and justify your reasoning. No calculator is allowed for this section.'
    });
  }

  return sections;
}

// Helper function to render validation warnings
function renderValidationWarnings(exam, questionStats, isAPPrecalculus) {
  const warnings = [];

  // Check for missing questions
  if (questionStats.total === 0) {
    warnings.push({
      type: 'error',
      title: 'No Questions Added',
      message: 'This exam has no questions. Students will not be able to take it.'
    });
  }

  // Check for AP format compliance
  if (isAPPrecalculus) {
    if (exam.structure?.multipleChoice?.partA?.count > 0 && 
        (!exam.questions?.multipleChoice?.partA || exam.questions.multipleChoice.partA.length === 0)) {
      warnings.push({
        type: 'warning',
        title: 'Missing Multiple Choice Part A',
        message: 'AP format specifies Part A questions but none are added.'
      });
    }
    
    if (exam.structure?.freeResponse?.partA?.count === 0 && 
        exam.structure?.freeResponse?.partB?.count === 0) {
      warnings.push({
        type: 'warning',
        title: 'No Free Response Questions',
        message: 'AP format typically requires free response questions.'
      });
    }
  }

  // Check publish status vs content
  if (exam.isPublished && questionStats.total === 0) {
    warnings.push({
      type: 'error',
      title: 'Published Exam Without Questions',
      message: 'This exam is published but has no questions. Consider unpublishing until questions are added.'
    });
  }

  if (warnings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {warnings.map((warning, index) => (
        <div key={index} className={`alert ${warning.type === 'error' ? 'alert-error' : 'alert-warning'}`}>
          <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                  d={warning.type === 'error' ? 
                    "M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" :
                    "M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  } 
            />
          </svg>
          <div>
            <h3 className="font-bold">{warning.title}</h3>
            <div className="text-sm">{warning.message}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
