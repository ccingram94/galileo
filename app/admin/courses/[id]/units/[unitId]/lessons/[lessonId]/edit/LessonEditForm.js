'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const RichTextEditor = dynamic(() => import('../../new/RichTextEditor'), {
  ssr: false,
  loading: () => <div className="h-64 bg-base-200 rounded-box animate-pulse flex items-center justify-center">Loading editor...</div>
});

export default function LessonEditForm({ course, unit, lesson }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('content');
  
  const [formData, setFormData] = useState({
    title: lesson.title || '',
    description: lesson.description || '',
    content: lesson.content || '',
    videoUrl: lesson.videoUrl || '',
    duration: lesson.duration || '',
    order: lesson.order || 1,
    isPublished: lesson.isPublished || false
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Lesson title is required';
    }
    
    if (formData.title.trim().length < 3) {
      newErrors.title = 'Lesson title must be at least 3 characters';
    }

    if (formData.videoUrl && !isValidUrl(formData.videoUrl)) {
      newErrors.videoUrl = 'Please enter a valid URL';
    }

    if (formData.duration && (isNaN(formData.duration) || parseInt(formData.duration) < 0)) {
      newErrors.duration = 'Duration must be a positive number (in seconds)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/courses/${course.id}/units/${unit.id}/lessons/${lesson.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          duration: formData.duration ? parseInt(formData.duration) : null
        }),
      });

      if (response.ok) {
        router.push(`/admin/courses/${course.id}/units/${unit.id}/lessons`);
      } else {
        const error = await response.json();
        setErrors({ submit: error.error || 'Failed to update lesson' });
      }
    } catch (error) {
      console.error('Error updating lesson:', error);
      setErrors({ submit: 'Failed to update lesson' });
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
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Edit Lesson</h1>
          <p className="text-base-content/70 mt-1">
            Editing "{lesson.title}" in "{unit.title}"
          </p>
        </div>
        <Link href={`/admin/courses/${course.id}/units/${unit.id}/lessons`} className="btn btn-ghost gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Lessons
        </Link>
      </div>

      {/* Form */}
      <div className="bg-base-100 rounded-box border border-base-300 shadow-xl">
        <form onSubmit={handleSubmit}>
          {/* Error Display */}
          {errors.submit && (
            <div className="alert alert-error mx-8 mt-8">
              <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errors.submit}</span>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="tabs border-b border-base-300">
            <button
              type="button"
              className={`tab tab-lg ${activeTab === 'content' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('content')}
            >
              Content
            </button>
            <button
              type="button"
              className={`tab tab-lg ${activeTab === 'settings' ? 'tab-active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              Settings
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {activeTab === 'content' && (
              <div className="space-y-8">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Lesson Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
                    placeholder="Enter lesson title"
                  />
                  {errors.title && (
                    <p className="text-error text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Lesson Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="textarea textarea-bordered w-full h-24"
                    placeholder="Brief description of the lesson"
                  />
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Lesson Content
                  </label>
                  <RichTextEditor
                    content={formData.content}
                    onChange={handleContentChange}
                  />
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-8">
                {/* Video URL */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Video URL (Optional)
                  </label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    className={`input input-bordered w-full ${errors.videoUrl ? 'input-error' : ''}`}
                    placeholder="https://example.com/video.mp4"
                  />
                  {errors.videoUrl && (
                    <p className="text-error text-sm mt-1">{errors.videoUrl}</p>
                  )}
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Duration (seconds)
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className={`input input-bordered w-full ${errors.duration ? 'input-error' : ''}`}
                    placeholder="600"
                    min="0"
                  />
                  {errors.duration && (
                    <p className="text-error text-sm mt-1">{errors.duration}</p>
                  )}
                </div>

                {/* Order */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Lesson Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    className="input input-bordered w-full"
                    min="1"
                    max={unit.lessons.length}
                  />
                </div>

                {/* Published Status */}
                <div className="form-control">
                  <label className="label cursor-pointer justify-start gap-4">
                    <input
                      type="checkbox"
                      name="isPublished"
                      checked={formData.isPublished}
                      onChange={handleInputChange}
                      className="checkbox checkbox-primary"
                    />
                    <div>
                      <span className="label-text font-medium">Publish Lesson</span>
                      <p className="text-sm text-base-content/70">
                        Published lessons are visible to students
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between p-8 pt-0 border-t border-base-300">
            <Link href={`/admin/courses/${course.id}/units/${unit.id}/lessons`} className="btn btn-ghost">
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
                    Updating Lesson...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Update Lesson
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
