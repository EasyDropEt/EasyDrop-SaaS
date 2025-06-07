import React, { useEffect } from 'react';
import { useOrderContext } from '@/context/OrderContext';
import { Order } from '@/domain/entities/Order';
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
      <div className="flex justify-center items-center p-12">
        <div className="flex flex-col items-center space-y-4">
          <PulseLoader color="#3B82F6" size={15} margin={2} />
          <p className="text-dark-500 dark:text-light-400 mt-2">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card p-6 text-red-600 dark:text-red-400"
      >
        {error}
      </motion.div>
    );
  }

  if (!currentOrder) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card p-12 text-center text-dark-600 dark:text-light-400"
      >
        Order not found.
      </motion.div>
    );
  }

  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400';
      case 'PICKED_UP':
        return 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-400';
      case 'PENDING':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400';
      case 'CANCELLED':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400';
      default:
        return 'bg-light-200 dark:bg-dark-700 text-dark-800 dark:text-light-300';
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="card"
    >
      <div className="p-6">
        <motion.h2 
          variants={fadeInUp}
          className="text-2xl font-bold text-dark-900 dark:text-white mb-6"
        >
          Order Details
        </motion.h2>
        
        <motion.div 
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <motion.div variants={fadeInUp}>
            <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-3 pb-2 border-b border-light-300 dark:border-dark-700">Order Information</h3>
            <div className="space-y-3">
              <p className="text-dark-800 dark:text-light-200">
                <span className="font-medium text-dark-900 dark:text-white">Order ID:</span> {currentOrder.id}
              </p>
              <p className="text-dark-800 dark:text-light-200">
                <span className="font-medium text-dark-900 dark:text-white">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusClass(currentOrder.status)}`}>
                  {currentOrder.status}
                </span>
              </p>
              <p className="text-dark-800 dark:text-light-200">
                <span className="font-medium text-dark-900 dark:text-white">Bill ID:</span> {currentOrder.bill_id}
              </p>
              <p className="text-dark-800 dark:text-light-200">
                <span className="font-medium text-dark-900 dark:text-white">Delivery Job ID:</span> {currentOrder.delivery_job_id}
              </p>
              <p className="text-dark-800 dark:text-light-200">
                <span className="font-medium text-dark-900 dark:text-white">Latest Arrival Time:</span> {new Date(currentOrder.latest_time_of_arrival).toLocaleString()}
              </p>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-3 pb-2 border-b border-light-300 dark:border-dark-700">Consumer Information</h3>
            <div className="space-y-3">
              <p className="text-dark-800 dark:text-light-200">
                <span className="font-medium text-dark-900 dark:text-white">Name:</span> {currentOrder.consumer?.name || 'N/A'}
              </p>
              <p className="text-dark-800 dark:text-light-200">
                <span className="font-medium text-dark-900 dark:text-white">Email:</span> {currentOrder.consumer?.email || 'N/A'}
              </p>
              <p className="text-dark-800 dark:text-light-200">
                <span className="font-medium text-dark-900 dark:text-white">Phone:</span> {currentOrder.consumer?.phone_number || 'N/A'}
              </p>
              <p className="text-dark-800 dark:text-light-200">
                <span className="font-medium text-dark-900 dark:text-white">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${currentOrder.consumer?.active_status ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'}`}>
                  {currentOrder.consumer?.active_status ? 'Active' : 'Inactive'}
                </span>
              </p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          variants={fadeInUp}
          className="mt-6"
        >
          <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-3 pb-2 border-b border-light-300 dark:border-dark-700">Parcel Information</h3>
          <div className="space-y-3">
            <p className="text-dark-800 dark:text-light-200">
              <span className="font-medium text-dark-900 dark:text-white">Size:</span> 
              <span className="capitalize">{currentOrder.parcel?.size || 'N/A'}</span>
            </p>
            <p className="text-dark-800 dark:text-light-200">
              <span className="font-medium text-dark-900 dark:text-white">Weight:</span> {currentOrder.parcel?.weight ? `${currentOrder.parcel.weight} kg` : 'N/A'}
            </p>
            <p className="text-dark-800 dark:text-light-200">
              <span className="font-medium text-dark-900 dark:text-white">Dimensions:</span> {
                currentOrder.parcel?.dimensions ? 
                `${currentOrder.parcel.dimensions.width || 0} x ${currentOrder.parcel.dimensions.height || 0} x ${currentOrder.parcel.dimensions.length || 0} cm` : 
                'N/A'
              }
            </p>
            <p className="text-dark-800 dark:text-light-200">
              <span className="font-medium text-dark-900 dark:text-white">Fragile:</span> {currentOrder.parcel?.fragile ? 'Yes' : 'No'}
            </p>
            <p className="text-dark-800 dark:text-light-200">
              <span className="font-medium text-dark-900 dark:text-white">Price:</span> ${currentOrder.parcel?.price ? currentOrder.parcel.price.toFixed(2) : '0.00'}
            </p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}; 