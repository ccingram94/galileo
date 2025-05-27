import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import GradeFilters from './GradeFilters';

const prisma = new PrismaClient();

export const metadata = {
  title: 'My Grades',
  description: 'View all your grades and academic performance'
};

// Helper function to calculate GPA
function calculateGPA(grades) {
  if (!grades.length) return 0;
  
  const gradePoints = {
    'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0
  };

  const totalPoints = grades.reduce((sum, grade) => {
    const letter = getLetterGrade(grade.score);
    return sum + (gradePoints[letter] || 0);
  }, 0);

  return (totalPoints / grades.length).toFixed(2);
}

// Helper function to get letter grade
function getLetterGrade(score) {
  if (score >= 97) return 'A+';
  if (score >= 93) return 'A';
  if (score >= 90) return 'A-';
  if (score >= 87) return 'B+';
  if (score >= 83) return 'B';
  if (score >= 80) return 'B-';
  if (score >= 77) return 'C+';
  if (score >= 73) return 'C';
  if (score >= 70) return 'C-';
  if (score >= 67) return 'D+';
  if (score >= 65) return 'D';
  if (score >= 60) return 'D-';
  return 'F';
}

// Helper function to get grade color
function getGradeColor(score) {
  if (score >= 90) return 'text-success';
  if (score >= 80) return 'text-primary';
  if (score >= 70) return 'text-warning';
  return 'text-error';
}

// Helper function to calculate trend
function calculateTrend(grades) {
  if (grades.length < 2) return 'stable';
  
  const recent = grades.slice(0, Math.min(3, grades.length));
  const older = grades.slice(-Math.min(3, grades.length));
  
  const recentAvg = recent.reduce((sum, g) => sum + g.score, 0) / recent.length;
  const olderAvg = older.reduce((sum, g) => sum + g.score, 0) / older.length;
  
  const diff = recentAvg - olderAvg;
  
  if (diff > 5) return 'improving';
  if (diff < -5) return 'declining';
  return 'stable';
}

