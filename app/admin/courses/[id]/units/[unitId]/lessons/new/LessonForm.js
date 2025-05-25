'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamic import for rich text editor to avoid SSR issues
const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  ssr: false,
  loading: () => <div className="h-64 bg-base-200 rounded-box animate-pulse flex items-center justify-center">Loading editor...</div>
});

export default function LessonForm({ course, unit }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('content'); // content, video, settings
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    videoUrl: '',
    duration: '',
    order: unit.lessons.length + 1,
    isPublished: false
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
      const response = await fetch(`/api/admin/courses/${course.id}/units/${unit.id}/lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          duration: formData.duration ? parseInt(formData.duration) : null
        }),
      });

      if (response.ok) {
        const newLesson = await response.json();
        router.push(`/admin/courses/${course.id}/units/${unit.id}/lessons/${newLesson.id}/edit`);
      } else {
        const error = await response.json();
        setErrors({ submit: error.error || 'Failed to create lesson' });
      }
    } catch (error) {
      console.error('Error creating lesson:', error);
      setErrors({ submit: 'Failed to create lesson' });
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
    
    // Clear specific error when user starts typing
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
          <h1 className="text-3xl font-bold">Create New Lesson</h1>
          <p className="text-base-content/70 mt-1">
            Add a new lesson to "{unit.title}" in "{course.title}"
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
          
          {/* Error Alert */}
          {errors.submit && (
            <div className="alert alert-error m-8 mb-0">
              <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errors.submit}</span>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-base-300">
            <div className="flex px-8 pt-8">
              <button
                type="button"
                onClick={() => setActiveTab('content')}
                className={`tab tab-bordered ${activeTab === 'content' ? 'tab-active' : ''}`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Content
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('video')}
                className={`tab tab-bordered ${activeTab === 'video' ? 'tab-active' : ''}`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Video
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`tab tab-bordered ${activeTab === 'settings' ? 'tab-active' : ''}`}
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-8 space-y-6">
            {activeTab === 'content' && (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Lesson Title *</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className={`input input-bordered w-full ${errors.title ? 'input-error' : ''}`}
                      placeholder="e.g., Introduction to Derivatives"
                      required
                    />
                    {errors.title && (
                      <div className="label">
                        <span className="label-text-alt text-error">{errors.title}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="label">
                      <span className="label-text font-medium">Lesson Order</span>
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
                      <span className="label-text-alt">Position in unit sequence</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Lesson Description</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="textarea textarea-bordered w-full h-24"
                    placeholder="Brief description of what students will learn in this lesson..."
                  />
                  <div className="label">
                    <span className="label-text-alt">Optional: Provide a brief overview for students</span>
                  </div>
                </div>

                {/* Rich Text Content */}
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Lesson Content</span>
                  </label>
                  <RichTextEditor
                    content={formData.content}
                    onChange={handleContentChange}
                    placeholder="Write your lesson content here. You can format text, add images, links, and more..."
                  />
                  <div className="label">
                    <span className="label-text-alt">Use the rich text editor to create engaging lesson content</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'video' && (
              <div className="space-y-6">
                <div className="alert alert-info">
                  <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Support for YouTube, Vimeo, and direct video file URLs. Video will be embedded in the lesson.</span>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-medium">Video URL</span>
                  </label>
                  <input
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    className={`input input-bordered w-full ${errors.videoUrl ? 'input-error' : ''}`}
                    placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                  />
                  {errors.videoUrl && (
                    <div className="label">
                      <span className="label-text-alt text-error">{errors.videoUrl}</span>
                    </div>
                  )}
                  <div className="label">
                    <span className="label-text-alt">Paste a video URL from YouTube, Vimeo, or direct link to video file</span>
                  </div>
                </div>

                <div className="max-w-xs">
                  <label className="label">
                    <span className="label-text font-medium">Video Duration (seconds)</span>
                  </label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    className={`input input-bordered w-full ${errors.duration ? 'input-error' : ''}`}
                    placeholder="e.g., 300 for 5 minutes"
                    min="0"
                  />
                  {errors.duration && (
                    <div className="label">
                      <span className="label-text-alt text-error">{errors.duration}</span>
                    </div>
                  )}
                  <div className="label">
                    <span className="label-text-alt">Optional: Duration in seconds for progress tracking</span>
                  </div>
                </div>

                {/* Video Preview */}
                {formData.videoUrl && isValidUrl(formData.videoUrl) && (
                  <div>
                    <h3 className="font-medium mb-2">Video Preview</h3>
                    <div className="bg-base-200 rounded-box p-4">
                      <div className="aspect-video bg-base-300 rounded flex items-center justify-center">
                        <div className="text-center">
                          <svg className="w-16 h-16 text-base-content/40 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          <p className="text-base-content/60">Video will be embedded here</p>
                          <p className="text-sm text-base-content/40 mt-1">{formData.videoUrl}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Publishing</h3>
                    
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        name="isPublished"
                        checked={formData.isPublished}
                        onChange={handleInputChange}
                        className="checkbox checkbox-primary"
                      />
                      <label className="label-text font-medium">Publish lesson immediately</label>
                    </div>
                    <p className="text-sm text-base-content/70">
                      Published lessons are visible to enrolled students. Unpublished lessons remain as drafts.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Unit Information</h3>
                    <div className="bg-base-200/50 rounded-box p-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Unit:</span>
                        <span className="font-medium">{unit.title}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Current Lessons:</span>
                        <span className="font-medium">{unit.lessons.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Course:</span>
                        <span className="font-medium">{course.title}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tips */}
                <div className="bg-info/5 border border-info/20 rounded-box p-6">
                  <div className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-info flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="font-medium text-info mb-2">Lesson Creation Tips</h4>
                      <ul className="text-sm text-base-content/70 space-y-1 list-disc list-inside">
                        <li>Keep lessons focused on a single concept or topic</li>
                        <li>Use clear, descriptive titles that explain what students will learn</li>
                        <li>Include both text content and video when possible</li>
                        <li>Consider adding quizzes to reinforce key concepts</li>
                        <li>Preview your lesson before publishing to ensure quality</li>
                      </ul>
                    </div>
                  </div>
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
                    Creating Lesson...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Create Lesson
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
            <h2 className="text-xl font-semibold">Lesson Preview</h2>
            <p className="text-base-content/70 mt-1">How this lesson will appear to students</p>
          </div>
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-secondary/10 rounded-btn flex items-center justify-center">
                <span className="font-bold text-secondary">{formData.order}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2">{formData.title}</h3>
                {formData.description && (
                  <p className="text-base-content/70 mb-3">{formData.description}</p>
                )}
                <div className="flex items-center gap-4 text-sm text-base-content/70">
                  {formData.duration && <span>Duration: {Math.floor(formData.duration / 60)}:{(formData.duration % 60).toString().padStart(2, '0')}</span>}
                  {formData.videoUrl && <span>Has video</span>}
                  {formData.content && <span>Has content</span>}
                  <span className={`badge badge-sm ${formData.isPublished ? 'badge-success' : 'badge-warning'}`}>
                    {formData.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
