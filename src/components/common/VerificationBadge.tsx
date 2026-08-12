'use client';

import React from 'react';
import { CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';

interface VerificationBadgeProps {
  isVerified: boolean;
  confidence?: number;
  size?: 'sm' | 'md' | 'lg';
  showConfidence?: boolean;
}

export default function VerificationBadge({
  isVerified,
  confidence,
  size = 'md',
  showConfidence = false,
}: VerificationBadgeProps) {
  if (isVerified) {
    return (
      <span
        className={`inline-flex items-center gap-1 font-semibold rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 ${
          size === 'sm'
            ? 'px-2 py-0.5 text-[10px]'
            : size === 'lg'
            ? 'px-3 py-1 text-xs'
            : 'px-2.5 py-0.5 text-[11px]'
        }`}
        title="Human Verified Data: Attributes confirmed or corrected by spatial architect"
      >
        <CheckCircle2 className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
        <span>Verified Data</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40 ${
        size === 'sm'
          ? 'px-2 py-0.5 text-[10px]'
          : size === 'lg'
          ? 'px-3 py-1 text-xs'
          : 'px-2.5 py-0.5 text-[11px]'
      }`}
      title="AI Estimation: Subject to user verification and review"
    >
      <Sparkles className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>AI Estimated</span>
      {showConfidence && confidence !== undefined && (
        <span className="opacity-80 font-mono text-[10px] ml-0.5">
          ({Math.round(confidence * 100)}%)
        </span>
      )}
    </span>
  );
}
