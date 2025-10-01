import Link from 'next/link';

export default function CourseUnitCard({ number, title, topics, lessons, slug }) {
  return (
    <div className="card bg-gradient-to-br from-base-100 to-base-200/40 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-base-300/50 group">
      <div className="card-body p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="badge badge-primary badge-lg px-4 py-3 text-lg font-bold shadow-md">
            {number}
          </div>
          <h3 className="card-title text-xl font-bold flex-1">{title}</h3>
        </div>
        
        <div className="space-y-3">
          <h4 className="font-semibold text-xs uppercase text-primary/80 tracking-wider flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Topics Covered
          </h4>
          <ul className="space-y-2">
            {topics.map((topic, i) => (
              <li key={i} className="flex items-start gap-2 group/item">
                <div className="w-5 h-5 bg-secondary/20 rounded-full flex items-center justify-center mt-0.5 group-hover/item:bg-secondary/30 transition-colors duration-200">
                  <svg className="h-3 w-3 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm text-base-content/80">{topic}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="card-actions justify-between items-center mt-6 pt-4 border-t border-base-300/50">
          <div className="badge badge-outline badge-lg px-3 py-3 font-semibold">
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            {lessons} lessons
          </div>
          <Link 
            href={`/courses/${slug}`} 
            className="btn btn-sm btn-primary shadow-md hover:shadow-lg group-hover:btn-secondary transition-all duration-300"
          >
            View Details
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
