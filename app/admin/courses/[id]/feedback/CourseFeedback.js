'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function StarRating({ rating, readonly = true, size = 'sm' }) {
  const stars = Array.from({ length: 5 }, (_, i) => i + 1);
  
  return (
    <div className="flex items-center gap-1">
      {stars.map((star) => (
        <svg
          key={star}
          className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} ${
            star <= rating ? 'text-warning fill-current' : 'text-base-300'
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ))}
    </div>
  );
}

export default function CourseFeedback({ course, feedback, surveyResponses }) {
  const [activeTab, setActiveTab] = useState('reviews'); // reviews, surveys, analytics
  const [filterRating, setFilterRating] = useState('all'); // all, 1, 2, 3, 4, 5
  const [filterDate, setFilterDate] = useState('all'); // all, 7, 30, 90
  const [selectedFeedback, setSelectedFeedback] = useState(null);

  // Calculate feedback analytics
  const analytics = useMemo(() => {
    if (feedback.length === 0) return { averageRating: 0, totalFeedback: 0, ratingDistribution: {} };

    const ratings = feedback.map(f => f.rating);
    const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
    
    const ratingDistribution = {
      5: ratings.filter(r => r === 5).length,
      4: ratings.filter(r => r === 4).length,
      3: ratings.filter(r => r === 3).length,
      2: ratings.filter(r => r === 2).length,
      1: ratings.filter(r => r === 1).length
    };

    const totalFeedback = feedback.length;
    const responseRate = course.enrollments.length > 0 ? (totalFeedback / course.enrollments.length) * 100 : 0;

    return {
      averageRating,
      totalFeedback,
      ratingDistribution,
      responseRate
    };
  }, [feedback, course.enrollments]);

  const filteredFeedback = useMemo(() => {
    let filtered = [...feedback];

    // Filter by rating
    if (filterRating !== 'all') {
      filtered = filtered.filter(f => f.rating === parseInt(filterRating));
    }

    // Filter by date
    if (filterDate !== 'all') {
      const days = parseInt(filterDate);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);
      filtered = filtered.filter(f => new Date(f.createdAt) >= cutoffDate);
    }

    return filtered;
  }, [feedback, filterRating, filterDate]);

  const handleFeedbackAction = async (feedbackId, action) => {
    try {
      const response = await fetch(`/api/admin/courses/${course.id}/feedback/${feedbackId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        // Refresh the page or update state
        window.location.reload();
      } else {
        const error = await response.json();
        alert(error.error || 'Action failed');
      }
    } catch (error) {
      console.error('Error performing feedback action:', error);
      alert('Action failed');
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Course Feedback</h1>
          <p className="text-base-content/70 mt-1">
            Student reviews and feedback for "{course.title}"
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-outline btn-sm gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            Export Feedback
          </button>
          <Link href={`/admin/courses/${course.id}/edit`} className="btn btn-ghost btn-sm gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Course
          </Link>
        </div>
      </div>

      {/* Feedback Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-base-100 rounded-box border border-base-300 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-base-content/70 text-sm font-medium">Average Rating</p>
              <p className="text-3xl font-bold text-warning">{analytics.averageRating.toFixed(1)}</p>
            </div>
            <div className="w-12 h-12 bg-warning/10 rounded-btn flex items-center justify-center">
              <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
          </div>
          <StarRating rating={Math.round(analytics.averageRating)} />
        </div>

        <div className="bg-base-100 rounded-box border border-base-300 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/70 text-sm font-medium">Total Reviews</p>
              <p className="text-3xl font-bold text-primary">{analytics.totalFeedback}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-btn flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-base-100 rounded-box border border-base-300 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/70 text-sm font-medium">Response Rate</p>
              <p className="text-3xl font-bold text-success">{analytics.responseRate.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-btn flex items-center justify-center">
              <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="mt-2 text-xs text-base-content/60">
            {analytics.totalFeedback} of {course.enrollments.length} students
          </div>
        </div>

        <div className="bg-base-100 rounded-box border border-base-300 p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-base-content/70 text-sm font-medium">Satisfaction</p>
              <p className="text-3xl font-bold text-info">
                {analytics.totalFeedback > 0 ? Math.round(((analytics.ratingDistribution[4] + analytics.ratingDistribution[5]) / analytics.totalFeedback) * 100) : 0}%
              </p>
            </div>
            <div className="w-12 h-12 bg-info/10 rounded-btn flex items-center justify-center">
              <svg className="w-6 h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-xs text-base-content/60">4-5 star reviews</div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-base-100 rounded-box border border-base-300 shadow-xl">
        <div className="p-6 border-b border-base-300">
          <h2 className="text-xl font-semibold">Rating Distribution</h2>
          <p className="text-base-content/70 mt-1">Breakdown of student ratings</p>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = analytics.ratingDistribution[rating] || 0;
              const percentage = analytics.totalFeedback > 0 ? (count / analytics.totalFeedback) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center gap-4">
                  <div className="flex items-center gap-2 w-16">
                    <span className="text-sm font-medium">{rating}</span>
                    <svg className="w-4 h-4 text-warning fill-current" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-base-200 rounded-full h-2">
                        <div
                          className="bg-warning h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-sm font-medium w-12 text-right">{count}</div>
                      <div className="text-sm text-base-content/70 w-12 text-right">{percentage.toFixed(0)}%</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed bg-base-100 border border-base-300 shadow-xl">
        <button 
          className={`tab ${activeTab === 'reviews' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Reviews ({feedback.length})
        </button>
        <button 
          className={`tab ${activeTab === 'surveys' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('surveys')}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Surveys ({surveyResponses.length})
        </button>
        <button 
          className={`tab ${activeTab === 'analytics' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Analytics
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'reviews' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-base-100 rounded-box border border-base-300 p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <select
                className="select select-bordered select-sm"
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>

              <select
                className="select select-bordered select-sm"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>

              <div className="text-sm text-base-content/70 ml-auto">
                Showing {filteredFeedback.length} of {feedback.length} reviews
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {filteredFeedback.map((review) => (
              <div key={review.id} className="bg-base-100 rounded-box border border-base-300 shadow-lg">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-12 h-12 rounded-full">
                          {review.user.image ? (
                            <img src={review.user.image} alt={review.user.name} />
                          ) : (
                            <div className="bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                              {review.user.name?.charAt(0) || 'U'}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold">{review.user.name}</h3>
                        <div className="flex items-center gap-2">
                          <StarRating rating={review.rating} />
                          <span className="text-sm text-base-content/70">{formatDate(review.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="dropdown dropdown-end">
                      <label tabIndex={0} className="btn btn-ghost btn-xs">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </label>
                      <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 border border-base-300">
                        <li>
                          <button onClick={() => handleFeedbackAction(review.id, 'feature')}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            Feature
                          </button>
                        </li>
                        <li>
                          <button onClick={() => handleFeedbackAction(review.id, 'hide')}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L5.636 5.636m4.242 4.242L15.314 15.314" />
                            </svg>
                            Hide
                          </button>
                        </li>
                        <li>
                          <button onClick={() => handleFeedbackAction(review.id, 'flag')}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                            </svg>
                            Flag
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {review.title && (
                      <h4 className="font-semibold text-lg">{review.title}</h4>
                    )}
                    
                    {review.comment && (
                      <p className="text-base-content/80 leading-relaxed">{review.comment}</p>
                    )}

                    {review.pros && review.pros.length > 0 && (
                      <div>
                        <h5 className="font-medium text-success mb-2">What they liked:</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm text-base-content/70">
                          {review.pros.map((pro, index) => (
                            <li key={index}>{pro}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {review.cons && review.cons.length > 0 && (
                      <div>
                        <h5 className="font-medium text-error mb-2">Areas for improvement:</h5>
                        <ul className="list-disc list-inside space-y-1 text-sm text-base-content/70">
                          {review.cons.map((con, index) => (
                            <li key={index}>{con}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {review.wouldRecommend !== null && (
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Would recommend:</span>
                        <span className={`badge badge-sm ${review.wouldRecommend ? 'badge-success' : 'badge-error'}`}>
                          {review.wouldRecommend ? 'Yes' : 'No'}
                        </span>
                      </div>
                    )}

                    {review.featured && (
                      <div className="badge badge-primary badge-sm">Featured Review</div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredFeedback.length === 0 && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-base-content/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h3 className="text-lg font-semibold text-base-content/70 mb-2">No reviews found</h3>
                <p className="text-base-content/50">
                  {filterRating !== 'all' || filterDate !== 'all' 
                    ? 'Try adjusting your filters' 
                    : 'No students have left reviews yet'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'surveys' && (
        <div className="bg-base-100 rounded-box border border-base-300 shadow-xl">
          <div className="p-6 border-b border-base-300">
            <h2 className="text-xl font-semibold">Survey Responses</h2>
            <p className="text-base-content/70 mt-1">Detailed feedback from course surveys</p>
          </div>
          <div className="p-6">
            {surveyResponses.length > 0 ? (
              <div className="space-y-4">
                {surveyResponses.map((response) => (
                  <div key={response.id} className="border border-base-300 rounded-box p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="avatar">
                        <div className="w-8 h-8 rounded-full">
                          {response.user.image ? (
                            <img src={response.user.image} alt={response.user.name} />
                          ) : (
                            <div className="bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xs">
                              {response.user.name?.charAt(0) || 'U'}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">{response.user.name}</div>
                        <div className="text-sm text-base-content/70">{formatDate(response.createdAt)}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {Object.entries(response.responses).map(([question, answer]) => (
                        <div key={question} className="text-sm">
                          <div className="font-medium text-base-content/80">{question}:</div>
                          <div className="text-base-content/70 ml-2">{answer}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-base-content/70">
                No survey responses available
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-base-100 rounded-box border border-base-300 shadow-xl">
            <div className="p-6 border-b border-base-300">
              <h2 className="text-xl font-semibold">Feedback Analytics</h2>
              <p className="text-base-content/70 mt-1">Insights from student feedback</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Common Themes</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Course Content Quality</span>
                      <span className="text-sm font-medium">87%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Instructor Effectiveness</span>
                      <span className="text-sm font-medium">82%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Course Organization</span>
                      <span className="text-sm font-medium">79%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Assignment Difficulty</span>
                      <span className="text-sm font-medium">74%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold">Improvement Areas</h3>
                  <div className="space-y-2 text-sm">
                    <div>• More interactive content requested</div>
                    <div>• Better mobile experience needed</div>
                    <div>• More practice questions desired</div>
                    <div>• Faster response times requested</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
