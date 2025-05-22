import Link from 'next/link';
import Image from 'next/image';

export default function APPrecalculus() {
  const unitData = [
    {
      title: "Polynomial and Rational Functions",
      description: "Expand understanding of polynomial and rational functions through modeling and rates of change analysis.",
      examWeight: "30%–40% of exam score",
      topics: [
        "Analyzing how quantities change relative to each other",
        "Understanding end behavior of polynomial functions",
        "Identifying asymptotes and discontinuities in rational functions",
        "Creating mathematical models for real-world scenarios",
        "Evaluating model assumptions and limitations"
      ],
      icon: "📈"
    },
    {
      title: "Exponential and Logarithmic Functions",
      description: "Explore inverse relationships between exponential and logarithmic functions through practical applications.",
      examWeight: "27%–40% of exam score",
      topics: [
        "Connecting geometric sequences to exponential functions",
        "Fitting exponential models to data sets",
        "Working with function composition and inverses",
        "Applying logarithmic functions to solve problems",
        "Using residual plots to validate function models"
      ],
      icon: "📊"
    },
    {
      title: "Trigonometric and Polar Functions",
      description: "Model periodic phenomena using trigonometric transformations and explore polar coordinate systems.",
      examWeight: "30%–35% of exam score",
      topics: [
        "Connecting right triangle trigonometry to circular functions",
        "Creating sinusoidal models for periodic data",
        "Solving equations using inverse trigonometric functions",
        "Working with polar coordinate graphing",
        "Analyzing relationships between angles and radii in polar graphs"
      ],
      icon: "🌊"
    },
    {
      title: "Functions Involving Parameters, Vectors, and Matrices",
      description: "Expand function concepts through parametric equations, vectors, and matrix transformations.",
      examWeight: "Enrichment (not assessed on AP exam)",
      topics: [
        "Analyzing parametric function relationships",
        "Graphing conic sections using multiple representations",
        "Using vectors to describe object motion",
        "Understanding transformation matrix effects",
        "Modeling contextual change with matrices"
      ],
      icon: "🔧"
    }
  ];

  const skillsData = [
    {
      title: "Algebraic Manipulation",
      description: "Master the manipulation of functions, equations, and expressions with precision and fluency.",
      icon: "🧮"
    },
    {
      title: "Multiple Representations",
      description: "Translate seamlessly between graphical, numerical, algebraic, and verbal representations.",
      icon: "🔄"
    },
    {
      title: "Mathematical Communication",
      description: "Communicate mathematical reasoning clearly and provide logical justifications for conclusions.",
      icon: "💬"
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
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">AP Precalculus</h1>
              <p className="text-lg mb-6">
                Build essential mathematical foundations in polynomial, rational, exponential, logarithmic, and trigonometric functions. Develop the analytical and modeling skills needed to excel in calculus and advanced mathematics.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link href="/booking/individual" className="btn btn-primary">Start Learning</Link>
                <Link href="/contact" className="btn btn-outline btn-primary">Ask Questions</Link>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative w-full h-80">
                <Image 
                  src="/precalculus-hero.svg" 
                  alt="AP Precalculus mathematical concepts" 
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
                  AP Precalculus serves as the crucial bridge between algebra and calculus, providing students with the mathematical 
                  tools and conceptual understanding needed for success in higher-level mathematics. This comprehensive course 
                  emphasizes function analysis, mathematical modeling, and problem-solving strategies that extend far beyond the classroom.
                </p>
                <p>
                  Students will explore real-world applications of mathematical concepts – from analyzing population growth patterns 
                  to modeling periodic phenomena like sound waves and tidal patterns. The course develops both computational 
                  fluency and conceptual understanding, preparing students for the rigor of calculus while building appreciation 
                  for mathematics as a powerful tool for understanding our world.
                </p>
              </div>
            </div>
            <div className="bg-base-200 rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4">Course Details</h3>
              <div className="space-y-4">
                <div>
                  <div className="font-semibold text-sm uppercase text-primary opacity-80">Difficulty Level</div>
                  <div className="badge badge-success">Foundational</div>
                </div>
                <div>
                  <div className="font-semibold text-sm uppercase text-primary opacity-80">Prerequisites</div>
                  <div>Algebra II, Geometry</div>
                </div>
                <div>
                  <div className="font-semibold text-sm uppercase text-primary opacity-80">College Equivalent</div>
                  <div>Precalculus</div>
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
              Develop the mathematical reasoning and problem-solving abilities that form the foundation for advanced study.
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
              Four comprehensive units covering essential precalculus concepts and their applications.
            </p>
          </div>
          
          <div className="space-y-8">
            {unitData.map((unit, index) => (
              <div key={index} className="card bg-base-100 shadow-lg border-l-4 border-primary">
                <div className="card-body">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    <div className="lg:w-2/3">
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
                  <span>Successful completion of Algebra II and Geometry is required</span>
                </div>
                
                <p className="mb-4">Students should demonstrate proficiency in:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Linear and quadratic functions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Polynomial operations and factoring</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Systems of equations</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Right triangle trigonometry</span>
                    </li>
                  </ul>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Exponential functions and properties</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">Radicals and complex numbers</span>
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
                      <span className="text-sm">Algebraic manipulation</span>
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
                    <h3 className="card-title text-lg">📚 Study Approach</h3>
                    <p>Focus on understanding concepts rather than memorizing procedures. Practice connecting different representations of the same mathematical relationship.</p>
                  </div>
                </div>
                
                <div className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <h3 className="card-title text-lg">🔄 Practice Regularly</h3>
                    <p>Work through varied problem types daily. Emphasize real-world applications and mathematical modeling scenarios.</p>
                  </div>
                </div>
                
                <div className="card bg-base-100 shadow-md">
                  <div className="card-body">
                    <h3 className="card-title text-lg">🧠 Mathematical Reasoning</h3>
                    <p>Develop the ability to justify your solutions and communicate mathematical reasoning clearly and precisely.</p>
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
            <h2 className="text-3xl font-bold">Your Learning Journey</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              See how AP Precalculus fits into your mathematical education pathway.
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="card bg-base-200 shadow-md">
              <div className="card-body text-center">
                <h3 className="card-title justify-center">Foundation</h3>
                <p>Algebra II + Geometry</p>
              </div>
            </div>
            
            <div className="text-primary text-2xl">→</div>
            
            <div className="card bg-primary text-primary-content shadow-lg">
              <div className="card-body text-center">
                <h3 className="card-title justify-center">Current Course</h3>
                <p>AP Precalculus</p>
              </div>
            </div>
            
            <div className="text-primary text-2xl">→</div>
            
            <div className="card bg-base-200 shadow-md">
              <div className="card-body text-center">
                <h3 className="card-title justify-center">Next Steps</h3>
                <p>AP Calculus AB/BC</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-primary text-primary-content">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Master AP Precalculus?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our expert-led sessions and build the mathematical foundation you need for calculus success and beyond.
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
