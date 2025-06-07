'use client';

import React, { use } from 'react';
import { OrderProvider } from '@/context/OrderContext';
import { OrderDetails } from '@/components/orders/OrderDetails';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface OrderDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      duration: 0.6 
    }
  }
};

export default function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { id } = use(params);

  return (
    <OrderProvider>
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="container mx-auto px-4 py-8"
      >
        <div className="mb-6">
          <Link 
            href="/orders" 
            className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 inline-flex items-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Back to Orders
          </Link>
        </div>
        
        <OrderDetails orderId={id} />
      </motion.div>
    </OrderProvider>
  );
} 