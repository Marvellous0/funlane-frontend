'use client';

import type { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import type { ButtonColor } from './Button';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: ButtonColor;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Reusable confirmation modal used anywhere an action needs a yes/no gate
 * (deletes, suspends, irreversible changes). The confirm button is green and
 * the cancel button is red, matching the agreed UX.
 */
export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Yes, continue',
  cancelLabel = 'Cancel',
  confirmColor = 'green',
  danger = true,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={loading ? () => {} : onCancel}
      footer={
        <div className="flex items-center justify-end gap-3">
          <Button color="red" variant="outline" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button color={confirmColor} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </div>
      }
    >
      <div className="flex gap-4">
        {danger ? (
          <div aria-hidden="true" className="shrink-0 w-11 h-11 rounded-full bg-red-soft text-red flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        ) : null}
        <div className="text-sm text-ink-2 leading-relaxed pt-1">{message}</div>
      </div>
    </Modal>
  );
}
