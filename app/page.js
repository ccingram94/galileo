import Hero from "../components/Hero";
import CourseUnitCard from "../components/CourseUnitCard";
import TutoringOption from "../components/TutoringOption";
import AboutInstructor from "../components/AboutInstructor";
import Image from "next/image";
import Link from "next/link";

// Sample data for featured course units (showing variety across subjects)
const featuredUnits = [
  {
    number: 1,
    title: "Kinematics",
    topics: ["Motion in One Dimension", "Motion in Two Dimensions", "Projectile Motion"],
    lessons: 5,
    slug: "kinematics",
    subject: "Physics"
  },
  {
    number: 1,
    title: "Polynomial Functions",
    topics: ["Function Analysis", "Graphing Techniques", "Complex Zeros"],
    lessons: 6,
    slug: "polynomial-functions", 
    subject: "Math"
  },
  {
    number: 2,
    title: "Dynamics",
    topics: ["Newton's Laws of Motion", "Forces", "Friction and Drag"],
    lessons: 5,
    slug: "dynamics",
    subject: "Physics"
  },
  {
    number: 3,
    title: "Limits & Continuity",
    topics: ["Limit Definitions", "Continuity", "Asymptotes"],
    lessons: 8,
    slug: "limits-continuity",
    subject: "Math"
  }
];

// Tutoring options data
const tutoringOptions = [
  {
    title: "One-on-One Tutoring",
    price: 70,
    features: [
      "Private 55-minute Zoom sessions",
      "Personalized curriculum pacing",
      "Homework assistance",
      "Direct access to tutor",
      "Flexible scheduling",
      "Detailed progress reports"
    ],
    primary: true,
    href: "/booking/individual"
  },
  {
    title: "Group Classes",
    price: 30,
    features: [
      "Small groups (4-6 students)",
      "55-minute Zoom sessions",
      "Structured curriculum",
      "Collaborative learning",
      "Affordable rates",
      "Comprehensive unit exams"
    ],
    primary: false,
    href: "/booking/group"
  }
];

