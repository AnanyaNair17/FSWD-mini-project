"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import Link from 'next/link';
import { toast } from 'sonner';

export default function StaffLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      toast.success("Clinic registered successfully! Please login with your staff credentials.");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // For staff login, we attempt to find the user by username
      // Our backend uses email as the primary key, so we'll pass the username
      // We'll update the backend to support username login or we map it here
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: `${username}@waitless.com`, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      toast.success("Login successful!");
      router.push('/staff-management/dashboard');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-6">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl text-[#1A1924] mb-3">Staff Login</h1>
          <p className="text-[#717182] font-['Outfit']">
            Access your clinic dashboard using the credentials set when you registered.
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

            <Button type="submit" variant="primary" className="w-full" disabled={loading}>
              {loading ? 'Authenticating...' : 'Login to Dashboard →'}
            </Button>
          </form>
        </div>

        {/* Info Box */}
        <div className="bg-[#f0f8ff] border border-[#bcd4e6] rounded-xl p-6">
          <p className="text-sm text-[#2a4d69] mb-3 font-['Outfit']">
            <strong>Need assistance?</strong>
          </p>
          <p className="text-sm text-[#4a7a96] font-['Outfit']">
            If you've forgotten your staff credentials, please contact your clinic administrator.
          </p>
          <Link 
            href="/register-clinic" 
            className="text-sm text-[#1A6B7C] underline mt-4 inline-block font-['Outfit']"
          >
            Register a new clinic here →
          </Link>
        </div>
      </div>
    </div>
  );
}
