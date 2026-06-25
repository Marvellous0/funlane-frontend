'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { useRequests } from '@/hooks/useRequests';
import { useToast } from '@/hooks/useToast';
import { AIRLINES, BUDGET_TIERS } from '@/lib/constants';
import type { TripType, PreferredTime, Passenger } from '@/interface';
import { AlertTriangle, Plus, X } from 'lucide-react';

const fieldClass =
  'w-full px-4 py-3 bg-surface border border-line rounded-xl text-sm text-ink placeholder:text-ink-3/70 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-soft focus:bg-white transition-colors';
const labelClass = 'block text-[11px] uppercase font-semibold text-ink-3 tracking-wide mb-1.5';

export function NewRequestContainer() {
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id) ?? '';
  const { createRequest } = useRequests();
  const { toast } = useToast();

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [tripType, setTripType] = useState<TripType>('oneway');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [preferredAirline, setPreferredAirline] = useState(AIRLINES[0]);
  const [preferredTime, setPreferredTime] = useState<PreferredTime>('Any time');
  const [budgetTier, setBudgetTier] = useState(BUDGET_TIERS[0].key);
  const [passengers, setPassengers] = useState<Passenger[]>([{ first: '', last: '', passport: '', dob: '' }]);
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!from || !to || !departDate) {
      toast({ title: 'Missing fields', icon: AlertTriangle, msg: 'Route and date are required.' });
      return;
    }
    setBusy(true);
    await createRequest(
      {
        from,
        to,
        tripType,
        departDate,
        returnDate: tripType === 'round' ? returnDate : '',
        preferredAirline,
        preferredTime,
        budgetTier,
        passengers,
        notes,
      },
      userId
    );
    setBusy(false);
    router.push('/client/dashboard');
  }

  function addPassenger() {
    setPassengers([...passengers, { first: '', last: '', passport: '', dob: '' }]);
  }

  function removePassenger(i: number) {
    if (passengers.length === 1) return;
    setPassengers(passengers.filter((_, idx) => idx !== i));
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-ink">Create a travel request</h1>
        <p className="text-ink-3 text-sm mt-1">Provide your trip details and we&apos;ll prepare a tailored quotation.</p>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        {/* Trip route & type */}
        <Section step={1} title="Route &amp; trip type">
          <div
            role="radiogroup"
            aria-label="Trip type"
            className="inline-flex p-1 bg-surface border border-line rounded-xl"
          >
            <button
              type="button"
              role="radio"
              aria-checked={tripType === 'oneway'}
              onClick={() => setTripType('oneway')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                tripType === 'oneway' ? 'bg-white text-brand shadow-sm' : 'text-ink-3 hover:text-ink'
              }`}
            >
              One way
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={tripType === 'round'}
              onClick={() => setTripType('round')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
                tripType === 'round' ? 'bg-white text-brand shadow-sm' : 'text-ink-3 hover:text-ink'
              }`}
            >
              Round trip
            </button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="from" className={labelClass}>Origin city</label>
              <input id="from" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="e.g. Lagos (LOS)" required className={fieldClass} />
            </div>
            <div>
              <label htmlFor="to" className={labelClass}>Destination</label>
              <input id="to" value={to} onChange={(e) => setTo(e.target.value)} placeholder="e.g. Abuja (ABV)" required className={fieldClass} />
            </div>
          </div>
        </Section>

        {/* Schedule & budget */}
        <Section step={2} title="Schedule &amp; budget">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="depart" className={labelClass}>Departure date</label>
              <input id="depart" type="date" value={departDate} onChange={(e) => setDepartDate(e.target.value)} required className={fieldClass} />
            </div>
            {tripType === 'round' && (
              <div className="animate-fade-in">
                <label htmlFor="return" className={labelClass}>Return date</label>
                <input id="return" type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} required className={fieldClass} />
              </div>
            )}
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="airline" className={labelClass}>Preferred airline</label>
              <select id="airline" value={preferredAirline} onChange={(e) => setPreferredAirline(e.target.value)} className={fieldClass}>
                {AIRLINES.map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="time" className={labelClass}>Preferred time</label>
              <select id="time" value={preferredTime} onChange={(e) => setPreferredTime(e.target.value as PreferredTime)} className={fieldClass}>
                <option value="Any time">No preference</option>
                <option value="Morning">Morning (6AM – 12PM)</option>
                <option value="Afternoon">Afternoon (12PM – 6PM)</option>
                <option value="Evening">Evening (after 6PM)</option>
              </select>
            </div>
            <div>
              <label htmlFor="cabin" className={labelClass}>Cabin class</label>
              <select id="cabin" value={budgetTier} onChange={(e) => setBudgetTier(e.target.value as any)} className={fieldClass}>
                {BUDGET_TIERS.map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Section>

        {/* Passengers */}
        <Section
          step={3}
          title="Passengers"
          action={
            <button
              type="button"
              onClick={addPassenger}
              className="inline-flex items-center gap-1.5 text-brand font-semibold text-sm bg-brand-soft px-3.5 py-2 rounded-lg hover:bg-brand hover:text-white transition-colors"
            >
              <Plus aria-hidden="true" className="w-4 h-4" /> Add passenger
            </button>
          }
        >
          <div className="space-y-3">
            {passengers.map((p, i) => (
              <div key={i} className="p-4 bg-surface border border-line rounded-xl relative">
                {passengers.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePassenger(i)}
                    aria-label={`Remove passenger ${i + 1}`}
                    className="absolute top-3 right-3 w-7 h-7 bg-white text-red border border-line rounded-lg flex items-center justify-center hover:bg-red-soft hover:border-red/30 transition-colors"
                  >
                    <X aria-hidden="true" className="w-4 h-4" />
                  </button>
                )}
                <div className="grid sm:grid-cols-3 gap-4 pr-8">
                  <div>
                    <label htmlFor={`first-${i}`} className={labelClass}>First name</label>
                    <input
                      id={`first-${i}`}
                      value={p.first}
                      onChange={(e) => {
                        const n = [...passengers];
                        n[i].first = e.target.value;
                        setPassengers(n);
                      }}
                      placeholder="Jane"
                      required
                      className={`${fieldClass} bg-white`}
                    />
                  </div>
                  <div>
                    <label htmlFor={`last-${i}`} className={labelClass}>Last name</label>
                    <input
                      id={`last-${i}`}
                      value={p.last}
                      onChange={(e) => {
                        const n = [...passengers];
                        n[i].last = e.target.value;
                        setPassengers(n);
                      }}
                      placeholder="Doe"
                      required
                      className={`${fieldClass} bg-white`}
                    />
                  </div>
                  <div>
                    <label htmlFor={`passport-${i}`} className={labelClass}>Passport no.</label>
                    <input
                      id={`passport-${i}`}
                      value={p.passport}
                      onChange={(e) => {
                        const n = [...passengers];
                        n[i].passport = e.target.value;
                        setPassengers(n);
                      }}
                      placeholder="A00000000"
                      required
                      className={`${fieldClass} bg-white`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Notes */}
        <section className="bg-white rounded-2xl border border-line shadow-card p-6">
          <label htmlFor="notes" className={labelClass}>Additional requirements (optional)</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Extra baggage, wheelchair assistance, aisle seat preference…"
            className={`${fieldClass} min-h-[110px] resize-y`}
          />
        </section>

        <div className="space-y-3">
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-brand text-white py-3.5 rounded-xl font-semibold text-base hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {busy ? 'Submitting…' : 'Submit request'}
          </button>
          <p className="text-center text-xs text-ink-3">
            Our team will review your request and provide quotation options within 30 minutes.
          </p>
        </div>
      </form>
    </div>
  );
}

function Section({
  step,
  title,
  action,
  children,
}: {
  step: number;
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl border border-line shadow-card p-6 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-brand-soft text-brand flex items-center justify-center text-sm font-semibold">
            {step}
          </span>
          <h2 className="text-base font-semibold text-ink">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
