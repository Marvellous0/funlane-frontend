import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';
import { PrivacyContent } from '@/components/legal/PrivacyContent';

export const metadata: Metadata = {
  title: 'Privacy Policy — Funlane Travels & Logistics',
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="July 2026">
      <PrivacyContent />
    </LegalPage>
  );
}
