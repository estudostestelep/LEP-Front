import api from "./api";

export interface Table {
  id?: string;
  number: number;
  capacity: number;
  status?: "available" | "occupied" | "reserved";
}

export const tableService = {
  getAll: () => api.get<Table[]>("/tables"),
  getById: (id: string) => api.get<Table>(`/tables/${id}`),
  create: (data: Table) => api.post<Table>("/tables", data),
  update: (id: string, data: Table) => api.put<Table>(`/tables/${id}`, data),
  remove: (id: string) => api.delete(`/tables/${id}`),
};
