import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  FlightOption,
  LedgerType,
  NewOptionInput,
  NewRequestInput,
  PortalData,
  TravelRequest,
} from '@/interface';
import { STORE_KEY } from '@/lib/constants';
import { seedPortalData } from '@/lib/seed';
import { uid, nowISO } from '@/utils/format';

export interface ApproveResult {
  ok: boolean;
  error?: string;
}

interface PortalActions {
  reset: () => void;
  createRequest: (input: NewRequestInput, clientId: string) => TravelRequest;
  addOption: (reqId: string, option: NewOptionInput) => void;
  removeOption: (optId: string) => void;
  sendOptions: (reqId: string) => void;
  reopenForEditing: (reqId: string) => void;
  approveOption: (reqId: string, optId: string) => ApproveResult;
  rejectRequest: (reqId: string, reason: string) => void;
  markCompleted: (reqId: string, ticketFileName: string) => void;
  topUp: (clientId: string, amount: number, method: string) => void;
}

type PortalState = PortalData & PortalActions;

/** Replace one request in the list with an updater result. */
function mapRequest(
  requests: TravelRequest[],
  id: string,
  fn: (r: TravelRequest) => TravelRequest,
): TravelRequest[] {
  return requests.map((r) => (r.id === id ? fn(r) : r));
}

function withHistory(req: TravelRequest, text: string): TravelRequest {
  return {
    ...req,
    updatedAt: nowISO(),
    history: [...req.history, { ts: nowISO(), text }],
  };
}

function makeLedger(
  clientId: string,
  type: LedgerType,
  amount: number,
  balanceAfter: number,
  note: string,
) {
  return { id: uid('l'), clientId, type, amount, balanceAfter, note, ts: nowISO() };
}

