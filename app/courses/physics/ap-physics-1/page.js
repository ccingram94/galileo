import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'AP Physics 1: Algebra-Based | Comprehensive Physics Foundation',
  description: 'Master fundamental physics concepts with AP Physics 1. Explore mechanics, waves, and energy through hands-on laboratory investigations using algebra-based approaches.',
  keywords: 'AP Physics 1, algebra-based physics, mechanics, kinematics, dynamics, energy, momentum, physics tutoring',
};

export default function APPhysics1() {
  const unitData = [
    {
      title: "Kinematics",
      description: "Master the fundamental study of motion in one and two dimensions using mathematical relationships.",
      examWeight: "10%–15% of exam score",
      topics: [
        "Scalars and vectors in one dimension",
        "Displacement, velocity, and acceleration",
        "Representing motion graphically",
        "Reference frames and relative motion",
        "Vectors and motion in two dimensions"
      ],
      icon: "📍"
    },
    {
      title: "Force and Translational Dynamics",
      description: "Explore forces as interactions between objects and apply Newton's laws to analyze motion.",
      examWeight: "18%–23% of exam score",
      topics: [
        "Systems and center of mass",
        "Forces and free-body diagrams",
        "Newton's Three Laws of Motion",
        "Gravitational and friction forces",
        "Spring forces and circular motion"
      ],
      icon: "⚡"
    },
    {
      title: "Work, Energy, and Power",
      description: "Understand the relationships between work, energy, and power in mechanical systems.",
      examWeight: "18%–23% of exam score",
      topics: [
        "Translational kinetic energy",
        "Work done by forces",
        "Gravitational and elastic potential energy",
        "Conservation of mechanical energy",
        "Power and energy transfer rates"
      ],
      icon: "🔋"
    },
    {
      title: "Linear Momentum",
      description: "Analyze collisions and interactions using momentum conservation principles.",
      examWeight: "10%–15% of exam score",
      topics: [
        "Linear momentum and impulse",
        "Change in momentum over time",
        "Conservation of linear momentum",
        "Elastic and inelastic collisions",
        "Center of mass motion"
      ],
      icon: "🎱"
    },
    {
      title: "Torque and Rotational Dynamics",
      description: "Apply rotational analogs to Newton's laws for analyzing rotating bodies.",
      examWeight: "10%–15% of exam score",
      topics: [
        "Rotational kinematics and angular quantities",
        "Connecting linear and rotational motion",
        "Torque as rotational force",
        "Rotational inertia and mass distribution",
        "Rotational equilibrium and Newton's laws"
      ],
      icon: "🌀"
    },
    {
      title: "Energy and Momentum of Rotating Systems",
      description: "Explore rotational energy and angular momentum in complex systems.",
      examWeight: "5%–8% of exam score",
      topics: [
        "Rotational kinetic energy",
        "Work done by torques",
        "Angular momentum and angular impulse",
        "Conservation of angular momentum",
        "Rolling motion and satellite orbits"
      ],
      icon: "🪐"
    },
    {
      title: "Oscillations",
      description: "Analyze simple harmonic motion and periodic phenomena in physical systems.",
      examWeight: "5%–8% of exam score",
      topics: [
        "Defining simple harmonic motion (SHM)",
        "Frequency, period, and amplitude",
        "Graphical representations of SHM",
        "Energy in simple harmonic oscillators",
        "Springs and pendulum systems"
      ],
      icon: "〰️"
    },
    {
      title: "Fluids",
      description: "Investigate the behavior of liquids and gases and their interactions with objects.",
      examWeight: "10%–15% of exam score",
      topics: [
        "Internal structure and density",
        "Pressure in static and moving fluids",
        "Fluids and Newton's laws",
        "Buoyancy and Archimedes' principle",
        "Fluid flow and conservation laws"
      ],
      icon: "🌊"
    }
  ];

  const skillsData = [
    {
      title: "Physical Representations",
      description: "Create and interpret diagrams, graphs, and mathematical models that depict physical phenomena.",
      icon: "📊"
    },
    {
      title: "Mathematical Analysis",
      description: "Conduct quantitative analyses to derive relationships, calculate values, and predict outcomes.",
      icon: "🧮"
    },
    {
      title: "Experimental Design",
      description: "Design procedures, analyze data, and support scientific claims through laboratory investigations.",
      icon: "🔬"
    }
  ];

  const labHighlights = [
    {
      title: "Motion Analysis Lab",
      description: "Use motion sensors and video analysis to investigate kinematics",
      equipment: "Motion detectors, video cameras, tracking software"
    },
    {
      title: "Force Investigation",
      description: "Explore Newton's laws using force sensors and dynamics carts",
      equipment: "Force sensors, dynamics tracks, spring scales"
    },
    {
      title: "Energy Conservation",
      description: "Investigate energy transformations in mechanical systems",
      equipment: "Pendulums, springs, ramps, energy analysis tools"
    },
    {
      title: "Collision Analysis",
      description: "Study momentum conservation in elastic and inelastic collisions",
      equipment: "Air tracks, collision carts, motion sensors"
    },
    {
      title: "Rotational Motion",
      description: "Analyze rotational dynamics using spinning disks and torque apparatus",
      equipment: "Rotational motion sensors, moment of inertia apparatus"
    },
    {
      title: "Fluid Mechanics",
      description: "Investigate buoyancy, pressure, and fluid flow phenomena",
      equipment: "Fluid containers, pressure sensors, density materials"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-secondary/10 to-secondary/5 py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="flex items-center gap-3 mb-4">
                <Link href="/courses/physics" className="text-secondary hover:underline">
                  ← Back to Physics Courses
                </Link>
              </div>
              <div className="flex gap-2 mb-4">
                <div className="badge badge-secondary">Physics</div>
                <div className="badge badge-accent">Updated 2023-2025</div>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">AP Physics 1: Algebra-Based</h1>
              <p className="text-lg mb-6">
                Discover the fundamental principles that govern motion, forces, and energy. Through hands-on laboratory 
                investigations and mathematical analysis, explore questions about floating objects, bicycle balance, 
                and relative motion that connect physics to everyday experiences.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link href="/booking/individual" className="btn btn-secondary">Start Learning</Link>
                <Link href="/contact" className="btn btn-outline btn-secondary">Ask Questions</Link>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative w-full h-80">
                <Image 
                  src="/physics-1-hero.svg" 
                  alt="AP Physics 1 concepts and laboratory equipment" 
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Overview */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h2 className="text-3xl font-bold mb-6">Course Overview</h2>
              <div className="prose prose-lg max-w-none">
                <p>
                  AP Physics 1: Algebra-Based provides students with a comprehensive foundation in classical mechanics, 
                  wave phenomena, and basic electricity. This inquiry-based course emphasizes hands-on laboratory 
                  investigations and mathematical modeling using algebra and trigonometry.
                </p>
                <p>
                  Students develop scientific reasoning skills through systematic investigation of physical phenomena, 
                  learning to design experiments, analyze data, and construct evidence-based explanations. The course 
                  connects abstract physical principles to real-world applications and everyday experiences.
                </p>
                <div className="alert alert-info">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span><strong>2024-25 Updates:</strong> Revised course includes enhanced fluids unit and updated laboratory investigations.</span>
                </div>
              </div>
            </div>
            <div className="bg-base-200 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Course Details</h3>
              <div className="space-y-4">
                <div>
                  <div className="font-semibold text-sm uppercase text-secondary opacity-80">Exam Date</div>
                  <div className="text-lg">May 16, 2025 • 8:00 AM</div>
                </div>
                <div>
                  <div className="font-semibold text-sm uppercase text-secondary opacity-80">Difficulty Level</div>
                  <div className="badge badge-success">Foundational</div>
                </div>
                <div>
                  <div className="font-semibold text-sm uppercase text-secondary opacity-80">Prerequisites</div>
                  <div>Geometry, Algebra II (concurrent OK)</div>
                </div>
                <div>
                  <div className="font-semibold text-sm uppercase text-secondary opacity-80">College Equivalent</div>
                  <div>First-semester introductory algebra-based physics</div>
                </div>
                <div>
                  <div className="font-semibold text-sm uppercase text-secondary opacity-80">Mathematical Approach</div>
                  <div>Algebra and trigonometry-based</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Skills */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Essential Physics Skills</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Develop the scientific reasoning and analytical skills essential for understanding physical phenomena.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {skillsData.map((skill, index) => (
              <div key={index} className="card bg-base-100 shadow-lg">
                <div className="card-body text-center">
                  <div className="text-4xl mb-4">{skill.icon}</div>
                  <h3 className="card-title justify-center text-xl mb-3">{skill.title}</h3>
                  <p>{skill.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Course Units */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Course Content & Units</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Eight comprehensive units covering fundamental physics concepts from motion to fluid mechanics.
            </p>
          </div>
          
          <div className="space-y-8">
            {unitData.map((unit, index) => (
              <div key={index} className="card bg-base-100 shadow-lg border-l-4 border-secondary">
                <div className="card-body">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    <div className="lg:w-full">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-3xl">{unit.icon}</span>
                        <div>
                          <h3 className="text-2xl font-bold">Unit {index + 1}: {unit.title}</h3>
                          <div className="badge badge-secondary mt-1">{unit.examWeight}</div>
                        </div>
                      </div>
                      
                      <p className="mb-4 text-base-content/80">{unit.description}</p>
                      
                      <div>
                        <h4 className="font-semibold mb-3">Key Topics:</h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {unit.topics.map((topic, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="text-sm">{topic}</span>
                            </li>
                          ))}
                        </ul>
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
            <h2 className="text-3xl font-bold">Hands-On Laboratory Investigations</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Physics is an experimental science. Our comprehensive laboratory program develops investigation 
              skills and deepens conceptual understanding through direct experience.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {labHighlights.map((lab, index) => (
              <div key={index} className="card bg-base-100 shadow-lg">
                <div className="card-body">
                  <h3 className="card-title text-lg mb-3">{lab.title}</h3>
                  <p className="text-sm mb-4">{lab.description}</p>
                  <div className="text-xs text-base-content/70">
                    <span className="font-semibold">Equipment: </span>
                    {lab.equipment}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-100">
              <div className="stat">
                <div className="stat-title">Laboratory Hours</div>
                <div className="stat-value text-secondary">25%</div>
                <div className="stat-desc">of total course time</div>
              </div>
              
              <div className="stat">
                <div className="stat-title">Investigations</div>
                <div className="stat-value text-secondary">15+</div>
                <div className="stat-desc">hands-on experiments</div>
              </div>
              
              <div className="stat">
                <div className="stat-title">Lab Skills</div>
                <div className="stat-value text-secondary">Core</div>
                <div className="stat-desc">AP exam component</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Success Strategies */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Prerequisites & Preparation</h2>
              <div className="space-y-4">
                <div className="alert alert-info">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Geometry completion required; Algebra II concurrent enrollment acceptable</span>
                </div>
                
                <p className="mb-4">Students should be comfortable with:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Algebraic manipulation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Basic trigonometry</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Linear equations and graphs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Quadratic functions</span>
                    </li>
                  </ul>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Scientific notation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Unit conversions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Vector components</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Data analysis and graphing</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold mb-6">Success Strategies</h2>
              <div className="space-y-4">
                <div className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <h3 className="card-title text-lg">🎯 Think Conceptually</h3>
                    <p>Focus on understanding physical principles rather than memorizing formulas. Ask "why" and "how" questions.</p>
                  </div>
                </div>
                
                <div className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <h3 className="card-title text-lg">🔬 Embrace Laboratory Work</h3>
                    <p>Laboratory investigations are crucial. Practice designing experiments and analyzing real data.</p>
                  </div>
                </div>
                
                <div className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <h3 className="card-title text-lg">📊 Master Problem-Solving</h3>
                    <p>Develop systematic approaches: identify knowns/unknowns, choose appropriate models, solve, and check answers.</p>
                  </div>
                </div>
                
                <div className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <h3 className="card-title text-lg">🏃‍♂️ Practice Regularly</h3>
                    <p>Work through varied problems daily. Connect mathematical solutions to physical meanings.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Pathway */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Your Physics Journey</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              See how AP Physics 1 serves as the foundation for advanced physics study and STEM careers.
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="card bg-base-200 shadow-md">
              <div className="card-body text-center">
                <h3 className="card-title justify-center">Foundation</h3>
                <p>Geometry + Algebra II</p>
              </div>
            </div>
            
            <div className="text-secondary text-2xl">→</div>
            
            <div className="card bg-secondary text-secondary-content shadow-lg">
              <div className="card-body text-center">
                <h3 className="card-title justify-center">Current Course</h3>
                <p>AP Physics 1</p>
              </div>
            </div>
            
            <div className="text-secondary text-2xl">→</div>
            
            <div className="card bg-base-200 shadow-md">
              <div className="card-body text-center">
                <h3 className="card-title justify-center">Next Steps</h3>
                <p>AP Physics 2, AP Physics C, or Engineering</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-secondary text-secondary-content">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Discover Physics?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Start your physics journey with AP Physics 1. Develop scientific reasoning skills and explore 
            the fundamental principles that govern motion, forces, and energy in our universe.
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
