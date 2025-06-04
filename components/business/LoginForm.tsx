'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useBusinessContext } from '@/context/BusinessContext';
import { ValidationError } from '@/domain/errors/AppError';
import { GetBusinessOtpUseCase } from '@/application/useCases/business/GetBusinessOtpUseCase';
import { VerifyBusinessOtpUseCase } from '@/application/useCases/business/VerifyBusinessOtpUseCase';
import { BusinessAccountRepository } from '@/infrastructure/repositories/BusinessAccountRepository';
import { ApiClient } from '@/infrastructure/api/ApiClient';
import { storage } from '@/utils/storage';
import Link from 'next/link';

export const LoginForm: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useBusinessContext();

  // Check for existing OTP user ID on component mount
  useEffect(() => {
    const savedUserId = storage.getOtpUserId();
    if (savedUserId) {
      setStep(2);
    }
  }, []);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!phoneNumber.trim()) {
      setError('Phone number is required');
      return;
    }
    
    if (!password.trim()) {
      setError('Password is required');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const apiClient = new ApiClient();
      const businessRepo = new BusinessAccountRepository(apiClient);
      const getOtpUseCase = new GetBusinessOtpUseCase(businessRepo);
      
      const result = await getOtpUseCase.execute(phoneNumber, password);
      
      console.log('result', result);
      // Save user ID to localStorage
      storage.saveOtpUserId(result.id);
      setSuccessMessage(result.message || 'OTP sent successfully! Please check your phone.');
      setStep(2);
    } catch (error) {
      console.error('OTP request error:', error);
      if (error instanceof ValidationError) {
        setError(error.message);
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!otp.trim()) {
      setError('OTP is required');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const apiClient = new ApiClient();
      const businessRepo = new BusinessAccountRepository(apiClient);
      const verifyOtpUseCase = new VerifyBusinessOtpUseCase(businessRepo);
      
      const userId = storage.getOtpUserId();
      if (userId === null) {
        throw new Error('User ID not found. Please try logging in again.');
      }

      console.log('userId', userId, userId === undefined);
      
      const result = await verifyOtpUseCase.execute(userId, otp);
      
      // Clear the OTP user ID from storage after successful verification
      storage.removeOtpUserId();
      
      // Login with the token and business data
      login(result.token, result.business);
      
      // Redirect to the return URL or default to home
      const returnUrl = searchParams.get('returnUrl') || '/';
      router.push(returnUrl);
    } catch (error) {
      console.error('OTP verification error:', error);
      if (error instanceof ValidationError) {
        setError(error.message);
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white px-6 py-8 rounded-lg shadow-md max-w-md w-full mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Business Login</h1>
        <p className="text-gray-600 mt-2">Access your EasyDrop business account</p>
      </div>
      
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 text-green-600 p-3 rounded mb-4 text-sm">
          {successMessage}
        </div>
      )}
      
      {step === 1 ? (
        <form onSubmit={handleCredentialsSubmit} className="space-y-6">
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="+251978512230"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Sending OTP...' : 'Get OTP'}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/business/register" className="text-blue-600 hover:text-blue-500">
                Register here
              </Link>
            </p>
          </div>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="space-y-6">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
              Enter OTP
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter the OTP sent to your phone"
            />
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
          
          <div className="text-center">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Back to credentials
            </button>
          </div>
        </form>
      )}
    </div>
  );
}; 