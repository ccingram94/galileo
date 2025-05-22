import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'AP Physics 2: Algebra-Based | Advanced Physics Concepts',
  description: 'Explore advanced physics with AP Physics 2. Study thermodynamics, electromagnetism, optics, and modern physics through hands-on laboratory investigations.',
  keywords: 'AP Physics 2, algebra-based physics, thermodynamics, electromagnetism, optics, modern physics, quantum physics',
};

export default function APPhysics2() {
  const unitData = [
    {
      title: "Thermodynamics",
      description: "Study heat, temperature, and thermal energy in systems like heat engines, heat pumps, and refrigerators.",
      examWeight: "15%–18% of exam score",
      topics: [
        "Thermodynamic systems and processes",
        "Pressure, thermal equilibrium, and Ideal Gas Law",
        "Thermodynamics and forces",
        "Heat and energy transfer mechanisms",
        "Thermodynamic collisions and interactions",
        "Probability, thermal equilibrium, and entropy"
      ],
      icon: "🔥"
    },
    {
      title: "Electric Force, Field, and Potential",
      description: "Explore fundamental electromagnetic concepts including electric charge, forces, and energy.",
      examWeight: "15%–18% of exam score",
      topics: [
        "Electric systems and charge distribution",
        "Friction, conduction, and induction processes",
        "Electric permittivity and field properties",
        "Electric forces and free-body diagram analysis",
        "Gravitational vs electromagnetic forces",
        "Electric charges, fields, and flux",
        "Conservation of electric energy"
      ],
      icon: "⚡"
    },
    {
      title: "Electric Circuits",
      description: "Analyze the behavior of charged particles in circuit components and current pathways.",
      examWeight: "15%–18% of exam score",
      topics: [
        "Definition and conservation of electric charge",
        "Resistivity, resistance, and material properties",
        "Resistance and capacitance in circuits",
        "Kirchhoff's loop rule applications",
        "Kirchhoff's junction rule and charge conservation",
        "Complex circuit analysis"
      ],
      icon: "🔌"
    },
    {
      title: "Magnetism and Electromagnetism",
      description: "Investigate relationships between electric currents and the magnetic forces and fields they generate.",
      examWeight: "12%–15% of exam score",
      topics: [
        "Magnetic systems and field sources",
        "Magnetic permeability and dipole moments",
        "Vector and scalar field representations",
        "Monopole and dipole field patterns",
        "Magnetic fields and force interactions",
        "Magnetic flux and field analysis"
      ],
      icon: "🧲"
    },
    {
      title: "Geometric Optics",
      description: "Examine how light interacts with materials and how images are formed by mirrors and lenses.",
      examWeight: "12%–15% of exam score",
      topics: [
        "Refraction, reflection, and absorption processes",
        "Image formation by lenses",
        "Image formation by mirrors",
        "Optical systems and ray tracing",
        "Lens and mirror equations",
        "Real and virtual image analysis"
      ],
      icon: "🔍"
    },
    {
      title: "Waves, Sound, and Physical Optics",
      description: "Study wave phenomena including quantification of waves and light modeled as wave behavior.",
      examWeight: "12%–15% of exam score",
      topics: [
        "Periodic wave properties and characteristics",
        "Electromagnetic wave behavior",
        "Sound wave propagation and properties",
        "Doppler Effect in wave motion",
        "Wave interference and superposition",
        "Diffraction and wave obstacles"
      ],
      icon: "〰️"
    },
    {
      title: "Modern Physics",
      description: "Explore concepts of modern physics that resolve questions classical Newtonian physics could not answer.",
      examWeight: "12%–15% of exam score",
      topics: [
        "Radioactive decay processes and statistics",
        "Energy in radioactive decay reactions",
        "Mass-energy equivalence (E = mc²)",
        "Blackbody radiation and quantum theory",
        "Wave-particle duality properties",
        "Photoelectric effect and quantum mechanics"
      ],
      icon: "🔬"
    }
  ];

  const skillsData = [
    {
      title: "Advanced Representations",
      description: "Create sophisticated diagrams, graphs, and mathematical models for complex physical phenomena.",
      icon: "📊"
    },
    {
      title: "Quantitative Analysis",
      description: "Conduct advanced analyses to derive relationships, calculate values, and predict complex outcomes.",
      icon: "🧮"
    },
    {
      title: "Experimental Investigation",
      description: "Design complex procedures, analyze multi-variable data, and support claims through evidence.",
      icon: "🔬"
    }
  ];

  const labHighlights = [
    {
      title: "Thermodynamics Lab",
      description: "Investigate heat engines, gas laws, and entropy in thermal systems",
      equipment: "Temperature sensors, pressure sensors, calorimeters, gas law apparatus"
    },
    {
      title: "Electrostatics Investigation",
      description: "Explore electric fields, potential, and charge distributions",
      equipment: "Van de Graaff generators, electroscopes, field mapping equipment"
    },
    {
      title: "Circuit Analysis Lab",
      description: "Analyze complex DC and AC circuits with various components",
      equipment: "Multimeters, oscilloscopes, breadboards, capacitors, resistors"
    },
    {
      title: "Electromagnetic Fields",
      description: "Study magnetic fields, electromagnetic induction, and field interactions",
      equipment: "Magnetic field sensors, coils, magnets, field mapping tools"
    },
    {
      title: "Optics and Waves",
      description: "Investigate refraction, interference, and wave phenomena",
      equipment: "Lasers, lenses, mirrors, wave tanks, interference apparatus"
    },
    {
      title: "Modern Physics Lab",
      description: "Explore photoelectric effect, blackbody radiation, and quantum phenomena",
      equipment: "Photoelectric apparatus, spectrometers, radiation detectors"
    }
  ];

  const modernPhysicsTopics = [
    {
      title: "Quantum Mechanics",
      description: "Wave-particle duality and photoelectric effect",
      icon: "⚛️"
    },
    {
      title: "Nuclear Physics",
      description: "Radioactive decay and mass-energy equivalence",
      icon: "☢️"
    },
    {
      title: "Electromagnetic Waves",
      description: "Light as electromagnetic radiation",
      icon: "📡"
    },
    {
      title: "Thermodynamics",
      description: "Statistical mechanics and entropy",
      icon: "🌡️"
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
              <div className="badge badge-secondary mb-4">Physics</div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">AP Physics 2: Algebra-Based</h1>
              <p className="text-lg mb-6">
                Explore advanced physics concepts from thermodynamics to quantum mechanics. Investigate how 
                microscopic particle interactions create observable phenomena like static electricity, 
                nuclear reactions, and atomic emission lines through hands-on laboratory work.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link href="/booking/individual" className="btn btn-secondary">Start Learning</Link>
                <Link href="/contact" className="btn btn-outline btn-secondary">Ask Questions</Link>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative w-full h-80">
                <Image 
                  src="/physics-2-hero.svg" 
                  alt="AP Physics 2 advanced concepts and laboratory equipment" 
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
                  AP Physics 2: Algebra-Based builds upon the foundation established in AP Physics 1, diving into 
                  more advanced topics including thermodynamics, electromagnetism, optics, and modern physics. 
                  This inquiry-based course emphasizes the connection between microscopic phenomena and observable 
                  macroscopic effects.
                </p>
                <p>
                  Students develop sophisticated scientific reasoning skills through complex laboratory investigations, 
                  learning to design multi-variable experiments and analyze data that reveals fundamental physical 
                  principles. The course bridges classical and modern physics, preparing students for advanced 
                  study in physics, engineering, and related STEM fields.
                </p>
                <div className="alert alert-success">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span><strong>Perfect Preparation:</strong> Ideal sequel to AP Physics 1, covering advanced topics essential for STEM majors.</span>
                </div>
              </div>
            </div>
            <div className="bg-base-200 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Course Details</h3>
              <div className="space-y-4">
                <div>
                  <div className="font-semibold text-sm uppercase text-secondary opacity-80">Exam Date</div>
                  <div className="text-lg">May 13, 2025 • 12:00 PM</div>
                </div>
                <div>
                  <div className="font-semibold text-sm uppercase text-secondary opacity-80">Difficulty Level</div>
                  <div className="badge badge-warning">Intermediate</div>
                </div>
                <div>
                  <div className="font-semibold text-sm uppercase text-secondary opacity-80">Prerequisites</div>
                  <div>AP Physics 1, Precalculus</div>
                </div>
                <div>
                  <div className="font-semibold text-sm uppercase text-secondary opacity-80">College Equivalent</div>
                  <div>Second-semester algebra-based physics</div>
                </div>
                <div>
                  <div className="font-semibold text-sm uppercase text-secondary opacity-80">Mathematical Approach</div>
                  <div>Advanced algebra and trigonometry</div>
                </div>
                <div>
                  <div className="font-semibold text-sm uppercase text-secondary opacity-80">Course Units</div>
                  <div>7 comprehensive units (Units 9-15)</div>
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
            <h2 className="text-3xl font-bold">Advanced Physics Skills</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Build sophisticated scientific reasoning and analytical skills for complex physical phenomena.
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
              Seven advanced units covering thermodynamics, electromagnetism, optics, and modern physics.
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
                          <h3 className="text-2xl font-bold">Unit {index + 9}: {unit.title}</h3>
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

      {/* Modern Physics Highlight */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Modern Physics Exploration</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              AP Physics 2 uniquely introduces students to cutting-edge physics concepts that revolutionized 
              our understanding of the universe in the 20th century.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {modernPhysicsTopics.map((topic, index) => (
              <div key={index} className="card bg-base-100 shadow-lg">
                <div className="card-body text-center">
                  <div className="text-4xl mb-4">{topic.icon}</div>
                  <h3 className="card-title justify-center text-lg mb-3">{topic.title}</h3>
                  <p className="text-sm">{topic.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <div className="card bg-gradient-to-r from-purple-100 to-blue-100 shadow-lg border border-purple-200 max-w-4xl mx-auto">
              <div className="card-body">
                <h3 className="card-title justify-center text-2xl mb-4">Historic Physics Breakthroughs</h3>
                <p className="mb-4">
                  Explore the revolutionary discoveries that shaped modern science: Einstein's mass-energy equivalence, 
                  Planck's quantum theory, and the wave-particle duality that challenged classical physics.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <div className="badge badge-primary">E = mc²</div>
                  <div className="badge badge-secondary">Photoelectric Effect</div>
                  <div className="badge badge-accent">Wave-Particle Duality</div>
                  <div className="badge badge-info">Blackbody Radiation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Laboratory Experience */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Advanced Laboratory Investigations</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Sophisticated laboratory work develops advanced experimental skills and deepens understanding 
              of complex physical phenomena through direct investigation.
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
                <div className="stat-title">Advanced Investigations</div>
                <div className="stat-value text-secondary">12+</div>
                <div className="stat-desc">complex experiments</div>
              </div>
              
              <div className="stat">
                <div className="stat-title">Modern Equipment</div>
                <div className="stat-value text-secondary">High-Tech</div>
                <div className="stat-desc">research-grade tools</div>
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
                <div className="alert alert-warning">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  <span>AP Physics 1 completion required; Precalculus strongly recommended</span>
                </div>
                
                <p className="mb-4">Students should have solid foundation in:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Kinematics and dynamics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Energy and momentum conservation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Rotational motion concepts</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Wave and oscillation basics</span>
                    </li>
                  </ul>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Advanced algebra and trigonometry</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Laboratory investigation skills</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Scientific reasoning abilities</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Graph analysis and interpretation</span>
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
                    <h3 className="card-title text-lg">🔬 Connect Micro to Macro</h3>
                    <p>Focus on understanding how microscopic phenomena create observable macroscopic effects.</p>
                  </div>
                </div>
                
                <div className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <h3 className="card-title text-lg">🧮 Master Mathematical Models</h3>
                    <p>Develop proficiency with the mathematical representations of complex physical systems.</p>
                  </div>
                </div>
                
                <div className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <h3 className="card-title text-lg">⚛️ Embrace Modern Physics</h3>
                    <p>Be prepared to challenge classical thinking with quantum mechanical and relativistic concepts.</p>
                  </div>
                </div>
                
                <div className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <h3 className="card-title text-lg">📊 Advanced Lab Skills</h3>
                    <p>Develop sophisticated experimental design and data analysis capabilities through practice.</p>
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
            <h2 className="text-3xl font-bold">Your Advanced Physics Journey</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              See how AP Physics 2 advances your physics education and prepares you for specialized STEM study.
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="card bg-base-200 shadow-md">
              <div className="card-body text-center">
                <h3 className="card-title justify-center">Foundation</h3>
                <p>AP Physics 1 + Precalculus</p>
              </div>
            </div>
            
            <div className="text-secondary text-2xl">→</div>
            
            <div className="card bg-secondary text-secondary-content shadow-lg">
              <div className="card-body text-center">
                <h3 className="card-title justify-center">Current Course</h3>
                <p>AP Physics 2</p>
              </div>
            </div>
            
            <div className="text-secondary text-2xl">→</div>
            
            <div className="card bg-base-200 shadow-md">
              <div className="card-body text-center">
                <h3 className="card-title justify-center">Next Steps</h3>
                <p>College Physics, Engineering, or Specialized STEM Fields</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-secondary text-secondary-content">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Explore Advanced Physics?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Take your physics understanding to the next level with AP Physics 2. Investigate thermodynamics, 
            electromagnetism, and modern physics concepts that shape our technological world.
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
