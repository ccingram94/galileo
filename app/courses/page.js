import Link from 'next/link';
import Image from 'next/image';

export default function Courses() {
  // AP Physics 1 units data
  const physicsUnits = [
    {
      number: 1,
      title: "Kinematics",
      description: "The study of motion without considering its causes, focusing on displacement, velocity, and acceleration in one and two dimensions.",
      topics: [
        "Position, Velocity, and Acceleration",
        "Representations of Motion",
        "Motion in One Dimension",
        "Motion in Two Dimensions",
        "Projectile Motion"
      ],
      lessons: 5,
      examTopics: "~15% of AP Exam Score",
      slug: "kinematics"
    },
    {
      number: 2,
      title: "Dynamics",
      description: "Analyzing the relationship between force, mass, and motion, with emphasis on Newton's laws and their applications.",
      topics: [
        "Newton's First Law",
        "Newton's Second Law",
        "Newton's Third Law",
        "Force Diagrams",
        "Applications of Newton's Laws"
      ],
      lessons: 5,
      examTopics: "~20% of AP Exam Score",
      slug: "dynamics"
    },
    {
      number: 3,
      title: "Circular Motion & Gravitation",
      description: "Exploring objects moving in circular paths and the universal law of gravitation that governs celestial bodies.",
      topics: [
        "Uniform Circular Motion",
        "Centripetal Acceleration",
        "Centripetal Force",
        "Universal Law of Gravitation",
        "Orbital Motion"
      ],
      lessons: 5,
      examTopics: "~10% of AP Exam Score",
      slug: "circular-motion"
    },
    {
      number: 4,
      title: "Energy",
      description: "Understanding different forms of energy, conservation principles, and how energy transforms within systems.",
      topics: [
        "Work and Energy",
        "Conservation of Energy",
        "Power",
        "Energy Transfers",
        "Potential Energy and Conservation"
      ],
      lessons: 5,
      examTopics: "~15% of AP Exam Score",
      slug: "energy"
    },
    {
      number: 5,
      title: "Momentum",
      description: "Analyzing collisions and interactions using the concepts of momentum and impulse.",
      topics: [
        "Momentum and Impulse",
        "Conservation of Linear Momentum",
        "Collisions",
        "Center of Mass",
        "Impulse and Force"
      ],
      lessons: 5,
      examTopics: "~10% of AP Exam Score",
      slug: "momentum"
    },
    {
      number: 6,
      title: "Simple Harmonic Motion",
      description: "Examining oscillatory motion, including pendulums and spring-mass systems.",
      topics: [
        "Simple Harmonic Motion",
        "Energy in SHM",
        "Pendulums",
        "Mass-Spring Systems",
        "Frequency and Period"
      ],
      lessons: 5,
      examTopics: "~15% of AP Exam Score",
      slug: "simple-harmonic-motion"
    },
    {
      number: 7,
      title: "Fluids",
      description: "Analyzing fluid behavior through pressure, buoyancy, and flow principles (new to 2023-2025 AP Physics 1 curriculum).",
      topics: [
        "Density and Pressure",
        "Buoyancy and Archimedes' Principle",
        "Pascal's Principle",
        "Fluid Dynamics and Bernoulli's Equation",
        "Applications of Fluid Mechanics"
      ],
      lessons: 5,
      examTopics: "~15% of AP Exam Score",
      slug: "fluids",
      highlight: true
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-base-100 py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="badge badge-secondary mb-4">Updated for 2023-2025</div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">AP Physics 1 Curriculum</h1>
              <p className="text-lg mb-6">
                Master the complete AP Physics 1 curriculum with our comprehensive course designed to align perfectly with the College Board's updated exam specifications, including the new Fluids unit.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link href="/booking/individual" className="btn btn-primary">One-on-One Tutoring</Link>
                <Link href="/booking/group" className="btn btn-outline btn-primary">Group Classes</Link>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative w-full h-80">
                <Image 
                  src="/physics-course-hero.svg" 
                  alt="Physics concepts illustration" 
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Overview */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Course Structure</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Our AP Physics 1 curriculum is meticulously structured to build conceptual understanding and problem-solving skills progressively.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all">
              <div className="card-body">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-primary/10 p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <h3 className="card-title justify-center">7 Comprehensive Units</h3>
                <p className="text-center">
                  Each unit covers key concepts and principles aligned with the College Board's curriculum framework, including the new Fluids section.
                </p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all">
              <div className="card-body">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-primary/10 p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <h3 className="card-title justify-center">5 Lessons Per Unit</h3>
                <p className="text-center">
                  Each unit consists of five 55-minute lessons that break down complex topics into manageable, focused learning objectives.
                </p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all">
              <div className="card-body">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-primary/10 p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <h3 className="card-title justify-center">Unit Assessments</h3>
                <p className="text-center">
                  Each unit concludes with a comprehensive exam that provides detailed feedback on strengths and areas for improvement.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-12 bg-base-100 rounded-lg shadow-md p-6">
            <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
              <div className="stat">
                <div className="stat-title">Total Hours</div>
                <div className="stat-value">35+</div>
                <div className="stat-desc">Core curriculum hours</div>
              </div>
              
              <div className="stat">
                <div className="stat-title">Practice Problems</div>
                <div className="stat-value">500+</div>
                <div className="stat-desc">Including AP-style questions</div>
              </div>
              
              <div className="stat">
                <div className="stat-title">Lab Activities</div>
                <div className="stat-value">14</div>
                <div className="stat-desc">Virtual & at-home options</div>
              </div>
              
              <div className="stat">
                <div className="stat-title">Full Practice Exams</div>
                <div className="stat-value">2</div>
                <div className="stat-desc">With detailed solutions</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Units */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">AP Physics 1 Curriculum Units</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Our comprehensive curriculum covers all seven units of the College Board's updated AP Physics 1 framework.
            </p>
          </div>
          
          <div className="space-y-8">
            {physicsUnits.map((unit) => (
              <div key={unit.number} className={`card lg:card-side bg-base-100 shadow-lg border-l-4 ${unit.highlight ? 'border-secondary' : 'border-primary'}`}>
                <div className="card-body">
                  <div className="flex items-center gap-4">
                    <div className={`badge badge-lg ${unit.highlight ? 'badge-secondary' : 'badge-primary'}`}>Unit {unit.number}</div>
                    <h3 className="card-title text-2xl">{unit.title}</h3>
                    {unit.highlight && (
                      <div className="badge badge-outline badge-secondary">New for 2023-2025</div>
                    )}
                  </div>
                  
                  <p className="mt-2 lg:pr-10">{unit.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <h4 className="font-semibold text-sm uppercase text-primary opacity-80 tracking-wider mb-2">Topics Covered</h4>
                      <ul className="space-y-1">
                        {unit.topics.map((topic, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${unit.highlight ? 'text-secondary' : 'text-primary'} shrink-0 mt-0.5`} viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm uppercase text-primary opacity-80 tracking-wider mb-2">Course Structure</h4>
                        <div className="flex flex-wrap gap-2">
                          <div className="badge badge-outline">{unit.lessons} Lessons</div>
                          <div className="badge badge-outline">1 Comprehensive Exam</div>
                          <div className="badge badge-outline">{unit.examTopics}</div>
                        </div>
                      </div>
                      
                      <div className="card-actions justify-end mt-2">
                        <Link href={`/courses/${unit.slug}`} className={`btn btn-sm ${unit.highlight ? 'btn-secondary' : 'btn-primary'}`}>
                          Unit Details
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

      {/* Learning Approach */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Our Learning Approach</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              We combine proven teaching methods with personalized attention to ensure mastery of AP Physics concepts.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card bg-base-100 shadow-md">
              <div className="card-body">
                <h3 className="card-title text-primary">Concept Mastery</h3>
                <p>
                  Our approach emphasizes deep conceptual understanding rather than mere memorization. Students learn to think like physicists, applying principles to diverse problem scenarios.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Conceptual frameworks explained through multiple modalities</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Visual representations for abstract concepts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Real-world applications of physical principles</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-md">
              <div className="card-body">
                <h3 className="card-title text-primary">Problem-Solving Strategies</h3>
                <p>
                  Students develop systematic approaches to tackle complex physics problems, learning techniques that apply across different question types on the AP exam.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Step-by-step problem decomposition techniques</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Practice with AP-style multiple choice and free response questions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Error analysis and test-taking strategies</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-md">
              <div className="card-body">
                <h3 className="card-title text-primary">Personalized Assessment</h3>
                <p>
                  Regular feedback and detailed performance analysis help students identify strengths and areas for improvement throughout the course.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Comprehensive unit exams with detailed feedback</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>PDF reports analyzing performance by topic and concept</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Targeted review sessions based on assessment results</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-md">
              <div className="card-body">
                <h3 className="card-title text-primary">Accessible to All Learners</h3>
                <p>
                  Our curriculum is designed to make AP Physics concepts accessible to students of diverse backgrounds and learning styles, including English language learners.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Visual teaching methods that transcend language barriers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Accommodations for different learning styles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Clear, jargon-free explanations of complex concepts</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 bg-base-100">
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
                    <span>Private 55-minute Zoom sessions</span>
                  </li>
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
                    <span>Homework assistance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Direct access to instructor</span>
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
                    <span>Detailed progress reports</span>
                  </li>
                </ul>
                
                <div className="card-actions justify-end mt-6">
                  <Link href="/booking/individual" className="btn btn-primary w-full">
                    Book Now
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
                    <span>55-minute Zoom sessions</span>
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
                    <span>Collaborative learning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Affordable rates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Comprehensive unit exams</span>
                  </li>
                </ul>
                
                <div className="card-actions justify-end mt-6">
                  <Link href="/booking/group" className="btn btn-outline btn-primary w-full">
                    Book Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Get answers to common questions about our AP Physics 1 courses.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="collapse collapse-plus bg-base-100 mb-4">
              <input type="radio" name="faq-accordion" checked="checked" /> 
              <div className="collapse-title text-xl font-medium">
                How is the 2023-2025 AP Physics 1 exam different?
              </div>
              <div className="collapse-content"> 
                <p>The updated AP Physics 1 exam now includes a unit on Fluid Mechanics, covering topics like pressure, buoyancy, and fluid dynamics. Our curriculum has been fully revised to include comprehensive coverage of this new content area, ensuring students are prepared for all aspects of the exam.</p>
              </div>
            </div>
            
            <div className="collapse collapse-plus bg-base-100 mb-4">
              <input type="radio" name="faq-accordion" /> 
              <div className="collapse-title text-xl font-medium">
                Do I need prior physics knowledge to take this course?
              </div>
              <div className="collapse-content"> 
                <p>No prior physics knowledge is required. Our curriculum is designed to build concepts from the ground up. However, students should have completed or be concurrently enrolled in Algebra II, as the course requires algebraic manipulation and basic trigonometry.</p>
              </div>
            </div>
            
            <div className="collapse collapse-plus bg-base-100 mb-4">
              <input type="radio" name="faq-accordion" /> 
              <div className="collapse-title text-xl font-medium">
                How are the online sessions conducted?
              </div>
              <div className="collapse-content"> 
                <p>All sessions are conducted via Zoom with interactive features like shared whiteboards, digital annotations, and collaborative problem-solving tools. Students receive class materials in advance and have access to recordings of the sessions for review purposes.</p>
              </div>
            </div>
            
            <div className="collapse collapse-plus bg-base-100 mb-4">
              <input type="radio" name="faq-accordion" /> 
              <div className="collapse-title text-xl font-medium">
                What materials are provided with the course?
              </div>
              <div className="collapse-content"> 
                <p>Students receive comprehensive digital course materials including lesson guides, practice problems, laboratory activities, assessment materials, and detailed solution keys. Additionally, students get access to our digital resource library with supplementary videos and interactive simulations.</p>
              </div>
            </div>
            
            <div className="collapse collapse-plus bg-base-100">
              <input type="radio" name="faq-accordion" /> 
              <div className="collapse-title text-xl font-medium">
                How do the unit assessments work?
              </div>
              <div className="collapse-content"> 
                <p>Each unit concludes with a comprehensive assessment featuring both multiple-choice and free-response questions modeled after the AP exam format. Students receive detailed feedback through a PDF report that analyzes performance by topic and concept, identifying strengths and areas for improvement. This assessment is included at no additional cost.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 bg-primary text-primary-content">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Excel in AP Physics 1?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our expert-led sessions and build the knowledge and confidence you need to succeed on the updated AP Physics 1 exam.
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
