// app/terms/page.js
import Link from "next/link";

export const metadata = {
  title: "Terms of Service | STEM Tutoring",
  description: "Terms of Service for our comprehensive AP Math and Physics tutoring programs and online courses.",
};

export default function TermsOfService() {
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
                <span className="text-base-content">Terms of Service</span>
              </li>
            </ul>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Legal Information
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Terms of Service
              </span>
            </h1>
            
            <p className="text-lg text-base-content/80 max-w-3xl mx-auto leading-relaxed">
              Please read these Terms of Service carefully before using our tutoring services and online platform.
            </p>
            
            {/* Last updated notice */}
            <div className="inline-flex items-center gap-2 bg-info/10 text-info px-4 py-2 rounded-full text-sm font-medium mt-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Last Updated: May 22, 2025
            </div>
          </div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-16 px-6 bg-base-100">
        <div className="container mx-auto max-w-4xl">
          <div className="prose prose-lg max-w-none">
            
            {/* Agreement to Terms */}
            <div className="card bg-gradient-to-br from-primary/5 via-secondary/3 to-accent/5 shadow-xl border border-base-300 mb-8">
              <div className="card-body">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="card-title text-2xl text-primary">1. Agreement to Terms</h2>
                  </div>
                </div>
                <div className="space-y-4 text-base-content/80">
                  <p>
                    By accessing and using our tutoring services, online platform, and educational materials, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.
                  </p>
                  <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-warning mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                      <p className="text-sm text-warning">
                        <strong>Important:</strong> These terms apply to all users, including students, parents, and guardians. Minors must have parent/guardian consent to use our services.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Services Description */}
            <div className="card bg-base-200 shadow-lg border border-base-300 mb-8">
              <div className="card-body">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="card-title text-2xl text-secondary">2. Services Description</h2>
                  </div>
                </div>
                <div className="space-y-4 text-base-content/80">
                  <p>
                    We provide comprehensive online tutoring services and educational content for AP-level Mathematics and Physics courses, including:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-700 mb-2">Mathematics Courses</h4>
                      <ul className="text-sm text-blue-600 space-y-1">
                        <li>• AP Precalculus</li>
                        <li>• AP Calculus AB</li>
                        <li>• AP Calculus BC</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h4 className="font-semibold text-green-700 mb-2">Physics Courses</h4>
                      <ul className="text-sm text-green-600 space-y-1">
                        <li>• AP Physics 1</li>
                        <li>• AP Physics 2</li>
                        <li>• AP Physics C: Mechanics</li>
                        <li>• AP Physics C: Electricity & Magnetism</li>
                      </ul>
                    </div>
                  </div>
                  <p>
                    Our services include one-on-one tutoring sessions, group classes, practice materials, progress tracking, and exam preparation resources.
                  </p>
                </div>
              </div>
            </div>

            {/* User Responsibilities */}
            <div className="card bg-base-100 shadow-lg border border-base-300 mb-8">
              <div className="card-body">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="card-title text-2xl text-accent">3. User Responsibilities</h2>
                  </div>
                </div>
                <div className="space-y-4 text-base-content/80">
                  <p>As a user of our services, you agree to:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-success mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Academic Integrity
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>• Use materials for educational purposes only</li>
                        <li>• Maintain academic honesty in all work</li>
                        <li>• Not share login credentials</li>
                        <li>• Respect intellectual property rights</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-info mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Session Conduct
                      </h4>
                      <ul className="text-sm space-y-1">
                        <li>• Attend scheduled sessions punctually</li>
                        <li>• Maintain respectful communication</li>
                        <li>• Provide 24-hour cancellation notice</li>
                        <li>• Come prepared with questions and materials</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Terms */}
            <div className="card bg-gradient-to-br from-warning/5 to-warning/10 shadow-lg border border-warning/20 mb-8">
              <div className="card-body">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-warning/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="card-title text-2xl text-warning">4. Payment Terms</h2>
                  </div>
                </div>
                <div className="space-y-4 text-base-content/80">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white/60 rounded-lg p-4 border border-warning/10">
                      <h4 className="font-semibold mb-2">Pricing Structure</h4>
                      <ul className="text-sm space-y-2">
                        <li>• One-on-One Tutoring: $70 per 55-minute session</li>
                        <li>• Group Classes: $30 per 55-minute session</li>
                        <li>• Payment due before each session</li>
                        <li>• Package deals available for multiple sessions</li>
                      </ul>
                    </div>
                    <div className="bg-white/60 rounded-lg p-4 border border-warning/10">
                      <h4 className="font-semibold mb-2">Payment Methods</h4>
                      <ul className="text-sm space-y-2">
                        <li>• Credit/Debit cards accepted</li>
                        <li>• PayPal and digital payments</li>
                        <li>• Bank transfers for packages</li>
                        <li>• No cash or check payments</li>
                      </ul>
                    </div>
                  </div>
                  <div className="bg-error/10 border border-error/20 rounded-lg p-4">
                    <h4 className="font-semibold text-error mb-2">Refund Policy</h4>
                    <p className="text-sm">
                      Refunds are available within 24 hours of session completion if you are not satisfied. 
                      Cancellations with less than 24-hour notice are non-refundable unless due to emergency circumstances.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Intellectual Property */}
            <div className="card bg-base-200 shadow-lg border border-base-300 mb-8">
              <div className="card-body">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-info/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="card-title text-2xl text-info">5. Intellectual Property</h2>
                  </div>
                </div>
                <div className="space-y-4 text-base-content/80">
                  <p>
                    All educational content, curricula, practice problems, lesson materials, and proprietary teaching methods 
                    are protected by copyright and remain the exclusive property of our tutoring service.
                  </p>
                  <div className="flex items-start gap-3 bg-info/5 border border-info/20 rounded-lg p-4">
                    <svg className="w-5 h-5 text-info mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div className="text-sm">
                      <p><strong>Usage Rights:</strong> Students are granted a limited, non-exclusive license to use materials for personal educational purposes only. Distribution, sharing, or commercial use is strictly prohibited.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div className="card bg-gradient-to-br from-error/5 to-error/10 shadow-lg border border-error/20 mb-8">
              <div className="card-body">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-error/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="card-title text-2xl text-error">6. Limitation of Liability</h2>
                  </div>
                </div>
                <div className="space-y-4 text-base-content/80">
                  <p>
                    While we strive to provide excellent educational services, we cannot guarantee specific academic outcomes or AP exam scores.
                  </p>
                  <div className="space-y-3">
                    <div className="bg-white/60 rounded-lg p-4">
                      <h4 className="font-semibold text-error mb-2">Service Limitations</h4>
                      <p className="text-sm">
                        Our liability is limited to the amount paid for services. We are not responsible for indirect, 
                        incidental, or consequential damages arising from use of our tutoring services.
                      </p>
                    </div>
                    <div className="bg-white/60 rounded-lg p-4">
                      <h4 className="font-semibold text-error mb-2">Technical Issues</h4>
                      <p className="text-sm">
                        We are not liable for technical difficulties, internet connectivity issues, or platform outages 
                        that may affect scheduled sessions. Make-up sessions will be provided when possible.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="card bg-gradient-to-br from-success/5 to-success/10 shadow-lg border border-success/20">
              <div className="card-body">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-success/20 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="card-title text-2xl text-success">7. Contact Information</h2>
                  </div>
                </div>
                <div className="space-y-4 text-base-content/80">
                  <p>
                    If you have questions about these Terms of Service or need clarification on any policies, please contact us:
                  </p>
                  <div className="card-actions justify-center pt-4">
                    <Link href="/contact" className="btn btn-success">
                      Contact Support
                    </Link>
                    <Link href="/privacy" className="btn btn-outline btn-success">
                      Privacy Policy
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
          <h2 className="text-3xl font-bold mb-6">Ready to Start Learning?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of students who have successfully mastered AP Math and Physics with our expert guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/booking" className="btn btn-white btn-lg text-primary hover:bg-white/90">
              Schedule Your First Session
            </Link>
            <Link href="/courses" className="btn btn-outline btn-white btn-lg hover:bg-white hover:text-primary">
              Explore Our Courses
            </Link>
          </div>
          
          {/* Trust indicators */}
          <div className="flex flex-wrap justify-center items-center gap-6 pt-8 border-t border-white/20 mt-8">
            <div className="flex items-center gap-2 text-sm text-white/80">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Secure & Confidential</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-white/80">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Money-Back Guarantee</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
