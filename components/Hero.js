import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="hero min-h-[85vh] bg-gradient-to-br from-base-100 via-base-50 to-primary/5 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/3 rounded-full blur-3xl"></div>
      </div>

      <div className="hero-content flex-col lg:flex-row-reverse gap-12 max-w-7xl mx-auto px-4 relative z-10">
        {/* Image Section */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <div className="relative">
            {/* Floating badge */}
            <div className="absolute -top-4 -left-4 z-20 badge badge-primary badge-lg gap-2 p-4 shadow-lg animate-pulse">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              2025 Updated
            </div>
            
            {/* Secondary badge */}
            <div className="absolute -top-2 -right-6 z-20 badge badge-secondary badge-md gap-2 p-3 shadow-lg">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              7 Courses
            </div>
            
            {/* Main image with enhanced styling */}
            <div className="relative p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-base-200">
              <Image 
                src="/stem-hero.jpg" 
                alt="STEM education visualization showing math and physics concepts"
                width={500}
                height={500}
                className="max-w-sm w-full h-auto rounded-2xl transform hover:scale-105 transition-transform duration-300"
                priority
              />
              
              {/* Floating stats */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-base-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-success to-info rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-success">95%</div>
                    <div className="text-xs text-base-content/70">Pass Rate</div>
                  </div>
                </div>
              </div>

              {/* Subject indicator badges */}
              <div className="absolute -bottom-3 -left-3 flex gap-2">
                <div className="badge badge-primary badge-sm">Math</div>
                <div className="badge badge-secondary badge-sm">Physics</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 text-center lg:text-left">
          {/* Top badge */}
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            STEM Excellence Program
          </div>

          {/* Main heading */}
          <h1 className="text-4xl lg:text-6xl font-bold text-base-content leading-tight mb-6">
            Master{' '}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Math & Physics
            </span>{' '}
            with Confidence
          </h1>

          {/* Subtitle */}
          <p className="text-lg lg:text-xl text-base-content/80 leading-relaxed mb-8 max-w-2xl">
            Expert-led preparation across{' '}
            <span className="font-semibold text-primary">7 comprehensive STEM courses</span>.
            From foundational precalculus to advanced calculus-based physics, 
            our personalized approach maximizes your AP exam success.
          </p>

          {/* Course highlights */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-6">
            <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-full border border-blue-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-medium">3 Math Courses</span>
            </div>
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-full border border-green-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span className="text-sm font-medium">4 Physics Courses</span>
            </div>
          </div>

          {/* Features list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-medium">2025 Updated Curriculum</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
              <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-sm font-medium">Expert STEM Instructors</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
              <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <span className="text-sm font-medium">Progress Tracking</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-xl">
              <div className="w-8 h-8 bg-info/20 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <span className="text-sm font-medium">Complete Learning Path</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link 
              href="/booking/individual" 
              className="btn btn-primary btn-lg gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Start 1-on-1 Tutoring
              <div className="badge badge-accent badge-sm">Popular</div>
            </Link>
            
            <Link 
              href="/courses" 
              className="btn btn-outline btn-secondary btn-lg gap-3 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Explore All Courses
              <div className="badge badge-secondary badge-sm">Math + Physics</div>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 mt-8 pt-8 border-t border-base-200/50">
            <div className="flex items-center gap-2 text-sm text-base-content/70">
              <div className="flex -space-x-1">
                <div className="w-6 h-6 bg-primary rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 bg-secondary rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 bg-accent rounded-full border-2 border-white"></div>
                <div className="w-6 h-6 bg-info rounded-full border-2 border-white"></div>
              </div>
              <span>5000+ successful students</span>
            </div>
            
            <div className="flex items-center gap-1 text-sm text-base-content/70">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span>4.9/5 rating</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-base-content/70">
              <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Money-back guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg className="w-6 h-6 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </div>
  );
}
