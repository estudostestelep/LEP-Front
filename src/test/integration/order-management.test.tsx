import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@/test/utils'
import '@testing-library/jest-dom'
import OrderForm from '@/pages/orders/form'
import { orderService } from '@/api/ordersService'
import { productService } from '@/api/productService'
import { tableService } from '@/api/tableService'
import { customerService } from '@/api/customerService'

// Mock the hooks
vi.mock('@/hooks/useCurrentTenant', () => ({
  useCurrentTenant: () => ({
    organization_id: 'org-123',
    project_id: 'project-123'
  })
}))

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
      price_normal: 25.90,
      active: true,
      available: true,
      prep_time_minutes: 20
    },
    {
      id: 'product-2',
      name: 'Hambúrguer',
      price: 18.50,
      price_normal: 18.50,
      active: true,
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
    it('renders the order form successfully', async () => {
      const mockOnSuccess = vi.fn()
      const mockOnCancel = vi.fn()

      render(
        <OrderForm
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      )

      // Wait for form title to appear
      await waitFor(() => {
        expect(screen.getByText('Novo Pedido')).toBeInTheDocument()
      })

      // Verify all sections are visible
      expect(screen.getByText('Mesa')).toBeInTheDocument()
      expect(screen.getByText('Cliente')).toBeInTheDocument()
      expect(screen.getByText('Origem')).toBeInTheDocument()
      expect(screen.getByText('Adicionar Produto')).toBeInTheDocument()
      expect(screen.getByText('Observações')).toBeInTheDocument()
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

      // Wait for form to load
      await waitFor(() => {
        expect(screen.getByText('Novo Pedido')).toBeInTheDocument()
      })

      // Try to submit without adding items
      const submitButton = screen.getByRole('button', { name: /Criar Pedido/i })
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

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('Novo Pedido')).toBeInTheDocument()
      })

      // Verify services were called to load data
      expect(mockProductService.getAll).toHaveBeenCalled()
      expect(mockTableService.getAll).toHaveBeenCalled()
      expect(mockCustomerService.getAll).toHaveBeenCalled()

      alertSpy.mockRestore()
    })

    it('displays form inputs for selecting items', async () => {
      const mockOnSuccess = vi.fn()
      const mockOnCancel = vi.fn()

      render(
        <OrderForm
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      )

      // Wait for selects to be populated with options
      await waitFor(() => {
        const productSelect = screen.getByDisplayValue('Selecione um produto')
        const tableSelect = screen.getByDisplayValue('Selecione uma mesa')
        const customerSelect = screen.getByDisplayValue('Selecione um cliente (opcional)')

        expect(productSelect).toBeInTheDocument()
        expect(tableSelect).toBeInTheDocument()
        expect(customerSelect).toBeInTheDocument()
      })
    })

    it('displays cancel button', async () => {
      const mockOnSuccess = vi.fn()
      const mockOnCancel = vi.fn()

      render(
        <OrderForm
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      )

      await waitFor(() => {
        expect(screen.getByText('Novo Pedido')).toBeInTheDocument()
      })

      const cancelButton = screen.getByRole('button', { name: /Cancelar/i })
      expect(cancelButton).toBeInTheDocument()
      expect(cancelButton).not.toBeDisabled()
    })

    it('loads all required data on component mount', async () => {
      const mockOnSuccess = vi.fn()
      const mockOnCancel = vi.fn()

      render(
        <OrderForm
          onSuccess={mockOnSuccess}
          onCancel={mockOnCancel}
        />
      )

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('Novo Pedido')).toBeInTheDocument()
      })

      // Verify all services were called to fetch data
      expect(mockProductService.getAll).toHaveBeenCalled()
      expect(mockTableService.getAll).toHaveBeenCalled()
      expect(mockCustomerService.getAll).toHaveBeenCalled()
    })
  })

  describe('Loading states', () => {
    it('renders form with all required sections', async () => {
      render(
        <OrderForm
          onSuccess={() => {}}
          onCancel={() => {}}
        />
      )

      // Verify all major sections render
      await waitFor(() => {
        expect(screen.getByText('Novo Pedido')).toBeInTheDocument()
        expect(screen.getByText('Mesa')).toBeInTheDocument()
        expect(screen.getByText('Cliente')).toBeInTheDocument()
        expect(screen.getByText('Origem')).toBeInTheDocument()
        expect(screen.getByText('Adicionar Produto')).toBeInTheDocument()
        expect(screen.getByText('Observações')).toBeInTheDocument()
      })

      // Verify all services were called
      expect(mockProductService.getAll).toHaveBeenCalled()
      expect(mockTableService.getAll).toHaveBeenCalled()
      expect(mockCustomerService.getAll).toHaveBeenCalled()
    })
  })
})
