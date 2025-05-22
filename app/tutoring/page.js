import Link from 'next/link';
import Image from 'next/image';

export default function Tutoring() {
  // Tutoring options data
  const tutoringOptions = [
    {
      id: "individual",
      title: "One-on-One Tutoring",
      price: 70,
      description: "Personalized instruction tailored to your specific needs and learning style, with flexible scheduling and focused attention.",
      features: [
        "Private 55-minute Zoom sessions",
        "Personalized curriculum pacing",
        "Homework assistance",
        "Direct access to instructor",
        "Flexible scheduling",
        "Detailed progress reports",
        "Real-time question answering",
        "Custom practice problems"
      ],
      includes: [
        "Initial assessment to identify strengths and areas for improvement",
        "Digital course materials with personalized annotations",
        "Recording of sessions for review",
        "Email support between sessions",
        "Bi-weekly progress reports"
      ],
      idealFor: [
        "Students seeking personalized attention",
        "Those with irregular schedules",
        "Students who prefer to learn at their own pace",
        "Those preparing for upcoming AP exams",
        "English language learners who benefit from adaptive instruction"
      ],
      primary: true,
      cta: "Book One-on-One Session"
    },
    {
      id: "group",
      title: "Small Group Classes",
      price: 30,
      description: "Collaborative learning environment with peer interaction and structured curriculum progression at an affordable price point.",
      features: [
        "Small groups (4-6 students)",
        "55-minute Zoom sessions",
        "Structured curriculum",
        "Collaborative learning",
        "Affordable rates",
        "Comprehensive unit exams",
        "Peer discussion opportunities",
        "Group problem-solving exercises"
      ],
      includes: [
        "Fixed weekly schedule for consistent learning",
        "Digital course materials",
        "Access to group chat for questions",
        "Monthly progress assessments",
        "Group review sessions before major exams"
      ],
      idealFor: [
        "Students who thrive in collaborative environments",
        "Those seeking an affordable option",
        "Students who benefit from peer discussion",
        "Those who prefer structured weekly schedules",
        "Students wanting to compare approaches with peers"
      ],
      primary: false,
      cta: "Join Group Class"
    }
  ];

  // Accordion FAQ items
  const faqItems = [
    {
      question: "How are tutoring sessions conducted?",
      answer: "All tutoring sessions are conducted via Zoom with interactive features including shared digital whiteboard, screen sharing, and collaborative documents. I use a variety of digital tools to create an engaging virtual classroom experience that rivals in-person instruction."
    },
    {
      question: "What is your cancellation policy?",
      answer: "Individual sessions can be rescheduled with 24 hours notice. Cancellations with less than 24 hours notice or missed sessions will be charged at the full session rate. For group classes, missed classes cannot be refunded but recordings are available for review."
    },
    {
      question: "Do you assign homework between sessions?",
      answer: "Yes, appropriate practice is essential for mastering physics concepts. I assign targeted homework based on each student's needs, typically requiring 1-2 hours between sessions. One-on-one students receive personalized assignments, while group class students follow a standard curriculum with some flexibility."
    },
    {
      question: "Can I switch between individual and group tutoring?",
      answer: "Yes, you can switch between formats depending on your needs and budget. Some students combine both approaches—using group sessions for general instruction and occasional one-on-one sessions for targeted help with challenging topics."
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
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">Personalized AP Physics Tutoring</h1>
              <p className="text-lg mb-6">
                Tailored instruction to help you master physics concepts, improve your problem-solving skills, and achieve excellence on the AP Physics 1 exam.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link href="#compare" className="btn btn-primary">Compare Options</Link>
                <Link href="/booking" className="btn btn-outline">Schedule Now</Link>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative w-full h-80">
                <Image 
                  src="/tutoring-hero.svg" 
                  alt="Online tutoring illustration" 
                  fill
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* My Tutoring Approach */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">My Tutoring Approach</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              A proven methodology that combines conceptual understanding with strategic problem-solving techniques.
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
                <h3 className="card-title justify-center">Diagnostic Assessment</h3>
                <p className="text-center">
                  Every tutoring relationship begins with a thorough assessment to identify your specific strengths, areas for improvement, and learning style preferences.
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
                <h3 className="card-title justify-center">Personalized Plan</h3>
                <p className="text-center">
                  Based on your assessment, I create a customized learning plan that targets your specific needs while aligning with the AP Physics curriculum requirements.
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
                <h3 className="card-title justify-center">Multi-Modal Teaching</h3>
                <p className="text-center">
                  I employ visual, verbal, and interactive teaching methods to accommodate different learning styles and make complex physics concepts accessible.
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
                <h3 className="card-title justify-center">Regular Assessment</h3>
                <p className="text-center">
                  Ongoing formative assessment allows us to track progress, identify misconceptions early, and adjust our approach as needed.
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
                <h3 className="card-title justify-center">Exam Strategies</h3>
                <p className="text-center">
                  Beyond content knowledge, I teach proven test-taking strategies specific to the AP Physics 1 exam format to maximize your score.
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
                <h3 className="card-title justify-center">Supplemental Resources</h3>
                <p className="text-center">
                  I provide carefully selected supplemental materials, practice problems, and digital resources to reinforce learning between sessions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tutoring Options */}
      <section id="compare" className="py-16 bg-base-100">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Choose Your Tutoring Format</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Select the learning approach that best fits your needs, learning style, and budget.
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
          <div className="mt-12 bg-base-200 rounded-lg shadow-md p-6">
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
          </div>
        </div>
      </section>

      {/* The Tutoring Process */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">The Tutoring Process</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              A structured approach from initial contact to ongoing academic success.
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
                  <p>A free 15-minute consultation to discuss your goals, current understanding of physics, and determine if my teaching approach is a good fit for your needs.</p>
                </div>
                <hr/>
              </li>
              <li>
                <hr/>
                <div className="timeline-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                </div>
                <div className="timeline-end mb-10">
                  <div className="text-lg font-black">Diagnostic Assessment</div>
                  <p>Your first full session includes a comprehensive assessment to identify your strengths, areas for improvement, and learning preferences.</p>
                </div>
                <hr/>
              </li>
              <li>
                <hr/>
                <div className="timeline-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                </div>
                <div className="timeline-start md:text-end mb-10">
                  <div className="text-lg font-black">Personalized Learning Plan</div>
                  <p>Based on your assessment, I develop a customized learning plan with specific objectives, timeline, and recommended session frequency.</p>
                </div>
                <hr/>
              </li>
              <li>
                <hr/>
                <div className="timeline-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                </div>
                <div className="timeline-end mb-10">
                  <div className="text-lg font-black">Regular Tutoring Sessions</div>
                  <p>Interactive online sessions following your learning plan, with real-time problem solving, concept explanation, and progress tracking.</p>
                </div>
                <hr/>
              </li>
              <li>
                <hr/>
                <div className="timeline-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                </div>
                <div className="timeline-start md:text-end mb-10">
                  <div className="text-lg font-black">Practice & Homework</div>
                  <p>Between sessions, you'll complete targeted assignments designed to reinforce concepts and build problem-solving skills.</p>
                </div>
                <hr/>
              </li>
              <li>
                <hr/>
                <div className="timeline-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                </div>
                <div className="timeline-end mb-10">
                  <div className="text-lg font-black">Ongoing Assessment</div>
                  <p>Regular progress checks and unit assessments to measure growth and adjust the learning plan as needed for optimal results.</p>
                </div>
                <hr/>
              </li>
              <li>
                <hr/>
                <div className="timeline-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                </div>
                <div className="timeline-start md:text-end">
                  <div className="text-lg font-black">Exam Preparation</div>
                  <p>As the AP exam approaches, we'll focus on review strategies, practice exams, and targeted preparation for the specific exam format.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Student Success Stories</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Hear from students who have achieved excellent results with our tutoring approach.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="card bg-base-200 shadow-md">
              <div className="card-body">
                <div className="flex items-center mb-4">
                  <div className="avatar placeholder mr-4">
                    <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
                      <span>JD</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold">Jamie D.</h3>
                    <p className="text-sm">AP Physics 1 Student</p>
                  </div>
                </div>
                <p className="italic">
                  "The structured approach and personalized feedback helped me achieve a 5 on the AP exam. 
                  The fluid mechanics section was particularly helpful as it was a challenging topic for me."
                </p>
                <div className="flex mt-4">
                  <div className="rating rating-sm">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <input 
                        key={star}
                        type="radio" 
                        name="rating-1" 
                        className="mask mask-star-2 bg-orange-400" 
                        checked={star === 5} 
                        readOnly
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card bg-base-200 shadow-md">
              <div className="card-body">
                <div className="flex items-center mb-4">
                  <div className="avatar placeholder mr-4">
                    <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
                      <span>RL</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold">Ryan L.</h3>
                    <p className="text-sm">English Language Learner</p>
                  </div>
                </div>
                <p className="italic">
                  "As an ESL student, I struggled with physics terminology. The visual teaching methods and patient explanations helped me understand complex concepts despite the language barrier. I improved from a C to an A- in my school physics class."
                </p>
                <div className="flex mt-4">
                  <div className="rating rating-sm">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <input 
                        key={star}
                        type="radio" 
                        name="rating-2" 
                        className="mask mask-star-2 bg-orange-400" 
                        checked={star === 5} 
                        readOnly
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="card bg-base-200 shadow-md">
              <div className="card-body">
                <div className="flex items-center mb-4">
                  <div className="avatar placeholder mr-4">
                    <div className="bg-neutral-focus text-neutral-content rounded-full w-12">
                      <span>MK</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold">Misha K.</h3>
                    <p className="text-sm">Group Class Student</p>
                  </div>
                </div>
                <p className="italic">
                  "The group classes were affordable and effective. I liked hearing other students' questions as they often addressed points I hadn't considered. The collaborative problem-solving sessions were especially valuable for understanding complex topics."
                </p>
                <div className="flex mt-4">
                  <div className="rating rating-sm">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <input 
                        key={star}
                        type="radio" 
                        name="rating-3" 
                        className="mask mask-star-2 bg-orange-400" 
                        checked={star === 5} 
                        readOnly
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Common questions about our tutoring services.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {faqItems.map((item, index) => (
              <div key={index} className="collapse collapse-plus bg-base-100 mb-4">
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
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Physics Understanding?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Whether you choose one-on-one tutoring or our affordable group classes, I'm committed to helping you achieve excellence in AP Physics.
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
