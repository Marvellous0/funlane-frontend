'use client';

import { useState } from 'react';
import { fmtDateTime } from '@/utils/format';

interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  resource: string;
  status: 'success' | 'failure' | 'warning';
  ip: string;
}

const DUMMY_LOGS: AuditLog[] = [
  { id: '1', timestamp: new Date().toISOString(), actor: 'System', action: 'AES-256 Key Rotation', resource: 'Cryptography Engine', status: 'success', ip: '127.0.0.1' },
  { id: '2', timestamp: new Date(Date.now() - 100000).toISOString(), actor: 'Agent (Sarah)', action: 'View PII', resource: 'Client: Sterling', status: 'warning', ip: '192.168.1.45' },
  { id: '3', timestamp: new Date(Date.now() - 500000).toISOString(), actor: 'Auth Module', action: 'Failed Login', resource: 'User: unknown@mail.com', status: 'failure', ip: '45.12.33.2' },
  { id: '4', timestamp: new Date(Date.now() - 900000).toISOString(), actor: 'System', action: 'Auto-Logout (Idle)', resource: 'Session: #4521', status: 'success', ip: '::1' },
];

const statusStyles: Record<AuditLog['status'], string> = {
  success: 'bg-green-soft text-green-dark',
  failure: 'bg-red-soft text-red-dark',
  warning: 'bg-amber-soft text-amber-dark',
};

export function SecurityAuditContainer() {
  const [logs] = useState<AuditLog[]>(DUMMY_LOGS);

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-ink">Security audit trail</h1>
        <p className="text-ink-3 text-sm mt-1">
          Immutable logs of system activity, cryptography events, and data access.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-line shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-surface border-b border-line">
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase text-ink-3 tracking-wide">Timestamp</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase text-ink-3 tracking-wide">Actor</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase text-ink-3 tracking-wide">Action</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase text-ink-3 tracking-wide">Resource</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase text-ink-3 tracking-wide">Status</th>
                <th className="px-5 py-3.5 text-[11px] font-semibold uppercase text-ink-3 tracking-wide">Source IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-surface/60 transition-colors">
                  <td className="px-5 py-4 text-xs text-ink-2 tabular-nums whitespace-nowrap">{fmtDateTime(log.timestamp)}</td>
                  <td className="px-5 py-4">
                    <span className="text-xs font-medium text-ink flex items-center gap-2">
                      <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-brand" />
                      {log.actor}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs text-ink">{log.action}</td>
                  <td className="px-5 py-4">
                    <code className="text-[11px] bg-surface border border-line px-2 py-1 rounded-md text-ink-3 font-mono">
                      {log.resource}
                    </code>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-full ${statusStyles[log.status]}`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-[11px] font-mono text-ink-3">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-gradient-to-br from-navy-light to-navy rounded-2xl p-6 sm:p-8 text-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="max-w-lg">
            <div className="text-brand-soft text-[11px] font-semibold uppercase tracking-wide mb-2">Compliance</div>
            <h3 className="text-lg font-semibold mb-2">NDPA &amp; regulatory integrity</h3>
            <p className="text-white/60 text-sm leading-relaxed">
              All logs are immutable and cryptographically hashed using SHA-256. Data access is restricted by
              strictly enforced IAM roles.
            </p>
          </div>
          <button className="shrink-0 bg-white text-navy px-5 py-3 rounded-xl font-semibold text-sm hover:bg-brand-soft transition-colors">
            Export audit trail
          </button>
        </div>
      </div>
    </div>
  );
}
