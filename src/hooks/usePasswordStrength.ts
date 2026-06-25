'use client';

import { useState, useEffect } from 'react';

export interface StrengthResult {
  score: number; // 0-4
  label: string;
  color: string;
  met: {
    length: boolean;
    mixed: boolean;
    special: boolean;
  };
}

export function usePasswordStrength(password: string): StrengthResult {
  const [result, setResult] = useState<StrengthResult>({
    score: 0,
    label: 'Too Short',
    color: 'bg-red',
    met: { length: false, mixed: false, special: false },
  });

  useEffect(() => {
    let score = 0;
    const met = {
      length: password.length >= 8,
      mixed: /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    if (met.length) score += 1;
    if (met.mixed) score += 2;
    if (met.special) score += 1;

    let label = 'Weak';
    let color = 'bg-red';

    if (score >= 4) {
      label = 'Strong';
      color = 'bg-green';
    } else if (score >= 2) {
      label = 'Good';
      color = 'bg-amber';
    }

    setResult({ score, label, color, met });
  }, [password]);

  return result;
}
