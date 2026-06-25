export type RequestStatus = 'pending' | 'quoted' | 'approved' | 'issued';
export type TripType = 'round' | 'oneway';
export type BudgetTierKey = 'economy' | 'standard' | 'premium';
export type PreferredTime = 'Morning' | 'Afternoon' | 'Evening' | 'Any time';

export interface Passenger {
  first: string;
  last: string;
  passport: string;
  dob: string;
}

export interface FlightOption {
  id: string;
  airline: string;
  flightNo: string;
  price: number;
  depart: string;
  arrive: string;
  notes: string;
}

export interface HistoryEntry {
  ts: string;
  text: string;
}

export interface TravelRequest {
  id: string;
  ref: string;
  clientId: string;
  clientName: string;
  tripType: TripType;
  from: string;
  to: string;
  departDate: string;
  returnDate: string;
  preferredAirline: string;
  preferredTime: PreferredTime;
  budgetTier: BudgetTierKey;
  passengers: Passenger[];
  notes: string;
  status: RequestStatus;
  assignedAgent: string;
  options: FlightOption[];
  selectedOptionId: string | null;
  rejectionReason: string | null;
  lockedAmount: number;
  ticketFileName: string | null;
  createdAt: string;
  updatedAt: string;
  history: HistoryEntry[];
}

/** Shape submitted from the "New booking request" intake form. */
export interface NewRequestInput {
  tripType: TripType;
  from: string;
  to: string;
  departDate: string;
  returnDate: string;
  preferredAirline: string;
  preferredTime: PreferredTime;
  budgetTier: BudgetTierKey;
  passengers: Passenger[];
  notes: string;
}

/** Shape an agent stages in the quotation builder. */
export type NewOptionInput = Omit<FlightOption, 'id'>;
