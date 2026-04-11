"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { ArrowLeft, UserPlus } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'VOLUNTEER'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Success - Redirect to login or auto-login
      router.push('/login?registered=true');
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
              <UserPlus size={28} />
            </div>
            <h1 className="text-2xl font-bold font-['Outfit'] text-[#1A1924]">Create an Account</h1>
            <p className="text-[#717182] mt-2">Join WaitLess and simplify your clinic experience</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-[#C94F1E]/10 border border-[#C94F1E]/20 text-[#C94F1E] text-sm">
                {error}
              </div>
            )}

            <Input
              label="Full Name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

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

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              showPasswordToggle
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />

            <div className="pt-2">
              <Button 
                type="submit" 
                variant="primary" 
                className="w-full h-12 text-lg" 
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </div>
          </form>

          <p className="mt-8 text-center text-[#717182]">
            Already have an account?{' '}
            <Link href="/login" className="text-[#1A6B7C] font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
