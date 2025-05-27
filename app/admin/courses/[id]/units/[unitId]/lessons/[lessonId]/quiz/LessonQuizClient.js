'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function LessonQuizClient({ quiz, lesson, courseId, unitId }) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="tabs tabs-bordered">
        <button 
          className={`tab tab-bordered ${activeTab === 'overview' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`tab tab-bordered ${activeTab === 'attempts' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('attempts')}
        >
          Student Attempts ({quiz.stats.totalAttempts})
        </button>
        <button 
          className={`tab tab-bordered ${activeTab === 'analytics' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          Analytics
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <QuizOverviewTab quiz={quiz} lesson={lesson} courseId={courseId} unitId={unitId} />
      )}
      
      {activeTab === 'attempts' && (
        <QuizAttemptsTab quiz={quiz} />
      )}
      
      {activeTab === 'analytics' && (
        <QuizAnalyticsTab quiz={quiz} />
      )}
    </div>
  );
}

function QuizOverviewTab({ quiz, lesson, courseId, unitId }) {
  // Parse questions to display
  let questions = [];
  try {
    if (Array.isArray(quiz.questions)) {
      questions = quiz.questions;
    } else if (typeof quiz.questions === 'object' && quiz.questions) {
      // Handle different question format structures
      questions = Object.values(quiz.questions).flat();
    }
  } catch (error) {
    console.error('Error parsing questions:', error);
  }

  return (
    <div className="space-y-6">
      {/* Quiz Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Quiz Settings</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Questions:</span>
              <span className="font-medium">{quiz.stats.questionCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Passing Score:</span>
              <span className="font-medium">{quiz.passingScore}%</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <div className={`badge badge-sm ${quiz.isPublished ? 'badge-success' : 'badge-warning'}`}>
                {quiz.isPublished ? 'Published' : 'Draft'}
              </div>
            </div>
            <div className="flex justify-between">
              <span>Created:</span>
              <span className="font-medium">{new Date(quiz.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Performance Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Total Attempts:</span>
              <span className="font-medium">{quiz.stats.totalAttempts}</span>
            </div>
            <div className="flex justify-between">
              <span>Pass Rate:</span>
              <span className={`font-medium ${quiz.stats.passRate >= 70 ? 'text-success' : 'text-warning'}`}>
                {Math.round(quiz.stats.passRate)}%
              </span>
            </div>
            <div className="flex justify-between">
              <span>Average Score:</span>
              <span className="font-medium">{quiz.stats.averageScore}%</span>
            </div>
            <div className="flex justify-between">
              <span>Average Time:</span>
              <span className="font-medium">
                {quiz.stats.averageTimeSpent > 0 ? `${Math.round(quiz.stats.averageTimeSpent)} min` : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Questions Preview */}
      {questions.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">Questions Preview</h3>
            <Link 
              href={`/admin/courses/${courseId}/units/${unitId}/lessons/${lesson.id}/quiz/edit`}
              className="btn btn-sm btn-outline gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Questions
            </Link>
          </div>
          
          <div className="space-y-3">
            {questions.slice(0, 5).map((question, index) => (
              <div key={index} className="bg-base-200/50 rounded-btn p-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/10 rounded-btn flex items-center justify-center text-xs font-medium text-primary shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium mb-2">{question.question || question.text}</p>
                    {question.options && (
                      <div className="space-y-1">
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="text-xs text-base-content/70 flex items-center gap-2">
                            <span className="w-4 h-4 border border-base-300 rounded-btn flex items-center justify-center text-[10px]">
                              {String.fromCharCode(65 + optIndex)}
                            </span>
                            <span>{option}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {questions.length > 5 && (
              <div className="text-center py-2">
                <span className="text-sm text-base-content/50">
                  +{questions.length - 5} more questions
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        <Link 
          href={`/admin/courses/${courseId}/units/${unitId}/lessons/${lesson.id}/quiz/preview`}
          className="btn btn-primary btn-sm gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Preview Quiz
        </Link>
        <Link 
          href={`/admin/courses/${courseId}/units/${unitId}/lessons/${lesson.id}/quiz/edit`}
          className="btn btn-secondary btn-sm gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edit Quiz
        </Link>
        <button className="btn btn-ghost btn-sm gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Results
        </button>
      </div>
    </div>
  );
}

function QuizAttemptsTab({ quiz }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Student Attempts</h3>
        {quiz.stats.totalAttempts > 0 && (
          <div className="text-sm text-base-content/70">
            {quiz.stats.completedAttempts} completed of {quiz.stats.totalAttempts} total
          </div>
        )}
      </div>

      {quiz.attempts && quiz.attempts.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Student</th>
                <th>Score</th>
                <th>Status</th>
                <th>Time Spent</th>
                <th>Completed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quiz.attempts.map((attempt) => (
                <tr key={attempt.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-8">
                          <span className="text-xs">
                            {(attempt.user.name || attempt.user.email || 'U').charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-sm">{attempt.user.name || 'Unknown'}</div>
                        <div className="text-xs opacity-70">{attempt.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${attempt.passed ? 'text-success' : 'text-error'}`}>
                        {Math.round(attempt.score)}%
                      </span>
                      <div className={`badge badge-xs ${attempt.passed ? 'badge-success' : 'badge-error'}`}>
                        {attempt.passed ? 'Pass' : 'Fail'}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={`badge badge-sm ${attempt.passed ? 'badge-success' : 'badge-error'} badge-outline`}>
                      {attempt.passed ? 'Passed' : 'Failed'}
                    </div>
                  </td>
                  <td>
                    <span className="text-sm">
                      {attempt.timeSpent ? `${Math.round(attempt.timeSpent)} min` : 'N/A'}
                    </span>
                  </td>
                  <td>
                    <span className="text-sm">
                      {new Date(attempt.completedAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <button className="btn btn-ghost btn-xs" title="View Details">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-12 h-12 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h4 className="font-medium mb-2">No Attempts Yet</h4>
          <p className="text-sm text-base-content/70">Students haven't taken this quiz yet.</p>
        </div>
      )}
    </div>
  );
}

