import { LegalSection } from '@/components/LegalPage';

/** Terms of Service body — shared by the /terms page and the signup modal. */
export function TermsContent() {
  return (
    <div className="space-y-8">
      <LegalSection heading="1. Who we are">
        <p>
          Funlane Travels &amp; Logistics (&ldquo;Funlane&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) operates a corporate
          travel platform that lets registered clients request flight bookings, receive quotations
          curated by our agency team, and pay from a pre-funded wallet. By creating an account or
          using the platform you agree to these terms.
        </p>
      </LegalSection>

      <LegalSection heading="2. Accounts and eligibility">
        <p>
          You must provide accurate information when registering, keep your login credentials
          confidential, and verify your email address before using the platform. You are responsible
          for all activity under your account. Accounts may be suspended for fraudulent, abusive or
          unlawful activity.
        </p>
      </LegalSection>

      <LegalSection heading="3. How bookings work">
        <p>
          When you submit a travel request, our agents prepare one or more flight options. No money
          leaves your wallet at this stage. When you approve an option, the exact price of that
          option is <strong className="text-ink">locked</strong> in your wallet. The locked amount is only{' '}
          <strong className="text-ink">captured</strong> (paid out) once your ticket has been issued and delivered to
          your dashboard. If you cancel before issuance, the locked amount is released back to your
          available balance in full.
        </p>
      </LegalSection>

      <LegalSection heading="4. Wallet and payments">
        <p>
          Wallet top-ups are processed through our payment providers in Nigerian Naira. Your wallet
          balance is not a deposit account and earns no interest. Captured funds pay for issued
          tickets and applicable service fees. Refunds for issued tickets are governed by the fare
          rules of the operating airline and may attract airline penalties outside our control.
        </p>
      </LegalSection>

      <LegalSection heading="5. Accuracy of traveller details">
        <p>
          You are responsible for the accuracy of passenger details — names, passport numbers,
          expiry dates and nationalities — submitted with a request. Airlines may deny boarding or
          charge re-issue fees for incorrect details. Where a mistake is discovered after issuance,
          you may request a re-issue through the platform; airline fees may apply.
        </p>
      </LegalSection>

      <LegalSection heading="6. Cancellations">
        <p>
          Requests can be cancelled free of charge at any point before a ticket is issued, and any
          locked funds are released immediately. After issuance, cancellations and changes follow
          the airline&rsquo;s fare rules.
        </p>
      </LegalSection>

      <LegalSection heading="7. Our responsibilities and limits">
        <p>
          We act as a booking intermediary between you and the operating airlines. We are not liable
          for airline delays, cancellations, schedule changes, denied boarding or baggage issues,
          though we will assist you in pursuing remedies with the airline. Our total liability for
          any claim is limited to the amounts you paid for the affected booking.
        </p>
      </LegalSection>

      <LegalSection heading="8. Data protection">
        <p>
          We process personal data in line with the Nigeria Data Protection Act (NDPA) and our
          Privacy Policy, which forms part of these terms.
        </p>
      </LegalSection>

      <LegalSection heading="9. Changes and contact">
        <p>
          We may update these terms from time to time; material changes will be announced in the
          app before they take effect. Questions? Contact us at{' '}
          <a href="mailto:support@funlane.example" className="text-brand font-semibold hover:underline">
            support@funlane.example
          </a>.
        </p>
      </LegalSection>
    </div>
  );
}
