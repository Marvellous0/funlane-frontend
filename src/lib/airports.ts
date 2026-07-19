import type { ComboOption } from '@/components/form/ComboboxField';

/**
 * Curated airport reference for the request form's origin/destination pickers.
 * Nigeria-first (Funlane's home market), then major African hubs and the
 * long-haul destinations Nigerian travellers book most.
 */
export interface Airport {
  /** IATA code, e.g. "LOS". */
  code: string;
  city: string;
  /** Airport name, e.g. "Murtala Muhammed International". */
  name: string;
  country: string;
}

export const AIRPORTS: Airport[] = [
  // Nigeria
  { code: 'LOS', city: 'Lagos', name: 'Murtala Muhammed International', country: 'Nigeria' },
  { code: 'ABV', city: 'Abuja', name: 'Nnamdi Azikiwe International', country: 'Nigeria' },
  { code: 'PHC', city: 'Port Harcourt', name: 'Port Harcourt International', country: 'Nigeria' },
  { code: 'KAN', city: 'Kano', name: 'Mallam Aminu Kano International', country: 'Nigeria' },
  { code: 'ENU', city: 'Enugu', name: 'Akanu Ibiam International', country: 'Nigeria' },
  { code: 'QOW', city: 'Owerri', name: 'Sam Mbakwe', country: 'Nigeria' },
  { code: 'QUO', city: 'Uyo', name: 'Victor Attah International', country: 'Nigeria' },
  { code: 'CBQ', city: 'Calabar', name: 'Margaret Ekpo International', country: 'Nigeria' },
  { code: 'BNI', city: 'Benin City', name: 'Benin Airport', country: 'Nigeria' },
  { code: 'KAD', city: 'Kaduna', name: 'Kaduna International', country: 'Nigeria' },
  { code: 'ILR', city: 'Ilorin', name: 'Ilorin International', country: 'Nigeria' },
  { code: 'ABB', city: 'Asaba', name: 'Asaba International', country: 'Nigeria' },
  { code: 'YOL', city: 'Yola', name: 'Yola Airport', country: 'Nigeria' },
  { code: 'SKO', city: 'Sokoto', name: 'Sadiq Abubakar III International', country: 'Nigeria' },
  { code: 'MIU', city: 'Maiduguri', name: 'Maiduguri International', country: 'Nigeria' },
  { code: 'JOS', city: 'Jos', name: 'Yakubu Gowon Airport', country: 'Nigeria' },

  // Africa
  { code: 'ACC', city: 'Accra', name: 'Kotoka International', country: 'Ghana' },
  { code: 'NBO', city: 'Nairobi', name: 'Jomo Kenyatta International', country: 'Kenya' },
  { code: 'JNB', city: 'Johannesburg', name: 'O. R. Tambo International', country: 'South Africa' },
  { code: 'ADD', city: 'Addis Ababa', name: 'Bole International', country: 'Ethiopia' },
  { code: 'CAI', city: 'Cairo', name: 'Cairo International', country: 'Egypt' },
  { code: 'KGL', city: 'Kigali', name: 'Kigali International', country: 'Rwanda' },
  { code: 'DSS', city: 'Dakar', name: 'Blaise Diagne International', country: 'Senegal' },
  { code: 'CMN', city: 'Casablanca', name: 'Mohammed V International', country: 'Morocco' },
  { code: 'ABJ', city: 'Abidjan', name: 'Félix-Houphouët-Boigny', country: "Côte d'Ivoire" },

  // Long-haul
  { code: 'LHR', city: 'London', name: 'Heathrow', country: 'United Kingdom' },
  { code: 'LGW', city: 'London', name: 'Gatwick', country: 'United Kingdom' },
  { code: 'DXB', city: 'Dubai', name: 'Dubai International', country: 'United Arab Emirates' },
  { code: 'DOH', city: 'Doha', name: 'Hamad International', country: 'Qatar' },
  { code: 'IST', city: 'Istanbul', name: 'Istanbul Airport', country: 'Türkiye' },
  { code: 'JED', city: 'Jeddah', name: 'King Abdulaziz International', country: 'Saudi Arabia' },
  { code: 'CDG', city: 'Paris', name: 'Charles de Gaulle', country: 'France' },
  { code: 'AMS', city: 'Amsterdam', name: 'Schiphol', country: 'Netherlands' },
  { code: 'FRA', city: 'Frankfurt', name: 'Frankfurt Airport', country: 'Germany' },
  { code: 'JFK', city: 'New York', name: 'John F. Kennedy International', country: 'United States' },
  { code: 'ATL', city: 'Atlanta', name: 'Hartsfield–Jackson', country: 'United States' },
  { code: 'IAD', city: 'Washington', name: 'Dulles International', country: 'United States' },
  { code: 'YYZ', city: 'Toronto', name: 'Pearson International', country: 'Canada' },
  { code: 'GZ', city: 'Guangzhou', name: 'Baiyun International', country: 'China' },
];

/**
 * Codes surfaced first when the picker is opened with an empty query — a mix
 * of Nigerian origins and the international hubs Nigerian travellers book
 * most, so the default view reads as international rather than Nigeria-only.
 */
const FEATURED_CODES = ['LOS', 'LHR', 'ABV', 'DXB', 'DOH', 'AMS', 'IST', 'JFK', 'PHC', 'CDG'];

const featuredRank = (code: string) => {
  const i = FEATURED_CODES.indexOf(code);
  return i === -1 ? FEATURED_CODES.length : i;
};

/** Prebuilt combobox options: value stays "City (CODE)" to match existing data. */
export const AIRPORT_OPTIONS: ComboOption[] = [...AIRPORTS]
  .sort((a, b) => featuredRank(a.code) - featuredRank(b.code))
  .map((a) => ({
    value: `${a.city} (${a.code})`,
    label: a.city,
    description: `${a.name} · ${a.country}`,
    badge: a.code,
    keywords: `${a.country} ${a.name}`,
  }));
