'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AnalyticsClient({ data }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [chartType, setChartType] = useState('line');

  const { summary, coursePerformance, trends, assessmentData } = data;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="bg-base-100 rounded-box border border-base-300 shadow-xl">
        <div className="tabs tabs-bordered p-4 pb-0">
          <button 
            className={`tab tab-bordered ${activeTab === 'overview' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab tab-bordered ${activeTab === 'courses' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            Course Performance
          </button>
          <button 
            className={`tab tab-bordered ${activeTab === 'students' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            Student Analytics
          </button>
          <button 
            className={`tab tab-bordered ${activeTab === 'assessments' ? 'tab-active' : ''}`}
            onClick={() => setActiveTab('assessments')}
          >
            Assessment Performance
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <OverviewTab 
              summary={summary} 
              trends={trends}
              chartType={chartType}
              setChartType={setChartType}
            />
          )}
          
          {activeTab === 'courses' && (
            <CoursePerformanceTab coursePerformance={coursePerformance} />
          )}
          
          {activeTab === 'students' && (
            <StudentAnalyticsTab 
              summary={summary} 
              trends={trends}
            />
          )}
          
          {activeTab === 'assessments' && (
            <AssessmentPerformanceTab 
              assessmentData={assessmentData}
              summary={summary}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ summary, trends, chartType, setChartType }) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">Platform Overview</h3>
        <div className="flex gap-2">
          <button 
            className={`btn btn-sm ${chartType === 'line' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setChartType('line')}
          >
            Line Chart
          </button>
          <button 
            className={`btn btn-sm ${chartType === 'bar' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setChartType('bar')}
          >
            Bar Chart
          </button>
        </div>
      </div>

      {/* Growth Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trends Chart Placeholder */}
        <div className="bg-base-200/50 rounded-box p-6">
          <h4 className="font-medium mb-4">Enrollment Trends (Last 30 Days)</h4>
          <div className="h-48 bg-base-300/30 rounded-btn flex items-center justify-center">
            <div className="text-center">
              <svg className="w-12 h-12 text-base-content/30 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p className="text-sm text-base-content/50">Chart visualization would go here</p>
              <p className="text-xs text-base-content/30 mt-1">
                Total: {trends.enrollments.reduce((sum, day) => sum + day.count, 0)} enrollments
              </p>
            </div>
          </div>
        </div>

        {/* Revenue Trends Chart Placeholder */}
        <div className="bg-base-200/50 rounded-box p-6">
          <h4 className="font-medium mb-4">Revenue Trends (Last 30 Days)</h4>
          <div className="h-48 bg-base-300/30 rounded-btn flex items-center justify-center">
            <div className="text-center">
              <svg className="w-12 h-12 text-base-content/30 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <p className="text-sm text-base-content/50">Revenue chart would go here</p>
              <p className="text-xs text-base-content/30 mt-1">
                Total: ${trends.enrollments.reduce((sum, day) => sum + day.revenue, 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-base-200/50 rounded-box p-4 text-center">
          <div className="text-2xl font-bold text-primary">{summary.publishedCourses}</div>
          <div className="text-sm text-base-content/70">Published Courses</div>
        </div>
        <div className="bg-base-200/50 rounded-box p-4 text-center">
          <div className="text-2xl font-bold text-info">{summary.averageEnrollmentPerCourse}</div>
          <div className="text-sm text-base-content/70">Avg. Enrollments</div>
        </div>
        <div className="bg-base-200/50 rounded-box p-4 text-center">
          <div className="text-2xl font-bold text-success">{summary.completionRate}%</div>
          <div className="text-sm text-base-content/70">Completion Rate</div>
        </div>
        <div className="bg-base-200/50 rounded-box p-4 text-center">
          <div className="text-2xl font-bold text-warning">{summary.newStudentsThisWeek}</div>
          <div className="text-sm text-base-content/70">New This Week</div>
        </div>
      </div>
    </div>
  );
}

function CoursePerformanceTab({ coursePerformance }) {
  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg">Top Performing Courses</h3>
      
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-base-200">
            <tr>
              <th>Course</th>
              <th>Enrollments</th>
              <th>Revenue</th>
              <th>Completion Rate</th>
              <th>Content</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coursePerformance.map((course) => (
              <tr key={course.id} className="hover">
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-btn flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">{course.title}</div>
                      <div className="text-sm text-base-content/70">{course.apExamType}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="text-center">
                    <div className="text-lg font-bold">{course.enrollmentCount}</div>
                    <div className="text-xs text-base-content/70">students</div>
                  </div>
                </td>
                <td>
                  <div className="text-center">
                    <div className="font-semibold">${course.revenue.toFixed(2)}</div>
                    <div className="text-xs text-base-content/70">total</div>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-base-200 rounded-full h-2">
                      <div
                        className="bg-success h-2 rounded-full"
                        style={{ width: `${course.completionRate}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{course.completionRate}%</span>
                  </div>
                </td>
                <td>
                  <div className="text-sm space-y-1">
                    <div>{course.totalContent} units</div>
                    <div className="text-xs text-base-content/70">
                      {course.totalQuizzes} quizzes, {course.totalExams} exams
                    </div>
                  </div>
                </td>
                <td>
                  <Link href={`/admin/courses/${course.id}`} className="btn btn-ghost btn-sm">
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {coursePerformance.length === 0 && (
        <div className="text-center py-12 bg-base-200/30 rounded-box">
          <p className="text-base-content/70">No course performance data available</p>
        </div>
      )}
    </div>
  );
}

function StudentAnalyticsTab({ summary, trends }) {
  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg">Student Analytics</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Student Growth */}
        <div className="bg-base-200/50 rounded-box p-6">
          <h4 className="font-medium mb-4">Student Growth</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-base-content/70">Total Students:</span>
              <span className="font-semibold">{summary.totalStudents}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base-content/70">Active Students:</span>
              <span className="font-semibold text-success">{summary.activeStudents}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base-content/70">This Month:</span>
              <span className="font-semibold text-info">+{summary.newStudentsThisMonth}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base-content/70">This Week:</span>
              <span className="font-semibold text-warning">+{summary.newStudentsThisWeek}</span>
            </div>
          </div>
        </div>

        {/* Engagement Stats */}
        <div className="bg-base-200/50 rounded-box p-6">
          <h4 className="font-medium mb-4">Engagement</h4>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Activity Rate</span>
                <span className="text-sm font-medium">
                  {Math.round((summary.activeStudents / summary.totalStudents) * 100)}%
                </span>
              </div>
              <div className="w-full bg-base-200 rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${Math.round((summary.activeStudents / summary.totalStudents) * 100)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm">Completion Rate</span>
                <span className="text-sm font-medium">{summary.completionRate}%</span>
              </div>
              <div className="w-full bg-base-200 rounded-full h-2">
                <div
                  className="bg-success h-2 rounded-full"
                  style={{ width: `${summary.completionRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Student Signup Trends */}
        <div className="bg-base-200/50 rounded-box p-6">
          <h4 className="font-medium mb-4">Signup Trends</h4>
          <div className="h-32 bg-base-300/30 rounded-btn flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold">
                {trends.studentSignups.reduce((sum, day) => sum + day.count, 0)}
              </div>
              <div className="text-xs text-base-content/70">Total signups (30 days)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AssessmentPerformanceTab({ assessmentData, summary }) {
  const { quizAttempts, examAttempts } = assessmentData;

  return (
    <div className="space-y-6">
      <h3 className="font-semibold text-lg">Assessment Performance</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quiz Performance */}
        <div className="bg-base-200/50 rounded-box p-6">
          <h4 className="font-medium mb-4">Quiz Performance</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Pass Rate</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-base-200 rounded-full h-2">
                  <div
                    className="bg-success h-2 rounded-full"
                    style={{ width: `${summary.quizPassRate}%` }}
                  ></div>
                </div>
                <span className="font-semibold">{summary.quizPassRate}%</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-success">
                  {quizAttempts.filter(a => a.passed).length}
                </div>
                <div className="text-xs text-base-content/70">Passed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-error">
                  {quizAttempts.filter(a => !a.passed).length}
                </div>
                <div className="text-xs text-base-content/70">Failed</div>
              </div>
            </div>
          </div>
        </div>

        {/* Exam Performance */}
        <div className="bg-base-200/50 rounded-box p-6">
          <h4 className="font-medium mb-4">Exam Performance</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Pass Rate</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-base-200 rounded-full h-2">
                  <div
                    className="bg-success h-2 rounded-full"
                    style={{ width: `${summary.examPassRate}%` }}
                  ></div>
                </div>
                <span className="font-semibold">{summary.examPassRate}%</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-success">
                  {examAttempts.filter(a => a.passed).length}
                </div>
                <div className="text-xs text-base-content/70">Passed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-error">
                  {examAttempts.filter(a => !a.passed).length}
                </div>
                <div className="text-xs text-base-content/70">Failed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Assessment Activity */}
      <div className="bg-base-100 rounded-box border border-base-300 overflow-hidden">
        <div className="p-4 border-b border-base-300">
          <h4 className="font-medium">Recent Assessment Activity</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Type</th>
                <th>Course</th>
                <th>Score</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {[...quizAttempts.slice(0, 5), ...examAttempts.slice(0, 5)]
                .sort((a, b) => new Date(b.completedAt || b.startedAt) - new Date(a.completedAt || a.startedAt))
                .slice(0, 10)
                .map((attempt, index) => (
                <tr key={index}>
                  <td>
                    <div className={`badge ${attempt.lessonQuiz ? 'badge-info' : 'badge-secondary'} badge-sm`}>
                      {attempt.lessonQuiz ? 'Quiz' : 'Exam'}
                    </div>
                  </td>
                  <td>
                    <div className="text-sm">
                      {attempt.lessonQuiz 
                        ? attempt.lessonQuiz.lesson.unit.course.title 
                        : attempt.unitExam.unit.course.title
                      }
                    </div>
                  </td>
                  <td>
                    <span className="font-medium">
                      {Math.round(attempt.score || 0)}%
                    </span>
                  </td>
                  <td>
                    <div className={`badge ${attempt.passed ? 'badge-success' : 'badge-error'} badge-sm`}>
                      {attempt.passed ? 'Passed' : 'Failed'}
                    </div>
                  </td>
                  <td>
                    <div className="text-sm text-base-content/70">
                      {new Date(attempt.completedAt || attempt.startedAt).toLocaleDateString()}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
