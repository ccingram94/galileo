import Hero from "../components/Hero";
import CourseUnitCard from "../components/CourseUnitCard";
import TutoringOption from "../components/TutoringOption";
import AboutInstructor from "../components/AboutInstructor";
import Image from "next/image";
import Link from "next/link";

// Sample data for course units
const courseUnits = [
  {
    number: 1,
    title: "Kinematics",
    topics: ["Motion in One Dimension", "Motion in Two Dimensions", "Projectile Motion"],
    lessons: 5,
    slug: "kinematics"
  },
  {
    number: 2,
    title: "Dynamics",
    topics: ["Newton's Laws of Motion", "Forces", "Friction and Drag"],
    lessons: 5,
    slug: "dynamics"
  },
  {
    number: 3,
    title: "Circular Motion & Gravitation",
    topics: ["Uniform Circular Motion", "Universal Gravitation", "Orbital Motion"],
    lessons: 5,
    slug: "circular-motion"
  },
  {
    number: 7,
    title: "Fluids",
    topics: ["Pressure", "Buoyancy", "Fluid Dynamics"],
    lessons: 5,
    slug: "fluids"
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
      <section className="py-20 px-6 bg-gradient-to-br from-base-100 via-base-50 to-primary/5 relative overflow-hidden">
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
                AP Physics 1
              </span>{' '}
              <span className="text-base-content">Curriculum</span>
            </h2>
            
            <p className="text-lg lg:text-xl text-base-content/80 max-w-4xl mx-auto leading-relaxed mb-8">
              Our curriculum is meticulously aligned with the{' '}
              <span className="font-semibold text-primary">College Board's updated AP Physics 1</span>{' '}
              exam outline, including the new{' '}
              <span className="font-semibold text-secondary">Fluids unit</span>{' '}
              and enhanced coverage of all core concepts.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-base-200">
                <div className="text-2xl font-bold text-primary">10</div>
                <div className="text-xs text-base-content/70">Complete Units</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-base-200">
                <div className="text-2xl font-bold text-secondary">100+</div>
                <div className="text-xs text-base-content/70">Practice Problems</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-base-200">
                <div className="text-2xl font-bold text-accent">40+</div>
                <div className="text-xs text-base-content/70">Video Lessons</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-base-200">
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
                Interactive Learning
              </div>
            </div>
          </div>
          
          {/* Course Units Grid */}
          <div className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courseUnits.map((unit, index) => (
                <div 
                  key={unit.number} 
                  className="opacity-0 translate-y-8 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'forwards' }}
                >
                  <CourseUnitCard {...unit} />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Section */}
          <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 rounded-3xl p-8 lg:p-12 border border-primary/20 shadow-xl">
            <div className="text-center space-y-6">
              {/* Achievement badges */}
              <div className="flex flex-wrap justify-center gap-4 mb-6">
                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg">
                  <div className="w-8 h-8 bg-success/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">97% Pass Rate</span>
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
                  <span className="text-sm font-medium">Self-Paced Learning</span>
                </div>
              </div>

              {/* Main CTA */}
              <div className="space-y-4">
                <h3 className="text-2xl lg:text-3xl font-bold text-base-content">
                  Ready to Master AP Physics?
                </h3>
                <p className="text-base-content/80 max-w-2xl mx-auto">
                  Explore our complete curriculum with interactive lessons, practice problems, 
                  and personalized feedback designed to maximize your exam success.
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
                  Explore Full Curriculum
                  <div className="badge badge-accent badge-sm">Free Preview</div>
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
                    <div className="w-6 h-6 bg-primary rounded-full border-2 border-white"></div>
                    <div className="w-6 h-6 bg-secondary rounded-full border-2 border-white"></div>
                    <div className="w-6 h-6 bg-accent rounded-full border-2 border-white"></div>
                    <div className="w-6 h-6 bg-info rounded-full border-2 border-white"></div>
                  </div>
                  <span>Join 500+ successful students</span>
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
          <h2 className="text-3xl font-bold mb-6">Ready to Excel in AP Physics?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our expert-led sessions and build the knowledge and confidence you need to succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn btn-secondary">
              Schedule a Free Consultation
            </Link>
            <Link href="/booking" className="btn bg-white text-primary hover:bg-base-200">
              Book Your First Session
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
