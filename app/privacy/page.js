// app/privacy/page.js
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | STEM Tutoring",
  description: "Privacy Policy for our comprehensive AP Math and Physics tutoring programs. Learn how we protect student data and comply with educational privacy laws.",
};

export default function PrivacyPolicy() {
  return (
    <>
      {/* Hero Section with Background Effects */}
      <section className="pt-32 pb-16 px-6 bg-gradient-to-br from-base-100 via-base-200/30 to-primary/5 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/3 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-4xl relative z-10">
          {/* Breadcrumb */}
          <div className="text-sm breadcrumbs mb-8">
            <ul>
              <li>
                <Link href="/" className="text-base-content/60 hover:text-primary transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-4 h-4 stroke-current mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9l9-7 9 7"></path>
                  </svg>
                  Home
                </Link>
              </li>
              <li>
                <span className="text-base-content">Privacy Policy</span>
              </li>
            </ul>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Data Protection & Privacy
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Privacy Policy
              </span>
            </h1>
            
            <p className="text-lg text-base-content/80 max-w-3xl mx-auto leading-relaxed">
              We are committed to protecting your privacy and the privacy of our students. This policy explains how we collect, use, and safeguard your personal information.
            </p>
            
            {/* Compliance badges */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="inline-flex items-center gap-2 bg-success/10 text-success px-4 py-2 rounded-full text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                COPPA Compliant
              </div>
              <div className="inline-flex items-center gap-2 bg-info/10 text-info px-4 py-2 rounded-full text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                FERPA Aligned
              </div>
              <div className="inline-flex items-center gap-2 bg-warning/10 text-warning px-4 py-2 rounded-full text-sm font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Last Updated: May 22, 2025
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy Content */}
      <section className="py-16 px-6 bg-base-100">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg max-w-none">
            
            {/* Information We Collect */}
            <div className="card bg-gradient-to-br from-primary/5 via-secondary/3 to-accent/5 shadow-xl border border-base-300 mb-8">
              <div className="card-body">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="card-title text-2xl text-primary">1. Information We Collect</h2>
                  </div>
                </div>
                <div className="space-y-6 text-base-content/80">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-700 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Google OAuth Information
                      </h4>
                      <ul className="text-sm text-blue-600 space-y-1">
                        <li>• Email address</li>
                        <li>• Name</li>
                        <li>• Google account ID (sub claim)</li>
                        <li>• Profile picture URL</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        User-Provided Information
                      </h4>
                      <ul className="text-sm text-green-600 space-y-1">
                        <li>• Academic level and course preferences</li>
                        <li>• Learning goals and objectives</li>
                        <li>• Scheduling preferences</li>
                        <li>• Contact information for communications</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <div className="text-sm">
                        <p className="font-semibold text-warning mb-1">For Users Under 18:</p>
                        <p>We only collect information necessary for educational services and require verifiable parental consent before collecting any personal information from children under 13, in compliance with COPPA regulations.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-700 mb-3">Educational Data We Collect</h4>
                    <ul className="text-sm text-purple-600 space-y-1">
                      <li>• Session attendance and participation</li>
                      <li>• Assignment completion and progress</li>
                      <li>• Assessment scores and performance metrics</li>
                      <li>• Learning preferences and study habits</li>
                      <li>• Communication records with tutors</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* How We Use Information */}
            <div className="card bg-base-200 shadow-lg border border-base-300 mb-8">
              <div className="card-body">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="card-title text-2xl text-secondary">2. How We Use Your Information</h2>
                  </div>
                </div>
                <div className="space-y-6 text-base-content/80">
                  <p>We use collected information solely for educational purposes and service delivery:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-white/60 rounded-lg p-4 border border-secondary/10">
                        <h4 className="font-semibold text-success mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          Educational Services
                        </h4>
                        <ul className="text-sm space-y-1">
                          <li>• Personalized tutoring sessions</li>
                          <li>• Progress tracking and reporting</li>
                          <li>• Curriculum customization</li>
                          <li>• Learning outcome assessments</li>
                        </ul>
                      </div>
                      
                      <div className="bg-white/60 rounded-lg p-4 border border-secondary/10">
                        <h4 className="font-semibold text-info mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          Communication
                        </h4>
                        <ul className="text-sm space-y-1">
                          <li>• Session scheduling and reminders</li>
                          <li>• Educational updates and announcements</li>
                          <li>• Parent/guardian communications</li>
                          <li>• Technical support assistance</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-white/60 rounded-lg p-4 border border-secondary/10">
                        <h4 className="font-semibold text-warning mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          Service Improvement
                        </h4>
                        <ul className="text-sm space-y-1">
                          <li>• Analyzing learning effectiveness</li>
                          <li>• Improving educational content</li>
                          <li>• Enhancing user experience</li>
                          <li>• Developing new features</li>
                        </ul>
                      </div>
                      
                      <div className="bg-white/60 rounded-lg p-4 border border-secondary/10">
                        <h4 className="font-semibold text-accent mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                          Account Management
                        </h4>
                        <ul className="text-sm space-y-1">
                          <li>• User authentication via Google OAuth</li>
                          <li>• Session management and security</li>
                          <li>• Billing and payment processing</li>
                          <li>• Account preferences and settings</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Storage and Security */}
            <div className="card bg-gradient-to-br from-info/5 to-info/10 shadow-lg border border-info/20 mb-8">
              <div className="card-body">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-info/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="card-title text-2xl text-info">3. Data Storage & Security</h2>
                  </div>
                </div>
                <div className="space-y-6 text-base-content/80">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/60 rounded-lg p-4 border border-info/10">
                      <h4 className="font-semibold text-info mb-3">Database Security</h4>
                      <ul className="text-sm space-y-2">
                        <li>• Secure PostgreSQL database with encryption</li>
                        <li>• Regular automated backups</li>
                        <li>• Access controls and authentication</li>
                        <li>• Data integrity monitoring</li>
                        <li>• SOC 2 compliant hosting infrastructure</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white/60 rounded-lg p-4 border border-info/10">
                      <h4 className="font-semibold text-info mb-3">Google OAuth Security</h4>
                      <ul className="text-sm space-y-2">
                        <li>• OAuth 2.0 secure authentication</li>
                        <li>• No password storage on our servers</li>
                        <li>• Limited scope access to Google data</li>
                        <li>• JWT-based session management with secure HTTP-only cookies or database sessions via Prisma ORM</li>
                        <li>• Automatic token refresh and validation</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                    <h4 className="font-semibold text-success mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      Additional Security Measures
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <ul className="space-y-1">
                        <li>• TLS/SSL encryption for all data transmission</li>
                        <li>• Regular security audits and penetration testing</li>
                        <li>• Employee background checks and training</li>
                      </ul>
                      <ul className="space-y-1">
                        <li>• Multi-factor authentication for admin access</li>
                        <li>• Intrusion detection and monitoring systems</li>
                        <li>• Incident response and breach notification procedures</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Student Privacy & COPPA Compliance */}
            <div className="card bg-gradient-to-br from-warning/5 to-warning/10 shadow-lg border border-warning/20 mb-8">
              <div className="card-body">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-warning/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="card-title text-2xl text-warning">4. Student Privacy & COPPA Compliance</h2>
                  </div>
                </div>
                <div className="space-y-6 text-base-content/80">
                  <div className="bg-error/10 border border-error/20 rounded-lg p-4">
                    <h4 className="font-semibold text-error mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      Children Under 13 (COPPA Compliance)
                    </h4>
                    <div className="space-y-3 text-sm">
                      <p>We are committed to protecting children's privacy online and comply with the Children's Online Privacy Protection Act (COPPA):</p>
                      <ul className="space-y-2 ml-4">
                        <li>• <strong>Parental Consent Required:</strong> We obtain verifiable parental consent before collecting personal information from children under 13</li>
                        <li>• <strong>Limited Data Collection:</strong> We collect only information necessary for educational services</li>
                        <li>• <strong>No Behavioral Advertising:</strong> We do not use children's data for behavioral advertising or marketing</li>
                        <li>• <strong>Parental Rights:</strong> Parents can review, delete, or refuse further collection of their child's information</li>
                        <li>• <strong>Secure Processing:</strong> All data is processed securely and shared only with authorized educational personnel</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/60 rounded-lg p-4 border border-warning/10">
                      <h4 className="font-semibold text-warning mb-3">FERPA Alignment</h4>
                      <p className="text-sm mb-3">Our practices align with the Family Educational Rights and Privacy Act (FERPA) principles:</p>
                      <ul className="text-sm space-y-1">
                        <li>• Educational record confidentiality</li>
                        <li>• Parent/student access rights</li>
                        <li>• Consent for disclosure</li>
                        <li>• Directory information protections</li>
                      </ul>
                    </div>
                    
                    <div className="bg-white/60 rounded-lg p-4 border border-warning/10">
                      <h4 className="font-semibold text-warning mb-3">Teen Privacy (13-17 years)</h4>
                      <p className="text-sm mb-3">For students aged 13-17:</p>
                      <ul className="text-sm space-y-1">
                        <li>• Enhanced privacy protections</li>
                        <li>• Parental notification requirements</li>
                        <li>• Educational purpose limitations</li>
                        <li>• Secure communication channels</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                    <h4 className="font-semibold text-info mb-2">Parental Control Options</h4>
                    <p className="text-sm">Parents and guardians have the right to:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-sm">
                      <ul className="space-y-1">
                        <li>• Review all information collected about their child</li>
                        <li>• Request corrections to inaccurate information</li>
                        <li>• Delete their child's account and associated data</li>
                      </ul>
                      <ul className="space-y-1">
                        <li>• Receive progress reports and educational communications</li>
                        <li>• Control data sharing preferences</li>
                        <li>• Contact our privacy team with concerns</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Sharing and Third Parties */}
            <div className="card bg-base-200 shadow-lg border border-base-300 mb-8">
              <div className="card-body">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="card-title text-2xl text-accent">5. Data Sharing & Third Parties</h2>
                  </div>
                </div>
                <div className="space-y-6 text-base-content/80">
                  <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                    <h4 className="font-semibold text-success mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Our Commitment: We Do NOT Sell Your Data
                    </h4>
                    <p className="text-sm">We never sell, rent, or trade personal information to third parties for commercial purposes. Your privacy is not for sale.</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/60 rounded-lg p-4 border border-accent/10">
                      <h4 className="font-semibold text-accent mb-3">Limited Sharing with Service Providers</h4>
                      <p className="text-sm mb-3">We may share data only with trusted service providers who help us deliver educational services:</p>
                      <ul className="text-sm space-y-1">
                        <li>• <strong>Google:</strong> For OAuth authentication only</li>
                        <li>• <strong>Payment Processors:</strong> For secure transaction processing</li>
                        <li>• <strong>Cloud Hosting:</strong> For secure data storage and platform operation</li>
                        <li>• <strong>Communication Tools:</strong> For video conferencing and messaging</li>
                      </ul>
                      <p className="text-xs text-accent mt-3">All service providers are contractually bound to protect your data and use it only for specified educational purposes.</p>
                    </div>
                    
                    <div className="bg-white/60 rounded-lg p-4 border border-accent/10">
                      <h4 className="font-semibold text-accent mb-3">When We May Disclose Information</h4>
                      <p className="text-sm mb-3">We may disclose personal information only in these limited circumstances:</p>
                      <ul className="text-sm space-y-1">
                        <li>• <strong>Legal Requirements:</strong> When required by law or legal process</li>
                        <li>• <strong>Safety Concerns:</strong> To protect student safety or prevent harm</li>
                        <li>• <strong>Parental Requests:</strong> To parents/guardians regarding their child's education</li>
                        <li>• <strong>Business Transfers:</strong> In case of company merger (with continued privacy protection)</li>
                      </ul>
                      <p className="text-xs text-accent mt-3">All disclosures follow strict legal and ethical guidelines for student data protection.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Rights and Choices */}
            <div className="card bg-gradient-to-br from-success/5 to-success/10 shadow-lg border border-success/20 mb-8">
              <div className="card-body">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="card-title text-2xl text-success">6. Your Rights & Choices</h2>
                  </div>
                </div>
                <div className="space-y-6 text-base-content/80">
                  <p>You have significant control over your personal information and privacy settings:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="bg-white/60 rounded-lg p-4 border border-success/10">
                        <h4 className="font-semibold text-success mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Access & Review
                        </h4>
                        <ul className="text-sm space-y-1">
                          <li>• View all personal information we have</li>
                          <li>• Download your educational progress data</li>
                          <li>• Review data sharing preferences</li>
                          <li>• Access session recordings and communications</li>
                        </ul>
                      </div>
                      
                      <div className="bg-white/60 rounded-lg p-4 border border-success/10">
                        <h4 className="font-semibold text-success mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Correct & Update
                        </h4>
                        <ul className="text-sm space-y-1">
                          <li>• Update profile information anytime</li>
                          <li>• Correct inaccurate educational records</li>
                          <li>• Modify communication preferences</li>
                          <li>• Change privacy settings</li>
                        </ul>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-white/60 rounded-lg p-4 border border-success/10">
                        <h4 className="font-semibold text-success mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete & Remove
                        </h4>
                        <ul className="text-sm space-y-1">
                          <li>• Delete your account completely</li>
                          <li>• Remove specific data points</li>
                          <li>• Opt out of data collection</li>
                          <li>• Request data portability</li>
                        </ul>
                      </div>
                      
                      <div className="bg-white/60 rounded-lg p-4 border border-success/10">
                        <h4 className="font-semibold text-success mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 12h.01M12 12v.01M12 12h-.01M12 12v-.01" />
                          </svg>
                          Control & Restrict
                        </h4>
                        <ul className="text-sm space-y-1">
                          <li>• Limit data processing activities</li>
                          <li>• Opt out of communications</li>
                          <li>• Restrict data sharing</li>
                          <li>• Pause data collection temporarily</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-info/10 border border-info/20 rounded-lg p-4">
                    <h4 className="font-semibold text-info mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      How to Exercise Your Rights
                    </h4>
                    <p className="text-sm mb-2">To exercise any of these rights, contact us at:</p>
                    <div className="text-sm">
                      <p><strong>Email:</strong> privacy@stemtutoring.com</p>
                      <p><strong>Response Time:</strong> We will respond within 30 days</p>
                      <p><strong>Identity Verification:</strong> We may require identity verification to protect your privacy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="card bg-gradient-to-br from-primary/5 via-secondary/3 to-accent/5 shadow-xl border border-base-300">
              <div className="card-body">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="card-title text-2xl text-primary">7. Contact Us About Privacy</h2>
                  </div>
                </div>
                <div className="space-y-6 text-base-content/80">
                  <p>
                    We are committed to protecting your privacy and are here to help with any questions or concerns about how we handle your personal information.
                  </p>
                  
                  <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                    <h4 className="font-semibold text-warning mb-2">Policy Updates</h4>
                    <p className="text-sm">
                      We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. 
                      We will notify users of significant changes via email and prominently display the updated policy on our website. 
                      Continued use of our services after policy updates constitutes acceptance of the revised terms.
                    </p>
                  </div>
                  
                  <div className="card-actions justify-center pt-4">
                    <Link href="/contact" className="btn btn-primary">
                      Contact 
                    </Link>
                    <Link href="/terms" className="btn btn-outline btn-primary">
                      Terms of Service
                    </Link>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-6 bg-gradient-to-r from-primary via-secondary to-accent text-primary-content">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h2 className="text-3xl font-bold">Your Privacy is Our Priority</h2>
          </div>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join the students and families who trust us to protect their privacy while delivering exceptional STEM education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking" className="btn btn-white btn-lg text-primary hover:bg-white/90">
              Start Learning Safely
            </Link>
            <Link href="/contact" className="btn btn-outline btn-white btn-lg hover:bg-white hover:text-primary">
              Ask About Privacy
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 pt-8 border-t border-white/20 mt-8">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>COPPA & FERPA Compliant</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-white/80">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Stripe Payment Security</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-white/80">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
              </svg>
              <span>No Data Sales Ever</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
