import api from "./api";

export interface Settings {
  id?: string;
  project_id: string;
  notify_reservation_create?: boolean;
  notify_reservation_update?: boolean;
  notify_reservation_cancel?: boolean;
  notify_table_available?: boolean;
  notify_confirmation_24h?: boolean;
  default_confirmation_hours?: number;
  restaurant_name?: string;
  restaurant_phone?: string;
  restaurant_address?: string;
  business_hours?: string;
  updated_at?: string;
}

export const settingsService = {
  getByProject: () => api.get<Settings>("/settings"),
  update: (data: Settings) => api.put<Settings>("/settings", data),
};