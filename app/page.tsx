'use client';

import { useBusinessContext } from '@/context/BusinessContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const { isAuthenticated, business, isLoading } = useBusinessContext();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      {isAuthenticated ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Welcome back, {business?.business_name}!
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h2 className="text-lg font-semibold text-blue-800 mb-2">Delivery Management</h2>
              <p className="text-blue-600 mb-4">Create and manage your deliveries with ease.</p>
              <Link
                href="/orders/create"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Create Order
              </Link>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg border border-green-100">
              <h2 className="text-lg font-semibold text-green-800 mb-2">Track Deliveries</h2>
              <p className="text-green-600 mb-4">Monitor delivery status in real-time.</p>
              <Link
                href="/orders"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
              >
                View Orders
              </Link>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-100">
              <h2 className="text-lg font-semibold text-purple-800 mb-2">Performance Reports</h2>
              <p className="text-purple-600 mb-4">Analyze your delivery performance metrics.</p>
              <Link
                href="/reports"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700"
              >
                View Reports
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              Delivery Management Solutions for Your Business
            </h1>
            <p className="text-xl text-gray-600">
              EasyDrop helps businesses optimize their delivery operations with a simple, powerful platform.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/business/register"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Get Started
              </Link>
              <Link
                href="/business/login"
                className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Log In
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery Management</h2>
              <p className="text-gray-600">
                Create and manage delivery orders quickly and efficiently.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Real-Time Tracking</h2>
              <p className="text-gray-600">
                Monitor your deliveries in real-time and keep customers informed.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-blue-600 mb-4">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Performance Analytics</h2>
              <p className="text-gray-600">
                Gain insights into your delivery performance and optimize operations.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
