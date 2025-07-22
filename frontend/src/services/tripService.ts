import { apiClient } from './api';
import type { Trip, CreateTripData, UpdateTripData, Spot, CreateSpotData, UpdateSpotData } from '../types/trip';

export const tripService = {
  // Trip CRUD operations
  getAllTrips: async (): Promise<Trip[]> => {
    const response = await apiClient.get('/trips');
    const trips = response.data.trips || [];
    
    // Rails APIからのデータを適切な形式に変換
    return trips.map((trip: any) => ({
      id: trip.id,
      title: trip.title,
      description: trip.description || '',
      start_date: trip.start_date,
      end_date: trip.end_date,
      prefecture: trip.prefecture || '',
      status: 'planned' as const,
      created_at: trip.created_at,
      updated_at: trip.updated_at,
      user_id: trip.user_id,
      trip_type: trip.trip_type || '日帰り',
      spots: [] // ここでは空配列、詳細はgetTripByIdで取得
    }));
  },

  getTripById: async (id: number): Promise<Trip> => {
    const response = await apiClient.get(`/trips/${id}`);
    const { trip, destination_spots = [], waypoint_spots = [] } = response.data;
    
    // destination_spotsとwaypoint_spotsを統合してtrip.spotsを作成
    const spots = [...destination_spots, ...waypoint_spots].map((spot: any) => ({
      id: spot.id,
      name: spot.name,
      description: spot.description,
      address: spot.prefecture || '', // prefectureをaddressとして使用
      latitude: null,
      longitude: null,
      spot_type: spot.spot_type === 'destination' ? 'attraction' : 'other',
      visit_date: null,
      visit_time: null,
      duration: null,
      cost: null,
      notes: null,
      trip_id: trip.id,
      created_at: spot.created_at,
      updated_at: spot.updated_at
    }));
    
    return {
      ...trip,
      spots: spots,
      // trip_typeが存在しない場合のデフォルト値を設定
      trip_type: trip.trip_type || '日帰り',
      status: 'planned' as const, // デフォルトステータス
      prefecture: trip.prefecture || '',
      description: trip.description || ''
    };
  },

  createTrip: async (tripData: CreateTripData): Promise<Trip> => {
    const response = await apiClient.post('/trips', { trip: tripData });
    return response.data.trip;
  },

  updateTrip: async (id: number, tripData: UpdateTripData): Promise<Trip> => {
    const response = await apiClient.put(`/trips/${id}`, { trip: tripData });
    return response.data.trip;
  },

  deleteTrip: async (id: number): Promise<void> => {
    await apiClient.delete(`/trips/${id}`);
  },

  // Spot CRUD operations
  getTripSpots: async (tripId: number): Promise<Spot[]> => {
    const response = await apiClient.get(`/trips/${tripId}/spots`);
    return response.data.spots;
  },

  createSpot: async (spotData: CreateSpotData): Promise<Spot> => {
    const response = await apiClient.post('/spots', { spot: spotData });
    return response.data.spot;
  },

  updateSpot: async (id: number, spotData: UpdateSpotData): Promise<Spot> => {
    const response = await apiClient.put(`/spots/${id}`, { spot: spotData });
    return response.data.spot;
  },

  deleteSpot: async (id: number): Promise<void> => {
    await apiClient.delete(`/spots/${id}`);
  }
};