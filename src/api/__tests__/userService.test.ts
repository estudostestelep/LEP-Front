import { describe, it, expect, vi, beforeEach } from 'vitest'
import { userService } from '../userService'
import api from '../api'

// Mock the api module
vi.mock('../api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}))

const mockApi = vi.mocked(api)

describe('userService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockUser = {
    id: 'user-123',
    organization_id: 'org-123',
    project_id: 'project-123',
    name: 'Test User',
    email: 'test@example.com',
    role: 'admin',
    permissions: ['create', 'read', 'update', 'delete'],
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }

  const mockUsers = [mockUser]

  describe('getAll', () => {
    it('should fetch all users', async () => {
      mockApi.get.mockResolvedValue({ data: mockUsers })

      const result = await userService.getAll()

      expect(mockApi.get).toHaveBeenCalledWith('/user')
      expect(result.data).toEqual(mockUsers)
    })

    it('should handle API errors', async () => {
      const error = new Error('Network error')
      mockApi.get.mockRejectedValue(error)

      await expect(userService.getAll()).rejects.toThrow('Network error')
    })
  })

  describe('getById', () => {
    it('should fetch user by id', async () => {
      mockApi.get.mockResolvedValue({ data: mockUser })

      const result = await userService.getById('user-123')

      expect(mockApi.get).toHaveBeenCalledWith('/user/user-123')
      expect(result.data).toEqual(mockUser)
    })
  })

  describe('getByGroup', () => {
    it('should fetch users by group', async () => {
      mockApi.get.mockResolvedValue({ data: mockUsers })

      const result = await userService.getByGroup('admin')

      expect(mockApi.get).toHaveBeenCalledWith('/user/group/admin')
      expect(result.data).toEqual(mockUsers)
    })
  })

  describe('create', () => {
    it('should create a new user', async () => {
      const newUser = {
        organization_id: 'org-123',
        project_id: 'project-123',
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
        role: 'user',
        permissions: ['read']
      }

      mockApi.post.mockResolvedValue({ data: mockUser })

      const result = await userService.create(newUser)

      expect(mockApi.post).toHaveBeenCalledWith('/user', newUser)
      expect(result.data).toEqual(mockUser)
    })
  })

  describe('update', () => {
    it('should update a user', async () => {
      const updateData = { name: 'Updated User' }
      const updatedUser = { ...mockUser, ...updateData }

      mockApi.put.mockResolvedValue({ data: updatedUser })

      const result = await userService.update('user-123', updateData)

      expect(mockApi.put).toHaveBeenCalledWith('/user/user-123', updateData)
      expect(result.data).toEqual(updatedUser)
    })
  })

  describe('remove', () => {
    it('should remove a user', async () => {
      mockApi.delete.mockResolvedValue({ data: {} })

      await userService.remove('user-123')

      expect(mockApi.delete).toHaveBeenCalledWith('/user/user-123')
    })
  })
})