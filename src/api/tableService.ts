import api from "./api";

export interface Table {
  id?: string;
  organization_id?: string;
  project_id?: string;
  environment_id?: string;
  number: number;
  capacity: number;
  location?: string;
  status: "livre" | "ocupada" | "reservada";
  created_at?: string;
  updated_at?: string;
}

export interface CreateTableRequest {
  organization_id: string;
  project_id: string;
  environment_id?: string;
  number: number;
  capacity: number;
  location?: string;
  status?: "livre" | "ocupada" | "reservada";
}

export const tableService = {
  getAll: () => api.get<Table[]>("/table"),
  getById: (id: string) => api.get<Table>(`/table/${id}`),
  create: (data: CreateTableRequest) => api.post<Table>("/table", data),
  update: (id: string, data: Partial<Table>) => api.put<Table>(`/table/${id}`, data),
  remove: (id: string) => api.delete(`/table/${id}`),
};
