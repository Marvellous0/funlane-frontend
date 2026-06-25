'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FunlaneLogo, IconCheck, IconLock } from '@/components/ui';
import { Shield, MapPin, Check } from 'lucide-react';


const HERO_FEATURES = [
  { icon: Shield, title: 'NDPA Compliant', desc: 'Encrypted, enterprise-grade security.' },
  { icon: MapPin, title: 'Real-time Tracking', desc: 'Follow every request end to end.' },
];

export function VerificationContainer() {
  const router = useRouter();
  const [verified, setVerified] = useState(false);
  const [email, setEmail] = useState('');

  // The verification email may link here as `/verify?token=…&email=…`.
  // If a token is present we confirm it automatically; otherwise the user
  // types the code they received.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const linkEmail = params.get('email');
    const linkToken = params.get('token');
    if (linkEmail) setEmail(linkEmail);
    if (linkToken) void confirm(linkToken);
  }, []);


  return (
    <div className="auth-wrap auth-geist">
      <div className="auth-split animate-scale-in">
        {/* Hero panel */}
        <div className="auth-hero">
          <FunlaneLogo tone="light" markClassName="w-10 h-10" />

          <div>
            <h2 className="text-3xl xl:text-4xl font-bold leading-tight tracking-tight text-white mb-4 max-w-sm">
              Identity,
              <br />
              Confirmed.
            </h2>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs mb-8">
              The gold standard in corporate travel and logistics. Your precision-engineered portal ensures every
              movement is managed with absolute transparency.
            </p>
            <div className="grid grid-cols-2 gap-3 max-w-sm">
              {HERO_FEATURES.map((f) => (
                <div key={f.title} className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <f.icon aria-hidden="true" className="w-5 h-5 text-white" />
                  <div className="font-semibold text-sm text-white mt-2">{f.title}</div>
                  <div className="text-[11px] text-white/50 mt-0.5 leading-snug">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Form panel */}
        <div className="auth-form-side text-center">
          <div className="w-full max-w-sm mx-auto">
            {verified ? (
              <div className="text-center">
                <div aria-hidden="true" className="w-14 h-14 rounded-full bg-green-soft text-green flex items-center justify-center mx-auto mb-4">
                  <Check className="w-7 h-7" />
                </div>
                <h1 className="text-2xl font-bold text-ink mb-2">Email verified</h1>
                <p className="text-ink-3 text-sm mb-6 leading-relaxed">
                  Your account is now active. You can sign in and start managing your travel.
                </p>
                <button onClick={() => router.push('/login')} className="auth-btn">
                  Go to sign in
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold text-ink mb-2 text-left">Verify your account</h1>
                <p className="text-ink-3 text-sm mb-6 leading-relaxed text-left">
                  We&apos;ve sent a verification link to{' '}
                  {email ? <strong className="text-ink">{email}</strong> : 'your registered email address'}.
                </p>

                <div className="mt-8 pt-6 border-t border-line flex items-center justify-center gap-5 text-[11px] text-ink-3">
                  <span className="inline-flex items-center gap-1.5">
                    <IconLock className="w-3.5 h-3.5 text-ink-3" /> Secure encryption
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <IconCheck className="w-3.5 h-3.5 text-green" /> NDPA compliant
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
