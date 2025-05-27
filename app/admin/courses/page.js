import Link from 'next/link';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

export default async function AdminCoursesPage() {
  try {
    const courses = await prisma.course.findMany({
      include: {
        enrollments: {
          include: {
            user: true
          }
        },
        units: {
          include: {
            lessons: {
              include: {
                lessonQuizzes: true
              }
            },
            unitExams: true
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Course Management</h1>
            <p className="text-base-content/70 mt-1">
              Manage your courses, content, and publishing status
            </p>
          </div>
          <Link href="/admin/courses/new" className="btn btn-primary gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            New Course
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-base-100 rounded-box border border-base-300 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-content/70">Total Courses</p>
                <p className="text-2xl font-bold text-primary">{courses.length}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-btn flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-box border border-base-300 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-content/70">Published</p>
                <p className="text-2xl font-bold text-success">{courses.filter(c => c.isPublished).length}</p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-btn flex items-center justify-center">
                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-box border border-base-300 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-content/70">Draft</p>
                <p className="text-2xl font-bold text-warning">{courses.filter(c => !c.isPublished).length}</p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-btn flex items-center justify-center">
                <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-box border border-base-300 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-content/70">Total Enrollments</p>
                <p className="text-2xl font-bold text-info">{courses.reduce((sum, course) => sum + course.enrollments.length, 0)}</p>
              </div>
              <div className="w-12 h-12 bg-info/10 rounded-btn flex items-center justify-center">
                <svg className="w-6 h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Courses Table */}
        <div className="bg-base-100 rounded-box border border-base-300 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead className="bg-base-200">
                <tr>
                  <th>Course Details</th>
                  <th>Status</th>
                  <th>Content</th>
                  <th>Enrollments</th>
                  <th>Revenue</th>
                  <th>Last Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => {
                  const totalUnits = course.units.length;
                  const totalLessons = course.units.reduce((sum, unit) => sum + unit.lessons.length, 0);
                  
                  // Fix: Check if lessonQuizzes exists (it's a single object, not an array)
                  const totalQuizzes = course.units.reduce((sum, unit) => 
                    sum + unit.lessons.reduce((lessonSum, lesson) => 
                      lessonSum + (lesson.lessonQuizzes ? 1 : 0), 0), 0);
                  
                  const totalExams = course.units.reduce((sum, unit) => sum + (unit.unitExams?.length || 0), 0);
                  const paidEnrollments = course.enrollments.filter(e => e.paymentStatus === 'PAID').length;
                  const revenue = course.isFree ? 0 : (paidEnrollments * (course.price || 0));

                  return (
                    <tr key={course.id} className="hover">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-btn flex items-center justify-center">
                            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-bold text-base">{course.title}</div>
                            <div className="text-sm text-base-content/70">{course.apExamType}</div>
                            {course.description && (
                              <div className="text-xs text-base-content/50 mt-1 max-w-xs truncate">
                                {course.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col gap-2">
                          <div className={`badge ${course.isPublished ? 'badge-success' : 'badge-warning'}`}>
                            {course.isPublished ? 'Published' : 'Draft'}
                          </div>
                          {course.isFree ? (
                            <div className="badge badge-info badge-sm">Free</div>
                          ) : (
                            <div className="badge badge-accent badge-sm">{formatCurrency(course.price || 0)}</div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span className="text-base-content/70">Units:</span>
                            <span className="font-medium">{totalUnits}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-base-content/70">Lessons:</span>
                            <span className="font-medium">{totalLessons}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-base-content/70">Assessments:</span>
                            <span className="font-medium">{totalQuizzes + totalExams}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-center">
                          <div className="text-lg font-bold">{course.enrollments.length}</div>
                          <div className="text-xs text-base-content/70">
                            {paidEnrollments} paid
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-center">
                          <div className="font-semibold">{formatCurrency(revenue)}</div>
                          <div className="text-xs text-base-content/70">total</div>
                        </div>
                      </td>
                      <td>
                        <div className="text-sm text-base-content/70">
                          {new Date(course.updatedAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <div className="dropdown dropdown-left">
                            <label tabIndex={0} className="btn btn-ghost btn-sm">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                              </svg>
                            </label>
                            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 border border-base-300">
                              <li>
                                <Link href={`/admin/courses/${course.id}/edit`}>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                  Edit Course
                                </Link>
                              </li>
                              <li>
                                <Link href={`/admin/courses/${course.id}/content`}>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                  </svg>
                                  Manage Content
                                </Link>
                              </li>
                              <li>
                                <Link href={`/admin/courses/${course.id}/students`}>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                  </svg>
                                  View Students
                                </Link>
                              </li>
                              <li>
                                <Link href={`/admin/courses/${course.id}/analytics`}>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                  </svg>
                                  Analytics
                                </Link>
                              </li>
                              <li>
                                <Link href={`/admin/courses/${course.id}/preview`}>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  Preview
                                </Link>
                              </li>
                              <li className="border-t border-base-300 mt-2 pt-2">
                                <Link href={`/admin/courses/${course.id}/duplicate`} className="text-info">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                  Duplicate
                                </Link>
                              </li>
                              <li>
                                <Link href={`/admin/courses/${course.id}/delete`} className="text-error">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                  Delete
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {courses.length === 0 && (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-base-content/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="text-lg font-semibold text-base-content/70 mb-2">No courses found</h3>
              <p className="text-base-content/50 mb-4">Create your first course to get started</p>
              <Link href="/admin/courses/new" className="btn btn-primary">
                Create First Course
              </Link>
            </div>
          )}
        </div>
      </div>
    );

  } catch (error) {
    console.error('Admin courses page error:', error);
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-error mb-2">Error Loading Courses</h1>
        <p className="text-base-content/70">We encountered an error while loading the courses.</p>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}
