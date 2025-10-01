import Link from 'next/link';
import Image from 'next/image';
import { auth } from '@/auth'; // Adjust path based on your auth config location

export default async function Header() {
  // Check if user is authenticated
  const session = await auth();
  const user = session?.user;

  return (
    <div className="navbar bg-base-100/95 backdrop-blur-md shadow-xl border-b border-base-200/50 sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost btn-circle lg:hidden hover:bg-primary/10 transition-all duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </label>
          <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-3 shadow-2xl glass-effect rounded-2xl w-64 border border-white/40">
            <li>
              <Link href="/courses" className="hover:bg-primary/10 hover:text-primary transition-all duration-200 rounded-xl py-3 font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Courses
              </Link>
            </li>
            <li>
              <Link href="/tutoring" className="hover:bg-secondary/10 hover:text-secondary transition-all duration-200 rounded-xl py-3 font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Tutoring Options
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:bg-accent/10 hover:text-accent transition-all duration-200 rounded-xl py-3 font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                About Us
              </Link>
            </li>
            <li>
              <Link href="/resources" className="hover:bg-info/10 hover:text-info transition-all duration-200 rounded-xl py-3 font-medium">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                Student Resources
              </Link>
            </li>
            
            {/* Mobile Dashboard Link for authenticated users */}
            {user && (
              <li>
                <Link href="/dashboard" className="hover:bg-success/10 hover:text-success transition-all duration-200 rounded-xl py-3 font-medium">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  Dashboard
                </Link>
              </li>
            )}
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost normal-case text-xl hover:bg-transparent group px-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary via-secondary to-accent rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div className="flex flex-col items-start">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-bold text-lg leading-none">
                Galileo
              </span>
              <span className="text-base-content/70 font-medium text-xs">Academics</span>
            </div>
          </div>
        </Link>
      </div>
      
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li>
            <Link href="/courses" className="btn btn-ghost btn-sm hover:bg-primary/10 hover:text-primary transition-all duration-300 font-medium rounded-xl">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Courses
            </Link>
          </li>
          <li>
            <Link href="/tutoring" className="btn btn-ghost btn-sm hover:bg-secondary/10 hover:text-secondary transition-all duration-300 font-medium rounded-xl">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 715.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Tutoring
            </Link>
          </li>
          <li>
            <Link href="/about" className="btn btn-ghost btn-sm hover:bg-accent/10 hover:text-accent transition-all duration-300 font-medium rounded-xl">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About
            </Link>
          </li>
          <li>
            <Link href="/learn" className="btn btn-ghost btn-sm hover:bg-info/10 hover:text-info transition-all duration-300 font-medium rounded-xl">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Learn
            </Link>
          </li>
        </ul>
      </div>
      
      <div className="navbar-end">
        <div className="flex items-center gap-3">
          {user ? (
            // Authenticated user - show dashboard button with user info
            <div className="flex items-center gap-3">
              <div className="tooltip tooltip-bottom" data-tip={`Welcome, ${user.name?.split(' ')[0] || 'Student'}`}>
                <div className="avatar">
                  <div className="w-9 h-9 rounded-full ring-2 ring-primary ring-offset-base-100 ring-offset-2 hover:ring-4 transition-all duration-300">
                    {user.image ? (
                      <img src={user.image} alt={user.name || 'User'} />
                    ) : (
                      <div className="bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center text-white text-sm font-bold">
                        {user.name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="tooltip tooltip-bottom" data-tip="Student Dashboard">
                <Link href="/dashboard" className="btn btn-primary btn-sm gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 font-semibold">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              </div>
            </div>
          ) : (
            // Not authenticated - show sign in button
            <div className="tooltip tooltip-bottom" data-tip="Student Portal">
              <Link href="/signin" className="btn btn-primary btn-sm gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 font-semibold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
