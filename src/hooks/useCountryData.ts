'use client';

import { useEffect, useState } from 'react';
import type { ComboOption } from '@/components/form/ComboboxField';
import { NATIONALITIES } from '@/lib/nationalities';
import { AIRPORT_OPTIONS } from '@/lib/airports';

/**
 * Live reference data for the request form, sourced from open APIs with
 * bundled fallbacks so the fields are always usable:
 *
 * - Nationalities — REST Countries v5 (https://restcountries.com/docs).
 *   v5 requires an API key (`NEXT_PUBLIC_RESTCOUNTRIES_API_KEY`) whose
 *   allowed hostnames include this app's domain; when no key is configured
 *   or the call fails we fall back to the legacy keyless v3.1 endpoint,
 *   and finally to the bundled `NATIONALITIES` list.
 * - Cities — CountriesNow (https://countriesnow.space), merged after the
 *   curated airport list (which keeps its IATA badges), falling back to the
 *   airports alone.
 *
 * Results are cached at module level, so each dataset is fetched at most once
 * per session no matter how many fields mount.
 */

const NATIONALITY_FALLBACK: ComboOption[] = NATIONALITIES.map((n) => ({ value: n, label: n }));

let nationalityCache: ComboOption[] | null = null;
let nationalityPromise: Promise<ComboOption[]> | null = null;

let cityCache: ComboOption[] | null = null;
let cityPromise: Promise<ComboOption[]> | null = null;

/* REST Countries ------------------------------------------------------- */

const RC_V5_BASE = 'https://api.restcountries.com/countries/v5';
const RC_V5_PAGE_LIMIT = 100; // free-plan maximum
const RC_API_KEY = process.env.NEXT_PUBLIC_RESTCOUNTRIES_API_KEY;

/** One country as returned by v5 with `response_fields=names.common,demonyms`. */
interface RcV5Country {
  names?: { common?: string };
  /** Keyed by ISO 639-3 language code (e.g. `eng`), each with m/f forms. */
  demonyms?: Record<string, { m?: string; f?: string }>;
}

interface RcV5ListResponse {
  data?: {
    objects?: RcV5Country[];
    meta?: { total?: number; count?: number; limit?: number; offset?: number; more?: boolean };
  };
}

/** Builds sorted, de-duplicated combobox options from country records. */
function toNationalityOptions(
  countries: Array<{ name?: string; demonym?: string }>,
): ComboOption[] {
  const seen = new Set<string>();
  const options: ComboOption[] = [];
  for (const c of countries) {
    if (!c.demonym || seen.has(c.demonym)) continue;
    seen.add(c.demonym);
    options.push({ value: c.demonym, label: c.demonym, description: c.name, keywords: c.name });
  }
  options.sort((a, b) => (a.value === 'Nigerian' ? -1 : b.value === 'Nigerian' ? 1 : a.label.localeCompare(b.label)));
  if (options.length === 0) throw new Error('Empty nationality list');
  return options;
}

/** v5: paginated `GET /countries/v5` with an API key (Bearer token). */
async function fetchNationalitiesV5(apiKey: string): Promise<ComboOption[]> {
  const collected: RcV5Country[] = [];
  let offset = 0;

  for (;;) {
    const url = `${RC_V5_BASE}?response_fields=names.common,demonyms&limit=${RC_V5_PAGE_LIMIT}&offset=${offset}`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
    if (!res.ok) throw new Error(`REST Countries v5 responded ${res.status}`);

    const json: RcV5ListResponse = await res.json();
    const objects = json.data?.objects ?? [];
    collected.push(...objects);

    if (!json.data?.meta?.more || objects.length === 0 || offset > 900) break;
    offset += json.data.meta.limit ?? RC_V5_PAGE_LIMIT;
  }

  return toNationalityOptions(
    collected.map((c) => ({
      name: c.names?.common,
      demonym: c.demonyms?.eng?.m || c.demonyms?.eng?.f,
    })),
  );
}

/** Legacy keyless v3.1 endpoint, kept as a fallback while it remains live. */
async function fetchNationalitiesLegacy(): Promise<ComboOption[]> {
  const res = await fetch('https://restcountries.com/v3.1/all?fields=name,demonyms');
  if (!res.ok) throw new Error(`REST Countries v3.1 responded ${res.status}`);
  const data: Array<{ name?: { common?: string }; demonyms?: { eng?: { m?: string; f?: string } } }> =
    await res.json();

  return toNationalityOptions(
    data.map((c) => ({
      name: c.name?.common,
      demonym: c.demonyms?.eng?.m || c.demonyms?.eng?.f,
    })),
  );
}

/** v5 when a key is configured, then legacy v3.1; callers fall back to the bundled list. */
async function fetchNationalities(): Promise<ComboOption[]> {
  if (RC_API_KEY) {
    try {
      return await fetchNationalitiesV5(RC_API_KEY);
    } catch {
      /* fall through to the legacy endpoint */
    }
  }
  return fetchNationalitiesLegacy();
}

async function fetchCities(): Promise<ComboOption[]> {
  const res = await fetch('https://countriesnow.space/api/v0.1/countries');
  if (!res.ok) throw new Error(`CountriesNow responded ${res.status}`);
  const payload: { error?: boolean; data?: Array<{ country: string; cities: string[] }> } = await res.json();
  if (payload.error || !payload.data) throw new Error('CountriesNow returned an error');

  const seen = new Set<string>();
  const cities: ComboOption[] = [];
  for (const entry of payload.data) {
    for (const city of entry.cities) {
      const key = `${city}|${entry.country}`.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      cities.push({ value: city, label: city, description: entry.country, keywords: entry.country });
    }
  }
  if (cities.length === 0) throw new Error('Empty city list');
  // Curated airports first so IATA-coded picks stay on top of matches.
  return [...AIRPORT_OPTIONS, ...cities];
}

function useCachedOptions(
  cached: ComboOption[] | null,
  fallback: ComboOption[],
  load: () => Promise<ComboOption[]>,
  store: (opts: ComboOption[]) => void,
): { options: ComboOption[]; loading: boolean } {
  const [options, setOptions] = useState<ComboOption[]>(cached ?? fallback);
  const [loading, setLoading] = useState(cached === null);

  useEffect(() => {
    if (cached !== null) return;
    let alive = true;
    load()
      .then((opts) => {
        store(opts);
        if (alive) setOptions(opts);
      })
      .catch(() => {
        /* keep the bundled fallback */
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { options, loading };
}

export function useNationalityOptions() {
  return useCachedOptions(
    nationalityCache,
    NATIONALITY_FALLBACK,
    () => (nationalityPromise ??= fetchNationalities()),
    (opts) => (nationalityCache = opts),
  );
}

export function useCityOptions() {
  return useCachedOptions(
    cityCache,
    AIRPORT_OPTIONS,
    () => (cityPromise ??= fetchCities()),
    (opts) => (cityCache = opts),
  );
}
