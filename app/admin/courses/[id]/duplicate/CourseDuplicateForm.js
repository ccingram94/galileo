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

export default function CourseDuplicateForm({ course }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: `${course.title} - Copy`,
    description: course.description || '',
    apExamType: course.apExamType,
    isFree: course.isFree,
    price: course.price || '',
    imageUrl: course.imageUrl || '',
    
    // Duplication options
    duplicateContent: true,
    duplicateQuizzes: true,
    duplicateExams: true,
    duplicateSettings: false,
    publishImmediately: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/courses/${course.id}/duplicate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newCourse = await response.json();
        router.push(`/admin/courses/${newCourse.id}/edit`);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to duplicate course');
      }
    } catch (error) {
      console.error('Error duplicating course:', error);
      alert('Failed to duplicate course');
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

  const totalContent = {
    units: course.units.length,
    lessons: course.units.reduce((sum, unit) => sum + unit.lessons.length, 0),
    quizzes: course.units.reduce((sum, unit) => 
      sum + unit.lessons.reduce((lessonSum, lesson) => 
        lessonSum + lesson.lessonQuizzes.length, 0), 0),
    exams: course.units.reduce((sum, unit) => sum + unit.unitExams.length, 0)
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Duplicate Course</h1>
          <p className="text-base-content/70 mt-1">
            Create a copy of "{course.title}" with customizable options
          </p>
        </div>
        <Link href={`/admin/courses/${course.id}/edit`} className="btn btn-ghost gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Course
        </Link>
      </div>

      {/* Original Course Overview */}
      <div className="bg-base-100 rounded-box border border-base-300 shadow-lg">
        <div className="p-6 border-b border-base-300">
          <h2 className="text-xl font-semibold mb-4">Source Course Overview</h2>
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2">{course.title}</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="badge badge-primary">{course.apExamType.replace(/-/g, ' ')}</span>
                <span className={`badge ${course.isPublished ? 'badge-success' : 'badge-warning'}`}>
                  {course.isPublished ? 'Published' : 'Draft'}
                </span>
                <span className={`badge ${course.isFree ? 'badge-info' : 'badge-accent'}`}>
                  {course.isFree ? 'Free' : `$${course.price}`}
                </span>
              </div>
              {course.description && (
                <p className="text-base-content/70 text-sm">{course.description}</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Content Summary */}
        <div className="p-6">
          <h3 className="font-medium mb-4">Content to be duplicated:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-box border border-primary/20">
              <div className="text-2xl font-bold text-primary">{totalContent.units}</div>
              <div className="text-sm text-base-content/70">Units</div>
            </div>
            <div className="text-center p-4 bg-secondary/5 rounded-box border border-secondary/20">
              <div className="text-2xl font-bold text-secondary">{totalContent.lessons}</div>
              <div className="text-sm text-base-content/70">Lessons</div>
            </div>
            <div className="text-center p-4 bg-accent/5 rounded-box border border-accent/20">
              <div className="text-2xl font-bold text-accent">{totalContent.quizzes}</div>
              <div className="text-sm text-base-content/70">Quizzes</div>
            </div>
            <div className="text-center p-4 bg-info/5 rounded-box border border-info/20">
              <div className="text-2xl font-bold text-info">{totalContent.exams}</div>
              <div className="text-sm text-base-content/70">Exams</div>
            </div>
          </div>
        </div>
      </div>

      {/* Duplication Form */}
      <div className="bg-base-100 rounded-box border border-base-300 shadow-xl">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-base-300 pb-2">New Course Details</h2>
            
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
                <div className="label">
                  <span className="label-text-alt">Make sure the title is unique and descriptive</span>
                </div>
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
                  placeholder="Update the description for the new course..."
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

          {/* Duplication Options */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-base-300 pb-2">Duplication Options</h2>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-medium text-base-content/80">Content to Include</h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        name="duplicateContent"
                        checked={formData.duplicateContent}
                        onChange={handleInputChange}
                        className="checkbox checkbox-primary mt-0.5"
                      />
                      <div>
                        <div className="font-medium">Units and Lessons</div>
                        <div className="text-sm text-base-content/70">
                          Copy all {totalContent.units} units and {totalContent.lessons} lessons
                        </div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        name="duplicateQuizzes"
                        checked={formData.duplicateQuizzes}
                        onChange={handleInputChange}
                        className="checkbox checkbox-primary mt-0.5"
                        disabled={!formData.duplicateContent}
                      />
                      <div>
                        <div className="font-medium">Lesson Quizzes</div>
                        <div className="text-sm text-base-content/70">
                          Copy {totalContent.quizzes} quiz{totalContent.quizzes !== 1 ? 'es' : ''} with questions and answers
                        </div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        name="duplicateExams"
                        checked={formData.duplicateExams}
                        onChange={handleInputChange}
                        className="checkbox checkbox-primary mt-0.5"
                        disabled={!formData.duplicateContent}
                      />
                      <div>
                        <div className="font-medium">Unit Exams</div>
                        <div className="text-sm text-base-content/70">
                          Copy {totalContent.exams} exam{totalContent.exams !== 1 ? 's' : ''} with questions and settings
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-medium text-base-content/80">Additional Options</h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        name="duplicateSettings"
                        checked={formData.duplicateSettings}
                        onChange={handleInputChange}
                        className="checkbox checkbox-primary mt-0.5"
                      />
                      <div>
                        <div className="font-medium">Course Settings</div>
                        <div className="text-sm text-base-content/70">
                          Copy enrollment limits, prerequisites, and other settings
                        </div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        name="publishImmediately"
                        checked={formData.publishImmediately}
                        onChange={handleInputChange}
                        className="checkbox checkbox-primary mt-0.5"
                      />
                      <div>
                        <div className="font-medium">Publish Immediately</div>
                        <div className="text-sm text-base-content/70">
                          Make the duplicated course live immediately (otherwise it will be a draft)
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Warning for content dependencies */}
              {!formData.duplicateContent && (
                <div className="alert alert-warning">
                  <svg className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span>Without duplicating content, the new course will be empty and quiz/exam options will be ignored.</span>
                </div>
              )}
            </div>
          </div>

          {/* Estimated Time */}
          <div className="bg-info/5 border border-info/20 rounded-box p-6">
            <div className="flex items-start gap-3">
              <svg className="w-6 h-6 text-info flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-medium text-info mb-2">Duplication Process</h3>
                <div className="text-sm text-base-content/70 space-y-1">
                  <p>• Estimated time: {Math.max(1, Math.ceil((totalContent.units + totalContent.lessons) / 10))} minutes</p>
                  <p>• The new course will be created as a draft (unless publish immediately is selected)</p>
                  <p>• You can edit all content after duplication</p>
                  <p>• Student enrollments and progress are never copied</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-base-300">
            <Link href={`/admin/courses/${course.id}/edit`} className="btn btn-ghost">
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
                  Duplicating Course...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Duplicate Course
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
