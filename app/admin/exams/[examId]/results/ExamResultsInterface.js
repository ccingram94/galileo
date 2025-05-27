'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ExamResultsInterface({ initialData }) {
  const router = useRouter();
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState('attempts');
  const [selectedAttempts, setSelectedAttempts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Handle tab switching
  const tabs = [
    { id: 'attempts', label: 'Student Attempts', icon: '👥' },
    { id: 'analytics', label: 'Question Analytics', icon: '📊' },
    { id: 'distribution', label: 'Grade Distribution', icon: '📈' },
    { id: 'activity', label: 'Grading Activity', icon: '🕐' }
  ];

  // Handle bulk actions
  const handleBulkAction = async (action) => {
    if (selectedAttempts.length === 0) {
      alert('Please select at least one attempt');
      return;
    }

    setIsLoading(true);
    try {
      // Implement bulk actions based on action type
      switch (action) {
        case 'assign-to-me':
          // TODO: Implement bulk assignment
          alert(`Assigning ${selectedAttempts.length} attempts to you...`);
          break;
        case 'mark-review':
          // TODO: Implement bulk review marking
          alert(`Marking ${selectedAttempts.length} attempts for review...`);
          break;
        case 'export':
          // TODO: Implement bulk export
          alert(`Exporting ${selectedAttempts.length} attempts...`);
          break;
      }
    } catch (error) {
      console.error('Bulk action failed:', error);
      alert('Failed to perform bulk action');
    } finally {
      setIsLoading(false);
    }
  };

  // Format time display
  const formatTime = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Format date display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Render attempts table
  const renderAttempts = () => (
    <div className="bg-base-100 rounded-box border border-base-300 shadow-lg overflow-hidden">
      {/* Filters and Bulk Actions */}
      <div className="p-4 border-b border-base-300">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold">Student Attempts ({data.attempts.length})</h3>
          
          {selectedAttempts.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-base-content/70">
                {selectedAttempts.length} selected
              </span>
              <div className="dropdown dropdown-end">
                <button className="btn btn-outline btn-sm" disabled={isLoading}>
                  Bulk Actions
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                  <li>
                    <button onClick={() => handleBulkAction('assign-to-me')}>
                      Assign to Me
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleBulkAction('mark-review')}>
                      Mark for Review
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleBulkAction('export')}>
                      Export Selected
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <select 
            className="select select-bordered select-sm"
            value={data.filters.status}
            onChange={(e) => {
              const params = new URLSearchParams(window.location.search);
              params.set('status', e.target.value);
              window.location.href = `${window.location.pathname}?${params.toString()}`;
            }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending Grading</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
            <option value="needs-review">Needs Review</option>
          </select>

          <select 
            className="select select-bordered select-sm"
            value={data.filters.sort}
            onChange={(e) => {
              const params = new URLSearchParams(window.location.search);
              params.set('sort', e.target.value);
              window.location.href = `${window.location.pathname}?${params.toString()}`;
            }}
          >
            <option value="recent">Most Recent</option>
            <option value="student">Student Name</option>
            <option value="score">Score</option>
            <option value="time">Time Used</option>
            <option value="grading-priority">Grading Priority</option>
          </select>

          <label className="cursor-pointer label">
            <input 
              type="checkbox" 
              className="checkbox checkbox-sm"
              checked={data.filters.pending}
              onChange={(e) => {
                const params = new URLSearchParams(window.location.search);
                if (e.target.checked) {
                  params.set('pending', 'true');
                } else {
                  params.delete('pending');
                }
                window.location.href = `${window.location.pathname}?${params.toString()}`;
              }}
            />
            <span className="label-text ml-2">Show only pending</span>
          </label>
        </div>
      </div>

      {/* Attempts Table */}
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>
                <input 
                  type="checkbox" 
                  className="checkbox"
                  checked={selectedAttempts.length === data.attempts.length}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedAttempts(data.attempts.map(a => a.id));
                    } else {
                      setSelectedAttempts([]);
                    }
                  }}
                />
              </th>
              <th>Student</th>
              <th>Status</th>
              <th>Score</th>
              <th>Progress</th>
              <th>Time</th>
              <th>Submitted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.attempts.map(attempt => (
              <tr 
                key={attempt.id} 
                className={`hover ${
                  attempt.gradingPriority >= 3 ? 'bg-error/10' :
                  attempt.gradingPriority >= 2 ? 'bg-warning/10' :
                  ''
                }`}
              >
                <td>
                  <input 
                    type="checkbox" 
                    className="checkbox"
                    checked={selectedAttempts.includes(attempt.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedAttempts([...selectedAttempts, attempt.id]);
                      } else {
                        setSelectedAttempts(selectedAttempts.filter(id => id !== attempt.id));
                      }
                    }}
                  />
                </td>
                <td>
                  <div>
                    <div className="font-medium">{attempt.user.name}</div>
                    <div className="text-sm text-base-content/60">{attempt.user.email}</div>
                    {attempt.attemptNumber > 1 && (
                      <div className="badge badge-outline badge-xs">
                        Attempt #{attempt.attemptNumber}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="flex flex-col gap-1">
                    <div className={`badge ${
                      attempt.gradingStatus === 'completed' ? 
                        attempt.passed ? 'badge-success' : 'badge-error' :
                      attempt.gradingStatus === 'in_progress' ? 'badge-warning' :
                      'badge-neutral'
                    }`}>
                      {attempt.gradingStatus === 'completed' ? 
                        (attempt.passed ? 'Passed' : 'Failed') :
                       attempt.gradingStatus === 'in_progress' ? 'In Progress' :
                       'Pending'
                      }
                    </div>
                    {attempt.needsReview && (
                      <div className="badge badge-error badge-xs">Review</div>
                    )}
                  </div>
                </td>
                <td>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {attempt.score !== null ? `${Math.round(attempt.score)}%` : 'N/A'}
                    </span>
                    <div className="text-xs text-base-content/60">
                      MC: {Math.round(attempt.mcScore)}% | 
                      FR: {Math.round(attempt.frScore)}%
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <progress 
                        className="progress progress-primary w-16" 
                        value={attempt.gradingProgress} 
                        max="100"
                      ></progress>
                      <span className="text-xs">{Math.round(attempt.gradingProgress)}%</span>
                    </div>
                    <div className="text-xs text-base-content/60">
                      {attempt.questionBreakdown.frGraded}/{attempt.questionBreakdown.frTotal} FR graded
                    </div>
                  </div>
                </td>
                <td>
                  <span className="text-sm">{attempt.timeFormatted}</span>
                  {data.exam.timeLimit && (
                    <div className="text-xs text-base-content/60">
                      of {formatTime(data.exam.timeLimit)}
                    </div>
                  )}
                </td>
                <td>
                  <span className="text-sm">{formatDate(attempt.completedAt || attempt.startedAt)}</span>
                  {attempt.gradedAt && (
                    <div className="text-xs text-base-content/60">
                      Graded: {formatDate(attempt.gradedAt)}
                    </div>
                  )}
                </td>
                <td>
                  <div className="flex gap-1">
                    {['pending', 'in_progress'].includes(attempt.gradingStatus) ? (
                      <Link 
                        href={`/admin/grading/${attempt.id}`}
                        className="btn btn-primary btn-xs"
                      >
                        Grade
                      </Link>
                    ) : (
                      <Link 
                        href={`/student/exams/${data.exam.id}/results?attemptId=${attempt.id}`}
                        className="btn btn-ghost btn-xs"
                        target="_blank"
                      >
                        View
                      </Link>
                    )}
                    <div className="dropdown dropdown-end">
                      <button className="btn btn-ghost btn-xs">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 4 16">
                          <path d="M2 0a2 2 0 110 4 2 2 0 010-4zM2 6a2 2 0 110 4 2 2 0 010-4zM2 12a2 2 0 110 4 2 2 0 010-4z"/>
                        </svg>
                      </button>
                      <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                        <li>
                          <Link href={`/admin/grading/${attempt.id}`}>
                            {['pending', 'in_progress'].includes(attempt.gradingStatus) ? 'Grade' : 'Review'}
                          </Link>
                        </li>
                        <li>
                          <button onClick={() => {
                            // TODO: Download individual attempt
                            alert('Download feature coming soon');
                          }}>
                            Download
                          </button>
                        </li>
                        <li>
                          <button onClick={() => {
                            // TODO: Reset attempt
                            if (confirm('Reset this attempt?')) {
                              alert('Reset feature coming soon');
                            }
                          }}>
                            Reset
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // Render question analytics
  const renderAnalytics = () => (
    <div className="bg-base-100 rounded-box border border-base-300 shadow-lg p-6">
      <h3 className="text-lg font-bold mb-4">Question Analytics</h3>
      <div className="space-y-4">
        {data.questionAnalytics.map((question, index) => (
          <div key={question.id} className="p-4 border border-base-200 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold">
                  Question {index + 1}: {question.title || 'Untitled'}
                </h4>
                <div className="text-sm text-base-content/60">
                  Type: {question.type.replace('_', ' ')} | Points: {question.points || 1}
                </div>
              </div>
              <div className="text-right">
                {question.type === 'MULTIPLE_CHOICE' ? (
                  <div>
                    <div className="text-lg font-bold text-primary">
                      {Math.round(question.correctRate)}%
                    </div>
                    <div className="text-xs text-base-content/60">
                      Correct Rate ({question.responses} responses)
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-lg font-bold text-secondary">
                      {question.averageScore.toFixed(1)}/{question.points}
                    </div>
                    <div className="text-xs text-base-content/60">
                      Avg Score ({question.gradedCount} graded)
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {question.type === 'MULTIPLE_CHOICE' ? (
              <div className="flex items-center gap-4">
                <div className={`badge ${
                  question.difficulty === 'Easy' ? 'badge-success' :
                  question.difficulty === 'Medium' ? 'badge-warning' :
                  'badge-error'
                }`}>
                  {question.difficulty}
                </div>
                <progress 
                  className="progress progress-primary flex-1" 
                  value={question.correctRate} 
                  max="100"
                ></progress>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  Grading: {question.gradedCount}/{question.totalResponses}
                </div>
                <progress 
                  className="progress progress-secondary flex-1" 
                  value={(question.gradedCount / question.totalResponses) * 100 || 0} 
                  max="100"
                ></progress>
                {question.pendingGrading > 0 && (
                  <div className="badge badge-warning badge-sm">
                    {question.pendingGrading} pending
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Render grade distribution
  const renderDistribution = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Grade Distribution */}
      <div className="bg-base-100 rounded-box border border-base-300 shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4">Grade Distribution</h3>
        <div className="space-y-3">
          {data.stats.gradeDistribution.distribution.map(grade => (
            <div key={grade.label} className="flex items-center gap-3">
              <div className="w-16 text-sm font-medium">{grade.label}</div>
              <div className="flex-1 bg-base-200 rounded-full h-6 relative">
                <div 
                  className={`h-full rounded-full ${grade.color} transition-all duration-300`}
                  style={{ width: `${grade.percentage}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                  {grade.count} ({Math.round(grade.percentage)}%)
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-base-200">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-base-content/60">Average Score:</span>
              <span className="font-bold ml-2">{Math.round(data.stats.gradeDistribution.averageScore)}%</span>
            </div>
            <div>
              <span className="text-base-content/60">Pass Rate:</span>
              <span className="font-bold ml-2">{Math.round(data.stats.gradeDistribution.passRate)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grading Workload */}
      <div className="bg-base-100 rounded-box border border-base-300 shadow-lg p-6">
        <h3 className="text-lg font-bold mb-4">Grading Workload</h3>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Overall Progress</span>
              <span>{Math.round(data.stats.gradingWorkload.completionPercentage)}%</span>
            </div>
            <progress 
              className="progress progress-primary w-full" 
              value={data.stats.gradingWorkload.completionPercentage} 
              max="100"
            ></progress>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="stat">
              <div class="stat-title text-xs">Total FR Responses</div>
              <div class="stat-value text-lg">{data.stats.gradingWorkload.totalFRResponses}</div>
            </div>
            <div className="stat">
              <div class="stat-title text-xs">Graded</div>
              <div class="stat-value text-lg text-success">{data.stats.gradingWorkload.gradedResponses}</div>
            </div>
            <div className="stat">
              <div class="stat-title text-xs">Pending</div>
              <div class="stat-value text-lg text-warning">{data.stats.gradingWorkload.pendingResponses}</div>
            </div>
            <div className="stat">
              <div class="stat-title text-xs">Completion</div>
              <div class="stat-value text-lg text-info">{Math.round(data.stats.gradingWorkload.completionPercentage)}%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render recent activity
  const renderActivity = () => (
    <div className="bg-base-100 rounded-box border border-base-300 shadow-lg p-6">
      <h3 className="text-lg font-bold mb-4">Recent Grading Activity</h3>
      
      {data.recentGrading.length > 0 ? (
        <div className="space-y-3">
          {data.recentGrading.map(activity => (
            <div key={activity.id} className="flex items-center justify-between p-3 bg-base-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${
                  activity.passed ? 'bg-success' : 'bg-error'
                }`}></div>
                <div>
                  <div className="font-medium">{activity.studentName}</div>
                  <div className="text-xs text-base-content/60">
                    Graded by {activity.graderName}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${
                  activity.passed ? 'text-success' : 'text-error'
                }`}>
                  {Math.round(activity.score)}%
                </div>
                <div className="text-xs text-base-content/60">
                  {formatDate(activity.gradedAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-base-content/60">
          No recent grading activity
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="tabs tabs-boxed bg-base-100 border border-base-300 shadow-lg">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab gap-2 ${activeTab === tab.id ? 'tab-active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'attempts' && renderAttempts()}
      {activeTab === 'analytics' && renderAnalytics()}
      {activeTab === 'distribution' && renderDistribution()}
      {activeTab === 'activity' && renderActivity()}
    </div>
  );
}
