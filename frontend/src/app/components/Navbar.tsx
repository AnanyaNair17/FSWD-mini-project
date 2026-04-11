"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from './Button';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, LogOut, User } from 'lucide-react';

export function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-white border-b border-[#E5E5E5] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h1 className="text-3xl text-[#1A6B7C]">
              <span className="font-normal">Wait</span>
              <span className="font-semibold">Less</span>
            </h1>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/browse" 
              className="text-[#1A1924] hover:text-[#1A6B7C] transition-colors font-['Outfit']"
            >
              Browse Clinics
            </Link>
            
            {!isAuthenticated ? (
              <>
                <Link 
                  href="/login" 
                  className="text-[#1A1924] hover:text-[#1A6B7C] transition-colors font-['Outfit']"
                >
                  Log In
                </Link>

                <Link href="/register">
                  <Button variant="accent" size="md">
                    Get Started
                  </Button>
                </Link>

                <Link href="/staff-login" className="text-[#717182] text-sm hover:text-[#1A1924]">
                  Staff
                </Link>
              </>
            ) : (
              <div className="flex items-center gap-6">
                <Link 
                  href="/patient-dashboard" 
                  className="flex items-center gap-2 text-[#1A6B7C] font-semibold font-['Outfit']"
                >
                  <LayoutDashboard size={18} />
                  Dashboard
                </Link>

                <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-medium text-[#1A1924]">{user?.name}</span>
                    <span className="text-xs text-[#717182] capitalize">{user?.role}</span>
                  </div>
                  <button 
                    onClick={logout}
                    className="p-2 text-[#717182] hover:text-[#C94F1E] transition-colors"
                    title="Log Out"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
