import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import StudentManagementClient from './StudentManagementClient';

const prisma = new PrismaClient();

// Helper function to format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

export default async function AdminStudentsPage() {
  try {
    // Fetch all students with their enrollment and progress data
    const students = await prisma.user.findMany({
      where: {
        role: 'STUDENT'
      },
      include: {
        enrollments: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                price: true,
                isFree: true,
                isPublished: true
              }
            }
          }
        },
        // Use the correct field names from the available options
        quizAttempts: {
          include: {
            lessonQuiz: {
              include: {
                lesson: {
                  select: {
                    title: true,
                    unit: {
                      select: {
                        title: true,
                        course: {
                          select: {
                            title: true
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        examAttempts: {
          include: {
            unitExam: {
              include: {
                unit: {
                  select: {
                    title: true,
                    course: {
                      select: {
                        title: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Get additional stats
    const totalStudents = students.length;
    const activeStudents = students.filter(student => 
      student.enrollments.some(enrollment => 
        enrollment.paymentStatus === 'PAID' || enrollment.course.isFree
      )
    ).length;
    
    const totalRevenue = students.reduce((sum, student) => {
      return sum + student.enrollments
        .filter(enrollment => enrollment.paymentStatus === 'PAID')
        .reduce((enrollmentSum, enrollment) => enrollmentSum + (enrollment.course.price || 0), 0);
    }, 0);

    const recentSignups = students.filter(student => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return new Date(student.createdAt) > sevenDaysAgo;
    }).length;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Student Management</h1>
            <p className="text-base-content/70 mt-1">
              Manage student accounts, enrollments, and progress
            </p>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-ghost gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Data
            </button>
            <button className="btn btn-primary gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Student
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-base-100 rounded-box border border-base-300 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-content/70">Total Students</p>
                <p className="text-2xl font-bold text-primary">{totalStudents}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-btn flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-box border border-base-300 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-content/70">Active Students</p>
                <p className="text-2xl font-bold text-success">{activeStudents}</p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-btn flex items-center justify-center">
                <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-box border border-base-300 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-content/70">Revenue</p>
                <p className="text-2xl font-bold text-accent">{formatCurrency(totalRevenue)}</p>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-btn flex items-center justify-center">
                <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-box border border-base-300 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-content/70">New This Week</p>
                <p className="text-2xl font-bold text-info">{recentSignups}</p>
              </div>
              <div className="w-12 h-12 bg-info/10 rounded-btn flex items-center justify-center">
                <svg className="w-6 h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-base-100 rounded-box border border-base-300 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-base-300">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">All Students</h2>
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="form-control">
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Search students..."
                      className="input input-bordered input-sm"
                    />
                    <button className="btn btn-square btn-sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Filter */}
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-ghost btn-sm gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                    </svg>
                    Filter
                  </div>
                  <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border border-base-300">
                    <li><button>All Students</button></li>
                    <li><button>Active Only</button></li>
                    <li><button>New This Week</button></li>
                    <li><button>No Enrollments</button></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <StudentManagementClient students={students} />
        </div>
      </div>
    );

  } catch (error) {
    console.error('Admin students page error:', error);
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-error mb-2">Error Loading Students</h1>
          <p className="text-base-content/70 mb-4">We encountered an error while loading the students page.</p>
          <Link href="/admin" className="btn btn-primary">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  } finally {
    await prisma.$disconnect();
  }
}
