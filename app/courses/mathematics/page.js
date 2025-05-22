import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Mathematics Courses | AP Precalculus, Calculus AB & BC',
  description: 'Master AP Mathematics with expert tutoring in AP Precalculus, AP Calculus AB, and AP Calculus BC. Build strong foundations for STEM success.',
  keywords: 'AP Mathematics, AP Calculus, AP Precalculus, math tutoring, calculus tutoring, STEM education',
};

export default function MathematicsPage() {
  const courseData = [
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
      color: "primary",
      examDate: "May 13, 2025"
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
      color: "primary",
      examDate: "May 12, 2025"
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
      highlight: true,
      examDate: "May 12, 2025"
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
      description: "Optimal pathway for students pursuing engineering, physics, or mathematics",
      steps: [
        { step: 1, course: "AP Precalculus", note: "Build strong foundations" },
        { step: 2, course: "AP Calculus AB", note: "Master fundamental calculus" },
        { step: 3, course: "AP Calculus BC", note: "Advanced topics & applications" },
        { step: 4, course: "College: Multivariable Calculus", note: "Continue advanced study" }
      ],
      color: "primary"
    },
    {
      title: "Life Sciences & Pre-Med Track",
      description: "Recommended sequence for biology, chemistry, and pre-medical students",
      steps: [
        { step: 1, course: "AP Precalculus", note: "Essential mathematical foundation" },
        { step: 2, course: "AP Calculus AB", note: "Core calculus concepts" },
        { step: 3, course: "Statistics/Other Sciences", note: "Broaden STEM knowledge" },
        { step: 4, course: "College: Applied Mathematics", note: "Specialized applications" }
      ],
      color: "secondary"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="badge badge-primary mb-4">Mathematics Department</div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">AP Mathematics Courses</h1>
              <p className="text-lg mb-6">
                Master the mathematical foundations essential for STEM success. Our comprehensive AP Mathematics 
                curriculum builds from precalculus fundamentals through advanced calculus concepts, preparing 
                students for college-level mathematics and competitive STEM programs.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link href="#courses" className="btn btn-primary">Explore Courses</Link>
                <Link href="/booking/individual" className="btn btn-outline btn-primary">Start Learning</Link>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative w-full h-80">
                <Image 
                  src="/mathematics-hero.svg" 
                  alt="AP Mathematics education illustration" 
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mathematics Overview Stats */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="bg-base-100 rounded-lg shadow-md p-6">
            <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"></path>
                  </svg>
                </div>
                <div className="stat-title">Mathematics Courses</div>
                <div className="stat-value">3</div>
                <div className="stat-desc">From foundations to advanced</div>
              </div>
              
              <div className="stat">
                <div className="stat-figure text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <div className="stat-title">Course Units</div>
                <div className="stat-value">22</div>
                <div className="stat-desc">Comprehensive curriculum</div>
              </div>
              
              <div className="stat">
                <div className="stat-figure text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                  </svg>
                </div>
                <div className="stat-title">Success Rate</div>
                <div className="stat-value">95%</div>
                <div className="stat-desc">Students scoring 4 or 5</div>
              </div>

              <div className="stat">
                <div className="stat-figure text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
                  </svg>
                </div>
                <div className="stat-title">College Credit</div>
                <div className="stat-value">2-3</div>
                <div className="stat-desc">Semesters earned</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Cards */}
      <section className="py-16 bg-base-100" id="courses">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Our Mathematics Courses</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Comprehensive AP Mathematics curriculum designed to build conceptual understanding 
              and problem-solving skills essential for STEM success.
            </p>
          </div>
          
          <div className="space-y-6">
            {courseData.map((course, index) => (
              <div key={index} className={`card lg:card-side bg-base-100 shadow-lg border-l-4 ${course.highlight ? 'border-accent' : 'border-primary'}`}>
                <div className="card-body">
                  <div className="flex items-center gap-4 flex-wrap">
                    <h3 className="card-title text-2xl">{course.title}</h3>
                    <div className={`badge ${getDifficultyBadge(course.difficulty)}`}>{course.difficulty}</div>
                    {course.highlight && (
                      <div className="badge badge-accent">Most Popular</div>
                    )}
                  </div>
                  
                  <p className="mt-2 lg:pr-10">{course.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <h4 className="font-semibold text-sm uppercase text-primary opacity-80 tracking-wider mb-2">Course Topics</h4>
                      <ul className="space-y-1">
                        {course.topics.slice(0, 4).map((topic, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm">{topic}</span>
                          </li>
                        ))}
                        {course.topics.length > 4 && (
                          <li className="text-sm text-base-content/60 ml-7">
                            +{course.topics.length - 4} more units
                          </li>
                        )}
                      </ul>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm uppercase text-primary opacity-80 tracking-wider mb-2">Course Details</h4>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <div className="badge badge-outline">{course.units} Units</div>
                          <div className="badge badge-outline">Prerequisites: {course.prerequisites}</div>
                        </div>
                        <p className="text-sm text-base-content/70 mb-2">{course.examWeight}</p>
                        <p className="text-xs text-base-content/60">Exam: {course.examDate}</p>
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

      {/* Learning Pathways */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Mathematical Learning Pathways</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Choose the pathway that aligns with your academic goals and career aspirations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {pathwayData.map((pathway, index) => (
              <div key={index} className={`card bg-gradient-to-br ${index === 0 ? 'from-blue-50 to-blue-100 border-blue-200' : 'from-green-50 to-green-100 border-green-200'} shadow-lg border`}>
                <div className="card-body">
                  <h3 className={`card-title ${index === 0 ? 'text-primary' : 'text-secondary'} text-xl`}>{pathway.title}</h3>
                  <p className="text-sm text-base-content/70 mb-4">{pathway.description}</p>
                  <div className="space-y-3">
                    {pathway.steps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-center gap-3">
                        <div className={`badge ${index === 0 ? 'badge-primary' : 'badge-secondary'} badge-sm`}>{step.step}</div>
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

      {/* Why Choose Our Math Program */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Why Choose Our Math Program?</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Our mathematics curriculum combines rigorous academic content with personalized instruction 
              to ensure every student reaches their full potential.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="card-title justify-center text-xl mb-3">Conceptual Mastery</h3>
                <p>Focus on deep understanding rather than memorization. Build lasting mathematical intuition.</p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="card-title justify-center text-xl mb-3">Proven Results</h3>
                <p>95% of our students score 4 or 5 on AP exams, well above national averages.</p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">👥</div>
                <h3 className="card-title justify-center text-xl mb-3">Personalized Learning</h3>
                <p>Small class sizes and individual attention ensure every student succeeds.</p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">🧠</div>
                <h3 className="card-title justify-center text-xl mb-3">Problem-Solving Focus</h3>
                <p>Develop critical thinking and analytical skills essential for STEM success.</p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">🎓</div>
                <h3 className="card-title justify-center text-xl mb-3">College Preparation</h3>
                <p>Rigorous curriculum prepares students for advanced mathematics and competitive programs.</p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">⏰</div>
                <h3 className="card-title justify-center text-xl mb-3">Flexible Scheduling</h3>
                <p>One-on-one and group options available to fit your schedule and learning style.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-primary text-primary-content">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Excel in AP Mathematics?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our comprehensive mathematics program and build the skills you need for STEM success. 
            From foundational concepts to advanced applications, we'll guide you every step of the way.
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