function QuizAnalyticsTab({ quiz }) {
  // Mock analytics data - you could make this more sophisticated
  const difficultyData = quiz.stats.questionCount > 0 ? [
    { difficulty: 'Easy', percentage: 40 },
    { difficulty: 'Medium', percentage: 45 },
    { difficulty: 'Hard', percentage: 15 },
  ] : [];

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg">Quiz Analytics</h3>
      
      {quiz.stats.totalAttempts > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Performance Metrics */}
          <div className="space-y-4">
            <h4 className="font-medium">Performance Metrics</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Pass Rate</span>
                  <span>{Math.round(quiz.stats.passRate)}%</span>
                </div>
                <div className="w-full bg-base-200 rounded-full h-2">
                  <div
                    className="bg-success h-2 rounded-full"
                    style={{ width: `${quiz.stats.passRate}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Average Score</span>
                  <span>{quiz.stats.averageScore}%</span>
                </div>
                <div className="w-full bg-base-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${quiz.stats.averageScore}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Attempt Distribution */}
          <div className="space-y-4">
            <h4 className="font-medium">Attempt Summary</h4>
            <div className="stats stats-vertical shadow-sm border border-base-300">
              <div className="stat">
                <div className="stat-title text-xs">Total Attempts</div>
                <div className="stat-value text-lg">{quiz.stats.totalAttempts}</div>
              </div>
              <div className="stat">
                <div className="stat-title text-xs">Completed</div>
                <div className="stat-value text-lg text-success">{quiz.stats.completedAttempts}</div>
              </div>
              <div className="stat">
                <div className="stat-title text-xs">Passed</div>
                <div className="stat-value text-lg text-info">{quiz.stats.passedAttempts}</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-12 h-12 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h4 className="font-medium mb-2">No Data Available</h4>
          <p className="text-sm text-base-content/70">Analytics will appear once students start taking the quiz.</p>
        </div>
      )}

      {/* Recommendations */}
      {quiz.stats.totalAttempts > 5 && (
        <div className="bg-info/5 border border-info/20 rounded-box p-4">
          <h4 className="font-medium text-info mb-2">Recommendations</h4>
          <ul className="text-sm text-base-content/70 space-y-1">
            {quiz.stats.passRate < 60 && (
              <li>• Consider reviewing questions - pass rate is below 60%</li>
            )}
            {quiz.stats.averageScore < 70 && (
              <li>• Average score suggests content may need reinforcement</li>
            )}
            {quiz.stats.averageTimeSpent > 20 && (
              <li>• Students taking longer than expected - consider reducing questions</li>
            )}
            {quiz.stats.passRate > 90 && (
              <li>• High pass rate - consider adding more challenging questions</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
