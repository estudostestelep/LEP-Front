import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/utils'
import { BrowserRouter } from 'react-router-dom'
import LoginPage from '@/pages/login/login'
import { AuthProvider } from '@/context/authContext'
import api from '@/api/api'

// Mock the API
vi.mock('@/api/api', () => ({
  default: {
    post: vi.fn(),
    get: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() }
    }
  }
}))

const mockApi = vi.mocked(api)

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

// Mock navigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

const AuthWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
)

describe('Authentication Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  describe('Login Flow', () => {
    it('successfully logs in user with valid credentials', async () => {
      const mockUser = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        organization_id: 'org-123',
        project_id: 'project-123',
        permissions: ['read', 'write']
      }

      const mockToken = 'mock-jwt-token'

      mockApi.post.mockResolvedValue({
        data: {
          token: mockToken,
          user: mockUser
        }
      })

      render(
        <AuthWrapper>
          <LoginPage />
        </AuthWrapper>
      )

      // Fill in login form
      const emailInput = screen.getByPlaceholderText(/email/i)
      const passwordInput = screen.getByPlaceholderText(/senha/i)
      const loginButton = screen.getByRole('button', { name: /entrar/i })

      fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(loginButton)

      // Wait for API call
      await waitFor(() => {
        expect(mockApi.post).toHaveBeenCalledWith('/login', {
          email: 'john@example.com',
          password: 'password123'
        })
      })

      // Check if user data is stored in localStorage
      await waitFor(() => {
        expect(localStorageMock.setItem).toHaveBeenCalledWith('token', mockToken)
        expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser))
      })

      // Check if navigation occurs
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/')
      })
    })

    it('shows error message for invalid credentials', async () => {
      mockApi.post.mockRejectedValue({
        response: {
          data: { message: 'Credenciais inválidas' },
          status: 401
        }
      })

      render(
        <AuthWrapper>
          <LoginPage />
        </AuthWrapper>
      )

      const emailInput = screen.getByPlaceholderText(/email/i)
      const passwordInput = screen.getByPlaceholderText(/senha/i)
      const loginButton = screen.getByRole('button', { name: /entrar/i })

      fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } })
      fireEvent.click(loginButton)

      // Wait for error message
      await waitFor(() => {
        expect(screen.getByText(/credenciais inválidas/i)).toBeInTheDocument()
      })

      // Ensure no navigation occurs
      expect(mockNavigate).not.toHaveBeenCalled()
      expect(localStorageMock.setItem).not.toHaveBeenCalled()
    })

    it('validates required fields', async () => {
      render(
        <AuthWrapper>
          <LoginPage />
        </AuthWrapper>
      )

      const loginButton = screen.getByRole('button', { name: /entrar/i })
      fireEvent.click(loginButton)

      // Check for validation messages
      await waitFor(() => {
        expect(screen.getByText(/email é obrigatório/i)).toBeInTheDocument()
        expect(screen.getByText(/senha é obrigatória/i)).toBeInTheDocument()
      })

      // Ensure no API call is made
      expect(mockApi.post).not.toHaveBeenCalled()
    })

    it('disables form during submission', async () => {
      // Mock a delayed API response
      mockApi.post.mockImplementation(() =>
        new Promise(resolve => setTimeout(() => resolve({ data: {} }), 1000))
      )

      render(
        <AuthWrapper>
          <LoginPage />
        </AuthWrapper>
      )

      const emailInput = screen.getByPlaceholderText(/email/i)
      const passwordInput = screen.getByPlaceholderText(/senha/i)
      const loginButton = screen.getByRole('button', { name: /entrar/i })

      fireEvent.change(emailInput, { target: { value: 'john@example.com' } })
      fireEvent.change(passwordInput, { target: { value: 'password123' } })
      fireEvent.click(loginButton)

      // Check if form is disabled during submission
      await waitFor(() => {
        expect(loginButton).toBeDisabled()
        expect(emailInput).toBeDisabled()
        expect(passwordInput).toBeDisabled()
      })

      // Check for loading state
      expect(screen.getByText(/entrando/i)).toBeInTheDocument()
    })
  })

  describe('Auto-login with stored token', () => {
    it('automatically logs in user with valid stored token', async () => {
      const mockUser = {
        id: 'user-123',
        name: 'John Doe',
        email: 'john@example.com',
        organization_id: 'org-123',
        project_id: 'project-123',
        permissions: ['read', 'write']
      }

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'token') return 'valid-token'
        if (key === 'user') return JSON.stringify(mockUser)
        return null
      })

      mockApi.get.mockResolvedValue({ data: mockUser })

      render(
        <AuthWrapper>
          <div>App Content</div>
        </AuthWrapper>
      )

      // Should automatically validate token
      await waitFor(() => {
        expect(mockApi.get).toHaveBeenCalledWith('/checkToken')
      })
    })

    it('clears invalid stored token', async () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'token') return 'invalid-token'
        return null
      })

      mockApi.get.mockRejectedValue({
        response: { status: 401 }
      })

      render(
        <AuthWrapper>
          <div>App Content</div>
        </AuthWrapper>
      )

      await waitFor(() => {
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('token')
        expect(localStorageMock.removeItem).toHaveBeenCalledWith('user')
      })
    })
  })
})