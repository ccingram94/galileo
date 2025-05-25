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

export default function UnitsManager({ course }) {
  const router = useRouter();
  const [draggedItem, setDraggedItem] = useState(null);
  const [isReordering, setIsReordering] = useState(false);

  const handleDeleteUnit = async (unitId) => {
    if (!confirm('Are you sure you want to delete this unit? All lessons in this unit will also be deleted.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/courses/${course.id}/units/${unitId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete unit');
      }
    } catch (error) {
      console.error('Error deleting unit:', error);
      alert('Failed to delete unit');
    }
  };

  const handleReorderUnits = async (newOrder) => {
    setIsReordering(true);
    try {
      const response = await fetch(`/api/admin/courses/${course.id}/units/reorder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ unitOrder: newOrder }),
      });

      if (response.ok) {
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to reorder units');
      }
    } catch (error) {
      console.error('Error reordering units:', error);
      alert('Failed to reorder units');
    } finally {
      setIsReordering(false);
    }
  };

  const handleDragStart = (e, unitId) => {
    setDraggedItem(unitId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetUnitId) => {
    e.preventDefault();
    
    if (draggedItem && draggedItem !== targetUnitId) {
      const units = [...course.units];
      const draggedUnit = units.find(u => u.id === draggedItem);
      const targetUnit = units.find(u => u.id === targetUnitId);
      
      if (draggedUnit && targetUnit) {
        const draggedIndex = units.indexOf(draggedUnit);
        const targetIndex = units.indexOf(targetUnit);
        
        // Remove dragged item
        units.splice(draggedIndex, 1);
        // Insert at target position
        units.splice(targetIndex, 0, draggedUnit);
        
        // Create new order array
        const newOrder = units.map((unit, index) => ({
          id: unit.id,
          order: index + 1
        }));
        
        handleReorderUnits(newOrder);
      }
    }
    
    setDraggedItem(null);
  };

  const totalLessons = course.units.reduce((sum, unit) => sum + unit.lessons.length, 0);
  const totalExams = course.units.reduce((sum, unit) => sum + unit.unitExams.length, 0);

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Course Units</h1>
          <p className="text-base-content/70 mt-1">
            Manage units and lessons for "{course.title}"
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/courses/${course.id}/units/new`} className="btn btn-primary gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Unit
          </Link>
          <Link href={`/admin/courses/${course.id}/content`} className="btn btn-ghost gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Content
          </Link>
        </div>
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-base-100 rounded-box border border-base-300 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-base-content/70">Total Units</div>
              <div className="text-2xl font-bold text-primary">{course.units.length}</div>
            </div>
            <div className="w-10 h-10 bg-primary/10 rounded-btn flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-base-100 rounded-box border border-base-300 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-base-content/70">Total Lessons</div>
              <div className="text-2xl font-bold text-secondary">{totalLessons}</div>
            </div>
            <div className="w-10 h-10 bg-secondary/10 rounded-btn flex items-center justify-center">
              <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-base-100 rounded-box border border-base-300 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-base-content/70">Total Exams</div>
              <div className="text-2xl font-bold text-accent">{totalExams}</div>
            </div>
            <div className="w-10 h-10 bg-accent/10 rounded-btn flex items-center justify-center">
              <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-base-100 rounded-box border border-base-300 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-base-content/70">Avg Lessons/Unit</div>
              <div className="text-2xl font-bold text-info">
                {course.units.length > 0 ? (totalLessons / course.units.length).toFixed(1) : '0'}
              </div>
            </div>
            <div className="w-10 h-10 bg-info/10 rounded-btn flex items-center justify-center">
              <svg className="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Units List */}
      <div className="space-y-4">
        {course.units.length > 0 ? (
          <>
            {/* Reorder Instructions */}
            <div className="bg-info/5 border border-info/20 rounded-box p-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-info">
                  Drag and drop units to reorder them. Changes are saved automatically.
                </span>
              </div>
            </div>

            {course.units.map((unit, index) => (
              <div
                key={unit.id}
                draggable
                onDragStart={(e) => handleDragStart(e, unit.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, unit.id)}
                className={`bg-base-100 rounded-box border border-base-300 shadow-lg transition-all duration-200 ${
                  draggedItem === unit.id ? 'opacity-50 scale-95' : ''
                } ${isReordering ? 'animate-pulse' : ''}`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Drag Handle */}
                      <div className="cursor-move text-base-content/40 mt-1">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                        </svg>
                      </div>
                      
                      {/* Unit Number */}
                      <div className="w-12 h-12 bg-primary/10 rounded-btn flex items-center justify-center">
                        <span className="font-bold text-primary">{index + 1}</span>
                      </div>
                      
                      {/* Unit Info */}
                      <div className="flex-1">
                        <h2 className="text-xl font-bold mb-2">{unit.title}</h2>
                        {unit.description && (
                          <p className="text-base-content/70 mb-3">{unit.description}</p>
                        )}
                        
                        <div className="flex items-center gap-4 text-sm text-base-content/70">
                          <span>{unit.lessons.length} lessons</span>
                          <span>{unit.unitExams.length} exams</span>
                          <span>Updated {formatDate(unit.updatedAt)}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="dropdown dropdown-end">
                      <label tabIndex={0} className="btn btn-ghost btn-sm">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </label>
                      <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-48 border border-base-300">
                        <li>
                          <Link href={`/admin/courses/${course.id}/units/${unit.id}/lessons`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            Manage Lessons
                          </Link>
                        </li>
                        <li>
                          <Link href={`/admin/courses/${course.id}/units/${unit.id}/edit`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit Unit
                          </Link>
                        </li>
                        <li>
                          <Link href={`/admin/courses/${course.id}/units/${unit.id}/lessons/new`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Add Lesson
                          </Link>
                        </li>
                        <li className="border-t border-base-300 mt-2 pt-2">
                          <button 
                            onClick={() => handleDeleteUnit(unit.id)}
                            className="text-error"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete Unit
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  {/* Lessons Preview */}
                  {unit.lessons.length > 0 && (
                    <div className="border-t border-base-300 pt-4 mt-4">
                      <h3 className="font-medium mb-3">Lessons in this unit:</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {unit.lessons.slice(0, 6).map((lesson) => (
                          <div key={lesson.id} className="flex items-center gap-2 p-2 bg-base-200/50 rounded-btn">
                            <div className="w-6 h-6 bg-secondary/10 rounded-btn flex items-center justify-center">
                              <span className="text-xs font-bold text-secondary">{lesson.order}</span>
                            </div>
                            <span className="text-sm truncate">{lesson.title}</span>
                            {!lesson.isPublished && (
                              <span className="badge badge-xs badge-warning">Draft</span>
                            )}
                          </div>
                        ))}
                        {unit.lessons.length > 6 && (
                          <div className="flex items-center gap-2 p-2 text-base-content/70">
                            <span className="text-sm">+{unit.lessons.length - 6} more...</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Quick Actions */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-base-300">
                    <Link 
                      href={`/admin/courses/${course.id}/units/${unit.id}/lessons`}
                      className="btn btn-outline btn-sm gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      {unit.lessons.length} Lessons
                    </Link>
                    
                    <Link 
                      href={`/admin/courses/${course.id}/units/${unit.id}/lessons/new`}
                      className="btn btn-primary btn-sm gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Lesson
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="text-center py-16 bg-base-100 rounded-box border border-base-300">
            <svg className="w-20 h-20 text-base-content/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-xl font-semibold text-base-content/70 mb-2">No Units Yet</h3>
            <p className="text-base-content/50 mb-6 max-w-md mx-auto">
              Start building your course by creating your first unit. Units help organize your lessons into logical sections.
            </p>
            <Link href={`/admin/courses/${course.id}/units/new`} className="btn btn-primary gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Create Your First Unit
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
