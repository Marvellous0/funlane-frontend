'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { TravelRequest, Client, NewOptionInput } from '@/interface';
import { usePortalStore } from '@/store/usePortalStore';
import { useRequests } from '@/hooks/useRequests';
import { useToast } from '@/hooks/useToast';
import { StatusBadge, ProgressSteps, Timeline, Modal, EmptyState } from '@/components/ui';
import { AIRLINES } from '@/lib/constants';
import { fmtNaira, fmtDate, initials } from '@/utils/format';
import { routeText, tierLabel } from '@/utils/request.utils';
import { agentName as agentNameOf } from '@/services/request.service';
import {
  HelpCircle, AlertTriangle, Send, Lock, Ticket, ChevronLeft, Plane, Undo2,
  Plus, ShieldCheck, CheckCircle2, FileText, Paperclip, Check, X,
} from 'lucide-react';

const blankOption = (): NewOptionInput => ({ airline: AIRLINES[0], flightNo: '', depart: '', arrive: '', price: 0, notes: '' });

const modalFieldClass = 'w-full px-3.5 py-2.5 bg-surface border border-line rounded-lg text-sm text-ink focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand-soft transition-colors';
const modalLabelClass = 'block text-[11px] font-semibold text-ink-3 uppercase tracking-wide mb-1.5';

