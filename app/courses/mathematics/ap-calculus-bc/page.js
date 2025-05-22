import Link from 'next/link';
import Image from 'next/image';

export default function APCalculusBC() {
  const unitData = [
    {
      title: "Limits and Continuity",
      description: "Master fundamental limit concepts to understand instantaneous change and mathematical reasoning about functions.",
      examWeight: "4%–7% of exam score",
      topics: [
        "Understanding limits and instantaneous change",
        "Defining and evaluating limits in multiple representations",
        "Analyzing continuity at points and over domains",
        "Working with asymptotes and infinite limits",
        "Applying Squeeze Theorem and Intermediate Value Theorem"
      ],
      icon: "🎯"
    },
    {
      title: "Differentiation: Definition and Fundamental Properties",
      description: "Apply limits to define derivatives and master fundamental differentiation techniques and rules.",
      examWeight: "4%–7% of exam score",
      topics: [
        "Defining derivatives at points and as functions",
        "Understanding the relationship between differentiability and continuity",
        "Computing derivatives of elementary functions",
        "Mastering essential differentiation rules",
        "Building mathematical reasoning skills"
      ],
      icon: "📐"
    },
    {
      title: "Differentiation: Composite, Implicit, and Inverse Functions",
      description: "Master advanced differentiation techniques including the chain rule and implicit differentiation.",
      examWeight: "4%–7% of exam score",
      topics: [
        "Applying the chain rule to composite functions",
        "Using implicit differentiation techniques",
        "Finding derivatives of inverse functions",
        "Computing higher-order derivatives",
        "Connecting different differentiation methods"
      ],
      icon: "🔗"
    },
    {
      title: "Contextual Applications of Differentiation",
      description: "Apply derivatives to solve real-world problems involving motion, rates of change, and optimization.",
      examWeight: "6%–9% of exam score",
      topics: [
        "Interpreting real-world rate of change problems",
        "Modeling and analyzing motion problems",
        "Solving related rates problems",
        "Using local linearity for approximation",
        "Applying L'Hôpital's rule to indeterminate forms"
      ],
      icon: "🚀"
    },
    {
      title: "Analytical Applications of Differentiation",
      description: "Explore relationships between functions and their derivatives to solve optimization and graphing problems.",
      examWeight: "8%–11% of exam score",
      topics: [
        "Understanding Mean Value Theorem and Extreme Value Theorem",
        "Analyzing function behavior using derivatives",
        "Applying first and second derivative tests",
        "Sketching function graphs using calculus",
        "Solving optimization problems",
        "Working with implicit relations"
      ],
      icon: "📈"
    },
    {
      title: "Integration and Accumulation of Change",
      description: "Master definite integrals and the Fundamental Theorem, including advanced techniques and improper integrals.",
      examWeight: "17%–20% of exam score",
      topics: [
        "Using definite integrals for accumulated change",
        "Approximating integrals with Riemann Sums",
        "Understanding the Fundamental Theorem of Calculus",
        "Working with antiderivatives and indefinite integrals",
        "Applying extended integration techniques",
        "Evaluating improper integrals"
      ],
      icon: "∫"
    },
    {
      title: "Differential Equations",
      description: "Solve differential equations and explore exponential, decay, and logistic growth models.",
      examWeight: "6%–9% of exam score",
      topics: [
        "Interpreting change as separable differential equations",
        "Creating and analyzing slope fields",
        "Using Euler's method for approximation",
        "Finding general and particular solutions",
        "Modeling exponential and logistic growth"
      ],
      icon: "🌱"
    },
    {
      title: "Applications of Integration",
      description: "Apply integration to solve problems involving areas, volumes, motion, and arc length.",
      examWeight: "6%–9% of exam score",
      topics: [
        "Finding average values using definite integrals",
        "Analyzing particle motion problems",
        "Solving accumulation and net change problems",
        "Computing areas between curves",
        "Determining volumes using various methods",
        "Calculating arc length of planar curves"
      ],
      icon: "🔄"
    },
    {
      title: "Parametric Equations, Polar Coordinates, and Vector-Valued Functions",
      description: "Master calculus applications in parametric, polar, and vector contexts for advanced curve analysis.",
      examWeight: "11%–12% of exam score",
      topics: [
        "Finding derivatives of parametric and vector-valued functions",
        "Calculating arc length using definite integrals",
        "Analyzing particle motion in the plane",
        "Computing velocity, speed, and acceleration vectors",
        "Working with polar coordinate derivatives",
        "Finding areas bounded by polar curves"
      ],
      icon: "📡"
    },
    {
      title: "Infinite Sequences and Series",
      description: "Explore convergence and divergence of infinite series, including Taylor and Maclaurin series representations.",
      examWeight: "17%–18% of exam score",
      topics: [
        "Understanding convergence of infinite series",
        "Working with geometric, harmonic, and p-series",
        "Applying convergence and divergence tests",
        "Approximating series sums with error bounds",
        "Determining radius and interval of convergence",
        "Representing functions as Taylor and Maclaurin series"
      ],
      icon: "∞"
    }
  ];

  const skillsData = [
    {
      title: "Advanced Mathematical Procedures",
      description: "Master sophisticated mathematical procedures including series analysis and advanced integration techniques.",
      icon: "⚙️"
    },
    {
      title: "Multiple Representations",
      description: "Connect and translate between graphical, numerical, algebraic, and verbal representations of advanced calculus concepts.",
      icon: "🔄"
    },
    {
      title: "Mathematical Reasoning",
      description: "Develop advanced skills in justifying reasoning, solutions, and mathematical arguments with rigorous precision.",
      icon: "🧠"
    },
    {
      title: "Mathematical Communication",
      description: "Use sophisticated notation and language to clearly communicate complex mathematical results and solutions.",
      icon: "📝"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="flex items-center gap-3 mb-4">
                <Link href="/courses" className="text-primary hover:underline">
                  ← Back to Courses
                </Link>
              </div>
              <div className="flex gap-2 mb-4">
                <div className="badge badge-primary">Mathematics</div>
                <div className="badge badge-accent">Most Popular</div>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">AP Calculus BC</h1>
              <p className="text-lg mb-6">
                Master all AP Calculus AB concepts plus advanced topics including series, parametric equations, polar coordinates, 
                and vector-valued functions. Prepare for the most rigorous mathematical challenges in high school.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link href="/booking/individual" className="btn btn-primary">Start Learning</Link>
                <Link href="/contact" className="btn btn-outline btn-primary">Ask Questions</Link>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative w-full h-80">
                <Image 
                  src="/calculus-bc-hero.svg" 
                  alt="AP Calculus BC advanced mathematical concepts" 
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
                  AP Calculus BC represents the pinnacle of high school mathematics, covering all AP Calculus AB topics while 
                  diving deep into advanced concepts that form the foundation of higher-level mathematics and engineering. 
                  This comprehensive course explores infinite series, parametric equations, polar coordinates, and vector-valued functions.
                </p>
                <p>
                  Students develop sophisticated mathematical reasoning skills while mastering complex analytical techniques. 
                  The course emphasizes both computational mastery and conceptual depth, preparing students for success in 
                  advanced mathematics, engineering, physics, computer science, and other quantitative fields.
                </p>
                <p>
                  Beyond technical skills, BC Calculus develops mathematical maturity and problem-solving sophistication that 
                  extends throughout STEM education and professional practice. Students learn to think abstractly about 
                  mathematical concepts while applying them to solve complex, multi-step problems.
                </p>
              </div>
            </div>
            <div className="bg-base-200 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Course Details</h3>
              <div className="space-y-4">
                <div>
                  <div className="font-semibold text-sm uppercase text-primary opacity-80">Difficulty Level</div>
                  <div className="badge badge-error">Advanced</div>
                </div>
                <div>
                  <div className="font-semibold text-sm uppercase text-primary opacity-80">Prerequisites</div>
                  <div>Strong foundation in Precalculus</div>
                </div>
                <div>
                  <div className="font-semibold text-sm uppercase text-primary opacity-80">College Equivalent</div>
                  <div>First and second semester college calculus</div>
                </div>
                <div>
                  <div className="font-semibold text-sm uppercase text-primary opacity-80">Course Units</div>
                  <div>10 comprehensive units</div>
                </div>
                <div>
                  <div className="font-semibold text-sm uppercase text-primary opacity-80">Advanced Topics</div>
                  <div>Series, Parametric, Polar, Vectors</div>
                </div>
                <div>
                  <div className="font-semibold text-sm uppercase text-primary opacity-80">AB Credit</div>
                  <div className="text-sm text-success">Automatic AB subscore included</div>
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
            <h2 className="text-3xl font-bold">Advanced Skills You'll Master</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Develop sophisticated mathematical reasoning and computational skills that prepare you for the most advanced STEM fields.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skillsData.map((skill, index) => (
              <div key={index} className="card bg-base-100 shadow-lg">
                <div className="card-body text-center">
                  <div className="text-4xl mb-4">{skill.icon}</div>
                  <h3 className="card-title justify-center text-lg mb-3">{skill.title}</h3>
                  <p className="text-sm">{skill.description}</p>
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
              Ten comprehensive units covering all essential calculus concepts from limits to infinite series.
            </p>
          </div>
          
          <div className="space-y-8">
            {unitData.map((unit, index) => (
              <div key={index} className={`card bg-base-100 shadow-lg border-l-4 ${index >= 8 ? 'border-accent' : 'border-primary'}`}>
                <div className="card-body">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    <div className="lg:w-full">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-3xl">{unit.icon}</span>
                        <div>
                          <h3 className="text-2xl font-bold">Unit {index + 1}: {unit.title}</h3>
                          <div className="flex gap-2 mt-1">
                            <div className="badge badge-primary">{unit.examWeight}</div>
                            {index >= 8 && (
                              <div className="badge badge-accent">BC Only</div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <p className="mb-4 text-base-content/80">{unit.description}</p>
                      
                      <div>
                        <h4 className="font-semibold mb-3">Key Topics:</h4>
                        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {unit.topics.map((topic, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
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

      {/* BC vs AB Comparison */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">AP Calculus BC vs AB</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Understand the key differences between AP Calculus BC and AB to make the best choice for your goals.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-2xl text-primary">AP Calculus BC</h3>
                <div className="mt-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="badge badge-primary badge-sm mt-1">✓</div>
                    <span>All AP Calculus AB topics</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="badge badge-accent badge-sm mt-1">+</div>
                    <span>Parametric equations and vector-valued functions</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="badge badge-accent badge-sm mt-1">+</div>
                    <span>Polar coordinates and polar functions</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="badge badge-accent badge-sm mt-1">+</div>
                    <span>Infinite sequences and series</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="badge badge-accent badge-sm mt-1">+</div>
                    <span>Advanced integration techniques</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="badge badge-accent badge-sm mt-1">+</div>
                    <span>Improper integrals</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="badge badge-accent badge-sm mt-1">+</div>
                    <span>Euler's method for differential equations</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-success/10 rounded-lg">
                  <p className="text-sm"><strong>College Credit:</strong> Often equivalent to two semesters of college calculus</p>
                </div>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-2xl text-secondary">AP Calculus AB</h3>
                <div className="mt-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="badge badge-secondary badge-sm mt-1">✓</div>
                    <span>Limits and continuity</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="badge badge-secondary badge-sm mt-1">✓</div>
                    <span>Fundamental differentiation techniques</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="badge badge-secondary badge-sm mt-1">✓</div>
                    <span>Applications of derivatives</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="badge badge-secondary badge-sm mt-1">✓</div>
                    <span>Basic integration and Fundamental Theorem</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="badge badge-secondary badge-sm mt-1">✓</div>
                    <span>Applications of integration</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="badge badge-secondary badge-sm mt-1">✓</div>
                    <span>Basic differential equations</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-info/10 rounded-lg">
                  <p className="text-sm"><strong>College Credit:</strong> Typically equivalent to one semester of college calculus</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Prerequisites & Preparation */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Prerequisites & Preparation</h2>
              <div className="space-y-4">
                <div className="alert alert-warning">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                  </svg>
                  <span>Strong foundation in algebra, geometry, trigonometry, and precalculus required</span>
                </div>
                
                <p className="mb-4">Students should demonstrate mastery of all AB prerequisites plus:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Sequences and series fundamentals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Polar coordinate basics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Parametric equations introduction</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Vector basics</span>
                    </li>
                  </ul>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Advanced algebraic manipulation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Strong analytical skills</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Mathematical maturity</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Time management skills</span>
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
                    <h3 className="card-title text-lg">🎯 Master AB Topics First</h3>
                    <p>Ensure solid understanding of limits, derivatives, and basic integration before tackling BC-specific topics.</p>
                  </div>
                </div>
                
                <div className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <h3 className="card-title text-lg">∞ Focus on Series</h3>
                    <p>Series convergence and representation form a significant portion of the BC exam. Master convergence tests thoroughly.</p>
                  </div>
                </div>
                
                <div className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <h3 className="card-title text-lg">📐 Parametric & Polar Practice</h3>
                    <p>Work extensively with parametric equations and polar coordinates – these topics are unique to BC.</p>
                  </div>
                </div>
                
                <div className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <h3 className="card-title text-lg">⏱️ Time Management</h3>
                    <p>Practice solving complex problems efficiently. BC problems often require multiple techniques in combination.</p>
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
            <h2 className="text-3xl font-bold">Your Advanced Mathematics Journey</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              See how AP Calculus BC positions you for success in advanced STEM fields and higher education.
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="card bg-base-200 shadow-md">
              <div className="card-body text-center">
                <h3 className="card-title justify-center">Foundation</h3>
                <p>Strong Precalculus background</p>
              </div>
            </div>
            
            <div className="text-primary text-2xl">→</div>
            
            <div className="card bg-primary text-primary-content shadow-lg">
              <div className="card-body text-center">
                <h3 className="card-title justify-center">Current Course</h3>
                <p>AP Calculus BC</p>
              </div>
            </div>
            
            <div className="text-primary text-2xl">→</div>
            
            <div className="card bg-base-200 shadow-md">
              <div className="card-body text-center">
                <h3 className="card-title justify-center">Next Steps</h3>
                <p>Multivariable Calculus, Differential Equations, Engineering, Physics</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-primary text-primary-content">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Tackle AP Calculus BC?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Master the most advanced high school mathematics course and prepare for success in competitive STEM programs and careers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn btn-secondary">
              Schedule Free Consultation
            </Link>
            <Link href="/booking/individual" className="btn bg-white text-primary hover:bg-base-200">
              Start Learning Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
