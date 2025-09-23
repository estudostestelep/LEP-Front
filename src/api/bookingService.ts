import api from "./api";

export interface Reservation {
  id?: string;
  organization_id?: string;
  project_id?: string;
  customer_id: string;
  table_id: string;
  datetime: string; // ISO string
  party_size: number;
  note?: string;
  status: "confirmed" | "cancelled" | "completed" | "no_show";
  created_at?: string;
  updated_at?: string;
}

export interface CreateReservationRequest {
  organization_id: string;
  project_id: string;
  customer_id: string;
  table_id: string;
  datetime: string;
  party_size: number;
  note?: string;
}

export interface ReservationFilters {
  date?: string; // YYYY-MM-DD
  status?: string;
  table_id?: string;
}

export const reservationService = {
  getAll: (filters?: ReservationFilters) => {
    const params = new URLSearchParams();
    if (filters?.date) params.append('date', filters.date);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.table_id) params.append('table_id', filters.table_id);

    const queryString = params.toString();
    return api.get<Reservation[]>(`/reservation${queryString ? `?${queryString}` : ''}`);
  },
  getById: (id: string) => api.get<Reservation>(`/reservation/${id}`),
  create: (data: CreateReservationRequest) => api.post<Reservation>("/reservation", data),
  update: (id: string, data: Partial<Reservation>) => api.put<Reservation>(`/reservation/${id}`, data),
  remove: (id: string) => api.delete(`/reservation/${id}`),
};

// Mantenho o alias para compatibilidade
export const bookingService = reservationService;
export type Booking = Reservation;