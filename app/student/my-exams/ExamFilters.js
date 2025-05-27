'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ExamFilters({ courseOptions }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const statusFilter = searchParams.get('status') || 'all';
  const courseFilter = searchParams.get('course') || 'all';

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'all') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/student/my-exams?${params.toString()}`);
  };

  return (
    <div className="bg-base-100 rounded-box border border-base-300 shadow-lg mb-6">
      <div className="p-6">
        <h2 className="text-lg font-bold mb-4">Filter Exams</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Status</span>
            </label>
            <select 
              className="select select-bordered"
              value={statusFilter}
              onChange={(e) => updateFilter('status', e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="available">Available</option>
              <option value="in-progress">In Progress</option>
              <option value="retake">Retake Available</option>
              <option value="passed">Passed</option>
              <option value="failed">Failed</option>
              <option value="upcoming">Upcoming</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          {/* Course Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Course</span>
            </label>
            <select 
              className="select select-bordered"
              value={courseFilter}
              onChange={(e) => updateFilter('course', e.target.value)}
            >
              <option value="all">All Courses</option>
              {courseOptions.map(course => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
          </div>
        </div>
        
        {(statusFilter !== 'all' || courseFilter !== 'all') && (
          <div className="mt-4">
            <Link 
              href="/student/my-exams"
              className="btn btn-ghost btn-sm gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear Filters
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
