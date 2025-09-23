import api from "./api";

// Interface para itens da fila da cozinha
export interface KitchenQueueItem {
  id: string;
  table_number: number;
  items: Array<{
    product_name: string;
    quantity: number;
    prep_time_minutes: number;
  }>;
  status: "preparing" | "ready";
  estimated_completion?: string; // ISO string
  created_at: string; // ISO string
  total_prep_time?: number; // tempo total estimado em minutos
  priority?: number; // prioridade (1-10, maior = mais urgente)
}

// Interface para estatísticas da cozinha
export interface KitchenStats {
  total_orders_in_queue: number;
  average_prep_time: number; // em minutos
  orders_preparing: number;
  orders_ready: number;
  estimated_completion_time: number; // tempo para completar toda a fila em minutos
}

// Interface para métricas de performance da cozinha
export interface KitchenPerformance {
  orders_completed_today: number;
  average_completion_time: number; // tempo médio real de preparo
  efficiency_score: number; // score 0-100 baseado em tempo estimado vs real
  busiest_hours: Array<{
    hour: string; // formato HH:00
    order_count: number;
  }>;
}

export const kitchenService = {
  // Obter fila de pedidos para a cozinha
  getQueue: () => api.get<KitchenQueueItem[]>("/kitchen/queue"),

  // Obter estatísticas em tempo real da cozinha
  getStats: () => api.get<KitchenStats>("/kitchen/stats"),

  // Obter métricas de performance da cozinha
  getPerformance: (date?: string) => {
    const params = date ? `?date=${date}` : '';
    return api.get<KitchenPerformance>(`/kitchen/performance${params}`);
  },

  // Atualizar status de um pedido na cozinha
  updateOrderStatus: (orderId: string, status: "preparing" | "ready") =>
    api.put(`/kitchen/order/${orderId}/status`, { status }),

  // Marcar item específico como pronto
  markItemReady: (orderId: string, productId: string) =>
    api.put(`/kitchen/order/${orderId}/item/${productId}/ready`),

  // Obter tempo estimado para completar um novo pedido
  getEstimatedTime: (items: Array<{ product_id: string; quantity: number }>) =>
    api.post<{ estimated_minutes: number }>("/kitchen/estimate", { items }),

  // Obter histórico de pedidos completados (para análise)
  getCompletedOrders: (date?: string, limit: number = 50) => {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    params.append('limit', limit.toString());

    const query = params.toString();
    return api.get<KitchenQueueItem[]>(`/kitchen/completed${query ? `?${query}` : ''}`);
  }
};