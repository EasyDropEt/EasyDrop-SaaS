'use client';

import { useBusinessContext } from '@/context/BusinessContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Metadata } from 'next';
import { useRouter } from 'next/navigation';

export default function BusinessProfilePage() {
  const { business } = useBusinessContext();
  const router = useRouter();

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">Business Profile</h1>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="bg-gray-100 p-6 rounded-lg">
                  <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-600">
                      {business?.business_name?.charAt(0) || 'B'}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold text-center text-gray-900 mb-2">
                    {business?.business_name}
                  </h2>
                  
                  <div className="border-t border-gray-200 mt-4 pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Status</span>
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </div>
                    
                    <button
                      onClick={() => router.push('/orders')}
                      className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                    >
                      View Orders
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                    Business Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Business Name</label>
                      <div className="text-gray-900">{business?.business_name}</div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                      <div className="text-gray-900">{business?.email}</div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                      <div className="text-gray-900">{business?.phone_number}</div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                    Owner Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">First Name</label>
                      <div className="text-gray-900">{business?.owner_first_name}</div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
                      <div className="text-gray-900">{business?.owner_last_name}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                    Location Information
                  </h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Address</label>
                    <div className="text-gray-900">{business?.location?.address}</div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">City</label>
                      <div className="text-gray-900">{business?.location?.city}</div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Postal Code</label>
                      <div className="text-gray-900">{business?.location?.postal_code}</div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Country</label>
                      <div className="text-gray-900">{business?.location?.country}</div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end space-x-4">
                  <button
                    onClick={() => router.push('/business/edit')}
                    className="bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-50 transition-colors"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => router.push('/business/settings')}
                    className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                  >
                    Account Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
} 