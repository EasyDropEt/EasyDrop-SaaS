'use client';

import { useEffect, useState } from 'react';
import { useBusinessContext } from '@/context/BusinessContext';
import { Business } from '@/domain/entities/Business';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Metadata } from 'next';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { PulseLoader, ClipLoader } from 'react-spinners';

const staggerChildren = {
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
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function BusinessProfilePage() {
  const { business, refreshBusinessData, isLoading } = useBusinessContext();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const refreshData = async () => {
      setIsRefreshing(true);
      try {
        await refreshBusinessData();
      } finally {
        setIsRefreshing(false);
      }
    };

    refreshData();
  }, []);

  if (isLoading || isRefreshing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <PulseLoader color="#3B82F6" size={15} margin={2} />
          <p className="text-dark-500 dark:text-light-400 mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 dark:text-red-400">No business data available</div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-12 px-4">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
          className="max-w-4xl mx-auto"
        >
          <motion.div variants={fadeInUp} className="card overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-6 py-6">
              <h1 className="text-2xl font-bold text-white">Business Profile</h1>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => refreshBusinessData()}
                  className="btn-primary"
                  disabled={isRefreshing}
                >
                  {isRefreshing ? (
                    <span className="flex items-center">
                      <ClipLoader color="#ffffff" size={16} className="mr-2" />
                      Refreshing...
                    </span>
                  ) : 'Refresh Data'}
                </motion.button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div variants={fadeInUp} className="md:col-span-1">
                  <div className="card p-6">
                    <div className="h-24 w-24 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        {business?.business_name?.charAt(0) || 'B'}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold text-center text-dark-900 dark:text-white mb-2">
                      {business?.business_name}
                    </h2>
                    
                    <div className="border-t border-light-300 dark:border-dark-700 mt-4 pt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-dark-600 dark:text-light-400">Status</span>
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400">
                          Active
                        </span>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => router.push('/orders')}
                        className="btn-primary w-full mt-4"
                      >
                        View Orders
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
                
                <div className="md:col-span-2">
                  <motion.div variants={fadeInUp} className="card p-6 mb-6">
                    <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4 border-b border-light-300 dark:border-dark-700 pb-2">
                      Business Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-dark-600 dark:text-light-400 mb-1">Business Name</label>
                        <div className="text-dark-900 dark:text-white">{business?.business_name}</div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-dark-600 dark:text-light-400 mb-1">Email</label>
                        <div className="text-dark-900 dark:text-white">{business?.email}</div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-dark-600 dark:text-light-400 mb-1">Phone Number</label>
                        <div className="text-dark-900 dark:text-white">{business?.phone_number}</div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div variants={fadeInUp} className="card p-6 mb-6">
                    <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4 border-b border-light-300 dark:border-dark-700 pb-2">
                      Owner Information
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-dark-600 dark:text-light-400 mb-1">First Name</label>
                        <div className="text-dark-900 dark:text-white">{business?.owner_first_name}</div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-dark-600 dark:text-light-400 mb-1">Last Name</label>
                        <div className="text-dark-900 dark:text-white">{business?.owner_last_name}</div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div variants={fadeInUp} className="card p-6">
                    <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4 border-b border-light-300 dark:border-dark-700 pb-2">
                      Location Information
                    </h3>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-dark-600 dark:text-light-400 mb-1">Address</label>
                      <div className="text-dark-900 dark:text-white">{business?.location?.address}</div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-dark-600 dark:text-light-400 mb-1">City</label>
                        <div className="text-dark-900 dark:text-white">{business?.location?.city}</div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-dark-600 dark:text-light-400 mb-1">Postal Code</label>
                        <div className="text-dark-900 dark:text-white">{business?.location?.postal_code}</div>
                      </div>
                      
                      {/* <div>
                        <label className="block text-sm font-medium text-dark-600 dark:text-light-400 mb-1">Country</label>
                        <div className="text-dark-900 dark:text-white">{business?.location?.country}</div>
                      </div> */}
                    </div>
                  </motion.div>
                  
                  <motion.div variants={fadeInUp} className="mt-6 pt-6 border-t border-light-300 dark:border-dark-700 flex justify-end space-x-4">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => router.push('/business/edit')}
                      className="btn-outline"
                    >
                      Edit Profile
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => router.push('/business/settings')}
                      className="btn-primary"
                    >
                      Account Settings
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </ProtectedRoute>
  );
} 