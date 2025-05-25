'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function formatDuration(seconds) {
  if (!seconds) return 'No duration';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function LessonsManager({ course, unit }) {
  const router = useRouter();
  const [draggedItem, setDraggedItem] = useState(null);
  const [isReordering, setIsReordering] = useState(false);

  const handleDeleteLesson = async (lessonId) => {
    if (!confirm('Are you sure you want to delete this lesson? All quizzes in this lesson will also be deleted.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/courses/${course.id}/units/${unit.id}/lessons/${lessonId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete lesson');
      }
    } catch (error) {
      console.error('Error deleting lesson:', error);
      alert('Failed to delete lesson');
    }
  };

  const handleReorderLessons = async (newOrder) => {
    setIsReordering(true);
    try {
      const response = await fetch(`/api/admin/courses/${course.id}/units/${unit.id}/lessons/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lessonOrder: newOrder }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to reorder lessons');
      }
    } catch (error) {
      console.error('Error reordering lessons:', error);
      alert('Failed to reorder lessons');
    } finally {
      setIsReordering(false);
    }
  };

  const handleTogglePublish = async (lessonId, isPublished) => {
    try {
      const response = await fetch(`/api/admin/courses/${course.id}/units/${unit.id}/lessons/${lessonId}/publish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPublished: !isPublished }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update lesson status');
      }
    } catch (error) {
      console.error('Error updating lesson status:', error);
      alert('Failed to update lesson status');
    }
  };

  const handleDragStart = (e, lessonId) => {
    setDraggedItem(lessonId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetLessonId) => {
    e.preventDefault();
    
    if (draggedItem && draggedItem !== targetLessonId) {
      const lessons = [...unit.lessons];
      const draggedLesson = lessons.find(l => l.id === draggedItem);
      const targetLesson = lessons.find(l => l.id === targetLessonId);
      
      if (draggedLesson && targetLesson) {
        const draggedIndex = lessons.indexOf(draggedLesson);
        const targetIndex = lessons.indexOf(targetLesson);
        
        // Remove dragged item
        lessons.splice(draggedIndex, 1);
        // Insert at target position
        lessons.splice(targetIndex, 0, draggedLesson);
        
        // Create new order array
        const newOrder = lessons.map((lesson, index) => ({
          id: lesson.id,
          order: index + 1
        }));
        
        handleReorderLessons(newOrder);
      }
    }
    
    setDraggedItem(null);
  };

  const totalQuizzes = unit.lessons.reduce((sum, lesson) => sum + lesson.lessonQuizzes.length, 0);
  const publishedLessons = unit.lessons.filter(l => l.isPublished).length;
  const totalDuration = unit.lessons.reduce((sum, lesson) => sum + (lesson.duration || 0), 0);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Unit Lessons</h1>
          <p className="text-base-content/70 mt-1">
            Managing lessons for "{unit.title}" in "{course.title}"
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/courses/${course.id}/units/${unit.id}/lessons/new`} className="btn btn-primary gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Lesson
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
              <div className="text-sm font-medium text-base-content/70">Total Lessons</div>
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
              <div className="text-sm font-medium text-base-content/70">Published</div>
              <div className="text-2xl font-bold text-success">{publishedLessons}</div>
            </div>
            <div className="w-10 h-10 bg-success/10 rounded-btn flex items-center justify-center">
              <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-base-100 rounded-box border border-base-300 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-base-content/70">Total Quizzes</div>
              <div className="text-2xl font-bold text-secondary">{totalQuizzes}</div>
            </div>
            <div className="w-10 h-10 bg-secondary/10 rounded-btn flex items-center justify-center">
              <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-base-100 rounded-box border border-base-300 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-base-content/70">Total Duration</div>
              <div className="text-2xl font-bold text-accent">{formatDuration(totalDuration)}</div>
            </div>
            <div className="w-10 h-10 bg-accent/10 rounded-btn flex items-center justify-center">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Unit Info */}
      <div className="bg-base-100 rounded-box border border-base-300 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-btn flex items-center justify-center">
            <span className="font-bold text-primary">{unit.order}</span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold mb-2">{unit.title}</h2>
            {unit.description && (
              <p className="text-base-content/70 mb-3">{unit.description}</p>
            )}
            <div className="flex items-center gap-4 text-sm text-base-content/70">
              <span>{unit.lessons.length} lessons</span>
              <span>Updated {formatDate(unit.updatedAt)}</span>
            </div>
          </div>
          <Link href={`/admin/courses/${course.id}/units/${unit.id}/edit`} className="btn btn-outline btn-sm gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Unit
          </Link>
        </div>
      </div>

      {/* Lessons List */}
      <div className="space-y-4">
        {unit.lessons.length > 0 ? (
          <>
            {/* Reorder Instructions */}
            <div className="bg-info/5 border border-info/20 rounded-box p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-info">
                  Drag and drop lessons to reorder them. Changes are saved automatically.
                </span>
              </div>
            </div>

            {unit.lessons.map((lesson, index) => (
              <div
                key={lesson.id}
                draggable
                onDragStart={(e) => handleDragStart(e, lesson.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, lesson.id)}
                className={`bg-base-100 rounded-box border border-base-300 shadow-lg transition-all duration-200 ${
                  draggedItem === lesson.id ? 'opacity-50 scale-95' : ''
                } ${isReordering ? 'animate-pulse' : ''}`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Drag Handle */}
                      <div className="cursor-move text-base-content/40 mt-1">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                        </svg>
                      </div>
                      
                      {/* Lesson Number */}
                      <div className="w-12 h-12 bg-secondary/10 rounded-btn flex items-center justify-center">
                        <span className="font-bold text-secondary">{lesson.order}</span>
                      </div>
                      
                      {/* Lesson Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-bold mb-1">{lesson.title}</h3>
                            {lesson.description && (
                              <p className="text-base-content/70 text-sm mb-2">{lesson.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            {!lesson.isPublished && (
                              <span className="badge badge-warning badge-sm">Draft</span>
                            )}
                            {lesson.isPublished && (
                              <span className="badge badge-success badge-sm">Published</span>
                            )}
                            {lesson.videoUrl && (
                              <span className="badge badge-info badge-sm">Video</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-base-content/70 mb-3">
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {formatDuration(lesson.duration)}
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {lesson.lessonQuizzes.length} quizzes
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Updated {formatDate(lesson.updatedAt)}
                          </div>
                          <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            {lesson.content ? 'Has content' : 'No content'}
                          </div>
                        </div>

                        {/* Content Preview */}
                        {lesson.content && (
                          <div className="bg-base-200/50 rounded-box p-3 mb-3">
                            <div 
                              className="text-sm text-base-content/80 line-clamp-2"
                              dangerouslySetInnerHTML={{ 
                                __html: lesson.content.replace(/<[^>]*>/g, '').slice(0, 150) + '...' 
                              }}
                            />
                          </div>
                        )}

                        {/* Quick Actions */}
                        <div className="flex items-center gap-2">
                          <Link 
                            href={`/admin/courses/${course.id}/units/${unit.id}/lessons/${lesson.id}/edit`}
                            className="btn btn-primary btn-sm gap-1"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </Link>
                          
                          <button 
                            onClick={() => handleTogglePublish(lesson.id, lesson.isPublished)}
                            className={`btn btn-sm gap-1 ${lesson.isPublished ? 'btn-warning' : 'btn-success'}`}
                          >
                            {lesson.isPublished ? (
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

                          {lesson.lessonQuizzes.length > 0 && (
                            <Link 
                              href={`/admin/courses/${course.id}/units/${unit.id}/lessons/${lesson.id}/quizzes`}
                              className="btn btn-outline btn-sm gap-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {lesson.lessonQuizzes.length} Quiz{lesson.lessonQuizzes.length > 1 ? 'es' : ''}
                            </Link>
                          )}

                          <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-sm">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                              </svg>
                            </label>
                            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-48 border border-base-300">
                              <li>
                                <Link href={`/admin/courses/${course.id}/units/${unit.id}/lessons/${lesson.id}/preview`}>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                  Preview
                                </Link>
                              </li>
                              <li>
                                <Link href={`/admin/courses/${course.id}/units/${unit.id}/lessons/${lesson.id}/quizzes/new`}>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                  </svg>
                                  Add Quiz
                                </Link>
                              </li>
                              <li>
                                <button>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                  Duplicate
                                </button>
                              </li>
                              <li className="border-t border-base-300 mt-2 pt-2">
                                <button 
                                  onClick={() => handleDeleteLesson(lesson.id)}
                                  className="text-error"
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
              </div>
            ))}
          </>
        ) : (
          <div className="text-center py-16 bg-base-100 rounded-box border border-base-300">
            <svg className="w-20 h-20 text-base-content/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-xl font-semibold text-base-content/70 mb-2">No Lessons Yet</h3>
            <p className="text-base-content/50 mb-6 max-w-md mx-auto">
              Start building your unit by creating your first lesson. Lessons contain the main content that students will learn from.
            </p>
            <Link href={`/admin/courses/${course.id}/units/${unit.id}/lessons/new`} className="btn btn-primary gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Your First Lesson
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
