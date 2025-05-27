import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import ExamListClient from './ExamListClient';

const prisma = new PrismaClient();

export default async function ExamListPage({ params }) {
  const resolvedParams = await params;
  
  try {
    // Fetch course, unit, and exams data
    const [course, unit] = await Promise.all([
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
        include: {
          unitExams: {
            include: {
              attempts: {
                select: {
                  id: true,
                  score: true,
                  passed: true,
                  completedAt: true,
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true
                    }
                  }
                },
                orderBy: { startedAt: 'desc' }
              },
              _count: {
                select: {
                  attempts: true
                }
              }
            },
            orderBy: [
              { order: 'asc' },
              { createdAt: 'asc' }
            ]
          },
          lessons: {
            select: {
              id: true,
              title: true,
              order: true,
              isPublished: true
            },
            orderBy: { order: 'asc' }
          },
          _count: {
            select: {
              lessons: true,
              unitExams: true
            }
          }
        }
      })
    ]);

    if (!course || !unit) {
      notFound();
    }

    // Calculate stats for each exam
    const examsWithStats = unit.unitExams.map(exam => {
      const completedAttempts = exam.attempts.filter(attempt => attempt.completedAt);
      const passedAttempts = completedAttempts.filter(attempt => attempt.passed);
      const averageScore = completedAttempts.length > 0 
        ? completedAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / completedAttempts.length
        : 0;

      // Parse questions to get counts
      let questionCounts = { total: 0, multipleChoice: 0, freeResponse: 0 };
      try {
        if (exam.questions && typeof exam.questions === 'object') {
          const questions = exam.questions;
          if (questions.multipleChoice) {
            questionCounts.multipleChoice = 
              (questions.multipleChoice.partA?.length || 0) + 
              (questions.multipleChoice.partB?.length || 0);
          }
          if (questions.freeResponse) {
            questionCounts.freeResponse = 
              (questions.freeResponse.partA?.length || 0) + 
              (questions.freeResponse.partB?.length || 0);
          }
          questionCounts.total = questionCounts.multipleChoice + questionCounts.freeResponse;
        }
      } catch (error) {
        console.error('Error parsing questions for exam:', exam.id, error);
      }

      return {
        ...exam,
        stats: {
          totalAttempts: exam._count.attempts,
          completedAttempts: completedAttempts.length,
          passedAttempts: passedAttempts.length,
          passRate: completedAttempts.length > 0 ? (passedAttempts.length / completedAttempts.length) * 100 : 0,
          averageScore: Math.round(averageScore * 100) / 100,
          questionCounts,
          hasAttempts: exam._count.attempts > 0,
          lastAttempt: completedAttempts.length > 0 ? completedAttempts[0].completedAt : null
        },
        // Remove heavy data for client
        attempts: exam.attempts.slice(0, 3), // Only recent attempts for preview
        _count: undefined
      };
    });

    // Determine if this is AP Precalculus
    const isAPPrecalculus = course.apExamType === 'AP-PRECALCULUS' || 
                           course.title.toLowerCase().includes('precalculus') ||
                           course.title.toLowerCase().includes('pre-calculus');

    // Calculate overall unit stats
    const unitStats = {
      totalLessons: unit._count.lessons,
      publishedLessons: unit.lessons.filter(lesson => lesson.isPublished).length,
      totalExams: unit._count.unitExams,
      publishedExams: examsWithStats.filter(exam => exam.isPublished).length,
      totalAttempts: examsWithStats.reduce((sum, exam) => sum + exam.stats.totalAttempts, 0),
      averagePassRate: examsWithStats.length > 0 
        ? examsWithStats.reduce((sum, exam) => sum + exam.stats.passRate, 0) / examsWithStats.length 
        : 0
    };

    return (
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Link 
                href={`/admin/courses/${course.id}/content`}
                className="btn btn-ghost btn-sm gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Course
              </Link>
              <div className="text-sm breadcrumbs">
                <ul>
                  <li><span className="text-base-content/60">{course.title}</span></li>
                  <li><span className="text-base-content/60">{unit.title}</span></li>
                  <li>Assessments</li>
                </ul>
              </div>
            </div>
            <h1 className="text-3xl font-bold">Unit Assessments</h1>
            <p className="text-base-content/70 mt-1">
              Manage exams and assessments for "{unit.title}"
              {isAPPrecalculus && ' • AP Precalculus Format'}
            </p>
          </div>

          <Link 
            href={`/admin/courses/${course.id}/units/${unit.id}/exams/new`}
            className="btn btn-primary gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Create New Exam
          </Link>
        </div>

        {/* Unit Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="stat bg-base-100 border border-base-300 rounded-box shadow-sm">
            <div className="stat-figure">
              <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="stat-title">Lessons</div>
            <div className="stat-value text-primary">{unitStats.totalLessons}</div>
            <div className="stat-desc">{unitStats.publishedLessons} published</div>
          </div>

          <div className="stat bg-base-100 border border-base-300 rounded-box shadow-sm">
            <div className="stat-figure">
              <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="stat-title">Assessments</div>
            <div className="stat-value text-secondary">{unitStats.totalExams}</div>
            <div className="stat-desc">{unitStats.publishedExams} published</div>
          </div>

          <div className="stat bg-base-100 border border-base-300 rounded-box shadow-sm">
            <div className="stat-figure">
              <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="stat-title">Student Attempts</div>
            <div className="stat-value text-accent">{unitStats.totalAttempts}</div>
            <div className="stat-desc">Total submissions</div>
          </div>

          <div className="stat bg-base-100 border border-base-300 rounded-box shadow-sm">
            <div className="stat-figure">
              <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-title">Avg Pass Rate</div>
            <div className="stat-value text-success">{Math.round(unitStats.averagePassRate)}%</div>
            <div className="stat-desc">Across all exams</div>
          </div>
        </div>

        {/* AP Format Notice */}
        {isAPPrecalculus && (
          <div className="alert alert-info">
            <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="font-bold">AP Precalculus Course Detected</h3>
              <div className="text-sm">Exams created in this unit will automatically follow AP exam format with calculator and non-calculator sections.</div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-base-100 rounded-box border border-base-300 shadow-xl">
          {/* Exams Header */}
          <div className="p-6 border-b border-base-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Unit Assessments</h2>
                <p className="text-base-content/70 text-sm mt-1">
                  {examsWithStats.length === 0 ? 'No assessments created yet' : 
                   `${examsWithStats.length} assessment${examsWithStats.length !== 1 ? 's' : ''} created`}
                </p>
              </div>
              
              {examsWithStats.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-sm gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                      Actions
                    </div>
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border border-base-300">
                      <li><button className="text-sm">Export Exam Data</button></li>
                      <li><button className="text-sm">Bulk Publish/Unpublish</button></li>
                      <li><button className="text-sm">Download Analytics</button></li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Exams List */}
          <div className="p-6">
            {examsWithStats.length === 0 ? (
              <EmptyExamsState 
                courseId={course.id} 
                unitId={unit.id} 
                isAPPrecalculus={isAPPrecalculus}
              />
            ) : (
              <ExamListClient 
                exams={examsWithStats}
                courseId={course.id}
                unitId={unit.id}
                isAPPrecalculus={isAPPrecalculus}
              />
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Unit Resources */}
          <div className="bg-base-100 rounded-box border border-base-300 p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Unit Lessons
            </h3>
            {unit.lessons.length > 0 ? (
              <div className="space-y-2">
                {unit.lessons.slice(0, 5).map((lesson, index) => (
                  <div key={lesson.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 bg-info/10 rounded-btn flex items-center justify-center text-xs font-medium text-info">
                        {lesson.order || index + 1}
                      </span>
                      <span className={lesson.isPublished ? '' : 'text-base-content/50'}>
                        {lesson.title}
                      </span>
                    </div>
                    <div className={`badge badge-xs ${lesson.isPublished ? 'badge-success' : 'badge-warning'}`}>
                      {lesson.isPublished ? 'Published' : 'Draft'}
                    </div>
                  </div>
                ))}
                {unit.lessons.length > 5 && (
                  <div className="text-xs text-base-content/50 pt-1">
                    +{unit.lessons.length - 5} more lessons
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-base-content/50">No lessons created yet</p>
            )}
          </div>

          {/* Quick Stats */}
          <div className="bg-base-100 rounded-box border border-base-300 p-4">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Performance Overview
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Total Questions:</span>
                <span className="font-medium">
                  {examsWithStats.reduce((sum, exam) => sum + (exam.stats.questionCounts?.total || 0), 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Completion Rate:</span>
                <span className="font-medium">
                  {unitStats.totalAttempts > 0 ? 
                    `${Math.round((examsWithStats.reduce((sum, exam) => sum + exam.stats.completedAttempts, 0) / unitStats.totalAttempts) * 100)}%` : 
                    'N/A'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span>Average Score:</span>
                <span className="font-medium">
                  {examsWithStats.length > 0 ? 
                    `${Math.round(examsWithStats.reduce((sum, exam) => sum + exam.stats.averageScore, 0) / examsWithStats.length)}%` : 
                    'N/A'
                  }
                </span>
              </div>
              <div className="flex justify-between">
                <span>Students Passed:</span>
                <span className="font-medium text-success">
                  {examsWithStats.reduce((sum, exam) => sum + exam.stats.passedAttempts, 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  } catch (error) {
    console.error('Error loading exam list page:', error);
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-error mb-2">Error Loading Exams</h1>
          <p className="text-base-content/70 mb-4">Failed to load the exam management page.</p>
          <Link href={`/admin/courses/${resolvedParams.id}/content`} className="btn btn-primary btn-sm">
            Return to Course
          </Link>
        </div>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Empty state component for when no exams exist
function EmptyExamsState({ courseId, unitId, isAPPrecalculus }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-2">No Assessments Created</h3>
      <p className="text-base-content/70 mb-6 max-w-md mx-auto">
        Create your first {isAPPrecalculus ? 'AP-style unit assessment' : 'unit assessment'} to begin testing your students' understanding.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link 
          href={`/admin/courses/${courseId}/units/${unitId}/exams/new`}
          className="btn btn-primary gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Create First Assessment
        </Link>
        <button className="btn btn-ghost gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          View Help Guide
        </button>
      </div>
      
      {isAPPrecalculus && (
        <div className="mt-8 p-4 bg-info/5 border border-info/20 rounded-box max-w-2xl mx-auto">
          <h4 className="font-medium text-info mb-2">AP Precalculus Assessment Tips</h4>
          <ul className="text-sm text-base-content/70 text-left space-y-1">
            <li>• Include both calculator and non-calculator sections</li>
            <li>• Mix multiple choice (20 questions) and free response (2 questions)</li>
            <li>• Align questions with AP learning objectives</li>
            <li>• Focus on Units 1-3 content (Unit 4 not assessed on AP exam)</li>
          </ul>
        </div>
      )}
    </div>
  );
}
