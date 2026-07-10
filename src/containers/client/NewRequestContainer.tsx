'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Form, FieldArray } from 'formik';
import * as yup from 'yup';
import { requestsApi, usersApi, ApiError } from '@/api';
import { useAuthStore } from '@/store/useAuthStore';
import { AIRLINES } from '@/lib/constants';
import { BUDGET_TIERS } from '@/services/requestView';
import { newRequestSchema } from '@/lib/validation/schemas';
import { useCityOptions, useNationalityOptions } from '@/hooks/useCountryData';
import type { AdminUserView, ApiBudgetTier } from '@/interface';
import { toast } from 'react-toastify';
import { PageHeader } from '@/components/ui';
import { TextField, SelectField, DateField, FileField, SegmentedField, ComboboxField } from '@/components/form';
import {
  Plus,
  X,
  PlaneTakeoff,
  PlaneLanding,
  Plane,
  Clock,
  Armchair,
  User,
  BookUser,
  Globe,
} from 'lucide-react';

interface PassengerValues {
  fullName: string;
  passportNumber: string;
  nationality: string;
  passportExpiry: string;
  dateOfBirth: string;
  file: File | null;
}

interface RequestFormValues {
  /** Only used when an admin books on a client's behalf. */
  clientId: string;
  tripType: 'oneway' | 'round';
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  preferredAirline: string;
  preferredTime: string;
  budgetTier: ApiBudgetTier;
  passengers: PassengerValues[];
}

const emptyPassenger = (): PassengerValues => ({
  fullName: '',
  passportNumber: '',
  nationality: '',
  passportExpiry: '',
  dateOfBirth: '',
  file: null,
});

const initialValues: RequestFormValues = {
  clientId: '',
  tripType: 'oneway',
  origin: '',
  destination: '',
  departureDate: '',
  returnDate: '',
  preferredAirline: AIRLINES[0],
  preferredTime: 'Any time',
  budgetTier: 'ECONOMY',
  passengers: [emptyPassenger()],
};

interface NewRequestContainerProps {
  /** Where to go after a successful submission. Defaults to the client list. */
  redirectTo?: string;
}

