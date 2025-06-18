'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useBusinessContext } from '@/context/BusinessContext';
import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useOrders } from '@/hooks/useOrders';
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

export default function OrdersPage() {
  const { business } = useBusinessContext();
  const { orders, loading, error, fetchOrders } = useOrders();

  /*
   * Status definitions used for building the UI tabs and filtering logic.
   *  - key       : string value kept in local component state
   *  - label     : user-facing text shown on the button
   *  - backend   : the status string returned by the API
   */
  const STATUS_TABS = [
    { key: 'pending', label: 'Pending', backend: 'PENDING' },
    { key: 'in_progress', label: 'In Progress', backend: 'IN_PROGRESS' },
    { key: 'picked_up', label: 'Picked Up', backend: 'PICKED_UP' },
    { key: 'completed', label: 'Completed', backend: 'DELIVERED' },
    { key: 'cancelled', label: 'Cancelled', backend: 'CANCELLED' },
    { key: 'failed', label: 'Failed', backend: 'FAILED' }
  ] as const;

  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  /*
   * Compute which tabs should be displayed based on the statuses that
   * actually exist in the list of orders returned by the backend.
   */
  const availableStatusTabs = useMemo(() => {
    if (!orders || orders.length === 0) return [];
    const present = new Set(orders.map((o) => (o.status ?? '').toUpperCase()));
    return STATUS_TABS.filter((tab) => present.has(tab.backend));
  }, [orders]);

  useEffect(() => {
    if (business?.id) {
      fetchOrders();
    }
  }, [business?.id, fetchOrders]);

  useEffect(() => {
    // Filter orders whenever list of orders or selected tab changes
    if (selectedTab === 'all') {
      setFilteredOrders(orders);
      return;
    }

    const match = STATUS_TABS.find((t) => t.key === selectedTab);
    if (match) {
      setFilteredOrders(orders.filter((o) => (o.status ?? '').toUpperCase() === match.backend));
    } else {
      setFilteredOrders(orders);
    }
  }, [orders, selectedTab]);

  const getOrderStatusClass = (status: string | undefined): string => {
    if (!status) return 'bg-gray-600 text-white';
    
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
      case 'failed':
        return 'bg-red-600 text-white';
      default:
        return 'bg-gray-600 text-white';
    }
  };

  const formatDate = (date: Date | string): string => {
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString();
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <ProtectedRoute>
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="container mx-auto py-12 px-4"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <motion.div variants={fadeInUp}>
            <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-2">Orders</h1>
            <p className="text-dark-600 dark:text-light-400">
              Manage all your delivery orders in one place
            </p>
          </motion.div>
          <motion.div 
            variants={fadeInUp}
            className="mt-4 md:mt-0"
          >
            <Link
              href="/orders/create"
              className="btn-primary inline-flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Create Order
            </Link>
          </motion.div>
        </div>
        
        <motion.div 
          variants={fadeInUp}
          className="bg-white dark:bg-dark-800 border border-light-300 dark:border-dark-700 rounded-lg overflow-hidden"
        >
          <div className="border-b border-light-300 dark:border-dark-700">
            <nav className="flex overflow-x-auto">
              {/* Always show "All" tab */}
              <button
                onClick={() => setSelectedTab('all')}
                className={`px-6 py-4 text-sm font-medium transition-colors ${
                  selectedTab === 'all'
                    ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'text-dark-500 hover:text-dark-700 dark:text-light-400 dark:hover:text-white'
                }`}
              >
                All Orders
              </button>

              {availableStatusTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key as any)}
                  className={`px-6 py-4 text-sm font-medium transition-colors ${
                    selectedTab === tab.key
                      ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
                      : 'text-dark-500 hover:text-dark-700 dark:text-light-400 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-16 px-6 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <PulseLoader color="#3B82F6" size={15} margin={2} />
                  <p className="text-dark-500 dark:text-light-400 mt-2">Loading orders...</p>
                </div>
              </div>
            ) : error ? (
              <div className="py-16 px-6 text-center">
                <div className="text-red-500 dark:text-red-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-dark-900 dark:text-white">Error Loading Orders</h3>
                <p className="text-dark-500 dark:text-light-400 mt-2">{error}</p>
                <motion.button 
                  onClick={fetchOrders}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="mt-4 btn-primary"
                >
                  Try Again
                </motion.button>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="py-16 px-6 text-center">
                <svg className="mx-auto h-12 w-12 text-dark-400 dark:text-light-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                <h3 className="mt-2 text-lg font-medium text-dark-900 dark:text-white">No orders yet</h3>
                <p className="mt-1 text-dark-500 dark:text-light-400">
                  Get started by creating your first delivery order.
                </p>
                <div className="mt-6">
                  <Link
                    href="/orders/create"
                    className="btn-primary"
                  >
                    Create Order
                  </Link>
                </div>
              </div>
            ) : (
              <motion.div 
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="dark:bg-dark-800"
              >
                <table className="min-w-full divide-y divide-light-300 dark:divide-dark-700">
                  <thead className="bg-light-100 dark:bg-dark-900">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-500 dark:text-light-400 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-500 dark:text-light-400 uppercase tracking-wider">
                        Consumer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-500 dark:text-light-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-500 dark:text-light-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-dark-500 dark:text-light-400 uppercase tracking-wider">
                        Delivery
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-light-300 dark:divide-dark-700">
                    {filteredOrders.map((order, index) => {
                      // Define row background based on index, ensuring proper dark mode support
                      const rowBgClass = index % 2 === 0 
                        ? "bg-white dark:bg-dark-800"
                        : "bg-light-50 dark:bg-dark-700";
                        
                      return (
                        <motion.tr 
                          key={order.id}
                          variants={fadeInUp}
                          className={`${rowBgClass} hover:bg-light-100 dark:hover:bg-dark-600 transition-colors`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-dark-900 dark:text-white">
                            {order.id.substring(0, 8)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-600 dark:text-light-300">
                            {order.consumer?.first_name + ' ' + order.consumer?.last_name || 'Consumer'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase ${getOrderStatusClass(order.status)}`}>
                              {order.status || 'Unknown'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-600 dark:text-light-300">
                            {formatDate(order.latest_time_of_arrival)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-dark-600 dark:text-light-300">
                            {order.delivery_job_id ? 'Assigned' : 'Unassigned'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link 
                              href={`/orders/${order.id}`} 
                              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
                            >
                              View
                            </Link>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </ProtectedRoute>
  );
} 