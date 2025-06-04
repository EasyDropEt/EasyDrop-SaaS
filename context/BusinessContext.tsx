'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BusinessDto } from '@/domain/entities/Business';
import { GetMyBusinessUseCase } from '@/application/useCases/business/GetMyBusinessUseCase';
import { BusinessAccountRepository } from '@/infrastructure/repositories/BusinessAccountRepository';
import { ApiClient } from '@/infrastructure/api/ApiClient';

interface BusinessContextType {
  business: BusinessDto | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, business: BusinessDto) => void;
  logout: () => void;
  refreshBusinessData: () => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [business, setBusiness] = useState<BusinessDto | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshBusinessData = async () => {
    if (!token) return;

    try {
      const apiClient = new ApiClient();
      apiClient.setAuthToken(token);
      const businessRepo = new BusinessAccountRepository(apiClient);
      const getMyBusinessUseCase = new GetMyBusinessUseCase(businessRepo);
      
      const businessData = await getMyBusinessUseCase.execute();
      setBusiness(businessData);
      localStorage.setItem('business_data', JSON.stringify(businessData));
    } catch (error) {
      console.error('Failed to refresh business data:', error);
      // If we can't get the business data, we should log out
      logout();
    }
  };

  useEffect(() => {
    // Load from localStorage on initial render
    const savedToken = localStorage.getItem('business_token');
    const savedBusiness = localStorage.getItem('business_data');
    
    if (savedToken && savedBusiness) {
      try {
        setToken(savedToken);
        setBusiness(JSON.parse(savedBusiness));
        // Refresh business data in the background
        refreshBusinessData();
      } catch (error) {
        console.error('Failed to parse saved business data:', error);
        localStorage.removeItem('business_token');
        localStorage.removeItem('business_data');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = (newToken: string, businessData: BusinessDto) => {
    setToken(newToken);
    setBusiness(businessData);
    localStorage.setItem('business_token', newToken);
    localStorage.setItem('business_data', JSON.stringify(businessData));
  };

  const logout = () => {
    setToken(null);
    setBusiness(null);
    localStorage.removeItem('business_token');
    localStorage.removeItem('business_data');
  };

  return (
    <BusinessContext.Provider
      value={{
        business,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
        refreshBusinessData
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusinessContext = (): BusinessContextType => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusinessContext must be used within a BusinessProvider');
  }
  return context;
}; 