export function NewRequestContainer({ redirectTo = '/client/requests' }: NewRequestContainerProps) {
  const router = useRouter();
  const { options: cityOptions } = useCityOptions();
  const { options: nationalityOptions } = useNationalityOptions();

  // Admins book on a client's behalf — the backend requires a clientId.
  const isAdmin = useAuthStore((s) => s.user?.role) === 'admin';
  const [clients, setClients] = useState<AdminUserView[]>([]);

  useEffect(() => {
    if (!isAdmin) return;
    usersApi
      .listUsers({ role: 'CLIENT', limit: 100 })
      .then((res) => setClients(res.users))
      .catch(() => setClients([]));
  }, [isAdmin]);

  const schema = useMemo(
    () =>
      isAdmin
        ? newRequestSchema.concat(yup.object({ clientId: yup.string().required('Select the client this booking is for.') }))
        : newRequestSchema,
    [isAdmin],
  );

  /** Admins get an extra "Client" section, so later steps shift by one. */
  const step = (n: number) => (isAdmin ? n + 1 : n);

  async function handleSubmit(values: RequestFormValues) {
    try {
      const { request } = await requestsApi.createRequest({
        clientId: isAdmin ? values.clientId : undefined,
        origin: values.origin.trim(),
        destination: values.destination.trim(),
        departureDate: values.departureDate,
        returnDate: values.tripType === 'round' ? values.returnDate : undefined,
        budgetTier: values.budgetTier,
        preferredAirline: values.preferredAirline === 'No preference' ? undefined : values.preferredAirline,
        preferredTime: values.preferredTime === 'Any time' ? undefined : values.preferredTime,
        passengers: values.passengers.map(({ file, ...p }) => p),
        passportDocs: values.passengers.map((p) => p.file as File),
      });
      toast.success(`Request submitted for ${request.origin} → ${request.destination}.`);
      router.push(redirectTo);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Could not submit your request. Please try again.');
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <PageHeader
        variant="plain"
        eyebrow="New request"
        eyebrowIcon={PlaneTakeoff}
        title="Create a travel request"
        subtitle="Provide your trip details and we'll prepare a tailored quotation."
      />

      <Formik initialValues={initialValues} validationSchema={schema} onSubmit={handleSubmit}>
        {({ values, isSubmitting }) => (
          <Form noValidate className="space-y-5">
            {isAdmin && (
              <Section step={1} title="Client">
                <SelectField name="clientId" label="Booking for client" icon={User}>
                  <option value="">Select a client…</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} — {c.email}
                    </option>
                  ))}
                </SelectField>
                <p className="text-xs text-ink-3">
                  The request will belong to this client — approval locks funds in <em>their</em> wallet.
                </p>
              </Section>
            )}

            <Section step={step(1)} title="Route &amp; trip type">
              <SegmentedField
                name="tripType"
                label="Trip type"
                options={[
                  { value: 'oneway', label: 'One way', icon: PlaneTakeoff },
                  { value: 'round', label: 'Round trip', icon: Plane },
                ]}
              />

              <div className="grid sm:grid-cols-2 gap-4">
                <ComboboxField name="origin" label="Origin city" placeholder="Search city or airport" icon={PlaneTakeoff} options={cityOptions} strict />
                <ComboboxField name="destination" label="Destination" placeholder="Search city or airport" icon={PlaneLanding} options={cityOptions} strict />
              </div>
            </Section>

            <Section step={step(2)} title="Schedule &amp; budget">
              <div className="grid sm:grid-cols-2 gap-4">
                <DateField name="departureDate" label="Departure date" />
                {values.tripType === 'round' && (
                  <div className="animate-fade-in">
                    <DateField name="returnDate" label="Return date" min={values.departureDate || undefined} />
                  </div>
                )}
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <SelectField name="preferredAirline" label="Preferred airline" icon={Plane}>
                  {AIRLINES.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </SelectField>
                <SelectField name="preferredTime" label="Preferred time" icon={Clock}>
                  <option value="Any time">No preference</option>
                  <option value="Morning">Morning (6AM – 12PM)</option>
                  <option value="Afternoon">Afternoon (12PM – 6PM)</option>
                  <option value="Evening">Evening (after 6PM)</option>
                </SelectField>
                <SelectField name="budgetTier" label="Cabin class" icon={Armchair}>
                  {BUDGET_TIERS.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </SelectField>
              </div>
            </Section>

            <FieldArray name="passengers">
              {({ push, remove }) => (
                <Section
                  step={step(3)}
                  title="Passengers"
                  action={
                    <button
                      type="button"
                      onClick={() => push(emptyPassenger())}
                      className="inline-flex items-center gap-1.5 text-brand font-semibold text-sm bg-brand-soft px-3.5 py-2 rounded-lg hover:bg-brand hover:text-white transition-colors"
                    >
                      <Plus aria-hidden="true" className="w-4 h-4" /> Add passenger
                    </button>
                  }
                >
                  <div className="space-y-3">
                    {values.passengers.map((_, i) => (
                      <div key={i} className="p-4 bg-surface border border-line rounded-xl relative animate-fade-in">
                        {values.passengers.length > 1 && (
                          <button
                            type="button"
                            onClick={() => remove(i)}
                            aria-label={`Remove passenger ${i + 1}`}
                            className="absolute top-3 right-3 w-7 h-7 bg-card text-red border border-line rounded-lg flex items-center justify-center hover:bg-red-soft hover:border-red/30 transition-colors"
                          >
                            <X aria-hidden="true" className="w-4 h-4" />
                          </button>
                        )}
                        <div className="grid sm:grid-cols-2 gap-4 pr-8">
                          <TextField name={`passengers.${i}.fullName`} label="Full name" placeholder="Jane Doe" icon={User} />
                          <TextField name={`passengers.${i}.passportNumber`} label="Passport number" placeholder="A00000000" icon={BookUser} />
                          <ComboboxField
                            name={`passengers.${i}.nationality`}
                            label="Nationality"
                            placeholder="Search nationality"
                            icon={Globe}
                            options={nationalityOptions}
                            // Show the full list (it's scrollable); typing still filters.
                            limit={nationalityOptions.length}
                            strict
                          />
                          <DateField name={`passengers.${i}.dateOfBirth`} label="Date of birth" />
                          <DateField name={`passengers.${i}.passportExpiry`} label="Passport expiry" />
                          <FileField
                            name={`passengers.${i}.file`}
                            label="Passport scan"
                            accept="image/jpeg,image/png,application/pdf"
                            placeholder="Upload JPEG/PNG/PDF"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Section>
              )}
            </FieldArray>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-brand text-white py-3.5 rounded-xl font-semibold text-base hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting…' : 'Submit request'}
              </button>
              <p className="text-center text-xs text-ink-3">Our team will review your request and provide quotation options shortly.</p>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

function Section({ step, title, action, children }: { step: number; title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="bg-card rounded-2xl border border-line shadow-card p-6 space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-brand-soft text-brand flex items-center justify-center text-sm font-semibold">{step}</span>
          <h2 className="text-base font-semibold text-ink">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
