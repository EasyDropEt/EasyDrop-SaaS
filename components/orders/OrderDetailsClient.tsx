'use client';

import React, { useEffect } from 'react';
import { OrderProvider } from '@/context/OrderContext';
import { OrderDetails } from '@/components/orders/OrderDetails';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

interface OrderDetailsClientProps {
  orderId: string;
}

export function OrderDetailsClient({ orderId }: OrderDetailsClientProps) {
  const { isAuthenticated, loading, requireAuth } = useAuth();
  
  // Check if user is authenticated
  useEffect(() => {
    if (!loading) {
      requireAuth();
    }
  }, [loading, requireAuth]);
  
  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-4 text-center">
          Checking authentication status...
        </div>
      </div>
    );
  }
  
  // Only render content if authenticated
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-4 text-center bg-yellow-100 text-yellow-800 rounded">
          <p className="font-semibold mb-2">Authentication Required</p>
          <p className="mb-4">You need to be logged in to view order details.</p>
          <Link href="/business/login" className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Log in
          </Link>
        </div>
      </div>
    );
  }

  return (
    <OrderProvider>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/orders" className="text-blue-600 hover:text-blue-800">
            &larr; Back to Orders
          </Link>
        </div>
        
        <OrderDetails orderId={orderId} />
      </div>
    </OrderProvider>
  );
} 