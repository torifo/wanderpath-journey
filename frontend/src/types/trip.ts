export interface Trip {
  id: number;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  prefecture?: string;
  status: 'draft' | 'planned' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
  user_id: number;
  spots: Spot[];
}

export interface Spot {
  id: number;
  name: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  spot_type: 'attraction' | 'restaurant' | 'hotel' | 'transportation' | 'other';
  visit_date?: string;
  visit_time?: string;
  duration?: number;
  cost?: number;
  notes?: string;
  trip_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateTripData {
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  prefecture?: string;
}

export interface UpdateTripData extends Partial<CreateTripData> {
  status?: 'draft' | 'planned' | 'in_progress' | 'completed';
}

export interface CreateSpotData {
  name: string;
  description?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  spot_type: 'attraction' | 'restaurant' | 'hotel' | 'transportation' | 'other';
  visit_date?: string;
  visit_time?: string;
  duration?: number;
  cost?: number;
  notes?: string;
  trip_id: number;
}

export interface UpdateSpotData extends Partial<CreateSpotData> {}