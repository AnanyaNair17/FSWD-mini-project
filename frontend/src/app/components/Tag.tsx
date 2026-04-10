import React from 'react';
import { cn } from '../../lib/utils';

export interface TagProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'info' | 'default' | 'specialty' | 'location';
  className?: string;
  icon?: React.ReactNode;
}

export function Tag({ children, variant = 'default', className, icon }: TagProps) {
  const variants = {
    success: 'bg-[#D1FAE5] text-[#065F46] border-[#A7F3D0]',
    warning: 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]',
    info: 'bg-[#DBEAFE] text-[#1E40AF] border-[#BFDBFE]',
    default: 'bg-[#F3F4F6] text-[#4B5563] border-[#E5E7EB]',
    specialty: 'bg-[#E0F2FE] text-[#1A6B7C] border-[#BAE6FD]',
    location: 'bg-[#FCE7E7] text-[#C94F1E] border-[#FCA5A5]'
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs border',
        variants[variant],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}
