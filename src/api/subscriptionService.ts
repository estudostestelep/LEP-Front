import api from "./api";

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  limits: {
    max_tables: number;
    max_users: number;
    max_products: number;
    max_reservations_per_day: number;
    notifications_enabled: boolean;
    reports_enabled: boolean;
    api_access: boolean;
    custom_branding: boolean;
  };
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Subscription {
  id: string;
  organization_id: string;
  plan_id: string;
  status: "active" | "cancelled" | "expired" | "trial";
  billing_cycle: "monthly" | "yearly";
  current_period_start: string;
  current_period_end: string;
  trial_end?: string;
  cancelled_at?: string;
  created_at: string;
  updated_at?: string;
  plan?: SubscriptionPlan;
}

export interface Usage {
  organization_id: string;
  tables_count: number;
  users_count: number;
  products_count: number;
  reservations_today: number;
  notifications_sent_this_month: number;
  updated_at: string;
}

export interface SubscriptionLimits {
  max_tables: number;
  max_users: number;
  max_products: number;
  max_reservations_per_day: number;
  notifications_enabled: boolean;
  reports_enabled: boolean;
  api_access: boolean;
  custom_branding: boolean;
}

export const subscriptionService = {
  // Planos disponíveis
  getPlans: () => api.get<SubscriptionPlan[]>("/subscription/plans"),
  getPlanById: (id: string) => api.get<SubscriptionPlan>(`/subscription/plans/${id}`),

  // Assinatura atual
  getCurrentSubscription: () => api.get<Subscription>("/subscription/current"),
  getUsage: () => api.get<Usage>("/subscription/usage"),
  getLimits: () => api.get<SubscriptionLimits>("/subscription/limits"),

  // Operações de assinatura
  subscribe: (planId: string, billingCycle: "monthly" | "yearly") =>
    api.post<Subscription>("/subscription/subscribe", { plan_id: planId, billing_cycle: billingCycle }),

  changePlan: (planId: string, billingCycle?: "monthly" | "yearly") =>
    api.put<Subscription>("/subscription/change-plan", { plan_id: planId, billing_cycle: billingCycle }),

  cancelSubscription: () =>
    api.post<Subscription>("/subscription/cancel"),

  reactivateSubscription: () =>
    api.post<Subscription>("/subscription/reactivate"),

  // Histórico de faturas
  getInvoices: () => api.get("/subscription/invoices"),

  // Checkout (integração com gateway de pagamento)
  createCheckoutSession: (planId: string, billingCycle: "monthly" | "yearly") =>
    api.post<{ checkout_url: string }>("/subscription/checkout", { plan_id: planId, billing_cycle: billingCycle }),
};