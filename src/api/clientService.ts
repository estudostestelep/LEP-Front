import api from "./api";

export interface Client {
  id?: string;
  name: string;
  phone: string;
  email?: string;
}

export const clientService = {
  getAll: () => api.get<Client[]>("/clients"),
  getById: (id: string) => api.get<Client>(`/clients/${id}`),
  create: (data: Client) => api.post<Client>("/clients", data),
  update: (id: string, data: Client) => api.put<Client>(`/clients/${id}`, data),
  remove: (id: string) => api.delete(`/clients/${id}`),
};