import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'AP Physics C: Electricity & Magnetism | Advanced Electromagnetic Theory',
  description: 'Master calculus-based electromagnetism with AP Physics C: E&M. Explore electric fields, circuits, magnetic fields, and electromagnetic induction for advanced engineering preparation.',
  keywords: 'AP Physics C E&M, calculus-based electromagnetism, electric fields, magnetic fields, electromagnetic induction, Gauss law, Maxwell equations',
};

export default function APPhysicsCElectricityMagnetism() {
  const unitData = [
    {
      title: "Electric Charges, Fields, and Gauss's Law",
      description: "Master electric forces and fields using calculus-based analysis including Gauss's Law applications.",
      examWeight: "15%–25% of exam score",
      topics: [
        "Coulomb's Law and electric forces",
        "Electric fields from point charges and charge combinations",
        "Electric flux and Gauss's Law fundamentals",
        "Electric fields of continuous charge distributions",
        "Field superposition and symmetry arguments"
      ],
      icon: "⚡"
    },
    {
      title: "Electric Potential",
      description: "Analyze electric potential energy and voltage using calculus to solve complex electrostatic problems.",
      examWeight: "10%–20% of exam score",
      topics: [
        "Electric potential and potential energy",
        "Potential due to point charges and uniform fields",
        "Potential from complex charge configurations",
        "Energy conservation in electrostatic systems",
        "Relationship between potential and electric field"
      ],
      icon: "🔋"
    },
    {
      title: "Conductors and Capacitors",
      description: "Explore charge movement in conductors and energy storage in capacitor systems.",
      examWeight: "10%–15% of exam score",
      topics: [
        "Electrostatic properties of conductors",
        "Electric fields at conductor surfaces",
        "Capacitance and capacitor behavior",
        "Dielectric materials and their effects",
        "Energy storage in electric fields"
      ],
      icon: "🔌"
    },
    {
      title: "Electric Circuits",
      description: "Analyze complex DC circuits using calculus-based methods for current, resistance, and power.",
      examWeight: "15%–25% of exam score",
      topics: [
        "Current density and microscopic view",
        "Resistance, resistivity, and Ohm's Law",
        "Power dissipation and energy considerations",
        "Complex DC circuit analysis with Kirchhoff's Laws",
        "RC circuits and exponential behavior"
      ],
      icon: "🔧"
    },
    {
      title: "Magnetic Fields and Electromagnetism",
      description: "Investigate magnetic field generation and forces using advanced vector calculus techniques.",
      examWeight: "10%–20% of exam score",
      topics: [
        "Magnetic forces on moving charges",
        "Forces on current-carrying wires in magnetic fields",
        "Magnetic fields from long current-carrying wires",
        "Biot-Savart Law applications",
        "Ampère's Law and magnetic field calculations"
      ],
      icon: "🧲"
    },
    {
      title: "Electromagnetic Induction",
      description: "Master Faraday's Law and electromagnetic induction phenomena using calculus-based analysis.",
      examWeight: "10%–20% of exam score",
      topics: [
        "Faraday's Law of electromagnetic induction",
        "Lenz's Law and energy conservation",
        "Motional EMF and induced electric fields",
        "Self-inductance and mutual inductance",
        "LR circuits and exponential current behavior"
      ],
      icon: "⚡🧲"
    }
  ];

  const calculusApplications = [
    {
      title: "Vector Calculus",
      description: "Apply divergence, curl, and gradient to analyze electromagnetic fields.",
      equations: ["∇ · E = ρ/ε₀", "∇ × B = μ₀J", "∮ E · dA"],
      icon: "∇"
    },
    {
      title: "Line & Surface Integrals",
      description: "Calculate work, flux, and circulation in electromagnetic field problems.",
      equations: ["∮ E · dl", "∮ B · dA", "∫ J · dA"],
      icon: "∮"
    },
    {
      title: "Differential Equations",
      description: "Solve exponential behavior in RC and LR circuit analysis.",
      equations: ["dq/dt = I", "L(dI/dt) + IR = ε", "RC(dV/dt) + V = 0"],
      icon: "d/dt"
    }
  ];

  const electromagnetismPhenomena = [
    {
      title: "Gauss's Law",
      description: "Calculate electric fields using flux and symmetry",
      applications: "Spherical, cylindrical, planar charge distributions",
      icon: "⊃⊂"
    },
    {
      title: "Ampère's Law",
      description: "Determine magnetic fields from current configurations",
      applications: "Solenoids, toroids, current sheets",
      icon: "🌀"
    },
    {
      title: "Faraday's Law",
      description: "Analyze electromagnetic induction and generated EMF",
      applications: "Generators, transformers, eddy currents",
      icon: "⚡🔄"
    },
    {
      title: "Maxwell's Equations",
      description: "Fundamental laws governing electromagnetic phenomena",
      applications: "Wave propagation, electromagnetic radiation",
      icon: "📡"
    }
  ];

  const engineeringApplications = [
    {
      title: "Electrical Engineering",
      applications: ["Circuit design", "Power systems", "Signal processing"],
      icon: "⚡"
    },
    {
      title: "Computer Engineering",
      applications: ["Semiconductor devices", "Digital circuits", "Data storage"],
      icon: "💻"
    },
    {
      title: "Telecommunications",
      applications: ["Antenna design", "Wave propagation", "Wireless systems"],
      icon: "📡"
    },
    {
      title: "Energy Systems",
      applications: ["Motors and generators", "Power transmission", "Renewable energy"],
      icon: "🔋"
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
                <div className="badge badge-error">Most Rigorous</div>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">AP Physics C: Electricity & Magnetism</h1>
              <p className="text-lg mb-6">
                Explore the mathematical elegance of electromagnetic theory using calculus. Master electric and 
                magnetic fields, circuit analysis, and electromagnetic induction to understand the physics 
                behind modern technology from smartphones to power grids.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link href="/booking/individual" className="btn btn-secondary">Start Learning</Link>
                <Link href="/contact" className="btn btn-outline btn-secondary">Ask Questions</Link>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative w-full h-80">
                <Image 
                  src="/physics-c-em-hero.svg" 
                  alt="AP Physics C E&M electromagnetic fields and equations" 
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
                  AP Physics C: Electricity and Magnetism represents the most mathematically sophisticated physics 
                  course available at the high school level. This calculus-intensive course explores electromagnetic 
                  theory with the same depth and rigor found in top engineering programs.
                </p>
                <p>
                  Students develop mastery of vector calculus, differential equations, and advanced mathematical 
                  techniques while investigating phenomena that power our technological world. From Maxwell's 
                  equations to circuit analysis, the course bridges fundamental physics with engineering applications.
                </p>
                <div className="alert alert-error">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  <span><strong>Most Challenging:</strong> This is the most rigorous physics course, requiring exceptional mathematical preparation.</span>
                </div>
              </div>
            </div>
            <div className="bg-base-200 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Course Details</h3>
              <div className="space-y-4">
                <div>
                  <div className="font-semibold text-sm uppercase text-secondary opacity-80">Exam Date</div>
                  <div className="text-lg">May 15, 2025 • 12:00 PM</div>
                </div>
                <div>
                  <div className="font-semibold text-sm uppercase text-secondary opacity-80">Difficulty Level</div>
                  <div className="badge badge-error">Most Rigorous</div>
                </div>
                <div>
                  <div className="font-semibold text-sm uppercase text-secondary opacity-80">Prerequisites</div>
                  <div>AP Physics C: Mechanics + Advanced Calculus</div>
                </div>
                <div>
                  <div className="font-semibold text-sm uppercase text-secondary opacity-80">College Equivalent</div>
                  <div>College-level calculus-based E&M</div>
                </div>
                <div>
                  <div className="font-semibold text-sm uppercase text-secondary opacity-80">Mathematical Approach</div>
                  <div>Vector calculus and differential equations</div>
                </div>
                <div>
                  <div className="font-semibold text-sm uppercase text-secondary opacity-80">Course Units</div>
                  <div>6 intensive units (Units 8-13)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Mathematics */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Advanced Mathematical Techniques</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Master sophisticated mathematical methods essential for understanding electromagnetic theory and modern physics.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {calculusApplications.map((math, index) => (
              <div key={index} className="card bg-base-100 shadow-lg">
                <div className="card-body text-center">
                  <div className="text-4xl mb-4 font-mono font-bold text-secondary">{math.icon}</div>
                  <h3 className="card-title justify-center text-xl mb-3">{math.title}</h3>
                  <p className="mb-4">{math.description}</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Key Equations:</h4>
                    {math.equations.map((eq, i) => (
                      <div key={i} className="badge badge-outline badge-sm font-mono text-xs">{eq}</div>
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
              Six comprehensive units covering all aspects of electromagnetic theory with advanced mathematical analysis.
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
                          <h3 className="text-2xl font-bold">Unit {index + 8}: {unit.title}</h3>
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

      {/* Electromagnetic Phenomena */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Fundamental Electromagnetic Laws</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Master the four fundamental laws that govern all electromagnetic phenomena in the universe.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {electromagnetismPhenomena.map((law, index) => (
              <div key={index} className="card bg-base-100 shadow-lg">
                <div className="card-body text-center">
                  <div className="text-4xl mb-4">{law.icon}</div>
                  <h3 className="card-title justify-center text-lg mb-3">{law.title}</h3>
                  <p className="text-sm mb-3">{law.description}</p>
                  <div className="text-xs text-base-content/70">
                    <span className="font-semibold">Applications: </span>
                    {law.applications}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <div className="card bg-gradient-to-r from-purple-100 to-blue-100 shadow-lg border border-purple-200 max-w-4xl mx-auto">
              <div className="card-body">
                <h3 className="card-title justify-center text-2xl mb-4">Maxwell's Equations: The Complete Theory</h3>
                <p className="mb-4">
                  James Clerk Maxwell unified electricity and magnetism into a single electromagnetic theory, 
                  revealing that light itself is an electromagnetic wave. These equations form the foundation of 
                  modern electromagnetic technology.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-sm">
                  <div className="badge badge-primary">∇ · E = ρ/ε₀</div>
                  <div className="badge badge-secondary">∇ · B = 0</div>
                  <div className="badge badge-accent">∇ × E = -∂B/∂t</div>
                  <div className="badge badge-info">∇ × B = μ₀J + μ₀ε₀∂E/∂t</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Applications */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Engineering Applications</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Electromagnetic theory forms the foundation of modern technology from computer chips to power systems.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {engineeringApplications.map((field, index) => (
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
            <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-100">
              <div className="stat">
                <div className="stat-title">Technology Impact</div>
                <div className="stat-value text-secondary">100%</div>
                <div className="stat-desc">of modern electronics relies on E&M</div>
              </div>
              
              <div className="stat">
                <div className="stat-title">Engineering Students</div>
                <div className="stat-value text-secondary">90%</div>
                <div className="stat-desc">pursue electrical or computer engineering</div>
              </div>
              
              <div className="stat">
                <div className="stat-title">Graduate Programs</div>
                <div className="stat-value text-secondary">Top</div>
                <div className="stat-desc">preparation for elite universities</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Laboratory Experience */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Advanced Laboratory Investigations</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Sophisticated experiments using research-grade equipment to explore electromagnetic phenomena firsthand.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-lg mb-3">Electric Field Mapping</h3>
                <p className="text-sm mb-4">Visualize electric fields using field mapping equipment and analyze charge distributions.</p>
                <div className="text-xs text-base-content/70">
                  <span className="font-semibold">Equipment: </span>
                  Field probes, voltage sensors, conducting paper, equipotential mapping
                </div>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-lg mb-3">Capacitor Analysis</h3>
                <p className="text-sm mb-4">Investigate capacitance, dielectric effects, and energy storage in electric fields.</p>
                <div className="text-xs text-base-content/70">
                  <span className="font-semibold">Equipment: </span>
                  Parallel plate capacitors, dielectric materials, charge sensors, oscilloscopes
                </div>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-lg mb-3">Magnetic Field Studies</h3>
                <p className="text-sm mb-4">Explore magnetic fields from currents using Hall effect probes and field visualization.</p>
                <div className="text-xs text-base-content/70">
                  <span className="font-semibold">Equipment: </span>
                  Hall probes, current loops, solenoids, magnetic field sensors
                </div>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-lg mb-3">Electromagnetic Induction</h3>
                <p className="text-sm mb-4">Investigate Faraday's Law and Lenz's Law using coils and varying magnetic fields.</p>
                <div className="text-xs text-base-content/70">
                  <span className="font-semibold">Equipment: </span>
                  Induction coils, function generators, oscilloscopes, EMF sensors
                </div>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-lg mb-3">RC and LR Circuits</h3>
                <p className="text-sm mb-4">Analyze exponential behavior in circuits with capacitors and inductors.</p>
                <div className="text-xs text-base-content/70">
                  <span className="font-semibold">Equipment: </span>
                  Digital oscilloscopes, function generators, precision components
                </div>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-lg mb-3">Advanced Circuit Analysis</h3>
                <p className="text-sm mb-4">Build and analyze complex circuits using Kirchhoff's Laws and network theorems.</p>
                <div className="text-xs text-base-content/70">
                  <span className="font-semibold">Equipment: </span>
                  Breadboards, precision resistors, advanced multimeters, computer interfaces
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prerequisites & Success Strategies */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Prerequisites & Preparation</h2>
              <div className="space-y-4">
                <div className="alert alert-error">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  <span>AP Physics C: Mechanics completion and advanced calculus knowledge required</span>
                </div>
                
                <p className="mb-4">Students must demonstrate mastery of:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Vector calculus operations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Line and surface integrals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Differential equations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Calculus-based mechanics</span>
                    </li>
                  </ul>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Advanced problem-solving skills</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Complex mathematical reasoning</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">3D spatial visualization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Exceptional mathematical maturity</span>
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
                    <h3 className="card-title text-lg">🧮 Master Vector Calculus</h3>
                    <p>Electromagnetic fields require sophisticated mathematical tools. Practice divergence, curl, and gradient operations extensively.</p>
                  </div>
                </div>
                
                <div className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <h3 className="card-title text-lg">⚡ Visualize Fields</h3>
                    <p>Develop strong three-dimensional visualization skills for electric and magnetic field patterns and interactions.</p>
                  </div>
                </div>
                
                <div className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <h3 className="card-title text-lg">🔬 Connect Theory to Applications</h3>
                    <p>Understand how electromagnetic principles enable modern technology from MRI machines to wireless communication.</p>
                  </div>
                </div>
                
                <div className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <h3 className="card-title text-lg">⏰ Practice Complex Problems</h3>
                    <p>Work through challenging multi-step problems daily. Build stamina for the demanding problem-solving pace.</p>
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
            <h2 className="text-3xl font-bold">Your Elite Physics Journey</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Complete the most rigorous physics sequence and prepare for elite engineering and physics programs.
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="card bg-base-200 shadow-md">
              <div className="card-body text-center">
                <h3 className="card-title justify-center">Foundation</h3>
                <p>AP Physics C: Mechanics</p>
              </div>
            </div>
            
            <div className="text-secondary text-2xl">→</div>
            
            <div className="card bg-secondary text-secondary-content shadow-lg">
              <div className="card-body text-center">
                <h3 className="card-title justify-center">Current Course</h3>
                <p>AP Physics C: E&M</p>
              </div>
            </div>
            
            <div className="text-secondary text-2xl">→</div>
            
            <div className="card bg-base-200 shadow-md">
              <div className="card-body text-center">
                <h3 className="card-title justify-center">Elite Preparation</h3>
                <p>Top Engineering Programs, Research, Graduate Study</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-secondary text-secondary-content">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready for the Ultimate Physics Challenge?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Master the most sophisticated physics course available. Develop the mathematical and analytical skills 
            that distinguish top engineering candidates and physics researchers.
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
