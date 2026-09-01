'use client';

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface LoadingStateProps {
  title?: string;
  className?: string;
  variant?: 'card' | 'inline' | 'container';
  showIcon?: boolean;
}

export default function LoadingState({
  title,
  className = '',
  variant = 'card',
  showIcon = true,
}: LoadingStateProps) {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // Rotating SPOT brand loading messages (i18n keys)
  const messages = [
    t('loadingMsg1'),
    t('loadingMsg2'),
    t('loadingMsg3'),
    t('loadingMsg4'),
    t('loadingMsg5'),
  ];

  useEffect(() => {
    // Rotate message every 2.5 seconds with 300ms smooth fade out/in
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % messages.length);
        setFade(true);
      }, 300);
    }, 2500);

    // Immediate cleanup on component unmount / loading finish
    return () => clearInterval(interval);
  }, [messages.length]);

  const currentMsg = messages[index] || messages[0];

  if (variant === 'inline') {
    return (
      <div className={`inline-flex items-center gap-2 text-zinc-400 font-medium text-xs ${className}`}>
        {showIcon && <Loader2 className="w-3.5 h-3.5 animate-spin text-orange-400 shrink-0" />}
        <span
          className={`transition-opacity duration-300 ${
            fade ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {currentMsg}
        </span>
      </div>
    );
  }

  if (variant === 'container') {
    return (
      <div className={`w-full h-full min-h-[350px] bg-zinc-950/90 rounded-3xl border border-zinc-800 flex flex-col items-center justify-center p-8 space-y-4 shadow-2xl backdrop-blur-md ${className}`}>
        {showIcon && (
          <div className="w-12 h-12 rounded-full bg-orange-950/80 border border-orange-800/80 flex items-center justify-center text-orange-400 shadow-lg">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        )}
        <div className="space-y-1.5 text-center max-w-sm mx-auto">
          {title && <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>}
          <p
            className={`text-xs text-zinc-400 font-medium transition-opacity duration-300 min-h-[1.5rem] flex items-center justify-center ${
              fade ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {currentMsg}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-12 text-center bg-[#18181b]/80 rounded-3xl border border-zinc-800 space-y-4 shadow-xl backdrop-blur-sm ${className}`}
    >
      {showIcon && (
        <div className="w-12 h-12 rounded-full bg-orange-950/80 border border-orange-800/80 flex items-center justify-center mx-auto text-orange-400 shadow-md">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      )}
      <div className="space-y-1.5 max-w-sm mx-auto">
        {title && <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>}
        <p
          className={`text-xs text-zinc-400 font-medium transition-opacity duration-300 min-h-[1.5rem] flex items-center justify-center ${
            fade ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {currentMsg}
        </p>
      </div>
    </div>
  );
}
