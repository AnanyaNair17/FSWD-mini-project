import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  showPasswordToggle?: boolean;
}

export function Input({ 
  label, 
  error, 
  className, 
  type = 'text',
  showPasswordToggle = false,
  ...props 
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';
  const inputType = isPasswordField && showPassword ? 'text' : type;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs uppercase tracking-wide text-[#717182] mb-2">
          {label}
          {props.required && <span className="text-[#C94F1E] ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          type={inputType}
          className={cn(
            'w-full px-4 py-3 rounded-lg border border-[#E5E5E5] bg-white',
            'text-[#1A1924] placeholder:text-[#9CA3AF]',
            'focus:outline-none focus:ring-2 focus:ring-[#1A6B7C] focus:border-transparent',
            'disabled:bg-[#F3F4F6] disabled:cursor-not-allowed',
            error && 'border-[#d4183d] focus:ring-[#d4183d]',
            className
          )}
          {...props}
        />
        {isPasswordField && showPasswordToggle && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#717182] hover:text-[#1A1924]"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && (
        <p className="mt-1 text-sm text-[#d4183d]">{error}</p>
      )}
    </div>
  );
}