export default async function GradesPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const session = await auth();
  
  if (!session?.user) {
    redirect('/auth/signin');
  }

  const userId = session.user.id;
  const courseFilter = resolvedSearchParams.course || 'all';
  const typeFilter = resolvedSearchParams.type || 'all';
  const timeFilter = resolvedSearchParams.time || 'all';

  try {
    // Fetch user's enrollments with all grade data
    const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
        course: {
        include: {
            units: {
            include: {
                lessons: {
                include: {
                    lessonQuizzes: {
                    include: {
                        attempts: {
                        where: { userId },
                        orderBy: { completedAt: 'desc' }
                        }
                    }
                    }
                }
                },
                unitExams: {
                include: {
                    attempts: {
                    where: { userId },
                    orderBy: { completedAt: 'desc' }
                    }
                }
                }
            },
            orderBy: { order: 'asc' }
            }
        }
        }
    },
    orderBy: { enrolledAt: 'desc' }
    });

    // Process all grades
    const allGrades = [];
    const courseOptions = [];
    const courseGrades = {};

    enrollments.forEach(enrollment => {
      const course = enrollment.course;
      courseOptions.push({ id: course.id, title: course.title });
      courseGrades[course.id] = {
        course,
        grades: [],
        stats: {
          quizzes: { total: 0, completed: 0, average: 0 },
          exams: { total: 0, completed: 0, average: 0, passed: 0 },
          overall: { average: 0, letterGrade: 'N/A', trend: 'stable' }
        }
      };

      course.units.forEach(unit => {
    // Process quiz grades
    unit.lessons.forEach(lesson => {
    lesson.lessonQuizzes.forEach(quiz => {
        quiz.attempts
        .filter(attempt => attempt.completedAt && attempt.score !== null) // ✅ Filter here instead
        .forEach(attempt => {
            const grade = {
            id: attempt.id,
            type: 'quiz',
            title: `${lesson.title} Quiz`,
            course: course.title,
            courseId: course.id,
            unit: unit.title,
            unitId: unit.id,
            score: Math.round(attempt.score),
            maxScore: 100,
            letterGrade: getLetterGrade(attempt.score),
            passed: attempt.score >= 70, // Assuming 70% is passing for quizzes
            date: attempt.completedAt,
            timeSpent: attempt.timeSpent || null,
            link: `/student/courses/${course.id}/units/${unit.id}/lessons/${lesson.id}`
            };
            
            allGrades.push(grade);
            courseGrades[course.id].grades.push(grade);
            courseGrades[course.id].stats.quizzes.total++;
            courseGrades[course.id].stats.quizzes.completed++;
        });
    });
    });

        // Process exam grades
        unit.unitExams.forEach(exam => {
        exam.attempts
            .filter(attempt => attempt.completedAt && attempt.score !== null) // ✅ Filter here instead
            .forEach(attempt => {
            const grade = {
                id: attempt.id,
                type: 'exam',
                title: exam.title,
                course: course.title,
                courseId: course.id,
                unit: unit.title,
                unitId: unit.id,
                score: Math.round(attempt.score),
                maxScore: 100,
                letterGrade: getLetterGrade(attempt.score),
                passed: attempt.passed,
                date: attempt.completedAt,
                timeSpent: attempt.timeUsed ? attempt.timeUsed * 60 : null, // Convert minutes to seconds
                link: `/student/exams/${exam.id}/results?attemptId=${attempt.id}`,
                gradingStatus: attempt.gradingStatus,
                feedback: attempt.instructorFeedback
            };
            
            allGrades.push(grade);
            courseGrades[course.id].grades.push(grade);
            courseGrades[course.id].stats.exams.total++;
            courseGrades[course.id].stats.exams.completed++;
            if (attempt.passed) {
                courseGrades[course.id].stats.exams.passed++;
            }
            });
        });
      });

      // Calculate course statistics
      const courseGradeList = courseGrades[course.id].grades;
      if (courseGradeList.length > 0) {
        const quizGrades = courseGradeList.filter(g => g.type === 'quiz');
        const examGrades = courseGradeList.filter(g => g.type === 'exam');
        
        courseGrades[course.id].stats.quizzes.average = quizGrades.length > 0 ?
          Math.round(quizGrades.reduce((sum, g) => sum + g.score, 0) / quizGrades.length) : 0;
        
        courseGrades[course.id].stats.exams.average = examGrades.length > 0 ?
          Math.round(examGrades.reduce((sum, g) => sum + g.score, 0) / examGrades.length) : 0;
        
        const overallAverage = Math.round(courseGradeList.reduce((sum, g) => sum + g.score, 0) / courseGradeList.length);
        courseGrades[course.id].stats.overall.average = overallAverage;
        courseGrades[course.id].stats.overall.letterGrade = getLetterGrade(overallAverage);
        courseGrades[course.id].stats.overall.trend = calculateTrend(courseGradeList.sort((a, b) => new Date(b.date) - new Date(a.date)));
      }
    });

    // Sort all grades by date (most recent first)
    allGrades.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Apply filters
    let filteredGrades = allGrades;

    if (courseFilter !== 'all') {
      filteredGrades = filteredGrades.filter(grade => grade.courseId === courseFilter);
    }

    if (typeFilter !== 'all') {
      filteredGrades = filteredGrades.filter(grade => grade.type === typeFilter);
    }

    if (timeFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (timeFilter) {
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'semester':
          filterDate.setMonth(now.getMonth() - 4);
          break;
      }
      
      filteredGrades = filteredGrades.filter(grade => new Date(grade.date) >= filterDate);
    }

    // Calculate overall statistics
    const overallStats = {
      totalGrades: allGrades.length,
      averageScore: allGrades.length > 0 ? 
        Math.round(allGrades.reduce((sum, grade) => sum + grade.score, 0) / allGrades.length) : 0,
      gpa: calculateGPA(allGrades),
      totalQuizzes: allGrades.filter(g => g.type === 'quiz').length,
      totalExams: allGrades.filter(g => g.type === 'exam').length,
      passedExams: allGrades.filter(g => g.type === 'exam' && g.passed).length,
      trend: calculateTrend(allGrades),
      recentGrades: allGrades.slice(0, 5)
    };

    // Grade distribution
    const gradeDistribution = {
      'A': allGrades.filter(g => g.score >= 90).length,
      'B': allGrades.filter(g => g.score >= 80 && g.score < 90).length,
      'C': allGrades.filter(g => g.score >= 70 && g.score < 80).length,
      'D': allGrades.filter(g => g.score >= 60 && g.score < 70).length,
      'F': allGrades.filter(g => g.score < 60).length
    };

    return (
      <div className="min-h-screen bg-base-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Link 
                  href="/dashboard"
                  className="btn btn-ghost btn-sm gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Dashboard
                </Link>
                <div className="text-sm breadcrumbs">
                  <ul>
                    <li><span className="text-base-content/60">Student Portal</span></li>
                    <li>My Grades</li>
                  </ul>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold">My Grades</h1>
              <p className="text-base-content/70 mt-1">
                Track your academic performance across all courses
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link 
                href="/student/my-courses"
                className="btn btn-ghost btn-sm gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                My Courses
              </Link>
              <Link 
                href="/student/my-exams"
                className="btn btn-ghost btn-sm gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                My Exams
              </Link>
            </div>
          </div>

          {/* Overall Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-4">
                <div className="stat-title text-xs">Overall GPA</div>
                <div className={`stat-value text-lg ${
                  parseFloat(overallStats.gpa) >= 3.5 ? 'text-success' :
                  parseFloat(overallStats.gpa) >= 3.0 ? 'text-primary' :
                  parseFloat(overallStats.gpa) >= 2.0 ? 'text-warning' : 'text-error'
                }`}>
                  {overallStats.gpa}
                </div>
                <div className="stat-desc">4.0 scale</div>
              </div>
            </div>
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-4">
                <div className="stat-title text-xs">Average Score</div>
                <div className={`stat-value text-lg ${getGradeColor(overallStats.averageScore)}`}>
                  {overallStats.averageScore}%
                </div>
                <div className="stat-desc">{getLetterGrade(overallStats.averageScore)}</div>
              </div>
            </div>
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-4">
                <div className="stat-title text-xs">Total Grades</div>
                <div className="stat-value text-lg text-secondary">{overallStats.totalGrades}</div>
                <div className="stat-desc">{overallStats.totalQuizzes} quizzes, {overallStats.totalExams} exams</div>
              </div>
            </div>
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-4">
                <div className="stat-title text-xs">Exam Pass Rate</div>
                <div className="stat-value text-lg text-accent">
                  {overallStats.totalExams > 0 ? Math.round((overallStats.passedExams / overallStats.totalExams) * 100) : 0}%
                </div>
                <div className="stat-desc">{overallStats.passedExams}/{overallStats.totalExams} passed</div>
              </div>
            </div>
            
            <div className="stats shadow border border-base-300 bg-base-100">
              <div className="stat p-4">
                <div className="stat-title text-xs">Performance Trend</div>
                <div className={`stat-value text-lg ${
                  overallStats.trend === 'improving' ? 'text-success' :
                  overallStats.trend === 'declining' ? 'text-error' :
                  'text-info'
                }`}>
                  {overallStats.trend === 'improving' ? '↗️' :
                   overallStats.trend === 'declining' ? '↘️' : '→'}
                </div>
                <div className="stat-desc capitalize">{overallStats.trend}</div>
              </div>
            </div>
          </div>

          {/* Grade Distribution */}
          <div className="bg-base-100 rounded-box border border-base-300 shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Grade Distribution</h2>
            <div className="grid grid-cols-5 gap-4">
              {Object.entries(gradeDistribution).map(([grade, count]) => (
                <div key={grade} className="text-center">
                  <div className={`text-2xl font-bold ${
                    grade === 'A' ? 'text-success' :
                    grade === 'B' ? 'text-primary' :
                    grade === 'C' ? 'text-warning' :
                    grade === 'D' ? 'text-error/70' :
                    'text-error'
                  }`}>
                    {count}
                  </div>
                  <div className="text-sm text-base-content/60">{grade} grades</div>
                  <div className="text-xs text-base-content/40">
                    {overallStats.totalGrades > 0 ? Math.round((count / overallStats.totalGrades) * 100) : 0}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <GradeFilters courseOptions={courseOptions} />

          {/* Course Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-base-100 rounded-box border border-base-300 shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Course Performance</h2>
              <div className="space-y-4">
                {Object.values(courseGrades).map(({ course, stats }) => (
                  <div key={course.id} className="p-4 border border-base-200 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{course.title}</h3>
                        {course.apExamType && (
                          <div className="badge badge-accent badge-sm">AP Course</div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${getGradeColor(stats.overall.average)}`}>
                          {stats.overall.average}%
                        </div>
                        <div className="text-xs text-base-content/60">
                          {stats.overall.letterGrade}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-base-content/60">Quizzes:</span>
                        <span className="font-medium ml-2">
                          {stats.quizzes.average}% avg
                        </span>
                      </div>
                      <div>
                        <span className="text-base-content/60">Exams:</span>
                        <span className="font-medium ml-2">
                          {stats.exams.average}% avg
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className={`badge badge-sm ${
                        stats.overall.trend === 'improving' ? 'badge-success' :
                        stats.overall.trend === 'declining' ? 'badge-error' :
                        'badge-info'
                      }`}>
                        {stats.overall.trend === 'improving' ? '↗️ Improving' :
                         stats.overall.trend === 'declining' ? '↘️ Declining' :
                         '→ Stable'}
                      </div>
                      <Link 
                        href={`/student/grades?course=${course.id}`}
                        className="btn btn-ghost btn-xs"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-base-100 rounded-box border border-base-300 shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Recent Grades</h2>
              <div className="space-y-3">
                {overallStats.recentGrades.map(grade => (
                  <Link
                    key={grade.id}
                    href={grade.link}
                    className="flex items-center justify-between p-3 hover:bg-base-200/50 rounded-lg transition-colors group"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium group-hover:text-primary transition-colors">
                          {grade.title}
                        </h4>
                        <div className={`badge badge-xs ${
                          grade.type === 'exam' ? 'badge-accent' : 'badge-secondary'
                        }`}>
                          {grade.type}
                        </div>
                      </div>
                      <div className="text-xs text-base-content/60">
                        {grade.course} • {grade.unit} • {new Date(grade.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${getGradeColor(grade.score)}`}>
                        {grade.score}%
                      </div>
                      <div className="text-xs text-base-content/60">
                        {grade.letterGrade}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Grades List */}
          <div className="bg-base-100 rounded-box border border-base-300 shadow-lg">
            <div className="p-6 border-b border-base-300">
              <h2 className="text-xl font-bold">
                All Grades 
                <span className="text-sm font-normal text-base-content/60 ml-2">
                  ({filteredGrades.length} {filteredGrades.length === 1 ? 'grade' : 'grades'})
                </span>
              </h2>
            </div>
            
            <div className="divide-y divide-base-300">
              {filteredGrades.length > 0 ? (
                filteredGrades.map(grade => (
                  <Link
                    key={grade.id}
                    href={grade.link}
                    className="block p-6 hover:bg-base-50 transition-colors group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
                            {grade.title}
                          </h3>
                          <div className={`badge ${
                            grade.type === 'exam' ? 'badge-accent' : 'badge-secondary'
                          }`}>
                            {grade.type.toUpperCase()}
                          </div>
                          {grade.type === 'exam' && (
                            <div className={`badge badge-outline ${
                              grade.passed ? 'badge-success' : 'badge-error'
                            }`}>
                              {grade.passed ? 'Passed' : 'Failed'}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-base-content/70 mb-3">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            {grade.course}
                          </span>
                          <span>•</span>
                          <span>{grade.unit}</span>
                          <span>•</span>
                          <span>{new Date(grade.date).toLocaleDateString()}</span>
                          {grade.timeSpent && (
                            <>
                              <span>•</span>
                              <span>{Math.round(grade.timeSpent / 60)} min</span>
                            </>
                          )}
                        </div>

                        {grade.feedback && (
                          <div className="bg-info/10 border border-info/20 rounded-lg p-3 text-sm">
                            <div className="font-medium text-info mb-1">Instructor Feedback:</div>
                            <p className="text-base-content/80">{grade.feedback}</p>
                          </div>
                        )}
                      </div>

                      <div className="text-right ml-4">
                        <div className={`text-2xl font-bold ${getGradeColor(grade.score)} mb-1`}>
                          {grade.score}%
                        </div>
                        <div className="text-sm text-base-content/60 mb-2">
                          {grade.letterGrade}
                        </div>
                        {grade.gradingStatus && grade.gradingStatus !== 'completed' && (
                          <div className="badge badge-warning badge-sm">
                            {grade.gradingStatus === 'pending' ? 'Pending Review' : 'In Review'}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-base-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">No Grades Found</h3>
                  <p className="text-base-content/70 mb-4">
                    {courseFilter !== 'all' || typeFilter !== 'all' || timeFilter !== 'all'
                      ? 'No grades match your current filters. Try adjusting the filters above.'
                      : 'You don\'t have any grades yet. Complete some quizzes and exams to see your grades here.'
                    }
                  </p>
                  {(courseFilter !== 'all' || typeFilter !== 'all' || timeFilter !== 'all') && (
                    <Link href="/student/grades" className="btn btn-primary">
                      Clear Filters
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );

  } catch (error) {
    console.error('Error loading grades:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="bg-base-100 rounded-box shadow-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-error mb-2">Error Loading Grades</h1>
          <p className="text-base-content/70 mb-4">Failed to load your grade data.</p>
          <Link href="/dashboard" className="btn btn-primary">Return to Dashboard</Link>
        </div>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}
