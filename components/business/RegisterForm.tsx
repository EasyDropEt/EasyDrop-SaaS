'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BusinessRegistration } from '@/domain/entities/Business';
import { CreateBusinessAccountUseCase } from '@/application/useCases/business/CreateBusinessAccountUseCase';
import { BusinessAccountRepository } from '@/infrastructure/repositories/BusinessAccountRepository';
import { ApiClient } from '@/infrastructure/api/ApiClient';
import { ValidationError } from '@/domain/errors/AppError';
import { GetBusinessOtpUseCase } from '@/application/useCases/business/GetBusinessOtpUseCase';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { LocationPicker, SelectedLocation } from '@/components/common/LocationPicker';

const initialFormState: Omit<BusinessRegistration, 'location'> & { 
  address: string;
  city: string;
  postal_code: string;
  country: string;
  password: string;
  password_confirmation: string;
  latitude: number;
  longitude: number;
} = {
  business_name: '',
  owner_first_name: '',
  owner_last_name: '',
  email: '',
  phone_number: '',
  address: '',
  city: '',
  postal_code: '',
  country: '',
  latitude: 0,
  longitude: 0,
  password: '',
  password_confirmation: '',
};

interface RegisterBusinessPayload {
  business_name: string;
  owner_first_name: string;
  owner_last_name: string;
  email: string;
  phone_number: string;
  location: {
    address: string;
    postal_code: string;
    city: string;
    country: string;
    latitude: number;
    longitude: number;
  };
  billing_details: [{}];
  password: string;
}

