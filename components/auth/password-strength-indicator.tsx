'use client';

import { useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import { calculatePasswordStrength } from '@/lib/auth';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const strength = useMemo(() => calculatePasswordStrength(password), [password]);

  if (!password) {
    return null;
  }

  const getStrengthColor = () => {
    switch (strength.level) {
      case 'weak':
        return 'bg-red-500';
      case 'fair':
        return 'bg-orange-500';
      case 'good':
        return 'bg-yellow-500';
      case 'strong':
        return 'bg-green-500';
      default:
        return 'bg-slate-300';
    }
  };

  const getStrengthText = () => {
    switch (strength.level) {
      case 'weak':
        return 'Weak';
      case 'fair':
        return 'Fair';
      case 'good':
        return 'Good';
      case 'strong':
        return 'Strong';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-600">Password strength</span>
        <span className={`text-xs font-medium ${
          strength.level === 'weak' ? 'text-red-600' :
          strength.level === 'fair' ? 'text-orange-600' :
          strength.level === 'good' ? 'text-yellow-600' :
          'text-green-600'
        }`}>
          {getStrengthText()}
        </span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className={`h-full transition-all duration-300 ${getStrengthColor()}`}
          style={{ width: `${strength.score}%` }}
        />
      </div>
      {strength.feedback.length > 0 && (
        <ul className="space-y-1">
          {strength.feedback.map((item, index) => (
            <li key={index} className="text-xs text-slate-600 flex items-start gap-1">
              <span className="text-slate-400">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
