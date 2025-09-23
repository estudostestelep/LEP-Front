import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from '../authContext'
import * as authService from '@/api/authService'

// Mock the auth service
vi.mock('@/api/authService')
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

  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('useAuth hook', () => {
    it('provides initial state', () => {
      const { result } = renderHook(() => useAuth(), { wrapper })

      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.loading).toBe(true)
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
          user: mockUser
        }
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        await result.current.login('john@example.com', 'password123')
      })

      expect(mockAuthService.login).toHaveBeenCalledWith('john@example.com', 'password123')
      expect(result.current.user).toEqual(mockUser)
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.loading).toBe(false)

      // Check localStorage calls
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', mockToken)
      expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser))
    })

    it('handles login errors', async () => {
      const error = new Error('Invalid credentials')
      mockAuthService.login.mockRejectedValue(error)

      const { result } = renderHook(() => useAuth(), { wrapper })

      await expect(
        act(async () => {
          await result.current.login('wrong@example.com', 'wrongpassword')
        })
      ).rejects.toThrow('Invalid credentials')

      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
      expect(localStorageMock.setItem).not.toHaveBeenCalled()
    })
  })

  describe('logout function', () => {
    it('successfully logs out user', async () => {
      mockAuthService.logout.mockResolvedValue({ data: {} })

      // First login
      mockAuthService.login.mockResolvedValue({
        data: {
          token: 'token',
          user: mockUser
        }
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        await result.current.login('john@example.com', 'password123')
      })

      // Then logout
      await act(async () => {
        await result.current.logout()
      })

      expect(mockAuthService.logout).toHaveBeenCalled()
      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)

      // Check localStorage cleanup
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
    })

    it('handles logout errors gracefully', async () => {
      mockAuthService.logout.mockRejectedValue(new Error('Network error'))

      // First login
      mockAuthService.login.mockResolvedValue({
        data: {
          token: 'token',
          user: mockUser
        }
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        await result.current.login('john@example.com', 'password123')
      })

      // Logout should clear state even if API call fails
      await act(async () => {
        await result.current.logout()
      })

      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
    })
  })

  describe('token validation on mount', () => {
    it('validates stored token on mount', async () => {
      const storedToken = 'stored-token'
      const storedUser = JSON.stringify(mockUser)

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'token') return storedToken
        if (key === 'user') return storedUser
        return null
      })

      mockAuthService.checkToken.mockResolvedValue({ data: mockUser })

      const { result } = renderHook(() => useAuth(), { wrapper })

      // Wait for initial loading to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })

      expect(mockAuthService.checkToken).toHaveBeenCalled()
      expect(result.current.user).toEqual(mockUser)
      expect(result.current.isAuthenticated).toBe(true)
      expect(result.current.loading).toBe(false)
    })

    it('clears invalid stored token', async () => {
      const invalidToken = 'invalid-token'

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'token') return invalidToken
        return null
      })

      mockAuthService.checkToken.mockRejectedValue({
        response: { status: 401 }
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      // Wait for validation to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.loading).toBe(false)
    })

    it('handles no stored token', async () => {
      localStorageMock.getItem.mockReturnValue(null)

      const { result } = renderHook(() => useAuth(), { wrapper })

      // Wait for initial check to complete
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })

      expect(mockAuthService.checkToken).not.toHaveBeenCalled()
      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
      expect(result.current.loading).toBe(false)
    })
  })

  describe('user data management', () => {
    it('parses stored user data correctly', async () => {
      const storedUser = JSON.stringify(mockUser)

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'token') return 'valid-token'
        if (key === 'user') return storedUser
        return null
      })

      mockAuthService.checkToken.mockResolvedValue({ data: mockUser })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })

      expect(result.current.user).toEqual(mockUser)
      expect(result.current.user?.name).toBe('John Doe')
      expect(result.current.user?.organization_id).toBe('org-123')
    })

    it('handles corrupted user data in localStorage', async () => {
      const corruptedData = 'invalid-json'

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'token') return 'valid-token'
        if (key === 'user') return corruptedData
        return null
      })

      const { result } = renderHook(() => useAuth(), { wrapper })

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0))
      })

      // Should clear corrupted data and start fresh
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
      expect(result.current.user).toBeNull()
      expect(result.current.isAuthenticated).toBe(false)
    })
  })
})