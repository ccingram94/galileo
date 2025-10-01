import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="hero min-h-[90vh] bg-gradient-to-br from-base-100 via-primary/3 to-secondary/5 relative overflow-hidden">
      {/* Enhanced background decorative elements with animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-primary/10 to-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-secondary/10 to-secondary/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-accent/8 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
      </div>

      <div className="hero-content flex-col lg:flex-row-reverse gap-16 max-w-7xl mx-auto px-6 relative z-10 py-12">
        {/* Image Section - Enhanced with better animations */}
        <div className="flex-1 flex justify-center lg:justify-end">
          <div className="relative group">
            {/* Floating badge with improved animation */}
            <div className="absolute -top-4 -left-4 z-20 badge badge-primary badge-lg gap-2 px-4 py-3 shadow-xl border-2 border-primary/20 hover:scale-110 transition-transform duration-300">
              <svg className="w-4 h-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-semibold">2025 Updated</span>
            </div>
            
            {/* Secondary badge with hover effect */}
            <div className="absolute -top-2 -right-6 z-20 badge badge-secondary badge-md gap-2 px-3 py-2 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="font-semibold">7 Courses</span>
            </div>
            
            {/* Main image with premium styling and animations */}
            <div className="relative p-8 glass-effect rounded-3xl shadow-2xl group-hover:shadow-3xl transition-all duration-500">
              {/* Glow effect on hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative">
                <Image 
                  src="/stem-hero.jpg" 
                  alt="STEM education visualization showing math and physics concepts"
                  width={500}
                  height={500}
                  className="max-w-sm w-full h-auto rounded-2xl shadow-lg group-hover:scale-[1.02] transition-transform duration-500"
                  priority
                />
              </div>
              
              {/* Enhanced floating stats with animation */}
              <div className="absolute -bottom-8 -right-8 glass-effect rounded-2xl shadow-2xl p-5 border border-white/40 hover:scale-110 transition-transform duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-success via-success to-info rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-success">95%</div>
                    <div className="text-xs text-base-content/70 font-medium">Pass Rate</div>
                  </div>
                </div>
              </div>

              {/* Enhanced subject badges */}
              <div className="absolute -bottom-4 -left-4 flex gap-2">
                <div className="badge badge-primary badge-md px-3 py-3 shadow-lg border-2 border-primary/20 font-semibold">Math</div>
                <div className="badge badge-secondary badge-md px-3 py-3 shadow-lg border-2 border-secondary/20 font-semibold">Physics</div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section - Enhanced typography and spacing */}
        <div className="flex-1 text-center lg:text-left space-y-6">
          {/* Top badge with improved design */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-primary/15 to-primary/10 text-primary px-5 py-2.5 rounded-full text-sm font-semibold mb-2 border border-primary/20 hover:shadow-lg transition-all duration-300">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            STEM Excellence Program
          </div>

          {/* Main heading with enhanced gradient */}
          <h1 className="text-5xl lg:text-7xl font-bold text-base-content leading-tight">
            Master{' '}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent inline-block">
              Math & Physics
            </span>{' '}
            <span className="block mt-2">with Confidence</span>
          </h1>

          {/* Enhanced subtitle with better line height */}
          <p className="text-xl lg:text-2xl text-base-content/75 leading-relaxed max-w-2xl font-light">
            Expert-led preparation across{' '}
            <span className="font-semibold text-primary">7 comprehensive STEM courses</span>.
            From foundational precalculus to advanced calculus-based physics, 
            our personalized approach maximizes your AP exam success.
          </p>

          {/* Course highlights with improved styling */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-3">
            <div className="flex items-center gap-2 bg-gradient-to-br from-blue-50 to-blue-100/50 text-blue-700 px-4 py-2.5 rounded-full border-2 border-blue-200/50 shadow-sm hover:shadow-md transition-all duration-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="text-sm font-semibold">3 Math Courses</span>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-br from-green-50 to-green-100/50 text-green-700 px-4 py-2.5 rounded-full border-2 border-green-200/50 shadow-sm hover:shadow-md transition-all duration-300">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span className="text-sm font-semibold">4 Physics Courses</span>
            </div>
          </div>

          {/* Enhanced features grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 glass-effect rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className="text-sm font-semibold">2025 Updated Curriculum</span>
            </div>
            <div className="flex items-center gap-3 p-4 glass-effect rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary to-secondary/80 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <span className="text-sm font-semibold">Expert STEM Instructors</span>
            </div>
            <div className="flex items-center gap-3 p-4 glass-effect rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-accent to-accent/80 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <span className="text-sm font-semibold">Progress Tracking</span>
            </div>
            <div className="flex items-center gap-3 p-4 glass-effect rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-info to-info/80 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <span className="text-sm font-semibold">Complete Learning Path</span>
            </div>
          </div>

          {/* Enhanced action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <Link 
              href="/booking/individual" 
              className="btn btn-primary btn-lg gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300 border-0"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Start 1-on-1 Tutoring
              <div className="badge badge-accent badge-sm font-semibold">Popular</div>
            </Link>
            
            <Link 
              href="/courses" 
              className="btn btn-outline btn-secondary btn-lg gap-3 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 border-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Explore All Courses
            </Link>
          </div>

          {/* Enhanced trust indicators */}
          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 pt-6 border-t border-base-200">
            <div className="flex items-center gap-2 text-sm text-base-content/70">
              <div className="flex -space-x-2">
                <div className="w-7 h-7 bg-gradient-to-br from-primary to-primary/80 rounded-full border-2 border-white shadow-sm"></div>
                <div className="w-7 h-7 bg-gradient-to-br from-secondary to-secondary/80 rounded-full border-2 border-white shadow-sm"></div>
                <div className="w-7 h-7 bg-gradient-to-br from-accent to-accent/80 rounded-full border-2 border-white shadow-sm"></div>
                <div className="w-7 h-7 bg-gradient-to-br from-info to-info/80 rounded-full border-2 border-white shadow-sm"></div>
              </div>
              <span className="font-medium">5000+ successful students</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-sm text-base-content/70">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400 fill-current drop-shadow-sm" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="font-medium">4.9/5 rating</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-base-content/70">
              <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="font-medium">Money-back guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-base-content/50 font-medium">Scroll to explore</span>
          <svg className="w-6 h-6 text-base-content/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </div>
  );
}
