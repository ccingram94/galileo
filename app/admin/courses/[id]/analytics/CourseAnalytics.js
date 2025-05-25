'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export default function CourseAnalytics({ course, recentEnrollments, completedEnrollments }) {
  const [timeFilter, setTimeFilter] = useState('30'); // days
  const [selectedMetric, setSelectedMetric] = useState('enrollments');

  // Calculate comprehensive analytics
  const analytics = useMemo(() => {
    const allEnrollments = course.enrollments;
    const paidEnrollments = allEnrollments.filter(e => e.paymentStatus === 'PAID');
    const totalRevenue = paidEnrollments.length * (course.price || 0);
    
    // Get all quiz and exam attempts
    const allQuizAttempts = course.units.flatMap(unit =>
      unit.lessons.flatMap(lesson =>
        lesson.lessonQuizzes.flatMap(quiz => 
          quiz.attempts.map(attempt => ({ 
            ...attempt, 
            type: 'quiz', 
            title: `${lesson.title} Quiz`,
            unitTitle: unit.title 
          }))
        )
      )
    );

    const allExamAttempts = course.units.flatMap(unit =>
      unit.unitExams.flatMap(exam =>
        exam.attempts.map(attempt => ({ 
          ...attempt, 
          type: 'exam', 
          title: exam.title,
          unitTitle: unit.title 
        }))
      )
    );

    const allAttempts = [...allQuizAttempts, ...allExamAttempts];
    
    // Calculate completion rate
    const completionRate = allEnrollments.length > 0 
      ? (completedEnrollments.length / allEnrollments.length) * 100 
      : 0;

    // Calculate average scores
    const scores = allAttempts.map(attempt => attempt.score);
    const averageScore = scores.length > 0 
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length 
      : 0;

    // Calculate engagement metrics
    const now = new Date();
    const filterDate = new Date(now.getTime() - parseInt(timeFilter) * 24 * 60 * 60 * 1000);
    
    const recentAttempts = allAttempts.filter(attempt => 
      new Date(attempt.completedAt || attempt.startedAt) >= filterDate
    );

    const engagedStudents = new Set(recentAttempts.map(attempt => attempt.userId)).size;
    const totalStudents = allEnrollments.length;
    const engagementRate = totalStudents > 0 ? (engagedStudents / totalStudents) * 100 : 0;

    // Calculate performance by unit
    const unitPerformance = course.units.map(unit => {
      const unitQuizAttempts = unit.lessons.flatMap(lesson =>
        lesson.lessonQuizzes.flatMap(quiz => quiz.attempts)
      );
      const unitExamAttempts = unit.unitExams.flatMap(exam => exam.attempts);
      const unitAttempts = [...unitQuizAttempts, ...unitExamAttempts];
      
      const unitScores = unitAttempts.map(attempt => attempt.score);
      const unitAverage = unitScores.length > 0 
        ? unitScores.reduce((sum, score) => sum + score, 0) / unitScores.length 
        : 0;

      return {
        id: unit.id,
        title: unit.title,
        averageScore: unitAverage,
        totalAttempts: unitAttempts.length,
        lessons: unit.lessons.length,
        exams: unit.unitExams.length
      };
    });

    // Calculate trends
    const enrollmentTrend = calculateTrend(allEnrollments.map(e => e.enrolledAt));
    const scoreTrend = calculateScoreTrend(allAttempts);

    return {
      totalEnrollments: allEnrollments.length,
      paidEnrollments: paidEnrollments.length,
      totalRevenue,
      completionRate,
      averageScore,
      engagementRate,
      engagedStudents,
      totalStudents,
      unitPerformance,
      enrollmentTrend,
      scoreTrend,
      recentAttempts: recentAttempts.length,
      allAttempts: allAttempts.length
    };
  }, [course, completedEnrollments, timeFilter]);

  function calculateTrend(dates) {
    if (dates.length < 2) return 0;
    
    const now = new Date();
    const halfPeriod = parseInt(timeFilter) / 2;
    const midDate = new Date(now.getTime() - halfPeriod * 24 * 60 * 60 * 1000);
    
    const recentCount = dates.filter(date => new Date(date) >= midDate).length;
    const earlierCount = dates.filter(date => {
      const d = new Date(date);
      return d < midDate && d >= new Date(now.getTime() - parseInt(timeFilter) * 24 * 60 * 60 * 1000);
    }).length;
    
    if (earlierCount === 0) return recentCount > 0 ? 100 : 0;
    return ((recentCount - earlierCount) / earlierCount) * 100;
  }

  function calculateScoreTrend(attempts) {
    if (attempts.length < 2) return 0;
    
    const now = new Date();
    const halfPeriod = parseInt(timeFilter) / 2;
    const midDate = new Date(now.getTime() - halfPeriod * 24 * 60 * 60 * 1000);
    
    const recentAttempts = attempts.filter(attempt => 
      new Date(attempt.completedAt || attempt.startedAt) >= midDate
    );
    const earlierAttempts = attempts.filter(attempt => {
      const d = new Date(attempt.completedAt || attempt.startedAt);
      return d < midDate && d >= new Date(now.getTime() - parseInt(timeFilter) * 24 * 60 * 60 * 1000);
    });
    
    if (earlierAttempts.length === 0) return 0;
    
    const recentAvg = recentAttempts.reduce((sum, att) => sum + att.score, 0) / recentAttempts.length;
    const earlierAvg = earlierAttempts.reduce((sum, att) => sum + att.score, 0) / earlierAttempts.length;
    
    return ((recentAvg - earlierAvg) / earlierAvg) * 100;
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Course Analytics</h1>
          <p className="text-base-content/70 mt-1">
            Detailed performance metrics for "{course.title}"
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="select select-bordered select-sm"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <Link href={`/admin/courses/${course.id}/edit`} className="btn btn-ghost btn-sm gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Course
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-base-100 rounded-box border border-base-300 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/70 text-sm font-medium">Total Enrollments</p>
              <p className="text-3xl font-bold text-primary">{analytics.totalEnrollments}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-btn flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-1 text-xs">
              <span className={`badge badge-sm ${analytics.enrollmentTrend >= 0 ? 'badge-success' : 'badge-error'}`}>
                {analytics.enrollmentTrend >= 0 ? '+' : ''}{analytics.enrollmentTrend.toFixed(1)}%
              </span>
              <span className="text-base-content/60">vs previous period</span>
            </div>
          </div>
        </div>

        <div className="bg-base-100 rounded-box border border-base-300 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/70 text-sm font-medium">Completion Rate</p>
              <p className="text-3xl font-bold text-success">{analytics.completionRate.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-btn flex items-center justify-center">
              <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xs text-base-content/60">
              {completedEnrollments.length} of {analytics.totalEnrollments} students
            </div>
          </div>
        </div>

        <div className="bg-base-100 rounded-box border border-base-300 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/70 text-sm font-medium">Average Score</p>
              <p className="text-3xl font-bold text-secondary">{analytics.averageScore.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-secondary/10 rounded-btn flex items-center justify-center">
              <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-1 text-xs">
              <span className={`badge badge-sm ${analytics.scoreTrend >= 0 ? 'badge-success' : 'badge-error'}`}>
                {analytics.scoreTrend >= 0 ? '+' : ''}{analytics.scoreTrend.toFixed(1)}%
              </span>
              <span className="text-base-content/60">vs previous period</span>
            </div>
          </div>
        </div>

        <div className="bg-base-100 rounded-box border border-base-300 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/70 text-sm font-medium">Revenue</p>
              <p className="text-3xl font-bold text-accent">{formatCurrency(analytics.totalRevenue)}</p>
            </div>
            <div className="w-12 h-12 bg-accent/10 rounded-btn flex items-center justify-center">
              <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xs text-base-content/60">
              {analytics.paidEnrollments} paid enrollments
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-base-100 rounded-box border border-base-300 shadow-xl">
          <div className="p-6 border-b border-base-300">
            <h2 className="text-xl font-semibold">Student Engagement</h2>
            <p className="text-base-content/70 mt-1">Activity levels in the selected time period</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-info">{analytics.engagementRate.toFixed(1)}%</div>
                <div className="text-sm text-base-content/70">Active Students</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">{analytics.engagedStudents}</div>
                <div className="text-sm text-base-content/70">of {analytics.totalStudents} total</div>
              </div>
            </div>
            
            <div className="w-full bg-base-200 rounded-full h-3">
              <div 
                className="bg-info h-3 rounded-full transition-all duration-500"
                style={{ width: `${analytics.engagementRate}%` }}
              ></div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center p-4 bg-base-200/50 rounded-box">
                <div className="text-xl font-bold text-primary">{analytics.recentAttempts}</div>
                <div className="text-sm text-base-content/70">Recent Attempts</div>
              </div>
              <div className="text-center p-4 bg-base-200/50 rounded-box">
                <div className="text-xl font-bold text-secondary">{analytics.allAttempts}</div>
                <div className="text-sm text-base-content/70">Total Attempts</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-base-100 rounded-box border border-base-300 shadow-xl">
          <div className="p-6 border-b border-base-300">
            <h2 className="text-xl font-semibold">Recent Enrollments</h2>
            <p className="text-base-content/70 mt-1">Latest students to join this course</p>
          </div>
          <div className="p-6">
            {recentEnrollments.length > 0 ? (
              <div className="space-y-4">
                {recentEnrollments.slice(0, 5).map((enrollment) => (
                  <div key={enrollment.id} className="flex items-center justify-between py-3 border-b border-base-300 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          {enrollment.user.image ? (
                            <img src={enrollment.user.image} alt={enrollment.user.name} className="rounded-full" />
                          ) : (
                            <span className="text-sm font-bold text-primary">
                              {enrollment.user.name?.charAt(0) || 'U'}
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-sm">{enrollment.user.name}</div>
                        <div className="text-xs text-base-content/70">{enrollment.user.email}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-base-content/70">{formatDate(enrollment.enrolledAt)}</div>
                      <div className={`badge badge-xs ${enrollment.paymentStatus === 'PAID' ? 'badge-success' : 'badge-warning'}`}>
                        {enrollment.paymentStatus}
                      </div>
                    </div>
                  </div>
                ))}
                
                {recentEnrollments.length > 5 && (
                  <div className="text-center pt-4">
                    <Link href={`/admin/courses/${course.id}/students`} className="btn btn-ghost btn-sm">
                      View All Students
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-base-content/70">
                No recent enrollments in the selected time period
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Unit Performance */}
      <div className="bg-base-100 rounded-box border border-base-300 shadow-xl">
        <div className="p-6 border-b border-base-300">
          <h2 className="text-xl font-semibold">Unit Performance</h2>
          <p className="text-base-content/70 mt-1">Average scores and engagement by unit</p>
        </div>
        <div className="p-6">
          {analytics.unitPerformance.length > 0 ? (
            <div className="space-y-4">
              {analytics.unitPerformance.map((unit, index) => (
                <div key={unit.id} className="p-4 bg-base-200/50 rounded-box">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-btn flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{index + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{unit.title}</h3>
                        <div className="text-sm text-base-content/70">
                          {unit.lessons} lessons • {unit.exams} exams
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold">{unit.averageScore.toFixed(1)}%</div>
                      <div className="text-sm text-base-content/70">Average Score</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="w-full bg-base-200 rounded-full h-2 mr-4">
                      <div 
                        className={`h-2 rounded-full transition-all duration-500 ${
                          unit.averageScore >= 80 ? 'bg-success' :
                          unit.averageScore >= 70 ? 'bg-warning' :
                          'bg-error'
                        }`}
                        style={{ width: `${Math.min(unit.averageScore, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-sm text-base-content/70 whitespace-nowrap">
                      {unit.totalAttempts} attempts
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-base-content/70">
              No unit performance data available yet
            </div>
          )}
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-base-100 rounded-box border border-base-300 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Export Analytics</h3>
            <p className="text-sm text-base-content/70 mt-1">Download detailed reports and data</p>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-outline btn-sm gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              Export CSV
            </button>
            <button className="btn btn-outline btn-sm gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Generate Report
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
