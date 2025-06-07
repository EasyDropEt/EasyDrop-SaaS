'use client';

import { useBusinessContext } from '@/context/BusinessContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PulseLoader } from 'react-spinners';

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
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

export default function Home() {
  const { isAuthenticated, business, isLoading } = useBusinessContext();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <PulseLoader color="#3B82F6" size={15} margin={2} />
          <p className="text-dark-500 dark:text-light-400 mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {isAuthenticated ? (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="container mx-auto py-12 px-4"
        >
          <div className="mb-10">
            <motion.h1 
              variants={slideUp}
              className="text-3xl font-bold text-dark-900 dark:text-white mb-6"
            >
              Welcome back, <span className="gradient-text">{business?.business_name}</span>!
            </motion.h1>
            
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <motion.div 
                variants={slideUp} 
                className="relative overflow-hidden rounded-xl bg-white dark:bg-dark-800 border border-light-300 dark:border-dark-700 shadow-md"
              >
                <div className="p-6">
                  <div className="mb-6 inline-flex rounded-lg bg-primary-100 dark:bg-primary-600/10 p-3 text-primary-600 dark:text-primary-500">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                  </div>
                  <h2 className="mb-2 text-xl font-bold text-dark-900 dark:text-white">Create Delivery</h2>
                  <p className="mb-6 text-dark-600 dark:text-light-400">Create and manage your deliveries with ease.</p>
                  <Link
                    href="/orders/create"
                    className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-700"
                  >
                    Create Order
                  </Link>
                </div>
              </motion.div>
              
              <motion.div 
                variants={slideUp} 
                className="relative overflow-hidden rounded-xl bg-white dark:bg-dark-800 border border-light-300 dark:border-dark-700 shadow-md"
              >
                <div className="p-6">
                  <div className="mb-6 inline-flex rounded-lg bg-primary-100 dark:bg-primary-600/10 p-3 text-primary-600 dark:text-primary-500">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                  <h2 className="mb-2 text-xl font-bold text-dark-900 dark:text-white">Track Deliveries</h2>
                  <p className="mb-6 text-dark-600 dark:text-light-400">Monitor delivery status in real-time.</p>
                  <Link
                    href="/orders"
                    className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-700"
                  >
                    View Orders
                  </Link>
                </div>
              </motion.div>
              
              <motion.div 
                variants={slideUp} 
                className="relative overflow-hidden rounded-xl bg-white dark:bg-dark-800 border border-light-300 dark:border-dark-700 shadow-md"
              >
                <div className="p-6">
                  <div className="mb-6 inline-flex rounded-lg bg-primary-100 dark:bg-primary-600/10 p-3 text-primary-600 dark:text-primary-500">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                  <h2 className="mb-2 text-xl font-bold text-dark-900 dark:text-white">Performance Analytics</h2>
                  <p className="mb-6 text-dark-600 dark:text-light-400">Gain insights into your delivery performance.</p>
                  <Link
                    href="/reports"
                    className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-primary-700"
                  >
                    View Reports
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative bg-gradient-to-b from-light-100 to-light-200 dark:from-dark-800 dark:to-dark-900 pt-20 pb-32 overflow-hidden"
          >
            <div className="absolute inset-0 overflow-hidden">
              <motion.div
                animate={{ 
                  y: [0, 10, 0],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: 8
                }}
                className="w-full h-full bg-primary-500 opacity-10 dark:opacity-5 blur-3xl rounded-full translate-y-1/2"
              />
            </div>
            
            <div className="container relative mx-auto px-4 text-center z-10">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-5xl sm:text-6xl font-bold text-dark-900 dark:text-white mb-6"
              >
                Delivery <span className="gradient-text">Management</span><br />
                Solutions for Your Business
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-dark-700 dark:text-light-300 max-w-3xl mx-auto mb-12"
              >
                EasyDrop helps businesses optimize their delivery operations with a simple, powerful platform.
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row justify-center gap-4"
              >
                <Link
                  href="/business/register"
                  className="btn-primary px-8 py-3 text-base"
                >
                  Get Started
                </Link>
                <Link
                  href="/business/login"
                  className="btn-outline px-8 py-3 text-base"
                >
                  Log In
                </Link>
              </motion.div>
            </div>
          </motion.div>
          
          <div className="py-24 bg-white dark:bg-dark-800">
            <div className="container mx-auto px-4">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={staggerContainer}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
              >
                <motion.div 
                  variants={slideUp}
                  className="card p-8 hover:shadow-lg transition-all duration-300"
                >
                  <div className="text-primary-500 mb-6">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-dark-900 dark:text-white mb-3">Fast Delivery Management</h2>
                  <p className="text-dark-600 dark:text-light-400">
                    Create and manage delivery orders quickly and efficiently with our intuitive dashboard.
                  </p>
                </motion.div>
                
                <motion.div 
                  variants={slideUp}
                  className="card p-8 hover:shadow-lg transition-all duration-300"
                >
                  <div className="text-primary-500 mb-6">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-dark-900 dark:text-white mb-3">Real-Time Tracking</h2>
                  <p className="text-dark-600 dark:text-light-400">
                    Monitor your deliveries in real-time and keep customers informed about their orders.
                  </p>
                </motion.div>
                
                <motion.div 
                  variants={slideUp}
                  className="card p-8 hover:shadow-lg transition-all duration-300"
                >
                  <div className="text-primary-500 mb-6">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                    </svg>
                  </div>
                  <h2 className="text-xl font-semibold text-dark-900 dark:text-white mb-3">Performance Analytics</h2>
                  <p className="text-dark-600 dark:text-light-400">
                    Gain insights into your delivery performance and optimize operations with detailed reports.
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
          
          <div className="py-24 bg-light-100 dark:bg-dark-900">
            <div className="container mx-auto px-4 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-dark-900 dark:text-white mb-6">Ready to optimize your delivery operations?</h2>
                <p className="text-dark-600 dark:text-light-400 max-w-2xl mx-auto mb-8">
                  Join thousands of businesses that trust EasyDrop for their delivery management needs.
                </p>
                <Link
                  href="/business/register"
                  className="btn-primary px-8 py-3 text-base"
                >
                  Get Started Today
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
