import api from "./api";

// Interfaces para Reports
export interface OccupancyReport {
  daily_occupancy_rate: number;
  monthly_occupancy_rate: number;
  peak_hours: Array<{
    hour: string;
    occupancy_rate: number;
  }>;
  most_used_tables: Array<{
    table_number: number;
    usage_count: number;
  }>;
  least_used_tables: Array<{
    table_number: number;
    usage_count: number;
  }>;
  average_occupation_time: number; // em minutos
  revenue_per_table: Array<{
    table_number: number;
    revenue: number;
  }>;
}

export interface ReservationReport {
  total_reservations: number;
  cancellation_rate: number;
  no_show_rate: number;
  preferred_times: Array<{
    hour: string;
    reservation_count: number;
  }>;
  frequent_customers: Array<{
    customer_name: string;
    customer_phone: string;
    reservation_count: number;
  }>;
  reservations_by_day: Array<{
    date: string;
    count: number;
  }>;
}

export interface WaitlistReport {
  average_wait_time: number; // em minutos
  conversion_rate: number; // waitlist -> mesa
  peak_wait_hours: Array<{
    hour: string;
    average_wait_time: number;
  }>;
  abandonment_rate: number;
  satisfaction_estimate: number; // 0-100
  waitlist_by_party_size: Array<{
    party_size: number;
    count: number;
    average_wait_time: number;
  }>;
}

export interface LeadReport {
  new_customers_count: number;
  acquisition_sources: Array<{
    source: string;
    count: number;
  }>;
  retention_rate: number;
  estimated_lifetime_value: number;
  most_effective_channels: Array<{
    channel: string;
    effectiveness_score: number;
  }>;
  customer_growth: Array<{
    date: string;
    new_customers: number;
    total_customers: number;
  }>;
}

// Query parameters para filtros
export interface ReportFilters {
  start_date?: string; // YYYY-MM-DD
  end_date?: string;   // YYYY-MM-DD
  table_id?: string;
  customer_id?: string;
}

export const reportsService = {
  // Relatório de ocupação de mesas
  getOccupancyReport: (filters?: ReportFilters) => {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.table_id) params.append('table_id', filters.table_id);

    const query = params.toString();
    return api.get<OccupancyReport>(`/reports/occupancy${query ? `?${query}` : ''}`);
  },

  // Relatório de reservas
  getReservationReport: (filters?: ReportFilters) => {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.customer_id) params.append('customer_id', filters.customer_id);

    const query = params.toString();
    return api.get<ReservationReport>(`/reports/reservations${query ? `?${query}` : ''}`);
  },

  // Relatório da lista de espera
  getWaitlistReport: (filters?: ReportFilters) => {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);

    const query = params.toString();
    return api.get<WaitlistReport>(`/reports/waitlist${query ? `?${query}` : ''}`);
  },

  // Relatório de leads/captação
  getLeadReport: (filters?: ReportFilters) => {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);

    const query = params.toString();
    return api.get<LeadReport>(`/reports/leads${query ? `?${query}` : ''}`);
  },

  // Exportar relatório em CSV
  exportReport: (type: 'occupancy' | 'reservations' | 'waitlist' | 'leads', filters?: ReportFilters) => {
    const params = new URLSearchParams();
    if (filters?.start_date) params.append('start_date', filters.start_date);
    if (filters?.end_date) params.append('end_date', filters.end_date);
    if (filters?.table_id) params.append('table_id', filters.table_id);
    if (filters?.customer_id) params.append('customer_id', filters.customer_id);

    const query = params.toString();
    return api.get(`/reports/export/${type}${query ? `?${query}` : ''}`, {
      responseType: 'blob' // Para download de arquivo
    });
  }
};