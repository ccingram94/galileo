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
      icon: (
        <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
      description: "Building strong foundations from function analysis through advanced calculus concepts."
    },
    {
      subject: "Physics", 
      courses: ["AP Physics 1", "AP Physics 2", "AP Physics C"],
      icon: (
        <svg className="h-8 w-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      ),
      description: "From algebra-based mechanics to calculus-based electromagnetism and beyond."
    }
  ];

  // Accordion FAQ items
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
      {/* Hero Section */}
      <section className="bg-base-100 py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="badge badge-primary mb-4">7 STEM Courses Available</div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">Expert Math & Physics Exam Tutoring</h1>
              <p className="text-lg mb-6">
                Comprehensive instruction across all our Math and Physics courses. From foundational precalculus to advanced calculus-based physics, 
                get personalized support to excel on your AP exams.
              </p>
              
              {/* Subject badges */}
              <div className="flex flex-wrap gap-3 mb-6">
                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-full border border-blue-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium">Mathematics</span>
                </div>
                <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-2 rounded-full border border-green-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span className="text-sm font-medium">Physics</span>
                </div>
              </div>

              <div className="flex gap-4 flex-wrap">
                <Link href="#compare" className="btn btn-primary">Compare Options</Link>
                <Link href="/booking" className="btn btn-outline">Schedule Now</Link>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative w-full h-80">
                <Image 
                  src="/stem-tutoring-hero.svg" 
                  alt="Online STEM tutoring illustration showing math and physics concepts" 
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subject-Specific Approaches */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Subject-Specific Expertise</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Specialized teaching approaches tailored to the unique demands of Math and Physics AP courses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {subjectApproaches.map((subject, index) => (
              <div key={index} className="card bg-base-100 shadow-lg border-l-4 border-primary">
                <div className="card-body">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                      {subject.icon}
                    </div>
                    <div>
                      <h3 className="card-title">{subject.subject}</h3>
                      <p className="text-sm text-base-content/70">{subject.courses.length} AP Courses</p>
                    </div>
                  </div>
                  
                  <p className="mb-4">{subject.description}</p>
                  
                  <div className="space-y-2">
                    {subject.courses.map((course, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm">{course}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* My Tutoring Approach */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">My STEM Tutoring Approach</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              A proven methodology that combines conceptual understanding with strategic problem-solving techniques across Mathematics and Physics.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all h-full">
              <div className="card-body">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-primary/10 p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                </div>
                <h3 className="card-title justify-center">Multi-Subject Assessment</h3>
                <p className="text-center">
                  Every tutoring relationship begins with a comprehensive assessment across your enrolled STEM subjects to identify strengths, areas for improvement, and connections between courses.
                </p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all h-full">
              <div className="card-body">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-primary/10 p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                </div>
                <h3 className="card-title justify-center">Integrated Learning Plan</h3>
                <p className="text-center">
                  I create customized learning plans that connect mathematical concepts with physical applications, showing how calculus tools enhance physics problem-solving.
                </p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all h-full">
              <div className="card-body">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-primary/10 p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
                <h3 className="card-title justify-center">Subject-Adaptive Teaching</h3>
                <p className="text-center">
                  I employ different teaching methods optimized for each subject—algebraic thinking for math, conceptual frameworks for physics—while maintaining coherent connections.
                </p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all h-full">
              <div className="card-body">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-primary/10 p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                    </svg>
                  </div>
                </div>
                <h3 className="card-title justify-center">Cross-Subject Assessment</h3>
                <p className="text-center">
                  Regular assessment tracks progress across all enrolled subjects, ensuring balanced development and readiness for multiple AP exams.
                </p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all h-full">
              <div className="card-body">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-primary/10 p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                </div>
                <h3 className="card-title justify-center">Exam Strategy Specialization</h3>
                <p className="text-center">
                  I teach subject-specific test-taking strategies for each AP exam format while helping students manage multiple exam preparations efficiently.
                </p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all h-full">
              <div className="card-body">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-primary/10 p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <h3 className="card-title justify-center">Comprehensive Resources</h3>
                <p className="text-center">
                  I provide carefully curated resources for each subject, including subject-specific practice problems, digital tools, and supplemental materials for both Math and Physics courses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tutoring Options */}
      <section id="compare" className="py-16 bg-base-200">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Choose Your Tutoring Format</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Select the learning approach that best fits your needs, learning style, and budget across our STEM curriculum.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {tutoringOptions.map((option) => (
              <div key={option.id} className={`card bg-base-100 shadow-xl ${option.primary ? 'border-2 border-primary' : ''}`}>
                <div className="card-body">
                  <h3 className="card-title text-2xl">{option.title}</h3>
                  <div className="mt-2 mb-4">
                    <span className="text-3xl font-bold">${option.price}</span>
                    <span className="text-base-content/70 ml-1">per hour</span>
                  </div>
                  
                  <p className="text-lg mb-4">{option.description}</p>
                  
                  <div className="divider"></div>
                  
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Key Features</h4>
                    <ul className="space-y-2 mb-6">
                      {option.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-lg mb-2">What's Included</h4>
                    <ul className="space-y-2 mb-6">
                      {option.includes.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="bg-base-200 p-4 rounded-lg mb-6">
                    <h4 className="font-semibold text-lg mb-2">Ideal For</h4>
                    <ul className="space-y-2">
                      {option.idealFor.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-secondary shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="card-actions justify-end mt-auto">
                    <Link href={`/booking/${option.id}`} className={`btn ${option.primary ? 'btn-primary' : 'btn-outline btn-primary'} w-full`}>
                      {option.cta}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Package Discounts */}
          <div className="mt-12 bg-base-100 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold mb-4">Session Package Discounts</h3>
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Package</th>
                    <th>One-on-One Price</th>
                    <th>Group Class Price</th>
                    <th>Savings</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Single Session</td>
                    <td>$70 per session</td>
                    <td>$30 per session</td>
                    <td>—</td>
                  </tr>
                  <tr>
                    <td>5-Session Package</td>
                    <td>$325 ($65 per session)</td>
                    <td>$135 ($27 per session)</td>
                    <td>~7% discount</td>
                  </tr>
                  <tr>
                    <td>10-Session Package</td>
                    <td>$600 ($60 per session)</td>
                    <td>$250 ($25 per session)</td>
                    <td>~15% discount</td>
                  </tr>
                  <tr>
                    <td>Monthly Group Subscription</td>
                    <td>—</td>
                    <td>$100 (4 sessions)</td>
                    <td>~17% discount</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-base-content/70 mt-4">
              * Discounts apply per subject. Students enrolled in multiple subjects receive package pricing for each course.
            </p>
          </div>
        </div>
      </section>

      {/* The Tutoring Process */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">The STEM Tutoring Process</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              A structured approach from initial contact to ongoing academic success across multiple STEM subjects.
            </p>
          </div>
          
          <div className="flex flex-col max-w-3xl mx-auto">
            <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
              <li>
                <div className="timeline-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                </div>
                <div className="timeline-start md:text-end mb-10">
                  <div className="text-lg font-black">Initial Consultation</div>
                  <p>A free 15-minute consultation to discuss your academic goals, current understanding across STEM subjects, and determine which courses best fit your needs and timeline.</p>
                </div>
                <hr/>
              </li>
              <li>
                <hr/>
                <div className="timeline-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                </div>
                <div className="timeline-end mb-10">
                  <div className="text-lg font-black">Multi-Subject Assessment</div>
                  <p>Your first full session includes comprehensive assessment across all enrolled subjects to identify strengths, areas for improvement, and connections between Math and Physics concepts.</p>
                </div>
                <hr/>
              </li>
              <li>
                <hr/>
                <div className="timeline-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                </div>
                <div className="timeline-start md:text-end mb-10">
                  <div className="text-lg font-black">Integrated Learning Plan</div>
                  <p>I develop a customized learning plan that coordinates across subjects, showing how mathematical tools enhance physics problem-solving and ensuring balanced progress.</p>
                </div>
                <hr/>
              </li>
              <li>
                <hr/>
                <div className="timeline-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                </div>
                <div className="timeline-end mb-10">
                  <div className="text-lg font-black">Subject-Focused Sessions</div>
                  <p>Interactive online sessions following your integrated learning plan, with real-time problem solving, concept explanation, and progress tracking across all enrolled subjects.</p>
                </div>
                <hr/>
              </li>
              <li>
                <hr/>
                <div className="timeline-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                </div>
                <div className="timeline-start md:text-end mb-10">
                  <div className="text-lg font-black">Cross-Subject Practice</div>
                  <p>Between sessions, you'll complete targeted assignments designed to reinforce concepts within each subject while highlighting connections between mathematical and physical reasoning.</p>
                </div>
                <hr/>
              </li>
              <li>
                <hr/>
                <div className="timeline-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                </div>
                <div className="timeline-end mb-10">
                  <div className="text-lg font-black">Comprehensive Assessment</div>
                  <p>Regular progress checks and unit assessments across all subjects to measure growth and adjust the integrated learning plan for optimal results.</p>
                </div>
                <hr/>
              </li>
              <li>
                <hr/>
                <div className="timeline-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                </div>
                <div className="timeline-start md:text-end">
                  <div className="text-lg font-black">Multi-Exam Preparation</div>
                  <p>As AP exams approach, we'll coordinate review strategies across all your subjects, ensuring efficient preparation for multiple exams with subject-specific practice and timing strategies.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Common questions about our comprehensive STEM tutoring services.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {faqItems.map((item, index) => (
              <div key={index} className="collapse collapse-plus bg-base-200 mb-4">
                <input type="radio" name="faq-accordion" checked={index === 0 ? "checked" : ""} /> 
                <div className="collapse-title text-xl font-medium">
                  {item.question}
                </div>
                <div className="collapse-content"> 
                  <p>{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 bg-primary text-primary-content">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your STEM Understanding?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Whether you choose one-on-one tutoring or our affordable group classes, I'm committed to helping you achieve excellence across all your STEM subjects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn btn-secondary">
              Schedule a Free Consultation
            </Link>
            <Link href="/booking" className="btn bg-white text-primary hover:bg-base-200">
              Book Your First Session
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
