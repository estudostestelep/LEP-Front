import { useState, useEffect } from 'react';
import { subscriptionService, SubscriptionLimits, Usage } from '@/api/subscriptionService';
import { useAuth } from '@/context/authContext';
import { useCurrentTenant } from './useCurrentTenant';

interface PermissionCheck {
  allowed: boolean;
  reason?: string;
  limit?: number;
  current?: number;
}

interface Permissions {
  // Verificações de limite
  canCreateTable: () => PermissionCheck;
  canCreateUser: () => PermissionCheck;
  canCreateProduct: () => PermissionCheck;
  canCreateReservation: () => PermissionCheck;

  // Verificações de funcionalidades
  canUseNotifications: () => PermissionCheck;
  canAccessReports: () => PermissionCheck;
  canUseAPI: () => PermissionCheck;
  canUseCustomBranding: () => PermissionCheck;

  // Dados de limite e uso
  limits: SubscriptionLimits | null;
  usage: Usage | null;
  loading: boolean;
  error: string | null;

  // Métodos utilitários
  getUsagePercentage: (type: 'tables' | 'users' | 'products' | 'reservations') => number;
  isNearLimit: (type: 'tables' | 'users' | 'products' | 'reservations', threshold?: number) => boolean;
  refetch: () => Promise<void>;
}

export function usePermissions(): Permissions {
  const { user } = useAuth();
  const { organization_id } = useCurrentTenant();
  const [limits, setLimits] = useState<SubscriptionLimits | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!user || !organization_id) return;

    try {
      setLoading(true);
      setError(null);

      const [limitsResponse, usageResponse] = await Promise.all([
        subscriptionService.getLimits(),
        subscriptionService.getUsage()
      ]);

      setLimits(limitsResponse.data);
      setUsage(usageResponse.data);
    } catch (err) {
      console.error('Erro ao buscar permissões:', err);
      setError('Erro ao carregar informações do plano');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [organization_id]); // eslint-disable-line react-hooks/exhaustive-deps

  const canCreateTable = (): PermissionCheck => {
    if (!limits || !usage) return { allowed: false, reason: 'Dados não carregados' };

    if (usage.tables_count >= limits.max_tables) {
      return {
        allowed: false,
        reason: `Limite de mesas atingido (${limits.max_tables})`,
        limit: limits.max_tables,
        current: usage.tables_count
      };
    }

    return { allowed: true };
  };

  const canCreateUser = (): PermissionCheck => {
    if (!limits || !usage) return { allowed: false, reason: 'Dados não carregados' };

    if (usage.users_count >= limits.max_users) {
      return {
        allowed: false,
        reason: `Limite de usuários atingido (${limits.max_users})`,
        limit: limits.max_users,
        current: usage.users_count
      };
    }

    return { allowed: true };
  };

  const canCreateProduct = (): PermissionCheck => {
    if (!limits || !usage) return { allowed: false, reason: 'Dados não carregados' };

    if (usage.products_count >= limits.max_products) {
      return {
        allowed: false,
        reason: `Limite de produtos atingido (${limits.max_products})`,
        limit: limits.max_products,
        current: usage.products_count
      };
    }

    return { allowed: true };
  };

  const canCreateReservation = (): PermissionCheck => {
    if (!limits || !usage) return { allowed: false, reason: 'Dados não carregados' };

    if (usage.reservations_today >= limits.max_reservations_per_day) {
      return {
        allowed: false,
        reason: `Limite diário de reservas atingido (${limits.max_reservations_per_day})`,
        limit: limits.max_reservations_per_day,
        current: usage.reservations_today
      };
    }

    return { allowed: true };
  };

  const canUseNotifications = (): PermissionCheck => {
    if (!limits) return { allowed: false, reason: 'Dados não carregados' };

    if (!limits.notifications_enabled) {
      return {
        allowed: false,
        reason: 'Notificações não disponíveis no seu plano'
      };
    }

    return { allowed: true };
  };

  const canAccessReports = (): PermissionCheck => {
    if (!limits) return { allowed: false, reason: 'Dados não carregados' };

    if (!limits.reports_enabled) {
      return {
        allowed: false,
        reason: 'Relatórios não disponíveis no seu plano'
      };
    }

    return { allowed: true };
  };

  const canUseAPI = (): PermissionCheck => {
    if (!limits) return { allowed: false, reason: 'Dados não carregados' };

    if (!limits.api_access) {
      return {
        allowed: false,
        reason: 'Acesso à API não disponível no seu plano'
      };
    }

    return { allowed: true };
  };

  const canUseCustomBranding = (): PermissionCheck => {
    if (!limits) return { allowed: false, reason: 'Dados não carregados' };

    if (!limits.custom_branding) {
      return {
        allowed: false,
        reason: 'Personalização de marca não disponível no seu plano'
      };
    }

    return { allowed: true };
  };

  const getUsagePercentage = (type: 'tables' | 'users' | 'products' | 'reservations'): number => {
    if (!limits || !usage) return 0;

    const currentUsage = {
      tables: usage.tables_count,
      users: usage.users_count,
      products: usage.products_count,
      reservations: usage.reservations_today
    }[type];

    const maxLimit = {
      tables: limits.max_tables,
      users: limits.max_users,
      products: limits.max_products,
      reservations: limits.max_reservations_per_day
    }[type];

    return maxLimit > 0 ? Math.round((currentUsage / maxLimit) * 100) : 0;
  };

  const isNearLimit = (type: 'tables' | 'users' | 'products' | 'reservations', threshold = 80): boolean => {
    return getUsagePercentage(type) >= threshold;
  };

  const refetch = async () => {
    await fetchData();
  };

  return {
    canCreateTable,
    canCreateUser,
    canCreateProduct,
    canCreateReservation,
    canUseNotifications,
    canAccessReports,
    canUseAPI,
    canUseCustomBranding,
    limits,
    usage,
    loading,
    error,
    getUsagePercentage,
    isNearLimit,
    refetch
  };
}