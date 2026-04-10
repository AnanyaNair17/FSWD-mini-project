import React from 'react';
import { Star, MapPin, CheckCircle } from 'lucide-react';
import { Tag } from './Tag';
import { Button } from './Button';
import Link from 'next/link';

export interface ClinicCardProps {
  id: string;
  name: string;
  doctor: string;
  specialty: string;
  location: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  waiting: number;
  queueStatus: 'open' | 'closed';
  workingDays?: string;
}

export function ClinicCard({
  id,
  name,
  doctor,
  specialty,
  location,
  rating,
  reviewCount,
  verified,
  waiting,
  queueStatus,
  workingDays
}: ClinicCardProps) {
  return (
    <div className="bg-white rounded-xl border border-[#E5E5E5] p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-xl text-[#1A1924]">{name}</h3>
            {verified && (
              <CheckCircle size={18} className="text-[#1A6B7C]" />
            )}
          </div>
          <p className="text-[#717182] font-['Outfit']">{doctor}</p>
        </div>
        
        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < Math.floor(rating) ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-[#E5E7EB]'}
              />
            ))}
          </div>
          <span className="text-sm text-[#1A1924] ml-1 font-['Outfit']">{rating}</span>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Tag variant="specialty" icon={null}>
          {specialty}
        </Tag>
        <Tag variant="location" icon={<MapPin size={12} />}>
          {location}
        </Tag>
      </div>

      <p className="text-xs text-[#9CA3AF] mb-4 font-['Outfit']">{reviewCount} reviews</p>

      {/* Queue Status */}
      <div className="flex items-center justify-between pt-4 border-t border-[#E5E5E5]">
        <div>
          <p className="text-xs uppercase tracking-wide text-[#717182] mb-1 font-['Outfit']">WAITING</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl text-[#1A1924]">{waiting}</span>
            {queueStatus === 'open' && workingDays && (
              <span className="text-sm text-[#059669] font-['Outfit']">
                No queue · Join now
              </span>
            )}
          </div>
          {workingDays && (
            <p className="text-xs text-[#9CA3AF] mt-1 font-['Outfit']">{workingDays}</p>
          )}
        </div>
        
        <Link href={`/clinic/${id}`}>
          <Button variant="primary" size="sm">
            View Queue →
          </Button>
        </Link>
      </div>
    </div>
  );
}
