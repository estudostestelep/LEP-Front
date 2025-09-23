import api from "./api";

export interface Environment {
  id?: string;
  name: string;
  description?: string;
  project_id: string;
  twilio_account_sid?: string;
  twilio_auth_token?: string;
  twilio_phone_number?: string;
  smtp_host?: string;
  smtp_port?: number;
  smtp_username?: string;
  smtp_password?: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const environmentService = {
  getAll: () => api.get<Environment[]>("/environment"),
  getActive: () => api.get<Environment[]>("/environment/active"),
  getById: (id: string) => api.get<Environment>(`/environment/${id}`),
  create: (data: Environment) => api.post<Environment>("/environment", data),
  update: (id: string, data: Environment) => api.put<Environment>(`/environment/${id}`, data),
  remove: (id: string) => api.delete(`/environment/${id}`),
};