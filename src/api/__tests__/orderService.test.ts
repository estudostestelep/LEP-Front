import { describe, it, expect, vi, beforeEach } from 'vitest'
import { orderService } from '../ordersService'
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

describe('orderService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockOrderItem = {
    product_id: 'product-123',
    quantity: 2,
    product_name: 'Test Product',
    prep_time_minutes: 15
  }

  const mockOrder = {
    id: 'order-123',
    organization_id: 'org-123',
    project_id: 'project-123',
    customer_id: 'customer-123',
    table_id: 'table-123',
    table_number: 5,
    items: [mockOrderItem],
    status: 'pending' as const,
    source: 'internal' as const,
    total_amount: 29.90,
    prep_time_minutes: 15,
    note: 'Test order',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }

  const mockCreateOrderRequest = {
    organization_id: 'org-123',
    project_id: 'project-123',
    customer_id: 'customer-123',
    table_id: 'table-123',
    items: [{ product_id: 'product-123', quantity: 2 }],
    note: 'Test order',
    source: 'internal' as const
  }

  const mockKitchenQueueItem = {
    id: 'order-123',
    table_number: 5,
    items: [
      {
        product_name: 'Test Product',
        quantity: 2,
        prep_time_minutes: 15
      }
    ],
    status: 'preparing' as const,
    estimated_completion: '2024-01-01T00:30:00Z',
    created_at: '2024-01-01T00:00:00Z'
  }

  describe('getAll', () => {
    it('should fetch all orders', async () => {
      mockApi.get.mockResolvedValue({ data: [mockOrder] })

      const result = await orderService.getAll()

      expect(mockApi.get).toHaveBeenCalledWith('/order')
      expect(result.data).toEqual([mockOrder])
    })
  })

  describe('getById', () => {
    it('should fetch order by id', async () => {
      mockApi.get.mockResolvedValue({ data: mockOrder })

      const result = await orderService.getById('order-123')

      expect(mockApi.get).toHaveBeenCalledWith('/order/order-123')
      expect(result.data).toEqual(mockOrder)
    })
  })

  describe('create', () => {
    it('should create a new order', async () => {
      mockApi.post.mockResolvedValue({ data: mockOrder })

      const result = await orderService.create(mockCreateOrderRequest)

      expect(mockApi.post).toHaveBeenCalledWith('/order', mockCreateOrderRequest)
      expect(result.data).toEqual(mockOrder)
    })

    it('should handle validation errors', async () => {
      const error = new Error('Invalid order data')
      mockApi.post.mockRejectedValue(error)

      await expect(orderService.create(mockCreateOrderRequest)).rejects.toThrow('Invalid order data')
    })
  })

  describe('update', () => {
    it('should update an order', async () => {
      const updateData = { status: 'preparing' as const }
      const updatedOrder = { ...mockOrder, ...updateData }

      mockApi.put.mockResolvedValue({ data: updatedOrder })

      const result = await orderService.update('order-123', updateData)

      expect(mockApi.put).toHaveBeenCalledWith('/order/order-123', updateData)
      expect(result.data).toEqual(updatedOrder)
    })
  })

  describe('remove', () => {
    it('should remove an order', async () => {
      mockApi.delete.mockResolvedValue({ data: {} })

      await orderService.remove('order-123')

      expect(mockApi.delete).toHaveBeenCalledWith('/order/order-123')
    })
  })

  describe('getKitchenQueue', () => {
    it('should fetch kitchen queue', async () => {
      mockApi.get.mockResolvedValue({ data: [mockKitchenQueueItem] })

      const result = await orderService.getKitchenQueue()

      expect(mockApi.get).toHaveBeenCalledWith('/kitchen/queue')
      expect(result.data).toEqual([mockKitchenQueueItem])
    })

    it('should handle empty kitchen queue', async () => {
      mockApi.get.mockResolvedValue({ data: [] })

      const result = await orderService.getKitchenQueue()

      expect(result.data).toEqual([])
    })
  })
})