"use client";

import React, { useState, useEffect, use } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Star, MapPin, Clock, CheckCircle, Phone, RefreshCw } from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Tag } from '../../components/Tag';
import { QueueListItem } from '../../components/QueueListItem';
import { useAuth } from '../../context/AuthContext';

export default function ClinicDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { token, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [clinic, setClinic] = useState<any>(null);
  const [patientName, setPatientName] = useState('');
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  const fetchClinicDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/clinics/${id}`);
      if (!response.ok) throw new Error('Clinic not found');
      const data = await response.json();
      setClinic(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClinicDetails();
    const interval = setInterval(fetchClinicDetails, 10000); // Refresh every 10s
    return () => clearInterval(interval);
  }, [id]);

  const handleJoinQueue = async () => {
    if (!isAuthenticated) {
      router.push('/register');
      return;
    }

    if (!patientName.trim()) return;

    setJoining(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/queue/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          clinicId: clinic?.id,
          patientName: patientName
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join queue');
      }

      setTokenInfo(data.entry);
      setShowTokenModal(true);
      fetchClinicDetails(); // Refresh queue immediately
    } catch (err: any) {
      setError(err.message);
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-10 h-10 text-[#1A6B7C] animate-spin" />
          <p className="text-[#717182] font-['Outfit']">Fetching clinic details...</p>
        </div>
      </div>
    );
  }

  if (!clinic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Clinic Not Found</h2>
          <Link href="/browse">
            <Button variant="primary">Back to Browse</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6 bg-[#F8FAFC]">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link href="/browse" className="inline-flex items-center text-[#1A6B7C] mb-6 hover:underline font-['Outfit'] group">
          <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span> Back to Browse
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Clinic Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl font-bold text-[#1A1924]">{clinic.name}</h1>
                    {clinic.verified && (
                      <CheckCircle size={24} className="text-[#1A6B7C]" />
                    )}
                  </div>
                  <p className="text-xl text-[#717182] mb-4 font-['Outfit']">{clinic.doctor}</p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <Tag variant="specialty">{clinic.specialty}</Tag>
                    <Tag variant="location" icon={<MapPin size={12} />}>
                      {clinic.location}
                    </Tag>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          className={i < Math.floor(clinic.rating) ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#E5E7EB]'}
                        />
                      ))}
                      <span className="ml-2 text-lg font-bold font-['Outfit']">{clinic.rating}</span>
                    </div>
                    <span className="text-[#717182] font-['Outfit']">({clinic.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-[#F1F5F9]">
                <div className="flex items-center gap-3">
                  <Clock className="text-[#1A6B7C]" size={20} />
                  <div>
                    <p className="text-xs uppercase font-bold text-[#94A3B8] font-['Outfit']">Working Hours</p>
                    <p className="text-[#1A1924] font-medium font-['Outfit']">{clinic.workingDays} · 9 AM - 9 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-[#1A6B7C]" size={20} />
                  <div>
                    <p className="text-xs uppercase font-bold text-[#94A3B8] font-['Outfit']">Contact</p>
                    <p className="text-[#1A1924] font-medium font-['Outfit']">{clinic.phone || '+91 98765 43210'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Queue */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[#1A1924]">Live Queue</h2>
                {clinic.liveQueue && (
                  <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-700 rounded-full uppercase tracking-wider animate-pulse">Live</span>
                )}
              </div>
              <div className="space-y-3">
                {clinic.liveQueue && clinic.liveQueue.length > 0 ? (
                  clinic.liveQueue.map((item: any, index: number) => (
                    <QueueListItem key={index} {...item} />
                  ))
                ) : (
                  <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-[#717182]">No patients currently in queue</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Join Queue Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8 sticky top-24 shadow-sm">
              <div className="text-center mb-6">
                <p className="text-sm uppercase tracking-wide font-bold text-[#94A3B8] mb-2 font-['Outfit']">
                  CURRENTLY WAITING
                </p>
                <p className="text-6xl font-black text-[#1A6B7C] mb-2">{clinic.waiting}</p>
                {clinic.waiting === 0 ? (
                  <Tag variant="success">No queue · Join now</Tag>
                ) : (
                  <p className="text-sm text-[#717182] font-medium font-['Outfit']">
                    Est. wait: {clinic.waiting * 10} mins
                  </p>
                )}
              </div>

              <div className="border-t border-[#F1F5F9] pt-6">
                <h3 className="text-lg font-bold text-[#1A1924] mb-4">Get your token</h3>
                {error && (
                  <div className="p-3 mb-4 rounded-lg bg-red-50 text-red-600 text-xs border border-red-100">
                    {error}
                  </div>
                )}
                <Input
                  placeholder="Enter your name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="mb-4 h-12"
                />
                <Button
                  variant="accent"
                  className="w-full h-12 text-lg shadow-lg shadow-orange-200"
                  onClick={handleJoinQueue}
                  disabled={!patientName.trim() || joining}
                >
                  {joining ? 'Joining...' : 'Join Queue'}
                </Button>
                <p className="text-[10px] text-[#94A3B8] mt-4 text-center font-['Outfit'] leading-relaxed">
                  By joining, you'll receive a digital token. Please ensure you are near the clinic when your turn approaches.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Token Modal */}
        {showTokenModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center shadow-2xl scale-in-center">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={48} className="text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-[#1A1924] mb-2">Token Confirmed!</h2>
              <p className="text-[#717182] mb-6 font-['Outfit']">
                Your token number is
              </p>
              <div className="bg-[#1A6B7C] text-white rounded-2xl py-8 mb-6 shadow-xl shadow-[#1A6B7C]/20 border-t-4 border-[#25879c]">
                <p className="text-7xl font-black">#{tokenInfo?.tokenNumber}</p>
              </div>
              <p className="text-sm text-[#717182] mb-8 font-medium font-['Outfit']">
                Successfully joined the queue at <span className="text-[#1A1924]">{clinic.name}</span>.
              </p>
              <div className="flex flex-col gap-3">
                <Link href="/patient-dashboard" className="w-full">
                  <Button variant="primary" className="w-full h-12 shadow-lg shadow-blue-100">
                    Go to Dashboard
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="w-full h-12 border-gray-200"
                  onClick={() => setShowTokenModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
