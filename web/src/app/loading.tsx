'use client';

import { Radio, Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary via-secondary/95 to-secondary/90">
      <div className="text-center space-y-6">
        {/* Animated Radio Icon */}
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 rounded-full blur-2xl opacity-50 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-primary to-primary/80 p-6 rounded-full">
            <Radio className="w-16 h-16 text-secondary animate-pulse" />
          </div>
        </div>

        {/* Loading Text */}
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">Tuning In...</h2>
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 text-primary animate-spin" />
            <p className="text-white/70">Loading Ecko Media</p>
          </div>
        </div>

        {/* Animated Wave */}
        <div className="flex items-center justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-primary rounded-full animate-wave"
              style={{
                height: '40px',
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
