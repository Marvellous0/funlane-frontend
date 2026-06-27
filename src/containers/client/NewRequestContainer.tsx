'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { requestsApi, ApiError } from '@/api';
import { AIRLINES } from '@/lib/constants';
import { BUDGET_TIERS } from '@/services/requestView';
import { validateSchema, type FieldErrors } from '@/lib/validation/validate';
import { newRequestSchema } from '@/lib/validation/schemas';
import type { ApiBudgetTier, PassengerInput } from '@/interface';
import { toast } from 'react-toastify';
import { PageHeader } from '@/components/ui';
import { Plus, X, Upload, PlaneTakeoff } from 'lucide-react';

const fieldClass =
  'w-full px-4 py-3 bg-surface border border-line rounded-xl text-sm text-ink placeholder:text-ink-3/70 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-soft focus:bg-white transition-colors';
const labelClass = 'block text-[11px] uppercase font-semibold text-ink-3 tracking-wide mb-1.5';
const errorClass = 'mt-1.5 text-xs text-red-dark';

interface PassengerRow extends PassengerInput {
  file: File | null;
}

const emptyPassenger = (): PassengerRow => ({
  fullName: '',
  passportNumber: '',
  nationality: '',
  passportExpiry: '',
  dateOfBirth: '',
  file: null,
});

type TopFields = { origin: string; destination: string; departureDate: string; budgetTier: string };

