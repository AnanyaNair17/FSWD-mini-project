"use client";

import React, { useState } from 'react';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import Link from 'next/link';

export default function StaffLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login logic
    console.log('Login attempt:', { username, password });
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl text-[#1A1924] mb-3">Staff Login</h1>
          <p className="text-[#717182] font-['Outfit']">
            Access your clinic dashboard using the credentials sent when you registered.
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8 mb-6">
          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              label="USERNAME"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <Input
              label="PASSWORD"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              showPasswordToggle
              required
            />

            <Button type="submit" variant="primary" className="w-full">
              Login to Dashboard →
            </Button>
          </form>
        </div>

        {/* Demo Credentials */}
        <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-xl p-6">
          <p className="text-sm text-[#92400E] mb-3 font-['Outfit']">
            <strong>Demo credentials (pre-registered clinics)</strong>
          </p>
          <div className="space-y-2 text-sm font-mono">
            <div className="flex items-center gap-2">
              <span className="text-[#C94F1E] font-semibold">SHARMA01</span>
              <span className="text-[#717182]">/ clinic123</span>
              <span className="text-[#717182] font-['Outfit']">— Sharma General</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#C94F1E] font-semibold">BANDRA02</span>
              <span className="text-[#717182]">/ clinic123</span>
              <span className="text-[#717182] font-['Outfit']">— Bandra Skin</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#C94F1E] font-semibold">DADAR03</span>
              <span className="text-[#717182]">/ clinic123</span>
              <span className="text-[#717182] font-['Outfit']">— Dadar Bone</span>
            </div>
          </div>
          <Link 
            href="/register-clinic" 
            className="text-sm text-[#1A6B7C] underline mt-4 inline-block font-['Outfit']"
          >
            Register your clinic to set your own credentials →
          </Link>
        </div>
      </div>
    </div>
  );
}
