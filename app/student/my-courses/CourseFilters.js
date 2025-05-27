'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export default function CourseFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const statusFilter = searchParams.get('status') || 'all';
  const sortBy = searchParams.get('sort') || 'recent';

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'all' && key === 'status') {
      params.delete('status');
    } else {
      params.set(key, value);
    }
    router.push(`/student/my-courses?${params.toString()}`);
  };

  return (
    <div className="bg-base-100 rounded-box border border-base-300 shadow-lg mb-6">
      <div className="p-6">
        <h2 className="text-lg font-bold mb-4">Filter & Sort</h2>
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
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Sort Options */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium">Sort By</span>
            </label>
            <select 
              className="select select-bordered"
              value={sortBy}
              onChange={(e) => updateFilter('sort', e.target.value)}
            >
              <option value="recent">Recently Enrolled</option>
              <option value="name">Course Name</option>
              <option value="progress">Progress</option>
            </select>
          </div>
        </div>
        
        {(statusFilter !== 'all' || sortBy !== 'recent') && (
          <div className="mt-4">
            <button 
              onClick={() => router.push('/student/my-courses')}
              className="btn btn-ghost btn-sm gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
