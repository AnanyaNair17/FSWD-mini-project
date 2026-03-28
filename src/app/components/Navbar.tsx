import React from 'react';
import { Link } from 'react-router';
import { Button } from './Button';

export function Navbar() {
  return (
    <nav className="bg-white border-b border-[#E5E5E5] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-3xl text-[#1A6B7C]">
              <span className="font-normal">Wait</span>
              <span className="font-semibold">Less</span>
            </h1>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/browse" 
              className="text-[#1A1924] hover:text-[#1A6B7C] transition-colors font-['Outfit']"
            >
              Browse Clinics
            </Link>
            <Link 
              to="/staff-login" 
              className="text-[#1A1924] hover:text-[#1A6B7C] transition-colors font-['Outfit']"
            >
              Staff Login
            </Link>
            <Link to="/register-clinic">
              <Button variant="accent" size="md">
                List Your Clinic
              </Button>
            </Link>
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
