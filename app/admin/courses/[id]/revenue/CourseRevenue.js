'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';

function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount || 0);
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function formatDateTime(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export default function CourseRevenue({ course, payments, refunds, discountUsage }) {
  const [activeTab, setActiveTab] = useState('overview'); // overview, payments, refunds, discounts, analytics
  const [dateRange, setDateRange] = useState('all'); // all, 7, 30, 90, 365
  const [paymentFilter, setPaymentFilter] = useState('all'); // all, completed, pending, failed, refunded

  // Calculate revenue metrics
  const metrics = useMemo(() => {
    const now = new Date();
    const filterDate = dateRange === 'all' ? null : new Date(now.getTime() - parseInt(dateRange) * 24 * 60 * 60 * 1000);

    // Filter payments by date range
    const filteredPayments = filterDate 
      ? payments.filter(p => new Date(p.createdAt) >= filterDate)
      : payments;

    const filteredRefunds = filterDate
      ? refunds.filter(r => new Date(r.createdAt) >= filterDate)
      : refunds;

    const filteredDiscountUsage = filterDate
      ? discountUsage.filter(d => new Date(d.createdAt) >= filterDate)
      : discountUsage;

    // Calculate totals
    const totalRevenue = filteredPayments
      .filter(p => p.status === 'COMPLETED')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalRefunds = filteredRefunds
      .filter(r => r.status === 'COMPLETED')
      .reduce((sum, r) => sum + r.amount, 0);

    const netRevenue = totalRevenue - totalRefunds;

    const pendingRevenue = filteredPayments
      .filter(p => p.status === 'PENDING')
      .reduce((sum, p) => sum + p.amount, 0);

    const failedRevenue = filteredPayments
      .filter(p => p.status === 'FAILED')
      .reduce((sum, p) => sum + p.amount, 0);

    const totalDiscounts = filteredDiscountUsage
      .reduce((sum, d) => sum + d.discountAmount, 0);

    // Count transactions
    const completedPayments = filteredPayments.filter(p => p.status === 'COMPLETED').length;
    const pendingPayments = filteredPayments.filter(p => p.status === 'PENDING').length;
    const failedPayments = filteredPayments.filter(p => p.status === 'FAILED').length;
    const refundCount = filteredRefunds.filter(r => r.status === 'COMPLETED').length;

    // Calculate conversion rate
    const totalEnrollments = course.enrollments.length;
    const paidEnrollments = course.enrollments.filter(e => e.paymentStatus === 'PAID').length;
    const conversionRate = totalEnrollments > 0 ? (paidEnrollments / totalEnrollments) * 100 : 0;

    // Calculate average transaction value
    const avgTransactionValue = completedPayments > 0 ? totalRevenue / completedPayments : 0;

    // Calculate refund rate
    const refundRate = completedPayments > 0 ? (refundCount / completedPayments) * 100 : 0;

    return {
      totalRevenue,
      totalRefunds,
      netRevenue,
      pendingRevenue,
      failedRevenue,
      totalDiscounts,
      completedPayments,
      pendingPayments,
      failedPayments,
      refundCount,
      conversionRate,
      avgTransactionValue,
      refundRate,
      totalEnrollments,
      paidEnrollments
    };
  }, [course, payments, refunds, discountUsage, dateRange]);

  // Calculate revenue trend
  const revenueTrend = useMemo(() => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const recentRevenue = payments
      .filter(p => p.status === 'COMPLETED' && new Date(p.createdAt) >= thirtyDaysAgo)
      .reduce((sum, p) => sum + p.amount, 0);

    const previousRevenue = payments
      .filter(p => p.status === 'COMPLETED' && new Date(p.createdAt) >= sixtyDaysAgo && new Date(p.createdAt) < thirtyDaysAgo)
      .reduce((sum, p) => sum + p.amount, 0);

    if (previousRevenue === 0) return recentRevenue > 0 ? 100 : 0;
    return ((recentRevenue - previousRevenue) / previousRevenue) * 100;
  }, [payments]);

  // Process payment data for table
  const processedPayments = useMemo(() => {
    let filtered = payments;

    if (paymentFilter !== 'all') {
      filtered = payments.filter(p => p.status === paymentFilter.toUpperCase());
    }

    return filtered.map(payment => ({
      id: payment.id,
      studentName: payment.user.name,
      studentEmail: payment.user.email,
      amount: payment.amount,
      status: payment.status,
      method: payment.paymentMethod,
      date: payment.createdAt,
      transactionId: payment.transactionId,
      enrollmentId: payment.enrollment.id
    }));
  }, [payments, paymentFilter]);

  const handleExportRevenue = async () => {
    try {
      const response = await fetch(`/api/admin/courses/${course.id}/revenue/export`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateRange,
          includeRefunds: true,
          includeDiscounts: true
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `course-revenue-${course.id}-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      } else {
        alert('Failed to export revenue data');
      }
    } catch (error) {
      console.error('Error exporting revenue:', error);
      alert('Failed to export revenue data');
    }
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Course Revenue</h1>
          <p className="text-base-content/70 mt-1">
            Financial performance and analytics for "{course.title}"
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="select select-bordered select-sm"
          >
            <option value="all">All Time</option>
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button onClick={handleExportRevenue} className="btn btn-outline btn-sm gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            Export
          </button>
          <Link href={`/admin/courses/${course.id}/edit`} className="btn btn-ghost btn-sm gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Course
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-base-100 rounded-box border border-base-300 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/70 text-sm font-medium">Total Revenue</p>
              <p className="text-3xl font-bold text-success">{formatCurrency(metrics.totalRevenue)}</p>
            </div>
            <div className="w-12 h-12 bg-success/10 rounded-btn flex items-center justify-center">
              <svg className="w-6 h-6 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-center gap-1 text-xs">
              <span className={`badge badge-sm ${revenueTrend >= 0 ? 'badge-success' : 'badge-error'}`}>
                {revenueTrend >= 0 ? '+' : ''}{revenueTrend.toFixed(1)}%
              </span>
              <span className="text-base-content/60">vs last 30 days</span>
            </div>
          </div>
        </div>

        <div className="bg-base-100 rounded-box border border-base-300 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/70 text-sm font-medium">Net Revenue</p>
              <p className="text-3xl font-bold text-primary">{formatCurrency(metrics.netRevenue)}</p>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-btn flex items-center justify-center">
              <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xs text-base-content/60">
              After {formatCurrency(metrics.totalRefunds)} in refunds
            </div>
          </div>
        </div>

        <div className="bg-base-100 rounded-box border border-base-300 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/70 text-sm font-medium">Conversion Rate</p>
              <p className="text-3xl font-bold text-info">{metrics.conversionRate.toFixed(1)}%</p>
            </div>
            <div className="w-12 h-12 bg-info/10 rounded-btn flex items-center justify-center">
              <svg className="w-6 h-6 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xs text-base-content/60">
              {metrics.paidEnrollments} of {metrics.totalEnrollments} enrollments
            </div>
          </div>
        </div>

        <div className="bg-base-100 rounded-box border border-base-300 p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/70 text-sm font-medium">Avg. Transaction</p>
              <p className="text-3xl font-bold text-secondary">{formatCurrency(metrics.avgTransactionValue)}</p>
            </div>
            <div className="w-12 h-12 bg-secondary/10 rounded-btn flex items-center justify-center">
              <svg className="w-6 h-6 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>
          <div className="mt-3">
            <div className="text-xs text-base-content/60">
              {metrics.completedPayments} completed payments
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-base-100 rounded-box border border-base-300 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Payment Status</h3>
            <div className="w-8 h-8 bg-accent/10 rounded-btn flex items-center justify-center">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Completed</span>
              <span className="font-semibold text-success">{metrics.completedPayments}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Pending</span>
              <span className="font-semibold text-warning">{metrics.pendingPayments}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Failed</span>
              <span className="font-semibold text-error">{metrics.failedPayments}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Refunded</span>
              <span className="font-semibold text-info">{metrics.refundCount}</span>
            </div>
          </div>
        </div>

        <div className="bg-base-100 rounded-box border border-base-300 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Revenue Breakdown</h3>
            <div className="w-8 h-8 bg-warning/10 rounded-btn flex items-center justify-center">
              <svg className="w-4 h-4 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Gross Revenue</span>
              <span className="font-semibold">{formatCurrency(metrics.totalRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Refunds</span>
              <span className="font-semibold text-error">-{formatCurrency(metrics.totalRefunds)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Discounts</span>
              <span className="font-semibold text-warning">-{formatCurrency(metrics.totalDiscounts)}</span>
            </div>
            <div className="border-t border-base-300 pt-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Net Revenue</span>
                <span className="font-bold text-primary">{formatCurrency(metrics.netRevenue)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-base-100 rounded-box border border-base-300 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Key Metrics</h3>
            <div className="w-8 h-8 bg-info/10 rounded-btn flex items-center justify-center">
              <svg className="w-4 h-4 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Refund Rate</span>
              <span className="font-semibold">{metrics.refundRate.toFixed(1)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Course Price</span>
              <span className="font-semibold">{course.isFree ? 'Free' : formatCurrency(course.price)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Pending Revenue</span>
              <span className="font-semibold text-warning">{formatCurrency(metrics.pendingRevenue)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Failed Revenue</span>
              <span className="font-semibold text-error">{formatCurrency(metrics.failedRevenue)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs tabs-boxed bg-base-100 border border-base-300 shadow-xl">
        <button 
          className={`tab ${activeTab === 'overview' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Overview
        </button>
        <button 
          className={`tab ${activeTab === 'payments' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('payments')}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Payments ({payments.length})
        </button>
        <button 
          className={`tab ${activeTab === 'refunds' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('refunds')}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z" />
          </svg>
          Refunds ({refunds.length})
        </button>
        <button 
          className={`tab ${activeTab === 'discounts' ? 'tab-active' : ''}`}
          onClick={() => setActiveTab('discounts')}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Discounts ({discountUsage.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-base-100 rounded-box border border-base-300 shadow-xl">
            <div className="p-6 border-b border-base-300">
              <h2 className="text-xl font-semibold">Revenue Overview</h2>
              <p className="text-base-content/70 mt-1">Financial performance summary</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Performance Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-base-200/50 rounded-box">
                      <span>Total Enrollments</span>
                      <span className="font-semibold">{metrics.totalEnrollments}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-base-200/50 rounded-box">
                      <span>Paid Enrollments</span>
                      <span className="font-semibold">{metrics.paidEnrollments}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-base-200/50 rounded-box">
                      <span>Conversion Rate</span>
                      <span className="font-semibold">{metrics.conversionRate.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between p-3 bg-base-200/50 rounded-box">
                      <span>Average Transaction</span>
                      <span className="font-semibold">{formatCurrency(metrics.avgTransactionValue)}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Revenue Trends</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between p-3 bg-success/5 rounded-box border border-success/20">
                      <span>This Month</span>
                      <span className="font-semibold text-success">{formatCurrency(metrics.totalRevenue)}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-error/5 rounded-box border border-error/20">
                      <span>Refunds</span>
                      <span className="font-semibold text-error">{formatCurrency(metrics.totalRefunds)}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-warning/5 rounded-box border border-warning/20">
                      <span>Discounts</span>
                      <span className="font-semibold text-warning">{formatCurrency(metrics.totalDiscounts)}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-primary/5 rounded-box border border-primary/20">
                      <span>Net Revenue</span>
                      <span className="font-semibold text-primary">{formatCurrency(metrics.netRevenue)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="space-y-6">
          {/* Payment Filters */}
          <div className="bg-base-100 rounded-box border border-base-300 p-4">
            <div className="flex items-center gap-4">
              <select
                className="select select-bordered select-sm"
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
              >
                <option value="all">All Payments</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
              <div className="text-sm text-base-content/70 ml-auto">
                Showing {processedPayments.length} payments
              </div>
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-base-100 rounded-box border border-base-300 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead className="bg-base-200">
                  <tr>
                    <th>Student</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Method</th>
                    <th>Date</th>
                    <th>Transaction ID</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {processedPayments.map((payment) => (
                    <tr key={payment.id} className="hover">
                      <td>
                        <div>
                          <div className="font-medium">{payment.studentName}</div>
                          <div className="text-sm text-base-content/70">{payment.studentEmail}</div>
                        </div>
                      </td>
                      <td>
                        <div className="font-semibold">{formatCurrency(payment.amount)}</div>
                      </td>
                      <td>
                        <div className={`badge ${
                          payment.status === 'COMPLETED' ? 'badge-success' :
                          payment.status === 'PENDING' ? 'badge-warning' :
                          payment.status === 'FAILED' ? 'badge-error' :
                          'badge-ghost'
                        }`}>
                          {payment.status}
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">{payment.method || 'N/A'}</div>
                      </td>
                      <td>
                        <div className="text-sm">{formatDateTime(payment.date)}</div>
                      </td>
                      <td>
                        <div className="font-mono text-xs">{payment.transactionId || 'N/A'}</div>
                      </td>
                      <td>
                        <div className="dropdown dropdown-left">
                          <label tabIndex={0} className="btn btn-ghost btn-xs">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                            </svg>
                          </label>
                          <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40 border border-base-300">
                            <li>
                              <button>View Details</button>
                            </li>
                            {payment.status === 'COMPLETED' && (
                              <li>
                                <button className="text-error">Process Refund</button>
                              </li>
                            )}
                            {payment.status === 'PENDING' && (
                              <li>
                                <button className="text-warning">Cancel Payment</button>
                              </li>
                            )}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {processedPayments.length === 0 && (
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-base-content/30 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <h3 className="text-lg font-semibold text-base-content/70 mb-2">No payments found</h3>
                <p className="text-base-content/50">
                  {paymentFilter !== 'all' ? 'Try adjusting your filter' : 'No payments have been processed yet'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'refunds' && (
        <div className="space-y-6">
          <div className="bg-base-100 rounded-box border border-base-300 shadow-xl">
            <div className="p-6 border-b border-base-300">
              <h2 className="text-xl font-semibold">Refund History</h2>
              <p className="text-base-content/70 mt-1">All refunds processed for this course</p>
            </div>
            <div className="p-6">
              {refunds.length > 0 ? (
                <div className="space-y-4">
                  {refunds.map((refund) => (
                    <div key={refund.id} className="border border-base-300 rounded-box p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-medium">{refund.payment.user.name}</div>
                          <div className="text-sm text-base-content/70">{refund.payment.user.email}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-error">{formatCurrency(refund.amount)}</div>
                          <div className={`badge badge-sm ${
                            refund.status === 'COMPLETED' ? 'badge-success' :
                            refund.status === 'PENDING' ? 'badge-warning' :
                            'badge-error'
                          }`}>
                            {refund.status}
                          </div>
                        </div>
                      </div>
                      <div className="text-sm text-base-content/70">
                        <div>Processed: {formatDateTime(refund.createdAt)}</div>
                        <div>Reason: {refund.reason || 'Not specified'}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-base-content/70">
                  No refunds have been processed for this course
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'discounts' && (
        <div className="space-y-6">
          <div className="bg-base-100 rounded-box border border-base-300 shadow-xl">
            <div className="p-6 border-b border-base-300">
              <h2 className="text-xl font-semibold">Discount Usage</h2>
              <p className="text-base-content/70 mt-1">Discount codes used for this course</p>
            </div>
            <div className="p-6">
              {discountUsage.length > 0 ? (
                <div className="space-y-4">
                  {discountUsage.map((usage) => (
                    <div key={usage.id} className="border border-base-300 rounded-box p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <div className="font-medium">{usage.enrollment.user.name}</div>
                          <div className="text-sm text-base-content/70">{usage.enrollment.user.email}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-warning">{formatCurrency(usage.discountAmount)}</div>
                          <div className="badge badge-sm badge-ghost">{usage.discount.code}</div>
                        </div>
                      </div>
                      <div className="text-sm text-base-content/70">
                        <div>Used: {formatDateTime(usage.createdAt)}</div>
                        <div>Discount: {usage.discount.type === 'PERCENTAGE' ? `${usage.discount.value}%` : formatCurrency(usage.discount.value)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-base-content/70">
                  No discount codes have been used for this course
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
