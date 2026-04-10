import React from 'react';
import { Tag } from './Tag';
import { cn } from '../../lib/utils';

export interface QueueListItemProps {
  tokenNumber: string;
  patientName?: string;
  status: 'waiting' | 'current' | 'completed' | 'skipped';
  estimatedTime?: string;
  className?: string;
}

export function QueueListItem({ 
  tokenNumber, 
  patientName, 
  status, 
  estimatedTime,
  className 
}: QueueListItemProps) {
  const statusConfig = {
    waiting: {
      label: 'Waiting',
      variant: 'info' as const,
      bgColor: 'bg-white'
    },
    current: {
      label: 'Current',
      variant: 'success' as const,
      bgColor: 'bg-[#D1FAE5]'
    },
    completed: {
      label: 'Completed',
      variant: 'default' as const,
      bgColor: 'bg-[#F3F4F6]'
    },
    skipped: {
      label: 'Skipped',
      variant: 'warning' as const,
      bgColor: 'bg-[#FEF3C7]'
    }
  };

  const config = statusConfig[status];

  return (
    <div
      className={cn(
        'flex items-center justify-between p-4 rounded-lg border border-[#E5E5E5] transition-all',
        config.bgColor,
        status === 'current' && 'border-[#059669] shadow-md',
        className
      )}
    >
      {/* Token Number */}
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#1A6B7C] text-white">
          <span className="font-semibold font-['Outfit']">{tokenNumber}</span>
        </div>
        
        <div>
          {patientName && (
            <p className="text-[#1A1924] mb-1 font-['Outfit']">{patientName}</p>
          )}
          {estimatedTime && (
            <p className="text-sm text-[#717182] font-['Outfit']">
              Est. {estimatedTime}
            </p>
          )}
        </div>
      </div>

      {/* Status */}
      <Tag variant={config.variant}>{config.label}</Tag>
    </div>
  );
}
