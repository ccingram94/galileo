import Link from 'next/link';

export const metadata = {
  title: 'Mathematics Courses',
  description: 'Advanced Placement Mathematics courses including AP Precalculus, AP Calculus AB, and AP Calculus BC',
  keywords: 'AP Mathematics, AP Calculus, AP Precalculus, tutoring, math education',
};

export default function MathematicsLayout({ children }) {
  const mathCourses = [
    {
      title: "AP Precalculus",
      slug: "ap-precalculus",
      difficulty: "Foundational",
      description: "Build essential foundations in polynomial, rational, exponential, logarithmic, and trigonometric functions.",
      badge: null
    },
    {
      title: "AP Calculus AB", 
      slug: "ap-calculus-ab",
      difficulty: "Intermediate",
      description: "Master fundamental calculus concepts including limits, derivatives, and integrals.",
      badge: null
    },
    {
      title: "AP Calculus BC",
      slug: "ap-calculus-bc", 
      difficulty: "Advanced",
      description: "Advanced calculus covering all AB topics plus series, parametric equations, and polar coordinates.",
      badge: "Most Popular"
    }
  ];

  const getDifficultyBadge = (difficulty) => {
    const badges = {
      "Foundational": "badge-success",
      "Intermediate": "badge-warning", 
      "Advanced": "badge-error"
    };
    return badges[difficulty] || "badge-neutral";
  };

  return (
    <div className="min-h-screen bg-base-100">
      {/* Mathematics Navigation Header */}
      <div className="bg-base-200 border-b border-base-300">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Link href="/courses" className="text-primary hover:underline text-sm">
                ← All Courses
              </Link>
              <div className="text-base-content/60">|</div>
              <div className="badge badge-primary">Mathematics</div>
            </div>
            
            <div className="hidden lg:flex items-center gap-4">
              <Link href="/booking/individual" className="btn btn-primary btn-sm">
                Book Tutoring
              </Link>
              <Link href="/contact" className="btn btn-outline btn-primary btn-sm">
                Get Info
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Course Navigation */}
      <div className="bg-base-100 border-b border-base-300">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="flex items-center gap-6 py-4 overflow-x-auto">
            <span className="text-sm font-medium text-base-content/70 whitespace-nowrap">Mathematics Courses:</span>
            {mathCourses.map((course, index) => (
              <Link 
                key={index}
                href={`/courses/mathematics/${course.slug}`}
                className="flex items-center gap-2 text-sm hover:text-primary transition-colors whitespace-nowrap"
              >
                <span>{course.title}</span>
                <div className={`badge badge-xs ${getDifficultyBadge(course.difficulty)}`}>
                  {course.difficulty}
                </div>
                {course.badge && (
                  <div className="badge badge-xs badge-accent">{course.badge}</div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Mathematics Footer Section */}
      <section className="py-12 bg-base-200 border-t border-base-300">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Quick Course Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Mathematics Courses</h3>
              <div className="space-y-3">
                {mathCourses.map((course, index) => (
                  <Link 
                    key={index}
                    href={`/courses/mathematics/${course.slug}`}
                    className="block group"
                  >
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-100 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium group-hover:text-primary transition-colors">
                            {course.title}
                          </span>
                          <div className={`badge badge-xs ${getDifficultyBadge(course.difficulty)}`}>
                            {course.difficulty}
                          </div>
                          {course.badge && (
                            <div className="badge badge-xs badge-accent">{course.badge}</div>
                          )}
                        </div>
                        <p className="text-xs text-base-content/70">{course.description}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Learning Path */}
            <div>
              <h3 className="text-lg font-bold mb-4">Recommended Path</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="badge badge-primary badge-sm">1</div>
                  <span className="text-sm">AP Precalculus</span>
                </div>
                <div className="text-primary text-center">↓</div>
                <div className="flex items-center gap-3">
                  <div className="badge badge-primary badge-sm">2</div>
                  <span className="text-sm">AP Calculus AB</span>
                </div>
                <div className="text-primary text-center">↓</div>
                <div className="flex items-center gap-3">
                  <div className="badge badge-primary badge-sm">3</div>
                  <span className="text-sm">AP Calculus BC</span>
                </div>
                <div className="mt-4 p-3 bg-info/10 rounded-lg">
                  <p className="text-xs">
                    <strong>Note:</strong> Students with strong precalculus backgrounds 
                    may skip directly to AP Calculus AB or BC.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-lg font-bold mb-4">Get Started</h3>
              <div className="space-y-3">
                <Link href="/booking/individual" className="btn btn-primary btn-block btn-sm">
                  One-on-One Tutoring
                </Link>
                <Link href="/booking/group" className="btn btn-outline btn-primary btn-block btn-sm">
                  Group Classes
                </Link>
                <Link href="/contact" className="btn btn-outline btn-secondary btn-block btn-sm">
                  Free Consultation
                </Link>
              </div>
              
              <div className="mt-6 p-4 bg-success/10 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Success Rate</h4>
                <div className="text-2xl font-bold text-success">95%</div>
                <p className="text-xs text-base-content/70">
                  of our students score 4 or 5 on AP Math exams
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