export function AgentRequestDetailContainer({ id }: { id: string }) {
  const requests = usePortalStore((s) => s.requests);
  const clients = usePortalStore((s) => s.clients);
  const agents = usePortalStore((s) => s.agents);
  const { addOption, removeOption, sendOptions, reopenForEditing, markCompleted } = useRequests();
  const { toast } = useToast();

  const r = requests.find((x) => x.id === id);
  const client = clients.find((c) => c.id === r?.clientId);

  const [addOpen, setAddOpen] = useState(false);
  const [draft, setDraft] = useState<NewOptionInput>(blankOption());
  const [ticketFile, setTicketFile] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [approvedByManager, setApprovedByManager] = useState(false);

  if (!r || !client) return <EmptyState icon={HelpCircle}>Request not found.</EmptyState>;

  function commitOption() {
    if (!draft.price) {
      toast({ title: 'Enter a price', icon: AlertTriangle });
      return;
    }
    addOption(r!.id, {
      airline: draft.airline,
      flightNo: draft.flightNo || '—',
      depart: draft.depart || '—',
      arrive: draft.arrive || '—',
      price: draft.price,
      notes: draft.notes || '',
    });
    setDraft(blankOption());
    setAddOpen(false);
  }

  async function send() {
    setBusy(true);
    await sendOptions(r as TravelRequest);
    setBusy(false);
    toast({ title: 'Options Sent', icon: Send, msg: 'Client notified via Portal & Email.' });
  }

  async function complete() {
    if (!approvedByManager) {
      toast({ title: 'Authorization Required', icon: Lock, msg: 'Manager/Checker approval needed for this action.' });
      return;
    }
    setBusy(true);
    await markCompleted(r as TravelRequest, ticketFile ?? 'eticket_issued.pdf');
    setBusy(false);
    toast({ title: 'Completed', icon: Ticket, msg: 'Funds captured & ticket sent.' });
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in">
      <Link
        href="/agent/board"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-3 hover:text-brand transition-colors"
      >
        <ChevronLeft aria-hidden="true" className="w-4 h-4" /> Back to queue
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-line shadow-card p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div aria-hidden="true" className="w-12 h-12 rounded-xl bg-brand-soft text-brand flex items-center justify-center shrink-0">
          <Plane className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl font-bold text-ink">{r.ref}</h1>
            <StatusBadge status={r.status} />
          </div>
          <p className="text-ink-3 text-sm mt-1">
            {routeText(r)} · {client.name} · Agent {agentNameOf(agents, r.assignedAgent)}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-2xl border border-line shadow-card p-5 overflow-x-auto">
        <ProgressSteps status={r.status} />
      </div>

      {r.rejectionReason && r.status === 'pending' && (
        <div className="bg-red-soft border border-red/15 rounded-2xl p-5 flex gap-4">
          <Undo2 aria-hidden="true" className="w-6 h-6 text-red shrink-0" />
          <div>
            <strong className="block text-red-dark font-semibold text-sm mb-1">Client feedback</strong>
            <p className="text-ink-2 text-sm leading-relaxed">{r.rejectionReason}</p>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <ActionPanel
            r={r}
            client={client}
            busy={busy}
            ticketFile={ticketFile}
            approvedByManager={approvedByManager}
            onAuthorize={() => setApprovedByManager(true)}
            onAddOption={() => setAddOpen(true)}
            onRemoveOption={removeOption}
            onSend={send}
            onReopen={() => reopenForEditing(r.id)}
            onPickTicket={() => setTicketFile('eticket_issued.pdf')}
            onComplete={complete}
          />

          <section className="bg-white rounded-2xl border border-line shadow-card p-6">
            <h2 className="text-lg font-semibold text-ink mb-5">Request details</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <KV label="Itinerary" value={routeText(r)} />
              <KV label="Trip type" value={r.tripType === 'round' ? 'Round trip' : 'One way'} />
              <KV label="Departure" value={`${fmtDate(r.departDate)} · ${r.preferredTime}`} />
              <KV label="Return" value={r.returnDate ? fmtDate(r.returnDate) : 'N/A'} />
              <KV label="Carrier preference" value={r.preferredAirline} />
              <KV label="Budget tier" value={tierLabel(r.budgetTier)} />

              <div className="sm:col-span-2 space-y-2.5">
                <div className="text-[11px] uppercase font-semibold text-ink-3 tracking-wide">Passenger manifest</div>
                <div className="grid gap-2">
                  {r.passengers.map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-line">
                      <div className="font-medium text-ink text-sm">
                        {p.first} {p.last}
                      </div>
                      <div className="text-xs font-mono text-ink-3">{p.passport}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          <div className="bg-gradient-to-br from-navy-light to-navy text-white rounded-2xl p-6">
            <div className="text-[11px] uppercase tracking-wide text-white/50 mb-1.5">Client wallet</div>
            <div className="text-2xl font-bold mb-1">{fmtNaira(client.wallet)}</div>
            <div className="text-xs text-white/50 mb-4">{client.name}</div>
            <div className="flex items-center gap-2 text-xs text-white/70 border-t border-white/10 pt-4">
              <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-green" />
              {client.type} account · Active
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-base font-semibold text-ink">Activity</h3>
            <Timeline history={r.history} />
          </div>
        </aside>
      </div>

      {/* Add option modal */}
      <Modal
        open={addOpen}
        title="Add travel option"
        onClose={() => setAddOpen(false)}
        footer={
          <div className="flex gap-3 w-full">
            <button className="flex-1 py-2.5 bg-white border border-line text-ink font-medium text-sm rounded-lg hover:bg-surface transition-colors" onClick={() => setAddOpen(false)}>
              Cancel
            </button>
            <button className="flex-1 py-2.5 bg-brand text-white font-semibold text-sm rounded-lg hover:bg-brand-dark transition-colors" onClick={commitOption}>
              Add option
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="opt-airline" className={modalLabelClass}>Airline</label>
              <select id="opt-airline" className={modalFieldClass} value={draft.airline} onChange={(e) => setDraft({ ...draft, airline: e.target.value })}>
                {AIRLINES.filter((a) => a !== 'No preference').map((a) => (
                  <option key={a}>{a}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="opt-flight" className={modalLabelClass}>Flight no.</label>
              <input id="opt-flight" className={modalFieldClass} value={draft.flightNo} onChange={(e) => setDraft({ ...draft, flightNo: e.target.value })} placeholder="e.g. P4 7321" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="opt-depart" className={modalLabelClass}>Depart</label>
              <input id="opt-depart" className={modalFieldClass} value={draft.depart} onChange={(e) => setDraft({ ...draft, depart: e.target.value })} placeholder="08:00" />
            </div>
            <div>
              <label htmlFor="opt-arrive" className={modalLabelClass}>Arrive</label>
              <input id="opt-arrive" className={modalFieldClass} value={draft.arrive} onChange={(e) => setDraft({ ...draft, arrive: e.target.value })} placeholder="09:20" />
            </div>
            <div>
              <label htmlFor="opt-price" className={modalLabelClass}>Price (₦)</label>
              <input id="opt-price" type="number" className={`${modalFieldClass} text-brand font-semibold`} value={draft.price || ''} onChange={(e) => setDraft({ ...draft, price: parseInt(e.target.value || '0', 10) })} placeholder="180000" />
            </div>
          </div>
          <div>
            <label htmlFor="opt-notes" className={modalLabelClass}>Agent notes (optional)</label>
            <input id="opt-notes" className={modalFieldClass} value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} placeholder="e.g. Direct flight, 23kg bag included" />
          </div>
        </div>
      </Modal>
    </div>
  );
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase font-semibold text-ink-3 tracking-wide mb-1">{label}</div>
      <div className="text-sm font-medium text-ink">{value}</div>
    </div>
  );
}

interface ActionPanelProps {
  r: TravelRequest;
  client: Client;
  busy: boolean;
  ticketFile: string | null;
  approvedByManager: boolean;
  onAuthorize: () => void;
  onAddOption: () => void;
  onRemoveOption: (optId: string) => void;
  onSend: () => void;
  onReopen: () => void;
  onPickTicket: () => void;
  onComplete: () => void;
}

function ActionPanel({ r, client, busy, ticketFile, approvedByManager, onAuthorize, onAddOption, onRemoveOption, onSend, onReopen, onPickTicket, onComplete }: ActionPanelProps) {
  if (r.status === 'pending') {
    return (
      <section className="bg-white rounded-2xl border border-line shadow-card p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-ink">Build quotation</h2>
            <p className="text-sm text-ink-3 mt-0.5">Add the flight options to send to the client.</p>
          </div>
          <button
            onClick={onAddOption}
            className="inline-flex items-center gap-1.5 bg-brand-soft text-brand px-3.5 py-2 rounded-lg font-semibold text-sm hover:bg-brand hover:text-white transition-colors"
          >
            <Plus aria-hidden="true" className="w-4 h-4" /> Add option
          </button>
        </div>

        <div className="space-y-2.5 mb-5">
          {r.options.map((o) => (
            <div key={o.id} className="flex items-center justify-between p-4 bg-surface rounded-xl border border-line">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white border border-line flex items-center justify-center text-xs font-semibold text-ink-2">
                  {initials(o.airline)}
                </div>
                <div>
                  <div className="text-sm font-medium text-ink">
                    {o.airline} <span className="text-[11px] text-ink-3 font-mono ml-1">{o.flightNo}</span>
                  </div>
                  <div className="text-xs text-ink-3 mt-0.5">
                    {o.depart} → {o.arrive}
                    {o.notes ? ` · ${o.notes}` : ''}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm font-semibold text-ink">{fmtNaira(o.price)}</div>
                <button
                  onClick={() => onRemoveOption(o.id)}
                  aria-label={`Remove ${o.airline} option`}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-3 hover:bg-red-soft hover:text-red transition-colors"
                >
                  <X aria-hidden="true" className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {!r.options.length && (
            <div className="py-12 border border-dashed border-line rounded-xl text-center text-ink-3 text-sm">
              No options added yet.
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-line pt-5">
          <span className="text-sm text-ink-3">
            {r.options.length} option{r.options.length === 1 ? '' : 's'}
          </span>
          <button
            className="inline-flex items-center gap-1.5 bg-brand text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onSend}
            disabled={!r.options.length || busy}
          >
            <Send aria-hidden="true" className="w-4 h-4" /> Send to client
          </button>
        </div>
      </section>
    );
  }

  if (r.status === 'quoted') {
    return (
      <section className="bg-white rounded-2xl border border-line shadow-card p-6">
        <span className="inline-flex items-center text-[11px] font-semibold uppercase tracking-wide text-purple bg-purple-soft px-2.5 py-1 rounded-full mb-5">
          Awaiting client review
        </span>
        <div className="space-y-2.5 mb-5">
          {r.options.map((o) => (
            <div key={o.id} className="flex items-center justify-between p-4 bg-surface rounded-xl border border-line opacity-75">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white border border-line flex items-center justify-center text-xs font-semibold text-ink-2">
                  {initials(o.airline)}
                </div>
                <div>
                  <div className="text-sm font-medium text-ink">
                    {o.airline} <span className="text-[11px] text-ink-3 ml-1">({o.flightNo})</span>
                  </div>
                  <div className="text-xs text-ink-3 mt-0.5">
                    {o.depart} → {o.arrive}
                  </div>
                </div>
              </div>
              <div className="text-sm font-semibold text-ink">{fmtNaira(o.price)}</div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-line pt-5">
          <p className="text-sm text-ink-3">Pending selection on the client dashboard.</p>
          <button
            className="text-brand font-semibold text-sm bg-brand-soft px-3.5 py-2 rounded-lg hover:bg-brand hover:text-white transition-colors"
            onClick={onReopen}
          >
            Revise options
          </button>
        </div>
      </section>
    );
  }

  const selected = r.options.find((o) => o.id === r.selectedOptionId);

  if (r.status === 'approved' && selected) {
    return (
      <section className="bg-white rounded-2xl border border-line shadow-card p-6 animate-scale-in">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-green-dark bg-green-soft px-2.5 py-1 rounded-full mb-5">
          <Lock aria-hidden="true" className="w-3 h-3" /> Funds locked
        </span>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-ink">
            {selected.airline} <span className="text-ink-3 font-medium text-base ml-1">{selected.flightNo}</span>
          </h2>
          <div className="text-brand font-bold text-lg mt-1">{fmtNaira(selected.price)}</div>
          <p className="text-sm text-ink-3 mt-3 leading-relaxed">
            Client has approved this selection. <span className="text-green-dark font-semibold">{fmtNaira(r.lockedAmount)}</span> is secured for capture.
          </p>
        </div>

        <div className="bg-surface rounded-xl p-5 space-y-4 mb-6 border border-line">
          <h3 className="text-[11px] uppercase font-semibold text-ink-3 tracking-wide">Issuance checklist</h3>
          <div className="space-y-3">
            <WFStep num="1" text="Verify GDS confirmation number matches PNR." check />
            <WFStep num="2" text="Attach the signed e-ticket PDF." check={!!ticketFile} />

            <div className="pt-3 border-t border-line">
              <div className="flex items-start gap-3 p-4 bg-white rounded-lg border border-line">
                <ShieldCheck aria-hidden="true" className="w-5 h-5 mt-0.5 text-ink-2 shrink-0" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-ink mb-1">Maker-checker authorization</div>
                  <p className="text-xs text-ink-3 leading-relaxed mb-3">
                    Dual authorization is required for flight issuance to mitigate insider risk and tampering.
                  </p>

                  {!approvedByManager ? (
                    <button
                      onClick={onAuthorize}
                      className="bg-navy text-white px-4 py-2 rounded-lg font-semibold text-xs hover:bg-navy-light transition-colors"
                    >
                      Verify &amp; authorize (manager)
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-green-dark font-semibold text-xs">
                      <CheckCircle2 aria-hidden="true" className="w-4 h-4" /> Authorized by manager
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <span className="block text-[11px] font-semibold text-ink-3 uppercase tracking-wide mb-2">Digital e-ticket (PDF)</span>
            <button
              type="button"
              onClick={onPickTicket}
              className={`w-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-colors ${
                ticketFile ? 'border-green bg-green-soft text-green-dark' : 'border-line hover:border-brand hover:bg-brand-soft/50 text-ink-3'
              }`}
            >
              {ticketFile ? (
                <FileText aria-hidden="true" className="w-6 h-6 mb-2" />
              ) : (
                <Paperclip aria-hidden="true" className="w-6 h-6 mb-2" />
              )}
              <span className="text-sm font-semibold">{ticketFile ? 'Ticket attached' : 'Attach e-ticket'}</span>
              {!ticketFile && <span className="text-xs mt-0.5">PDF only</span>}
            </button>
          </div>

          <button
            className="w-full bg-brand text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={onComplete}
            disabled={!ticketFile || !approvedByManager || busy}
          >
            {busy ? 'Processing…' : 'Finalize & issue ticket'}
          </button>
        </div>
      </section>
    );
  }

  if (r.status === 'issued' && selected) {
    return (
      <section className="bg-white rounded-2xl border border-line shadow-card p-6">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-blue-dark bg-blue-soft px-2.5 py-1 rounded-full mb-5">
          <Ticket aria-hidden="true" className="w-3 h-3" /> Issued &amp; completed
        </span>
        <h2 className="text-lg font-semibold text-ink mb-1">
          {selected.airline} {selected.flightNo}
        </h2>
        <p className="text-sm text-ink-3 mb-5">
          Final fare <span className="font-medium text-ink-2">{fmtNaira(selected.price)}</span> captured from wallet. Travelers emailed.
        </p>
        <div className="flex items-center gap-3 p-3.5 bg-surface rounded-lg border border-line w-fit">
          <FileText aria-hidden="true" className="w-5 h-5 text-ink-3" />
          <span className="text-sm font-medium text-ink-2 underline cursor-pointer">{r.ticketFileName}</span>
        </div>
      </section>
    );
  }

  return null;
}

function WFStep({ num, text, check = false }: { num: string; text: string; check?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[11px] font-semibold ${check ? 'bg-green text-white' : 'bg-white border border-line text-ink-3'}`}>
        {check ? <Check aria-hidden="true" className="w-3.5 h-3.5" /> : num}
      </div>
      <div className={`text-sm ${check ? 'text-ink-3 line-through' : 'text-ink-2'}`}>{text}</div>
    </div>
  );
}
