'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useBusinessContext } from '@/context/BusinessContext';
import { ThemeToggle } from './ThemeToggle';
import { motion, AnimatePresence } from 'framer-motion';

export const Navigation: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { business, isAuthenticated, logout } = useBusinessContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(`${path}/`);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsMenuOpen(false);
  };

  const variants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-dark-800 border-b border-light-300 dark:border-dark-700 backdrop-blur supports-backdrop-blur:bg-white/80 dark:supports-backdrop-blur:bg-dark-800/80 transition-all duration-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-2">
                <motion.div 
                  initial={{ scale: 0.8 }} 
                  animate={{ scale: 1 }} 
                  className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center"
                >
                  <span className="text-white font-bold">E</span>
                </motion.div>
                <motion.span 
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xl font-bold text-dark-900 dark:text-white"
                >
                  EasyDrop
                </motion.span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-6">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                  isActive('/')
                    ? 'border-primary-500 text-dark-900 dark:text-white' 
                    : 'border-transparent text-dark-500 dark:text-light-400 hover:text-dark-700 dark:hover:text-white'
                }`}
              >
                Dashboard
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link
                    href="/orders"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                      isActive('/orders') 
                        ? 'border-primary-500 text-dark-900 dark:text-white' 
                        : 'border-transparent text-dark-500 dark:text-light-400 hover:text-dark-700 dark:hover:text-white'
                    }`}
                  >
                    Orders
                  </Link>
                  <Link
                    href="/reports"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${
                      isActive('/reports') 
                        ? 'border-primary-500 text-dark-900 dark:text-white' 
                        : 'border-transparent text-dark-500 dark:text-light-400 hover:text-dark-700 dark:hover:text-white'
                    }`}
                  >
                    Reports
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <ThemeToggle />
            <div className="relative">
              {!isAuthenticated ? (
                <div className="flex space-x-4">
                  <Link href="/business/login" className="btn-outline">
                    Login
                  </Link>
                  <Link href="/business/register" className="btn-primary">
                    Register
                  </Link>
                </div>
              ) : (
                <div className="relative">
                  <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-light-200 dark:bg-dark-700 hover:bg-light-300 dark:hover:bg-dark-600 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full bg-primary-500 flex items-center justify-center">
                      <span className="text-white font-medium">
                        {business?.business_name?.charAt(0) || 'B'}
                      </span>
                    </div>
                    <span className="text-dark-800 dark:text-light-50">{business?.business_name}</span>
                    <svg className="w-4 h-4 text-dark-500 dark:text-light-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  <AnimatePresence>
                    {isMenuOpen && (
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        variants={variants}
                        className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-dark-700 ring-1 ring-light-300 dark:ring-dark-600 z-50"
                      >
                        <Link 
                          href="/business/profile"
                          className="block px-4 py-2 text-sm text-dark-700 dark:text-light-200 hover:bg-light-200 dark:hover:bg-dark-600"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-dark-700 dark:text-light-200 hover:bg-light-200 dark:hover:bg-dark-600"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center space-x-4 sm:hidden">
            <ThemeToggle />
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-dark-500 dark:text-light-400 hover:text-dark-900 dark:hover:text-white hover:bg-light-200 dark:hover:bg-dark-700 focus:outline-none"
            >
              <svg className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                href="/" 
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive('/') 
                    ? 'bg-primary-50 dark:bg-primary-900/30 border-l-4 border-primary-500 text-primary-600 dark:text-primary-400' 
                    : 'text-dark-600 dark:text-light-300 hover:bg-light-200 dark:hover:bg-dark-700 hover:text-dark-900 dark:hover:text-white'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link 
                    href="/orders" 
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive('/orders') 
                        ? 'bg-primary-50 dark:bg-primary-900/30 border-l-4 border-primary-500 text-primary-600 dark:text-primary-400' 
                        : 'text-dark-600 dark:text-light-300 hover:bg-light-200 dark:hover:bg-dark-700 hover:text-dark-900 dark:hover:text-white'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Link>
                  <Link 
                    href="/reports" 
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      isActive('/reports') 
                        ? 'bg-primary-50 dark:bg-primary-900/30 border-l-4 border-primary-500 text-primary-600 dark:text-primary-400' 
                        : 'text-dark-600 dark:text-light-300 hover:bg-light-200 dark:hover:bg-dark-700 hover:text-dark-900 dark:hover:text-white'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Reports
                  </Link>
                </>
              )}
            </div>
            
            <div className="pt-4 pb-3 border-t border-light-300 dark:border-dark-600">
              {!isAuthenticated ? (
                <div className="flex items-center px-4 py-2 space-x-2">
                  <Link href="/business/login" className="btn-outline w-full" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </Link>
                  <Link href="/business/register" className="btn-primary w-full" onClick={() => setIsMenuOpen(false)}>
                    Register
                  </Link>
                </div>
              ) : (
                <div>
                  <div className="flex items-center px-4 py-2">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-primary-500 flex items-center justify-center">
                        <span className="text-lg font-medium text-white">
                          {business?.business_name?.charAt(0) || 'B'}
                        </span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-dark-800 dark:text-white">{business?.business_name}</div>
                      <div className="text-sm font-medium text-dark-500 dark:text-light-400">{business?.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1 px-2">
                    <Link 
                      href="/business/profile" 
                      className="block px-3 py-2 rounded-md text-base font-medium text-dark-600 dark:text-light-300 hover:bg-light-200 dark:hover:bg-dark-700 hover:text-dark-900 dark:hover:text-white"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-md text-base font-medium text-dark-600 dark:text-light-300 hover:bg-light-200 dark:hover:bg-dark-700 hover:text-dark-900 dark:hover:text-white"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};