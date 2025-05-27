import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function CourseContentPage({ params }) {
  const resolvedParams = await params;
  try {
    const course = await prisma.course.findUnique({
      where: { id: resolvedParams.id },
      include: {
        units: {
          include: {
            lessons: {
              include: {
                lessonQuizzes: true
              },
              orderBy: { order: 'asc' }
            },
            unitExams: {
              orderBy: { createdAt: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!course) {
      notFound();
    }

    // Safe calculation functions with null checks
    const getTotalLessons = () => {
      return course.units?.reduce((sum, unit) => {
        return sum + (unit.lessons?.length || 0);
      }, 0) || 0;
    };

    const getTotalQuizzes = () => {
      return course.units?.reduce((sum, unit) => {
        return sum + (unit.lessons?.reduce((lessonSum, lesson) => {
          return lessonSum + (lesson.lessonQuizzes?.length || 0);
        }, 0) || 0);
      }, 0) || 0;
    };

    const getTotalExams = () => {
      return course.units?.reduce((sum, unit) => {
        return sum + (unit.unitExams?.length || 0);
      }, 0) || 0;
    };

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Course Content</h1>
            <p className="text-base-content/70 mt-1">
              Manage units, lessons, and assessments for "{course.title}"
            </p>
          </div>
          <div className="flex gap-2">
            <Link href={`/admin/courses/${course.id}/units/new`} className="btn btn-primary gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Unit
            </Link>
            <Link href={`/admin/courses/${course.id}/edit`} className="btn btn-ghost gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Course
            </Link>
          </div>
        </div>

        {/* Course Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-base-100 rounded-box border border-base-300 p-4">
            <div className="text-sm font-medium text-base-content/70">Units</div>
            <div className="text-2xl font-bold text-primary">{course.units?.length || 0}</div>
          </div>
          <div className="bg-base-100 rounded-box border border-base-300 p-4">
            <div className="text-sm font-medium text-base-content/70">Lessons</div>
            <div className="text-2xl font-bold text-secondary">
              {getTotalLessons()}
            </div>
          </div>
          <div className="bg-base-100 rounded-box border border-base-300 p-4">
            <div className="text-sm font-medium text-base-content/70">Quizzes</div>
            <div className="text-2xl font-bold text-accent">
              {getTotalQuizzes()}
            </div>
          </div>
          <div className="bg-base-100 rounded-box border border-base-300 p-4">
            <div className="text-sm font-medium text-base-content/70">Exams</div>
            <div className="text-2xl font-bold text-info">
              {getTotalExams()}
            </div>
          </div>
        </div>

        {/* Units List */}
        <div className="bg-base-100 rounded-box border border-base-300 shadow-xl">
          <div className="p-6 border-b border-base-300">
            <h2 className="text-xl font-semibold">Course Structure</h2>
            <p className="text-base-content/70 mt-1">
              Organize your course content into units and lessons
            </p>
          </div>
          <div className="p-6">
            {course.units && course.units.length > 0 ? (
              <div className="space-y-4">
                {course.units.map((unit, unitIndex) => (
                  <div key={unit.id} className="border border-base-300 rounded-box">
                    {/* Unit Header */}
                    <div className="p-4 bg-base-200 border-b border-base-300">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-btn flex items-center justify-center">
                            <span className="text-sm font-bold text-primary">{unitIndex + 1}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{unit.title}</h3>
                            {unit.description && (
                              <p className="text-sm text-base-content/70 mt-1">{unit.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="badge badge-ghost">
                            {unit.lessons?.length || 0} lessons
                          </div>
                          <div className="badge badge-ghost">
                            {unit.unitExams?.length || 0} exams
                          </div>
                          <div className="dropdown dropdown-left">
                            <label tabIndex={0} className="btn btn-ghost btn-sm">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                              </svg>
                            </label>
                            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 border border-base-300">
                              <li>
                                <Link href={`/admin/courses/${course.id}/units/${unit.id}/lessons/new`}>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                  </svg>
                                  Add Lesson
                                </Link>
                              </li>
                              <li>
                                <Link href={`/admin/courses/${course.id}/units/${unit.id}/exams/new`}>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                  </svg>
                                  Add Exam
                                </Link>
                              </li>
                              <li className="border-t border-base-300 mt-2 pt-2">
                                <Link href={`/admin/courses/${course.id}/units/${unit.id}/edit`}>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Edit Unit
                                </Link>
                              </li>
                              <li>
                                <Link href={`/admin/courses/${course.id}/units/${unit.id}/reorder`}>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                  </svg>
                                  Reorder
                                </Link>
                              </li>
                              <li>
                                <Link href={`/admin/courses/${course.id}/units/${unit.id}/delete`} className="text-error">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Delete Unit
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Lessons */}
                    {unit.lessons && unit.lessons.length > 0 && (
                      <div className="p-4">
                        <h4 className="font-medium text-base-content/70 mb-3">Lessons</h4>
                        <div className="space-y-2">
                          {unit.lessons.map((lesson, lessonIndex) => (
                            <div key={lesson.id} className="flex items-center justify-between p-3 bg-base-50 rounded-btn border border-base-200">
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-secondary/10 rounded-btn flex items-center justify-center">
                                  <span className="text-xs font-bold text-secondary">{lessonIndex + 1}</span>
                                </div>
                                <div>
                                  <div className="font-medium">{lesson.title}</div>
                                  <div className="flex items-center gap-2 text-xs text-base-content/70">
                                    <span className={`badge badge-xs ${lesson.isPublished ? 'badge-success' : 'badge-warning'}`}>
                                      {lesson.isPublished ? 'Published' : 'Draft'}
                                    </span>
                                    {lesson.lessonQuizzes && lesson.lessonQuizzes.length > 0 && (
                                      <span className="badge badge-xs badge-accent">Has Quiz</span>
                                    )}
                                    {lesson.videoUrl && (
                                      <span className="badge badge-xs badge-info">Video</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Link 
                                  href={`/admin/courses/${course.id}/units/${unit.id}/lessons/${lesson.id}/edit`}
                                  className="btn btn-ghost btn-xs"
                                >
                                  Edit
                                </Link>
                                {lesson.lessonQuizzes && lesson.lessonQuizzes.length > 0 ? (
                                  <Link 
                                    href={`/admin/courses/${course.id}/units/${unit.id}/lessons/${lesson.id}/quiz/edit`}
                                    className="btn btn-ghost btn-xs"
                                  >
                                    Quiz
                                  </Link>
                                ) : (
                                  <Link 
                                    href={`/admin/courses/${course.id}/units/${unit.id}/lessons/${lesson.id}/quiz/create`}
                                    className="btn btn-ghost btn-xs"
                                  >
                                    Add Quiz
                                  </Link>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Unit Exams */}
                    {unit.unitExams && unit.unitExams.length > 0 && (
                      <div className="p-4 border-t border-base-300">
                        <h4 className="font-medium text-base-content/70 mb-3">Unit Exams</h4>
                        <div className="space-y-2">
                          {unit.unitExams.map((exam) => (
                            <div key={exam.id} className="flex items-center justify-between p-3 bg-accent/5 rounded-btn border border-accent/20">
                              <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-accent/10 rounded-btn flex items-center justify-center">
                                  <svg className="w-3 h-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                  </svg>
                                </div>
                                <div>
                                  <div className="font-medium">{exam.title}</div>
                                  <div className="flex items-center gap-2 text-xs text-base-content/70">
                                    <span className={`badge badge-xs ${exam.isPublished ? 'badge-success' : 'badge-warning'}`}>
                                      {exam.isPublished ? 'Published' : 'Draft'}
                                    </span>
                                    {exam.timeLimit && (
                                      <span className="badge badge-xs badge-info">{exam.timeLimit} mins</span>
                                    )}
                                    <span className="badge badge-xs badge-ghost">Pass: {exam.passingScore}%</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Link 
                                  href={`/admin/courses/${course.id}/units/${unit.id}/exams/${exam.id}/edit`}
                                  className="btn btn-ghost btn-xs"
                                >
                                  Edit
                                </Link>
                                <Link 
                                  href={`/admin/courses/${course.id}/units/${unit.id}/exams/${exam.id}/results`}
                                  className="btn btn-ghost btn-xs"
                                >
                                  Results
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Show options to add content if sections are empty */}
                    {(!unit.lessons || unit.lessons.length === 0) && (!unit.unitExams || unit.unitExams.length === 0) && (
                      <div className="p-4">
                        <div className="text-center py-8 text-base-content/50">
                          <p className="mb-4">This unit is empty</p>
                          <div className="flex gap-2 justify-center">
                            <Link 
                              href={`/admin/courses/${course.id}/units/${unit.id}/lessons/new`}
                              className="btn btn-ghost btn-sm"
                            >
                              Add First Lesson
                            </Link>
                            <Link 
                              href={`/admin/courses/${course.id}/units/${unit.id}/exams/new`}
                              className="btn btn-ghost btn-sm"
                            >
                              Add Unit Exam
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-base-content/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="text-lg font-semibold text-base-content/70 mb-2">No units found</h3>
                <p className="text-base-content/50 mb-4">Create your first unit to start building course content</p>
                <Link href={`/admin/courses/${course.id}/units/new`} className="btn btn-primary">
                  Create First Unit
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    );

  } catch (error) {
    console.error('Error loading course content:', error);
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-error mb-2">Error Loading Content</h1>
        <p className="text-base-content/70">Failed to load course content.</p>
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-base-content/50">Technical Details</summary>
          <pre className="text-xs text-left mt-2 p-2 bg-base-200 rounded">
            {error.message}
          </pre>
        </details>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}
