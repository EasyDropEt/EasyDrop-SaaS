'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useBusinessContext } from '@/context/BusinessContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useOrders } from '@/hooks/useOrders';
import { Order } from '@/domain/entities/Order';

export default function OrdersPage() {
  const { business } = useBusinessContext();
  const { orders, loading, error, fetchOrders } = useOrders();
  const [selectedTab, setSelectedTab] = useState('all');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (business?.id) {
      fetchOrders();
    }
  }, [business?.id, fetchOrders]);

  useEffect(() => {
    // Filter orders based on selected tab
    if (selectedTab === 'all') {
      setFilteredOrders(orders);
    } else {
      const statusMap: Record<string, string> = {
        'pending': 'PENDING',
        'in_progress': 'PICKED_UP', 
        'completed': 'DELIVERED',
        'cancelled': 'CANCELLED'
      };
      
      const targetStatus = statusMap[selectedTab];
      if (targetStatus) {
        const filtered = orders.filter(order => order.status === targetStatus);
        setFilteredOrders(filtered);
      } else {
        setFilteredOrders(orders);
      }
    }
  }, [orders, selectedTab]);

  const getOrderStatusClass = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'picked_up':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
      <div className="container mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
            <p className="text-gray-600 mt-2">
              Manage all your delivery orders in one place
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              href="/orders/create"
              className="inline-flex items-center justify-center px-5 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Create Order
            </Link>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto">
              <button
                onClick={() => setSelectedTab('all')}
                className={`px-6 py-4 text-sm font-medium ${
                  selectedTab === 'all'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                All Orders
              </button>
              <button
                onClick={() => setSelectedTab('pending')}
                className={`px-6 py-4 text-sm font-medium ${
                  selectedTab === 'pending'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => setSelectedTab('in_progress')}
                className={`px-6 py-4 text-sm font-medium ${
                  selectedTab === 'in_progress'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => setSelectedTab('completed')}
                className={`px-6 py-4 text-sm font-medium ${
                  selectedTab === 'completed'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setSelectedTab('cancelled')}
                className={`px-6 py-4 text-sm font-medium ${
                  selectedTab === 'cancelled'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Cancelled
              </button>
            </nav>
          </div>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-12 px-6 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                <p className="mt-4 text-gray-500">Loading orders...</p>
              </div>
            ) : error ? (
              <div className="py-12 px-6 text-center">
                <div className="text-red-500 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">Error Loading Orders</h3>
                <p className="text-gray-500 mt-2">{error}</p>
                <button 
                  onClick={fetchOrders}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="py-12 px-6 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No orders yet</h3>
                <p className="mt-1 text-gray-500">
                  Get started by creating your first delivery order.
                </p>
                <div className="mt-6">
                  <Link
                    href="/orders/create"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Create Order
                  </Link>
                </div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Delivery
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id.substring(0, 8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.consumer?.name || 'Customer'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getOrderStatusClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.latest_time_of_arrival)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.delivery_job_id ? 'Assigned' : 'Unassigned'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link href={`/orders/${order.id}`} className="text-blue-600 hover:text-blue-900">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 