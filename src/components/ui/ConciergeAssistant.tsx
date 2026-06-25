'use client';

import { useState } from 'react';
import { Send, X, MessageCircle } from 'lucide-react';

export function ConciergeAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="hidden lg:flex fixed bottom-6 right-6 z-[100] flex-col items-end gap-3">
      {/* Chat window */}
      {isOpen && (
        <div className="w-[360px] bg-white rounded-2xl shadow-lg border border-line overflow-hidden animate-scale-in flex flex-col">
          {/* Header */}
          <div className="bg-navy p-5 text-white">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center text-white text-sm font-semibold">
                FC
              </div>
              <div>
                <h3 className="text-sm font-semibold">Funlane Concierge</h3>
                <p className="text-white/60 text-[11px] flex items-center gap-1.5">
                  <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-green" />
                  Online · Lagos office
                </p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 p-5 min-h-[240px] bg-surface space-y-4 overflow-y-auto">
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-brand flex items-center justify-center text-white text-[10px] font-semibold shrink-0">
                FC
              </div>
              <div className="bg-white p-3 rounded-xl rounded-tl-none border border-line">
                <p className="text-ink-2 text-xs leading-relaxed">
                  Hi there — I&apos;m your travel coordinator. How can I help with your itinerary or a new request?
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {['Flight status', 'Reservations', 'Lounge access'].map((a) => (
                <button
                  key={a}
                  className="bg-white px-3 py-1.5 rounded-full border border-line text-[11px] font-medium text-ink-2 hover:border-brand hover:text-brand transition-colors"
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-3 border-t border-line bg-white">
            <div className="relative">
              <input
                type="text"
                aria-label="Message the concierge"
                placeholder="Type a message…"
                className="w-full pl-4 pr-11 py-3 bg-surface rounded-xl border border-line text-xs focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-soft transition-all"
              />
              <button
                aria-label="Send message"
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-brand text-white flex items-center justify-center hover:bg-brand-dark transition-colors"
              >
                <Send size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Close concierge chat' : 'Open concierge chat'}
        aria-expanded={isOpen}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors ${
          isOpen ? 'bg-white text-ink border border-line' : 'bg-brand text-white hover:bg-brand-dark'
        }`}
      >
        <span aria-hidden="true" className="flex items-center justify-center">
          {isOpen ? <X size={24} /> : <MessageCircle size={28} fill="currentColor" />}
        </span>
      </button>
    </div>
  );
}
