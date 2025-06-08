"use client";

import { LoginForm } from '@/components/business/LoginForm';
import { Metadata } from 'next';
import { motion } from 'framer-motion';
import { Suspense } from 'react';

export default function BusinessLoginPage() {
  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center px-4 py-16 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <motion.div
          animate={{ 
            y: [0, 10, 0],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ 
            repeat: Infinity,
            duration: 8
          }}
          className="w-full h-full bg-primary-500 opacity-5 dark:opacity-10 blur-3xl rounded-full translate-y-1/2"
        />
      </div>
      
      <div className="container mx-auto max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-dark-900 dark:text-white mb-2">Welcome Back</h1>
          <p className="text-dark-600 dark:text-light-400">Login to your EasyDrop business account</p>
        </motion.div>
        
        <Suspense fallback={<div className="text-center p-4">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
} 