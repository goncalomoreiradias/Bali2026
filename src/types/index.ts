export interface Location {
  id: string;
  name: string;
  description?: string;
  timeSlot?: string;
  lat: number;
  lng: number;
  completed?: boolean;
  tag?: string;
  mapsUrl?: string;
  notes?: string; // General notes/links (reels, booking, tips, etc.)
}

export interface BucketListItem {
  id: string;
  name: string;
  lat: number;
  lng: number;
  category?: string;
  address?: string;
  mapsUrl?: string;
  sourceUrl?: string;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  paidBy: string;
  date: string; // ISO string
  category?: string;
}

export interface DayPlan {
  id: string;
  dayNumber: number;
  title: string;
  locations: Location[];
  tripId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Itinerary {
  id: string;
  title: string;
  description?: string;
  password?: string;
  startDate?: string;
  endDate?: string;
  bucketListUrls?: string[];
  bucketListItems?: BucketListItem[];
  participants: string[];
  days: DayPlan[];
  expenses?: Expense[];
  budget?: number; // Target budget
}

export type Trip = Itinerary;
