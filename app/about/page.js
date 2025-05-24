import Image from 'next/image';
import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section - Enhanced with better visual hierarchy */}
      <section className="relative bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
        <div className="container mx-auto max-w-7xl px-6 relative">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-6">
              <div className="badge badge-outline badge-lg text-primary border-primary/30">
                Established 2025
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Our Mission at 
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block">
                  Galileo Academics
                </span>
              </h1>
              <p className="text-xl text-base-content/80 leading-relaxed max-w-lg">
                To provide exceptional AP Physics education that unlocks academic potential and builds scientific confidence in every student, regardless of their background or primary language.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/courses" className="btn btn-primary btn-lg shadow-lg">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Explore Courses
                </Link>
                <Link href="/contact" className="btn btn-outline btn-lg hover:btn-primary">
                  Contact Us
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative w-96 h-96 rounded-2xl overflow-hidden shadow-2xl">
                  <Image 
                    src="/about-hero.jpg" 
                    alt="Teaching students" 
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Founder's Journey - Enhanced layout and visual appeal */}
      <section className="py-20 bg-base-100">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <div className="badge badge-primary badge-lg mb-4">Meet the Founder</div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">The Founder's Journey</h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto leading-relaxed">
              from university honors to founding a specialized education service
            </p>
          </div>

          <div className="flex flex-col xl:flex-row gap-16 items-start">
            {/* Enhanced Profile Card */}
            <div className="xl:w-1/3">
              <div className="sticky top-24">
                <div className="card bg-gradient-to-br from-base-100 to-base-200 shadow-2xl border border-base-300/50">
                  <div className="card-body p-8">
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <div className="absolute -inset-2 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-30"></div>
                        <div className="avatar relative">
                          <div className="w-32 h-32 rounded-full ring-4 ring-primary/20">
                            <Image 
                              src="/instructor-profile.jpg" 
                              alt="Constance Ingram" 
                              width={128}
                              height={128}
                              className="object-cover rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-center mb-6">
                      <h3 className="text-2xl font-bold text-base-content">Constance Ingram</h3>
                      <p className="text-primary font-medium">Founder & Lead Instructor</p>
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { icon: "🎓", text: "teaching since 2018" },
                        { icon: "🏛️", text: "University of Texas at Austin (2015)" },
                        { icon: "🌍", text: "ESL & Multicultural Education Specialist" }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-200/50 transition-colors">
                          <span className="text-xl">{item.icon}</span>
                          <span className="text-sm font-medium">{item.text}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="divider opacity-30"></div>
                    
                    <div className="flex justify-center gap-3">
                      <a href="https://www.linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" 
                         className="btn btn-circle btn-sm btn-outline btn-primary hover:btn-primary">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                        </svg>
                      </a>
                      <a href="mailto:contact@galileoacademics.com" 
                         className="btn btn-circle btn-sm btn-outline btn-primary hover:btn-primary">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Content Section */}
            <div className="xl:w-2/3">
              <div className="prose prose-lg max-w-none">
                <div className="space-y-12">
                  {[
                    {
                      title: "Education and Academic Foundation",
                      content: "My journey began at the University of Texas at Austin, where I graduated in 2015 with Phi Alpha Theta honors. This academic foundation instilled in me a passion for rigorous research, critical analysis, and the historical context of scientific advancement that I bring to my teaching approach. Understanding that science has a history helps students connect with the evolution of scientific thinking and see themselves as part of that ongoing journey."
                    },
                    {
                      title: "From College Advisor to STEM Educator",
                      content: "After graduation, I served as a college advisor focusing on Concurrent Enrollment (dual credit) students and graduating seniors. Working with these students revealed a critical need: many were struggling with STEM subjects that served as gatekeepers to their desired career paths. This experience directly informed my teaching philosophy and led me to focus on making complex STEM concepts more accessible."
                    },
                    {
                      title: "Multicultural Teaching Experience",
                      content: "My experience teaching Newcomer English Physics at Aurora Central High School was transformative. Working with students from over 40 countries speaking more than 50 languages, I developed specialized techniques for breaking down complex physics concepts across language barriers. This experience shaped my approach to curriculum development and differentiated instruction that now benefits all my students at Galileo Academics."
                    },
                    {
                      title: "Tech Industry Insights",
                      content: "My professional background extends beyond education. I worked as an Intellectual Property Analyst at Accenture, supporting Facebook (now Meta) Legal Operations, where I consistently exceeded performance expectations. At Hotel Engine, a unicorn startup, I contributed to their rapid growth while developing valuable skills in working with innovative technologies."
                    },
                    {
                      title: "Founding Galileo Academics",
                      content: "I founded Galileo Academics with a clear mission: to provide premium STEM instruction to high school students seeking advanced preparation for AP examinations. As both founder and lead instructor, I develop comprehensive curriculum aligned with College Board standards while managing all aspects of this educational venture."
                    }
                  ].map((section, index) => (
                    <div key={index} className="group">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <h3 className="text-2xl font-bold text-base-content group-hover:text-primary transition-colors">
                          {section.title}
                        </h3>
                      </div>
                      <div className="ml-12">
                        <p className="text-base-content/80 leading-relaxed">
                          {section.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="divider my-12"></div>
              
              {/* Enhanced Teaching Philosophy Card */}
              <div className="card bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/20">
                <div className="card-body p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold">Teaching Philosophy and Methodology</h3>
                  </div>
                  <p className="text-base-content/80 mb-6">
                    My teaching philosophy centers on three core principles:
                  </p>
                  <div className="grid gap-6">
                    {[
                      {
                        title: "Accessibility",
                        description: "Physics concepts should be accessible to all students regardless of their background or primary language. I use multiple modalities (visual, verbal, and interactive) to ensure concepts connect with diverse learning styles.",
                        icon: "🌍"
                      },
                      {
                        title: "Mastery Through Application",
                        description: "Students truly understand physics when they can apply concepts to novel situations. My curriculum emphasizes problem-solving strategies that translate to success on the AP exam and beyond.",
                        icon: "⚡"
                      },
                      {
                        title: "Data-Driven Instruction",
                        description: "Continuous assessment and feedback create a personalized learning path for each student. Our comprehensive exams after each unit provide detailed analysis that guides subsequent instruction.",
                        icon: "📊"
                      }
                    ].map((principle, index) => (
                      <div key={index} className="flex gap-4 p-4 rounded-xl hover:bg-white/50 transition-colors">
                        <div className="text-2xl">{principle.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-primary mb-2">{principle.title}</h4>
                          <p className="text-sm text-base-content/70">{principle.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Educational Approach */}
      <section className="py-20 bg-gradient-to-br from-base-200 via-base-200 to-base-300/50">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <div className="badge badge-secondary badge-lg mb-4">Our Methods</div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Our Educational Approach</h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              How we transform complex physics concepts into achievable learning goals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                ),
                title: "Structured Curriculum",
                description: "Our curriculum is meticulously aligned with College Board standards, breaking down complex topics into manageable units with clear learning objectives.",
                color: "from-primary/20 to-primary/10"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                ),
                title: "Comprehensive Assessment",
                description: "Regular performance evaluations with detailed feedback identify strengths and areas for improvement, creating a personalized learning journey.",
                color: "from-secondary/20 to-secondary/10"
              },
              {
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                ),
                title: "Multilingual Approach",
                description: "Drawing from experience with diverse student populations, we employ teaching techniques that make physics accessible regardless of language background.",
                color: "from-accent/20 to-accent/10"
              }
            ].map((approach, index) => (
              <div key={index} className="group">
                <div className="card bg-base-100 shadow-xl border border-base-300/30 h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                  <div className="card-body p-8 text-center">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${approach.color} flex items-center justify-center text-primary mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      {approach.icon}
                    </div>
                    <h3 className="card-title justify-center text-xl mb-4 group-hover:text-primary transition-colors">
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

      {/* Enhanced Professional Timeline */}
      <section className="py-20 bg-base-100">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <div className="badge badge-accent badge-lg mb-4">Career Journey</div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Professional Timeline</h2>
            <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
              Key milestones that shaped my approach to STEM education
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <ul className="timeline timeline-snap-icon timeline-compact timeline-vertical">
              {[
                {
                  year: "2015",
                  title: "University of Texas at Austin",
                  description: "Graduated with Phi Alpha Theta honors, developing strong foundations in research methodology and critical analysis.",
                  side: "start"
                },
                {
                  year: "2017-2019",
                  title: "VIPKID",
                  description: "Taught over 3,000 virtual ESL classes to students in China, maintaining a 4.8/5 parent satisfaction rating and developing expertise in online education.",
                  side: "end"
                },
                {
                  year: "2019-2021",
                  title: "Accenture & Meta",
                  description: "Worked as an Intellectual Property Analyst at Accenture supporting Facebook (now Meta), developing analytical skills and attention to detail in a high-performance environment.",
                  side: "start"
                },
                {
                  year: "2022-2025",
                  title: "Aurora Central High School",
                  description: "Taught Newcomer English Physics to diverse student populations from over 40 countries, developing specialized techniques for making STEM accessible across language barriers.",
                  side: "end"
                },
                {
                  year: "Jan-May 2025",
                  title: "Community College of Aurora",
                  description: "Served as a Pathway Navigator managing 200+ concurrent enrollment students, providing comprehensive academic support and developing strategies for college readiness.",
                  side: "start"
                },
                {
                  year: "May 2025-Present",
                  title: "Galileo Academics",
                  description: "Founded Galileo Academics to provide premium STEM instruction to high school students preparing for AP examinations, combining educational expertise with technical innovation.",
                  side: "end"
                }
              ].map((milestone, index) => (
                <li key={index}>
                  <div className="timeline-middle">
                    <div className="w-4 h-4 rounded-full bg-primary"></div>
                  </div>
                  <div className={`timeline-${milestone.side} mb-10`}>
                    <div className="card bg-base-100 shadow-lg border border-base-300/30 hover:shadow-xl transition-all duration-300">
                      <div className="card-body p-6">
                        <time className="font-mono text-sm text-primary font-semibold">{milestone.year}</time>
                        <div className="text-lg font-bold mb-3">{milestone.title}</div>
                        <p className="text-base-content/70 text-sm leading-relaxed">{milestone.description}</p>
                      </div>
                    </div>
                  </div>
                  {index < 5 && <hr className="bg-base-300"/>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Enhanced Call to Action */}
      <section className="py-20 bg-gradient-to-br from-primary via-primary to-secondary text-primary-content relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent"></div>
        <div className="container mx-auto max-w-7xl px-6 text-center relative">
          <div className="max-w-4xl mx-auto">
            <div className="badge badge-outline badge-lg text-primary-content border-primary-content/30 mb-6">
              Get Started Today
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-8 leading-tight">
              Ready to Begin Your 
              <span className="block">AP Physics Journey?</span>
            </h2>
            <p className="text-xl mb-12 text-primary-content/90 leading-relaxed max-w-3xl mx-auto">
              Join me at Galileo Academics and experience a personalized approach to mastering AP Physics that builds confidence, understanding, and exam readiness.
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
