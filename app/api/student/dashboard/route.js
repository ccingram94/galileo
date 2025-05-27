import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to calculate study streak
function calculateStudyStreak(attempts) {
  if (!attempts.length) return 0;
  
  const today = new Date();
  const dates = [...new Set(attempts.map(attempt => 
    new Date(attempt.completedAt || attempt.startedAt).toDateString()
  ))].sort((a, b) => new Date(b) - new Date(a));
  
  let streak = 0;
  let currentDate = new Date(today);
  
  for (const dateStr of dates) {
    const attemptDate = new Date(dateStr);
    const daysDiff = Math.round((currentDate - attemptDate) / (24 * 60 * 60 * 1000));
    
    if (daysDiff <= 1) {
      streak++;
      currentDate = attemptDate;
    } else {
      break;
    }
  }
  
  return streak;
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Fetch comprehensive dashboard data
    const [enrollments, quizAttempts, examAttempts] = await Promise.all([
      // Enrollments with course data
      prisma.enrollment.findMany({
        where: { userId },
        include: {
          course: {
            include: {
              units: {
                include: {
                  lessons: true,
                  unitExams: {
                    include: {
                      attempts: {
                        where: { userId },
                        orderBy: { startedAt: 'desc' }
                      }
                    }
                  }
                },
                orderBy: { order: 'asc' }
              }
            }
          }
        }
      }),

      // Quiz attempts
      prisma.quizAttempt.findMany({
        where: { userId },
        include: {
          lessonQuiz: {
            include: {
              lesson: {
                include: {
                  unit: {
                    include: {
                      course: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: { completedAt: 'desc' },
        take: 10
      }),

      // Exam attempts
      prisma.examAttempt.findMany({
        where: { userId },
        include: {
          exam: {
            include: {
              unit: {
                include: {
                  course: true
                }
              }
            }
          }
        },
        orderBy: { startedAt: 'desc' },
        take: 10
      })
    ]);

    // Calculate comprehensive progress data
    let totalUnits = 0;
    let completedUnits = 0;
    let totalLessons = 0;
    let completedLessons = 0;
    let totalExams = 0;
    let completedExams = 0;
    let passedExams = 0;
    let totalTimeSpent = 0;
    const allScores = [];
    const upcomingExams = [];
    const recentExams = [];

    enrollments.forEach(enrollment => {
      const progress = enrollment.progress || {};
      const course = enrollment.course;
      
      totalUnits += course.units.length;
      
      course.units.forEach(unit => {
        totalLessons += unit.lessons.length;
        totalExams += unit.unitExams.length;
        
        // Check if unit is completed
        const unitProgress = progress[`unit_${unit.id}`];
        if (unitProgress?.completed) {
          completedUnits++;
        }
        
        unit.lessons.forEach(lesson => {
          const lessonProgress = progress[`lesson_${lesson.id}`];
          if (lessonProgress?.completed) {
            completedLessons++;
          }
        });

        // Process unit exams
        unit.unitExams.forEach(exam => {
          const userAttempts = exam.attempts;
          const completedAttempts = userAttempts.filter(attempt => attempt.completedAt);
          
          if (completedAttempts.length > 0) {
            completedExams++;
            const bestAttempt = completedAttempts.reduce((best, current) => 
              (current.score || 0) > (best.score || 0) ? current : best
            );
            if (bestAttempt.passed) {
              passedExams++;
            }
            
            // Add to recent exams
            recentExams.push({
              id: exam.id,
              title: exam.title,
              unit: unit.title,
              course: course.title,
              score: Math.round(bestAttempt.score || 0),
              passed: bestAttempt.passed,
              date: bestAttempt.completedAt,
              attemptId: bestAttempt.id
            });
          } else {
            // Check if exam is available and add to upcoming
            const now = new Date();
            const isAvailable = exam.isPublished &&
              (!exam.availableFrom || new Date(exam.availableFrom) <= now) &&
              (!exam.availableUntil || new Date(exam.availableUntil) > now);
            
            if (isAvailable) {
              upcomingExams.push({
                id: exam.id,
                title: exam.title,
                unit: unit.title,
                course: course.title,
                dueDate: exam.availableUntil,
                maxAttempts: exam.maxAttempts,
                timeLimit: exam.timeLimit
              });
            }
          }
        });
      });
    });

    // Collect scores and time spent
    quizAttempts.forEach(attempt => {
      allScores.push(attempt.score);
      if (attempt.timeSpent) totalTimeSpent += attempt.timeSpent;
    });

    examAttempts.forEach(attempt => {
      if (attempt.score !== null) allScores.push(attempt.score);
      if (attempt.timeUsed) totalTimeSpent += attempt.timeUsed * 60; // Convert minutes to seconds
    });

    // Calculate averages and streaks
    const averageScore = allScores.length > 0 ? 
      Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length) : 0;
    
    const allAttempts = [...quizAttempts, ...examAttempts];
    const studyStreak = calculateStudyStreak(allAttempts);

    // Convert time spent to hours
    const timeSpentHours = (totalTimeSpent / 3600).toFixed(1);

    // Build recent activity
    const recentActivity = [
      ...quizAttempts.slice(0, 3).map(attempt => ({
        type: 'quiz',
        title: attempt.lessonQuiz.lesson.title,
        unit: attempt.lessonQuiz.lesson.unit.title,
        course: attempt.lessonQuiz.lesson.unit.course.title,
        date: new Date(attempt.completedAt).toLocaleDateString(),
        score: Math.round(attempt.score),
        link: `/courses/${attempt.lessonQuiz.lesson.unit.course.id}/units/${attempt.lessonQuiz.lesson.unit.id}/lessons/${attempt.lessonQuiz.lesson.id}`
      })), 
      ...recentExams.slice(0, 3).map(exam => ({
        type: 'exam',
        title: exam.title,
        unit: exam.unit,
        course: exam.course,
        date: new Date(exam.date).toLocaleDateString(),
        score: exam.score,
        passed: exam.passed,
        link: `/student/exams/${exam.id}/results?attemptId=${exam.attemptId}`
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

    const dashboardData = {
      stats: {
        unitsCompleted: completedUnits,
        totalUnits: totalUnits || 1,
        lessonsCompleted: completedLessons,
        totalLessons: totalLessons || 1,
        examsCompleted: completedExams,
        totalExams: totalExams || 1,
        examPassRate: completedExams > 0 ? Math.round((passedExams / completedExams) * 100) : 0,
        studyStreak,
        averageScore,
        timeSpent: totalTimeSpent > 0 ? `${timeSpentHours} hours` : "0 hours"
      },
      upcomingExams: upcomingExams.slice(0, 4),
      recentActivity,
      courseCount: enrollments.length
    };

    return NextResponse.json(dashboardData);

  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
