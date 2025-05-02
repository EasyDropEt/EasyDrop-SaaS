'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Business } from '@/domain/entities/Business';

interface BusinessContextType {
  business: Business | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, business: Business) => void;
  logout: () => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [business, setBusiness] = useState<Business | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage on initial render
    const savedToken = localStorage.getItem('business_token');
    const savedBusiness = localStorage.getItem('business_data');
    
    if (savedToken && savedBusiness) {
      try {
        setToken(savedToken);
        setBusiness(JSON.parse(savedBusiness));
      } catch (error) {
        console.error('Failed to parse saved business data:', error);
        localStorage.removeItem('business_token');
        localStorage.removeItem('business_data');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = (newToken: string, businessData: Business) => {
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
        logout
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusinessContext = () => {
  const context = useContext(BusinessContext);
  if (context === undefined) {
    throw new Error('useBusinessContext must be used within a BusinessProvider');
  }
  return context;
}; 