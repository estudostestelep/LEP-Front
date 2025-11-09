import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { usePermissions } from '../usePermissions'
import { AuthProvider } from '@/context/authContext'
import { subscriptionService } from '@/api/subscriptionService'

// Mock the subscription service
vi.mock('@/api/subscriptionService', () => ({
  subscriptionService: {
    getPlans: vi.fn(),
    getPlanById: vi.fn(),
    getCurrentSubscription: vi.fn(),
    getUsage: vi.fn(),
    getLimits: vi.fn(),
    subscribe: vi.fn(),
    changePlan: vi.fn(),
    cancelSubscription: vi.fn(),
    reactivateSubscription: vi.fn(),
    getInvoices: vi.fn(),
    createCheckoutSession: vi.fn(),
  }
}))

const mockSubscriptionService = vi.mocked(subscriptionService)

// Mock AuthContext
const mockUser = {
  id: 'user-123',
  name: 'John Doe',
  email: 'john@example.com',
  organization_id: 'org-123',
  project_id: 'project-123',
  permissions: ['read', 'write']
}

vi.mock('@/context/authContext', async () => {
  const actual = await vi.importActual('@/context/authContext')
  return {
    ...actual,
    useAuth: () => ({
      user: mockUser,
      isAuthenticated: true,
      loading: false,
      login: vi.fn(),
      logout: vi.fn()
    })
  }
})

