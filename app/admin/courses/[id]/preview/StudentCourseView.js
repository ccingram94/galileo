'use client';

import Link from 'next/link';
import { useState } from 'react';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

export default function StudentCourseView({ course }) {
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  const totalLessons = course.units.reduce((sum, unit) => sum + unit.lessons.length, 0);
  const totalExams = course.units.reduce((sum, unit) => sum + unit.unitExams.length, 0);

  return (
    <>
      {/* Admin Header */}
      <div className="bg-warning/10 border border-warning/20 rounded-box p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <div>
              <h2 className="font-semibold text-warning">Course Preview Mode</h2>
              <p className="text-sm text-base-content/70">This is how students will see your course</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/admin/courses/${course.id}/edit`} className="btn btn-ghost btn-sm">
              Edit Course
            </Link>
            <Link href="/admin/courses" className="btn btn-ghost btn-sm">
              Back to Courses
            </Link>
          </div>
        </div>
      </div>

      {/* Student Course View */}
      <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/30 to-primary/5 relative -mx-6 -mb-8 px-6 pb-8">
        {/* Hero Section */}
        <div className="bg-base-100 rounded-box border border-base-300 shadow-xl overflow-hidden">
          {course.imageUrl && (
            <div className="h-48 bg-gradient-to-r from-primary to-secondary relative overflow-hidden">
              <img 
                src={course.imageUrl} 
                alt={course.title}
                className="w-full h-full object-cover mix-blend-overlay opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/80"></div>
            </div>
          )}
          
          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <span className="badge badge-primary">{course.apExamType.replace(/-/g, ' ')}</span>
                  {!course.isPublished && (
                    <span className="badge badge-warning">Draft</span>
                  )}
                </div>
                
                <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
                
                {course.description && (
                  <p className="text-lg text-base-content/80 mb-6 leading-relaxed">
                    {course.description}
                  </p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                  <div className="text-center p-4 bg-base-200/50 rounded-box">
                    <div className="text-2xl font-bold text-primary">{course.units.length}</div>
                    <div className="text-sm text-base-content/70">Units</div>
                  </div>
                  <div className="text-center p-4 bg-base-200/50 rounded-box">
                    <div className="text-2xl font-bold text-secondary">{totalLessons}</div>
                    <div className="text-sm text-base-content/70">Lessons</div>
                  </div>
                  <div className="text-center p-4 bg-base-200/50 rounded-box">
                    <div className="text-2xl font-bold text-accent">{totalExams}</div>
                    <div className="text-sm text-base-content/70">Exams</div>
                  </div>
                  <div className="text-center p-4 bg-base-200/50 rounded-box">
                    <div className="text-2xl font-bold text-info">{course.enrollments.length}</div>
                    <div className="text-sm text-base-content/70">Students</div>
                  </div>
                </div>
              </div>
              
              {/* Enrollment Card */}
              <div className="w-full lg:w-80">
                <div className="bg-base-200/50 rounded-box p-6 sticky top-24">
                  <div className="text-center mb-6">
                    {course.isFree ? (
                      <div className="text-3xl font-bold text-success">FREE</div>
                    ) : (
                      <div className="text-3xl font-bold text-primary">{formatCurrency(course.price)}</div>
                    )}
                  </div>
                  
                  <button className="btn btn-primary w-full mb-4" disabled>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Enroll Now (Preview Mode)
                  </button>
                  
                  <div className="text-center text-sm text-base-content/60">
                    {course.enrollments.length} students already enrolled
                  </div>
                  
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Lifetime access
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Certificate of completion
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Mobile and desktop access
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content */}
        <div className="mt-8 bg-base-100 rounded-box border border-base-300 shadow-xl">
          <div className="p-6 border-b border-base-300">
            <h2 className="text-2xl font-bold">Course Content</h2>
            <p className="text-base-content/70 mt-1">
              {course.units.length} units • {totalLessons} lessons • {totalExams} exams
            </p>
          </div>
          
          <div className="p-6">
            <div className="space-y-4">
              {course.units.map((unit, unitIndex) => (
                <div key={unit.id} className="border border-base-300 rounded-box">
                  <div 
                    className="p-4 bg-base-200 border-b border-base-300 cursor-pointer hover:bg-base-300 transition-colors"
                    onClick={() => setSelectedUnit(selectedUnit === unit.id ? null : unit.id)}
                  >
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
                        <span className="badge badge-ghost">{unit.lessons.length} lessons</span>
                        {unit.unitExams.length > 0 && (
                          <span className="badge badge-accent">{unit.unitExams.length} exams</span>
                        )}
                        <svg 
                          className={`w-5 h-5 transition-transform ${selectedUnit === unit.id ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  
                  {selectedUnit === unit.id && (
                    <div className="p-4 space-y-3">
                      {unit.lessons.map((lesson, lessonIndex) => (
                        <div key={lesson.id} className="flex items-center gap-3 p-3 hover:bg-base-200/50 rounded-btn">
                          <div className="w-6 h-6 bg-secondary/10 rounded-btn flex items-center justify-center">
                            <span className="text-xs font-bold text-secondary">{lessonIndex + 1}</span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{lesson.title}</span>
                              {lesson.lessonQuizzes.length > 0 && (
                                <span className="badge badge-xs badge-accent">Quiz</span>
                              )}
                              {lesson.videoUrl && (
                                <span className="badge badge-xs badge-info">Video</span>
                              )}
                              {!lesson.isPublished && (
                                <span className="badge badge-xs badge-warning">Draft</span>
                              )}
                            </div>
                          </div>
                          <svg className="w-4 h-4 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                      ))}
                      
                      {unit.unitExams.map((exam) => (
                        <div key={exam.id} className="flex items-center gap-3 p-3 bg-accent/5 rounded-btn border border-accent/20">
                          <div className="w-6 h-6 bg-accent/10 rounded-btn flex items-center justify-center">
                            <svg className="w-3 h-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{exam.title}</span>
                              {exam.timeLimit && (
                                <span className="badge badge-xs badge-info">{exam.timeLimit} min</span>
                              )}
                              {!exam.isPublished && (
                                <span className="badge badge-xs badge-warning">Draft</span>
                              )}
                            </div>
                          </div>
                          <svg className="w-4 h-4 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
