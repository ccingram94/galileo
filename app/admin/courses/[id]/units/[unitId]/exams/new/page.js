import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import ExamForm from './ExamForm';

const prisma = new PrismaClient();

export default async function NewExamPage({ params }) {
  const resolvedParams = await params;
  try {
    const [course, unit] = await Promise.all([
      prisma.course.findUnique({
        where: { id: resolvedParams.id }
      }),
      prisma.unit.findUnique({
        where: { 
          id: resolvedParams.unitId,
          courseId: resolvedParams.id
        },
        include: {
          unitExams: {
            orderBy: { createdAt: 'asc' } // Changed from 'order' to 'createdAt'
          },
          lessons: {
            select: {
              id: true,
              title: true,
              order: true
            },
            orderBy: { order: 'asc' }
          }
        }
      })
    ]);

    if (!course || !unit) {
      notFound();
    }

    // Verify this is an AP Precalculus course
    const isAPPrecalculus = course.apExamType === 'AP-PRECALCULUS' || 
                           course.title.toLowerCase().includes('precalculus') ||
                           course.title.toLowerCase().includes('pre-calculus');

    return (
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Course Context Banner */}
        <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-box p-4 border border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-btn flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-primary">
                {isAPPrecalculus ? 'AP Precalculus Unit Assessment' : 'Unit Assessment Exam'}
              </h2>
              <p className="text-sm text-base-content/70">
                {course.title} → {unit.title}
                {isAPPrecalculus && ' → AP Exam Preparation'}
              </p>
            </div>
            {isAPPrecalculus && (
              <div className="ml-auto">
                <div className="badge badge-primary gap-2">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  AP Format
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Unit Context Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-base-100 rounded-box border border-base-300 p-4">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="font-medium text-secondary">Unit Content</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Lessons:</span>
                <span className="font-medium">{unit.lessons?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Existing Exams:</span>
                <span className="font-medium">{unit.unitExams?.length || 0}</span>
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-box border border-base-300 p-4">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-accent">Exam Guidelines</span>
            </div>
            <div className="space-y-1 text-xs text-base-content/70">
              {isAPPrecalculus ? (
                <>
                  <div>• Multiple Choice: 20 questions</div>
                  <div>• Free Response: 2 questions</div>
                  <div>• Calculator sections included</div>
                  <div>• AP format simulation</div>
                </>
              ) : (
                <>
                  <div>• Customizable question types</div>
                  <div>• Flexible timing options</div>
                  <div>• Auto and manual grading</div>
                  <div>• Student performance analytics</div>
                </>
              )}
            </div>
          </div>

          <div className="bg-base-100 rounded-box border border-base-300 p-4">
            <div className="flex items-center gap-3 mb-2">
              <svg className="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium text-info">Recommended</span>
            </div>
            <div className="space-y-1 text-xs text-base-content/70">
              <div>• Time: {isAPPrecalculus ? '90' : '45-90'} minutes</div>
              <div>• Difficulty: Unit appropriate</div>
              <div>• Coverage: All unit topics</div>
              <div>• Passing: 70% minimum</div>
            </div>
          </div>
        </div>

        {/* Main Form Component */}
        <ExamForm 
          course={course} 
          unit={unit}
          isAPPrecalculus={isAPPrecalculus}
        />

        {/* Help Information */}
        <div className="bg-info/5 border border-info/20 rounded-box p-6">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-info flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-medium text-info mb-2">
                {isAPPrecalculus ? 'AP Precalculus Exam Creation Tips' : 'Unit Assessment Creation Tips'}
              </h4>
              <ul className="text-sm text-base-content/70 space-y-1 list-disc list-inside">
                {isAPPrecalculus ? (
                  <>
                    <li>Follow AP exam format: Multiple Choice (Part A: no calculator, Part B: calculator required)</li>
                    <li>Include Free Response questions with multiple parts (A, B, C) and sub-parts (i, ii, iii)</li>
                    <li>Align questions with AP learning objectives and mathematical practices</li>
                    <li>Test content from Units 1, 2, and 3 (Unit 4 not assessed on AP exam)</li>
                    <li>Include real-world modeling contexts in Free Response questions</li>
                    <li>Provide clear scoring rubrics for partial credit on Free Response</li>
                  </>
                ) : (
                  <>
                    <li>Include questions that cover all major topics from the unit</li>
                    <li>Mix question difficulties to assess different skill levels</li>
                    <li>Provide clear instructions and time expectations</li>
                    <li>Include both procedural and conceptual questions</li>
                    <li>Test before publishing to ensure question clarity</li>
                    <li>Review scoring rubrics for consistency</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        {unit.lessons && unit.lessons.length > 0 && (
          <div className="bg-base-100 rounded-box border border-base-300 p-4">
            <h3 className="font-medium mb-3">Unit Lessons for Reference</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {unit.lessons.map((lesson, index) => (
                <div key={lesson.id} className="flex items-center gap-2 p-2 bg-base-50 rounded-btn text-sm">
                  <span className="w-6 h-6 bg-secondary/10 rounded-btn flex items-center justify-center text-xs font-bold text-secondary">
                    {lesson.order || index + 1}
                  </span>
                  <span className="truncate">{lesson.title}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );

  } catch (error) {
    console.error('Error loading new exam page:', error);
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-error mb-2">Error Loading Page</h1>
          <p className="text-base-content/70 mb-4">Failed to load the exam creation page.</p>
          <details className="text-left">
            <summary className="cursor-pointer text-sm text-base-content/50 mb-2">Technical Details</summary>
            <pre className="text-xs p-2 bg-base-200 rounded overflow-auto">
              {error.message}
            </pre>
          </details>
          <div className="flex gap-2 justify-center mt-4">
            <button 
              onClick={() => window.location.reload()} 
              className="btn btn-primary btn-sm"
            >
              Try Again
            </button>
            <button 
              onClick={() => window.history.back()} 
              className="btn btn-ghost btn-sm"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}
