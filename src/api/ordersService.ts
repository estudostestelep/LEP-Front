import api from "./api";

export interface OrderItem {
  product_id: string;
  quantity: number;
  product_name?: string; // Para exibição
  prep_time_minutes?: number; // Para exibição
}

export interface Order {
  id?: string;
  organization_id?: string;
  project_id?: string;
  table_id?: string;
  table_number?: number; // Para pedidos públicos
  customer_id?: string;
  items: OrderItem[];
  total_amount?: number;
  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled";
  source?: "internal" | "public";
  note?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateOrderRequest {
  organization_id: string;
  project_id: string;
  table_id?: string;
  table_number?: number; // Para pedidos públicos
  customer_id?: string;
  items: { product_id: string; quantity: number }[];
  note?: string;
  source?: "internal" | "public";
}

export interface KitchenQueueItem {
  id: string;
  table_number: number;
  items: {
    product_name: string;
    quantity: number;
    prep_time_minutes: number;
  }[];
  status: "preparing" | "ready";
  estimated_completion?: string;
  created_at: string;
}

export const orderService = {
  getAll: () => api.get<Order[]>("/order"),
  getById: (id: string) => api.get<Order>(`/order/${id}`),
  create: (data: CreateOrderRequest) => api.post<Order>("/order", data),
  update: (id: string, data: Partial<Order>) => api.put<Order>(`/order/${id}`, data),
  remove: (id: string) => api.delete(`/order/${id}`),

  // Funcionalidades específicas da cozinha
  getKitchenQueue: () => api.get<KitchenQueueItem[]>("/kitchen/queue"),
};
