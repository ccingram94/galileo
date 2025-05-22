import Link from 'next/link';
import { redirect } from 'next/navigation';
import { signIn, auth } from '@/auth'; // Import signIn from your auth config, not next-auth/react

export default async function SignIn() {
  // Check if user is already authenticated
  const session = await auth();
  if (session) {
    redirect('/dashboard'); // Redirect to dashboard or desired page
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 via-base-200/30 to-primary/5 relative">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/3 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 group mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div className="flex items-center gap-1">
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold text-xl">
                  Galileo
                </span>
                <span className="text-base-content/80 font-medium text-xl">Academics</span>
              </div>
            </Link>

            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Student Portal Access
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              <span className="text-base-content">Welcome to</span>{' '}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Student Portal
              </span>
            </h1>
            
            <p className="text-base-content/80 text-lg mb-8">
              Sign in with your Google account to access your personalized learning dashboard and track your AP Physics progress.
            </p>
          </div>

          {/* Sign In Card */}
          <div className="bg-base-100 rounded-box border border-base-300 shadow-xl p-8">
            <div className="space-y-6">
              {/* Google Sign In Button */}
              <form action={async () => {
                "use server"
                await signIn("google", { redirectTo: "/dashboard" })
              }}>
                <button 
                  type="submit"
                  className="btn btn-primary w-full gap-3 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 text-base"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign in with Google
                </button>
              </form>

              {/* Security Notice */}
              <div className="bg-info/5 border border-info/20 rounded-box p-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-info mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-info mb-1">Secure Authentication</p>
                    <p className="text-xs text-base-content/70">
                      We use Google's secure OAuth 2.0 authentication. Your credentials are never stored on our servers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-8">
            <Link href="/" className="link link-primary hover:link-secondary font-medium transition-colors duration-200">
              ← Back to Galileo Academics
            </Link>
          </div>

          {/* Features Preview */}
          <div className="mt-12 space-y-4">
            <h3 className="text-center font-semibold text-base-content/80 mb-6">What you'll get access to:</h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-3 bg-base-100/50 backdrop-blur-sm rounded-box p-3 border border-base-300/50">
                <div className="w-8 h-8 bg-primary/10 rounded-btn flex items-center justify-center">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-sm">Complete AP Physics Curriculum</div>
                  <div className="text-xs text-base-content/60">10 units with 40+ video lessons</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-base-100/50 backdrop-blur-sm rounded-box p-3 border border-base-300/50">
                <div className="w-8 h-8 bg-secondary/10 rounded-btn flex items-center justify-center">
                  <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-sm">Progress Tracking & Analytics</div>
                  <div className="text-xs text-base-content/60">Monitor your learning journey</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-base-100/50 backdrop-blur-sm rounded-box p-3 border border-base-300/50">
                <div className="w-8 h-8 bg-accent/10 rounded-btn flex items-center justify-center">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-sm">Tutoring Session Management</div>
                  <div className="text-xs text-base-content/60">Book and manage your sessions</div>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-base-100/50 backdrop-blur-sm rounded-box p-3 border border-base-300/50">
                <div className="w-8 h-8 bg-success/10 rounded-btn flex items-center justify-center">
                  <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-sm">Practice Tests & Assignments</div>
                  <div className="text-xs text-base-content/60">AP-style questions and feedback</div>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex items-center justify-center gap-6 mt-8 pt-6 border-t border-base-300">
            <div className="flex items-center gap-2 text-sm text-base-content/70">
              <div className="flex -space-x-1">
                <div className="w-6 h-6 bg-primary rounded-full border-2 border-base-100"></div>
                <div className="w-6 h-6 bg-secondary rounded-full border-2 border-base-100"></div>
                <div className="w-6 h-6 bg-accent rounded-full border-2 border-base-100"></div>
              </div>
              <span>500+ students</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-base-content/70">
              <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>97% pass rate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
