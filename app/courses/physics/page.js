import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Physics Courses | AP Physics 1, 2, C Mechanics & E&M',
  description: 'Master AP Physics with expert tutoring in AP Physics 1, AP Physics 2, AP Physics C: Mechanics, and AP Physics C: Electricity & Magnetism. From algebra-based to calculus-based physics.',
  keywords: 'AP Physics, physics tutoring, AP Physics 1, AP Physics 2, AP Physics C, mechanics, electromagnetism, physics education',
};

export default function PhysicsPage() {
  const courseData = [
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
      note: "Updated for 2023-2025 with new Fluids unit"
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
      color: "secondary",
      badge: "Most Rigorous"
    }
  ];

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      "Foundational": "badge-success",
      "Intermediate": "badge-warning", 
      "Advanced": "badge-error"
    };
    return badges[difficulty] || "badge-neutral";
  };

  const pathwayData = [
    {
      title: "Engineering & Physical Sciences Track",
      description: "Optimal pathway for students pursuing engineering, physics, or technical fields",
      steps: [
        { step: 1, course: "AP Physics 1", note: "Fundamental mechanics & waves" },
        { step: 2, course: "AP Physics C: Mechanics", note: "Calculus-based mechanics" },
        { step: 3, course: "AP Physics C: E&M", note: "Advanced electromagnetism" },
        { step: 4, course: "College: Advanced Physics", note: "Quantum mechanics, relativity" }
      ],
      color: "secondary"
    },
    {
      title: "Life Sciences & Pre-Med Track",
      description: "Comprehensive physics foundation for biology, chemistry, and medical studies",
      steps: [
        { step: 1, course: "AP Physics 1", note: "Mechanics and wave fundamentals" },
        { step: 2, course: "AP Physics 2", note: "Thermodynamics & modern physics" },
        { step: 3, course: "Other AP Sciences", note: "Chemistry, Biology focus" },
        { step: 4, course: "College: Biophysics/Medical Physics", note: "Applied physics in life sciences" }
      ],
      color: "primary"
    }
  ];

  const labTopics = [
    {
      title: "Mechanics Labs",
      description: "Hands-on exploration of motion, forces, and energy",
      experiments: ["Projectile Motion", "Conservation of Energy", "Rotational Dynamics", "Oscillations"],
      icon: "⚙️"
    },
    {
      title: "Waves & Sound",
      description: "Investigation of wave properties and acoustic phenomena",
      experiments: ["Standing Waves", "Interference Patterns", "Doppler Effect", "Resonance"],
      icon: "〰️"
    },
    {
      title: "Electricity & Magnetism",
      description: "Circuit analysis and electromagnetic field exploration",
      experiments: ["DC Circuits", "Capacitor Charging", "Magnetic Fields", "Electromagnetic Induction"],
      icon: "⚡"
    },
    {
      title: "Modern Physics",
      description: "Quantum mechanics and atomic physics investigations",
      experiments: ["Photoelectric Effect", "Black Body Radiation", "Atomic Spectra", "Radioactive Decay"],
      icon: "🔬"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary/10 to-secondary/5 py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="badge badge-secondary mb-4">Physics Department</div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">AP Physics Courses</h1>
              <p className="text-lg mb-6">
                Explore the fundamental laws that govern our universe. From classical mechanics to quantum phenomena, 
                our comprehensive physics curriculum builds scientific reasoning skills and prepares students for 
                advanced study in engineering, physics, and related STEM fields.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link href="#courses" className="btn btn-secondary">Explore Courses</Link>
                <Link href="/booking/individual" className="btn btn-outline btn-secondary">Start Learning</Link>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative w-full h-80">
                <Image 
                  src="/physics-hero.svg" 
                  alt="AP Physics education illustration" 
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Physics Overview Stats */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="bg-base-100 rounded-lg shadow-md p-6">
            <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div className="stat-title">Physics Courses</div>
                <div className="stat-value">4</div>
                <div className="stat-desc">Algebra & Calculus-based</div>
              </div>
              
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <div className="stat-title">Lab Experiments</div>
                <div className="stat-value">50+</div>
                <div className="stat-desc">Hands-on investigations</div>
              </div>
              
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div className="stat-title">Success Rate</div>
                <div className="stat-value">92%</div>
                <div className="stat-desc">Students scoring 4 or 5</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                  </svg>
                </div>
                <div className="stat-title">Engineering Prep</div>
                <div className="stat-value">85%</div>
                <div className="stat-desc">Continue to engineering</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Cards */}
      <section className="py-16 bg-base-100" id="courses">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Our Physics Courses</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              From algebra-based fundamentals to calculus-based advanced study, our physics curriculum 
              develops scientific reasoning and problem-solving skills essential for STEM success.
            </p>
          </div>
          
          <div className="space-y-6">
            {courseData.map((course, index) => (
              <div key={index} className={`card lg:card-side bg-base-100 shadow-lg border-l-4 ${course.highlight ? 'border-accent' : 'border-secondary'}`}>
                <div className="card-body">
                  <div className="flex items-center gap-4 flex-wrap">
                    <h3 className="card-title text-2xl">{course.title}</h3>
                    <div className={`badge ${getDifficultyBadge(course.difficulty)}`}>{course.difficulty}</div>
                    {course.highlight && (
                      <div className="badge badge-accent">Updated 2023-2025</div>
                    )}
                    {course.badge && (
                      <div className="badge badge-error">{course.badge}</div>
                    )}
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

      {/* Laboratory Experience */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Laboratory Experience</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Physics is an experimental science. Our comprehensive lab program develops investigation skills 
              and deepens understanding through hands-on exploration.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {labTopics.map((lab, index) => (
              <div key={index} className="card bg-base-100 shadow-lg">
                <div className="card-body text-center">
                  <div className="text-4xl mb-4">{lab.icon}</div>
                  <h3 className="card-title justify-center text-lg mb-3">{lab.title}</h3>
                  <p className="text-sm mb-4">{lab.description}</p>
                  <div className="space-y-1">
                    {lab.experiments.map((experiment, i) => (
                      <div key={i} className="badge badge-outline badge-sm">{experiment}</div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Pathways */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Physics Learning Pathways</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Choose the pathway that aligns with your academic goals and career aspirations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {pathwayData.map((pathway, index) => (
              <div key={index} className={`card bg-gradient-to-br ${index === 0 ? 'from-orange-50 to-orange-100 border-orange-200' : 'from-green-50 to-green-100 border-green-200'} shadow-lg border`}>
                <div className="card-body">
                  <h3 className={`card-title ${index === 0 ? 'text-secondary' : 'text-primary'} text-xl`}>{pathway.title}</h3>
                  <p className="text-sm text-base-content/70 mb-4">{pathway.description}</p>
                  <div className="space-y-3">
                    {pathway.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-center gap-3">
                        <div className={`badge ${index === 0 ? 'badge-secondary' : 'badge-primary'} badge-sm`}>{step.step}</div>
                        <div className="flex-1">
                          <span className="font-medium">{step.course}</span>
                          <p className="text-xs text-base-content/60">{step.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Our Physics Program */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Why Choose Our Physics Program?</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Our physics curriculum emphasizes conceptual understanding, mathematical modeling, 
              and experimental investigation to prepare students for advanced STEM study.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">🔬</div>
                <h3 className="card-title justify-center text-xl mb-3">Inquiry-Based Learning</h3>
                <p>Learn physics through investigation and discovery, not just memorization of formulas.</p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="card-title justify-center text-xl mb-3">Mathematical Modeling</h3>
                <p>Develop skills in using mathematics to describe and predict physical phenomena.</p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="card-title justify-center text-xl mb-3">Real-World Applications</h3>
                <p>Connect physics principles to engineering, technology, and everyday phenomena.</p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">🧠</div>
                <h3 className="card-title justify-center text-xl mb-3">Problem-Solving Skills</h3>
                <p>Develop systematic approaches to analyzing and solving complex physics problems.</p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="card-title justify-center text-xl mb-3">Exam Success</h3>
                <p>Proven track record with 92% of students scoring 4 or 5 on AP Physics exams.</p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="card-title justify-center text-xl mb-3">STEM Preparation</h3>
                <p>Build the foundation for success in engineering, physics, and other technical fields.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-secondary text-secondary-content">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Explore the Universe Through Physics?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our comprehensive physics program and discover the fundamental principles that govern 
            everything from subatomic particles to galaxies. Build the skills for STEM success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn btn-primary">
              Schedule Free Consultation
            </Link>
            <Link href="/booking/individual" className="btn bg-white text-secondary hover:bg-base-200">
              Start Learning Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
