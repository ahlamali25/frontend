export interface Office {
  id: number;
  name: string;
  phone?: string;
  address?: string;
  rating: string | number | null;
  description?: string | null;
  status?: string;
  trips_count: number;
}