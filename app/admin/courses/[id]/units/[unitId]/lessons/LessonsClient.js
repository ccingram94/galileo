'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LessonsClient({ course, unit: initialUnit }) {
  const router = useRouter();
  const [unit, setUnit] = useState(initialUnit);
  const [loading, setLoading] = useState({});

  const togglePublishStatus = async (lessonId, isPublished) => {
    setLoading(prev => ({ ...prev, [lessonId]: true }));
    
    try {
      const response = await fetch(`/api/admin/courses/${course.id}/units/${unit.id}/lessons/${lessonId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPublished }),
      });

      if (response.ok) {
        // Update local state
        setUnit(prev => ({
          ...prev,
          lessons: prev.lessons.map(lesson => 
            lesson.id === lessonId 
              ? { ...lesson, isPublished }
              : lesson
          )
        }));
      } else {
        const errorData = await response.json();
        alert(`Failed to update lesson status: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating lesson:', error);
      alert('Failed to update lesson status');
    } finally {
      setLoading(prev => ({ ...prev, [lessonId]: false }));
    }
  };

  const deleteLesson = async (lessonId, lessonTitle) => {
    if (!confirm(`Are you sure you want to delete "${lessonTitle}"? This action cannot be undone.`)) {
      return;
    }

    setLoading(prev => ({ ...prev, [lessonId]: true }));

    try {
      const response = await fetch(`/api/admin/courses/${course.id}/units/${unit.id}/lessons/${lessonId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Update local state
        setUnit(prev => ({
          ...prev,
          lessons: prev.lessons.filter(lesson => lesson.id !== lessonId)
        }));
      } else {
        const errorData = await response.json();
        alert(`Failed to delete lesson: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
      alert('Failed to delete lesson');
    } finally {
      setLoading(prev => ({ ...prev, [lessonId]: false }));
    }
  };

  return (
    <div className="bg-base-100 rounded-box border border-base-300 shadow-xl">
      <div className="p-6 border-b border-base-300">
        <h2 className="text-xl font-semibold">Unit Lessons</h2>
        <p className="text-base-content/70 mt-1">
          {unit.lessons.length} lesson{unit.lessons.length !== 1 ? 's' : ''} in this unit
        </p>
      </div>

      {unit.lessons.length === 0 ? (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-base-content/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-semibold mb-2">No lessons yet</h3>
          <p className="text-base-content/70 mb-4">Get started by creating your first lesson</p>
          <Link href={`/admin/courses/${course.id}/units/${unit.id}/lessons/new`} className="btn btn-primary gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Create First Lesson
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-base-300">
          {unit.lessons.map((lesson) => (
            <div key={lesson.id} className="p-6 hover:bg-base-50 transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-btn flex items-center justify-center flex-shrink-0">
                  <span className="font-bold text-secondary">{lesson.order}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-1">{lesson.title}</h3>
                      {lesson.description && (
                        <p className="text-base-content/70 mb-2 line-clamp-2">{lesson.description}</p>
                      )}
                      <div className="flex items-center gap-4 text-sm text-base-content/70">
                        {lesson.duration && (
                          <span>Duration: {Math.floor(lesson.duration / 60)}:{(lesson.duration % 60).toString().padStart(2, '0')}</span>
                        )}
                        {lesson.videoUrl && (
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            Has video
                          </span>
                        )}
                        <span className={`badge badge-sm ${lesson.isPublished ? 'badge-success' : 'badge-warning'}`}>
                          {lesson.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link 
                        href={`/admin/courses/${course.id}/units/${unit.id}/lessons/${lesson.id}/edit`}
                        className="btn btn-ghost btn-sm gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Link>
                      
                      <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-sm" disabled={loading[lesson.id]}>
                          {loading[lesson.id] ? (
                            <span className="loading loading-spinner loading-sm"></span>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          )}
                        </label>
                        <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10">
                          <li>
                            <button 
                              onClick={() => togglePublishStatus(lesson.id, !lesson.isPublished)}
                              disabled={loading[lesson.id]}
                              className="flex items-center gap-2"
                            >
                              {lesson.isPublished ? (
                                <>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
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
                          </li>
                          <li>
                            <button 
                              onClick={() => deleteLesson(lesson.id, lesson.title)}
                              disabled={loading[lesson.id]}
                              className="text-error flex items-center gap-2"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
