import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'AP Physics C: Mechanics | Calculus-Based Physics',
  description: 'Master calculus-based mechanics with AP Physics C: Mechanics. Explore advanced kinematics, dynamics, energy, momentum, rotation, and oscillations for engineering preparation.',
  keywords: 'AP Physics C Mechanics, calculus-based physics, advanced mechanics, engineering physics, rotational dynamics',
};

export default function APPhysicsCMechanics() {
  const unitData = [
    {
      title: "Kinematics",
      description: "Master the calculus-based study of motion, analyzing position, velocity, and acceleration using derivatives and integrals.",
      examWeight: "10%–15% of exam score",
      topics: [
        "One-dimensional kinematics with calculus",
        "Two-dimensional projectile motion",
        "Parametric motion analysis",
        "Velocity and acceleration as derivatives",
        "Position from integration of motion functions"
      ],
      icon: "📍"
    },
    {
      title: "Force and Translational Dynamics",
      description: "Apply Newton's laws with calculus to analyze complex force systems and dynamic situations.",
      examWeight: "20%–25% of exam score",
      topics: [
        "Center of mass and multi-particle systems",
        "Complex systems analysis",
        "Newton's First and Second Laws with calculus",
        "Circular motion and centripetal acceleration",
        "Newton's Third Law and interaction forces",
        "Universal gravitation and field theory"
      ],
      icon: "⚡"
    },
    {
      title: "Work, Energy, and Power",
      description: "Explore work-energy relationships using calculus to analyze conservative and non-conservative forces.",
      examWeight: "15%–25% of exam score",
      topics: [
        "Work-energy theorem with calculus",
        "Conservative forces and potential energy",
        "Energy conservation in complex systems",
        "Power as time rate of energy transfer",
        "Variable force work calculations"
      ],
      icon: "🔋"
    },
    {
      title: "Linear Momentum",
      description: "Analyze momentum and impulse using calculus for complex collision and interaction scenarios.",
      examWeight: "10%–20% of exam score",
      topics: [
        "Impulse-momentum theorem with calculus",
        "Conservation of linear momentum",
        "Elastic and inelastic collision analysis",
        "Variable mass systems",
        "Center of mass motion"
      ],
      icon: "🎱"
    },
    {
      title: "Torque and Rotational Dynamics",
      description: "Master rotational motion using calculus to analyze torque, rotational inertia, and angular acceleration.",
      examWeight: "10%–15% of exam score",
      topics: [
        "Torque and rotational equilibrium",
        "Rotational kinematics with calculus",
        "Rotational dynamics and moment of inertia",
        "Newton's Second Law for rotation",
        "Angular energy relationships"
      ],
      icon: "🌀"
    },
    {
      title: "Energy and Momentum of Rotating Systems",
      description: "Analyze rotational kinetic energy and angular momentum in complex rotating systems.",
      examWeight: "10%–15% of exam score",
      topics: [
        "Rotational kinetic energy calculations",
        "Angular momentum and conservation",
        "Rolling motion without slipping",
        "Orbital mechanics and Kepler's laws",
        "Combined translational and rotational motion"
      ],
      icon: "🪐"
    },
    {
      title: "Oscillations",
      description: "Apply calculus to analyze simple harmonic motion, pendulums, and complex oscillating systems.",
      examWeight: "10%–15% of exam score",
      topics: [
        "Simple harmonic motion with differential equations",
        "Simple pendulum analysis",
        "Physical pendulum systems",
        "Energy in oscillating systems",
        "Damped and driven oscillations"
      ],
      icon: "〰️"
    }
  ];

  const calculusSkills = [
    {
      title: "Differential Calculus",
      description: "Use derivatives to analyze velocity, acceleration, and rates of change in physical systems.",
      applications: ["v = dx/dt", "a = dv/dt", "Variable force analysis"],
      icon: "d/dx"
    },
    {
      title: "Integral Calculus",
      description: "Apply integrals to calculate work, displacement, and accumulated quantities in physics.",
      applications: ["Work = ∫F·dx", "x = ∫v dt", "Center of mass"],
      icon: "∫"
    },
    {
      title: "Differential Equations",
      description: "Solve differential equations that govern oscillatory motion and dynamic systems.",
      applications: ["SHM equations", "Newton's laws", "Conservation laws"],
      icon: "d²x/dt²"
    }
  ];

  const engineeringConnections = [
    {
      title: "Mechanical Engineering",
      applications: ["Machine dynamics", "Structural analysis", "Vibration control"],
      icon: "⚙️"
    },
    {
      title: "Aerospace Engineering", 
      applications: ["Flight dynamics", "Orbital mechanics", "Control systems"],
      icon: "🚀"
    },
    {
      title: "Civil Engineering",
      applications: ["Structural dynamics", "Earthquake analysis", "Bridge design"],
      icon: "🏗️"
    },
    {
      title: "Robotics Engineering",
      applications: ["Robot kinematics", "Control algorithms", "Motion planning"],
      icon: "🤖"
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
                <div className="badge badge-error">Advanced</div>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">AP Physics C: Mechanics</h1>
              <p className="text-lg mb-6">
                Master the mathematical foundations of classical mechanics using calculus. Develop sophisticated 
                analytical skills essential for engineering and advanced physics study through rigorous exploration 
                of motion, forces, energy, and rotational dynamics.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link href="/booking/individual" className="btn btn-secondary">Start Learning</Link>
                <Link href="/contact" className="btn btn-outline btn-secondary">Ask Questions</Link>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative w-full h-80">
                <Image 
                  src="/physics-c-mechanics-hero.svg" 
                  alt="AP Physics C Mechanics calculus-based concepts" 
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
                  AP Physics C: Mechanics represents the pinnacle of high school physics education, providing students 
                  with a rigorous, calculus-based exploration of classical mechanics. This course mirrors the content 
                  and mathematical sophistication of first-year college engineering physics.
                </p>
                <p>
                  Students develop advanced problem-solving skills by applying differential and integral calculus to 
                  analyze complex physical systems. The course emphasizes mathematical modeling, analytical thinking, 
                  and the deep connections between physics principles and engineering applications.
                </p>
                <div className="alert alert-warning">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  <span><strong>Advanced Mathematics Required:</strong> Concurrent enrollment in calculus is essential for success.</span>
                </div>
              </div>
            </div>
            <div className="bg-base-200 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Course Details</h3>
              <div className="space-y-4">
                <div>
                  <div className="font-semibold text-sm uppercase text-secondary opacity-80">Difficulty Level</div>
                  <div className="badge badge-error">Advanced</div>
                </div>
                <div>
                  <div className="font-semibold text-sm uppercase text-secondary opacity-80">Prerequisites</div>
                  <div>Physics foundation + Calculus (concurrent OK)</div>
                </div>
                <div>
                  <div className="font-semibold text-sm uppercase text-secondary opacity-80">College Equivalent</div>
                  <div>First-semester calculus-based physics</div>
                </div>
                <div>
                  <div className="font-semibold text-sm uppercase text-secondary opacity-80">Mathematical Approach</div>
                  <div>Differential and integral calculus</div>
                </div>
                <div>
                  <div className="font-semibold text-sm uppercase text-secondary opacity-80">Course Units</div>
                  <div>7 intensive units</div>
                </div>
                <div>
                  <div className="font-semibold text-sm uppercase text-secondary opacity-80">Target Students</div>
                  <div>Engineering-bound students</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Calculus Applications */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Calculus in Physics</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Experience how calculus provides the mathematical language for describing and analyzing physical phenomena.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {calculusSkills.map((skill, index) => (
              <div key={index} className="card bg-base-100 shadow-lg">
                <div className="card-body text-center">
                  <div className="text-4xl mb-4 font-mono font-bold text-secondary">{skill.icon}</div>
                  <h3 className="card-title justify-center text-xl mb-3">{skill.title}</h3>
                  <p className="mb-4">{skill.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Applications:</h4>
                    {skill.applications.map((app, i) => (
                      <div key={i} className="badge badge-outline badge-sm font-mono">{app}</div>
                    ))}
                  </div>
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
              Seven comprehensive units covering all aspects of classical mechanics with calculus-based analysis.
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

      {/* Engineering Applications */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Engineering Applications</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              See how AP Physics C: Mechanics concepts directly apply to real-world engineering challenges and innovations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {engineeringConnections.map((field, index) => (
              <div key={index} className="card bg-base-100 shadow-lg">
                <div className="card-body text-center">
                  <div className="text-4xl mb-4">{field.icon}</div>
                  <h3 className="card-title justify-center text-lg mb-3">{field.title}</h3>
                  <div className="space-y-2">
                    {field.applications.map((app, i) => (
                      <div key={i} className="badge badge-outline badge-sm">{app}</div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <div className="card bg-gradient-to-r from-blue-100 to-purple-100 shadow-lg border border-blue-200 max-w-4xl mx-auto">
              <div className="card-body">
                <h3 className="card-title justify-center text-2xl mb-4">Engineering Career Preparation</h3>
                <p className="mb-4">
                  AP Physics C: Mechanics provides the mathematical and analytical foundation essential for success 
                  in competitive engineering programs at top universities.
                </p>
                <div className="stats stats-vertical lg:stats-horizontal">
                  <div className="stat">
                    <div className="stat-title">Engineering Students</div>
                    <div className="stat-value text-secondary">85%</div>
                    <div className="stat-desc">continue to engineering majors</div>
                  </div>
                  <div className="stat">
                    <div className="stat-title">College Credit</div>
                    <div className="stat-value text-secondary">5+ hrs</div>
                    <div className="stat-desc">typical college credit earned</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem-Solving Approach */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Advanced Problem-Solving</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Develop sophisticated analytical skills through systematic approaches to complex physics problems.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-xl mb-4">Mathematical Analysis Process</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="badge badge-secondary">1</div>
                    <div>
                      <h4 className="font-semibold">Define the System</h4>
                      <p className="text-sm text-base-content/70">Identify objects, forces, and constraints</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="badge badge-secondary">2</div>
                    <div>
                      <h4 className="font-semibold">Apply Physical Principles</h4>
                      <p className="text-sm text-base-content/70">Choose appropriate laws and conservation principles</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="badge badge-secondary">3</div>
                    <div>
                      <h4 className="font-semibold">Set Up Mathematics</h4>
                      <p className="text-sm text-base-content/70">Write equations using calculus when needed</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="badge badge-secondary">4</div>
                    <div>
                      <h4 className="font-semibold">Solve and Interpret</h4>
                      <p className="text-sm text-base-content/70">Calculate results and check physical meaning</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-xl mb-4">Sample Problem Types</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-base-200 rounded">
                    <h4 className="font-semibold text-sm">Variable Force Motion</h4>
                    <p className="text-xs">F = kx², find velocity using calculus</p>
                  </div>
                  <div className="p-3 bg-base-200 rounded">
                    <h4 className="font-semibold text-sm">Rotation + Translation</h4>
                    <p className="text-xs">Rolling objects with slipping analysis</p>
                  </div>
                  <div className="p-3 bg-base-200 rounded">
                    <h4 className="font-semibold text-sm">Orbital Mechanics</h4>
                    <p className="text-xs">Satellite motion with varying masses</p>
                  </div>
                  <div className="p-3 bg-base-200 rounded">
                    <h4 className="font-semibold text-sm">Oscillatory Systems</h4>
                    <p className="text-xs">Differential equation solutions for SHM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prerequisites & Success Strategies */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Prerequisites & Preparation</h2>
              <div className="space-y-4">
                <div className="alert alert-error">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  <span>Strong physics foundation and calculus knowledge are absolutely essential</span>
                </div>
                
                <p className="mb-4">Students must have mastery of:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Differential calculus</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Integral calculus</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Vector analysis</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Basic physics concepts</span>
                    </li>
                  </ul>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Trigonometric functions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Advanced algebra</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Differential equations basics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Strong analytical thinking</span>
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
                    <h3 className="card-title text-lg">🧮 Master the Mathematics</h3>
                    <p>Ensure strong calculus skills. Practice derivatives and integrals until they become second nature.</p>
                  </div>
                </div>
                
                <div className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <h3 className="card-title text-lg">🎯 Think Like an Engineer</h3>
                    <p>Focus on systematic problem-solving approaches and mathematical modeling techniques.</p>
                  </div>
                </div>
                
                <div className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <h3 className="card-title text-lg">🔄 Connect Concepts</h3>
                    <p>See how each unit builds upon previous knowledge. Mechanics is beautifully interconnected.</p>
                  </div>
                </div>
                
                <div className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <h3 className="card-title text-lg">⏰ Practice Regularly</h3>
                    <p>Work challenging problems daily. Build speed and accuracy with complex calculations.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning Pathway */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Your Engineering Physics Journey</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              See how AP Physics C: Mechanics prepares you for advanced engineering study and technical careers.
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="card bg-base-200 shadow-md">
              <div className="card-body text-center">
                <h3 className="card-title justify-center">Foundation</h3>
                <p>Physics + Calculus</p>
              </div>
            </div>
            
            <div className="text-secondary text-2xl">→</div>
            
            <div className="card bg-secondary text-secondary-content shadow-lg">
              <div className="card-body text-center">
                <h3 className="card-title justify-center">Current Course</h3>
                <p>AP Physics C: Mechanics</p>
              </div>
            </div>
            
            <div className="text-secondary text-2xl">→</div>
            
            <div className="card bg-base-200 shadow-md">
              <div className="card-body text-center">
                <h3 className="card-title justify-center">Next Steps</h3>
                <p>Engineering Programs, Advanced Physics, Research</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-secondary text-secondary-content">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready for Advanced Physics?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Master calculus-based mechanics and build the analytical foundation essential for engineering success. 
            Take your physics understanding to the professional level.
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
