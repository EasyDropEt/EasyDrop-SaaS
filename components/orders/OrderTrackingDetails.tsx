'use client';

import { useTrackOrder } from '@/hooks/useTrackOrder';
import { useState, useEffect } from 'react';
import { PulseLoader } from 'react-spinners';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapComponent } from './map';

// Format currency utility function
const formatCurrency = (amount: number, currencyCode: string = 'USD'): string => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
};

interface OrderTrackingDetailsProps {
  orderId: string;
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.4 }
  }
};

export const OrderTrackingDetails: React.FC<OrderTrackingDetailsProps> = ({ orderId }) => {
  const { order, driver, loading, error } = useTrackOrder(orderId);
  const [activeTab, setActiveTab] = useState<'details' | 'map'>('details');

  if (loading && !order) {
    return (
      <div className="flex justify-center items-center py-12">
        <PulseLoader color="#3B82F6" size={12} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700 dark:text-yellow-400">Order not found</p>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusBadgeClass = (status: string) => {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'delivered':
      case 'completed':
        return 'bg-green-600 text-white';
      case 'picked_up':
      case 'in_progress':
        return 'bg-blue-600 text-white';
      case 'pending':
        return 'bg-yellow-500 text-black';
      case 'cancelled':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="bg-white dark:bg-dark-800 shadow-sm rounded-lg overflow-hidden border border-gray-200 dark:border-dark-700"
    >
      <div className="border-b border-gray-200 dark:border-dark-700">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('details')}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === 'details'
                ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            Order Details
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`py-4 px-6 text-sm font-medium ${
              activeTab === 'map'
                ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white'
            }`}
          >
            {driver ? 'Track Delivery' : 'Delivery Map'}
          </button>
        </nav>
      </div>

      {activeTab === 'details' ? (
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Order #{order.id.substring(0, 8)}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Created: {formatDate(order.latest_time_of_delivery || order.latest_time_of_arrival.toString())}
              </p>
            </div>
            <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${getStatusBadgeClass(order.status || order.order_status || '')}`}>
              {order.status || order.order_status || 'Unknown'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="border border-gray-200 dark:border-dark-700 rounded-lg p-4">
              <h2 className="font-medium text-gray-900 dark:text-white mb-3">Customer Information</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                <span className="font-medium">Name:</span> {
                  order.consumer.first_name && order.consumer.last_name 
                    ? `${order.consumer.first_name} ${order.consumer.last_name}`
                    : order.consumer.name || 'Customer'
                }
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                <span className="font-medium">Phone:</span> {order.consumer.phone_number}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                <span className="font-medium">Email:</span> {order.consumer.email}
              </p>
              {order.consumer.location && (
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                  <span className="font-medium">Address:</span> {order.consumer.location.address}
                </p>
              )}
            </div>

            <div className="border border-gray-200 dark:border-dark-700 rounded-lg p-4">
              <h2 className="font-medium text-gray-900 dark:text-white mb-3">Package Details</h2>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                <span className="font-medium">Size:</span> {order.parcel.size}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                <span className="font-medium">Weight:</span> {order.parcel.weight} kg
              </p>
              {(order.parcel.length && order.parcel.width && order.parcel.height) ? (
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                  <span className="font-medium">Dimensions:</span> {order.parcel.length}cm × {order.parcel.width}cm × {order.parcel.height}cm
                </p>
              ) : order.parcel.dimensions ? (
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                  <span className="font-medium">Dimensions:</span> {order.parcel.dimensions.length}cm × {order.parcel.dimensions.width}cm × {order.parcel.dimensions.height}cm
                </p>
              ) : null}
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                <span className="font-medium">Fragile:</span> {order.parcel.fragile ? 'Yes' : 'No'}
              </p>
            </div>
          </div>

          {/* Driver Information (if assigned) */}
          {driver && (
            <div className="border border-gray-200 dark:border-dark-700 rounded-lg p-4">
              <h2 className="font-medium text-gray-900 dark:text-white mb-3">Driver Information</h2>
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 bg-gray-200 dark:bg-dark-600 rounded-full flex items-center justify-center">
                  {driver.profile_image ? (
                    <img src={driver.profile_image} alt={`${driver.first_name} ${driver.last_name}`} className="h-10 w-10 rounded-full" />
                  ) : (
                    <svg className="h-6 w-6 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-gray-900 dark:text-white font-medium">
                    {driver.first_name} {driver.last_name}
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {driver.phone_number}
                  </p>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Vehicle Details</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {driver.car.make} {driver.car.model} ({driver.car.year})
                  </p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {driver.car.color}, License: {driver.car.license_plate_number}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Current Location</h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">{driver.location.address}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6 flex space-x-4">
            <Link
              href="/orders"
              className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-700 hover:bg-gray-50 dark:hover:bg-dark-600 focus:outline-none"
            >
              Back to Orders
            </Link>
            <button
              onClick={() => setActiveTab('map')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-600 focus:outline-none"
            >
              {driver ? 'Track Delivery' : 'View Map'}
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6">
          <MapComponent orderId={orderId} />
        </div>
      )}
    </motion.div>
  );
}; 