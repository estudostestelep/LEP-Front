import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@/test/utils'
import OrderForm from '@/pages/orders/form'
import { orderService } from '@/api/ordersService'
import { productService } from '@/api/productService'
import { tableService } from '@/api/tableService'
import { customerService } from '@/api/customerService'

// Mock the services
vi.mock('@/api/ordersService', () => ({
  orderService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    getKitchenQueue: vi.fn(),
  }
}))

vi.mock('@/api/productService', () => ({
  productService: {
    getAll: vi.fn(),
    getAllWithFilters: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    uploadImage: vi.fn(),
    updateImage: vi.fn(),
    updateOrder: vi.fn(),
    updateStatus: vi.fn(),
    getByType: vi.fn(),
    getByCategory: vi.fn(),
    getBySubcategory: vi.fn(),
    getProductTags: vi.fn(),
    addTagToProduct: vi.fn(),
    removeTagFromProduct: vi.fn(),
    getProductsByTag: vi.fn(),
  }
}))

vi.mock('@/api/tableService', () => ({
  tableService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  }
}))

vi.mock('@/api/customerService', () => ({
  customerService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
  }
}))

const mockOrderService = vi.mocked(orderService)
const mockProductService = vi.mocked(productService)
const mockTableService = vi.mocked(tableService)
const mockCustomerService = vi.mocked(customerService)

