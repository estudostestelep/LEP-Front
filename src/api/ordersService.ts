import api from "./api";

export interface Order {
  id?: string;
  mesaId: string;
  items: { produtoId: string; quantity: number }[];
  status?: "pending" | "in_progress" | "delivered" | "cancelled";
}

export const orderService = {
  getAll: () => api.get<Order[]>("/orders"),
  getById: (id: string) => api.get<Order>(`/orders/${id}`),
  create: (data: Order) => api.post<Order>("/orders", data),
  update: (id: string, data: Order) => api.put<Order>(`/orders/${id}`, data),
  remove: (id: string) => api.delete(`/orders/${id}`),
};
