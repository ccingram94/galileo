'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function calculateProgress(enrollment, course) {
  if (!enrollment.progress) return 0;
  
  const totalLessons = course.units.reduce((sum, unit) => sum + unit.lessons.length, 0);
  if (totalLessons === 0) return 0;
  
  let completedLessons = 0;
  Object.entries(enrollment.progress).forEach(([key, value]) => {
    if (key.startsWith('lesson_') && value?.completed) {
      completedLessons++;
    }
  });
  
  return Math.round((completedLessons / totalLessons) * 100);
}

function calculateAverageScore(student, courseId) {
  const courseAttempts = [
    ...student.quizAttempts,
    ...student.examAttempts
  ];
  
  if (courseAttempts.length === 0) return 0;
  
  const totalScore = courseAttempts.reduce((sum, attempt) => sum + attempt.score, 0);
  return Math.round(totalScore / courseAttempts.length);
}

export default function CourseStudents({ course }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, completed, in_progress, not_started
  const [filterPayment, setFilterPayment] = useState('all'); // all, paid, pending, failed
  const [sortBy, setSortBy] = useState('enrolled_date'); // enrolled_date, progress, score, name
  const [sortOrder, setSortOrder] = useState('desc'); // asc, desc
  const [selectedStudents, setSelectedStudents] = useState(new Set());

  const processedStudents = useMemo(() => {
    return course.enrollments.map(enrollment => {
      const student = enrollment.user;
      const progress = calculateProgress(enrollment, course);
      const averageScore = calculateAverageScore(student, course.id);
      const totalAttempts = student.quizAttempts.length + student.examAttempts.length;
      
      let status = 'not_started';
      if (enrollment.completedAt) {
        status = 'completed';
      } else if (progress > 0 || totalAttempts > 0) {
        status = 'in_progress';
      }

      // Calculate last activity
      const allAttempts = [
        ...student.quizAttempts.map(a => ({ date: a.completedAt, type: 'quiz' })),
        ...student.examAttempts.map(a => ({ date: a.startedAt, type: 'exam' }))
      ].sort((a, b) => new Date(b.date) - new Date(a.date));

      const lastActivity = allAttempts.length > 0 ? allAttempts[0].date : enrollment.enrolledAt;

      return {
        id: student.id,
        enrollmentId: enrollment.id,
        name: student.name,
        email: student.email,
        image: student.image,
        enrolledAt: enrollment.enrolledAt,
        completedAt: enrollment.completedAt,
        paymentStatus: enrollment.paymentStatus,
        progress,
        averageScore,
        totalAttempts,
        status,
        lastActivity,
        quizAttempts: student.quizAttempts.length,
        examAttempts: student.examAttempts.length
      };
    });
  }, [course]);

  const filteredAndSortedStudents = useMemo(() => {
    let filtered = processedStudents;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(student => student.status === filterStatus);
    }

    // Apply payment filter
    if (filterPayment !== 'all') {
      filtered = filtered.filter(student => student.paymentStatus === filterPayment);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'progress':
          aValue = a.progress;
          bValue = b.progress;
          break;
        case 'score':
          aValue = a.averageScore;
          bValue = b.averageScore;
          break;
        case 'enrolled_date':
        default:
          aValue = new Date(a.enrolledAt);
          bValue = new Date(b.enrolledAt);
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [processedStudents, searchTerm, filterStatus, filterPayment, sortBy, sortOrder]);

  const handleSelectStudent = (studentId) => {
    const newSelection = new Set(selectedStudents);
    if (newSelection.has(studentId)) {
      newSelection.delete(studentId);
    } else {
      newSelection.add(studentId);
    }
    setSelectedStudents(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedStudents.size === filteredAndSortedStudents.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(filteredAndSortedStudents.map(s => s.id)));
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedStudents.size === 0) return;
    
    const selectedStudentIds = Array.from(selectedStudents);
    
    try {
      const response = await fetch(`/api/admin/courses/${course.id}/students/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action,
          studentIds: selectedStudentIds
        }),
      });

      if (response.ok) {
        // Refresh the page or update state
        window.location.reload();
      } else {
        const error = await response.json();
        alert(error.error || 'Bulk action failed');
      }
    } catch (error) {
      console.error('Error performing bulk action:', error);
      alert('Bulk action failed');
    }
  };

  // Calculate summary stats
  const summaryStats = {
    total: processedStudents.length,
    completed: processedStudents.filter(s => s.status === 'completed').length,
    inProgress: processedStudents.filter(s => s.status === 'in_progress').length,
    notStarted: processedStudents.filter(s => s.status === 'not_started').length,
    paid: processedStudents.filter(s => s.paymentStatus === 'PAID').length,
    averageProgress: processedStudents.reduce((sum, s) => sum + s.progress, 0) / processedStudents.length || 0
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Course Students</h1>
          <p className="text-base-content/70 mt-1">
            Manage students enrolled in "{course.title}"
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/courses/${course.id}/analytics`} className="btn btn-outline btn-sm gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            View Analytics
          </Link>
          <Link href={`/admin/courses/${course.id}/edit`} className="btn btn-ghost btn-sm gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Course
          </Link>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-base-100 rounded-box border border-base-300 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-base-content/70">Total Students</div>
              <div className="text-2xl font-bold text-primary">{summaryStats.total}</div>
            </div>
            <div className="w-10 h-10 bg-primary/10 rounded-btn flex items-center justify-center">
              <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-base-100 rounded-box border border-base-300 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-base-content/70">Completed</div>
              <div className="text-2xl font-bold text-success">{summaryStats.completed}</div>
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
              <div className="text-sm font-medium text-base-content/70">In Progress</div>
              <div className="text-2xl font-bold text-warning">{summaryStats.inProgress}</div>
            </div>
            <div className="w-10 h-10 bg-warning/10 rounded-btn flex items-center justify-center">
              <svg className="w-5 h-5 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-base-100 rounded-box border border-base-300 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium text-base-content/70">Avg. Progress</div>
              <div className="text-2xl font-bold text-info">{summaryStats.averageProgress.toFixed(1)}%</div>
            </div>
            <div className="w-10 h-10 bg-info/10 rounded-btn flex items-center justify-center">
              <svg className="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-base-100 rounded-box border border-base-300 p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="form-control">
              <input
                type="text"
                placeholder="Search students..."
                className="input input-bordered input-sm w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <select
              className="select select-bordered select-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
              <option value="not_started">Not Started</option>
            </select>

            <select
              className="select select-bordered select-sm"
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
            >
              <option value="all">All Payments</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
            </select>

            <select
              className="select select-bordered select-sm"
              value={`${sortBy}_${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('_');
                setSortBy(field);
                setSortOrder(order);
              }}
            >
              <option value="enrolled_date_desc">Newest First</option>
              <option value="enrolled_date_asc">Oldest First</option>
              <option value="name_asc">Name A-Z</option>
              <option value="name_desc">Name Z-A</option>
              <option value="progress_desc">Progress High-Low</option>
              <option value="progress_asc">Progress Low-High</option>
              <option value="score_desc">Score High-Low</option>
              <option value="score_asc">Score Low-High</option>
            </select>
          </div>

          <div className="flex gap-2">
            {selectedStudents.size > 0 && (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-primary btn-sm gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Actions ({selectedStudents.size})
                </label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 border border-base-300">
                  <li>
                    <button onClick={() => handleBulkAction('send_message')}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Send Message
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleBulkAction('reset_progress')}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Reset Progress
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleBulkAction('export_data')}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Export Data
                    </button>
                  </li>
                  <li className="border-t border-base-300 mt-2 pt-2">
                    <button 
                      onClick={() => handleBulkAction('unenroll')}
                      className="text-error"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Unenroll Selected
                    </button>
                  </li>
                </ul>
              </div>
            )}

            <button className="btn btn-outline btn-sm gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
              </svg>
              Export All
            </button>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-base-100 rounded-box border border-base-300 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead className="bg-base-200">
              <tr>
                <th>
                  <label>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={selectedStudents.size === filteredAndSortedStudents.length && filteredAndSortedStudents.length > 0}
                      onChange={handleSelectAll}
                    />
                  </label>
                </th>
                <th>Student</th>
                <th>Status</th>
                <th>Progress</th>
                <th>Avg. Score</th>
                <th>Activity</th>
                <th>Enrolled</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedStudents.map((student) => (
                <tr key={student.id} className="hover">
                  <td>
                    <label>
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={selectedStudents.has(student.id)}
                        onChange={() => handleSelectStudent(student.id)}
                      />
                    </label>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="w-10 h-10 rounded-full">
                          {student.image ? (
                            <img src={student.image} alt={student.name} />
                          ) : (
                            <div className="bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                              {student.name?.charAt(0) || 'U'}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{student.name}</div>
                        <div className="text-sm text-base-content/70">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={`badge ${
                      student.status === 'completed' ? 'badge-success' :
                      student.status === 'in_progress' ? 'badge-warning' :
                      'badge-ghost'
                    }`}>
                      {student.status === 'completed' ? 'Completed' :
                       student.status === 'in_progress' ? 'In Progress' :
                       'Not Started'}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-base-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            student.progress >= 80 ? 'bg-success' :
                            student.progress >= 50 ? 'bg-warning' :
                            'bg-error'
                          }`}
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{student.progress}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="text-center">
                      <div className={`text-lg font-bold ${
                        student.averageScore >= 90 ? 'text-success' :
                        student.averageScore >= 80 ? 'text-warning' :
                        student.averageScore >= 70 ? 'text-info' :
                        'text-error'
                      }`}>
                        {student.averageScore > 0 ? `${student.averageScore}%` : '-'}
                      </div>
                      <div className="text-xs text-base-content/70">
                        {student.totalAttempts} attempts
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm">
                      <div>{student.quizAttempts} quizzes</div>
                      <div className="text-base-content/70">{student.examAttempts} exams</div>
                      <div className="text-xs text-base-content/50 mt-1">
                        Last: {formatDate(student.lastActivity)}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm">
                      <div>{formatDate(student.enrolledAt)}</div>
                      {student.completedAt && (
                        <div className="text-success text-xs">
                          Completed: {formatDate(student.completedAt)}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className={`badge badge-sm ${
                      student.paymentStatus === 'PAID' ? 'badge-success' :
                      student.paymentStatus === 'PENDING' ? 'badge-warning' :
                      student.paymentStatus === 'FAILED' ? 'badge-error' :
                      'badge-ghost'
                    }`}>
                      {student.paymentStatus}
                    </div>
                  </td>
                  <td>
                    <div className="dropdown dropdown-left">
                      <label tabIndex={0} className="btn btn-ghost btn-xs">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </label>
                      <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 border border-base-300">
                        <li>
                          <Link href={`/admin/students/${student.id}/profile`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            View Profile
                          </Link>
                        </li>
                        <li>
                          <Link href={`/admin/students/${student.id}/progress`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            View Progress
                          </Link>
                        </li>
                        <li>
                          <Link href={`/admin/students/${student.id}/communication`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                            Send Message
                          </Link>
                        </li>
                        <li className="border-t border-base-300 mt-2 pt-2">
                          <button className="text-warning">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            Reset Progress
                          </button>
                        </li>
                        <li>
                          <button className="text-error">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Unenroll
                          </button>
                        </li>
                      </ul>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAndSortedStudents.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-base-content/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-base-content/70 mb-2">No students found</h3>
            <p className="text-base-content/50 mb-4">
              {searchTerm || filterStatus !== 'all' || filterPayment !== 'all' 
                ? 'Try adjusting your filters'
                : 'No students are enrolled in this course yet'}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
