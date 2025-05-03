import React, { useEffect } from 'react';
import { useOrderContext } from '@/context/OrderContext';
import { Order } from '@/domain/entities/Order';

interface OrderDetailsProps {
  orderId: string;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({ orderId }) => {
  const { currentOrder, loading, error, fetchOrderById } = useOrderContext();

  useEffect(() => {
    fetchOrderById(orderId);
  }, [orderId, fetchOrderById]);

  if (loading) {
    return <div className="flex justify-center p-8">Loading order details...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!currentOrder) {
    return <div className="text-center p-8">Order not found.</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-6">Order Details</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-3">Order Information</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Order ID:</span> {currentOrder.id}</p>
            <p><span className="font-medium">Status:</span> 
              <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                currentOrder.status === 'DELIVERED' 
                  ? 'bg-green-100 text-green-800' 
                  : currentOrder.status === 'PICKED_UP' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {currentOrder.status}
              </span>
            </p>
            <p><span className="font-medium">Bill ID:</span> {currentOrder.bill_id}</p>
            <p><span className="font-medium">Delivery Job ID:</span> {currentOrder.delivery_job_id}</p>
            <p><span className="font-medium">Latest Arrival Time:</span> {new Date(currentOrder.latest_time_of_arrival).toLocaleString()}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Consumer Information</h3>
          <div className="space-y-2">
            <p><span className="font-medium">Name:</span> {currentOrder.consumer.name}</p>
            <p><span className="font-medium">Email:</span> {currentOrder.consumer.email}</p>
            <p><span className="font-medium">Phone:</span> {currentOrder.consumer.phone_number}</p>
            <p><span className="font-medium">Status:</span> {currentOrder.consumer.active_status ? 'Active' : 'Inactive'}</p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Parcel Information</h3>
        <div className="space-y-2">
          <p><span className="font-medium">Size:</span> {currentOrder.parcel.size}</p>
          <p><span className="font-medium">Weight:</span> {currentOrder.parcel.weight} kg</p>
          <p><span className="font-medium">Dimensions:</span> {currentOrder.parcel.dimensions.width} x {currentOrder.parcel.dimensions.height} x {currentOrder.parcel.dimensions.length} cm</p>
          <p><span className="font-medium">Fragile:</span> {currentOrder.parcel.fragile ? 'Yes' : 'No'}</p>
          <p><span className="font-medium">Price:</span> ${currentOrder.parcel.price.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}; 