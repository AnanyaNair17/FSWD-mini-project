import React from 'react';
import { cn } from '../../lib/utils';
import { ChevronDown } from 'lucide-react';

export interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

export function Dropdown({ 
  label, 
  options, 
  placeholder = 'Select...', 
  className, 
  ...props 
}: DropdownProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs uppercase tracking-wide text-[#717182] mb-2">
          {label}
          {props.required && <span className="text-[#C94F1E] ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          className={cn(
            'w-full px-4 py-3 rounded-lg border border-[#E5E5E5] bg-white appearance-none',
            'text-[#1A1924] cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-[#1A6B7C] focus:border-transparent',
            'disabled:bg-[#F3F4F6] disabled:cursor-not-allowed',
            className
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option, index) => (
            <option key={`${option.value}-${index}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown 
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#717182] pointer-events-none" 
          size={20} 
        />
      </div>
    </div>
  );
}
