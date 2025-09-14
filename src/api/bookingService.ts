import api from "./api";

export interface Booking {
  id?: string;
  clientId: string;
  mesaId: string;
  date: string; // ISO string
  status?: "pending" | "confirmed" | "cancelled";
}

export const bookingService = {
  getAll: () => api.get<Booking[]>("/bookings"),
  getById: (id: string) => api.get<Booking>(`/bookings/${id}`),
  create: (data: Booking) => api.post<Booking>("/bookings", data),
  update: (id: string, data: Booking) => api.put<Booking>(`/bookings/${id}`, data),
  remove: (id: string) => api.delete(`/bookings/${id}`),
};