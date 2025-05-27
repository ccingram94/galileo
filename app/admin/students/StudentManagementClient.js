'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function StudentManagementClient({ students: initialStudents }) {
  const [students, setStudents] = useState(initialStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Filter and search students
  const filteredStudents = students.filter(student => {
    // Search filter
    const matchesSearch = 
      student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    // Status filter
    switch (selectedFilter) {
      case 'active':
        return student.enrollments.some(e => e.paymentStatus === 'PAID' || e.course.isFree);
      case 'recent':
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return new Date(student.createdAt) > sevenDaysAgo;
      case 'no-enrollments':
        return student.enrollments.length === 0;
      default:
        return true;
    }
  });

  // Sort students
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    let aValue, bValue;

    switch (sortBy) {
      case 'name':
        aValue = a.name?.toLowerCase() || '';
        bValue = b.name?.toLowerCase() || '';
        break;
      case 'email':
        aValue = a.email?.toLowerCase() || '';
        bValue = b.email?.toLowerCase() || '';
        break;
      case 'enrollments':
        aValue = a.enrollments.length;
        bValue = b.enrollments.length;
        break;
      case 'createdAt':
      default:
        aValue = new Date(a.createdAt);
        bValue = new Date(b.createdAt);
        break;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const handleSelectAll = () => {
    if (selectedStudents.length === sortedStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(sortedStudents.map(s => s.id));
    }
  };

  const handleSelectStudent = (studentId) => {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const calculateStudentProgress = (student) => {
    // Use the correct field names
    const totalAttempts = (student.quizAttempts?.length || 0) + (student.examAttempts?.length || 0);
    const passedAttempts = [
      ...(student.quizAttempts?.filter(a => a.passed) || []),
      ...(student.examAttempts?.filter(a => a.passed) || [])
    ].length;
    
    return totalAttempts > 0 ? Math.round((passedAttempts / totalAttempts) * 100) : 0;
  };

  const getStudentRevenue = (student) => {
    return student.enrollments
      .filter(e => e.paymentStatus === 'PAID')
      .reduce((sum, e) => sum + (e.course.price || 0), 0);
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="p-4 border-b border-base-300">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="form-control">
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Search students..."
                  className="input input-bordered input-sm"
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

            <select 
              className="select select-bordered select-sm"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">All Students</option>
              <option value="active">Active Only</option>
              <option value="recent">New This Week</option>
              <option value="no-enrollments">No Enrollments</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            {selectedStudents.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-base-content/70">
                  {selectedStudents.length} selected
                </span>
                <button className="btn btn-error btn-sm">
                  Bulk Actions
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-base-200">
            <tr>
              <th>
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={selectedStudents.length === sortedStudents.length && sortedStudents.length > 0}
                  onChange={handleSelectAll}
                />
              </th>
              <th>
                <button 
                  className="flex items-center gap-1 hover:text-primary"
                  onClick={() => {
                    setSortBy('name');
                    setSortOrder(sortBy === 'name' && sortOrder === 'asc' ? 'desc' : 'asc');
                  }}
                >
                  Student
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
              </th>
              <th>Enrollments</th>
              <th>Progress</th>
              <th>Revenue</th>
              <th>Join Date</th>
              <th>Last Activity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((student) => {
              const progress = calculateStudentProgress(student);
              const revenue = getStudentRevenue(student);
              const activeEnrollments = student.enrollments.filter(e => 
                e.paymentStatus === 'PAID' || e.course.isFree
              ).length;

              return (
                <tr key={student.id} className="hover">
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm"
                      checked={selectedStudents.includes(student.id)}
                      onChange={() => handleSelectStudent(student.id)}
                    />
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar placeholder">
                        <div className="bg-neutral text-neutral-content rounded-full w-10">
                          <span className="text-sm">
                            {(student.name || student.email || 'U').charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{student.name || 'No name'}</div>
                        <div className="text-sm text-base-content/70">{student.email}</div>
                        {student.emailVerified ? (
                          <div className="badge badge-success badge-xs">Verified</div>
                        ) : (
                          <div className="badge badge-warning badge-xs">Unverified</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="text-center">
                      <div className="text-lg font-bold">{student.enrollments.length}</div>
                      <div className="text-xs text-base-content/70">
                        {activeEnrollments} active
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-base-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{progress}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="text-center">
                      <div className="font-semibold">
                        ${revenue.toFixed(2)}
                      </div>
                      <div className="text-xs text-base-content/70">total</div>
                    </div>
                  </td>
                  <td>
                    <div className="text-sm text-base-content/70">
                      {new Date(student.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td>
                    <div className="text-sm text-base-content/70">
                      {student.lastLogin 
                        ? new Date(student.lastLogin).toLocaleDateString()
                        : 'Never'
                      }
                    </div>
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
                            <Link href={`/admin/students/${student.id}`}>
                              View Profile
                            </Link>
                          </li>
                          <li>
                            <Link href={`/admin/students/${student.id}/enrollments`}>
                              Manage Enrollments
                            </Link>
                          </li>
                          <li>
                            <Link href={`/admin/students/${student.id}/progress`}>
                              View Progress
                            </Link>
                          </li>
                          <div className="divider my-0"></div>
                          <li><button>Send Message</button></li>
                          <li><button>Reset Password</button></li>
                          <li><button className="text-warning">Suspend Account</button></li>
                          <li><button className="text-error">Delete Account</button></li>
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
      {sortedStudents.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-base-content/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-base-content/70 mb-2">
            {searchTerm ? 'No students found' : 'No students yet'}
          </h3>
          <p className="text-sm text-base-content/50 mb-4">
            {searchTerm 
              ? 'Try adjusting your search or filter criteria' 
              : 'Students will appear here once they sign up for your courses'
            }
          </p>
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="btn btn-ghost btn-sm"
            >
              Clear Search
            </button>
          )}
        </div>
      )}

      {/* Pagination */}
      {sortedStudents.length > 0 && (
        <div className="flex items-center justify-between p-4 border-t border-base-300">
          <div className="text-sm text-base-content/70">
            Showing {sortedStudents.length} of {students.length} students
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
