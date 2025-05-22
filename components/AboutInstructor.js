import Image from "next/image";
import Link from "next/link";

export default function AboutInstructor() {
  return (
    <div className="bg-base-100 py-16">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold">About Your Instructor</h2>
          <p className="mt-4 text-lg max-w-3xl mx-auto">
            Expert guidance from an experienced educator dedicated to making STEM accessible to diverse student populations.
          </p>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/3">
            <div className="avatar">
              <div className="w-64 h-64 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 mx-auto overflow-hidden">
                <Image 
                  src="/instructor-profile.jpg" 
                  alt="Instructor profile" 
                  width={256} 
                  height={256}
                  className="object-cover"
                />
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <h3 className="text-2xl font-bold">Mark Sterling</h3>
              <p className="text-primary font-medium">Founder & Lead Instructor</p>
              <div className="flex justify-center gap-4 mt-4">
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
          
          <div className="lg:w-2/3 space-y-6">
            <div className="card bg-base-200">
              <div className="card-body">
                <h3 className="card-title text-primary">Educational Background</h3>
                <p>
                  I graduated from the University of Texas at Austin in 2015 with Phi Alpha Theta honors, 
                  where I developed a strong foundation in critical analysis and research methodologies. 
                  My academic background, combined with continuous professional development in STEM education, 
                  provides me with the tools to effectively teach complex scientific concepts to students of all backgrounds.
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Specialized Experience</h3>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="mt-1 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Multicultural Physics Education:</span> Gained extensive experience at Aurora Central High School teaching Newcomer English Physics to students from over 40 countries speaking 50+ languages. This unique experience shaped my ability to make complex STEM concepts accessible across language barriers.
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="mt-1 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Virtual Teaching Excellence:</span> Completed over 3,000 virtual ESL classes with VIPKID (2017-2019), maintaining a 4.8/5 parent satisfaction rating. This experience honed my skills in creating engaging, effective online learning environments that keep students motivated and focused.
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="mt-1 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Higher Education Guidance:</span> As a Pathway Navigator at the Community College of Aurora, I managed a caseload of 200+ concurrent enrollment students, developing strategies to support diverse learners in their transition to college. This experience informs my approach to preparing students for college-level STEM coursework.
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="mt-1 text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Tech Industry Experience:</span> My background at Meta (Facebook) and fast-growing startups like Hotel Engine (which raised $65M in Series B funding) has given me valuable insights into how technology and data can enhance learning experiences and track student progress effectively.
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="card bg-primary text-primary-content">
              <div className="card-body">
                <h3 className="card-title">My Teaching Philosophy</h3>
                <p>
                  I believe that every student deserves access to high-quality STEM education, regardless of background or primary language. My approach combines rigorous academic content with adaptive teaching methods that meet students where they are. By breaking down complex concepts into manageable components and providing consistent, supportive feedback, I help students build both knowledge and confidence in their abilities.
                </p>
                <p className="mt-2">
                  Whether working with AP students aiming for top scores or helping English language learners navigate challenging STEM content, I'm committed to creating an inclusive learning environment where all students can thrive.
                </p>
                <div className="card-actions justify-end mt-4">
                  <Link href="/about" className="btn btn-secondary">
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
