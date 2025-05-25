'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CourseManagementSection({ courses }) {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const togglePublishStatus = async (courseId, currentStatus) => {
    try {
      const response = await fetch(`/api/admin/courses/${courseId}/toggle-publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPublished: !currentStatus }),
      });

      if (response.ok) {
        window.location.reload(); // Refresh to see changes
      } else {
        alert('Failed to update course status');
      }
    } catch (error) {
      console.error('Error toggling publish status:', error);
      alert('Failed to update course status');
    }
  };

  const deleteCourse = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        window.location.reload(); // Refresh to see changes
      } else {
        alert('Failed to delete course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course');
    }
  };

  return (
    <div className="bg-base-100 rounded-box border border-base-300 shadow-xl mb-8">
      <div className="p-6 border-b border-base-300">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Course Management
            </h2>
            <p className="text-base-content/70 mt-1">Manage your courses, content, and structure</p>
          </div>
          <button 
            onClick={() => document.getElementById('new-course-modal').showModal()}
            className="btn btn-primary gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            New Course
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Course</th>
                <th>Status</th>
                <th>Content</th>
                <th>Enrollments</th>
                <th>Revenue</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => {
                const totalLessons = course.units.reduce((sum, unit) => sum + unit.lessons.length, 0);
                const revenue = course.isFree ? 0 : (course.enrollments.filter(e => e.paymentStatus === 'PAID').length * course.price);
                
                return (
                  <tr key={course.id} className="hover">
                    <td>
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-bold">{course.title}</div>
                          <div className="text-sm opacity-70">{course.apExamType}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <div className={`badge ${course.isPublished ? 'badge-success' : 'badge-warning'}`}>
                          {course.isPublished ? 'Published' : 'Draft'}
                        </div>
                        {course.isFree ? (
                          <div className="badge badge-info badge-sm">Free</div>
                        ) : (
                          <div className="badge badge-accent badge-sm">{formatPrice(course.price)}</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div>{course.units.length} Units</div>
                        <div className="opacity-70">{totalLessons} Lessons</div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div className="font-semibold">{course.enrollments.length}</div>
                        <div className="opacity-70">students</div>
                      </div>
                    </td>
                    <td>
                      <div className="text-sm">
                        <div className="font-semibold">{formatPrice(revenue)}</div>
                        <div className="opacity-70">total</div>
                      </div>
                    </td>
                    <td>
                      <div className="flex flex-col gap-1">
                        <div className="dropdown dropdown-end">
                          <label tabIndex={0} className="btn btn-ghost btn-sm">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </label>
                          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10">
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
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                                View Students
                              </Link>
                            </li>
                            <li>
                              <a onClick={() => togglePublishStatus(course.id, course.isPublished)}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                {course.isPublished ? 'Unpublish' : 'Publish'}
                              </a>
                            </li>
                            <li>
                              <a onClick={() => deleteCourse(course.id)} className="text-error">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete Course
                              </a>
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
            <button 
              onClick={() => document.getElementById('new-course-modal').showModal()}
              className="btn btn-primary"
            >
              Create First Course
            </button>
          </div>
        )}
      </div>

      {/* New Course Modal */}
      <dialog id="new-course-modal" className="modal">
        <div className="modal-box w-11/12 max-w-2xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
          </form>
          <h3 className="font-bold text-lg mb-4">Create New Course</h3>
          
          <form action="/api/admin/courses" method="POST" className="space-y-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text">Course Title</span>
              </label>
              <input 
                type="text" 
                name="title"
                placeholder="e.g., AP Physics 1"
                className="input input-bordered w-full" 
                required 
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Description</span>
              </label>
              <textarea 
                name="description"
                className="textarea textarea-bordered h-24" 
                placeholder="Course description..."
                required
              ></textarea>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">AP Exam Type</span>
              </label>
              <select name="apExamType" className="select select-bordered w-full" required>
                <option disabled selected>Choose exam type</option>
                <option value="AP-PRECALCULUS">AP Precalculus</option>
                <option value="AP-CALCULUS-AB">AP Calculus AB</option>
                <option value="AP-CALCULUS-BC">AP Calculus BC</option>
                <option value="AP-PHYSICS-1">AP Physics 1</option>
                <option value="AP-PHYSICS-2">AP Physics 2</option>
                <option value="AP-PHYSICS-C-MECHANICS">AP Physics C: Mechanics</option>
                <option value="AP-PHYSICS-C-EM">AP Physics C: Electricity and Magnetism</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Price ($)</span>
                </label>
                <input 
                  type="number" 
                  name="price"
                  step="0.01"
                  placeholder="299.99"
                  className="input input-bordered" 
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Course Type</span>
                </label>
                <select name="isFree" className="select select-bordered">
                  <option value="false">Paid Course</option>
                  <option value="true">Free Course</option>
                </select>
              </div>
            </div>

            <div className="form-control">
              <label className="cursor-pointer label">
                <span className="label-text">Publish immediately</span>
                <input type="checkbox" name="isPublished" className="checkbox" />
              </label>
            </div>

            <div className="modal-action">
              <button type="submit" className="btn btn-primary">Create Course</button>
              <button type="button" className="btn" onclick="document.getElementById('new-course-modal').close()">Cancel</button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}
