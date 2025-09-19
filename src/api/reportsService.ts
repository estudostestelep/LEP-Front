import api from "./api";

export interface ReportFilters {
  start_date: string; // YYYY-MM-DD
  end_date: string; // YYYY-MM-DD
}

export interface OccupancyReport {
  date: string;
  total_tables: number;
  occupied_tables: number;
  occupancy_rate: number;
  peak_hours: string[];
}

export interface ReservationReport {
  date: string;
  total_reservations: number;
  confirmed_reservations: number;
  cancelled_reservations: number;
  no_show_reservations: number;
  most_popular_tables: { table_number: number; reservations: number }[];
}

export type ReportType = "occupancy" | "reservations";

export const reportsService = {
  getOccupancyReport: (filters: ReportFilters) =>
    api.get<OccupancyReport[]>("/reports/occupancy", { params: filters }),

  getReservationReport: (filters: ReportFilters) =>
    api.get<ReservationReport[]>("/reports/reservations", { params: filters }),

  exportToCSV: (type: ReportType, filters: ReportFilters) =>
    api.get(`/reports/export/csv`, {
      params: { type, ...filters },
      responseType: 'blob' // Para download de arquivo
    }),
};