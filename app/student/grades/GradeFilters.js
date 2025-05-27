'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function GradeFilters({ courseOptions }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const courseFilter = searchParams.get('course') || 'all';
  const typeFilter = searchParams.get('type') || 'all';
  const timeFilter = searchParams.get('time') || 'all';

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'all') {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`/student/grades?${params.toString()}`);
  };

  return (
    <div className="bg-base-100 rounded-box border border-base-300 shadow-lg mb-6">
      <div className="p-6">
        <h2 className="text-lg font-bold mb-4">Filter Grades</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

          {/* Type Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Type</span>
            </label>
            <select 
              className="select select-bordered"
              value={typeFilter}
              onChange={(e) => updateFilter('type', e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="quiz">Quizzes</option>
              <option value="exam">Exams</option>
            </select>
          </div>

          {/* Time Filter */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Time Period</span>
            </label>
            <select 
              className="select select-bordered"
              value={timeFilter}
              onChange={(e) => updateFilter('time', e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="week">Past Week</option>
              <option value="month">Past Month</option>
              <option value="semester">This Semester</option>
            </select>
          </div>
        </div>
        
        {(courseFilter !== 'all' || typeFilter !== 'all' || timeFilter !== 'all') && (
          <div className="mt-4">
            <Link 
              href="/student/grades"
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
