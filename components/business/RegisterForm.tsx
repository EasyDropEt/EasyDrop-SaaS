'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BusinessRegistration } from '@/domain/entities/Business';
import { Location } from '@/domain/entities/Location';
import { CreateBusinessAccountUseCase } from '@/application/useCases/business/CreateBusinessAccountUseCase';
import { BusinessAccountRepository } from '@/infrastructure/repositories/BusinessAccountRepository';
import { ApiClient } from '@/infrastructure/api/ApiClient';
import { useBusinessContext } from '@/context/BusinessContext';
import { ValidationError } from '@/domain/errors/AppError';
import { GetBusinessOtpUseCase } from '@/application/useCases/business/GetBusinessOtpUseCase';

const initialFormState: Omit<BusinessRegistration, 'location'> & { 
  address: string;
  city: string;
  postal_code: string;
  country: string;
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
      'email', 'phone_number', 'address', 'city', 'postal_code', 'country'
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
          latitude: 0, // These would be populated by a geocoding service in a real implementation
          longitude: 0
        },
        billing_details: [{}],
        password: "password@Pass123"
      };
      
      const apiClient = new ApiClient();
      const businessRepo = new BusinessAccountRepository(apiClient);
      const createBusinessUseCase = new CreateBusinessAccountUseCase(businessRepo);
      
      await createBusinessUseCase.execute(businessPayload);
      
      // Account created, now request an OTP to login
      const getOtpUseCase = new GetBusinessOtpUseCase(businessRepo);
      const otpResult = await getOtpUseCase.execute(formData.phone_number, "password@Pass123");
      
      setSuccessMessage(`Business account created successfully! Please check your phone for verification code to login. Your user ID is: ${otpResult.user_id}`);
      
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
    <div className="bg-white px-6 py-8 rounded-lg shadow-md max-w-md w-full mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create Business Account</h1>
        <p className="text-gray-600 mt-2">Start managing your deliveries with EasyDrop</p>
      </div>
      
      {generalError && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">
          {generalError}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-50 text-green-600 p-3 rounded mb-4 text-sm">
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="business_name" className="block text-sm font-medium text-gray-700">
            Business Name
          </label>
          <input
            id="business_name"
            name="business_name"
            type="text"
            value={formData.business_name}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.business_name ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.business_name && (
            <p className="mt-1 text-sm text-red-600">{errors.business_name}</p>
          )}
        </div>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="owner_first_name" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              id="owner_first_name"
              name="owner_first_name"
              type="text"
              value={formData.owner_first_name}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.owner_first_name ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.owner_first_name && (
              <p className="mt-1 text-sm text-red-600">{errors.owner_first_name}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="owner_last_name" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              id="owner_last_name"
              name="owner_last_name"
              type="text"
              value={formData.owner_last_name}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.owner_last_name ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.owner_last_name && (
              <p className="mt-1 text-sm text-red-600">{errors.owner_last_name}</p>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.email ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            id="phone_number"
            name="phone_number"
            type="tel"
            value={formData.phone_number}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.phone_number ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.phone_number && (
            <p className="mt-1 text-sm text-red-600">{errors.phone_number}</p>
          )}
        </div>
        
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            id="address"
            name="address"
            type="text"
            value={formData.address}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.address ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.address && (
            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700">
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.city ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.city && (
              <p className="mt-1 text-sm text-red-600">{errors.city}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">
              Postal Code
            </label>
            <input
              id="postal_code"
              name="postal_code"
              type="text"
              value={formData.postal_code}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border ${
                errors.postal_code ? 'border-red-300' : 'border-gray-300'
              } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
            />
            {errors.postal_code && (
              <p className="mt-1 text-sm text-red-600">{errors.postal_code}</p>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700">
            Country
          </label>
          <input
            id="country"
            name="country"
            type="text"
            value={formData.country}
            onChange={handleChange}
            className={`mt-1 block w-full px-3 py-2 border ${
              errors.country ? 'border-red-300' : 'border-gray-300'
            } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
          />
          {errors.country && (
            <p className="mt-1 text-sm text-red-600">{errors.country}</p>
          )}
        </div>
        
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading ? 'opacity-75 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </div>
      </form>
    </div>
  );
};