'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useBusinessContext } from '@/context/BusinessContext';
import { motion } from 'framer-motion';
import { PulseLoader } from 'react-spinners';

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
            <p className="text-3xl font-bold text-dark-900 dark:text-white">0</p>
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
            <p className="text-3xl font-bold text-dark-900 dark:text-white">0</p>
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
            <p className="text-3xl font-bold text-dark-900 dark:text-white">0m</p>
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
            <p className="text-3xl font-bold text-dark-900 dark:text-white">-</p>
            <p className="text-sm text-dark-500 dark:text-light-400 mt-1">Last 30 days</p>
          </motion.div>
        </motion.div>
        
        <motion.div 
          variants={fadeInUp}
          className="bg-white dark:bg-dark-800 border border-light-300 dark:border-dark-700 rounded-xl shadow-md overflow-hidden p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-dark-900 dark:text-white mb-4">Delivery Performance</h2>
          <div className="h-64 bg-light-100 dark:bg-dark-700 rounded-lg flex items-center justify-center">
            <p className="text-dark-500 dark:text-light-400">No delivery data available yet</p>
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
                  <tr className="bg-white dark:bg-dark-800">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-500 dark:text-light-400 text-center" colSpan={3}>
                      No orders yet
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
          
          <motion.div variants={fadeInUp} className="bg-white dark:bg-dark-800 border border-light-300 dark:border-dark-700 rounded-xl shadow-md overflow-hidden p-6">
            <h2 className="text-xl font-semibold text-dark-900 dark:text-white mb-4">Delivery Areas</h2>
            <div className="h-64 bg-light-100 dark:bg-dark-700 rounded-lg flex items-center justify-center">
              <p className="text-dark-500 dark:text-light-400">No delivery data available yet</p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </ProtectedRoute>
  );
} 