export const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required field validation
    const requiredFields = [
      'business_name', 'owner_first_name', 'owner_last_name', 
      'email', 'phone_number', 'address', 'city', 'postal_code', 'country',
      'password', 'password_confirmation'
    ];
    
    requiredFields.forEach((field) => {
      const value = formData[field as keyof typeof formData];
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        newErrors[field] = 'This field is required';
      }
    });
    
    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation (simple check)
    if (formData.phone_number && !/^\+?[0-9() -]{8,}$/.test(formData.phone_number)) {
      newErrors.phone_number = 'Please enter a valid phone number';
    }
    
    // Password validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }
    
    // Password confirmation validation
    if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = 'Passwords do not match';
    }
    
    // Latitude & Longitude validation specific to Addis Ababa range
    if (formData.latitude < 8.8 || formData.latitude > 9.1) {
      newErrors.latitude = 'Latitude must be between 8.8 and 9.1 for Addis Ababa';
    }
    if (formData.longitude < 38.6 || formData.longitude > 39.0) {
      newErrors.longitude = 'Longitude must be between 38.6 and 39.0 for Addis Ababa';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    setSuccessMessage('');
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const businessPayload: RegisterBusinessPayload = {
        business_name: formData.business_name,
        owner_first_name: formData.owner_first_name,
        owner_last_name: formData.owner_last_name,
        email: formData.email,
        phone_number: formData.phone_number,
        location: {
          address: formData.address,
          city: formData.city,
          postal_code: formData.postal_code,
          country: formData.country,
          latitude: formData.latitude,
          longitude: formData.longitude,
        },
        billing_details: [{}],
        password: formData.password
      };
      
      const apiClient = new ApiClient();
      const businessRepo = new BusinessAccountRepository(apiClient);
      const createBusinessUseCase = new CreateBusinessAccountUseCase(businessRepo);
      
      await createBusinessUseCase.execute(businessPayload);
      
      // Account created, now request an OTP to login
      const getOtpUseCase = new GetBusinessOtpUseCase(businessRepo);
      const otpResult = await getOtpUseCase.execute(formData.phone_number, formData.password);
      
      setSuccessMessage(`Business account created successfully! Please check your phone for verification code to login. Your user ID is: ${otpResult.id}`);
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        router.push('/business/login');
      }, 3000);
    } catch (error) {
      console.error('Registration error:', error);
      if (error instanceof ValidationError) {
        setGeneralError(error.message);
      } else if (error instanceof Error) {
        setGeneralError(error.message);
      } else {
        setGeneralError('An unexpected error occurred. Please try again.');
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
        <h1 className="text-3xl font-bold text-dark-900 dark:text-white mb-2">Create Business Account</h1>
        <p className="text-dark-500 dark:text-light-400">Start managing your deliveries with EasyDrop</p>
      </div>
      
      {generalError && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg mb-6 text-sm"
        >
          {generalError}
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
      
      <motion.form 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onSubmit={handleSubmit} 
        className="space-y-6"
      >
        <div>
          <label htmlFor="business_name" className="block text-sm font-medium text-dark-700 dark:text-light-300 mb-2">
            Business Name
          </label>
          <input
            id="business_name"
            name="business_name"
            type="text"
            value={formData.business_name}
            onChange={handleChange}
            className={`input ${
              errors.business_name ? 'border-red-300 dark:border-red-500 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          />
          {errors.business_name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.business_name}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="owner_first_name" className="block text-sm font-medium text-dark-700 dark:text-light-300 mb-2">
              First Name
            </label>
            <input
              id="owner_first_name"
              name="owner_first_name"
              type="text"
              value={formData.owner_first_name}
              onChange={handleChange}
              className={`input ${
                errors.owner_first_name ? 'border-red-300 dark:border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
            />
            {errors.owner_first_name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.owner_first_name}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="owner_last_name" className="block text-sm font-medium text-dark-700 dark:text-light-300 mb-2">
              Last Name
            </label>
            <input
              id="owner_last_name"
              name="owner_last_name"
              type="text"
              value={formData.owner_last_name}
              onChange={handleChange}
              className={`input ${
                errors.owner_last_name ? 'border-red-300 dark:border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
            />
            {errors.owner_last_name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.owner_last_name}</p>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-dark-700 dark:text-light-300 mb-2">
            Email Address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`input ${
              errors.email ? 'border-red-300 dark:border-red-500 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="phone_number" className="block text-sm font-medium text-dark-700 dark:text-light-300 mb-2">
            Phone Number
          </label>
          <input
            id="phone_number"
            name="phone_number"
            type="tel"
            value={formData.phone_number}
            onChange={handleChange}
            className={`input ${
              errors.phone_number ? 'border-red-300 dark:border-red-500 focus:border-red-500 focus:ring-red-500' : ''
            }`}
            placeholder="+251978512230"
          />
          {errors.phone_number && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone_number}</p>
          )}
        </div>

        {/* Location Picker */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-dark-900 dark:text-white mb-2">Select Your Business Location</h2>
          <LocationPicker onSelect={(loc: SelectedLocation) => {
            setFormData((prev) => ({
              ...prev,
              address: loc.address,
              city: loc.city,
              postal_code: loc.postal_code,
              country: loc.country,
              latitude: loc.latitude,
              longitude: loc.longitude,
            }));

            // Clear any existing validation errors related to location once a valid point is selected
            setErrors((prev) => {
              const newErrors = { ...prev };
              delete newErrors.address;
              delete newErrors.city;
              delete newErrors.postal_code;
              delete newErrors.country;
              return newErrors;
            });
          }} />
          {errors.latitude && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.latitude}</p>
          )}
          {errors.longitude && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.longitude}</p>
          )}
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-dark-700 dark:text-light-300 mb-2">
            Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            className={`input ${
              errors.address ? 'border-red-300 dark:border-red-500 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.address}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-dark-700 dark:text-light-300 mb-2">
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              className={`input ${
                errors.city ? 'border-red-300 dark:border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.city}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="postal_code" className="block text-sm font-medium text-dark-700 dark:text-light-300 mb-2">
              Postal Code
            </label>
            <input
              id="postal_code"
              name="postal_code"
              type="text"
              value={formData.postal_code}
              onChange={handleChange}
              className={`input ${
                errors.postal_code ? 'border-red-300 dark:border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
            />
            {errors.postal_code && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.postal_code}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-dark-700 dark:text-light-300 mb-2">
              Country
            </label>
            <input
              id="country"
              name="country"
              type="text"
              value={formData.country}
              onChange={handleChange}
              className={`input ${
                errors.country ? 'border-red-300 dark:border-red-500 focus:border-red-500 focus:ring-red-500' : ''
              }`}
            />
            {errors.country && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.country}</p>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-dark-700 dark:text-light-300 mb-2">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className={`input ${
              errors.password ? 'border-red-300 dark:border-red-500 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="password_confirmation" className="block text-sm font-medium text-dark-700 dark:text-light-300 mb-2">
            Confirm Password
          </label>
          <input
            id="password_confirmation"
            name="password_confirmation"
            type="password"
            value={formData.password_confirmation}
            onChange={handleChange}
            className={`input ${
              errors.password_confirmation ? 'border-red-300 dark:border-red-500 focus:border-red-500 focus:ring-red-500' : ''
            }`}
          />
          {errors.password_confirmation && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password_confirmation}</p>
          )}
        </div>
        
        <div className="pt-4">
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
                Creating Account...
              </span>
            ) : 'Create Account'}
          </motion.button>
        </div>
        
        <div className="text-center pt-4">
          <p className="text-sm text-dark-600 dark:text-light-400">
            Already have an account?{' '}
            <Link href="/business/login" className="text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300 font-medium">
              Login here
            </Link>
          </p>
        </div>
      </motion.form>
    </motion.div>
  );
};