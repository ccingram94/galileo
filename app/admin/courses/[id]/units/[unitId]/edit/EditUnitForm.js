'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function EditUnitForm({ course, unit }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: unit.title,
    description: unit.description || '',
    order: unit.order
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Unit title is required';
    }
    
    if (formData.title.trim().length < 3) {
      newErrors.title = 'Unit title must be at least 3 characters';
    }

    if (formData.order < 1) {
      newErrors.order = 'Order must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/courses/${course.id}/units/${unit.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push(`/admin/courses/${course.id}/units`);
      } else {
        const error = await response.json();
        setErrors({ submit: error.error || 'Failed to update unit' });
      }
    } catch (error) {
      console.error('Error updating unit:', error);
      setErrors({ submit: 'Failed to update unit' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${unit.title}"? This will also delete all ${unit.lessons.length} lessons in this unit. This action cannot be undone.`)) {
      return;
    }

    setDeleteLoading(true);

    try {
      const response = await fetch(`/api/admin/courses/${course.id}/units/${unit.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push(`/admin/courses/${course.id}/units`);
      } else {
        const error = await response.json();
        setErrors({ submit: error.error || 'Failed to delete unit' });
      }
    } catch (error) {
      console.error('Error deleting unit:', error);
      setErrors({ submit: 'Failed to delete unit' });
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit Unit</h1>
          <p className="text-base-content/70 mt-1">
            Editing "{unit.title}" in "{course.title}"
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/courses/${course.id}/units/${unit.id}/lessons`} className="btn btn-outline gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Manage Lessons
          </Link>
          <Link href={`/admin/courses/${course.id}/units`} className="btn btn-ghost gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Units
          </Link>
        </div>
      </div>

      {/* Unit Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-base-100 rounded-box border border-base-300 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-base-content/70">Lessons</div>
              <div className="text-2xl font-bold text-primary">{unit.lessons.length}</div>
            </div>
            <div className="w-10 h-10 bg-primary/10 rounded-btn flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-base-100 rounded-box border border-base-300 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-base-content/70">Exams</div>
              <div className="text-2xl font-bold text-secondary">{unit.unitExams.length}</div>
            </div>
            <div className="w-10 h-10 bg-secondary/10 rounded-btn flex items-center justify-center">
              <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-base-100 rounded-box border border-base-300 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-base-content/70">Unit Order</div>
              <div className="text-2xl font-bold text-accent">{unit.order}</div>
            </div>
            <div className="w-10 h-10 bg-accent/10 rounded-btn flex items-center justify-center">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-base-100 rounded-box border border-base-300 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-base-content/70">Created</div>
              <div className="text-sm font-bold text-info">{formatDate(unit.createdAt)}</div>
            </div>
            <div className="w-10 h-10 bg-info/10 rounded-btn flex items-center justify-center">
              <svg className="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-8 0h8v10a2 2 0 01-2 2H10a2 2 0 01-2-2V7z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-base-100 rounded-box border border-base-300 shadow-xl">
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* Error Alert */}
          {errors.submit && (
            <div className="alert alert-error">
              <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errors.submit}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Unit Title */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Unit Title *</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
                  placeholder="e.g., Introduction to Calculus"
                  required
                />
                {errors.title && (
                  <div className="label">
                    <span className="label-text-alt text-error">{errors.title}</span>
                  </div>
                )}
              </div>

              {/* Unit Description */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Unit Description</span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="textarea textarea-bordered w-full h-32"
                  placeholder="Describe what students will learn in this unit..."
                />
                <div className="label">
                  <span className="label-text-alt">Optional: Provide a brief overview of the unit content</span>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Unit Order */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Unit Order</span>
                </label>
                <input
                  type="number"
                  name="order"
                  value={formData.order}
                  onChange={handleInputChange}
                  className={`input input-bordered w-full ${errors.order ? 'input-error' : ''}`}
                  min="1"
                  max={course.units.length}
                />
                {errors.order && (
                  <div className="label">
                    <span className="label-text-alt text-error">{errors.order}</span>
                  </div>
                )}
                <div className="label">
                  <span className="label-text-alt">Position in course sequence (1-{course.units.length})</span>
                </div>
              </div>

              {/* Unit Metadata */}
              <div className="bg-base-200/50 rounded-box p-4">
                <h3 className="font-medium mb-3">Unit Metadata</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span className="font-medium">{formatDate(unit.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated:</span>
                    <span className="font-medium">{formatDate(unit.updatedAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lessons:</span>
                    <span className="font-medium">{unit.lessons.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Exams:</span>
                    <span className="font-medium">{unit.unitExams.length}</span>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div className="bg-error/5 border border-error/20 rounded-box p-4">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-error flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-error mb-2">Danger Zone</h4>
                    <p className="text-sm text-base-content/70 mb-3">
                      Deleting this unit will permanently remove all its lessons and content. This action cannot be undone.
                    </p>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={deleteLoading}
                      className="btn btn-error btn-sm gap-2"
                    >
                      {deleteLoading ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete Unit
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-base-300">
            <Link href={`/admin/courses/${course.id}/units`} className="btn btn-ghost">
              Cancel
            </Link>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary gap-2"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Lessons Preview */}
      {unit.lessons.length > 0 && (
        <div className="bg-base-100 rounded-box border border-base-300 shadow-xl">
          <div className="p-6 border-b border-base-300">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Lessons in this Unit</h2>
              <Link href={`/admin/courses/${course.id}/units/${unit.id}/lessons/new`} className="btn btn-primary btn-sm gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Lesson
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {unit.lessons.map((lesson, index) => (
                <div key={lesson.id} className="flex items-center justify-between p-3 bg-base-200/50 rounded-box">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-secondary/10 rounded-btn flex items-center justify-center">
                      <span className="text-sm font-bold text-secondary">{lesson.order}</span>
                    </div>
                    <div>
                      <div className="font-medium">{lesson.title}</div>
                      <div className="text-sm text-base-content/70">
                        {lesson.description && lesson.description.length > 0 ? (
                          lesson.description.slice(0, 60) + (lesson.description.length > 60 ? '...' : '')
                        ) : (
                          'No description'
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!lesson.isPublished && (
                      <span className="badge badge-warning badge-sm">Draft</span>
                    )}
                    <Link 
                      href={`/admin/courses/${course.id}/units/${unit.id}/lessons/${lesson.id}/edit`}
                      className="btn btn-ghost btn-sm"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-base-100 rounded-box border border-base-300 p-6">
        <h3 className="font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link href={`/admin/courses/${course.id}/units/${unit.id}/lessons`} className="btn btn-primary gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Manage Lessons ({unit.lessons.length})
          </Link>
          <Link href={`/admin/courses/${course.id}/units/${unit.id}/lessons/new`} className="btn btn-outline gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add New Lesson
          </Link>
          <Link href={`/admin/courses/${course.id}/units/${unit.id}/exams`} className="btn btn-outline gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Manage Exams ({unit.unitExams.length})
          </Link>
        </div>
      </div>
    </>
  );
}
