import React, { useEffect } from 'react';
import { useOrderContext } from '@/context/OrderContext';
import { Order } from '@/domain/entities/Order';
import Link from 'next/link';

interface OrderListProps {
  // Remove businessId as it's no longer needed
}

export const OrderList: React.FC<OrderListProps> = () => {
  const { orders, loading, error, fetchOrders } = useOrderContext();

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) {
    return <div className="flex justify-center p-8">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (orders.length === 0) {
    return <div className="text-center p-8">No orders found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left">Order ID</th>
            <th className="py-3 px-4 text-left">Consumer</th>
            <th className="py-3 px-4 text-left">Status</th>
            <th className="py-3 px-4 text-left">Delivery Time</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: Order) => (
            <tr key={order.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">{order.id}</td>
              <td className="py-3 px-4">{order.consumer.name}</td>
              <td className="py-3 px-4">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  order.status === 'DELIVERED' 
                    ? 'bg-green-100 text-green-800' 
                    : order.status === 'PICKED_UP' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {order.status}
                </span>
              </td>
              <td className="py-3 px-4">
                {new Date(order.latest_time_of_arrival).toLocaleString()}
              </td>
              <td className="py-3 px-4">
                <Link 
                  href={`/orders/${order.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 