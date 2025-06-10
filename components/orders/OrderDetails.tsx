import React, { useEffect } from 'react';
import { useOrderContext } from '@/context/OrderContext';
import { Order } from '@/domain/entities/Order';
import { motion } from 'framer-motion';
import { PulseLoader } from 'react-spinners';
import { MapComponent } from './map';

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

interface OrderDetailsProps {
  orderId: string;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({ orderId }) => {
  const { currentOrder, loading, error, fetchOrderById } = useOrderContext();

  useEffect(() => {
    fetchOrderById(orderId);
  }, [orderId, fetchOrderById]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12 min-h-[50vh]">
        <div className="flex flex-col items-center space-y-4">
          <PulseLoader color="#3B82F6" size={15} margin={2} />
          <p className="text-dark-500 dark:text-light-400 mt-2 font-medium">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-8 border border-light-200 dark:border-dark-700 text-red-600 dark:text-red-400"
      >
        <div className="flex items-center space-x-3 mb-4">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 className="text-xl font-semibold">Error</h3>
        </div>
        <p>{error}</p>
      </motion.div>
    );
  }

  if (!currentOrder) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white dark:bg-dark-800 rounded-xl shadow-lg p-8 border border-light-200 dark:border-dark-700 text-center"
      >
        <div className="flex flex-col items-center mb-6">
          <svg className="w-16 h-16 text-gray-400 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="text-xl font-semibold mb-2 text-dark-900 dark:text-white">Order not found.</p>
          <p className="text-dark-600 dark:text-light-400">The order you're looking for doesn't exist or may have been deleted.</p>
        </div>
        
        {orderId && (
          <div className="mt-8 p-6 border-t border-light-300 dark:border-dark-700 bg-gray-50 dark:bg-dark-900/40 rounded-b-xl">
            <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-3">Track Delivery</h3>
            <div className="mt-4 overflow-hidden rounded-xl shadow-md">
              <MapComponent orderId={orderId} />
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800';
      case 'PICKED_UP':
        return 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-400 border border-primary-200 dark:border-primary-800';
      case 'PENDING':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800';
      case 'CANCELLED':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800';
      default:
        return 'bg-light-200 dark:bg-dark-700 text-dark-800 dark:text-light-300 border border-light-300 dark:border-dark-600';
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="bg-white dark:bg-dark-800 rounded-xl shadow-lg border border-light-200 dark:border-dark-700 overflow-hidden"
    >
      {/* Order Status Header Bar */}
      <div className={`w-full py-3 px-6 flex items-center justify-between ${getStatusClass(currentOrder.status)}`}>
        <div className="flex items-center">
          <span className="font-medium">Status:</span>
          <span className="ml-2 font-bold">{currentOrder.status}</span>
        </div>
        <div className="text-sm">
          Order #{currentOrder.id.slice(-4).padStart(4, '0')}
        </div>
      </div>

      <div className="p-6 md:p-8">
        <motion.h2 
          variants={fadeInUp}
          className="text-2xl font-bold text-dark-900 dark:text-white mb-6 flex items-center"
        >
          <svg className="w-6 h-6 mr-2 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
          Order Details
        </motion.h2>

        <motion.div 
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <motion.div variants={fadeInUp} className="bg-gray-50 dark:bg-dark-900/40 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
              Order Information
            </h3>
            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="text-sm text-dark-500 dark:text-light-500">Order Number</span>
                <span className="text-dark-800 dark:text-light-200 font-medium">#{currentOrder.id.slice(-4).padStart(4, '0')}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-dark-500 dark:text-light-500">Ordered Date</span>
                <span className="text-dark-800 dark:text-light-200">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-dark-500 dark:text-light-500">Latest Arrival Time</span>
                <span className="text-dark-800 dark:text-light-200">{new Date(currentOrder.latest_time_of_arrival).toLocaleString(undefined, {
                  weekday: 'short',
                  month: 'short', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="bg-gray-50 dark:bg-dark-900/40 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Consumer Information
            </h3>
            <div className="space-y-4">
              <div className="flex flex-col">
                <span className="text-sm text-dark-500 dark:text-light-500">Name</span>
                <span className="text-dark-800 dark:text-light-200 font-medium">{currentOrder.consumer?.name || 'N/A'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-dark-500 dark:text-light-500">Email</span>
                <span className="text-dark-800 dark:text-light-200">{currentOrder.consumer?.email || 'N/A'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-dark-500 dark:text-light-500">Phone</span>
                <span className="text-dark-800 dark:text-light-200">{currentOrder.consumer?.phone_number || 'N/A'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-dark-500 dark:text-light-500">Status</span>
                <span className={`w-fit inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${currentOrder.consumer?.active_status ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border border-green-200 dark:border-green-800' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border border-red-200 dark:border-red-800'}`}>
                  {currentOrder.consumer?.active_status ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          variants={fadeInUp}
          className="mt-8 bg-gray-50 dark:bg-dark-900/40 rounded-xl p-6 shadow-sm"
        >
          <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
            </svg>
            Parcel Information
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="flex flex-col">
              <span className="text-sm text-dark-500 dark:text-light-500">Size</span>
              <span className="text-dark-800 dark:text-light-200 font-medium capitalize">{currentOrder.parcel?.size || 'N/A'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-dark-500 dark:text-light-500">Weight</span>
              <span className="text-dark-800 dark:text-light-200">{currentOrder.parcel?.weight ? `${currentOrder.parcel.weight} kg` : 'N/A'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-dark-500 dark:text-light-500">Dimensions</span>
              <span className="text-dark-800 dark:text-light-200">{
                currentOrder.parcel?.dimensions ? 
                `${currentOrder.parcel.dimensions.width || 0} × ${currentOrder.parcel.dimensions.height || 0} × ${currentOrder.parcel.dimensions.length || 0} cm` : 
                'N/A'
              }</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-dark-500 dark:text-light-500">Fragile</span>
              <span className="text-dark-800 dark:text-light-200">
                {currentOrder.parcel?.fragile ? (
                  <span className="inline-flex items-center text-amber-600 dark:text-amber-400">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    Yes
                  </span>
                ) : 'No'}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-dark-500 dark:text-light-500">Price</span>
              <span className="text-dark-800 dark:text-light-200 font-bold">${currentOrder.parcel?.price ? currentOrder.parcel.price.toFixed(2) : '0.00'}</span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div 
        variants={fadeInUp}
        className="bg-gray-50 dark:bg-dark-900/40 p-6 md:p-8 border-t border-light-200 dark:border-dark-700"
      >
        <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          Track Delivery
        </h3>
        <div className="overflow-hidden rounded-xl shadow-md">
          <MapComponent orderId={orderId} />
        </div>
      </motion.div>
    </motion.div>
  );
}; 