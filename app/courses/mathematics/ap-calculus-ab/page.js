import Link from 'next/link';
import Image from 'next/image';

export default function APCalculusAB() {
  const unitData = [
    {
      title: "Limits and Continuity",
      description: "Explore fundamental concepts of limits to understand instantaneous change and mathematical reasoning about functions.",
      examWeight: "10%–12% of exam score",
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
      examWeight: "10%–12% of exam score",
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
      examWeight: "9%–13% of exam score",
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
      examWeight: "10%–15% of exam score",
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
      examWeight: "15%–18% of exam score",
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
      description: "Learn definite integrals and the Fundamental Theorem of Calculus to understand accumulation and change.",
      examWeight: "17%–20% of exam score",
      topics: [
        "Using definite integrals for accumulated change",
        "Approximating integrals with Riemann Sums",
        "Understanding the Fundamental Theorem of Calculus",
        "Working with antiderivatives and indefinite integrals",
        "Applying integration properties and techniques"
      ],
      icon: "∫"
    },
    {
      title: "Differential Equations",
      description: "Solve differential equations and explore exponential growth and decay models.",
      examWeight: "6%–12% of exam score",
      topics: [
        "Interpreting change as separable differential equations",
        "Creating and analyzing slope fields",
        "Finding general and particular solutions",
        "Modeling exponential growth and decay",
        "Connecting differential equations to real-world scenarios"
      ],
      icon: "🌱"
    },
    {
      title: "Applications of Integration",
      description: "Apply integration to solve problems involving areas, volumes, motion, and accumulation.",
      examWeight: "10%–15% of exam score",
      topics: [
        "Finding average values using definite integrals",
        "Analyzing particle motion problems",
        "Solving accumulation and net change problems",
        "Computing areas between curves",
        "Determining volumes using cross-sections and revolution methods"
      ],
      icon: "🔄"
    }
  ];

  const skillsData = [
    {
      title: "Mathematical Procedures",
      description: "Master determining expressions and values using precise mathematical procedures and established rules.",
      icon: "⚙️"
    },
    {
      title: "Multiple Representations",
      description: "Connect and translate between graphical, numerical, algebraic, and verbal representations of mathematical concepts.",
      icon: "🔄"
    },
    {
      title: "Mathematical Reasoning",
      description: "Develop skills in justifying reasoning, solutions, and mathematical arguments with logical precision.",
      icon: "🧠"
    },
    {
      title: "Mathematical Communication",
      description: "Use correct notation, language, and conventions to clearly communicate mathematical results and solutions.",
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
              <div className="badge badge-primary mb-4">Mathematics</div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">AP Calculus AB</h1>
              <p className="text-lg mb-6">
                Master the fundamental concepts of differential and integral calculus. Explore how mathematics helps us 
                understand change and solve complex real-world problems involving motion, optimization, and accumulation.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link href="/booking/individual" className="btn btn-primary">Start Learning</Link>
                <Link href="/contact" className="btn btn-outline btn-primary">Ask Questions</Link>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative w-full h-80">
                <Image 
                  src="/calculus-ab-hero.svg" 
                  alt="AP Calculus AB mathematical concepts" 
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
                  AP Calculus AB introduces students to the fundamental concepts and applications of differential and integral 
                  calculus. This comprehensive course explores how mathematics can help us understand and model change – from 
                  analyzing the motion of objects to optimizing real-world scenarios and understanding accumulation processes.
                </p>
                <p>
                  Students will develop sophisticated mathematical reasoning skills while learning to work with limits, derivatives, 
                  and integrals. The course emphasizes both computational fluency and conceptual understanding, preparing students 
                  for advanced mathematics and STEM fields where calculus serves as a fundamental tool for analysis and problem-solving.
                </p>
                <p>
                  Through rigorous exploration of mathematical concepts and their applications, students learn to think critically 
                  about change, rates, and accumulation – skills that extend far beyond mathematics into physics, engineering, 
                  economics, and many other disciplines.
                </p>
              </div>
            </div>
            <div className="bg-base-200 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Course Details</h3>
              <div className="space-y-4">
                <div>
                  <div className="font-semibold text-sm uppercase text-primary opacity-80">Difficulty Level</div>
                  <div className="badge badge-warning">Intermediate</div>
                </div>
                <div>
                  <div className="font-semibold text-sm uppercase text-primary opacity-80">Prerequisites</div>
                  <div>Precalculus or equivalent</div>
                </div>
                <div>
                  <div className="font-semibold text-sm uppercase text-primary opacity-80">College Equivalent</div>
                  <div>First-semester college calculus course</div>
                </div>
                <div>
                  <div className="font-semibold text-sm uppercase text-primary opacity-80">Course Units</div>
                  <div>8 comprehensive units</div>
                </div>
                <div>
                  <div className="font-semibold text-sm uppercase text-primary opacity-80">Key Topics</div>
                  <div>Limits, Derivatives, Integrals, Applications</div>
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
            <h2 className="text-3xl font-bold">Essential Skills You'll Master</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Develop the mathematical reasoning, computational skills, and problem-solving abilities fundamental to calculus success.
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
              Eight comprehensive units covering all essential concepts in differential and integral calculus.
            </p>
          </div>
          
          <div className="space-y-8">
            {unitData.map((unit, index) => (
              <div key={index} className="card bg-base-100 shadow-lg border-l-4 border-primary">
                <div className="card-body">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    <div className="lg:w-full">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-3xl">{unit.icon}</span>
                        <div>
                          <h3 className="text-2xl font-bold">Unit {index + 1}: {unit.title}</h3>
                          <div className="badge badge-primary mt-1">{unit.examWeight}</div>
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

      {/* Prerequisites & Preparation */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Prerequisites & Preparation</h2>
              <div className="space-y-4">
                <div className="alert alert-info">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Strong foundation in algebra, geometry, trigonometry, and elementary functions required</span>
                </div>
                
                <p className="mb-4">Students should demonstrate mastery of:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Linear and polynomial functions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Rational and exponential functions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Logarithmic functions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Trigonometric functions</span>
                    </li>
                  </ul>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Inverse trigonometric functions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Piecewise-defined functions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Function transformations and compositions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Function inverses</span>
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
                    <h3 className="card-title text-lg">🎯 Conceptual Understanding</h3>
                    <p>Focus on understanding the fundamental concepts of limits, derivatives, and integrals rather than just memorizing procedures.</p>
                  </div>
                </div>
                
                <div className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <h3 className="card-title text-lg">🔄 Multiple Representations</h3>
                    <p>Practice connecting graphical, analytical, numerical, and verbal representations of calculus concepts.</p>
                  </div>
                </div>
                
                <div className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <h3 className="card-title text-lg">📝 Mathematical Reasoning</h3>
                    <p>Develop the ability to justify solutions and communicate mathematical reasoning with precision.</p>
                  </div>
                </div>
                
                <div className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <h3 className="card-title text-lg">🏃‍♂️ Regular Practice</h3>
                    <p>Work through a variety of problems daily, emphasizing both computation and conceptual application.</p>
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
            <h2 className="text-3xl font-bold">Your Calculus Journey</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              See how AP Calculus AB fits into your mathematical education and future opportunities.
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="card bg-base-200 shadow-md">
              <div className="card-body text-center">
                <h3 className="card-title justify-center">Foundation</h3>
                <p>AP Precalculus or equivalent</p>
              </div>
            </div>
            
            <div className="text-primary text-2xl">→</div>
            
            <div className="card bg-primary text-primary-content shadow-lg">
              <div className="card-body text-center">
                <h3 className="card-title justify-center">Current Course</h3>
                <p>AP Calculus AB</p>
              </div>
            </div>
            
            <div className="text-primary text-2xl">→</div>
            
            <div className="card bg-base-200 shadow-md">
              <div className="card-body text-center">
                <h3 className="card-title justify-center">Next Steps</h3>
                <p>AP Calculus BC, Multivariable Calculus, or Advanced STEM courses</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-primary text-primary-content">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Master AP Calculus AB?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our expert-led sessions and develop the calculus skills you need for success in advanced mathematics and STEM fields.
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
