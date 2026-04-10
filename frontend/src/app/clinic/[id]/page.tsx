"use client";

import React, { useState, use } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Star, MapPin, Clock, CheckCircle, Phone } from 'lucide-react';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Tag } from '../../components/Tag';
import { QueueListItem } from '../../components/QueueListItem';
import { mockClinics } from '../../../data/mockClinics';

export default function ClinicDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [patientName, setPatientName] = useState('');
  const [showTokenModal, setShowTokenModal] = useState(false);
  
  const clinic = mockClinics.find(c => c.id === id);

  if (!clinic) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl text-[#1A1924] mb-4">Clinic not found</h2>
          <Link href="/browse">
            <Button variant="primary">Browse Clinics</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleJoinQueue = () => {
    if (patientName.trim()) {
      setShowTokenModal(true);
    }
  };

  // Mock queue data
  const queueItems = [
    { tokenNumber: 'A1', patientName: 'Current Patient', status: 'current' as const, estimatedTime: 'Now' },
    { tokenNumber: 'A2', status: 'waiting' as const, estimatedTime: '10 mins' },
    { tokenNumber: 'A3', status: 'waiting' as const, estimatedTime: '20 mins' },
    { tokenNumber: 'A4', status: 'waiting' as const, estimatedTime: '30 mins' }
  ];

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Link href="/browse" className="inline-flex items-center text-[#1A6B7C] mb-6 hover:underline font-['Outfit']">
          ← Back to Browse
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Clinic Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-3xl text-[#1A1924]">{clinic.name}</h1>
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
                      <span className="ml-2 text-lg font-['Outfit']">{clinic.rating}</span>
                    </div>
                    <span className="text-[#717182] font-['Outfit']">({clinic.reviewCount} reviews)</span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-[#E5E5E5]">
                <div className="flex items-center gap-3">
                  <Clock className="text-[#1A6B7C]" size={20} />
                  <div>
                    <p className="text-xs uppercase text-[#717182] font-['Outfit']">Working Hours</p>
                    <p className="text-[#1A1924] font-['Outfit']">{clinic.workingDays} · 9 AM - 9 PM</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-[#1A6B7C]" size={20} />
                  <div>
                    <p className="text-xs uppercase text-[#717182] font-['Outfit']">Contact</p>
                    <p className="text-[#1A1924] font-['Outfit']">+91 98765 43210</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Queue */}
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8">
              <h2 className="text-2xl text-[#1A1924] mb-6">Live Queue</h2>
              <div className="space-y-3">
                {queueItems.map((item, index) => (
                  <QueueListItem key={index} {...item} />
                ))}
              </div>
            </div>
          </div>

          {/* Join Queue Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#E5E5E5] p-8 sticky top-24">
              <div className="text-center mb-6">
                <p className="text-sm uppercase tracking-wide text-[#717182] mb-2 font-['Outfit']">
                  CURRENTLY WAITING
                </p>
                <p className="text-5xl text-[#1A6B7C] mb-2">{clinic.waiting}</p>
                {clinic.waiting === 0 ? (
                  <Tag variant="success">No queue · Join now</Tag>
                ) : (
                  <p className="text-sm text-[#717182] font-['Outfit']">
                    Est. wait: {clinic.waiting * 10} mins
                  </p>
                )}
              </div>

              <div className="border-t border-[#E5E5E5] pt-6">
                <h3 className="text-lg text-[#1A1924] mb-4">Get your token</h3>
                <Input
                  placeholder="Enter your name"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="mb-4"
                />
                <Button
                  variant="accent"
                  className="w-full"
                  onClick={handleJoinQueue}
                  disabled={!patientName.trim()}
                >
                  Join Queue
                </Button>
                <p className="text-xs text-[#717182] mt-4 text-center font-['Outfit']">
                  You'll receive a digital token. The clinic screen will display your number.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Token Modal */}
        {showTokenModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
              <div className="w-24 h-24 bg-[#D1FAE5] rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={48} className="text-[#059669]" />
              </div>
              <h2 className="text-3xl text-[#1A1924] mb-2">Token Confirmed!</h2>
              <p className="text-[#717182] mb-6 font-['Outfit']">
                Your token number is
              </p>
              <div className="bg-[#1A6B7C] text-white rounded-xl py-8 mb-6">
                <p className="text-6xl">A5</p>
              </div>
              <p className="text-[#717182] mb-8 font-['Outfit']">
                Please arrive at the clinic. Your number will be called on the screen.
              </p>
              <Button
                variant="primary"
                className="w-full"
                onClick={() => setShowTokenModal(false)}
              >
                Got it
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
