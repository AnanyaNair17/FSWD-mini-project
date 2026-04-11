"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { ArrowLeft, LogIn, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setShowSuccess(true);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Success - Store token and redirect
      authLogin(data.token, data.user);
      
      router.push('/patient-dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <nav className="p-6">
        <Link href="/" className="inline-flex items-center text-[#717182] hover:text-[#1A6B7C] transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          Back to Home
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-[#1A6B7C]/10 rounded-xl flex items-center justify-center text-[#1A6B7C] mb-4">
              <LogIn size={28} />
            </div>
            <h1 className="text-2xl font-bold font-['Outfit'] text-[#1A1924]">Welcome Back</h1>
            <p className="text-[#717182] mt-2">Log in to manage your clinic visits</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {showSuccess && (
              <div className="p-3 rounded-lg bg-[#1A6B7C]/10 border border-[#1A6B7C]/20 text-[#1A6B7C] text-sm flex items-center">
                <CheckCircle2 size={16} className="mr-2" />
                Registration successful! Please log in.
              </div>
            )}

            {error && (
              <div className="p-3 rounded-lg bg-[#C94F1E]/10 border border-[#C94F1E]/20 text-[#C94F1E] text-sm">
                {error}
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              showPasswordToggle
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <div className="flex items-center justify-end">
              <Link href="#" className="text-sm text-[#1A6B7C] hover:underline">
                Forgot password?
              </Link>
            </div>

            <div className="pt-2">
              <Button 
                type="submit" 
                variant="primary" 
                className="w-full h-12 text-lg" 
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Log In'}
              </Button>
            </div>
          </form>

          <p className="mt-8 text-center text-[#717182]">
            Don't have an account?{' '}
            <Link href="/register" className="text-[#1A6B7C] font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
