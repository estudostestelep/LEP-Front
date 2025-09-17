export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  birthDate: string;
  visits: number;
  lastVisit: string;
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  location: string;
  status: 'available' | 'occupied' | 'reserved';
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  available: boolean;
  image?: string;
}

export interface Reservation {
  id: string;
  customerId: string;
  customerName: string;
  tableId: string;
  tableNumber: number;
  datetime: string;
  partySize: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  note?: string;
}

export interface WaitlistEntry {
  id: string;
  customerId: string;
  customerName: string;
  people: number;
  status: 'waiting' | 'seated' | 'cancelled';
  entryTime: string;
  estimatedWait: number;
}

export interface Order {
  id: string;
  tableNumber?: string;
  customerId?: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  note?: string;
  createdAt: string;
  source: 'public' | 'internal';
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

// Mock Data
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@restaurant.com',
    role: 'admin',
    permissions: ['all'],
    createdAt: '2024-01-15T08:00:00Z'
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@restaurant.com',
    role: 'waiter',
    permissions: ['view_orders', 'create_reservation'],
    createdAt: '2024-02-10T09:30:00Z'
  },
  {
    id: '3',
    name: 'Carlos Lima',
    email: 'carlos@restaurant.com',
    role: 'chef',
    permissions: ['view_orders', 'update_orders'],
    createdAt: '2024-01-20T07:15:00Z'
  }
];

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Ana Costa',
    email: 'ana@email.com',
    phone: '+55 11 99999-1111',
    birthDate: '1990-05-12',
    visits: 15,
    lastVisit: '2024-03-10T19:30:00Z'
  },
  {
    id: '2',
    name: 'Roberto Oliveira',
    email: 'roberto@email.com',
    phone: '+55 11 99999-2222',
    birthDate: '1985-08-22',
    visits: 8,
    lastVisit: '2024-03-08T20:15:00Z'
  },
  {
    id: '3',
    name: 'Lucia Ferreira',
    email: 'lucia@email.com',
    phone: '+55 11 99999-3333',
    birthDate: '1992-11-05',
    visits: 23,
    lastVisit: '2024-03-12T18:45:00Z'
  }
];

export const mockTables: Table[] = [
  { id: '1', number: 1, capacity: 2, location: 'Varanda', status: 'available' },
  { id: '2', number: 2, capacity: 4, location: 'Salão Principal', status: 'occupied' },
  { id: '3', number: 3, capacity: 6, location: 'Salão Principal', status: 'reserved' },
  { id: '4', number: 4, capacity: 2, location: 'Área VIP', status: 'available' },
  { id: '5', number: 5, capacity: 8, location: 'Salão Principal', status: 'available' },
  { id: '6', number: 6, capacity: 4, location: 'Varanda', status: 'occupied' }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Pizza Margherita',
    description: 'Massa fina, molho de tomate, manjericão fresco e mussarela',
    price: 45.90,
    category: 'Pizza',
    available: true
  },
  {
    id: '2',
    name: 'Hambúrguer Artesanal',
    description: 'Pão brioche, carne 180g, queijo cheddar, bacon e batata rústica',
    price: 38.50,
    category: 'Hambúrguer',
    available: true
  },
  {
    id: '3',
    name: 'Salmão Grelhado',
    description: 'Filé de salmão grelhado com risotto de limão siciliano',
    price: 68.90,
    category: 'Prato Principal',
    available: true
  },
  {
    id: '4',
    name: 'Cerveja Artesanal IPA',
    description: 'Cerveja artesanal India Pale Ale 500ml',
    price: 18.90,
    category: 'Bebida',
    available: true
  },
  {
    id: '5',
    name: 'Tiramisu',
    description: 'Sobremesa italiana tradicional com café e mascarpone',
    price: 22.90,
    category: 'Sobremesa',
    available: false
  }
];

export const mockReservations: Reservation[] = [
  {
    id: '1',
    customerId: '1',
    customerName: 'Ana Costa',
    tableId: '3',
    tableNumber: 3,
    datetime: '2024-03-15T19:30:00Z',
    partySize: 4,
    status: 'confirmed',
    note: 'Aniversário'
  },
  {
    id: '2',
    customerId: '2',
    customerName: 'Roberto Oliveira',
    tableId: '5',
    tableNumber: 5,
    datetime: '2024-03-15T20:00:00Z',
    partySize: 6,
    status: 'pending'
  }
];

export const mockWaitlist: WaitlistEntry[] = [
  {
    id: '1',
    customerId: '3',
    customerName: 'Lucia Ferreira',
    people: 2,
    status: 'waiting',
    entryTime: '2024-03-15T18:30:00Z',
    estimatedWait: 25
  },
  {
    id: '2',
    customerId: '1',
    customerName: 'Ana Costa',
    people: 4,
    status: 'waiting',
    entryTime: '2024-03-15T19:00:00Z',
    estimatedWait: 40
  }
];

export const mockOrders: Order[] = [
  {
    id: '1',
    tableNumber: '2',
    items: [
      { productId: '1', productName: 'Pizza Margherita', quantity: 2, price: 45.90 },
      { productId: '4', productName: 'Cerveja Artesanal IPA', quantity: 3, price: 18.90 }
    ],
    total: 148.50,
    status: 'preparing',
    createdAt: '2024-03-15T19:15:00Z',
    source: 'public'
  },
  {
    id: '2',
    tableNumber: '6',
    customerId: '2',
    items: [
      { productId: '3', productName: 'Salmão Grelhado', quantity: 1, price: 68.90 },
      { productId: '5', productName: 'Tiramisu', quantity: 2, price: 22.90 }
    ],
    total: 114.70,
    status: 'ready',
    createdAt: '2024-03-15T19:45:00Z',
    source: 'internal'
  }
];