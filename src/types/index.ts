export interface Location {
  id: string;
  name: string;
  description?: string;
  lat: number;
  lng: number;
  completed?: boolean;
}

export interface DayPlan {
  id: string;
  dayNumber: number;
  title: string;
  date?: string;
  locations: Location[];
}

export interface Itinerary {
  days: DayPlan[];
}
