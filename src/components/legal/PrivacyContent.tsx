import { LegalSection } from '@/components/LegalPage';

/** Privacy Policy body — shared by the /privacy page and the signup modal. */
export function PrivacyContent() {
  return (
    <div className="space-y-8">
      <LegalSection heading="1. Scope">
        <p>
          This policy explains how Funlane Travels &amp; Logistics collects, uses and protects your
          personal data when you use our platform. We process personal data in accordance with the
          Nigeria Data Protection Act (NDPA).
        </p>
      </LegalSection>

      <LegalSection heading="2. What we collect">
        <p>
          Account data (name, email, phone), traveller data you submit with requests (passenger
          names, dates of birth, nationalities, passport numbers and passport scans), transaction
          data (wallet top-ups, locks, captures and releases), and technical data (IP address,
          device/browser information and security audit events).
        </p>
      </LegalSection>

      <LegalSection heading="3. Why we process it">
        <p>
          To operate your account and bookings (contract), to meet aviation, tax and financial
          regulations (legal obligation), to secure the platform and prevent fraud (legitimate
          interest), and — only where you opt in — to send product updates (consent).
        </p>
      </LegalSection>

      <LegalSection heading="4. Who we share it with">
        <p>
          Airlines and ticketing partners (to issue your tickets), payment providers (to process
          top-ups), and service providers that host our infrastructure. We do not sell your
          personal data. Passport documents are shared only as required to fulfil your booking.
        </p>
      </LegalSection>

      <LegalSection heading="5. Security and retention">
        <p>
          Data is encrypted in transit, access is restricted by role, and administrative actions
          are recorded in an audit log. We retain booking and transaction records for as long as
          regulations require, and delete or anonymise data when it is no longer needed.
        </p>
      </LegalSection>

      <LegalSection heading="6. Your rights">
        <p>
          Under the NDPA you may request access to, correction of, or deletion of your personal
          data, object to certain processing, and withdraw consent at any time. To exercise any of
          these rights, contact{' '}
          <a href="mailto:privacy@funlane.example" className="text-brand font-semibold hover:underline">
            privacy@funlane.example
          </a>. You may also lodge a complaint with the Nigeria Data Protection Commission.
        </p>
      </LegalSection>

      <LegalSection heading="7. Changes">
        <p>
          We may update this policy from time to time; material changes will be announced in the
          app before they take effect.
        </p>
      </LegalSection>
    </div>
  );
}
