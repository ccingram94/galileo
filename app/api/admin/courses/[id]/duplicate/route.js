import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request, { params }) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const {
      title,
      description,
      apExamType,
      isFree,
      price,
      imageUrl,
      duplicateContent,
      duplicateQuizzes,
      duplicateExams,
      duplicateSettings,
      publishImmediately
    } = await request.json();

    // Get the original course with all content
    const originalCourse = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        units: {
          include: {
            lessons: {
              include: {
                lessonQuizzes: true
              },
              orderBy: { order: 'asc' }
            },
            unitExams: true
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!originalCourse) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Create the new course
    const newCourse = await prisma.course.create({
      data: {
        title,
        description,
        apExamType,
        isFree,
        price: isFree ? null : price,
        imageUrl,
        isPublished: publishImmediately,
        // Copy settings if requested
        ...(duplicateSettings && {
          enrollmentLimit: originalCourse.enrollmentLimit,
          allowWaitlist: originalCourse.allowWaitlist,
          autoEnrollment: originalCourse.autoEnrollment,
          certificateEnabled: originalCourse.certificateEnabled,
          discussionEnabled: originalCourse.discussionEnabled,
          downloadableContent: originalCourse.downloadableContent,
          accessDuration: originalCourse.accessDuration,
          progressTracking: originalCourse.progressTracking,
          completionCriteria: originalCourse.completionCriteria,
          passingGrade: originalCourse.passingGrade,
          prerequisiteCourses: originalCourse.prerequisiteCourses
        })
      }
    });

    // Duplicate content if requested
    if (duplicateContent) {
      for (const originalUnit of originalCourse.units) {
        const newUnit = await prisma.unit.create({
          data: {
            title: originalUnit.title,
            description: originalUnit.description,
            order: originalUnit.order,
            courseId: newCourse.id
          }
        });

        // Duplicate lessons
        for (const originalLesson of originalUnit.lessons) {
          const newLesson = await prisma.lesson.create({
            data: {
              title: originalLesson.title,
              description: originalLesson.description,
              content: originalLesson.content,
              videoUrl: originalLesson.videoUrl,
              order: originalLesson.order,
              unitId: newUnit.id,
              isPublished: originalLesson.isPublished
            }
          });

          // Duplicate quizzes if requested
          if (duplicateQuizzes) {
            for (const originalQuiz of originalLesson.lessonQuizzes) {
              await prisma.lessonQuiz.create({
                data: {
                  title: originalQuiz.title,
                  description: originalQuiz.description,
                  lessonId: newLesson.id,
                  questions: originalQuiz.questions,
                  passingScore: originalQuiz.passingScore,
                  isPublished: originalQuiz.isPublished
                }
              });
            }
          }
        }

        // Duplicate unit exams if requested
        if (duplicateExams) {
          for (const originalExam of originalUnit.unitExams) {
            await prisma.unitExam.create({
              data: {
                title: originalExam.title,
                description: originalExam.description,
                unitId: newUnit.id,
                questions: originalExam.questions,
                passingScore: originalExam.passingScore,
                timeLimit: originalExam.timeLimit,
                isPublished: originalExam.isPublished
              }
            });
          }
        }
      }
    }

    return NextResponse.json(newCourse, { status: 201 });

  } catch (error) {
    console.error('Error duplicating course:', error);
    return NextResponse.json(
      { error: 'Failed to duplicate course' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
