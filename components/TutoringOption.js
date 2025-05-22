import Link from 'next/link';

export default function TutoringOption({ title, price, features, primary = false, href }) {
  return (
    <div className={`card w-full bg-base-100 shadow-lg ${primary ? 'border-2 border-primary' : ''}`}>
      <div className="card-body">
        <h2 className="card-title text-2xl">{title}</h2>
        <div className="mt-2">
          <span className="text-3xl font-bold">${price}</span>
          <span className="text-base-content/70 ml-1">per hour</span>
        </div>
        
        <ul className="mt-4 space-y-2">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        <div className="card-actions justify-end mt-6">
          <Link href={href} className={`btn ${primary ? 'btn-primary' : 'btn-outline btn-primary'} w-full`}>
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
