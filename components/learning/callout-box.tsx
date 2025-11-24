'use client';

import { ReactNode } from 'react';
import { Lightbulb, AlertTriangle, Info, CheckCircle } from 'lucide-react';

interface CalloutBoxProps {
  variant: 'tip' | 'warning' | 'info' | 'success';
  title?: string;
  children: ReactNode;
}

const variantConfig = {
  tip: {
    icon: Lightbulb,
    defaultTitle: 'Pro Tip',
    bgClass: 'bg-callout-tip-bg',
    borderClass: 'border-callout-tip-border',
    textClass: 'text-callout-tip-text',
    iconBgClass: 'bg-blue-100',
  },
  warning: {
    icon: AlertTriangle,
    defaultTitle: 'Warning',
    bgClass: 'bg-callout-warning-bg',
    borderClass: 'border-callout-warning-border',
    textClass: 'text-callout-warning-text',
    iconBgClass: 'bg-amber-100',
  },
  info: {
    icon: Info,
    defaultTitle: 'Info',
    bgClass: 'bg-callout-info-bg',
    borderClass: 'border-callout-info-border',
    textClass: 'text-callout-info-text',
    iconBgClass: 'bg-purple-100',
  },
  success: {
    icon: CheckCircle,
    defaultTitle: 'Success',
    bgClass: 'bg-callout-success-bg',
    borderClass: 'border-callout-success-border',
    textClass: 'text-callout-success-text',
    iconBgClass: 'bg-green-100',
  },
};

export function CalloutBox({ variant, title, children }: CalloutBoxProps) {
  const config = variantConfig[variant];
  const Icon = config.icon;
  const displayTitle = title || config.defaultTitle;

  return (
    <div
      className={`
        ${config.bgClass}
        ${config.borderClass}
        border-l-4
        rounded-xl
        p-6
        my-6
        shadow-sm
        transition-all
        duration-200
        hover:shadow-md
      `}
      role="note"
      aria-label={`${variant} callout: ${displayTitle}`}
    >
      <div className="flex gap-4">
        {/* Icon Container */}
        <div className={`${config.iconBgClass} rounded-lg p-2 h-fit flex-shrink-0`}>
          <Icon className={`h-5 w-5 ${config.textClass}`} aria-hidden="true" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold text-base mb-2 ${config.textClass}`}>
            {displayTitle}
          </h4>
          <div className="text-sm leading-relaxed text-slate-700">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
