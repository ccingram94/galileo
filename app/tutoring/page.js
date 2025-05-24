import Link from 'next/link';
import Image from 'next/image';

export default function Tutoring() {
  // Tutoring options data
  const tutoringOptions = [
    {
      id: "individual",
      title: "One-on-One Tutoring",
      price: 70,
      description: "Personalized instruction tailored to your specific needs and learning style across all STEM subjects, with flexible scheduling and focused attention.",
      features: [
        "Private 55-minute Zoom sessions",
        "Personalized curriculum pacing",
        "Multi-subject expertise (Math & Physics)",
        "Homework assistance across all courses",
        "Direct access to instructor",
        "Flexible scheduling",
        "Detailed progress reports",
        "Real-time question answering"
      ],
      includes: [
        "Initial assessment to identify strengths and areas for improvement",
        "Digital course materials with personalized annotations",
        "Recording of sessions for review",
        "Email support between sessions",
        "Bi-weekly progress reports across all enrolled subjects"
      ],
      idealFor: [
        "Students seeking personalized attention",
        "Those with irregular schedules",
        "Students who prefer to learn at their own pace",
        "Those preparing for multiple AP exams",
        "Students needing help across different STEM subjects",
        "English language learners who benefit from adaptive instruction"
      ],
      primary: true,
      cta: "Book One-on-One Session"
    },
    {
      id: "group",
      title: "Small Group Classes",
      price: 30,
      description: "Collaborative learning environment with subject-specific peer interaction and structured curriculum progression at an affordable price point.",
      features: [
        "Small groups (4-6 students)",
        "55-minute Zoom sessions",
        "Subject-specific structured curriculum",
        "Collaborative learning within each course",
        "Affordable rates",
        "Comprehensive unit exams",
        "Peer discussion opportunities",
        "Group problem-solving exercises"
      ],
      includes: [
        "Fixed weekly schedule for consistent learning",
        "Subject-specific digital course materials",
        "Access to course-specific group chat for questions",
        "Monthly progress assessments",
        "Group review sessions before major exams"
      ],
      idealFor: [
        "Students who thrive in collaborative environments",
        "Those seeking an affordable option",
        "Students who benefit from peer discussion",
        "Those who prefer structured weekly schedules",
        "Students wanting to compare approaches with peers",
        "Students focusing on one specific AP course"
      ],
      primary: false,
      cta: "Join Group Class"
    }
  ];

  // Subject areas for the approach section
  const subjectApproaches = [
    {
      subject: "Mathematics",
      courses: ["AP Precalculus", "AP Calculus AB", "AP Calculus BC"],
      icon: "🧮",
      color: "from-primary/20 to-primary/10",
      description: "Building strong foundations from function analysis through advanced calculus concepts."
    },
    {
      subject: "Physics", 
      courses: ["AP Physics 1", "AP Physics 2", "AP Physics C"],
      icon: "⚛️",
      color: "from-secondary/20 to-secondary/10",
      description: "From algebra-based mechanics to calculus-based electromagnetism and beyond."
    }
  ];

  // FAQ items with enhanced structure
  const faqItems = [
    {
      question: "How are tutoring sessions conducted?",
      answer: "All tutoring sessions are conducted via Zoom with interactive features including shared digital whiteboard, screen sharing, and collaborative documents. I use a variety of digital tools to create an engaging virtual classroom experience that rivals in-person instruction across all Math and Physics subjects."
    },
    {
      question: "Can you help with multiple AP courses simultaneously?",
      answer: "Absolutely! Many students work with me across multiple subjects - for example, taking AP Calculus AB while preparing for AP Physics 1, or advancing from AP Physics 1 to AP Physics C: Mechanics. I can coordinate instruction across subjects to reinforce mathematical concepts in physics applications."
    },
    {
      question: "What is your cancellation policy?",
      answer: "Individual sessions can be rescheduled with 24 hours notice. Cancellations with less than 24 hours notice or missed sessions will be charged at the full session rate. For group classes, missed classes cannot be refunded but recordings are available for review."
    },
    {
      question: "How do you differentiate instruction between Math and Physics courses?",
      answer: "Each subject requires a tailored approach. Math courses focus on building computational fluency and conceptual understanding of functions and calculus. Physics courses emphasize conceptual understanding, problem-solving strategies, and connecting mathematical tools to physical phenomena. I adjust my teaching methods based on the specific demands of each AP course."
    },
    {
      question: "Do you assign homework between sessions?",
      answer: "Yes, appropriate practice is essential for mastering STEM concepts. I assign targeted homework based on each student's needs and the specific course requirements, typically requiring 1-2 hours between sessions. One-on-one students receive personalized assignments, while group class students follow a structured curriculum with some flexibility."
    },
    {
      question: "Can I switch between individual and group tutoring?",
      answer: "Yes, you can switch between formats depending on your needs and budget. Some students combine both approaches—using group sessions for general instruction and occasional one-on-one sessions for targeted help with challenging topics or exam preparation across multiple subjects."
    },
    {
      question: "How do payments work?",
      answer: "Individual sessions can be purchased as single sessions or in discounted packages of 5 or 10 sessions. Group classes are billed monthly for a set number of sessions. All payments are processed securely through Stripe, and invoices are provided for your records."
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section - Enhanced with better visual hierarchy */}
      <section className="relative bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
        <div className="container mx-auto max-w-7xl px-6 relative">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-6">
              <div className="badge badge-outline badge-lg text-primary border-primary/30">
                7 STEM Courses Available
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Expert Math & Physics 
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block">
                  Exam Tutoring
                </span>
              </h1>
              <p className="text-xl text-base-content/80 leading-relaxed max-w-lg">
                Comprehensive instruction across all our Math and Physics courses. From foundational precalculus to advanced calculus-based physics, get personalized support to excel on your AP exams.
              </p>
              
              {/* Enhanced Subject badges */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-3 bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 px-4 py-3 rounded-xl">
                  <span className="text-2xl">🧮</span>
                  <span className="font-medium text-primary">Mathematics</span>
                </div>
                <div className="flex items-center gap-3 bg-gradient-to-r from-secondary/10 to-secondary/5 border border-secondary/20 px-4 py-3 rounded-xl">
                  <span className="text-2xl">⚛️</span>
                  <span className="font-medium text-secondary">Physics</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="#compare" className="btn btn-primary btn-lg shadow-lg">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Compare Options
                </Link>
                <Link href="/booking" className="btn btn-outline btn-lg hover:btn-primary">
                  Schedule Now
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative w-96 h-96 rounded-2xl overflow-hidden shadow-2xl">
                  <Image 
                    src="/about-hero.jpg" 
                    alt="STEM tutoring session" 
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Subject-Specific Approaches */}
      <section className="py-20 bg-gradient-to-br from-base-200 via-base-200 to-base-300/50">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <div className="badge badge-secondary badge-lg mb-4">Our Expertise</div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Subject-Specific Expertise</h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              Specialized teaching approaches tailored to the unique demands of Math and Physics AP courses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            {subjectApproaches.map((subject, index) => (
              <div key={index} className="group">
                <div className="card bg-base-100 shadow-xl border border-base-300/30 h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                  <div className="card-body p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${subject.color} flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                        {subject.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{subject.subject}</h3>
                        <p className="text-base-content/60">{subject.courses.length} AP Courses</p>
                      </div>
                    </div>
                    
                    <p className="text-base-content/80 mb-6 leading-relaxed">{subject.description}</p>
                    
                    <div className="space-y-3">
                      {subject.courses.map((course, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200/50 transition-colors">
                          <svg className="w-5 h-5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="font-medium">{course}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Tutoring Approach */}
      <section className="py-20 bg-base-100">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <div className="badge badge-primary badge-lg mb-4">Our Methods</div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">My STEM Tutoring Approach</h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              A proven methodology that combines conceptual understanding with strategic problem-solving techniques across Mathematics and Physics.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                ),
                title: "Multi-Subject Assessment",
                description: "Every tutoring relationship begins with a comprehensive assessment across your enrolled STEM subjects to identify strengths, areas for improvement, and connections between courses.",
                color: "from-primary/20 to-primary/10"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                ),
                title: "Integrated Learning Plan",
                description: "I create customized learning plans that connect mathematical concepts with physical applications, showing how calculus tools enhance physics problem-solving.",
                color: "from-secondary/20 to-secondary/10"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Subject-Adaptive Teaching",
                description: "I employ different teaching methods optimized for each subject—algebraic thinking for math, conceptual frameworks for physics—while maintaining coherent connections.",
                color: "from-accent/20 to-accent/10"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                  </svg>
                ),
                title: "Cross-Subject Assessment",
                description: "Regular assessment tracks progress across all enrolled subjects, ensuring balanced development and readiness for multiple AP exams.",
                color: "from-primary/20 to-primary/10"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                ),
                title: "Exam Strategy Specialization",
                description: "I teach subject-specific test-taking strategies for each AP exam format while helping students manage multiple exam preparations efficiently.",
                color: "from-secondary/20 to-secondary/10"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ),
                title: "Comprehensive Resources",
                description: "I provide carefully curated resources for each subject, including subject-specific practice problems, digital tools, and supplemental materials for both Math and Physics courses.",
                color: "from-accent/20 to-accent/10"
              }
            ].map((approach, index) => (
              <div key={index} className="group">
                <div className="card bg-base-100 shadow-xl border border-base-300/30 h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                  <div className="card-body p-8 text-center">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${approach.color} flex items-center justify-center text-primary mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {approach.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">
                      {approach.title}
                    </h3>
                    <p className="text-base-content/70 leading-relaxed">
                      {approach.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Tutoring Options */}
      <section id="compare" className="py-20 bg-gradient-to-br from-base-200 via-base-200 to-base-300/50">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <div className="badge badge-accent badge-lg mb-4">Choose Your Path</div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Choose Your Tutoring Format</h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              Select the learning approach that best fits your needs, learning style, and budget across our STEM curriculum.
            </p>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 mb-16">
            {tutoringOptions.map((option) => (
              <div key={option.id} className="group">
                <div className={`card bg-base-100 shadow-2xl border border-base-300/30 h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ${option.primary ? 'ring-2 ring-primary/30' : ''}`}>
                  <div className="card-body p-8">
                    {option.primary && (
                      <div className="badge badge-primary badge-lg mb-4 self-start">Most Popular</div>
                    )}
                    
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-16 h-16 rounded-2xl ${option.primary ? 'bg-gradient-to-br from-primary/20 to-primary/10' : 'bg-gradient-to-br from-secondary/20 to-secondary/10'} flex items-center justify-center text-2xl`}>
                        {option.primary ? '👨‍🏫' : '👥'}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{option.title}</h3>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-bold text-primary">${option.price}</span>
                          <span className="text-base-content/60">per hour</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-lg mb-6 text-base-content/80">{option.description}</p>
                    
                    <div className="divider opacity-30"></div>
                    
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-semibold text-lg mb-3 text-primary">Key Features</h4>
                        <ul className="space-y-2">
                          {option.features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <svg className="w-5 h-5 text-success shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-lg mb-3 text-secondary">What's Included</h4>
                        <ul className="space-y-2">
                          {option.includes.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <svg className="w-5 h-5 text-primary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span className="text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-gradient-to-r from-base-200/50 to-base-300/50 p-4 rounded-xl">
                        <h4 className="font-semibold text-lg mb-3 text-accent">Ideal For</h4>
                        <ul className="space-y-2">
                          {option.idealFor.map((item, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <svg className="w-5 h-5 text-secondary shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                              </svg>
                              <span className="text-sm">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <Link href={`/booking/${option.id}`} 
                            className={`btn w-full btn-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 ${option.primary ? 'btn-primary' : 'btn-outline btn-primary'}`}>
                        {option.cta}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Package Discounts */}
          <div className="card bg-base-100 shadow-xl border border-base-300/30">
            <div className="card-body p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold">Session Package Discounts</h3>
              </div>
              
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th className="text-base">Package</th>
                      <th className="text-base">One-on-One Price</th>
                      <th className="text-base">Group Class Price</th>
                      <th className="text-base">Savings</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="font-semibold">Single Session</td>
                      <td>$70 per session</td>
                      <td>$30 per session</td>
                      <td>—</td>
                    </tr>
                    <tr>
                      <td className="font-semibold">5-Session Package</td>
                      <td>$325 <span className="text-sm text-base-content/60">($65 per session)</span></td>
                      <td>$135 <span className="text-sm text-base-content/60">($27 per session)</span></td>
                      <td><span className="badge badge-success">~7% discount</span></td>
                    </tr>
                    <tr>
                      <td className="font-semibold">10-Session Package</td>
                      <td>$600 <span className="text-sm text-base-content/60">($60 per session)</span></td>
                      <td>$250 <span className="text-sm text-base-content/60">($25 per session)</span></td>
                      <td><span className="badge badge-success">~15% discount</span></td>
                    </tr>
                    <tr>
                      <td className="font-semibold">Monthly Group Subscription</td>
                      <td>—</td>
                      <td>$100 <span className="text-sm text-base-content/60">(4 sessions)</span></td>
                      <td><span className="badge badge-success">~17% discount</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="alert alert-info mt-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span className="text-sm">Discounts apply per subject. Students enrolled in multiple subjects receive package pricing for each course.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Tutoring Process */}
      <section className="py-20 bg-base-100">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <div className="badge badge-primary badge-lg mb-4">Step by Step</div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">The STEM Tutoring Process</h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              A structured approach from initial contact to ongoing academic success across multiple STEM subjects.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <ul className="timeline timeline-snap-icon timeline-compact timeline-vertical">
              {[
                {
                  title: "Initial Consultation",
                  description: "A free 15-minute consultation to discuss your academic goals, current understanding across STEM subjects, and determine which courses best fit your needs and timeline."
                },
                {
                  title: "Multi-Subject Assessment",
                  description: "Your first full session includes comprehensive assessment across all enrolled subjects to identify strengths, areas for improvement, and connections between Math and Physics concepts."
                },
                {
                  title: "Integrated Learning Plan",
                  description: "I develop a customized learning plan that coordinates across subjects, showing how mathematical tools enhance physics problem-solving and ensuring balanced progress."
                },
                {
                  title: "Subject-Focused Sessions",
                  description: "Interactive online sessions following your integrated learning plan, with real-time problem solving, concept explanation, and progress tracking across all enrolled subjects."
                },
                {
                  title: "Cross-Subject Practice",
                  description: "Between sessions, you'll complete targeted assignments designed to reinforce concepts within each subject while highlighting connections between mathematical and physical reasoning."
                },
                {
                  title: "Comprehensive Assessment",
                  description: "Regular progress checks and unit assessments across all subjects to measure growth and adjust the integrated learning plan for optimal results."
                },
                {
                  title: "Multi-Exam Preparation",
                  description: "As AP exams approach, we'll coordinate review strategies across all your subjects, ensuring efficient preparation for multiple exams with subject-specific practice and timing strategies."
                }
              ].map((step, index) => (
                <li key={index}>
                  <div className="timeline-middle">
                    <div className="w-4 h-4 rounded-full bg-primary"></div>
                  </div>
                  <div className={`timeline-${index % 2 === 0 ? 'start' : 'end'} mb-10`}>
                    <div className="card bg-base-100 shadow-lg border border-base-300/30 hover:shadow-xl transition-all duration-300">
                      <div className="card-body p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </div>
                          <h3 className="text-lg font-bold">{step.title}</h3>
                        </div>
                        <p className="text-base-content/70 text-sm leading-relaxed">{step.description}</p>
                      </div>
                    </div>
                  </div>
                  {index < 6 && <hr className="bg-base-300"/>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Enhanced FAQ Section */}
      <section className="py-20 bg-gradient-to-br from-base-200 via-base-200 to-base-300/50">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <div className="badge badge-secondary badge-lg mb-4">Common Questions</div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              Common questions about our comprehensive STEM tutoring services.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <div key={index} className="collapse collapse-plus bg-base-100 shadow-lg border border-base-300/30 hover:shadow-xl transition-all duration-300">
                  <input type="radio" name="faq-accordion" defaultChecked={index === 0} /> 
                  <div className="collapse-title text-xl font-semibold">
                    {item.question}
                  </div>
                  <div className="collapse-content"> 
                    <p className="text-base-content/80 leading-relaxed">{item.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Call to Action */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary to-secondary text-primary-content relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
        <div className="container mx-auto max-w-7xl px-6 text-center relative">
          <div className="max-w-4xl mx-auto">
            <div className="badge badge-outline badge-lg text-primary-content border-primary-content/30 mb-6">
              Start Learning Today
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-8 leading-tight">
              Ready to Transform Your 
              <span className="block">STEM Understanding?</span>
            </h2>
            <p className="text-xl mb-12 text-primary-content/90 leading-relaxed max-w-3xl mx-auto">
              Whether you choose one-on-one tutoring or our affordable group classes, I'm committed to helping you achieve excellence across all your STEM subjects.
            </p>
            <div className="flex flex-col lg:flex-row gap-6 justify-center items-center">
              <Link href="/contact" className="btn btn-secondary btn-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Schedule a Free Consultation
              </Link>
              <Link href="/booking" className="btn bg-white/20 backdrop-blur-sm text-primary-content border-white/30 hover:bg-white hover:text-primary btn-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Book Your First Session
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
