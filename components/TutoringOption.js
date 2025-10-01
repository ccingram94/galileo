import Link from 'next/link';

export default function TutoringOption({ title, price, features, primary = false, href }) {
  return (
    <div className={`card w-full bg-gradient-to-br from-base-100 to-base-200/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ${primary ? 'border-2 border-primary ring-2 ring-primary/20' : 'border border-base-300'}`}>
      {primary && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <div className="badge badge-primary badge-lg px-4 py-3 shadow-lg font-semibold">
            Most Popular
          </div>
        </div>
      )}
      <div className="card-body p-8">
        <h2 className="card-title text-2xl lg:text-3xl font-bold mb-2">{title}</h2>
        <div className="mt-2 mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">${price}</span>
            <span className="text-base-content/60 text-lg">per hour</span>
          </div>
        </div>
        
        <ul className="space-y-3">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3 group">
              <div className="w-5 h-5 bg-success/20 rounded-full flex items-center justify-center mt-0.5 group-hover:bg-success/30 transition-colors duration-200">
                <svg className="h-3 w-3 text-success" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="text-base-content/80 leading-relaxed">{feature}</span>
            </li>
          ))}
        </ul>
        
        <div className="card-actions justify-end mt-8">
          <Link 
            href={href} 
            className={`btn w-full ${primary ? 'btn-primary' : 'btn-outline btn-primary'} btn-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300`}
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
}
