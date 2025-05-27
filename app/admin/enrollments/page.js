import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import EnrollmentManagementClient from './EnrollmentManagementClient';

const prisma = new PrismaClient();

// Helper function to format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

export default async function AdminEnrollmentsPage() {
  try {
    // Fetch all enrollments with related data
    const enrollments = await prisma.enrollment.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            emailVerified: true,
            createdAt: true
          }
        },
        course: {
          select: {
            id: true,
            title: true,
            price: true,
            isFree: true,
            isPublished: true,
            apExamType: true,
            imageUrl: true
          }
        }
      },
      orderBy: { enrolledAt: 'desc' }
    });

    // Calculate stats
    const totalEnrollments = enrollments.length;
    const paidEnrollments = enrollments.filter(e => e.paymentStatus === 'PAID').length;
    const freeEnrollments = enrollments.filter(e => e.course.isFree).length;
    const pendingEnrollments = enrollments.filter(e => e.paymentStatus === 'PENDING').length;
    const completedEnrollments = enrollments.filter(e => e.completedAt).length;

    const totalRevenue = enrollments
      .filter(e => e.paymentStatus === 'PAID')
      .reduce((sum, e) => sum + (e.course.price || 0), 0);

    // Recent enrollments (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentEnrollments = enrollments.filter(e => 
      new Date(e.enrolledAt) > sevenDaysAgo
    ).length;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Enrollment Management</h1>
            <p className="text-base-content/70 mt-1">
              Monitor and manage student course enrollments
            </p>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-ghost gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export Report
            </button>
            <button className="btn btn-primary gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Manual Enrollment
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-base-100 rounded-box border border-base-300 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-content/70">Total Enrollments</p>
                <p className="text-2xl font-bold text-primary">{totalEnrollments}</p>
                <p className="text-xs text-base-content/50 mt-1">
                  {recentEnrollments} this week
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-btn flex items-center justify-center">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-box border border-base-300 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-base-content/70">Paid Enrollments</p>
                <p className="text-2xl font-bold text-success">{paidEnrollments}</p>
                <p className="text-xs text-base-content/50 mt-1">
                  {freeEnrollments} free
                </p>
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
                <p className="text-xs text-base-content/50 mt-1">
                  Total earned
                </p>
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
                <p className="text-sm font-medium text-base-content/70">Completion Rate</p>
                <p className="text-2xl font-bold text-info">
                  {totalEnrollments > 0 ? Math.round((completedEnrollments / totalEnrollments) * 100) : 0}%
                </p>
                <p className="text-xs text-base-content/50 mt-1">
                  {completedEnrollments} completed
                </p>
              </div>
              <div className="w-12 h-12 bg-info/10 rounded-btn flex items-center justify-center">
                <svg className="w-6 h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Status Summary */}
        <div className="bg-base-100 rounded-box border border-base-300 p-6">
          <h2 className="text-lg font-semibold mb-4">Payment Status Overview</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-success/10 rounded-btn">
              <div className="text-2xl font-bold text-success">{paidEnrollments}</div>
              <div className="text-sm text-base-content/70">Paid</div>
            </div>
            <div className="text-center p-4 bg-warning/10 rounded-btn">
              <div className="text-2xl font-bold text-warning">{pendingEnrollments}</div>
              <div className="text-sm text-base-content/70">Pending</div>
            </div>
            <div className="text-center p-4 bg-info/10 rounded-btn">
              <div className="text-2xl font-bold text-info">{freeEnrollments}</div>
              <div className="text-sm text-base-content/70">Free</div>
            </div>
            <div className="text-center p-4 bg-error/10 rounded-btn">
              <div className="text-2xl font-bold text-error">
                {enrollments.filter(e => e.paymentStatus === 'FAILED').length}
              </div>
              <div className="text-sm text-base-content/70">Failed</div>
            </div>
          </div>
        </div>

        {/* Enrollments Table */}
        <div className="bg-base-100 rounded-box border border-base-300 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-base-300">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">All Enrollments</h2>
              <div className="text-sm text-base-content/70">
                {totalEnrollments} total enrollments
              </div>
            </div>
          </div>

          <EnrollmentManagementClient enrollments={enrollments} />
        </div>
      </div>
    );

  } catch (error) {
    console.error('Admin enrollments page error:', error);
    return (
      <div className="text-center py-12">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-error" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-error mb-2">Error Loading Enrollments</h1>
          <p className="text-base-content/70 mb-4">We encountered an error while loading the enrollments page.</p>
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
