import type { ComboOption } from '@/components/form/ComboboxField';
import { AIRLINES, OTHER_AIRLINE } from './constants';

/**
 * Shared airline combobox options — single source of truth so every "which
 * airline?" picker in the app (the request form's preference field, and the
 * agent/admin "Add travel option" modals) stays in sync as the carrier list
 * grows, and all offer the same "type your own" fallback.
 */
const OTHER_OPTION: ComboOption = {
  value: OTHER_AIRLINE,
  label: OTHER_AIRLINE,
  description: 'Type in an airline not listed',
};

/** For the client's request form — a preference, so "No preference" is valid. */
export const AIRLINE_PREFERENCE_OPTIONS: ComboOption[] = [
  ...AIRLINES.map((a) => ({ value: a, label: a })),
  OTHER_OPTION,
];

/** For picking the airline actually flown on a quote option — no "No preference". */
export const AIRLINE_SELECT_OPTIONS: ComboOption[] = [
  ...AIRLINES.filter((a) => a !== 'No preference').map((a) => ({ value: a, label: a })),
  OTHER_OPTION,
];
