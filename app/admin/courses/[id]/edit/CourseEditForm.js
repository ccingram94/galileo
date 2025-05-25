'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CourseEditForm({ course, apExamTypes }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [formData, setFormData] = useState({
    title: course.title || '',
    description: course.description || '',
    apExamType: course.apExamType || '',
    isFree: course.isFree || false,
    price: course.price || '',
    imageUrl: course.imageUrl || '',
    isPublished: course.isPublished || false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/courses/${course.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: formData.isFree ? null : parseFloat(formData.price) || null
        }),
      });

      if (response.ok) {
        router.push('/admin/courses');
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update course');
      }
    } catch (error) {
      console.error('Error updating course:', error);
      alert('Failed to update course');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);

    try {
      const response = await fetch(`/api/admin/courses/${course.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/admin/courses');
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course');
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleTogglePublish = async () => {
    try {
      const response = await fetch(`/api/admin/courses/${course.id}/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPublished: !formData.isPublished
        }),
      });

      if (response.ok) {
        setFormData(prev => ({
          ...prev,
          isPublished: !prev.isPublished
        }));
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update publish status');
      }
    } catch (error) {
      console.error('Error updating publish status:', error);
      alert('Failed to update publish status');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const hasEnrollments = course.enrollments.length > 0;
  const hasContent = course.units.length > 0;

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit Course</h1>
          <p className="text-base-content/70 mt-1">
            Update course information and settings
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/courses/${course.id}/content`} className="btn btn-outline btn-primary gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Manage Content
          </Link>
          <Link href="/admin/courses" className="btn btn-ghost gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Courses
          </Link>
        </div>
      </div>

      {/* Course Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-base-100 rounded-box border border-base-300 p-4">
          <div className="text-sm font-medium text-base-content/70">Status</div>
          <div className={`text-lg font-bold ${formData.isPublished ? 'text-success' : 'text-warning'}`}>
            {formData.isPublished ? 'Published' : 'Draft'}
          </div>
        </div>
        <div className="bg-base-100 rounded-box border border-base-300 p-4">
          <div className="text-sm font-medium text-base-content/70">Enrollments</div>
          <div className="text-lg font-bold text-primary">{course.enrollments.length}</div>
        </div>
        <div className="bg-base-100 rounded-box border border-base-300 p-4">
          <div className="text-sm font-medium text-base-content/70">Units</div>
          <div className="text-lg font-bold text-secondary">{course.units.length}</div>
        </div>
        <div className="bg-base-100 rounded-box border border-base-300 p-4">
          <div className="text-sm font-medium text-base-content/70">Lessons</div>
          <div className="text-lg font-bold text-accent">
            {course.units.reduce((sum, unit) => sum + unit.lessons.length, 0)}
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-base-100 rounded-box border border-base-300 shadow-xl">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-base-300 pb-2">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="label">
                  <span className="label-text font-medium">Course Title *</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="label">
                  <span className="label-text font-medium">Course Description</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered w-full h-24"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-medium">AP Exam Type *</span>
                </label>
                <select
                  name="apExamType"
                  value={formData.apExamType}
                  onChange={handleInputChange}
                  className="select select-bordered w-full"
                  required
                >
                  {apExamTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.replace(/-/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-medium">Course Image URL</span>
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-base-300 pb-2">Pricing</h2>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isFree"
                  checked={formData.isFree}
                  onChange={handleInputChange}
                  className="checkbox checkbox-primary"
                  disabled={hasEnrollments}
                />
                <label className="label-text font-medium">This is a free course</label>
                {hasEnrollments && (
                  <div className="badge badge-warning badge-sm">Cannot change - has enrollments</div>
                )}
              </div>

              {!formData.isFree && (
                <div className="max-w-xs">
                  <label className="label">
                    <span className="label-text font-medium">Course Price (USD) *</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/70">$</span>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="input input-bordered w-full pl-8"
                      min="0"
                      step="0.01"
                      required={!formData.isFree}
                      disabled={hasEnrollments}
                    />
                  </div>
                  {hasEnrollments && (
                    <div className="text-xs text-warning mt-1">Cannot change price - course has enrollments</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Publishing */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-base-300 pb-2">Publishing</h2>
            
            <div className="flex items-center justify-between p-4 bg-base-200 rounded-box">
              <div>
                <div className="font-medium">Course Status</div>
                <div className="text-sm text-base-content/70">
                  {formData.isPublished ? 'This course is live and visible to students' : 'This course is in draft mode'}
                </div>
              </div>
              <button
                type="button"
                onClick={handleTogglePublish}
                className={`btn gap-2 ${formData.isPublished ? 'btn-warning' : 'btn-success'}`}
                disabled={!hasContent && !formData.isPublished}
              >
                {formData.isPublished ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L5.636 5.636m4.242 4.242L15.314 15.314" />
                    </svg>
                    Unpublish
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Publish
                  </>
                )}
              </button>
            </div>
            
            {!hasContent && !formData.isPublished && (
              <div className="alert alert-warning">
                <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>Add content (units and lessons) before publishing this course.</span>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-base-300">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="btn btn-error btn-outline gap-2"
              disabled={hasEnrollments}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Course
            </button>
            
            <div className="flex gap-2">
              <Link href="/admin/courses" className="btn btn-ghost">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary gap-2"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-base-100 rounded-box p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-error mb-4">Delete Course</h3>
            <p className="text-base-content/70 mb-6">
              Are you sure you want to delete "{course.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteLoading}
                className="btn btn-error"
              >
                {deleteLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Deleting...
                  </>
                ) : (
                  'Delete Course'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {hasEnrollments && (
        <div className="bg-warning/5 border border-warning/20 rounded-box p-6">
          <div className="flex gap-3">
            <svg className="w-6 h-6 text-warning flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <h3 className="font-medium text-warning mb-2">Course Has Enrollments</h3>
              <p className="text-sm text-base-content/70">
                This course has {course.enrollments.length} student(s) enrolled. Some settings like pricing and deletion are restricted to protect student access.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
