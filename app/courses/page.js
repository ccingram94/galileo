import Link from 'next/link';
import Image from 'next/image';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';
import EnrollmentButton from './components/EnrollmentButton';

const prisma = new PrismaClient();

// Helper function to format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

export default async function Courses() {
  let courses = [];
  let user = null;

  try {
    // Get current user session
    const session = await auth();
    if (session?.user) {
      user = await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
          enrollments: {
            select: {
              courseId: true,
              paymentStatus: true
            }
          }
        }
      });
    }

    // Fetch all courses with enrollment data
    courses = await prisma.course.findMany({
      include: {
        enrollments: {
          select: {
            id: true,
            paymentStatus: true
          }
        },
        units: {
          include: {
            lessons: true,
            unitExams: true
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: [
        { isPublished: 'desc' }, // Published courses first
        { createdAt: 'desc' }
      ]
    });
  } catch (error) {
    console.error('Error fetching courses:', error);
  } finally {
    await prisma.$disconnect();
  }

  // Separate courses by subject (based on apExamType)
  const mathematicsCourses = courses.filter(course => 
    course.apExamType?.toLowerCase().includes('calculus') ||
    course.apExamType?.toLowerCase().includes('precalculus') ||
    course.apExamType?.toLowerCase().includes('math')
  );

  const physicsCourses = courses.filter(course => 
    course.apExamType?.toLowerCase().includes('physics')
  );

  const otherCourses = courses.filter(course => 
    !mathematicsCourses.includes(course) && !physicsCourses.includes(course)
  );

  const getDifficultyBadge = (difficulty) => {
    if (!difficulty) return "badge-neutral";
    const badges = {
      "Foundational": "badge-success",
      "Intermediate": "badge-warning", 
      "Advanced": "badge-error"
    };
    return badges[difficulty] || "badge-neutral";
  };

  const getUserEnrollmentStatus = (courseId) => {
    if (!user) return null;
    return user.enrollments.find(enrollment => enrollment.courseId === courseId);
  };

  const calculateCourseStats = (course) => {
    const totalUnits = course.units.length;
    const totalLessons = course.units.reduce((sum, unit) => sum + unit.lessons.length, 0);
    const totalExams = course.units.reduce((sum, unit) => sum + unit.unitExams.length, 0);
    const enrollmentCount = course.enrollments.length;

    return { totalUnits, totalLessons, totalExams, enrollmentCount };
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent"></div>
        <div className="container mx-auto max-w-7xl px-6 relative">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-6">
              <div className="badge badge-outline badge-lg text-primary border-primary/30">
                STEM Excellence
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                AP Courses
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent block">
                  & Tutoring
                </span>
              </h1>
              <p className="text-xl text-base-content/80 leading-relaxed max-w-lg">
                Master challenging STEM concepts with our comprehensive curricula designed to build deep conceptual understanding and problem-solving skills.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/booking/individual" className="btn btn-primary btn-lg shadow-lg">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  One-on-One Tutoring
                </Link>
                <Link href="/booking/group" className="btn btn-outline btn-lg hover:btn-primary">
                  Group Classes
                </Link>
              </div>
            </div>
            <div className="lg:w-1/2 flex justify-center">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative w-96 h-96 rounded-2xl overflow-hidden shadow-2xl">
                  <Image 
                    src="/about-hero.jpg" 
                    alt="AP Courses and tutoring" 
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Overview Stats */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="bg-base-100 rounded-lg shadow-md p-6">
            <div className="stats stats-vertical lg:stats-horizontal shadow w-full">
              <div className="stat">
                <div className="stat-title">Total Courses</div>
                <div className="stat-value">{courses.length}</div>
                <div className="stat-desc">
                  {courses.filter(c => c.isPublished).length} Published
                </div>
              </div>
              
              <div className="stat">
                <div className="stat-title">Active Enrollments</div>
                <div className="stat-value">
                  {courses.reduce((sum, course) => sum + course.enrollments.length, 0)}
                </div>
                <div className="stat-desc">Students enrolled</div>
              </div>
              
              <div className="stat">
                <div className="stat-title">Free Courses</div>
                <div className="stat-value">
                  {courses.filter(c => c.isFree).length}
                </div>
                <div className="stat-desc">Available now</div>
              </div>
              
              <div className="stat">
                <div className="stat-title">Premium Courses</div>
                <div className="stat-value">
                  {courses.filter(c => !c.isFree).length}
                </div>
                <div className="stat-desc">Professional instruction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mathematics Courses */}
      {mathematicsCourses.length > 0 && (
        <section className="py-16 bg-base-100">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Mathematics Courses</h2>
              <p className="mt-4 text-lg max-w-3xl mx-auto">
                Build a strong mathematical foundation with our comprehensive calculus curriculum designed to prepare students for advanced STEM studies.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mathematicsCourses.map((course) => {
                const stats = calculateCourseStats(course);
                const enrollmentStatus = getUserEnrollmentStatus(course.id);
                const isEnrolled = enrollmentStatus && enrollmentStatus.paymentStatus === 'PAID';
                
                return (
                  <div 
                    key={course.id} 
                    className={`card bg-base-100 shadow-lg border-l-4 ${course.isPublished ? 'border-primary' : 'border-base-300'} ${!course.isPublished ? 'opacity-75' : ''}`}
                  >
                    <div className="card-body">
                      <div className="flex items-center gap-4 flex-wrap">
                        <h3 className="card-title text-xl">{course.title}</h3>
                        <div className="flex gap-2">
                          {course.isPublished ? (
                            <div className="badge badge-success badge-sm">Published</div>
                          ) : (
                            <div className="badge badge-warning badge-sm">Coming Soon</div>
                          )}
                          {course.isFree ? (
                            <div className="badge badge-info badge-sm">Free</div>
                          ) : (
                            <div className="badge badge-accent badge-sm">
                              {formatCurrency(course.price)}
                            </div>
                          )}
                          {isEnrolled && (
                            <div className="badge badge-success badge-sm">Enrolled</div>
                          )}
                        </div>
                      </div>
                      
                      <p className="mt-2 text-base-content/80">
                        {course.description || 'Comprehensive AP-level course designed to build mastery in advanced mathematical concepts.'}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-base-content/70">Units:</span>
                            <span className="font-medium">{stats.totalUnits}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-base-content/70">Lessons:</span>
                            <span className="font-medium">{stats.totalLessons}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-base-content/70">Assessments:</span>
                            <span className="font-medium">{stats.totalExams}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-base-content/70">Enrolled:</span>
                            <span className="font-medium">{stats.enrollmentCount}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-base-content/70">Subject:</span>
                            <span className="font-medium">{course.apExamType}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="card-actions justify-end mt-6">
                        {course.isPublished ? (
                          <div className="flex gap-2">
                            <Link 
                              href={`/courses/${course.id}`} 
                              className="btn btn-outline btn-sm"
                            >
                              View Details
                            </Link>
                            {isEnrolled ? (
                              <Link 
                                href={`/dashboard/courses/${course.id}`} 
                                className="btn btn-primary btn-sm"
                              >
                                Continue Learning
                              </Link>
                            ) : (
                              <EnrollmentButton 
                                course={course} 
                                user={user}
                                className="btn btn-primary btn-sm"
                              />
                            )}
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Link 
                              href={`/courses/${course.id}`} 
                              className="btn btn-outline btn-sm"
                            >
                              Learn More
                            </Link>
                            <button className="btn btn-disabled btn-sm">
                              Coming Soon
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Physics Courses */}
      {physicsCourses.length > 0 && (
        <section className="py-16 bg-base-200">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Physics Courses</h2>
              <p className="mt-4 text-lg max-w-3xl mx-auto">
                Explore the fundamental principles of physics from algebra-based introductory concepts to advanced calculus-based mechanics and electromagnetism.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {physicsCourses.map((course) => {
                const stats = calculateCourseStats(course);
                const enrollmentStatus = getUserEnrollmentStatus(course.id);
                const isEnrolled = enrollmentStatus && enrollmentStatus.paymentStatus === 'PAID';
                
                return (
                  <div 
                    key={course.id} 
                    className={`card bg-base-100 shadow-lg border-l-4 ${course.isPublished ? 'border-secondary' : 'border-base-300'} ${!course.isPublished ? 'opacity-75' : ''}`}
                  >
                    <div className="card-body">
                      <div className="flex items-center gap-4 flex-wrap">
                        <h3 className="card-title text-xl">{course.title}</h3>
                        <div className="flex gap-2">
                          {course.isPublished ? (
                            <div className="badge badge-success badge-sm">Published</div>
                          ) : (
                            <div className="badge badge-warning badge-sm">Coming Soon</div>
                          )}
                          {course.isFree ? (
                            <div className="badge badge-info badge-sm">Free</div>
                          ) : (
                            <div className="badge badge-accent badge-sm">
                              {formatCurrency(course.price)}
                            </div>
                          )}
                          {isEnrolled && (
                            <div className="badge badge-success badge-sm">Enrolled</div>
                          )}
                        </div>
                      </div>
                      
                      <p className="mt-2 text-base-content/80">
                        {course.description || 'Comprehensive AP-level course designed to build mastery in advanced physics concepts.'}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-base-content/70">Units:</span>
                            <span className="font-medium">{stats.totalUnits}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-base-content/70">Lessons:</span>
                            <span className="font-medium">{stats.totalLessons}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-base-content/70">Assessments:</span>
                            <span className="font-medium">{stats.totalExams}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-base-content/70">Enrolled:</span>
                            <span className="font-medium">{stats.enrollmentCount}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-base-content/70">Subject:</span>
                            <span className="font-medium">{course.apExamType}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="card-actions justify-end mt-6">
                        {course.isPublished ? (
                          <div className="flex gap-2">
                            <Link 
                              href={`/courses/${course.id}`} 
                              className="btn btn-outline btn-sm"
                            >
                              View Details
                            </Link>
                            {isEnrolled ? (
                              <Link 
                                href={`/dashboard/courses/${course.id}`} 
                                className="btn btn-secondary btn-sm"
                              >
                                Continue Learning
                              </Link>
                            ) : (
                              <EnrollmentButton 
                                course={course} 
                                user={user}
                                className="btn btn-secondary btn-sm"
                              />
                            )}
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Link 
                              href={`/courses/${course.id}`} 
                              className="btn btn-outline btn-sm"
                            >
                              Learn More
                            </Link>
                            <button className="btn btn-disabled btn-sm">
                              Coming Soon
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Other Courses */}
      {otherCourses.length > 0 && (
        <section className="py-16 bg-base-100">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold">Other Courses</h2>
              <p className="mt-4 text-lg max-w-3xl mx-auto">
                Explore additional subjects and specialized courses to complement your STEM education.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {otherCourses.map((course) => {
                const stats = calculateCourseStats(course);
                const enrollmentStatus = getUserEnrollmentStatus(course.id);
                const isEnrolled = enrollmentStatus && enrollmentStatus.paymentStatus === 'PAID';
                
                return (
                  <div 
                    key={course.id} 
                    className={`card bg-base-100 shadow-lg border-l-4 ${course.isPublished ? 'border-accent' : 'border-base-300'} ${!course.isPublished ? 'opacity-75' : ''}`}
                  >
                    <div className="card-body">
                      <div className="flex items-center gap-4 flex-wrap">
                        <h3 className="card-title text-xl">{course.title}</h3>
                        <div className="flex gap-2">
                          {course.isPublished ? (
                            <div className="badge badge-success badge-sm">Published</div>
                          ) : (
                            <div className="badge badge-warning badge-sm">Coming Soon</div>
                          )}
                          {course.isFree ? (
                            <div className="badge badge-info badge-sm">Free</div>
                          ) : (
                            <div className="badge badge-accent badge-sm">
                              {formatCurrency(course.price)}
                            </div>
                          )}
                          {isEnrolled && (
                            <div className="badge badge-success badge-sm">Enrolled</div>
                          )}
                        </div>
                      </div>
                      
                      <p className="mt-2 text-base-content/80">
                        {course.description || 'Comprehensive course designed to build mastery in advanced concepts.'}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-base-content/70">Units:</span>
                            <span className="font-medium">{stats.totalUnits}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-base-content/70">Lessons:</span>
                            <span className="font-medium">{stats.totalLessons}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-base-content/70">Assessments:</span>
                            <span className="font-medium">{stats.totalExams}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-base-content/70">Enrolled:</span>
                            <span className="font-medium">{stats.enrollmentCount}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-base-content/70">Subject:</span>
                            <span className="font-medium">{course.apExamType || 'General'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="card-actions justify-end mt-6">
                        {course.isPublished ? (
                          <div className="flex gap-2">
                            <Link 
                              href={`/courses/${course.id}`} 
                              className="btn btn-outline btn-sm"
                            >
                              View Details
                            </Link>
                            {isEnrolled ? (
                              <Link 
                                href={`/dashboard/courses/${course.id}`} 
                                className="btn btn-accent btn-sm"
                              >
                                Continue Learning
                              </Link>
                            ) : (
                              <EnrollmentButton 
                                course={course} 
                                user={user}
                                className="btn btn-accent btn-sm"
                              />
                            )}
                          </div>
                        ) : (
                          <div className="flex gap-2">
                            <Link 
                              href={`/courses/${course.id}`} 
                              className="btn btn-outline btn-sm"
                            >
                              Learn More
                            </Link>
                            <button className="btn btn-disabled btn-sm">
                              Coming Soon
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {courses.length === 0 && (
        <section className="py-16 bg-base-100">
          <div className="container mx-auto max-w-6xl px-6 text-center">
            <div className="max-w-md mx-auto">
              <svg className="w-16 h-16 text-base-content/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="text-2xl font-semibold mb-2">No Courses Available</h3>
              <p className="text-base-content/70 mb-6">
                We're working on adding new courses. Check back soon for updates!
              </p>
              <Link href="/contact" className="btn btn-primary">
                Contact Us for Updates
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Tutoring Options */}
      <section className="py-16 bg-base-200">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Tutoring Options</h2>
            <p className="mt-4 text-lg max-w-3xl mx-auto">
              Choose the learning format that fits your needs and budget.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="card bg-base-100 shadow-lg border-2 border-primary">
              <div className="card-body">
                <h3 className="card-title text-2xl">One-on-One Tutoring</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">$70</span>
                  <span className="text-base-content/70 ml-1">per hour</span>
                </div>
                
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Personalized curriculum pacing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Flexible scheduling</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Homework assistance</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Detailed progress reports</span>
                  </li>
                </ul>
                
                <div className="card-actions justify-end mt-6">
                  <Link href="/booking/individual" className="btn btn-primary w-full">
                    Book Individual Sessions
                  </Link>
                </div>
              </div>
            </div>
            
            <div className="card bg-base-100 shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-2xl">Group Classes</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">$30</span>
                  <span className="text-base-content/70 ml-1">per hour</span>
                </div>
                
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Small groups (4-6 students)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Collaborative learning environment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Structured curriculum</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Affordable rates</span>
                  </li>
                </ul>
                
                <div className="card-actions justify-end mt-6">
                  <Link href="/booking/group" className="btn btn-outline btn-primary w-full">
                    Join Group Classes
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-6 bg-primary text-primary-content">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Excel in Your Studies?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join our expert-led courses and build the knowledge and confidence you need to succeed in your academic journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn btn-secondary">
              Schedule a Free Consultation
            </Link>
            <Link href="/auth/register" className="btn bg-white text-primary hover:bg-base-200">
              Get Started Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
