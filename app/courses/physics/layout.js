import Link from 'next/link';

export const metadata = {
  title: 'Physics Courses',
  description: 'Advanced Placement Physics courses including AP Physics 1, AP Physics 2, AP Physics C: Mechanics, and AP Physics C: Electricity & Magnetism',
  keywords: 'AP Physics, physics tutoring, AP Physics 1, AP Physics 2, AP Physics C, physics education, STEM',
};

export default function PhysicsLayout({ children }) {
  const physicsCourses = [
    {
      title: "AP Physics 1",
      slug: "ap-physics-1",
      difficulty: "Foundational",
      description: "Algebra-based introduction to mechanics, waves, and basic electricity.",
      badge: "Updated 2023-2025"
    },
    {
      title: "AP Physics 2", 
      slug: "ap-physics-2",
      difficulty: "Intermediate",
      description: "Advanced algebra-based physics including thermodynamics and electromagnetism.",
      badge: null
    },
    {
      title: "AP Physics C: Mechanics",
      slug: "ap-physics-c-mechanics", 
      difficulty: "Advanced",
      description: "Calculus-based mechanics for engineering-bound students.",
      badge: null
    },
    {
      title: "AP Physics C: E&M",
      slug: "ap-physics-c-electricity-magnetism", 
      difficulty: "Advanced",
      description: "Calculus-based electricity and magnetism.",
      badge: "Most Rigorous"
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
      {/* Physics Navigation Header */}
      <div className="bg-base-200 border-b border-base-300">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <Link href="/courses" className="text-secondary hover:underline text-sm">
                ← All Courses
              </Link>
              <div className="text-base-content/60">|</div>
              <div className="badge badge-secondary">Physics</div>
            </div>
            
            <div className="hidden lg:flex items-center gap-4">
              <Link href="/booking/individual" className="btn btn-secondary btn-sm">
                Book Tutoring
              </Link>
              <Link href="/contact" className="btn btn-outline btn-secondary btn-sm">
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
            <span className="text-sm font-medium text-base-content/70 whitespace-nowrap">Physics Courses:</span>
            {physicsCourses.map((course, index) => (
              <Link 
                key={index}
                href={`/courses/physics/${course.slug}`}
                className="flex items-center gap-2 text-sm hover:text-secondary transition-colors whitespace-nowrap"
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

      {/* Physics Footer Section */}
      <section className="py-12 bg-base-200 border-t border-base-300">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Quick Course Links */}
            <div>
              <h3 className="text-lg font-bold mb-4">Physics Courses</h3>
              <div className="space-y-3">
                {physicsCourses.map((course, index) => (
                  <Link 
                    key={index}
                    href={`/courses/physics/${course.slug}`}
                    className="block group"
                  >
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-100 transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium group-hover:text-secondary transition-colors">
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

            {/* Learning Tracks */}
            <div>
              <h3 className="text-lg font-bold mb-4">Recommended Tracks</h3>
              <div className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-sm mb-2 text-blue-800">Engineering Track</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="badge badge-secondary badge-xs">1</div>
                      <span>AP Physics 1</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="badge badge-secondary badge-xs">2</div>
                      <span>AP Physics C: Mechanics</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="badge badge-secondary badge-xs">3</div>
                      <span>AP Physics C: E&M</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-sm mb-2 text-green-800">Life Sciences Track</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="badge badge-secondary badge-xs">1</div>
                      <span>AP Physics 1</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="badge badge-secondary badge-xs">2</div>
                      <span>AP Physics 2</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-lg font-bold mb-4">Get Started</h3>
              <div className="space-y-3">
                <Link href="/booking/individual" className="btn btn-secondary btn-block btn-sm">
                  One-on-One Tutoring
                </Link>
                <Link href="/booking/group" className="btn btn-outline btn-secondary btn-block btn-sm">
                  Group Classes
                </Link>
                <Link href="/contact" className="btn btn-outline btn-primary btn-block btn-sm">
                  Free Consultation
                </Link>
              </div>
              
              <div className="mt-6 p-4 bg-success/10 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Physics Success</h4>
                <div className="text-2xl font-bold text-success">92%</div>
                <p className="text-xs text-base-content/70">
                  of our AP Physics students score 4 or 5
                </p>
              </div>
              
              <div className="mt-4 p-4 bg-info/10 rounded-lg">
                <h4 className="font-semibold text-sm mb-2">Lab Experience</h4>
                <p className="text-xs text-base-content/70">
                  Hands-on experiments and practical applications
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
