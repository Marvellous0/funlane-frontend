'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { FlightOption } from '@/interface';
import { usePortalStore } from '@/store/usePortalStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRequests } from '@/hooks/useRequests';
import { useToast } from '@/hooks/useToast';
import { StatusBadge, ProgressSteps, Timeline, Modal, EmptyState } from '@/components/ui';
import { fmtNaira, fmtDate, initials } from '@/utils/format';
import { routeText, tierLabel } from '@/utils/request.utils';
import {
  HelpCircle, Ban, AlertTriangle, ChevronLeft, Plane, Lightbulb, MapPin,
  Repeat, Calendar, Undo2, PlaneTakeoff, Coins, StickyNote, Lock,
} from 'lucide-react';
import type { ElementType } from 'react';

export function ClientRequestDetailContainer({ id }: { id: string }) {
  const router = useRouter();
  const userId = useAuthStore((s) => s.user?.id) ?? '';
  const requests = usePortalStore((s) => s.requests);
  const clients = usePortalStore((s) => s.clients);
  const { approveOption, rejectRequest } = useRequests();
  const { toast } = useToast();

  const r = requests.find((x) => x.id === id);
  const client = clients.find((c) => c.id === r?.clientId);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState<FlightOption | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [busy, setBusy] = useState(false);

  if (!r || !client) return <EmptyState icon={HelpCircle}>Request not found.</EmptyState>;
  if (r.clientId !== userId) return <EmptyState icon={Ban}>Access denied.</EmptyState>;

  async function handleApprove() {
    if (!selectedOpt) return;
    setBusy(true);
    const result = await approveOption(r!, selectedOpt.id);
    setBusy(false);
    if (result.ok) {
      setConfirmOpen(false);
    } else {
      toast({ title: 'Could not approve', icon: AlertTriangle, msg: 'Please check your wallet balance.' });
    }
  }

  async function handleReject() {
    if (!rejectReason) {
      toast({ title: 'Please provide a reason', icon: AlertTriangle });
      return;
    }
    setBusy(true);
    await rejectRequest(r!.id, rejectReason);
    setBusy(false);
    setRejectOpen(false);
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <Link
        href="/client/requests"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-3 hover:text-brand transition-colors"
      >
        <ChevronLeft aria-hidden="true" className="w-4 h-4" /> Back to my requests
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-line shadow-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div aria-hidden="true" className="w-12 h-12 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0">
          <Plane className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-bold text-ink">{routeText(r)}</h1>
            <StatusBadge status={r.status} />
          </div>
          <p className="text-ink-3 text-sm mt-1">
            Ref <span className="font-medium text-ink-2">{r.ref}</span> · Submitted {fmtDate(r.createdAt)}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl border border-line shadow-card p-5 overflow-x-auto">
        <ProgressSteps status={r.status} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          {/* Options */}
          {r.status === 'quoted' && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-ink">Travel options</h2>
                <span className="text-xs font-semibold text-purple bg-purple-soft px-2.5 py-1 rounded-full">
                  Awaiting review
                </span>
              </div>

              <div className="grid gap-3">
                {r.options.map((o) => (
                  <div key={o.id} className="bg-white rounded-2xl border border-line p-5 hover:border-brand/40 hover:shadow-card transition-all">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-surface flex items-center justify-center text-sm font-semibold text-ink-2 border border-line">
                          {initials(o.airline)}
                        </div>
                        <div>
                          <div className="font-semibold text-ink">{o.airline}</div>
                          <div className="text-xs text-ink-3 mt-0.5">Flight {o.flightNo}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div>
                          <div className="text-[11px] uppercase tracking-wide text-ink-3 mb-0.5">Depart</div>
                          <div className="font-semibold text-ink">{o.depart}</div>
                        </div>
                        <div aria-hidden="true" className="flex items-center gap-1 text-ink-3">
                          <span className="w-6 h-px bg-line" />
                          <Plane className="w-3.5 h-3.5" />
                          <span className="w-6 h-px bg-line" />
                        </div>
                        <div>
                          <div className="text-[11px] uppercase tracking-wide text-ink-3 mb-0.5">Arrive</div>
                          <div className="font-semibold text-ink">{o.arrive}</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:flex-col md:items-end gap-3 border-t md:border-t-0 border-line pt-3 md:pt-0">
                        <div className="text-lg font-bold text-brand">{fmtNaira(o.price)}</div>
                        <button
                          onClick={() => {
                            setSelectedOpt(o);
                            setConfirmOpen(true);
                          }}
                          className="bg-brand text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-brand-dark transition-colors"
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                    {o.notes && (
                      <div className="mt-3 pt-3 border-t border-line text-xs text-ink-3 flex items-center gap-1.5">
                        <Lightbulb aria-hidden="true" className="w-3.5 h-3.5 shrink-0" />{o.notes}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="bg-surface rounded-xl p-5 text-center border border-line">
                <p className="text-ink-2 text-sm mb-2">Don&apos;t see something you like?</p>
                <button onClick={() => setRejectOpen(true)} className="text-red font-semibold text-sm hover:underline">
                  Request different options
                </button>
              </div>
            </section>
          )}

          {/* Details */}
          <section className="bg-white rounded-2xl border border-line shadow-card p-6">
            <h2 className="text-lg font-semibold text-ink mb-5">Booking details</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <DetailGroup label="Travel route" value={routeText(r)} icon={MapPin} />
              <DetailGroup label="Trip type" value={r.tripType === 'round' ? 'Round trip' : 'One way'} icon={Repeat} />
              <DetailGroup label="Departure date" value={`${fmtDate(r.departDate)} (${r.preferredTime})`} icon={Calendar} />
              <DetailGroup label="Return date" value={r.returnDate ? fmtDate(r.returnDate) : 'N/A'} icon={Undo2} />
              <DetailGroup label="Preferred airline" value={r.preferredAirline} icon={PlaneTakeoff} />
              <DetailGroup label="Budget tier" value={tierLabel(r.budgetTier)} icon={Coins} />

              <div className="sm:col-span-2">
                <div className="text-[11px] uppercase font-semibold text-ink-3 tracking-wide mb-2">Passengers</div>
                <div className="space-y-2">
                  {r.passengers.map((p, i) => (
                    <div key={i} className="flex items-center gap-3 bg-surface rounded-lg p-3 border border-line">
                      <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center font-semibold text-xs border border-line">
                        {i + 1}
                      </div>
                      <div>
                        <div className="font-medium text-ink text-sm">
                          {p.first} {p.last}
                        </div>
                        <div className="text-xs text-ink-3">
                          Passport: <span className="font-mono">{p.passport}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {r.notes && (
                <div className="sm:col-span-2 bg-blue-soft text-blue-dark p-4 rounded-lg text-sm flex items-start gap-2">
                  <StickyNote aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>Notes: {r.notes}</span>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Side column */}
        <aside className="space-y-6">
          <div className="bg-gradient-to-br from-navy-light to-navy text-white rounded-2xl p-6">
            <div className="text-[11px] uppercase tracking-wide text-white/50 mb-1.5">My wallet</div>
            <div className="text-2xl font-bold mb-4">{fmtNaira(client.wallet)}</div>
            <div className="flex items-center gap-2 text-xs text-white/70 border-t border-white/10 pt-4">
              <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-green" />
              Sufficient for bookings
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-ink">Timeline</h3>
            <Timeline history={r.history} />
          </div>
        </aside>
      </div>

      {/* Confirm approval */}
      <Modal
        open={confirmOpen}
        title="Confirm approval"
        onClose={() => setConfirmOpen(false)}
        footer={
          <div className="flex gap-3 w-full">
            <button className="flex-1 py-2.5 bg-white border border-line text-ink font-medium text-sm rounded-lg hover:bg-surface transition-colors" onClick={() => setConfirmOpen(false)}>
              Cancel
            </button>
            <button className="flex-1 py-2.5 bg-brand text-white font-semibold text-sm rounded-lg hover:bg-brand-dark transition-colors disabled:opacity-50" onClick={handleApprove} disabled={busy}>
              {busy ? 'Processing…' : 'Secure & approve'}
            </button>
          </div>
        }
      >
        <div className="text-center py-2">
          <p className="text-sm text-ink-2 mb-4 leading-relaxed">
            You&apos;re approving the <span className="font-semibold text-ink">{selectedOpt?.airline}</span> flight for{' '}
            <span className="font-semibold text-ink">{fmtNaira(selectedOpt?.price || 0)}</span>.
          </p>
          <div className="bg-brand-soft p-3.5 rounded-lg text-brand text-sm font-medium flex items-start gap-2">
            <Lock aria-hidden="true" className="w-4 h-4 mt-0.5 shrink-0" />
            <span>This locks the exact amount in your wallet until the ticket is issued.</span>
          </div>
        </div>
      </Modal>

      {/* Request alternatives */}
      <Modal
        open={rejectOpen}
        title="Request alternatives"
        onClose={() => setRejectOpen(false)}
        footer={
          <div className="flex gap-3 w-full">
            <button className="flex-1 py-2.5 bg-white border border-line text-ink font-medium text-sm rounded-lg hover:bg-surface transition-colors" onClick={() => setRejectOpen(false)}>
              Back
            </button>
            <button className="flex-1 py-2.5 bg-red text-white font-semibold text-sm rounded-lg hover:bg-red-dark transition-colors disabled:opacity-50" onClick={handleReject} disabled={busy}>
              Send request
            </button>
          </div>
        }
      >
        <div className="py-1">
          <label htmlFor="reject-reason" className="block text-[11px] font-semibold text-ink-3 uppercase tracking-wide mb-2">
            What would you like changed?
          </label>
          <textarea
            id="reject-reason"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="e.g. Please find earlier flights, or Ibom Air instead of Air Peace…"
            className="w-full min-h-[110px] p-3.5 text-sm bg-surface border border-line rounded-xl focus:outline-none focus:border-red focus:ring-2 focus:ring-red-soft transition-colors"
          />
        </div>
      </Modal>
    </div>
  );
}

function DetailGroup({ label, value, icon: Icon }: { label: string; value: string; icon: ElementType }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <Icon aria-hidden="true" className="w-3.5 h-3.5 text-ink-3" />
        <span className="text-[11px] uppercase font-semibold text-ink-3 tracking-wide">{label}</span>
      </div>
      <div className="font-medium text-ink text-sm">{value}</div>
    </div>
  );
}
