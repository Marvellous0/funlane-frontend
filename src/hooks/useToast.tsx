import type { ElementType } from 'react';
import { toast as notify } from 'react-toastify';
import { Mail, Smartphone } from 'lucide-react';

/** Input accepted by the app's toast helper. `icon` is an icon component. */
export interface ToastInput {
  title: string;
  msg?: string;
  icon?: ElementType;
}

function ToastBody({ title, msg }: { title: string; msg?: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[13px] font-semibold leading-snug">{title}</span>
      {msg ? <span className="text-[12px] opacity-80 mt-0.5 leading-relaxed">{msg}</span> : null}
    </div>
  );
}

function show({ title, msg, icon: Icon }: ToastInput) {
  notify(<ToastBody title={title} msg={msg} />, {
    icon: Icon ? <Icon size={18} strokeWidth={2.4} /> : undefined,
  });
}

/**
 * Thin wrapper over react-toastify so call sites stay declarative.
 * `toast()` shows a single notification; `notifyClient()` simulates the
 * email + SMS messages fired to a client.
 */
export function useToast() {
  return {
    toast: (t: ToastInput) => show(t),
    notifyClient: (clientName: string, title: string, msg: string) => {
      show({ title: `Email → ${clientName}`, msg, icon: Mail });
      setTimeout(() => show({ title: 'SMS sent', msg: title, icon: Smartphone }), 500);
    },
  };
}
