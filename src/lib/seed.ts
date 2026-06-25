import type { PortalData, TravelRequest, HistoryEntry } from '@/interface';
import { uid, daysAgo } from '@/utils/format';

function h(text: string, d: number): HistoryEntry {
  return { ts: daysAgo(d), text };
}

/** Produces the initial demo dataset (ported from data.js seedState). */
export function seedPortalData(): PortalData {
  const clients = [
    { id: 'c1', name: 'Zenith Corp Travel Desk', email: 'travel@zenithcorp.ng', type: 'Corporate' as const, wallet: 2400000 },
    { id: 'c2', name: 'Adeola Bankole', email: 'adeola.b@gmail.com', type: 'Retail' as const, wallet: 320000 },
  ];
  const agents = [
    { id: 'a1', name: 'Chidi Okafor', email: 'chidi@funlane.ng' },
    { id: 'a2', name: 'Fatima Yusuf', email: 'fatima@funlane.ng' },
  ];

  let refSeq = 1042;
  const nextRef = () => 'FL-' + refSeq++;

  const reqPending: TravelRequest = {
    id: uid('r'), ref: nextRef(), clientId: 'c1', clientName: 'Zenith Corp Travel Desk',
    tripType: 'round', from: 'Lagos (LOS)', to: 'Abuja (ABV)',
    departDate: '2026-07-02', returnDate: '2026-07-06',
    preferredAirline: 'Air Peace', preferredTime: 'Morning', budgetTier: 'standard',
    passengers: [{ first: 'Emeka', last: 'Nwosu', passport: 'A50231887', dob: '1988-04-12' }],
    notes: 'Board meeting — must land before 11am on the 2nd.',
    status: 'pending', assignedAgent: 'a1', options: [], selectedOptionId: null,
    rejectionReason: null, lockedAmount: 0, ticketFileName: null,
    createdAt: daysAgo(0.2), updatedAt: daysAgo(0.2),
    history: [h('Request submitted by client', 0.2)],
  };

  const reqQuoted: TravelRequest = {
    id: uid('r'), ref: nextRef(), clientId: 'c1', clientName: 'Zenith Corp Travel Desk',
    tripType: 'oneway', from: 'Abuja (ABV)', to: 'Port Harcourt (PHC)',
    departDate: '2026-07-04', returnDate: '',
    preferredAirline: 'No preference', preferredTime: 'Afternoon', budgetTier: 'economy',
    passengers: [{ first: 'Ngozi', last: 'Eze', passport: 'B77410092', dob: '1991-09-30' }],
    notes: '', status: 'quoted', assignedAgent: 'a2',
    options: [
      { id: uid('o'), airline: 'Ibom Air', flightNo: 'QI 412', price: 96500, depart: '13:20', arrive: '14:35', notes: 'Direct' },
      { id: uid('o'), airline: 'Green Africa', flightNo: 'Q9 220', price: 88000, depart: '15:05', arrive: '16:25', notes: 'Direct, 1 bag' },
    ],
    selectedOptionId: null, rejectionReason: null, lockedAmount: 0, ticketFileName: null,
    createdAt: daysAgo(1.1), updatedAt: daysAgo(0.4),
    history: [h('Request submitted by client', 1.1), h('Agent Fatima Yusuf added 2 options', 0.4), h('Options sent to client', 0.4)],
  };

  const reqApproved: TravelRequest = {
    id: uid('r'), ref: nextRef(), clientId: 'c2', clientName: 'Adeola Bankole',
    tripType: 'round', from: 'Lagos (LOS)', to: 'Enugu (ENU)',
    departDate: '2026-06-28', returnDate: '2026-07-01',
    preferredAirline: 'Air Peace', preferredTime: 'Morning', budgetTier: 'standard',
    passengers: [{ first: 'Adeola', last: 'Bankole', passport: 'A33119087', dob: '1985-02-19' }],
    notes: 'Family visit.', status: 'approved', assignedAgent: 'a1',
    options: [
      { id: 'opA', airline: 'Air Peace', flightNo: 'P4 7321', price: 142000, depart: '07:40', arrive: '09:00', notes: 'Round trip incl. return' },
      { id: 'opB', airline: 'United Nigeria', flightNo: 'NUA 88', price: 138500, depart: '10:15', arrive: '11:35', notes: 'Round trip' },
    ],
    selectedOptionId: 'opA', rejectionReason: null, lockedAmount: 142000, ticketFileName: null,
    createdAt: daysAgo(2.0), updatedAt: daysAgo(0.1),
    history: [
      h('Request submitted by client', 2.0),
      h('Agent Chidi Okafor added 2 options', 1.5),
      h('Options sent to client', 1.5),
      h('Client approved Option 1 (Air Peace) — ₦142,000 locked from wallet', 0.1),
    ],
  };

  return {
    clients,
    agents,
    requests: [reqApproved, reqQuoted, reqPending],
    ledger: [
      { id: uid('l'), clientId: 'c1', type: 'topup', amount: 2400000, balanceAfter: 2400000, note: 'Initial wallet top-up (bank transfer)', ts: daysAgo(8) },
      { id: uid('l'), clientId: 'c2', type: 'topup', amount: 462000, balanceAfter: 462000, note: 'Wallet top-up (card • Paystack)', ts: daysAgo(5) },
      { id: uid('l'), clientId: 'c2', type: 'lock', amount: -142000, balanceAfter: 320000, note: 'Locked for FL-1044 (Enugu trip)', ts: daysAgo(0.1) },
    ],
    refSeq,
  };
}
