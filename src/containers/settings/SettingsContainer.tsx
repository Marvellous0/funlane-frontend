'use client';

import { useCallback, useEffect, useState } from 'react';
import { settingsApi, ApiError } from '@/api';
import { PageHeader } from '@/components/ui';
import { UserCog, AlertTriangle, RefreshCw } from 'lucide-react';

interface SettingsContainerProps {
  extraSections?: React.ReactNode;
}

export function SettingsContainer({ extraSections }: SettingsContainerProps) {
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
    
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not load your profile. Please try again.');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <PageHeader
        variant="plain"
        eyebrow="Settings"
        eyebrowIcon={UserCog}
        title="Account settings"
        subtitle="Manage your profile details and password."
      />

      {error ? (
        <Card>
          <div className="p-8 text-center">
            <AlertTriangle aria-hidden="true" className="w-8 h-8 text-amber mx-auto mb-3" />
            <p className="text-sm text-ink-2">{error}</p>
            <button onClick={load} className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink hover:underline">
              <RefreshCw className="w-4 h-4" /> Try again
            </button>
          </div>
        </Card>
      ) : (
        <>
          {extraSections}
        </>
      )}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <section className="bg-card rounded-2xl border border-line shadow-card overflow-hidden">{children}</section>;
}
