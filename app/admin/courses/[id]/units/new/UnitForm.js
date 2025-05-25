'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function UnitForm({ course }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    order: course.units.length + 1
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
      const response = await fetch(`/api/admin/courses/${course.id}/units`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newUnit = await response.json();
        router.push(`/admin/courses/${course.id}/units/${newUnit.id}/lessons`);
      } else {
        const error = await response.json();
        setErrors({ submit: error.error || 'Failed to create unit' });
      }
    } catch (error) {
      console.error('Error creating unit:', error);
      setErrors({ submit: 'Failed to create unit' });
    } finally {
      setLoading(false);
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
          <h1 className="text-3xl font-bold">Create New Unit</h1>
          <p className="text-base-content/70 mt-1">
            Add a new unit to "{course.title}"
          </p>
        </div>
        <Link href={`/admin/courses/${course.id}/units`} className="btn btn-ghost gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Units
        </Link>
      </div>

      {/* Form */}
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
                  className="input input-bordered w-full"
                  min="1"
                />
                <div className="label">
                  <span className="label-text-alt">Position in course sequence</span>
                </div>
              </div>

              {/* Course Info */}
              <div className="bg-base-200/50 rounded-box p-4">
                <h3 className="font-medium mb-3">Course Info</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Existing Units:</span>
                    <span className="font-medium">{course.units.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Course Type:</span>
                    <span className="font-medium">{course.apExamType.replace(/-/g, ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className={`badge badge-xs ${course.isPublished ? 'badge-success' : 'badge-warning'}`}>
                      {course.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Tips */}
              <div className="bg-info/5 border border-info/20 rounded-box p-4">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-info flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-medium text-info mb-2">Unit Creation Tips</h4>
                    <ul className="text-sm text-base-content/70 space-y-1">
                      <li>• Use clear, descriptive titles</li>
                      <li>• Keep units focused on specific topics</li>
                      <li>• Plan 3-8 lessons per unit</li>
                      <li>• Add descriptions to help students</li>
                    </ul>
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
                    Creating Unit...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Create Unit
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Preview */}
      {formData.title && (
        <div className="bg-base-100 rounded-box border border-base-300 shadow-xl">
          <div className="p-6 border-b border-base-300">
            <h2 className="text-xl font-semibold">Unit Preview</h2>
            <p className="text-base-content/70 mt-1">How this unit will appear to students</p>
          </div>
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-btn flex items-center justify-center">
                <span className="font-bold text-primary">{formData.order}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{formData.title}</h3>
                {formData.description && (
                  <p className="text-base-content/70">{formData.description}</p>
                )}
                <div className="mt-3 text-sm text-base-content/70">
                  0 lessons • 0 exams
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
