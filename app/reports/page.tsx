'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useBusinessContext } from '@/context/BusinessContext';
import { useBusinessReport } from '@/hooks/useBusinessReport';
import { motion } from 'framer-motion';
import { PulseLoader } from 'react-spinners';
import { useState } from 'react';

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.6 
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5 
    }
  }
};

export default function ReportsPage() {
  const { business } = useBusinessContext();
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString(),
    endDate: new Date().toISOString()
  });
  
  const { report, loading, error, refreshReport } = useBusinessReport(
    dateRange.startDate,
    dateRange.endDate
  );

  // Format time values to a readable format
  const formatTime = (timeInMinutes: number | string): string => {
    if (typeof timeInMinutes === 'string') return timeInMinutes;
    if (timeInMinutes < 60) return `${timeInMinutes}m`;
    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  // Format currency (Ethiopian Birr)
  const formatCurrency = (amount: number | string): string => {
    if (typeof amount === 'string') return amount;
    try {
      return new Intl.NumberFormat('en-ET', {
        style: 'currency',
        currency: 'ETB',
        minimumFractionDigits: 2
      }).format(amount);
    } catch {
      return `${amount} Br`;
    }
  };

  // Format date to a readable format
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';

    // Some backend timestamps include more than 3 fractional second digits
    // which the JS Date parser may consider invalid. Trim to 3 digits max.
    const sanitized = dateString.replace(/\.(\d{3})\d*(Z?)$/, '.$1$2');

    const date = new Date(sanitized);

    if (isNaN(date.getTime())) {
      // Fallback – try without fractional seconds completely
      const fallback = dateString.split('.')[0] + 'Z';
      const altDate = new Date(fallback);
      return isNaN(altDate.getTime()) ? 'Invalid Date' : altDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Format trend indicator
  const getTrendIndicator = (trend?: 'up' | 'down' | 'stable') => {
    if (!trend) return null;
    
    const iconClass = 
      trend === 'up' ? 'text-green-500 dark:text-green-400' : 
      trend === 'down' ? 'text-red-500 dark:text-red-400' : 
      'text-gray-500 dark:text-gray-400';
    
    const icon = 
      trend === 'up' ? (
        <svg className={`h-4 w-4 ${iconClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
        </svg>
      ) : trend === 'down' ? (
        <svg className={`h-4 w-4 ${iconClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      ) : (
        <svg className={`h-4 w-4 ${iconClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14"></path>
        </svg>
      );
    
    return icon;
  };

  return (
    <ProtectedRoute>
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="container mx-auto py-12 px-4"
      >
        <motion.div 
          variants={fadeInUp}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-2">Reports</h1>
          <p className="text-dark-600 dark:text-light-400">
            Analytics and insights for your delivery operations
          </p>
        </motion.div>
        
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <PulseLoader color="#6366F1" size={12} />
          </div>
        ) : error ? (
          <motion.div 
            variants={fadeInUp}
            className="bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-8"
          >
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button 
              onClick={refreshReport}
              className="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md"
            >
              Try Again
            </button>
          </motion.div>
        ) : (
          <>
            <motion.div 
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            >
              <motion.div variants={fadeInUp} className="bg-white dark:bg-dark-800 border border-light-300 dark:border-dark-700 shadow-md rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-dark-900 dark:text-white">Total Orders</h3>
                  <div className="rounded-md bg-primary-100 dark:bg-primary-600/10 p-2">
                    <svg className="h-5 w-5 text-primary-600 dark:text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                </div>
                <div className="flex items-baseline">
                  <p className="text-3xl font-bold text-dark-900 dark:text-white">
                    {report?.totalOrders.value || 0}
                  </p>
                  {report?.totalOrders.change && (
                    <div className="ml-2 flex items-center">
                      {getTrendIndicator(report.totalOrders.trend)}
                      <span className={`text-sm ${
                        report.totalOrders.trend === 'up' ? 'text-green-500 dark:text-green-400' : 
                        report.totalOrders.trend === 'down' ? 'text-red-500 dark:text-red-400' : 
                        'text-gray-500 dark:text-gray-400'
                      }`}>
                        {report.totalOrders.change}%
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-dark-500 dark:text-light-400 mt-1">Last 30 days</p>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="bg-white dark:bg-dark-800 border border-light-300 dark:border-dark-700 shadow-md rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-dark-900 dark:text-white">Completed Deliveries</h3>
                  <div className="rounded-md bg-primary-100 dark:bg-primary-600/10 p-2">
                    <svg className="h-5 w-5 text-primary-600 dark:text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                <div className="flex items-baseline">
                  <p className="text-3xl font-bold text-dark-900 dark:text-white">
                    {report?.completedDeliveries.value || 0}
                  </p>
                  {report?.completedDeliveries.change && (
                    <div className="ml-2 flex items-center">
                      {getTrendIndicator(report.completedDeliveries.trend)}
                      <span className={`text-sm ${
                        report.completedDeliveries.trend === 'up' ? 'text-green-500 dark:text-green-400' : 
                        report.completedDeliveries.trend === 'down' ? 'text-red-500 dark:text-red-400' : 
                        'text-gray-500 dark:text-gray-400'
                      }`}>
                        {report.completedDeliveries.change}%
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-dark-500 dark:text-light-400 mt-1">Last 30 days</p>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="bg-white dark:bg-dark-800 border border-light-300 dark:border-dark-700 shadow-md rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-dark-900 dark:text-white">Avg. Delivery Time</h3>
                  <div className="rounded-md bg-primary-100 dark:bg-primary-600/10 p-2">
                    <svg className="h-5 w-5 text-primary-600 dark:text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
                <div className="flex items-baseline">
                  <p className="text-3xl font-bold text-dark-900 dark:text-white">
                    {formatTime(report?.avgDeliveryTime.value || 0)}
                  </p>
                  {report?.avgDeliveryTime.change && (
                    <div className="ml-2 flex items-center">
                      {getTrendIndicator(report.avgDeliveryTime.trend)}
                      <span className={`text-sm ${
                        report.avgDeliveryTime.trend === 'down' ? 'text-green-500 dark:text-green-400' : 
                        report.avgDeliveryTime.trend === 'up' ? 'text-red-500 dark:text-red-400' : 
                        'text-gray-500 dark:text-gray-400'
                      }`}>
                        {report.avgDeliveryTime.change}%
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-dark-500 dark:text-light-400 mt-1">Last 30 days</p>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="bg-white dark:bg-dark-800 border border-light-300 dark:border-dark-700 shadow-md rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-dark-900 dark:text-white">Customer Satisfaction</h3>
                  <div className="rounded-md bg-primary-100 dark:bg-primary-600/10 p-2">
                    <svg className="h-5 w-5 text-primary-600 dark:text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905a3.61 3.61 0 01-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                    </svg>
                  </div>
                </div>
                <div className="flex items-baseline">
                  <p className="text-3xl font-bold text-dark-900 dark:text-white">
                    {report?.customerSatisfaction.value || '-'}
                  </p>
                  {report?.customerSatisfaction.change && (
                    <div className="ml-2 flex items-center">
                      {getTrendIndicator(report.customerSatisfaction.trend)}
                      <span className={`text-sm ${
                        report.customerSatisfaction.trend === 'up' ? 'text-green-500 dark:text-green-400' : 
                        report.customerSatisfaction.trend === 'down' ? 'text-red-500 dark:text-red-400' : 
                        'text-gray-500 dark:text-gray-400'
                      }`}>
                        {report.customerSatisfaction.change}%
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-sm text-dark-500 dark:text-light-400 mt-1">Last 30 days</p>
              </motion.div>

              {/* Total Revenue */}
              <motion.div variants={fadeInUp} className="bg-white dark:bg-dark-800 border border-light-300 dark:border-dark-700 shadow-md rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-dark-900 dark:text-white">Total Revenue</h3>
                  <div className="rounded-md bg-primary-100 dark:bg-primary-600/10 p-2">
                    <svg className="h-5 w-5 text-primary-600 dark:text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 1.343-3 3h6c0-1.657-1.343-3-3-3zM9 11v2m6-2v2m-6 4h6"></path>
                    </svg>
                  </div>
                </div>
                <div className="flex items-baseline">
                  <p className="text-3xl font-bold text-dark-900 dark:text-white">
                    {formatCurrency(report?.totalRevenue.value || 0)}
                  </p>
                </div>
                <p className="text-sm text-dark-500 dark:text-light-400 mt-1">Last 30 days</p>
              </motion.div>

              {/* Delivery Success Rate */}
              <motion.div variants={fadeInUp} className="bg-white dark:bg-dark-800 border border-light-300 dark:border-dark-700 shadow-md rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-dark-900 dark:text-white">Delivery Success Rate</h3>
                  <div className="rounded-md bg-primary-100 dark:bg-primary-600/10 p-2">
                    <svg className="h-5 w-5 text-primary-600 dark:text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12l5 5L20 7"></path>
                    </svg>
                  </div>
                </div>
                <div className="flex items-baseline">
                  <p className="text-3xl font-bold text-dark-900 dark:text-white">
                    {typeof report?.deliverySuccessRate.value === 'number' ? (report!.deliverySuccessRate.value as number).toFixed(1) : report?.deliverySuccessRate.value}%
                  </p>
                </div>
                <p className="text-sm text-dark-500 dark:text-light-400 mt-1">Last 30 days</p>
              </motion.div>

              {/* Cancelled Deliveries */}
              <motion.div variants={fadeInUp} className="bg-white dark:bg-dark-800 border border-light-300 dark:border-dark-700 shadow-md rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-dark-900 dark:text-white">Cancelled Deliveries</h3>
                  <div className="rounded-md bg-primary-100 dark:bg-primary-600/10 p-2">
                    <svg className="h-5 w-5 text-primary-600 dark:text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-dark-900 dark:text-white">
                  {report?.cancelledDeliveries.value || 0}
                </p>
                <p className="text-sm text-dark-500 dark:text-light-400 mt-1">Last 30 days</p>
              </motion.div>

              {/* Pending Deliveries */}
              <motion.div variants={fadeInUp} className="bg-white dark:bg-dark-800 border border-light-300 dark:border-dark-700 shadow-md rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-dark-900 dark:text-white">Pending Deliveries</h3>
                  <div className="rounded-md bg-primary-100 dark:bg-primary-600/10 p-2">
                    <svg className="h-5 w-5 text-primary-600 dark:text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3"></path>
                    </svg>
                  </div>
                </div>
                <p className="text-3xl font-bold text-dark-900 dark:text-white">
                  {report?.pendingDeliveries.value || 0}
                </p>
                <p className="text-sm text-dark-500 dark:text-light-400 mt-1">Last 30 days</p>
              </motion.div>
            </motion.div>
            
            <motion.div 
              variants={fadeInUp}
              className="bg-white dark:bg-dark-800 border border-light-300 dark:border-dark-700 rounded-xl shadow-md overflow-hidden p-6 mb-8"
            >
              <h2 className="text-xl font-semibold text-dark-900 dark:text-white mb-4">Delivery Performance</h2>
              <div className="h-64 bg-light-100 dark:bg-dark-700 rounded-lg flex items-center justify-center">
                {loading ? (
                  <PulseLoader color="#6366F1" size={10} />
                ) : (
                  <p className="text-dark-500 dark:text-light-400">
                    {report ? 'Performance charts coming soon' : 'No delivery data available yet'}
                  </p>
                )}
              </div>
            </motion.div>
            
            <motion.div 
              variants={staggerContainer} 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <motion.div variants={fadeInUp} className="bg-white dark:bg-dark-800 border border-light-300 dark:border-dark-700 rounded-xl shadow-md overflow-hidden p-6">
                <h2 className="text-xl font-semibold text-dark-900 dark:text-white mb-4">Recent Orders</h2>
                <div className="border border-light-300 dark:border-dark-700 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-light-300 dark:divide-dark-700">
                    <thead className="bg-light-100 dark:bg-dark-900">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-500 dark:text-light-400 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-500 dark:text-light-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-500 dark:text-light-400 uppercase tracking-wider">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {report?.recentOrders && report.recentOrders.length > 0 ? (
                        report.recentOrders.map((order) => (
                          <tr key={order.id} className="bg-white dark:bg-dark-800">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-900 dark:text-white">
                              {order.id.slice(0, 8)}...
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                (order.status === 'delivered' || order.status === 'completed') ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                                order.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                              }`}>
                                {order.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-500 dark:text-light-400">
                              {formatDate(order.createdAt)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr className="bg-white dark:bg-dark-800">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-500 dark:text-light-400 text-center" colSpan={3}>
                            No orders yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </motion.div>
              
              <motion.div variants={fadeInUp} className="bg-white dark:bg-dark-800 border border-light-300 dark:border-dark-700 rounded-xl shadow-md overflow-hidden p-6">
                <h2 className="text-xl font-semibold text-dark-900 dark:text-white mb-4">Delivery Areas</h2>
                <div className="h-64 bg-light-100 dark:bg-dark-700 rounded-lg flex items-center justify-center">
                  {loading ? (
                    <PulseLoader color="#6366F1" size={10} />
                  ) : (
                    <p className="text-dark-500 dark:text-light-400">
                      {report ? 'Area visualization coming soon' : 'No delivery data available yet'}
                    </p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </motion.div>
    </ProtectedRoute>
  );
} 