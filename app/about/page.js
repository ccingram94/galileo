import Image from 'next/image';
import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-base-200 py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Mission at Galileo Academics</h1>
              <p className="text-lg mb-6">
                To provide exceptional AP Physics education that unlocks academic potential and builds scientific confidence in every student, regardless of their background or primary language.
              </p>
              <div className="flex gap-4">
                <Link href="/courses" className="btn btn-primary">Explore Courses</Link>
                <Link href="/contact" className="btn btn-outline">Contact Us</Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-80 h-80">
                <Image 
                  src="/about-hero.jpg" 
                  alt="Teaching students" 
                  fill
                  className="object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder's Journey */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">The Founder's Journey</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              From university honors to founding a specialized AP Physics tutoring service
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-12 items-start">
            <div className="md:w-1/3">
              <div className="sticky top-24">
                <div className="avatar mb-6">
                  <div className="w-48 h-48 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 mx-auto overflow-hidden">
                    <Image 
                      src="/instructor-profile.jpg" 
                      alt="Mark Sterling" 
                      width={192}
                      height={192}
                      className="object-cover"
                    />
                  </div>
                </div>
                
                <div className="card bg-base-200 shadow-md">
                  <div className="card-body">
                    <h3 className="card-title">Mark Sterling</h3>
                    <p className="text-sm mb-4">Founder & Lead AP Physics Instructor</p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                        <span>Teaching since 2018</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                        <span>University of Texas at Austin, 2015</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                        <span>Phi Alpha Theta Honors</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                        <span>ESL & Multicultural Education Specialist</span>
                      </div>
                    </div>
                    
                    <div className="divider"></div>
                    
                    <div className="flex justify-center gap-4">
                      <a href="https://www.linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" className="btn btn-circle btn-sm btn-outline">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                      <a href="mailto:contact@galileoacademics.com" className="btn btn-circle btn-sm btn-outline">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                          <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-2/3 space-y-8">
              <div className="prose max-w-none">
                <h3>Education and Academic Foundation</h3>
                <p>
                  My journey began at the University of Texas at Austin, where I graduated in 2015 with Phi Alpha Theta honors. This academic foundation instilled in me a passion for rigorous research, critical analysis, and the historical context of scientific advancement that I bring to my teaching approach. Understanding that science has a history helps students connect with the evolution of scientific thinking and see themselves as part of that ongoing journey.
                </p>
                
                <h3>From College Advisor to STEM Educator</h3>
                <p>
                  After graduation, I served as a college advisor focusing on Concurrent Enrollment (dual credit) students and graduating seniors. Working with these students revealed a critical need: many were struggling with STEM subjects that served as gatekeepers to their desired career paths. This experience directly informed my teaching philosophy and led me to focus on making complex STEM concepts more accessible.
                </p>
                <p>
                  As a Pathway Navigator at the Community College of Aurora, I managed a caseload of over 200 concurrent enrollment students, providing comprehensive support with academic planning, course registration, and graduation requirements. This experience gave me valuable insights into the challenges students face when transitioning to college-level coursework, particularly in STEM fields.
                </p>
                
                <h3>Multicultural Teaching Experience</h3>
                <p>
                  My experience teaching Newcomer English Physics at Aurora Central High School was transformative. Working with students from over 40 countries speaking more than 50 languages, I developed specialized techniques for breaking down complex physics concepts across language barriers. This experience shaped my approach to curriculum development and differentiated instruction that now benefits all my students at Galileo Academics.
                </p>
                <p>
                  Additionally, as an ESL Teacher with VIPKID from 2017 to 2019, I delivered over 3,000 virtual English lessons to students in Mainland China, maintaining a 4.8/5 parent satisfaction rating. This experience honed my skills in creating engaging online learning environments and communicating complex concepts clearly across cultural and linguistic differences.
                </p>
                
                <h3>Tech Industry Insights</h3>
                <p>
                  My professional background extends beyond education. I worked as an Intellectual Property Analyst at Accenture, supporting Facebook (now Meta) Legal Operations, where I consistently exceeded performance expectations by processing 500% above standard key performance indicators while maintaining 95-100% quality assurance scores. At Hotel Engine, a unicorn startup that raised $65 million in Series B funding, I contributed to their rapid growth while developing valuable skills in working with innovative technologies.
                </p>
                <p>
                  This unique combination of tech industry experience with educational expertise allows me to incorporate cutting-edge approaches to learning analytics, assessment design, and educational technology that benefit my students at Galileo Academics.
                </p>
                
                <h3>Founding Galileo Academics</h3>
                <p>
                  I founded Galileo Academics with a clear mission: to provide premium STEM instruction to high school students seeking advanced preparation for AP examinations. As both founder and lead instructor, I develop comprehensive curriculum aligned with College Board standards while managing all aspects of this educational venture.
                </p>
                <p>
                  My responsibilities include designing AP-aligned curriculum for STEM subjects, developing the digital infrastructure using Next.js and other modern technologies, implementing data-driven instructional methodologies, and creating engaging remote learning experiences that consistently yield measurable improvements in student comprehension and AP exam scores.
                </p>
              </div>
              
              <div className="divider"></div>
              
              <div className="card bg-primary text-primary-content">
                <div className="card-body">
                  <h3 className="card-title">Teaching Philosophy and Methodology</h3>
                  <p>
                    My teaching philosophy centers on three core principles:
                  </p>
                  <ul className="space-y-2 mt-2">
                    <li className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span><strong>Accessibility:</strong> Physics concepts should be accessible to all students regardless of their background or primary language. I use multiple modalities (visual, verbal, and interactive) to ensure concepts connect with diverse learning styles.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span><strong>Mastery Through Application:</strong> Students truly understand physics when they can apply concepts to novel situations. My curriculum emphasizes problem-solving strategies that translate to success on the AP exam and beyond.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span><strong>Data-Driven Instruction:</strong> Continuous assessment and feedback create a personalized learning path for each student. Our comprehensive exams after each unit provide detailed analysis that guides subsequent instruction.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Educational Approach */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Our Educational Approach</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              How we transform complex physics concepts into achievable learning goals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all">
              <div className="card-body">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-primary/10 p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
                <h3 className="card-title justify-center">Structured Curriculum</h3>
                <p className="text-center">
                  Our curriculum is meticulously aligned with College Board standards, breaking down complex topics into manageable units with clear learning objectives.
                </p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all">
              <div className="card-body">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-primary/10 p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                </div>
                <h3 className="card-title justify-center">Comprehensive Assessment</h3>
                <p className="text-center">
                  Regular performance evaluations with detailed feedback identify strengths and areas for improvement, creating a personalized learning journey.
                </p>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-md hover:shadow-lg transition-all">
              <div className="card-body">
                <div className="flex justify-center mb-4">
                  <div className="rounded-full bg-primary/10 p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                </div>
                <h3 className="card-title justify-center">Multilingual Approach</h3>
                <p className="text-center">
                  Drawing from experience with diverse student populations, we employ teaching techniques that make physics accessible regardless of language background.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Timeline */}
      <section className="py-16 bg-base-100">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Professional Journey</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Key milestones that shaped my approach to STEM education
            </p>
          </div>
          
          <div className="flex flex-col max-w-3xl mx-auto">
            <ul className="timeline timeline-snap-icon max-md:timeline-compact timeline-vertical">
              <li>
                <div className="timeline-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                </div>
                <div className="timeline-start md:text-end mb-10">
                  <time className="font-mono italic">2015</time>
                  <div className="text-lg font-black">University of Texas at Austin</div>
                  Graduated with Phi Alpha Theta honors, developing strong foundations in research methodology and critical analysis.
                </div>
                <hr/>
              </li>
              <li>
                <hr/>
                <div className="timeline-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                </div>
                <div className="timeline-end mb-10">
                  <time className="font-mono italic">2017-2019</time>
                  <div className="text-lg font-black">VIPKID</div>
                  Taught over 3,000 virtual ESL classes to students in China, maintaining a 4.8/5 parent satisfaction rating and developing expertise in online education.
                </div>
                <hr/>
              </li>
              <li>
                <hr/>
                <div className="timeline-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                </div>
                <div className="timeline-start md:text-end mb-10">
                  <time className="font-mono italic">2019-2021</time>
                  <div className="text-lg font-black">Accenture & Meta</div>
                  Worked as an Intellectual Property Analyst at Accenture supporting Facebook (now Meta), developing analytical skills and attention to detail in a high-performance environment.
                </div>
                <hr/>
              </li>
              <li>
                <hr/>
                <div className="timeline-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                </div>
                <div className="timeline-end mb-10">
                  <time className="font-mono italic">2022-2025</time>
                  <div className="text-lg font-black">Aurora Central High School</div>
                  Taught Newcomer English Physics to diverse student populations from over 40 countries, developing specialized techniques for making STEM accessible across language barriers.
                </div>
                <hr/>
              </li>
              <li>
                <hr/>
                <div className="timeline-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                </div>
                <div className="timeline-start md:text-end mb-10">
                  <time className="font-mono italic">Jan-May 2025</time>
                  <div className="text-lg font-black">Community College of Aurora</div>
                  Served as a Pathway Navigator managing 200+ concurrent enrollment students, providing comprehensive academic support and developing strategies for college readiness.
                </div>
                <hr/>
              </li>
              <li>
                <hr/>
                <div className="timeline-middle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-primary"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                </div>
                <div className="timeline-end mb-10">
                  <time className="font-mono italic">May 2025-Present</time>
                  <div className="text-lg font-black">Galileo Academics</div>
                  Founded Galileo Academics to provide premium STEM instruction to high school students preparing for AP examinations, combining educational expertise with technical innovation.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 bg-primary text-primary-content">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Begin Your AP Physics Journey?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join me at Galileo Academics and experience a personalized approach to mastering AP Physics that builds confidence, understanding, and exam readiness.
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
