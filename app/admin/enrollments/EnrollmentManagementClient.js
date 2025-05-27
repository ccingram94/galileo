'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function EnrollmentManagementClient({ enrollments: initialEnrollments }) {
  const [enrollments, setEnrollments] = useState(initialEnrollments);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedEnrollments, setSelectedEnrollments] = useState([]);
  const [sortBy, setSortBy] = useState('enrolledAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Filter and search enrollments
  const filteredEnrollments = enrollments.filter(enrollment => {
    // Search filter
    const matchesSearch = 
      enrollment.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      enrollment.course.title?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    // Status filter
    const passesStatusFilter = (() => {
      switch (selectedFilter) {
        case 'completed':
          return enrollment.completedAt !== null;
        case 'active':
          return enrollment.completedAt === null;
        case 'recent':
          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          return new Date(enrollment.enrolledAt) > sevenDaysAgo;
        default:
          return true;
      }
    })();

    if (!passesStatusFilter) return false;

    // Payment filter
    switch (paymentFilter) {
      case 'paid':
        return enrollment.paymentStatus === 'PAID';
      case 'pending':
        return enrollment.paymentStatus === 'PENDING';
      case 'failed':
        return enrollment.paymentStatus === 'FAILED';
      case 'free':
        return enrollment.course.isFree;
      default:
        return true;
    }
  });

  // Sort enrollments
  const sortedEnrollments = [...filteredEnrollments].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'student':
        aValue = a.user.name?.toLowerCase() || a.user.email?.toLowerCase() || '';
        bValue = b.user.name?.toLowerCase() || b.user.email?.toLowerCase() || '';
        break;
      case 'course':
        aValue = a.course.title?.toLowerCase() || '';
        bValue = b.course.title?.toLowerCase() || '';
        break;
      case 'payment':
        aValue = a.paymentStatus;
        bValue = b.paymentStatus;
        break;
      case 'enrolledAt':
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

  const handleSelectAll = () => {
    if (selectedEnrollments.length === sortedEnrollments.length) {
      setSelectedEnrollments([]);
    } else {
      setSelectedEnrollments(sortedEnrollments.map(e => e.id));
    }
  };

  const handleSelectEnrollment = (enrollmentId) => {
    setSelectedEnrollments(prev => 
      prev.includes(enrollmentId) 
        ? prev.filter(id => id !== enrollmentId)
        : [...prev, enrollmentId]
    );
  };

  const getPaymentStatusBadge = (status, isFree) => {
    if (isFree) {
      return <div className="badge badge-info badge-sm">Free</div>;
    }

    switch (status) {
      case 'PAID':
        return <div className="badge badge-success badge-sm">Paid</div>;
      case 'PENDING':
        return <div className="badge badge-warning badge-sm">Pending</div>;
      case 'FAILED':
        return <div className="badge badge-error badge-sm">Failed</div>;
      case 'REFUNDED':
        return <div className="badge badge-ghost badge-sm">Refunded</div>;
      default:
        return <div className="badge badge-neutral badge-sm">{status}</div>;
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="p-4 border-b border-base-300">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="form-control flex-1">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Search by student, email, or course..."
                  className="input input-bordered input-sm w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-square btn-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select 
              className="select select-bordered select-sm"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="recent">Recent</option>
            </select>

            <select 
              className="select select-bordered select-sm"
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="free">Free</option>
            </select>
          </div>
        </div>

        {selectedEnrollments.length > 0 && (
          <div className="flex items-center justify-between mt-4 p-3 bg-primary/10 rounded-btn">
            <span className="text-sm font-medium">
              {selectedEnrollments.length} enrollment{selectedEnrollments.length !== 1 ? 's' : ''} selected
            </span>
            <div className="flex gap-2">
              <button className="btn btn-error btn-xs">
                Cancel Enrollments
              </button>
              <button className="btn btn-success btn-xs">
                Mark as Paid
              </button>
              <button className="btn btn-ghost btn-xs" onClick={() => setSelectedEnrollments([])}>
                Clear Selection
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enrollments Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-base-200">
            <tr>
              <th>
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={selectedEnrollments.length === sortedEnrollments.length && sortedEnrollments.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th>
                <button 
                  className="flex items-center gap-1 hover:text-primary"
                  onClick={() => {
                    setSortBy('student');
                    setSortOrder(sortBy === 'student' && sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  Student
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
              </th>
              <th>
                <button 
                  className="flex items-center gap-1 hover:text-primary"
                  onClick={() => {
                    setSortBy('course');
                    setSortOrder(sortBy === 'course' && sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  Course
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
              </th>
              <th>Payment Status</th>
              <th>Progress</th>
              <th>Enrolled Date</th>
              <th>Completion</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedEnrollments.map((enrollment) => {
              // Calculate progress (if progress data exists)
              const progressPercent = enrollment.progress ? 
                (typeof enrollment.progress === 'object' && enrollment.progress.percent) || 0 : 0;

              return (
                <tr key={enrollment.id} className="hover">
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={selectedEnrollments.includes(enrollment.id)}
                      onChange={() => handleSelectEnrollment(enrollment.id)}
                    />
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-8">
                          <span className="text-xs">
                            {(enrollment.user.name || enrollment.user.email || 'U').charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="font-medium text-sm">
                          {enrollment.user.name || 'No name'}
                        </div>
                        <div className="text-xs text-base-content/70">
                          {enrollment.user.email}
                        </div>
                        {enrollment.user.emailVerified ? (
                          <div className="badge badge-success badge-xs mt-1">Verified</div>
                        ) : (
                          <div className="badge badge-warning badge-xs mt-1">Unverified</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      {enrollment.course.imageUrl && (
                        <div className="w-10 h-10 bg-base-200 rounded-btn overflow-hidden">
                          <img 
                            src={enrollment.course.imageUrl} 
                            alt={enrollment.course.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <div className="font-medium text-sm">
                          {enrollment.course.title}
                        </div>
                        <div className="text-xs text-base-content/70">
                          {enrollment.course.apExamType}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {enrollment.course.isPublished ? (
                            <div className="badge badge-success badge-xs">Published</div>
                          ) : (
                            <div className="badge badge-warning badge-xs">Draft</div>
                          )}
                          {enrollment.course.isFree ? (
                            <div className="badge badge-info badge-xs">Free</div>
                          ) : (
                            <div className="badge badge-accent badge-xs">
                              {formatCurrency(enrollment.course.price || 0)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {getPaymentStatusBadge(enrollment.paymentStatus, enrollment.course.isFree)}
                    {enrollment.paymentId && (
                      <div className="text-xs text-base-content/50 mt-1">
                        ID: {enrollment.paymentId.slice(-8)}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-base-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium">{progressPercent}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm text-base-content/70">
                      {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-base-content/50">
                      {new Date(enrollment.enrolledAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td>
                    {enrollment.completedAt ? (
                      <div>
                        <div className="badge badge-success badge-sm">Completed</div>
                        <div className="text-xs text-base-content/70 mt-1">
                          {new Date(enrollment.completedAt).toLocaleDateString()}
                        </div>
                      </div>
                    ) : (
                      <div className="badge badge-ghost badge-sm">In Progress</div>
                    )}
                  </td>
                  <td>
                    <div className="flex gap-1">
                      <div className="dropdown dropdown-left">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-xs">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </div>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-48 border border-base-300">
                          <li>
                            <Link href={`/admin/students/${enrollment.user.id}`}>
                              View Student
                            </Link>
                          </li>
                          <li>
                            <Link href={`/admin/courses/${enrollment.course.id}`}>
                              View Course
                            </Link>
                          </li>
                          <li>
                            <Link href={`/admin/enrollments/${enrollment.id}`}>
                              View Details
                            </Link>
                          </li>
                          <div className="divider my-0"></div>
                          {enrollment.paymentStatus === 'PENDING' && (
                            <li><button className="text-success">Mark as Paid</button></li>
                          )}
                          {enrollment.paymentStatus === 'PAID' && (
                            <li><button className="text-warning">Issue Refund</button></li>
                          )}
                          <li><button>Reset Progress</button></li>
                          <li><button>Send Message</button></li>
                          <div className="divider my-0"></div>
                          <li><button className="text-error">Cancel Enrollment</button></li>
                        </ul>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {sortedEnrollments.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-base-content/70 mb-2">
            {searchTerm || selectedFilter !== 'all' || paymentFilter !== 'all' 
              ? 'No enrollments found' 
              : 'No enrollments yet'
            }
          </h3>
          <p className="text-sm text-base-content/50 mb-4">
            {searchTerm || selectedFilter !== 'all' || paymentFilter !== 'all'
              ? 'Try adjusting your search or filter criteria' 
              : 'Enrollments will appear here when students sign up for courses'
            }
          </p>
          {(searchTerm || selectedFilter !== 'all' || paymentFilter !== 'all') && (
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedFilter('all');
                setPaymentFilter('all');
              }}
              className="btn btn-ghost btn-sm"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {sortedEnrollments.length > 0 && (
        <div className="flex items-center justify-between p-4 border-t border-base-300">
          <div className="text-sm text-base-content/70">
            Showing {sortedEnrollments.length} of {enrollments.length} enrollments
          </div>
          <div className="flex gap-2">
            <button className="btn btn-outline btn-sm" disabled>
              Previous
            </button>
            <button className="btn btn-outline btn-sm" disabled>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
