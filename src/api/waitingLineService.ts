import api from "./api";

export interface Waitlist {
  id?: string;
  organization_id?: string;
  project_id?: string;
  customer_id: string;
  party_size: number;
  estimated_wait?: number; // em minutos
  status: "waiting" | "seated" | "left";
  created_at?: string;
  updated_at?: string;
}

export interface CreateWaitlistRequest {
  organization_id: string;
  project_id: string;
  customer_id: string;
  party_size: number;
  estimated_wait?: number;
}

export const waitlistService = {
  getAll: () => api.get<Waitlist[]>("/waitlist"),
  getById: (id: string) => api.get<Waitlist>(`/waitlist/${id}`),
  create: (data: CreateWaitlistRequest) => api.post<Waitlist>("/waitlist", data),
  update: (id: string, data: Partial<Waitlist>) => api.put<Waitlist>(`/waitlist/${id}`, data),
  remove: (id: string) => api.delete(`/waitlist/${id}`),
};

// Mantenho o alias para compatibilidade
export const waitingLineService = waitlistService;
export type WaitingLine = Waitlist;
