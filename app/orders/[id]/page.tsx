'use client';

import React from 'react';
import { OrderProvider } from '@/context/OrderContext';
import { OrderDetails } from '@/components/orders/OrderDetails';
import Link from 'next/link';

interface OrderDetailsPageProps {
  params: {
    id: string;
  };
}

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { id } = params;

  return (
    <OrderProvider>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/orders" className="text-blue-600 hover:text-blue-800">
            &larr; Back to Orders
          </Link>
        </div>
        
        <OrderDetails orderId={id} />
      </div>
    </OrderProvider>
  );
} 