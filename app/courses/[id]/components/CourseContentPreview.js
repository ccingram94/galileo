'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CourseContentPreview({ course, isEnrolled, user }) {
  const [expandedUnit, setExpandedUnit] = useState(null);

  const toggleUnit = (unitId) => {
    setExpandedUnit(expandedUnit === unitId ? null : unitId);
  };

  const calculateUnitProgress = (unit) => {
    // This would normally come from user progress data
    // For now, return a placeholder
    return Math.floor(Math.random() * 100);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Course Curriculum</h2>
        <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
          Explore the comprehensive curriculum designed to take you from beginner to advanced level.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {course.units.length > 0 ? (
          <div className="space-y-4">
            {course.units.map((unit, unitIndex) => {
              const isExpanded = expandedUnit === unit.id;
              const progress = isEnrolled ? calculateUnitProgress(unit) : 0;
              const publishedLessons = unit.lessons.filter(lesson => lesson.isPublished || isEnrolled);
              const publishedExams = unit.unitExams.filter(exam => exam.isPublished || isEnrolled);

              return (
                <div key={unit.id} className="card bg-base-100 border border-base-300">
                  <div 
                    className="card-body cursor-pointer hover:bg-base-200/50 transition-colors"
                    onClick={() => toggleUnit(unit.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="card-title text-lg">
                          <span className="badge badge-outline mr-3">
                            Unit {unitIndex + 1}
                          </span>
                          {unit.title}
                        </h3>
                        {unit.description && (
                          <p className="text-base-content/70 mt-2">{unit.description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-3 text-sm text-base-content/60">
                          <span>{publishedLessons.length} lessons</span>
                          {publishedExams.length > 0 && (
                            <span>{publishedExams.length} exams</span>
                          )}
                          {isEnrolled && (
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-base-300 rounded-full h-1">
                                <div
                                  className="bg-success h-1 rounded-full"
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>
                              <span>{progress}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {isEnrolled && (
                          <Link
                            href={`/dashboard/courses/${course.id}/units/${unit.id}`}
                            className="btn btn-primary btn-sm"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Start Unit
                          </Link>
                        )}
                        <svg 
                          className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-base-300">
                      <div className="p-6 space-y-4">
                        {/* Lessons */}
                        {publishedLessons.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-base-content/80 mb-3">Lessons</h4>
                            <div className="space-y-2">
                              {publishedLessons.map((lesson, lessonIndex) => (
                                <div 
                                  key={lesson.id} 
                                  className="flex items-center justify-between p-3 bg-base-200/30 rounded-lg"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                      <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h1m4 0h1m-7 7h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="font-medium">
                                        {lessonIndex + 1}. {lesson.title}
                                      </div>
                                      {lesson.description && (
                                        <div className="text-sm text-base-content/70">
                                          {lesson.description}
                                        </div>
                                      )}
                                      <div className="flex items-center gap-4 mt-1 text-xs text-base-content/60">
                                        {lesson.duration && (
                                          <span>{lesson.duration} min</span>
                                        )}
                                        {lesson.lessonQuizzes && (
                                          <span>Quiz included</span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {!lesson.isPublished && (
                                      <div className="badge badge-warning badge-sm">Preview</div>
                                    )}
                                    {isEnrolled ? (
                                      <Link
                                        href={`/dashboard/courses/${course.id}/units/${unit.id}/lessons/${lesson.id}`}
                                        className="btn btn-outline btn-xs"
                                      >
                                        Start
                                      </Link>
                                    ) : (
                                      <svg className="w-4 h-4 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                      </svg>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Unit Exams */}
                        {publishedExams.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-base-content/80 mb-3">Assessments</h4>
                            <div className="space-y-2">
                              {publishedExams.map((exam, examIndex) => (
                                <div 
                                  key={exam.id} 
                                  className="flex items-center justify-between p-3 bg-warning/10 rounded-lg border border-warning/20"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-warning/20 rounded-full flex items-center justify-center">
                                      <svg className="w-4 h-4 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                    </div>
                                    <div>
                                      <div className="font-medium">{exam.title}</div>
                                      {exam.description && (
                                        <div className="text-sm text-base-content/70">
                                          {exam.description}
                                        </div>
                                      )}
                                      <div className="flex items-center gap-4 mt-1 text-xs text-base-content/60">
                                        <span className="capitalize">{exam.examType.toLowerCase().replace('_', ' ')}</span>
                                        <span>Passing score: {exam.passingScore}%</span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {!exam.isPublished && (
                                      <div className="badge badge-warning badge-sm">Preview</div>
                                    )}
                                    {isEnrolled ? (
                                      <Link
                                        href={`/dashboard/courses/${course.id}/units/${unit.id}/exams/${exam.id}`}
                                        className="btn btn-outline btn-xs"
                                      >
                                        Take Exam
                                      </Link>
                                    ) : (
                                      <svg className="w-4 h-4 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                      </svg>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {publishedLessons.length === 0 && publishedExams.length === 0 && (
                          <div className="text-center py-8 text-base-content/50">
                            <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <p>Content for this unit is being prepared</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-base-200/30 rounded-lg">
            <svg className="w-16 h-16 text-base-content/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-xl font-semibold mb-2">Course Content Coming Soon</h3>
            <p className="text-base-content/70">
              The curriculum for this course is being developed. Check back soon for updates!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
