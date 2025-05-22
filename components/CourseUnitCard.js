import Link from 'next/link';

export default function CourseUnitCard({ number, title, topics, lessons, slug }) {
  return (
    <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all duration-300">
      <div className="card-body">
        <div className="flex items-center gap-3">
          <div className="badge badge-primary badge-lg">{number}</div>
          <h3 className="card-title font-bold">{title}</h3>
        </div>
        
        <div className="mt-4">
          <h4 className="font-semibold text-sm uppercase text-primary opacity-80 tracking-wider">Topics Covered</h4>
          <ul className="mt-2 space-y-1">
            {topics.map((topic, i) => (
              <li key={i} className="flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>{topic}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="card-actions justify-between items-center mt-6">
          <div className="badge badge-outline">{lessons} lessons</div>
          <Link href={`/courses/${slug}`} className="btn btn-sm btn-primary">View Details</Link>
        </div>
      </div>
    </div>
  );
}
