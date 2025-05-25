'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CourseSettingsForm({ course, availableCourses }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [settings, setSettings] = useState({
    enrollmentLimit: course.enrollmentLimit || '',
    hasEnrollmentLimit: Boolean(course.enrollmentLimit),
    allowWaitlist: course.allowWaitlist || false,
    prerequisiteCourses: course.prerequisiteCourses || [],
    autoEnrollment: course.autoEnrollment || false,
    certificateEnabled: course.certificateEnabled || false,
    discussionEnabled: course.discussionEnabled || true,
    downloadableContent: course.downloadableContent || false,
    accessDuration: course.accessDuration || '', // days
    hasAccessDuration: Boolean(course.accessDuration),
    progressTracking: course.progressTracking !== false, // default true
    completionCriteria: course.completionCriteria || 'all_lessons', // 'all_lessons' | 'final_exam' | 'custom'
    passingGrade: course.passingGrade || 70
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/courses/${course.id}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...settings,
          enrollmentLimit: settings.hasEnrollmentLimit ? parseInt(settings.enrollmentLimit) || null : null,
          accessDuration: settings.hasAccessDuration ? parseInt(settings.accessDuration) || null : null,
        }),
      });

      if (response.ok) {
        router.refresh();
        // Show success message
        const event = new CustomEvent('showToast', {
          detail: { message: 'Course settings updated successfully', type: 'success' }
        });
        window.dispatchEvent(event);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      const event = new CustomEvent('showToast', {
        detail: { message: error.message, type: 'error' }
      });
      window.dispatchEvent(event);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePrerequisiteChange = (courseId, isChecked) => {
    setSettings(prev => ({
      ...prev,
      prerequisiteCourses: isChecked
        ? [...prev.prerequisiteCourses, courseId]
        : prev.prerequisiteCourses.filter(id => id !== courseId)
    }));
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Course Settings</h1>
          <p className="text-base-content/70 mt-1">
            Configure enrollment, access, and completion settings for "{course.title}"
          </p>
        </div>
        <Link href={`/admin/courses/${course.id}/edit`} className="btn btn-ghost gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Course
        </Link>
      </div>

      {/* Current Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-base-100 rounded-box border border-base-300 p-4">
          <div className="text-sm font-medium text-base-content/70">Current Enrollments</div>
          <div className="text-2xl font-bold text-primary">{course.enrollments.length}</div>
        </div>
        <div className="bg-base-100 rounded-box border border-base-300 p-4">
          <div className="text-sm font-medium text-base-content/70">Total Content</div>
          <div className="text-2xl font-bold text-secondary">
            {course.units.reduce((sum, unit) => sum + unit.lessons.length, 0)} lessons
          </div>
        </div>
        <div className="bg-base-100 rounded-box border border-base-300 p-4">
          <div className="text-sm font-medium text-base-content/70">Course Status</div>
          <div className={`text-lg font-bold ${course.isPublished ? 'text-success' : 'text-warning'}`}>
            {course.isPublished ? 'Published' : 'Draft'}
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <div className="bg-base-100 rounded-box border border-base-300 shadow-xl">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {/* Enrollment Settings */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-base-300 pb-2">Enrollment Settings</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="hasEnrollmentLimit"
                    checked={settings.hasEnrollmentLimit}
                    onChange={handleInputChange}
                    className="checkbox checkbox-primary"
                  />
                  <label className="font-medium">Set enrollment limit</label>
                </div>
                {settings.hasEnrollmentLimit && (
                  <div className="max-w-xs">
                    <input
                      type="number"
                      name="enrollmentLimit"
                      value={settings.enrollmentLimit}
                      onChange={handleInputChange}
                      className="input input-bordered input-sm w-full"
                      placeholder="Max students"
                      min="1"
                    />
                    <div className="text-xs text-base-content/60 mt-1">
                      Current: {course.enrollments.length} enrolled
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="allowWaitlist"
                  checked={settings.allowWaitlist}
                  onChange={handleInputChange}
                  className="checkbox checkbox-primary"
                  disabled={!settings.hasEnrollmentLimit}
                />
                <div>
                  <label className="font-medium">Allow waitlist when full</label>
                  <div className="text-sm text-base-content/70">Students can join a waitlist when enrollment limit is reached</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="autoEnrollment"
                  checked={settings.autoEnrollment}
                  onChange={handleInputChange}
                  className="checkbox checkbox-primary"
                />
                <div>
                  <label className="font-medium">Automatic enrollment</label>
                  <div className="text-sm text-base-content/70">Students are enrolled immediately upon payment</div>
                </div>
              </div>
            </div>
          </div>

          {/* Access & Duration */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-base-300 pb-2">Access & Duration</h2>
            
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    name="hasAccessDuration"
                    checked={settings.hasAccessDuration}
                    onChange={handleInputChange}
                    className="checkbox checkbox-primary"
                  />
                  <label className="font-medium">Limit access duration</label>
                </div>
                {settings.hasAccessDuration && (
                  <div className="max-w-xs">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        name="accessDuration"
                        value={settings.accessDuration}
                        onChange={handleInputChange}
                        className="input input-bordered input-sm w-20"
                        placeholder="30"
                        min="1"
                      />
                      <span className="text-sm">days from enrollment</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="downloadableContent"
                  checked={settings.downloadableContent}
                  onChange={handleInputChange}
                  className="checkbox checkbox-primary"
                />
                <div>
                  <label className="font-medium">Allow content downloads</label>
                  <div className="text-sm text-base-content/70">Students can download course materials for offline access</div>
                </div>
              </div>
            </div>
          </div>

          {/* Prerequisites */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-base-300 pb-2">Prerequisites</h2>
            
            {availableCourses.length > 0 ? (
              <div className="space-y-3">
                <div className="text-sm text-base-content/70 mb-4">
                  Select courses that students must complete before enrolling in this course:
                </div>
                {availableCourses.map((availableCourse) => (
                  <div key={availableCourse.id} className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={settings.prerequisiteCourses.includes(availableCourse.id)}
                      onChange={(e) => handlePrerequisiteChange(availableCourse.id, e.target.checked)}
                      className="checkbox checkbox-primary checkbox-sm"
                    />
                    <div>
                      <div className="font-medium">{availableCourse.title}</div>
                      <div className="text-xs text-base-content/70">{availableCourse.apExamType}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-base-200 rounded-box">
                <div className="text-base-content/70">No other published courses available for prerequisites</div>
              </div>
            )}
          </div>

          {/* Completion Settings */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-base-300 pb-2">Completion Settings</h2>
            
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="progressTracking"
                  checked={settings.progressTracking}
                  onChange={handleInputChange}
                  className="checkbox checkbox-primary"
                />
                <div>
                  <label className="font-medium">Enable progress tracking</label>
                  <div className="text-sm text-base-content/70">Track student progress through lessons and units</div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="font-medium">Completion Criteria</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="completionCriteria"
                      value="all_lessons"
                      checked={settings.completionCriteria === 'all_lessons'}
                      onChange={handleInputChange}
                      className="radio radio-primary radio-sm"
                    />
                    <span>Complete all lessons</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="completionCriteria"
                      value="final_exam"
                      checked={settings.completionCriteria === 'final_exam'}
                      onChange={handleInputChange}
                      className="radio radio-primary radio-sm"
                    />
                    <span>Pass final exam</span>
                  </label>
                  <label className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="completionCriteria"
                      value="custom"
                      checked={settings.completionCriteria === 'custom'}
                      onChange={handleInputChange}
                      className="radio radio-primary radio-sm"
                    />
                    <span>Custom criteria</span>
                  </label>
                </div>
              </div>

              <div className="max-w-xs">
                <label className="label">
                  <span className="label-text font-medium">Minimum passing grade (%)</span>
                </label>
                <input
                  type="number"
                  name="passingGrade"
                  value={settings.passingGrade}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                  min="0"
                  max="100"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold border-b border-base-300 pb-2">Course Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="certificateEnabled"
                  checked={settings.certificateEnabled}
                  onChange={handleInputChange}
                  className="checkbox checkbox-primary"
                />
                <div>
                  <label className="font-medium">Issue completion certificates</label>
                  <div className="text-sm text-base-content/70">Generate certificates when students complete the course</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="discussionEnabled"
                  checked={settings.discussionEnabled}
                  onChange={handleInputChange}
                  className="checkbox checkbox-primary"
                />
                <div>
                  <label className="font-medium">Enable discussions</label>
                  <div className="text-sm text-base-content/70">Allow students to participate in course discussions</div>
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
                  Saving Settings...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Info Box */}
      <div className="bg-info/5 border border-info/20 rounded-box p-6">
        <div className="flex gap-3">
          <svg className="w-6 h-6 text-info flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="font-medium text-info mb-2">Settings Impact</h3>
            <ul className="text-sm text-base-content/70 space-y-1">
              <li>• Enrollment limits will prevent new students from joining when reached</li>
              <li>• Prerequisites will be enforced during the enrollment process</li>
              <li>• Access duration limits will automatically expire student access</li>
              <li>• Changes to completion criteria affect certificate generation</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
