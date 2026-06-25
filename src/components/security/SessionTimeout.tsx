'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Hourglass } from 'lucide-react';
import { Modal } from '@/components/ui';

const IDLE_LIMIT = 10 * 60 * 1000; // 10 minutes
const WARNING_THRESHOLD = 9 * 60 * 1000; // 9 minutes

export function SessionTimeout() {
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const lastActivity = useRef(Date.now());
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout>(null);
  const countdownRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    function resetTimer() {
      lastActivity.current = Date.now();
      if (showWarning) {
        setShowWarning(false);
        setTimeLeft(60);
      }
    }

    // List of events to track activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(e => window.addEventListener(e, resetTimer));

    const checkIdle = setInterval(() => {
      const now = Date.now();
      const idleTime = now - lastActivity.current;

      if (idleTime >= IDLE_LIMIT) {
        handleLogout();
      } else if (idleTime >= WARNING_THRESHOLD && !showWarning) {
        setShowWarning(true);
      }
    }, 1000);

    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      clearInterval(checkIdle);
      if (timerRef.current) clearInterval(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [showWarning]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showWarning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleLogout();
    }
    return () => clearInterval(interval);
  }, [showWarning, timeLeft]);

  function handleLogout() {
    // Clear any auth state here if needed
    router.push('/login?reason=timeout');
  }

  function stayLoggedIn() {
    lastActivity.current = Date.now();
    setShowWarning(false);
    setTimeLeft(60);
  }

  if (!showWarning) return null;

  return (
    <Modal 
      open={true} 
      onClose={stayLoggedIn}
      title="Session Timeout Warning"
    >
      <div className="text-center py-2">
        <div aria-hidden="true" className="w-14 h-14 bg-red-soft text-red rounded-full flex items-center justify-center mx-auto mb-5">
          <Hourglass className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-semibold text-ink mb-2">Are you still there?</h3>
        <p className="text-sm text-ink-3 mb-6 leading-relaxed">
          For your security, your session will expire due to inactivity in{' '}
          <span className="text-red font-semibold tabular-nums">{timeLeft} seconds</span>.
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            onClick={stayLoggedIn}
            className="w-full py-3 bg-brand text-white font-semibold text-sm rounded-xl hover:bg-brand-dark transition-colors"
          >
            Stay logged in
          </button>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 text-ink-3 font-medium text-sm hover:text-red transition-colors"
          >
            Log out now
          </button>
        </div>
      </div>
    </Modal>
  );
}