export const usePortalStore = create<PortalState>()(
  persist(
    (set, get) => ({
      ...seedPortalData(),

      reset: () => set({ ...seedPortalData() }),

      createRequest: (input, clientId) => {
        const state = get();
        const client = state.clients.find((c) => c.id === clientId)!;
        const ref = 'FL-' + state.refSeq;
        const assignedAgent =
          state.agents[Math.floor(Math.random() * state.agents.length)]?.id ?? state.agents[0].id;
        const req: TravelRequest = {
          id: uid('r'),
          ref,
          clientId,
          clientName: client.name,
          tripType: input.tripType,
          from: input.from,
          to: input.to,
          departDate: input.departDate,
          returnDate: input.returnDate,
          preferredAirline: input.preferredAirline,
          preferredTime: input.preferredTime,
          budgetTier: input.budgetTier,
          passengers: input.passengers,
          notes: input.notes,
          status: 'pending',
          assignedAgent,
          options: [],
          selectedOptionId: null,
          rejectionReason: null,
          lockedAmount: 0,
          ticketFileName: null,
          createdAt: nowISO(),
          updatedAt: nowISO(),
          history: [{ ts: nowISO(), text: 'Request submitted by client' }],
        };
        set({ requests: [req, ...state.requests], refSeq: state.refSeq + 1 });
        return req;
      },

      addOption: (reqId, option) => {
        const newOpt: FlightOption = { ...option, id: uid('o') };
        set((s) => ({
          requests: mapRequest(s.requests, reqId, (r) => ({ ...r, options: [...r.options, newOpt] })),
        }));
      },

      removeOption: (optId) => {
        set((s) => ({
          requests: s.requests.map((r) =>
            r.options.some((o) => o.id === optId)
              ? { ...r, options: r.options.filter((o) => o.id !== optId) }
              : r,
          ),
        }));
      },

      sendOptions: (reqId) => {
        set((s) => {
          const req = s.requests.find((r) => r.id === reqId);
          if (!req || !req.options.length) return s;
          const agent = s.agents.find((a) => a.id === req.assignedAgent);
          return {
            requests: mapRequest(s.requests, reqId, (r) =>
              withHistory(
                { ...r, status: 'quoted' },
                `${agent?.name ?? 'Agent'} sent ${r.options.length} option(s) to client`,
              ),
            ),
          };
        });
      },

      reopenForEditing: (reqId) => {
        set((s) => ({
          requests: mapRequest(s.requests, reqId, (r) =>
            withHistory({ ...r, status: 'pending' }, 'Agent reopened request to revise options'),
          ),
        }));
      },

      approveOption: (reqId, optId) => {
        const state = get();
        const req = state.requests.find((r) => r.id === reqId);
        if (!req) return { ok: false, error: 'Request not found' };
        const opt = req.options.find((o) => o.id === optId);
        if (!opt) return { ok: false, error: 'Option not found' };
        const client = state.clients.find((c) => c.id === req.clientId);
        if (!client) return { ok: false, error: 'Client not found' };
        if (client.wallet < opt.price) {
          return { ok: false, error: 'insufficient-funds' };
        }

        const newWallet = client.wallet - opt.price;
        const optIndex = req.options.indexOf(opt);
        set({
          clients: state.clients.map((c) => (c.id === client.id ? { ...c, wallet: newWallet } : c)),
          ledger: [
            ...state.ledger,
            makeLedger(
              client.id,
              'lock',
              -opt.price,
              newWallet,
              `Locked for ${req.ref} (${opt.airline})`,
            ),
          ],
          requests: mapRequest(state.requests, reqId, (r) =>
            withHistory(
              { ...r, status: 'approved', selectedOptionId: optId, lockedAmount: opt.price },
              `Client approved Option ${optIndex + 1} (${opt.airline}) — ₦${opt.price.toLocaleString(
                'en-NG',
              )} locked from wallet`,
            ),
          ),
        });
        return { ok: true };
      },

      rejectRequest: (reqId, reason) => {
        set((s) => ({
          requests: mapRequest(s.requests, reqId, (r) =>
            withHistory(
              { ...r, status: 'pending', rejectionReason: reason },
              `Client rejected options: "${reason}". Returned to agent queue.`,
            ),
          ),
        }));
      },

      markCompleted: (reqId, ticketFileName) => {
        set((s) => {
          const req = s.requests.find((r) => r.id === reqId);
          if (!req) return s;
          const client = s.clients.find((c) => c.id === req.clientId);
          const ledgerEntry = client
            ? [
                makeLedger(
                  client.id,
                  'capture',
                  0,
                  client.wallet,
                  `Captured ₦${req.lockedAmount.toLocaleString(
                    'en-NG',
                  )} for ${req.ref} — agency paid via Paystack Transfer`,
                ),
              ]
            : [];
          return {
            ledger: [...s.ledger, ...ledgerEntry],
            requests: mapRequest(s.requests, reqId, (r) =>
              withHistory(
                { ...r, status: 'issued', ticketFileName, lockedAmount: 0 },
                `Ticket issued & uploaded (${ticketFileName}). Funds captured, agency paid, ticket emailed to traveler.`,
              ),
            ),
          };
        });
      },

      topUp: (clientId, amount, method) => {
        set((s) => {
          const client = s.clients.find((c) => c.id === clientId);
          if (!client) return s;
          const newWallet = client.wallet + amount;
          return {
            clients: s.clients.map((c) => (c.id === clientId ? { ...c, wallet: newWallet } : c)),
            ledger: [
              ...s.ledger,
              makeLedger(clientId, 'topup', amount, newWallet, `Wallet top-up (${method} • Paystack)`),
            ],
          };
        });
      },
    }),
    {
      name: STORE_KEY,
      storage: createJSONStorage(() => localStorage),
      // Persist only data, not action functions.
      partialize: (s) => ({
        clients: s.clients,
        agents: s.agents,
        requests: s.requests,
        ledger: s.ledger,
        refSeq: s.refSeq,
      }),
    },
  ),
);