describe('usePermissions hook', () => {
  const mockLimits = {
    max_tables: 10,
    max_users: 5,
    max_products: 50,
    max_reservations_per_day: 100,
    notifications_enabled: true,
    reports_enabled: true,
    api_access: true,
    custom_branding: false
  }

  const mockUsage = {
    organization_id: 'org-123',
    tables_count: 3,
    users_count: 2,
    products_count: 25,
    reservations_today: 15,
    notifications_sent_this_month: 50,
    updated_at: '2024-01-01T00:00:00Z'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockSubscriptionService.getLimits.mockResolvedValue({ data: mockLimits })
    mockSubscriptionService.getUsage.mockResolvedValue({ data: mockUsage })
  })

  it('fetches and provides limits and usage data', async () => {
    const { result } = renderHook(() => usePermissions())

    // Initial state
    expect(result.current.loading).toBe(true)
    expect(result.current.limits).toBeNull()
    expect(result.current.usage).toBeNull()

    // Wait for data to load
    await waitFor(() => {
      expect(result.current.loading).toBe(false)
    })

    expect(result.current.limits).toEqual(mockLimits)
    expect(result.current.usage).toEqual(mockUsage)
    expect(result.current.error).toBeNull()
  })

  describe('permission checks', () => {
    it('allows creating table when under limit', async () => {
      const { result } = renderHook(() => usePermissions())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const permission = result.current.canCreateTable()
      expect(permission.allowed).toBe(true)
    })

    it('denies creating table when at limit', async () => {
      const limitedUsage = { ...mockUsage, tables_count: 10 } // At limit
      mockSubscriptionService.getUsage.mockResolvedValue({ data: limitedUsage })

      const { result } = renderHook(() => usePermissions())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const permission = result.current.canCreateTable()
      expect(permission.allowed).toBe(false)
      expect(permission.reason).toContain('Limite de mesas atingido')
      expect(permission.limit).toBe(10)
      expect(permission.current).toBe(10)
    })

    it('allows creating user when under limit', async () => {
      const { result } = renderHook(() => usePermissions())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const permission = result.current.canCreateUser()
      expect(permission.allowed).toBe(true)
    })

    it('denies creating user when over limit', async () => {
      const overLimitUsage = { ...mockUsage, users_count: 6 } // Over limit
      mockSubscriptionService.getUsage.mockResolvedValue({ data: overLimitUsage })

      const { result } = renderHook(() => usePermissions())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const permission = result.current.canCreateUser()
      expect(permission.allowed).toBe(false)
      expect(permission.reason).toContain('Limite de usuários atingido')
    })

    it('allows creating product when under limit', async () => {
      const { result } = renderHook(() => usePermissions())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const permission = result.current.canCreateProduct()
      expect(permission.allowed).toBe(true)
    })

    it('allows creating reservation when under daily limit', async () => {
      const { result } = renderHook(() => usePermissions())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const permission = result.current.canCreateReservation()
      expect(permission.allowed).toBe(true)
    })
  })

  describe('feature permissions', () => {
    it('allows notifications when enabled in plan', async () => {
      const { result } = renderHook(() => usePermissions())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const permission = result.current.canUseNotifications()
      expect(permission.allowed).toBe(true)
    })

    it('denies notifications when disabled in plan', async () => {
      const disabledLimits = { ...mockLimits, notifications_enabled: false }
      mockSubscriptionService.getLimits.mockResolvedValue({ data: disabledLimits })

      const { result } = renderHook(() => usePermissions())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const permission = result.current.canUseNotifications()
      expect(permission.allowed).toBe(false)
      expect(permission.reason).toContain('Notificações não disponíveis')
    })

    it('allows reports when enabled in plan', async () => {
      const { result } = renderHook(() => usePermissions())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const permission = result.current.canAccessReports()
      expect(permission.allowed).toBe(true)
    })

    it('allows API access when enabled in plan', async () => {
      const { result } = renderHook(() => usePermissions())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const permission = result.current.canUseAPI()
      expect(permission.allowed).toBe(true)
    })

    it('denies custom branding when disabled in plan', async () => {
      const { result } = renderHook(() => usePermissions())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      const permission = result.current.canUseCustomBranding()
      expect(permission.allowed).toBe(false)
      expect(permission.reason).toContain('Personalização de marca não disponível')
    })
  })

  describe('utility functions', () => {
    it('calculates usage percentage correctly', async () => {
      const { result } = renderHook(() => usePermissions())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // tables: 3/10 = 30%
      expect(result.current.getUsagePercentage('tables')).toBe(30)

      // users: 2/5 = 40%
      expect(result.current.getUsagePercentage('users')).toBe(40)

      // products: 25/50 = 50%
      expect(result.current.getUsagePercentage('products')).toBe(50)

      // reservations: 15/100 = 15%
      expect(result.current.getUsagePercentage('reservations')).toBe(15)
    })

    it('identifies when near limit with default threshold', async () => {
      const highUsage = {
        ...mockUsage,
        tables_count: 9, // 90% of 10
        users_count: 4,  // 80% of 5
        products_count: 45, // 90% of 50
        reservations_today: 75 // 75% of 100
      }
      mockSubscriptionService.getUsage.mockResolvedValue({ data: highUsage })

      const { result } = renderHook(() => usePermissions())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.isNearLimit('tables')).toBe(true) // 90% > 80%
      expect(result.current.isNearLimit('users')).toBe(true)  // 80% = 80%
      expect(result.current.isNearLimit('products')).toBe(true) // 90% > 80%
      expect(result.current.isNearLimit('reservations')).toBe(false) // 75% < 80%
    })

    it('identifies when near limit with custom threshold', async () => {
      const { result } = renderHook(() => usePermissions())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // With 95% threshold, only 100% usage would be near limit
      expect(result.current.isNearLimit('tables', 95)).toBe(false) // 30% < 95%
      expect(result.current.isNearLimit('users', 95)).toBe(false)  // 40% < 95%
    })

    it('refetches data when requested', async () => {
      const { result } = renderHook(() => usePermissions())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // Clear mocks to verify refetch calls
      vi.clearAllMocks()
      mockSubscriptionService.getLimits.mockResolvedValue({ data: mockLimits })
      mockSubscriptionService.getUsage.mockResolvedValue({ data: mockUsage })

      await result.current.refetch()

      expect(mockSubscriptionService.getLimits).toHaveBeenCalledTimes(1)
      expect(mockSubscriptionService.getUsage).toHaveBeenCalledTimes(1)
    })
  })

  describe('error handling', () => {
    it('handles API errors gracefully', async () => {
      const error = new Error('API Error')
      mockSubscriptionService.getLimits.mockRejectedValue(error)
      mockSubscriptionService.getUsage.mockRejectedValue(error)

      const { result } = renderHook(() => usePermissions())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.error).toBe('Erro ao carregar informações do plano')
      expect(result.current.limits).toBeNull()
      expect(result.current.usage).toBeNull()
    })

    it('returns safe defaults when data is not loaded', async () => {
      mockSubscriptionService.getLimits.mockRejectedValue(new Error('API Error'))
      mockSubscriptionService.getUsage.mockRejectedValue(new Error('API Error'))

      const { result } = renderHook(() => usePermissions())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // All permission checks should return false with appropriate reason
      expect(result.current.canCreateTable().allowed).toBe(false)
      expect(result.current.canCreateTable().reason).toBe('Dados não carregados')

      // Usage percentage should return 0
      expect(result.current.getUsagePercentage('tables')).toBe(0)
      expect(result.current.isNearLimit('tables')).toBe(false)
    })
  })
})