export default function Home() {
  return (
    <>
      <Hero />
      
      {/* Course Overview Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-base-100 via-base-200/30 to-primary/5">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/3 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Header Section */}
          <div className="text-center mb-16">
            {/* Top badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              2025 Updated Curriculum
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Math & Physics
              </span>{' '}
              <span className="text-base-content">Mastery</span>
            </h2>
            
            <p className="text-lg lg:text-xl text-base-content/80 max-w-4xl mx-auto leading-relaxed mb-8">
              Comprehensive curricula meticulously aligned with{' '}
              <span className="font-semibold text-primary">College Board standards</span>{' '}
              across{' '}
              <span className="font-semibold text-secondary">7 core STEM subjects</span>.{' '}
              From foundational precalculus to advanced calculus-based physics.
            </p>

            {/* Subject overview */}
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full border border-blue-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium">Mathematics: Precalculus → Calculus BC</span>
              </div>
              <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <span className="text-sm font-medium">Physics: Algebra-Based → Calculus-Based</span>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-8">
              <div className="bg-base-100 rounded-box border border-base-300 p-4 shadow-lg">
                <div className="text-2xl font-bold text-primary">7</div>
                <div className="text-xs text-base-content/70">AP Courses</div>
              </div>
              <div className="bg-base-100 rounded-box border border-base-300 p-4 shadow-lg">
                <div className="text-2xl font-bold text-secondary">50+</div>
                <div className="text-xs text-base-content/70">Total Units</div>
              </div>
              <div className="bg-base-100 rounded-box border border-base-300 p-4 shadow-lg">
                <div className="text-2xl font-bold text-accent">2000+</div>
                <div className="text-xs text-base-content/70">Practice Problems</div>
              </div>
              <div className="bg-base-100 rounded-box border border-base-300 p-4 shadow-lg">
                <div className="text-2xl font-bold text-info">24/7</div>
                <div className="text-xs text-base-content/70">Access</div>
              </div>
            </div>

            {/* Key features */}
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 bg-success/10 text-success px-3 py-1 rounded-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                College Board Aligned
              </div>
              <div className="flex items-center gap-2 bg-warning/10 text-warning px-3 py-1 rounded-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Updated for 2025
              </div>
              <div className="flex items-center gap-2 bg-info/10 text-info px-3 py-1 rounded-full">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                STEM Excellence
              </div>
            </div>
          </div>

          {/* Featured Course Units Grid */}
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Sample Course Units</h3>
              <p className="text-base-content/70">Explore examples from our comprehensive Math and Physics curricula</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredUnits.map((unit, index) => (
                <div 
                  key={`${unit.subject}-${unit.number}`} 
                  className="opacity-0 translate-y-8 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <div className="relative">
                    <div className={`absolute -top-2 -right-2 badge badge-sm ${unit.subject === 'Math' ? 'badge-primary' : 'badge-secondary'}`}>
                      {unit.subject}
                    </div>
                    <CourseUnitCard {...unit} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Courses Overview Cards */}
          <div className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Mathematics Card */}
              <div className="card bg-gradient-to-br from-blue-50 to-blue-100 shadow-xl border border-blue-200">
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="card-title text-primary">Mathematics Courses</h3>
                      <p className="text-sm text-primary/70">3 Complete AP Programs</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                      <span className="font-medium">AP Precalculus</span>
                      <div className="badge badge-success badge-sm">Foundational</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                      <span className="font-medium">AP Calculus AB</span>
                      <div className="badge badge-warning badge-sm">Intermediate</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                      <span className="font-medium">AP Calculus BC</span>
                      <div className="badge badge-error badge-sm">Advanced</div>
                    </div>
                  </div>
                  
                  <div className="card-actions justify-end mt-6">
                    <Link href="/courses#mathematics" className="btn btn-primary btn-sm">
                      Explore Math Courses
                    </Link>
                  </div>
                </div>
              </div>

              {/* Physics Card */}
              <div className="card bg-gradient-to-br from-green-50 to-green-100 shadow-xl border border-green-200">
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="card-title text-secondary">Physics Courses</h3>
                      <p className="text-sm text-secondary/70">4 Complete AP Programs</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                      <span className="font-medium">AP Physics 1</span>
                      <div className="badge badge-success badge-sm">Foundational</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                      <span className="font-medium">AP Physics 2</span>
                      <div className="badge badge-warning badge-sm">Intermediate</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                      <span className="font-medium">AP Physics C: Mechanics</span>
                      <div className="badge badge-error badge-sm">Advanced</div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg">
                      <span className="font-medium">AP Physics C: Electricity and Magnetism</span>
                      <div className="badge badge-error badge-sm">Advanced</div>
                    </div>
                  </div>
                  
                  <div className="card-actions justify-end mt-6">
                    <Link href="/courses#physics" className="btn btn-secondary btn-sm">
                      Explore Physics Courses
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="bg-gradient-to-r from-primary/5 via-secondary/3 to-accent/5 rounded-box p-8 lg:p-12 border border-base-300 shadow-xl">
            <div className="text-center space-y-6">
              {/* Achievement badges */}
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <div className="flex items-center gap-2 bg-base-100 border border-success/20 px-4 py-2 rounded-box shadow-lg">
                  <div className="w-8 h-8 bg-success/10 rounded-btn flex items-center justify-center">
                    <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-success">95% Pass Rate</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
                  <div className="w-8 h-8 bg-warning/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">4.9★ Student Rating</span>
                </div>
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
                  <div className="w-8 h-8 bg-info/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">7 STEM Subjects</span>
                </div>
              </div>

              {/* Main CTA */}
              <div className="space-y-4">
                <h3 className="text-2xl lg:text-3xl font-bold text-base-content">
                  Ready to Master STEM?
                </h3>
                <p className="text-base-content/80 max-w-2xl mx-auto">
                  Explore our complete Math and Physics curricula with interactive lessons, practice problems, 
                  and personalized feedback designed to maximize your AP exam success.
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Link 
                  href="/courses" 
                  className="btn btn-primary btn-lg gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Explore All Courses
                  <div className="badge badge-accent badge-sm">Math + Physics</div>
                </Link>
                
                <Link 
                  href="/demo" 
                  className="btn btn-outline btn-secondary btn-lg gap-3 hover:shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-6-3a3 3 0 106 0v2a3 3 0 11-6 0v-2z" />
                  </svg>
                  Try Interactive Demo
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap justify-center items-center gap-6 pt-8 border-t border-white/20">
                <div className="flex items-center gap-2 text-sm text-base-content/70">
                  <div className="flex -space-x-1">
                    <div className="w-6 h-6 bg-primary rounded-full border-2 border-base-100"></div>
                    <div className="w-6 h-6 bg-secondary rounded-full border-2 border-base-100"></div>
                    <div className="w-6 h-6 bg-accent rounded-full border-2 border-base-100"></div>
                    <div className="w-6 h-6 bg-info rounded-full border-2 border-base-100"></div>
                  </div>
                  <span>Join 5000+ successful students</span>
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
        </div>
      </section>
      
      {/* Tutoring Options Section */}
      <section className="py-16 px-6 bg-base-200">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Tutoring Options</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Choose the learning format that best fits your needs and budget.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {tutoringOptions.map((option, index) => (
              <TutoringOption key={index} {...option} />
            ))}
          </div>
        </div>
      </section>
      
      {/* About Instructor Section */}
      <AboutInstructor />
      
      {/* Call to Action */}
      <section className="py-16 px-6 bg-primary text-primary-content">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Excel in AP STEM?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our expert-led sessions and build the knowledge and confidence you need to succeed across Math and Physics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn btn-secondary btn-lg">
              Schedule a Free Consultation
            </Link>
            <Link href="/booking" className="btn btn-outline btn-secondary btn-lg">
              Book Your First Session
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
