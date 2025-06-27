
"use client";

import React from 'react';
import { Droplets } from 'lucide-react';

interface RadialGaugeProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
}

const RadialGauge = ({ value, size = 250, strokeWidth = 20 }: RadialGaugeProps) => {
  const center = size / 2;
  const radius = center - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  
  const arcLength = circumference * 0.75; // 270 degrees
  const valueSanitized = Math.min(Math.max(value, 0), 100);
  const dashOffset = arcLength - (arcLength * valueSanitized) / 100;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="transform rotate-[135deg]">
        {/* Background Arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="hsl(var(--muted) / 0.2)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
        />
        {/* Value Arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="transparent"
          stroke="hsl(var(--accent))"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease 0s' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Droplets className="h-10 w-10 text-accent mb-2" />
        <span className="text-5xl font-bold text-foreground">{Math.round(valueSanitized)}%</span>
      </div>
    </div>
  );
};

export default RadialGauge;
