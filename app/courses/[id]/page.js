import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';
import EnrollmentButton from '../components/EnrollmentButton';
import CourseContentPreview from './components/CourseContentPreview';

const prisma = new PrismaClient();

// Helper function to format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

export default async function CourseDetailPage({ params }) {
  const resolvedParams = await params;
  let course = null;
  let user = null;
  let enrollment = null;

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
              paymentStatus: true,
              enrolledAt: true,
              progress: true
            }
          }
        }
      });
    }

    // Fetch course with all related data
    course = await prisma.course.findUnique({
      where: { id: resolvedParams.id },
      include: {
        enrollments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        },
        units: {
          include: {
            lessons: {
              include: {
                lessonQuizzes: {
                  select: {
                    id: true,
                    title: true,
                    description: true,
                    passingScore: true,
                    isPublished: true
                  }
                }
              },
              orderBy: { order: 'asc' }
            },
            unitExams: {
              select: {
                id: true,
                title: true,
                description: true,
                examType: true,
                passingScore: true,
                isPublished: true
              },
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!course) {
      notFound();
    }

    // Check if user is enrolled
    if (user) {
      enrollment = user.enrollments.find(e => e.courseId === course.id);
    }

  } catch (error) {
    console.error('Error fetching course:', error);
    notFound();
  } finally {
    await prisma.$disconnect();
  }

  const isEnrolled = enrollment && enrollment.paymentStatus === 'PAID';
  const enrollmentCount = course.enrollments.filter(e => e.paymentStatus === 'PAID').length;
  const totalUnits = course.units.length;
  const totalLessons = course.units.reduce((sum, unit) => sum + unit.lessons.length, 0);
  const totalQuizzes = course.units.reduce((sum, unit) => 
    sum + unit.lessons.reduce((lessonSum, lesson) => 
      lessonSum + (lesson.lessonQuizzes ? 1 : 0), 0), 0);
  const totalExams = course.units.reduce((sum, unit) => sum + unit.unitExams.length, 0);

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-base-100 to-secondary/5 py-16">
        <div className="container mx-auto max-w-7xl px-6">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Course Info */}
            <div className="lg:w-2/3 space-y-6">
              {/* Back Navigation */}
              <Link 
                href="/courses" 
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Back to Courses
              </Link>

              {/* Course Status Badges */}
              <div className="flex flex-wrap gap-2">
                {course.isPublished ? (
                  <div className="badge badge-success">Published</div>
                ) : (
                  <div className="badge badge-warning">Coming Soon</div>
                )}
                {course.isFree ? (
                  <div className="badge badge-info">Free Course</div>
                ) : (
                  <div className="badge badge-accent">{formatCurrency(course.price)}</div>
                )}
                {course.apExamType && (
                  <div className="badge badge-outline">{course.apExamType}</div>
                )}
                {isEnrolled && (
                  <div className="badge badge-success">✓ Enrolled</div>
                )}
              </div>

              {/* Course Title and Description */}
              <div>
                <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-4">
                  {course.title}
                </h1>
                {course.description && (
                  <p className="text-xl text-base-content/80 leading-relaxed">
                    {course.description}
                  </p>
                )}
              </div>

              {/* Course Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-base-200/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{totalUnits}</div>
                  <div className="text-sm text-base-content/70">Units</div>
                </div>
                <div className="bg-base-200/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{totalLessons}</div>
                  <div className="text-sm text-base-content/70">Lessons</div>
                </div>
                <div className="bg-base-200/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{totalQuizzes + totalExams}</div>
                  <div className="text-sm text-base-content/70">Assessments</div>
                </div>
                <div className="bg-base-200/50 rounded-lg p-4 text-center">
                  <div className="text-2xl font-bold text-primary">{enrollmentCount}</div>
                  <div className="text-sm text-base-content/70">Students</div>
                </div>
              </div>

              {/* What You'll Learn */}
              {course.units.length > 0 && (
                <div className="bg-base-200/30 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">What You'll Learn</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {course.units.slice(0, 6).map((unit, index) => (
                      <div key={unit.id} className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-success shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm">{unit.title}</span>
                      </div>
                    ))}
                    {course.units.length > 6 && (
                      <div className="text-sm text-base-content/60">
                        +{course.units.length - 6} more units
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Enrollment Card */}
            <div className="lg:w-1/3">
              <div className="sticky top-6">
                <div className="card bg-base-100 shadow-xl border border-base-300">
                  {course.imageUrl && (
                    <figure className="h-48">
                      <Image
                        src={course.imageUrl}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    </figure>
                  )}
                  
                  <div className="card-body">
                    <div className="text-center mb-4">
                      {course.isFree ? (
                        <div className="text-3xl font-bold text-success">Free</div>
                      ) : (
                        <div className="text-3xl font-bold">{formatCurrency(course.price)}</div>
                      )}
                    </div>

                    {isEnrolled ? (
                      <div className="space-y-3">
                        <div className="alert alert-success">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                          <span>You're enrolled in this course!</span>
                        </div>
                        <Link 
                          href={`/dashboard/courses/${course.id}`}
                          className="btn btn-primary w-full"
                        >
                          Continue Learning
                        </Link>
                        <div className="text-center text-sm text-base-content/70">
                          Enrolled on {new Date(enrollment.enrolledAt).toLocaleDateString()}
                        </div>
                      </div>
                    ) : course.isPublished ? (
                      <div className="space-y-3">
                        <EnrollmentButton 
                          course={course} 
                          user={user}
                          className="btn btn-primary w-full"
                        />
                        <div className="text-center text-sm text-base-content/70">
                          {course.isFree ? 'No payment required' : '30-day money-back guarantee'}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <button className="btn btn-disabled w-full">
                          Coming Soon
                        </button>
                        <div className="text-center text-sm text-base-content/70">
                          This course is still in development
                        </div>
                      </div>
                    )}

                    {/* Course Features */}
                    <div className="divider"></div>
                    <h4 className="font-semibold mb-3">This course includes:</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {totalLessons} video lessons
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {totalQuizzes} practice quizzes
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {totalExams} comprehensive exams
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Lifetime access
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Certificate of completion
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Mobile and desktop access
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-16">
        <div className="container mx-auto max-w-7xl px-6">
          <CourseContentPreview 
            course={course} 
            isEnrolled={isEnrolled}
            user={user}
          />
        </div>
      </section>

      {/* Student Reviews/Testimonials Placeholder */}
      {enrollmentCount > 0 && (
        <section className="py-16 bg-base-200">
          <div className="container mx-auto max-w-7xl px-6">
            <h2 className="text-3xl font-bold text-center mb-12">What Students Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {course.enrollments.slice(0, 3).map((enrollment, index) => (
                <div key={enrollment.id} className="card bg-base-100 shadow-lg">
                  <div className="card-body">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="avatar placeholder">
                        <div className="w-10 rounded-full bg-neutral text-neutral-content">
                          <span className="text-sm">
                            {enrollment.user.name?.charAt(0) || 'S'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">{enrollment.user.name || 'Student'}</div>
                        <div className="text-sm text-base-content/70">
                          Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="rating rating-sm mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <input
                          key={star}
                          type="radio"
                          name={`rating-${enrollment.id}`}
                          className="mask mask-star-2 bg-warning"
                          defaultChecked={star === 5}
                          disabled
                        />
                      ))}
                    </div>
                    <p className="text-sm text-base-content/80">
                      "Great course! The content is well-structured and easy to follow."
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Courses */}
      <section className="py-16">
        <div className="container mx-auto max-w-7xl px-6">
          <h2 className="text-3xl font-bold text-center mb-12">You Might Also Like</h2>
          <div className="text-center">
            <Link href="/courses" className="btn btn-outline btn-primary">
              Browse All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      {!isEnrolled && course.isPublished && (
        <section className="py-16 bg-primary text-primary-content">
          <div className="container mx-auto max-w-7xl px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of students who have mastered {course.apExamType || 'advanced concepts'} with our comprehensive course.
            </p>
            <EnrollmentButton 
              course={course} 
              user={user}
              className="btn btn-secondary btn-lg"
            />
          </div>
        </section>
      )}
    </div>
  );
}