describe('Order Management Integration', () => {
  const mockProducts = [
    {
      id: 'product-1',
      name: 'Pizza Margherita',
      price: 25.90,
      available: true,
      prep_time_minutes: 20
    },
    {
      id: 'product-2',
      name: 'Hambúrguer',
      price: 18.50,
      available: true,
      prep_time_minutes: 15
    }
  ]

  const mockTables = [
    {
      id: 'table-1',
      number: 1,
      capacity: 4,
      status: 'livre' as const
    },
    {
      id: 'table-2',
      number: 2,
      capacity: 2,
      status: 'ocupada' as const
    }
  ]

  const mockCustomers = [
    {
      id: 'customer-1',
      name: 'João Silva',
      phone: '(11) 99999-9999'
    },
    {
      id: 'customer-2',
      name: 'Maria Santos',
      phone: '(11) 88888-8888'
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()

    mockProductService.getAll.mockResolvedValue({ data: mockProducts })
    mockTableService.getAll.mockResolvedValue({ data: mockTables })
    mockCustomerService.getAll.mockResolvedValue({ data: mockCustomers })
  })

  describe('Creating a new order', () => {
    it('successfully creates order with products and customer', async () => {
      const mockOnSuccess = vi.fn()
      const mockOnCancel = vi.fn()

      mockOrderService.create.mockResolvedValue({
        data: {
          id: 'order-123',
          items: [
            {
              product_id: 'product-1',
              quantity: 2,
              product_name: 'Pizza Margherita'
            }
          ],
          customer_id: 'customer-1',
          table_id: 'table-1'
        }
      })

      render(
        <OrderForm
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      )

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('Pizza Margherita')).toBeInTheDocument()
      })

      // Select a table
      const tableSelect = screen.getByDisplayValue('Selecione uma mesa')
      fireEvent.change(tableSelect, { target: { value: 'table-1' } })

      // Select a customer
      const customerSelect = screen.getByDisplayValue('Selecione um cliente (opcional)')
      fireEvent.change(customerSelect, { target: { value: 'customer-1' } })

      // Add a product
      const productSelect = screen.getByDisplayValue('Selecione um produto')
      fireEvent.change(productSelect, { target: { value: 'product-1' } })

      const addButton = screen.getByRole('button', { name: '+' })
      fireEvent.click(addButton)

      // Verify product was added
      await waitFor(() => {
        expect(screen.getByText('Pizza Margherita')).toBeInTheDocument()
        expect(screen.getByText('R$ 25,90 cada')).toBeInTheDocument()
      })

      // Increase quantity
      const increaseButton = screen.getAllByRole('button', { name: '+' })[1] // Second + button (for quantity)
      fireEvent.click(increaseButton)

      // Submit the order
      const submitButton = screen.getByRole('button', { name: /criar pedido/i })
      fireEvent.click(submitButton)

      // Verify API call
      await waitFor(() => {
        expect(mockOrderService.create).toHaveBeenCalledWith({
          organization_id: expect.any(String),
          project_id: expect.any(String),
          table_id: 'table-1',
          customer_id: 'customer-1',
          items: [
            {
              product_id: 'product-1',
              quantity: 2
            }
          ],
          source: 'internal'
        })
      })

      // Verify success callback
      await waitFor(() => {
        expect(mockOnSuccess).toHaveBeenCalledTimes(1)
      })
    })

    it('calculates total price correctly', async () => {
      const mockOnSuccess = vi.fn()
      const mockOnCancel = vi.fn()

      render(
        <OrderForm
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      )

      // Wait for products to load
      await waitFor(() => {
        expect(screen.getByText('Pizza Margherita')).toBeInTheDocument()
      })

      // Add Pizza Margherita (R$ 25,90)
      const productSelect = screen.getByDisplayValue('Selecione um produto')
      fireEvent.change(productSelect, { target: { value: 'product-1' } })
      fireEvent.click(screen.getByRole('button', { name: '+' }))

      // Increase quantity to 2
      await waitFor(() => {
        const increaseButton = screen.getAllByRole('button', { name: '+' })[1]
        fireEvent.click(increaseButton)
      })

      // Add Hambúrguer (R$ 18,50)
      fireEvent.change(productSelect, { target: { value: 'product-2' } })
      fireEvent.click(screen.getAllByRole('button', { name: '+' })[0]) // First + button (add product)

      // Check total calculation: (25.90 * 2) + (18.50 * 1) = 70.30
      await waitFor(() => {
        expect(screen.getByText('R$ 70,30')).toBeInTheDocument()
      })
    })

    it('prevents submission without items', async () => {
      const mockOnSuccess = vi.fn()
      const mockOnCancel = vi.fn()

      render(
        <OrderForm
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      )

      // Try to submit without adding items
      const submitButton = screen.getByRole('button', { name: /criar pedido/i })
      expect(submitButton).toBeDisabled()

      // Verify no API call is made
      expect(mockOrderService.create).not.toHaveBeenCalled()
    })

    it('handles API errors gracefully', async () => {
      const mockOnSuccess = vi.fn()
      const mockOnCancel = vi.fn()

      mockOrderService.create.mockRejectedValue(new Error('API Error'))

      // Mock window.alert
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {})

      render(
        <OrderForm
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      )

      // Wait for data to load and add a product
      await waitFor(() => {
        expect(screen.getByText('Pizza Margherita')).toBeInTheDocument()
      })

      const productSelect = screen.getByDisplayValue('Selecione um produto')
      fireEvent.change(productSelect, { target: { value: 'product-1' } })
      fireEvent.click(screen.getByRole('button', { name: '+' }))

      // Submit the order
      const submitButton = screen.getByRole('button', { name: /criar pedido/i })
      fireEvent.click(submitButton)

      // Verify error handling
      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith('Erro ao salvar pedido. Tente novamente.')
      })

      expect(mockOnSuccess).not.toHaveBeenCalled()

      alertSpy.mockRestore()
    })

    it('removes items from order', async () => {
      const mockOnSuccess = vi.fn()
      const mockOnCancel = vi.fn()

      render(
        <OrderForm
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      )

      // Add a product
      await waitFor(() => {
        expect(screen.getByText('Pizza Margherita')).toBeInTheDocument()
      })

      const productSelect = screen.getByDisplayValue('Selecione um produto')
      fireEvent.change(productSelect, { target: { value: 'product-1' } })
      fireEvent.click(screen.getByRole('button', { name: '+' }))

      // Verify item was added
      await waitFor(() => {
        expect(screen.getByText('Pizza Margherita')).toBeInTheDocument()
        expect(screen.getByText('R$ 25,90')).toBeInTheDocument()
      })

      // Remove the item
      const removeButton = screen.getByRole('button', { name: /delete/i })
      fireEvent.click(removeButton)

      // Verify item was removed
      await waitFor(() => {
        expect(screen.queryByText('R$ 25,90 cada')).not.toBeInTheDocument()
      })

      // Submit button should be disabled again
      const submitButton = screen.getByRole('button', { name: /criar pedido/i })
      expect(submitButton).toBeDisabled()
    })
  })

  describe('Loading states', () => {
    it('shows loading state while fetching data', async () => {
      // Mock delayed responses
      mockProductService.getAll.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ data: mockProducts }), 1000))
      )
      mockTableService.getAll.mockResolvedValue({ data: mockTables })
      mockCustomerService.getAll.mockResolvedValue({ data: mockCustomers })

      render(
        <OrderForm
          onSuccess={() => {}}
          onCancel={() => {}}
        />
      )

      // Should show loading state (selects should be disabled or show loading)
      const productSelect = screen.getByDisplayValue('Selecione um produto')
      expect(productSelect).toBeDisabled()
    })
  })
})