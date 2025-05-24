import Link from 'next/link';
import Image from 'next/image';

export default function Courses() {
  // Course data organized by subject
  const courseData = {
    mathematics: [
      {
        title: "AP Precalculus",
        description: "Build essential foundations in polynomial, rational, exponential, logarithmic, and trigonometric functions to prepare for calculus.",
        units: 4,
        examWeight: "Algebra-based concepts and problem-solving",
        topics: [
          "Polynomial and Rational Functions",
          "Exponential and Logarithmic Functions", 
          "Trigonometric Functions",
          "Functions Involving Parameters, Vectors, and Matrices"
        ],
        difficulty: "Foundational",
        prerequisites: "Algebra II",
        slug: "ap-precalculus",
        color: "primary"
      },
      {
        title: "AP Calculus AB",
        description: "Master fundamental calculus concepts including limits, derivatives, integrals, and the Fundamental Theorem of Calculus.",
        units: 8,
        examWeight: "~50% derivatives, ~45% integrals, ~5% limits",
        topics: [
          "Limits and Continuity",
          "Differentiation: Definition and Basic Rules",
          "Differentiation: Composite, Implicit, and Inverse Functions",
          "Contextual Applications of Differentiation",
          "Analytical Applications of Differentiation",
          "Integration and Accumulation of Change",
          "Differential Equations",
          "Applications of Integration"
        ],
        difficulty: "Intermediate",
        prerequisites: "Precalculus",
        slug: "ap-calculus-ab",
        color: "primary"
      },
      {
        title: "AP Calculus BC",
        description: "Advanced calculus covering all AB topics plus series, parametric equations, polar coordinates, and additional integration techniques.",
        units: 10,
        examWeight: "AB topics (60%) + Advanced topics (40%)",
        topics: [
          "All AP Calculus AB Topics", 
          "Parametric Equations",
          "Polar Functions",
          "Series Convergence and Representation",
          "Advanced Integration Techniques"
        ],
        difficulty: "Advanced",
        prerequisites: "Strong foundation in Precalculus",
        slug: "ap-calculus-bc",
        color: "primary",
        highlight: true
      }
    ],
    physics: [
      {
        title: "AP Physics 1: Algebra-Based",
        description: "Explore fundamental physics concepts including mechanics, waves, and basic electricity using algebra and trigonometry.",
        units: 7,
        examWeight: "Mechanics (70%), Waves & Sound (15%), Electricity (15%)",
        topics: [
          "Kinematics",
          "Dynamics", 
          "Circular Motion and Gravitation",
          "Energy",
          "Momentum",
          "Simple Harmonic Motion",
          "Fluids"
        ],
        difficulty: "Foundational",
        prerequisites: "Algebra II (concurrent enrollment acceptable)",
        slug: "ap-physics-1",
        color: "secondary",
        highlight: true,
        note: "Updated for 2024-2025 with new Fluids unit"
      },
      {
        title: "AP Physics 2: Algebra-Based",
        description: "Advanced physics topics including thermodynamics, electromagnetism, optics, and modern physics using algebra-based approaches.",
        units: 7,
        examWeight: "Fluids, Thermo, E&M, Optics, Modern Physics",
        topics: [
          "Fluids",
          "Thermodynamics",
          "Electric Force, Field, and Potential",
          "Electric Circuits", 
          "Magnetism and Electromagnetic Induction",
          "Geometric and Physical Optics",
          "Quantum, Atomic, and Nuclear Physics"
        ],
        difficulty: "Intermediate", 
        prerequisites: "AP Physics 1 or equivalent",
        slug: "ap-physics-2",
        color: "secondary"
      },
      {
        title: "AP Physics C: Mechanics",
        description: "Calculus-based mechanics covering kinematics, dynamics, energy, momentum, rotation, oscillations, and gravitation.",
        units: 5,
        examWeight: "Comprehensive calculus-based mechanics",
        topics: [
          "Kinematics",
          "Newton's Laws of Motion",
          "Work, Energy and Power",
          "Systems of Particles and Linear Momentum",
          "Rotation",
          "Oscillations",
          "Gravitation"
        ],
        difficulty: "Advanced",
        prerequisites: "Calculus (concurrent enrollment acceptable)",
        slug: "ap-physics-c-mechanics", 
        color: "secondary"
      },
      {
        title: "AP Physics C: Electricity and Magnetism",
        description: "Calculus-based study of electric fields, circuits, magnetic fields, and electromagnetic induction.",
        units: 5,
        examWeight: "Comprehensive calculus-based E&M",
        topics: [
          "Electrostatics",
          "Conductors, Capacitors, and Dielectrics",
          "Electric Circuits",
          "Magnetic Fields", 
          "Electromagnetic Induction"
        ],
        difficulty: "Advanced",
        prerequisites: "AP Physics C: Mechanics recommended",
        slug: "ap-physics-c-electricity-magnetism",
        color: "secondary"
      }
    ]
  };

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      "Foundational": "badge-success",
      "Intermediate": "badge-warning", 
      "Advanced": "badge-error"
    };
    return badges[difficulty] || "badge-neutral";
  };

  return (
    <div className="min-h-screen">
    {/* Hero Section - Enhanced with better visual hierarchy */}
    <section className="relative bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5 py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
      <div className="container mx-auto max-w-7xl px-6 relative">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 space-y-6">
            <div className="badge badge-outline badge-lg text-primary border-primary/30">
              STEM Excellence
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
              Math & Physics 
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block">
                Courses
              </span>
            </h1>
            <p className="text-xl text-base-content/80 leading-relaxed max-w-lg">
              Master challenging STEM concepts with our comprehensive curricula designed to build deep conceptual understanding and problem-solving skills across Mathematics and Physics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/booking/individual" className="btn btn-primary btn-lg shadow-lg">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                One-on-One Tutoring
              </Link>
              <Link href="/booking/group" className="btn btn-outline btn-lg hover:btn-primary">
                Group Classes
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative w-96 h-96 rounded-2xl overflow-hidden shadow-2xl">
                <Image 
                  src="/about-hero.jpg" 
                  alt="Math and Physics courses" 
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* Course Overview Stats */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="bg-base-100 rounded-lg shadow-md p-6">
            <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
              <div className="stat">
                <div className="stat-title">Total Courses</div>
                <div className="stat-value">7</div>
                <div className="stat-desc">3 Math + 4 Physics</div>
              </div>
              
              <div className="stat">
                <div className="stat-title">Curriculum Hours</div>
                <div className="stat-value">200+</div>
                <div className="stat-desc">Comprehensive coverage</div>
              </div>
              
              <div className="stat">
                <div className="stat-title">Practice Problems</div>
                <div className="stat-value">2000+</div>
                <div className="stat-desc">AP-style questions</div>
              </div>
              
              <div className="stat">
                <div className="stat-title">Success Rate</div>
                <div className="stat-value">95%</div>
                <div className="stat-desc">Students scoring 4 or 5</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mathematics Courses */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Mathematics Courses</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Build a strong mathematical foundation with our comprehensive calculus curriculum designed to prepare students for advanced STEM studies.
            </p>
          </div>
          
          <div className="space-y-6">
            {courseData.mathematics.map((course, index) => (
              <div key={index} className={`card lg:card-side bg-base-100 shadow-lg border-l-4 ${course.highlight ? 'border-accent' : 'border-primary'}`}>
                <div className="card-body">
                  <div className="flex items-center gap-4 flex-wrap">
                    <h3 className="card-title text-2xl">{course.title}</h3>
                    <div className={`badge ${getDifficultyBadge(course.difficulty)}`}>{course.difficulty}</div>
                  </div>
                  
                  <p className="mt-2 lg:pr-10">{course.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <h4 className="font-semibold text-sm uppercase text-primary opacity-80 tracking-wider mb-2">Course Topics</h4>
                      <ul className="space-y-1">
                        {course.topics.slice(0, 5).map((topic, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm">{topic}</span>
                          </li>
                        ))}
                        {course.topics.length > 5 && (
                          <li className="text-sm text-base-content/60 ml-7">
                            +{course.topics.length - 5} more units
                          </li>
                        )}
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm uppercase text-primary opacity-80 tracking-wider mb-2">Course Details</h4>
                        <div className="flex flex-wrap gap-2">
                          <div className="badge badge-outline">{course.units} Units</div>
                          <div className="badge badge-outline">Prerequisites: {course.prerequisites}</div>
                        </div>
                        <p className="text-sm mt-2 text-base-content/70">{course.examWeight}</p>
                      </div>
                      
                      <div className="card-actions justify-end mt-2">
                        <Link href={`/courses/mathematics/${course.slug}`} className="btn btn-primary btn-sm">
                          Course Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Physics Courses */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Physics Courses</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Explore the fundamental principles of physics from algebra-based introductory concepts to advanced calculus-based mechanics and electromagnetism.
            </p>
          </div>
          
          <div className="space-y-6">
            {courseData.physics.map((course, index) => (
              <div key={index} className={`card lg:card-side bg-base-100 shadow-lg border-l-4 ${course.highlight ? 'border-accent' : 'border-secondary'}`}>
                <div className="card-body">
                  <div className="flex items-center gap-4 flex-wrap">
                    <h3 className="card-title text-2xl">{course.title}</h3>
                    <div className={`badge ${getDifficultyBadge(course.difficulty)}`}>{course.difficulty}</div>
                  </div>
                  
                  <p className="mt-2 lg:pr-10">{course.description}</p>
                  {course.note && (
                    <div className="alert alert-info mt-2">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                      <span className="text-sm">{course.note}</span>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <h4 className="font-semibold text-sm uppercase text-secondary opacity-80 tracking-wider mb-2">Course Topics</h4>
                      <ul className="space-y-1">
                        {course.topics.map((topic, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm">{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm uppercase text-secondary opacity-80 tracking-wider mb-2">Course Details</h4>
                        <div className="flex flex-wrap gap-2">
                          <div className="badge badge-outline">{course.units} Units</div>
                          <div className="badge badge-outline">Prerequisites: {course.prerequisites}</div>
                        </div>
                        <p className="text-sm mt-2 text-base-content/70">{course.examWeight}</p>
                      </div>
                      
                      <div className="card-actions justify-end mt-2">
                        <Link href={`/courses/physics/${course.slug}`} className="btn btn-secondary btn-sm">
                          Course Details
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Pathway */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Recommended Learning Pathways</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Choose the pathway that aligns with your academic goals and interests.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg border border-blue-200">
              <div className="card-body">
                <h3 className="card-title text-primary text-xl">Engineering & Physical Sciences Track</h3>
                <div className="space-y-3 mt-4">
                  <div className="flex items-center gap-3">
                    <div className="badge badge-primary badge-sm">1</div>
                    <span>AP Precalculus</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="badge badge-primary badge-sm">2</div>
                    <span>AP Physics 1 + AP Calculus AB</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="badge badge-primary badge-sm">3</div>
                    <span>AP Calculus BC + AP Physics C: Mechanics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="badge badge-primary badge-sm">4</div>
                    <span>AP Physics C: E&M</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card bg-gradient-to-br from-green-50 to-green-100 shadow-lg border border-green-200">
              <div className="card-body">
                <h3 className="card-title text-secondary text-xl">Life Sciences & Medicine Track</h3>
                <div className="space-y-3 mt-4">
                  <div className="flex items-center gap-3">
                    <div className="badge badge-secondary badge-sm">1</div>
                    <span>AP Precalculus</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="badge badge-secondary badge-sm">2</div>
                    <span>AP Physics 1 + AP Calculus AB</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="badge badge-secondary badge-sm">3</div>
                    <span>AP Physics 2 + AP Calculus BC</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="badge badge-secondary badge-sm">4</div>
                    <span>Additional AP Sciences</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Tutoring Options</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Choose the learning format that fits your needs and budget.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card bg-base-100 shadow-lg border-2 border-primary">
              <div className="card-body">
                <h3 className="card-title text-2xl">One-on-One Tutoring</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">$70</span>
                  <span className="text-base-content/70 ml-1">per hour</span>
                </div>
                
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Personalized curriculum pacing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Flexible scheduling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Homework assistance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Detailed progress reports</span>
                  </li>
                </ul>
                
                <div className="card-actions justify-end mt-6">
                  <Link href="/booking/individual" className="btn btn-primary w-full">
                    Book Individual Sessions
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-2xl">Group Classes</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">$30</span>
                  <span className="text-base-content/70 ml-1">per hour</span>
                </div>
                
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Small groups (4-6 students)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Collaborative learning environment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Structured curriculum</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Affordable rates</span>
                  </li>
                </ul>
                
                <div className="card-actions justify-end mt-6">
                  <Link href="/booking/group" className="btn btn-outline btn-primary w-full">
                    Join Group Classes
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 bg-primary text-primary-content">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Excel in AP Math & Physics?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our expert-led sessions and build the knowledge and confidence you need to succeed on your AP exams and beyond.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn btn-secondary">
              Schedule a Free Consultation
            </Link>
            <Link href="/booking" className="btn bg-white text-primary hover:bg-base-200">
              Enroll Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
