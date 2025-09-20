// Importar as interfaces dos services da API para evitar duplicação
import { User } from '@/api/userService';
import { Customer } from '@/api/customerService';
import { Table } from '@/api/tableService';
import { Product } from '@/api/productService';
import { Reservation } from '@/api/bookingService';
import { Waitlist } from '@/api/waitingLineService';
import { Order, OrderItem } from '@/api/ordersService';

// Interfaces específicas para mock data que não existem na API
export interface WaitlistEntry extends Waitlist {
  customerName: string;
  entryTime: string;
}

export interface MockReservation extends Reservation {
  customerName: string;
  tableNumber: number;
}

export interface MockOrder extends Order {
  items: (OrderItem & { productName: string; price: number })[];
}

// Mock Data para desenvolvimento e testes
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@restaurant.com',
    role: 'admin',
    permissions: ['all'],
    created_at: '2024-01-15T08:00:00Z'
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@restaurant.com',
    role: 'waiter',
    permissions: ['view_orders', 'create_reservation'],
    created_at: '2024-02-10T09:30:00Z'
  },
  {
    id: '3',
    name: 'Carlos Lima',
    email: 'carlos@restaurant.com',
    role: 'chef',
    permissions: ['view_orders', 'update_orders'],
    created_at: '2024-01-20T07:15:00Z'
  }
];

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Ana Costa',
    email: 'ana@email.com',
    phone: '+55 11 99999-1111',
    birth_date: '1990-05-12T00:00:00Z',
    created_at: '2024-01-10T08:00:00Z'
  },
  {
    id: '2',
    name: 'Roberto Oliveira',
    email: 'roberto@email.com',
    phone: '+55 11 99999-2222',
    birth_date: '1985-08-22T00:00:00Z',
    created_at: '2024-01-15T09:30:00Z'
  },
  {
    id: '3',
    name: 'Lucia Ferreira',
    email: 'lucia@email.com',
    phone: '+55 11 99999-3333',
    birth_date: '1992-11-05T00:00:00Z',
    created_at: '2024-02-01T10:15:00Z'
  }
];

export const mockTables: Table[] = [
  { id: '1', number: 1, capacity: 2, location: 'Varanda', status: 'livre', created_at: '2024-01-01T08:00:00Z' },
  { id: '2', number: 2, capacity: 4, location: 'Salão Principal', status: 'ocupada', created_at: '2024-01-01T08:00:00Z' },
  { id: '3', number: 3, capacity: 6, location: 'Salão Principal', status: 'reservada', created_at: '2024-01-01T08:00:00Z' },
  { id: '4', number: 4, capacity: 2, location: 'Área VIP', status: 'livre', created_at: '2024-01-01T08:00:00Z' },
  { id: '5', number: 5, capacity: 8, location: 'Salão Principal', status: 'livre', created_at: '2024-01-01T08:00:00Z' },
  { id: '6', number: 6, capacity: 4, location: 'Varanda', status: 'ocupada', created_at: '2024-01-01T08:00:00Z' }
];

export const mockProducts: Product[] = [
  
  {
    id: '1',
    organization_id: 'org1',
    project_id: 'proj1',
    name: 'Pizza Margherita',
    description: 'Massa fina, molho de tomate, manjericão fresco e mussarela',
    price: 45.90,
    available: true,
    prep_time_minutes: 25,
    category: 'main_course',
    created_at: '2024-01-01T08:00:00Z'
  },
  {
    id: '2',
        organization_id: 'org1',
    project_id: 'proj1',
    name: 'Hambúrguer Artesanal',
    description: 'Pão brioche, carne 180g, queijo cheddar, bacon e batata rústica',
    price: 38.50,
    available: true,
    prep_time_minutes: 20,
    category: 'main_course',
    created_at: '2024-01-01T08:00:00Z'
  },
  {
    id: '3',
    organization_id: 'org1',
    project_id: 'proj1',
    name: 'Salmão Grelhado',
    description: 'Filé de salmão grelhado com risotto de limão siciliano',
    price: 68.90,
    available: true,
    prep_time_minutes: 30,
    category: 'main_course',
    created_at: '2024-01-01T08:00:00Z'
  },
  {
    id: '4',
    organization_id: 'org1',
    project_id: 'proj1',
    name: 'Cerveja Artesanal IPA',
    description: 'Cerveja artesanal India Pale Ale 500ml',
    price: 18.90,
    available: true,
    prep_time_minutes: 2,
    category: 'beverage',
    created_at: '2024-01-01T08:00:00Z'
  },
  {
    id: '5',
    organization_id: 'org1',
    project_id: 'proj1',
    name: 'Tiramisu',
    description: 'Sobremesa italiana tradicional com café e mascarpone',
    price: 22.90,
    available: false,
    prep_time_minutes: 15,
    category: 'dessert',
    created_at: '2024-01-01T08:00:00Z'
  }
];

export const mockReservations: MockReservation[] = [
  {
    id: '1',
    customer_id: '1',
    customerName: 'Ana Costa',
    table_id: '3',
    tableNumber: 3,
    datetime: '2024-03-15T19:30:00Z',
    party_size: 4,
    status: 'confirmed',
    note: 'Aniversário',
    created_at: '2024-03-10T08:00:00Z'
  },
  {
    id: '2',
    customer_id: '2',
    customerName: 'Roberto Oliveira',
    table_id: '5',
    tableNumber: 5,
    datetime: '2024-03-15T20:00:00Z',
    party_size: 6,
    status: 'confirmed',
    created_at: '2024-03-12T10:00:00Z'
  }
];

export const mockWaitlist: WaitlistEntry[] = [
  {
    id: '1',
    customer_id: '3',
    customerName: 'Lucia Ferreira',
    party_size: 2,
    status: 'waiting',
    entryTime: '2024-03-15T18:30:00Z',
    estimated_wait: 25,
    created_at: '2024-03-15T18:30:00Z'
  },
  {
    id: '2',
    customer_id: '1',
    customerName: 'Ana Costa',
    party_size: 4,
    status: 'waiting',
    entryTime: '2024-03-15T19:00:00Z',
    estimated_wait: 40,
    created_at: '2024-03-15T19:00:00Z'
  }
];

export const mockOrders: MockOrder[] = [
  {
    id: '1',
    table_number: 2,
    items: [
      { product_id: '1', productName: 'Pizza Margherita', quantity: 2, price: 45.90 },
      { product_id: '4', productName: 'Cerveja Artesanal IPA', quantity: 3, price: 18.90 }
    ],
    total_amount: 148.50,
    status: 'preparing',
    created_at: '2024-03-15T19:15:00Z',
    source: 'public'
  },
  {
    id: '2',
    table_number: 6,
    customer_id: '2',
    items: [
      { product_id: '3', productName: 'Salmão Grelhado', quantity: 1, price: 68.90 },
      { product_id: '5', productName: 'Tiramisu', quantity: 2, price: 22.90 }
    ],
    total_amount: 114.70,
    status: 'ready',
    created_at: '2024-03-15T19:45:00Z',
    source: 'internal'
  }
];