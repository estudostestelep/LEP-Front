// import api from "./api"; // Comentado - não usado no mock

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

// ⚠️ MOCK SERVICE - Backend não implementado ainda
// TODO: Implementar endpoints do backend ou remover funcionalidade

const mockPlans: SubscriptionPlan[] = [
  {
    id: "plan_basic",
    name: "Básico",
    description: "Ideal para restaurantes pequenos",
    price_monthly: 99.90,
    price_yearly: 999.00,
    features: ["Gestão básica", "Suporte email"],
    limits: {
      max_tables: 10,
      max_users: 3,
      max_products: 50,
      max_reservations_per_day: 20,
      notifications_enabled: false,
      reports_enabled: false,
      api_access: false,
      custom_branding: false,
    },
    active: true
  },
  {
    id: "plan_pro",
    name: "Profissional",
    description: "Para restaurantes em crescimento",
    price_monthly: 199.90,
    price_yearly: 1999.00,
    features: ["Tudo do Básico", "Notificações", "Relatórios"],
    limits: {
      max_tables: 25,
      max_users: 10,
      max_products: 200,
      max_reservations_per_day: 100,
      notifications_enabled: true,
      reports_enabled: true,
      api_access: true,
      custom_branding: false,
    },
    active: true
  },
  {
    id: "plan_enterprise",
    name: "Enterprise",
    description: "Para redes de restaurantes",
    price_monthly: 399.90,
    price_yearly: 3999.00,
    features: ["Tudo do Pro", "API", "Marca personalizada", "Suporte 24/7"],
    limits: {
      max_tables: 100,
      max_users: 50,
      max_products: 1000,
      max_reservations_per_day: 500,
      notifications_enabled: true,
      reports_enabled: true,
      api_access: true,
      custom_branding: true,
    },
    active: true
  }
];

const mockSubscription: Subscription = {
  id: "sub_123",
  organization_id: "org_123",
  plan_id: "plan_pro",
  status: "active",
  billing_cycle: "monthly",
  current_period_start: new Date().toISOString(),
  current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  created_at: new Date().toISOString(),
  plan: mockPlans[1]
};

const mockUsage: Usage = {
  organization_id: "org_123",
  tables_count: 8,
  users_count: 5,
  products_count: 35,
  reservations_today: 12,
  notifications_sent_this_month: 150,
  updated_at: new Date().toISOString()
};

export const subscriptionService = {
  // ⚠️ MOCK ENDPOINTS - Retornam dados temporários

  // Planos disponíveis
  getPlans: () => Promise.resolve({ data: mockPlans }),
  getPlanById: (id: string) => Promise.resolve({ data: mockPlans.find(p => p.id === id) || mockPlans[0] }),

  // Assinatura atual
  getCurrentSubscription: () => Promise.resolve({ data: mockSubscription }),
  getUsage: () => Promise.resolve({ data: mockUsage }),
  getLimits: () => Promise.resolve({ data: mockSubscription.plan?.limits || mockPlans[1].limits }),

  // Operações de assinatura (mock - não fazem nada real)
  subscribe: (planId: string, billingCycle: "monthly" | "yearly") =>
    Promise.resolve({ data: { ...mockSubscription, plan_id: planId, billing_cycle: billingCycle } }),

  changePlan: (planId: string, billingCycle?: "monthly" | "yearly") =>
    Promise.resolve({ data: { ...mockSubscription, plan_id: planId, billing_cycle: billingCycle || mockSubscription.billing_cycle } }),

  cancelSubscription: () =>
    Promise.resolve({ data: { ...mockSubscription, status: "cancelled" as const, cancelled_at: new Date().toISOString() } }),

  reactivateSubscription: () =>
    Promise.resolve({ data: { ...mockSubscription, status: "active" as const, cancelled_at: undefined } }),

  // Histórico de faturas (mock vazio)
  getInvoices: () => Promise.resolve({ data: [] }),

  // Checkout (mock - não redireciona)
  createCheckoutSession: (planId: string, billingCycle: "monthly" | "yearly") => {
    // Mock implementation - parâmetros ignorados intencionalmente
    void planId;
    void billingCycle;
    return Promise.resolve({ data: { checkout_url: "#mock-checkout" } });
  },
};