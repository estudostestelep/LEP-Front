import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '../authContext'
import { authService } from '@/api/authService'

// Mock the auth service with proper factory
vi.mock('@/api/authService', () => {
  const mockAuthServiceObj = {
    login: vi.fn(),
    logout: vi.fn(),
    checkToken: vi.fn(),
    ping: vi.fn(),
    health: vi.fn(),
  }
  return {
    authService: mockAuthServiceObj
  }
})

vi.mock('@/api/organizationService', () => ({
  organizationService: {
    getById: vi.fn(),
  }
}))

vi.mock('@/api/projectService', () => ({
  projectService: {
    getById: vi.fn(),
  }
}))

const mockAuthService = vi.mocked(authService)

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
)

describe('AuthContext', () => {
  const mockUser = {
    id: 'user-123',
    name: 'John Doe',
    email: 'john@example.com',
    organization_id: 'org-123',
    project_id: 'project-123',
    permissions: ['read', 'write']
  }

  const mockOrganizations = [
    {
      organization_id: 'org-123',
      organization_name: 'Test Organization',
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  const mockProjects = [
    {
      project_id: 'project-123',
      project_name: 'Test Project',
      organization_id: 'org-123',
      active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('useAuth hook', () => {
    it('provides initial state', async () => {
      const { result } = renderHook(() => useAuth(), { wrapper })

      // Wait for initialization to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })

      expect(result.current.user).toBeNull()
      expect(result.current.loading).toBe(false)
      expect(typeof result.current.login).toBe('function')
      expect(typeof result.current.logout).toBe('function')
    })

    it('throws error when used outside AuthProvider', () => {
      expect(() => {
        renderHook(() => useAuth())
      }).toThrow('useAuth must be used inside AuthProvider')
    })
  })

  describe('login function', () => {
    it('successfully logs in user', async () => {
      const mockToken = 'mock-jwt-token'
      mockAuthService.login.mockResolvedValue({
        data: {
          token: mockToken,
          user: mockUser,
          organizations: mockOrganizations,
          projects: mockProjects
        }
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        await result.current.login({ email: 'john@example.com', password: 'password123' })
      })

      expect(mockAuthService.login).toHaveBeenCalledWith({ email: 'john@example.com', password: 'password123' })
      expect(result.current.user).toEqual(mockUser)
      expect(result.current.organizations).toEqual(mockOrganizations)
      expect(result.current.loading).toBe(false)
    })

    it('handles login errors', async () => {
      const error = new Error('Invalid credentials')
      mockAuthService.login.mockRejectedValue(error)

      const { result } = renderHook(() => useAuth(), { wrapper })

      let loginError: Error | null = null
      await act(async () => {
        try {
          await result.current.login({ email: 'wrong@example.com', password: 'wrongpassword' })
        } catch (err) {
          loginError = err as Error
        }
      })

      expect(loginError?.message).toBe('Invalid credentials')
      expect(result.current.user).toBeNull()
    })
  })

  describe('logout function', () => {
    it('successfully logs out user', async () => {
      mockAuthService.logout.mockResolvedValue({ data: {} })

      // First login
      mockAuthService.login.mockResolvedValue({
        data: {
          token: 'token',
          user: mockUser,
          organizations: mockOrganizations,
          projects: mockProjects
        }
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        await result.current.login({ email: 'john@example.com', password: 'password123' })
      })

      // Then logout
      await act(async () => {
        await result.current.logout()
      })

      expect(mockAuthService.logout).toHaveBeenCalled()
      expect(result.current.user).toBeNull()
    })

    it('handles logout errors gracefully', async () => {
      mockAuthService.logout.mockRejectedValue(new Error('Network error'))

      // First login
      mockAuthService.login.mockResolvedValue({
        data: {
          token: 'token',
          user: mockUser,
          organizations: mockOrganizations,
          projects: mockProjects
        }
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        await result.current.login({ email: 'john@example.com', password: 'password123' })
      })

      // Logout should clear state even if API call fails
      await act(async () => {
        try {
          await result.current.logout()
        } catch (err) {
          // Error handling in logout
        }
      })

      expect(result.current.user).toBeNull()
    })
  })

  describe('token validation on mount', () => {
    it('validates stored token on mount', async () => {
      const storedToken = '@LEP:token'
      const storedUser = '@LEP:user'
      const storedOrgs = '@LEP:organizations'

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === storedToken) return 'stored-token'
        if (key === storedUser) return JSON.stringify(mockUser)
        if (key === storedOrgs) return JSON.stringify(mockOrganizations)
        return null
      })

      mockAuthService.checkToken.mockResolvedValue({ data: mockUser })

      const { result } = renderHook(() => useAuth(), { wrapper })

      // Wait for initial loading to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })

      expect(result.current.user).toEqual(mockUser)
      expect(result.current.loading).toBe(false)
    })

    it('clears invalid stored token', async () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === '@LEP:token') return 'invalid-token'
        return null
      })

      mockAuthService.checkToken.mockRejectedValue({
        response: { status: 401 }
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      // Wait for initial loading to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })

      expect(result.current.user).toBeNull()
      expect(result.current.loading).toBe(false)
    })

    it('handles no stored token', async () => {
      localStorageMock.getItem.mockReturnValue(null)

      const { result } = renderHook(() => useAuth(), { wrapper })

      // Wait for initial loading to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })

      expect(result.current.user).toBeNull()
      expect(result.current.loading).toBe(false)
    })
  })

  describe('user data management', () => {
    it('stores and retrieves user data correctly', async () => {
      const mockToken = 'mock-jwt-token'
      mockAuthService.login.mockResolvedValue({
        data: {
          token: mockToken,
          user: mockUser,
          organizations: mockOrganizations,
          projects: mockProjects
        }
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        await result.current.login({ email: 'john@example.com', password: 'password123' })
      })

      expect(result.current.user?.id).toBe(mockUser.id)
      expect(result.current.user?.name).toBe(mockUser.name)
      expect(result.current.user?.email).toBe(mockUser.email)
    })

    it('persists organizations and projects', async () => {
      const mockToken = 'mock-jwt-token'
      mockAuthService.login.mockResolvedValue({
        data: {
          token: mockToken,
          user: mockUser,
          organizations: mockOrganizations,
          projects: mockProjects
        }
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        await result.current.login({ email: 'john@example.com', password: 'password123' })
      })

      expect(result.current.organizations).toHaveLength(1)
      expect(result.current.projects).toHaveLength(1)
      expect(result.current.currentOrganization).toBe('org-123')
      expect(result.current.currentProject).toBe('project-123')
    })
  })

  describe('authorization checks', () => {
    it('identifies master admin users', async () => {
      const masterAdminUser = { ...mockUser, permissions: ['master_admin'] }
      mockAuthService.login.mockResolvedValue({
        data: {
          token: 'token',
          user: masterAdminUser,
          organizations: mockOrganizations,
          projects: mockProjects
        }
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        await result.current.login({ email: 'admin@example.com', password: 'password123' })
      })

      expect(result.current.isMasterAdmin).toBe(true)
    })

    it('identifies non-admin users', async () => {
      mockAuthService.login.mockResolvedValue({
        data: {
          token: 'token',
          user: mockUser,
          organizations: mockOrganizations,
          projects: mockProjects
        }
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        await result.current.login({ email: 'john@example.com', password: 'password123' })
      })

      expect(result.current.isMasterAdmin).toBe(false)
    })
  })
})
