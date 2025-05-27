'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ExamListClient({ exams, courseId, unitId, isAPPrecalculus }) {
  const router = useRouter();
  const [filter, setFilter] = useState('all'); // all, published, draft, has-attempts
  const [sortBy, setSortBy] = useState('order'); // order, title, created, attempts
  const [loading, setLoading] = useState(null);

  const handleDelete = async (examId, examTitle) => {
    if (!confirm(`Are you sure you want to delete "${examTitle}"? This cannot be undone.`)) {
      return;
    }

    setLoading(examId);
    try {
      const response = await fetch(`/api/admin/courses/${courseId}/units/${unitId}/exams/${examId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to delete exam');
      }
    } catch (error) {
      console.error('Error deleting exam:', error);
      alert('Failed to delete exam');
    } finally {
      setLoading(null);
    }
  };

  const handleTogglePublish = async (examId, currentStatus) => {
    setLoading(examId);
    try {
      const response = await fetch(`/api/admin/courses/${courseId}/units/${unitId}/exams/${examId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !currentStatus })
      });

      if (response.ok) {
        router.refresh();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to update exam');
      }
    } catch (error) {
      console.error('Error updating exam:', error);
      alert('Failed to update exam');
    } finally {
      setLoading(null);
    }
  };

  const handleDuplicate = async (examId, examTitle) => {
    // This would duplicate an exam - placeholder for now
    alert(`Duplicate "${examTitle}" - Feature coming soon!`);
  };

  // Filter exams
  const filteredExams = exams.filter(exam => {
    switch (filter) {
      case 'published':
        return exam.isPublished;
      case 'draft':
        return !exam.isPublished;
      case 'has-attempts':
        return exam.stats.hasAttempts;
      default:
        return true;
    }
  });

  // Sort exams
  const sortedExams = [...filteredExams].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'created':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'attempts':
        return b.stats.totalAttempts - a.stats.totalAttempts;
      case 'order':
      default:
        return a.order - b.order;
    }
  });

  return (
    <div className="space-y-4">
      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-sm btn-outline gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.207A1 1 0 013 6.5V4z" />
              </svg>
              Filter: {filter === 'all' ? 'All' : filter === 'published' ? 'Published' : filter === 'draft' ? 'Draft' : 'Has Attempts'}
            </div>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border border-base-300">
              <li><button onClick={() => setFilter('all')} className={filter === 'all' ? 'active' : ''}>All Exams</button></li>
              <li><button onClick={() => setFilter('published')} className={filter === 'published' ? 'active' : ''}>Published</button></li>
              <li><button onClick={() => setFilter('draft')} className={filter === 'draft' ? 'active' : ''}>Draft</button></li>
              <li><button onClick={() => setFilter('has-attempts')} className={filter === 'has-attempts' ? 'active' : ''}>Has Attempts</button></li>
            </ul>
          </div>

          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-sm btn-outline gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
              Sort: {sortBy === 'order' ? 'Order' : sortBy === 'title' ? 'Title' : sortBy === 'created' ? 'Created' : 'Attempts'}
            </div>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border border-base-300">
              <li><button onClick={() => setSortBy('order')} className={sortBy === 'order' ? 'active' : ''}>Order</button></li>
              <li><button onClick={() => setSortBy('title')} className={sortBy === 'title' ? 'active' : ''}>Title</button></li>
              <li><button onClick={() => setSortBy('created')} className={sortBy === 'created' ? 'active' : ''}>Created Date</button></li>
              <li><button onClick={() => setSortBy('attempts')} className={sortBy === 'attempts' ? 'active' : ''}>Attempts</button></li>
            </ul>
          </div>
        </div>

        <div className="text-sm text-base-content/70">
          {sortedExams.length} of {exams.length} exams
        </div>
      </div>

      {/* Exam Cards */}
      <div className="grid gap-4">
        {sortedExams.map((exam) => (
          <ExamCard 
            key={exam.id}
            exam={exam}
            courseId={courseId}
            unitId={unitId}
            isAPPrecalculus={isAPPrecalculus}
            loading={loading === exam.id}
            onDelete={() => handleDelete(exam.id, exam.title)}
            onTogglePublish={() => handleTogglePublish(exam.id, exam.isPublished)}
            onDuplicate={() => handleDuplicate(exam.id, exam.title)}
          />
        ))}
      </div>

      {sortedExams.length === 0 && (
        <div className="text-center py-8">
          <p className="text-base-content/50">No exams match the current filter.</p>
          {filter !== 'all' && (
            <button 
              onClick={() => setFilter('all')} 
              className="btn btn-ghost btn-sm mt-2"
            >
              Show All Exams
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Individual Exam Card Component
function ExamCard({ exam, courseId, unitId, isAPPrecalculus, loading, onDelete, onTogglePublish, onDuplicate }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (minutes) => {
    if (!minutes) return 'No limit';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="card bg-base-50 border border-base-300 shadow-sm hover:shadow-md transition-shadow">
      <div className="card-body p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="card-title text-lg">{exam.title}</h3>
              <div className="flex items-center gap-2">
                <div className={`badge badge-sm ${exam.isPublished ? 'badge-success' : 'badge-warning'}`}>
                  {exam.isPublished ? 'Published' : 'Draft'}
                </div>
                {exam.examType !== 'UNIT_ASSESSMENT' && (
                  <div className="badge badge-sm badge-outline">
                    {exam.examType.replace('_', ' ')}
                  </div>
                )}
                {isAPPrecalculus && (
                  <div className="badge badge-sm badge-primary">AP Format</div>
                )}
              </div>
            </div>
            
            {exam.description && (
              <p className="text-sm text-base-content/70 mb-3 line-clamp-2">
                {exam.description.replace(/<[^>]*>/g, '')}
              </p>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-base-content/60">Questions:</span>
                <div className="font-medium">
                  {exam.stats.questionCounts?.total || 0}
                  <span className="text-xs text-base-content/50 ml-1">
                    ({exam.stats.questionCounts?.multipleChoice || 0}MC, {exam.stats.questionCounts?.freeResponse || 0}FR)
                  </span>
                </div>
              </div>
              
              <div>
                <span className="text-base-content/60">Time Limit:</span>
                <div className="font-medium">{formatTime(exam.timeLimit)}</div>
              </div>
              
              <div>
                <span className="text-base-content/60">Attempts:</span>
                <div className="font-medium">
                  {exam.stats.totalAttempts}
                  {exam.stats.totalAttempts > 0 && (
                    <span className="text-xs text-base-content/50 ml-1">
                      ({exam.stats.completedAttempts} completed)
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                <span className="text-base-content/60">Pass Rate:</span>
                <div className="font-medium">
                  {exam.stats.totalAttempts > 0 ? `${Math.round(exam.stats.passRate)}%` : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-sm" disabled={loading}>
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              )}
            </div>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border border-base-300">
              <li>
                <Link href={`/admin/courses/${courseId}/units/${unitId}/exams/${exam.id}/edit`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Exam
                </Link>
              </li>
              <li>
                <button onClick={onDuplicate}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Duplicate
                </button>
              </li>
              <li>
                <button onClick={onTogglePublish}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {exam.isPublished ? 'Unpublish' : 'Publish'}
                </button>
              </li>
              {exam.stats.totalAttempts > 0 && (
                <li>
                  <Link href={`/admin/courses/${courseId}/units/${unitId}/exams/${exam.id}/analytics`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    View Analytics
                  </Link>
                </li>
              )}
              <li><hr className="my-1" /></li>
              <li>
                <button onClick={onDelete} className="text-error" disabled={exam.stats.hasAttempts}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  {exam.stats.hasAttempts ? 'Cannot Delete (Has Attempts)' : 'Delete'}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer with dates and quick actions */}
        <div className="flex items-center justify-between pt-3 border-t border-base-300">
          <div className="text-xs text-base-content/50">
            Created {formatDate(exam.createdAt)}
            {exam.stats.lastAttempt && (
              <span> • Last attempt {formatDate(exam.stats.lastAttempt)}</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Link 
              href={`/admin/courses/${courseId}/units/${unitId}/exams/${exam.id}/edit`}
              className="btn btn-ghost btn-xs gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
