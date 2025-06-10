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
import { motion } from 'framer-motion';

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="card p-8 max-w-md w-full mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-2">Business Login</h1>
        <p className="text-dark-500 dark:text-light-400">Access your EasyDrop business account</p>
      </div>
      
      {error && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6 text-sm"
        >
          {error}
        </motion.div>
      )}
      
      {successMessage && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-lg mb-6 text-sm"
        >
          {successMessage}
        </motion.div>
      )}
      
      {step === 1 ? (
        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={handleCredentialsSubmit} 
          className="space-y-6"
        >
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-dark-700 dark:text-light-300 mb-2">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="input"
              placeholder="+251978512230"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-dark-700 dark:text-light-300 mb-2">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
          </div>
          
          <div>
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`btn-primary w-full ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending OTP...
                </span>
              ) : 'Get OTP'}
            </motion.button>
          </div>
          
          <div className="text-center pt-4">
            <p className="text-sm text-dark-600 dark:text-light-400">
              Don't have an account?{' '}
              <Link href="/business/register" className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
                Register here
              </Link>
            </p>
          </div>
        </motion.form>
      ) : (
        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={handleOtpSubmit} 
          className="space-y-6"
        >
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-dark-700 dark:text-light-300 mb-2">
              Enter OTP
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="input"
              placeholder="Enter the OTP sent to your phone"
            />
          </div>
          
          <div>
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`btn-primary w-full ${
                isLoading ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : 'Verify OTP'}
            </motion.button>
          </div>
          
          <div className="text-center pt-4">
            <motion.button
              type="button"
              onClick={() => setStep(1)}
              whileHover={{ scale: 1.05 }}
              className="text-sm text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 font-medium"
            >
              Back to credentials
            </motion.button>
          </div>
        </motion.form>
      )}
    </motion.div>
  );
}; 