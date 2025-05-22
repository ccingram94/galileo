import Image from "next/image";
import Link from "next/link";

export default function AboutInstructor() {
  return (
    <div className="bg-gradient-to-br from-base-100 via-base-50 to-primary/5 py-20 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-32 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Meet Your Instructor
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Excellence in STEM Education
          </h2>
          <p className="text-lg lg:text-xl text-base-content/80 max-w-4xl mx-auto leading-relaxed">
            Expert curriculum from an inspired educator dedicated to making STEM accessible 
            to diverse student populations through innovative teaching methods and personalized support.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Profile Section */}
          <div className="lg:w-1/3 flex flex-col items-center lg:sticky lg:top-8">
            <div className="relative">
              {/* Achievement badge */}
              <div className="absolute -top-4 -right-4 z-20 badge badge-success badge-lg gap-2 p-4 shadow-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verified
              </div>

              {/* Profile image with enhanced styling */}
              <div className="avatar">
                <div className="w-72 h-72 rounded-3xl ring-4 ring-primary/20 ring-offset-4 ring-offset-base-100 mx-auto overflow-hidden shadow-2xl bg-gradient-to-br from-primary/10 to-secondary/10">
                  <Image 
                    src="/instructor-profile.jpg" 
                    alt="Constance Ingram - Founder and Lead Instructor" 
                    width={288} 
                    height={288}
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            </div>
            
            {/* Instructor Details */}
            <div className="mt-8 text-center space-y-4">
              <div>
                <h3 className="text-3xl font-bold text-base-content">Constance Ingram</h3>
                <p className="text-primary font-semibold text-lg">Founder & Lead Instructor</p>
                <div className="flex items-center justify-center gap-2 mt-2 text-sm text-base-content/70">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Aurora, Colorado
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-base-200">
                  <div className="text-2xl font-bold text-primary">8+</div>
                  <div className="text-xs text-base-content/70">Years Teaching</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-base-200">
                  <div className="text-2xl font-bold text-secondary">5000+</div>
                  <div className="text-xs text-base-content/70">Students Helped</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-base-200">
                  <div className="text-2xl font-bold text-accent">40+</div>
                  <div className="text-xs text-base-content/70">Student Countries</div>
                </div>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg border border-base-200">
                  <div className="text-2xl font-bold text-info">4.8★</div>
                  <div className="text-xs text-base-content/70">Avg Rating</div>
                </div>
              </div>

              {/* Contact Links */}
              <div className="flex justify-center gap-3 mt-6">
                <div className="tooltip tooltip-bottom" data-tip="LinkedIn Profile">
                  <a href="https://www.linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" 
                     className="btn btn-circle btn-outline hover:btn-primary hover:scale-110 transition-all duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
                <div className="tooltip tooltip-bottom" data-tip="Send Email">
                  <a href="mailto:contact@galileoacademics.com" 
                     className="btn btn-circle btn-outline hover:btn-secondary hover:scale-110 transition-all duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                      <polyline points="22,6 12,13 2,6"></polyline>
                    </svg>
                  </a>
                </div>
                <div className="tooltip tooltip-bottom" data-tip="Schedule Consultation">
                  <Link href="/contact" 
                        className="btn btn-circle btn-outline hover:btn-accent hover:scale-110 transition-all duration-200">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content Section */}
          <div className="lg:w-2/3 space-y-8">
            {/* Educational Background Card */}
            <div className="card bg-gradient-to-br from-white to-primary/5 shadow-xl border border-primary/10 hover:shadow-2xl transition-shadow duration-300">
              <div className="card-body">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  </div>
                  <h3 className="card-title text-2xl text-primary">Education</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-3 flex-shrink-0"></div>
                    <div>
                      <p className="font-semibold text-lg">University of Texas at Austin • BA • 2015</p>
                      <p className="text-base-content/80">Graduated with <span className="font-semibold text-primary">Phi Alpha Theta honors</span>, developing expertise in critical analysis and research methodologies that enhance my STEM teaching approach.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-3 flex-shrink-0"></div>
                    <div>
                      <p className="font-semibold text-lg">Continuous Professional Development</p>
                      <p className="text-base-content/80">Ongoing training in modern STEM education methodologies, ensuring cutting-edge teaching practices for maximum student success.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Experience Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m8 0H8m8 0l-1 12H9l-1-12" />
                  </svg>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-base-content">Professional Experience</h3>
              </div>

              {/* Experience Cards */}
              <div className="space-y-6">
                <div className="card bg-white/80 backdrop-blur-sm shadow-lg border border-base-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <div className="card-body">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-primary mb-2">Multicultural Physics Education</h4>
                        <p className="text-base-content/80 leading-relaxed">
                          <span className="font-semibold">Aurora Central High School:</span> Pioneered physics education for 
                          Newcomer English students from <span className="text-accent font-semibold">40+ countries</span> speaking 
                          <span className="text-secondary font-semibold">50+ languages</span>. This transformative experience 
                          shaped my ability to make complex STEM concepts universally accessible.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card bg-white/80 backdrop-blur-sm shadow-lg border border-base-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <div className="card-body">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-secondary mb-2">Virtual Teaching Excellence</h4>
                        <p className="text-base-content/80 leading-relaxed">
                          <span className="font-semibold">VIPKID (2017-2019):</span> Completed over 
                          <span className="text-success font-semibold">3,000 virtual classes</span> maintaining a 
                          <span className="text-warning font-semibold">4.8/5 parent satisfaction rating</span>. 
                          Mastered the art of creating engaging, effective online learning environments.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card bg-white/80 backdrop-blur-sm shadow-lg border border-base-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <div className="card-body">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-accent mb-2">Higher Education Guidance</h4>
                        <p className="text-base-content/80 leading-relaxed">
                          <span className="font-semibold">Community College of Aurora:</span> As Pathway Navigator, 
                          managed <span className="text-info font-semibold">200+ concurrent enrollment students</span>, 
                          developing proven strategies for supporting diverse learners in their transition to college STEM coursework.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card bg-white/80 backdrop-blur-sm shadow-lg border border-base-200 hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
                  <div className="card-body">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-info/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg text-info mb-2">Tech Industry Innovation</h4>
                        <p className="text-base-content/80 leading-relaxed">
                          <span className="font-semibold">Meta & Hotel Engine:</span> Background at leading tech companies 
                          (including a <span className="text-success font-semibold">$65M Series B startup</span>) provides 
                          valuable insights into leveraging technology and data analytics for enhanced learning experiences.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Teaching Philosophy Card */}
            <div className="card bg-gradient-to-br from-primary to-secondary text-primary-content shadow-2xl border-0 overflow-hidden relative">
              <div className="absolute inset-0 bg-black/5"></div>
              <div className="card-body relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="card-title text-2xl text-white">My Teaching Philosophy</h3>
                </div>
                
                <div className="space-y-4 text-white/90 leading-relaxed">
                  <p className="text-lg">
                    I believe that every student deserves access to high-quality STEM education, regardless of background or primary language. 
                    My approach combines <span className="font-semibold text-white">rigorous academic content</span> with 
                    <span className="font-semibold text-white"> adaptive teaching methods</span> that meet students where they are.
                  </p>
                  <p>
                    By breaking down complex concepts into manageable components and providing consistent, supportive feedback, 
                    I help students build both knowledge and confidence. Whether working with AP students aiming for top scores 
                    or helping English language learners navigate challenging STEM content, I'm committed to creating an 
                    <span className="font-semibold text-white">inclusive learning environment</span> where all students can thrive.
                  </p>
                </div>
                
                <div className="card-actions justify-end mt-8">
                  <Link href="/about" className="btn btn-white text-primary hover:bg-white/90 gap-2 shadow-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Learn More About My Approach
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