export function NewRequestContainer() {
  const router = useRouter();

  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [tripType, setTripType] = useState<'oneway' | 'round'>('oneway');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [preferredAirline, setPreferredAirline] = useState(AIRLINES[0]);
  const [preferredTime, setPreferredTime] = useState('Any time');
  const [budgetTier, setBudgetTier] = useState<ApiBudgetTier>('ECONOMY');
  const [passengers, setPassengers] = useState<PassengerRow[]>([emptyPassenger()]);
  const [errors, setErrors] = useState<FieldErrors<TopFields>>({});
  const [paxError, setPaxError] = useState('');
  const [busy, setBusy] = useState(false);

  function updatePax(i: number, patch: Partial<PassengerRow>) {
    setPassengers((list) => list.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));
  }
  function addPassenger() {
    setPassengers((list) => [...list, emptyPassenger()]);
  }
  function removePassenger(i: number) {
    setPassengers((list) => (list.length === 1 ? list : list.filter((_, idx) => idx !== i)));
  }

  function validatePassengers(): boolean {
    for (const p of passengers) {
      if (!p.fullName.trim() || !p.passportNumber.trim() || !p.nationality.trim() || !p.passportExpiry || !p.dateOfBirth) {
        setPaxError('Every passenger needs a full name, passport number, nationality, expiry and date of birth.');
        return false;
      }
      if (!p.file) {
        setPaxError('Each passenger requires a passport scan (JPEG, PNG or PDF).');
        return false;
      }
    }
    setPaxError('');
    return true;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { errors: invalid } = await validateSchema(newRequestSchema, {
      origin,
      destination,
      departureDate,
      budgetTier,
    });
    if (invalid) {
      setErrors(invalid);
      return;
    }
    setErrors({});
    if (!validatePassengers()) return;

    setBusy(true);
    try {
      const { request } = await requestsApi.createRequest({
        origin: origin.trim(),
        destination: destination.trim(),
        departureDate,
        returnDate: tripType === 'round' ? returnDate : undefined,
        budgetTier,
        preferredAirline: preferredAirline === 'No preference' ? undefined : preferredAirline,
        preferredTime: preferredTime === 'Any time' ? undefined : preferredTime,
        passengers: passengers.map(({ file, ...p }) => p),
        passportDocs: passengers.map((p) => p.file as File),
      });
      toast.success(`Request submitted for ${request.origin} → ${request.destination}.`);
      router.push('/client/requests');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not submit your request. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <PageHeader
        variant="plain"
        eyebrow="New request"
        eyebrowIcon={PlaneTakeoff}
        title="Create a travel request"
        subtitle="Provide your trip details and we'll prepare a tailored quotation."
      />

      <form onSubmit={onSubmit} className="space-y-5">
        <Section step={1} title="Route &amp; trip type">
          <div role="radiogroup" aria-label="Trip type" className="inline-flex p-1 bg-surface border border-line rounded-xl">
            <button type="button" role="radio" aria-checked={tripType === 'oneway'} onClick={() => setTripType('oneway')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tripType === 'oneway' ? 'bg-white text-brand shadow-sm' : 'text-ink-3 hover:text-ink'}`}>One way</button>
            <button type="button" role="radio" aria-checked={tripType === 'round'} onClick={() => setTripType('round')}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${tripType === 'round' ? 'bg-white text-brand shadow-sm' : 'text-ink-3 hover:text-ink'}`}>Round trip</button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="from" className={labelClass}>Origin city</label>
              <input id="from" value={origin} onChange={(e) => setOrigin(e.target.value)} placeholder="e.g. Lagos (LOS)" className={fieldClass} />
              {errors.origin && <p className={errorClass}>{errors.origin}</p>}
            </div>
            <div>
              <label htmlFor="to" className={labelClass}>Destination</label>
              <input id="to" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g. Abuja (ABV)" className={fieldClass} />
              {errors.destination && <p className={errorClass}>{errors.destination}</p>}
            </div>
          </div>
        </Section>

        <Section step={2} title="Schedule &amp; budget">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="depart" className={labelClass}>Departure date</label>
              <input id="depart" type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} className={fieldClass} />
              {errors.departureDate && <p className={errorClass}>{errors.departureDate}</p>}
            </div>
            {tripType === 'round' && (
              <div className="animate-fade-in">
                <label htmlFor="return" className={labelClass}>Return date</label>
                <input id="return" type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className={fieldClass} />
              </div>
            )}
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="airline" className={labelClass}>Preferred airline</label>
              <select id="airline" value={preferredAirline} onChange={(e) => setPreferredAirline(e.target.value)} className={fieldClass}>
                {AIRLINES.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="time" className={labelClass}>Preferred time</label>
              <select id="time" value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)} className={fieldClass}>
                <option value="Any time">No preference</option>
                <option value="Morning">Morning (6AM – 12PM)</option>
                <option value="Afternoon">Afternoon (12PM – 6PM)</option>
                <option value="Evening">Evening (after 6PM)</option>
              </select>
            </div>
            <div>
              <label htmlFor="cabin" className={labelClass}>Cabin class</label>
              <select id="cabin" value={budgetTier} onChange={(e) => setBudgetTier(e.target.value as ApiBudgetTier)} className={fieldClass}>
                {BUDGET_TIERS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>
        </Section>

        <Section step={3} title="Passengers" action={
          <button type="button" onClick={addPassenger}
            className="inline-flex items-center gap-1.5 text-brand font-semibold text-sm bg-brand-soft px-3.5 py-2 rounded-lg hover:bg-brand hover:text-white transition-colors">
            <Plus aria-hidden="true" className="w-4 h-4" /> Add passenger
          </button>
        }>
          <div className="space-y-3">
            {passengers.map((p, i) => (
              <div key={i} className="p-4 bg-surface border border-line rounded-xl relative">
                {passengers.length > 1 && (
                  <button type="button" onClick={() => removePassenger(i)} aria-label={`Remove passenger ${i + 1}`}
                    className="absolute top-3 right-3 w-7 h-7 bg-white text-red border border-line rounded-lg flex items-center justify-center hover:bg-red-soft hover:border-red/30 transition-colors">
                    <X aria-hidden="true" className="w-4 h-4" />
                  </button>
                )}
                <div className="grid sm:grid-cols-2 gap-4 pr-8">
                  <div>
                    <label htmlFor={`name-${i}`} className={labelClass}>Full name</label>
                    <input id={`name-${i}`} value={p.fullName} onChange={(e) => updatePax(i, { fullName: e.target.value })} placeholder="Jane Doe" className={`${fieldClass} bg-white`} />
                  </div>
                  <div>
                    <label htmlFor={`passport-${i}`} className={labelClass}>Passport number</label>
                    <input id={`passport-${i}`} value={p.passportNumber} onChange={(e) => updatePax(i, { passportNumber: e.target.value })} placeholder="A00000000" className={`${fieldClass} bg-white`} />
                  </div>
                  <div>
                    <label htmlFor={`nat-${i}`} className={labelClass}>Nationality</label>
                    <input id={`nat-${i}`} value={p.nationality} onChange={(e) => updatePax(i, { nationality: e.target.value })} placeholder="Nigerian" className={`${fieldClass} bg-white`} />
                  </div>
                  <div>
                    <label htmlFor={`dob-${i}`} className={labelClass}>Date of birth</label>
                    <input id={`dob-${i}`} type="date" value={p.dateOfBirth} onChange={(e) => updatePax(i, { dateOfBirth: e.target.value })} className={`${fieldClass} bg-white`} />
                  </div>
                  <div>
                    <label htmlFor={`exp-${i}`} className={labelClass}>Passport expiry</label>
                    <input id={`exp-${i}`} type="date" value={p.passportExpiry} onChange={(e) => updatePax(i, { passportExpiry: e.target.value })} className={`${fieldClass} bg-white`} />
                  </div>
                  <div>
                    <label htmlFor={`doc-${i}`} className={labelClass}>Passport scan</label>
                    <label htmlFor={`doc-${i}`} className={`${fieldClass} bg-white flex items-center gap-2 cursor-pointer truncate`}>
                      <Upload aria-hidden="true" className="w-4 h-4 text-ink-3 shrink-0" />
                      <span className={`truncate ${p.file ? 'text-ink' : 'text-ink-3/70'}`}>{p.file ? p.file.name : 'Upload JPEG/PNG/PDF'}</span>
                    </label>
                    <input id={`doc-${i}`} type="file" accept="image/jpeg,image/png,application/pdf" className="sr-only"
                      onChange={(e) => updatePax(i, { file: e.target.files?.[0] ?? null })} />
                  </div>
                </div>
              </div>
            ))}
          </div>
          {paxError && <p className="mt-3 text-xs text-red-dark">{paxError}</p>}
        </Section>

        <div className="space-y-3">
          <button type="submit" disabled={busy}
            className="w-full bg-brand text-white py-3.5 rounded-xl font-semibold text-base hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
            {busy ? 'Submitting…' : 'Submit request'}
          </button>
          <p className="text-center text-xs text-ink-3">Our team will review your request and provide quotation options shortly.</p>
        </div>
      </form>
    </div>
  );
}

function Section({ step, title, action, children }: { step: number; title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl border border-line shadow-card p-6 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-brand-soft text-brand flex items-center justify-center text-sm font-semibold">{step}</span>
          <h2 className="text-base font-semibold text-ink">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
