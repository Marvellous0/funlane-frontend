import type { Metadata } from 'next';
import { LandingContainer } from '@/containers/landing/LandingContainer';

export const metadata: Metadata = {
  title: 'Funlane Travels & Logistics — Corporate travel, precisely managed',
  description:
    'Funlane is the corporate travel desk for modern teams. Request flights, lock funds only when you approve, and track every booking in real time. NDPA-compliant and built for Nigeria.',
};

/**
 * Public marketing landing page. Middleware leaves `/` open to everyone;
 * visitors choose the client or agent portal from here.
 */
export default function HomePage() {
  return <LandingContainer />;
}
