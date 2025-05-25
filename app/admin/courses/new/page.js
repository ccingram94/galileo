'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const AP_EXAM_TYPES = [
  'AP-CALCULUS-AB',
  'AP-CALCULUS-BC',
  'AP-PHYSICS-1',
  'AP-PHYSICS-2',
  'AP-PHYSICS-C-MECHANICS',
  'AP-PHYSICS-C-ELECTRICITY',
  'AP-CHEMISTRY',
  'AP-BIOLOGY',
  'AP-STATISTICS',
  'AP-COMPUTER-SCIENCE-A'
];

export default function NewCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    apExamType: '',
    isFree: true,
    price: '',
    imageUrl: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: formData.isFree ? null : parseFloat(formData.price) || null
        }),
      });

      if (response.ok) {
        const course = await response.json();
        router.push(`/admin/courses/${course.id}/content`);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create course');
      }
    } catch (error) {
      console.error('Error creating course:', error);
      alert('Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Create New Course</h1>
          <p className="text-base-content/70 mt-1">
            Set up a new course with basic information
          </p>
        </div>
        <Link href="/admin/courses" className="btn btn-ghost gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Courses
        </Link>
      </div>

      {/* Course Creation Form */}
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
                  placeholder="e.g., AP Physics 1: Mechanics and Energy"
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
                  placeholder="Describe what students will learn in this course..."
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
                  <option value="">Select AP Exam Type</option>
                  {AP_EXAM_TYPES.map((type) => (
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
                  placeholder="https://example.com/image.jpg"
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
                />
                <label className="label-text font-medium">This is a free course</label>
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
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required={!formData.isFree}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-base-300">
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
                  Creating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Create Course
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Help Text */}
      <div className="bg-info/5 border border-info/20 rounded-box p-6">
        <div className="flex gap-3">
          <svg className="w-6 h-6 text-info flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-medium text-info mb-2">Next Steps</h3>
            <ul className="text-sm text-base-content/70 space-y-1">
              <li>• After creating the course, you'll be redirected to add content (units and lessons)</li>
              <li>• Courses start as drafts - publish when ready for students</li>
              <li>• You can always edit course details and pricing later</li>
              <li>• Add a course image to make it more appealing to students</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
