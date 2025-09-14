import api from "./api";

export interface WaitingLine {
  id?: string;
  clientId: string;
  people: number;
  createdAt?: string;
}

export const waitingLineService = {
  getAll: () => api.get<WaitingLine[]>("/waiting-line"),
  getById: (id: string) => api.get<WaitingLine>(`/waiting-line/${id}`),
  create: (data: WaitingLine) => api.post<WaitingLine>("/waiting-line", data),
  update: (id: string, data: WaitingLine) => api.put<WaitingLine>(`/waiting-line/${id}`, data),
  remove: (id: string) => api.delete(`/waiting-line/${id}`),
};
