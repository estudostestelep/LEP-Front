# 🎨 LEP System - Frontend

Modern React 19 + Vite frontend for complete restaurant management system with reservations, waitlist, digital menu, and notifications.

## 📊 What This Frontend Does

- ✅ **Restaurant Dashboard** - Complete management interface for restaurant operations
- ✅ **Reservation Management** - View, create, update, and cancel reservations
- ✅ **Waitlist Management** - Queue management for customers waiting for tables
- ✅ **Digital Menu** - Display and manage restaurant menu items
- ✅ **Product Management** - CRUD operations for menu items and categories
- ✅ **Order Management** - Create and track customer orders
- ✅ **Kitchen Queue** - Real-time order tracking for kitchen staff
- ✅ **Customer Management** - Manage customer information and preferences
- ✅ **Settings & Configuration** - Project settings, theme customization, environment management
- ✅ **Notification Management** - Configure notification templates and send manual notifications
- ✅ **User Authentication** - JWT-based login with role-based access control
- ✅ **Multi-tenant Support** - Support for multiple organizations and projects
- ✅ **Theme Customization** - Dynamic theming with color and typography customization
- ✅ **Reports & Analytics** - View occupancy, reservation, and waitlist reports

## 🛠️ Technology Stack

- **React 19.1.1** - UI framework
- **Vite 7.1.2** - Build tool and dev server
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui + magicui** - Component libraries
- **Axios** - HTTP client with interceptors
- **React Router** - Client-side routing
- **Framer Motion** - Animations
- **Lucide React** - Icon library

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+**
- **npm or yarn**
- **Backend running on https://lep-system-341885235510.us-central1.run.app (production) or http://localhost:8080 (development)**

### Installation & Running

```bash
# Clone repository
git clone <repository-url>
cd LEP-Front

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your backend URL and API configuration

# Start development server
npm run dev
# Frontend starts on http://localhost:5173

# Check connectivity
# Open browser and navigate to http://localhost:5173
```

### Build for Production

```bash
# Build optimized bundle
npm run build

# Preview production build locally
npm run preview

# Lint code
npm run lint
```

## 📁 Project Structure

```
LEP-Front/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Shared components
│   │   ├── dashboard/      # Dashboard specific components
│   │   └── ...
│   ├── pages/              # Page components (routes)
│   ├── services/           # API client services
│   ├── context/            # React Context (auth, theme, etc.)
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript interfaces
│   ├── utils/              # Utility functions
│   ├── styles/             # Global styles
│   ├── App.tsx             # Root component
│   └── main.tsx            # Entry point
├── public/                 # Static assets
├── .env.example            # Environment variables template
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## 🔐 Authentication & Authorization

### Login

Users log in with email and password to receive JWT token:

```bash
POST /login
{
  "email": "user@example.com",
  "password": "password"
}
```

Response includes:
- JWT token for authenticated requests
- User information (ID, name, email, roles)
- Organization and project assignments

### Headers (Automatic)

All authenticated requests include headers automatically via Axios interceptors:

```bash
Authorization: Bearer <jwt-token>
X-Lpe-Organization-Id: <organization-uuid>
X-Lpe-Project-Id: <project-uuid>
```

### Protected Routes

```
/dashboard         - Requires authentication
/products          - Requires authentication
/reservations      - Requires authentication
/customers         - Requires authentication
/settings          - Requires authentication
/reports           - Requires authentication
```

### Public Routes

```
/                  - Home (no auth required)
/menu              - Digital menu (no auth required)
/login             - Login page
```

## 🌐 API Integration

### Service Architecture

Services handle communication with backend API:

```typescript
// User service
userService.login(email, password)
userService.logout()
userService.getCurrentUser()

// Product service
productService.getAll(orgId, projectId)
productService.getById(id)
productService.create(data)
productService.update(id, data)
productService.delete(id)

// Reservation service
reservationService.getAll()
reservationService.getById(id)
reservationService.create(data)
reservationService.update(id, data)
reservationService.cancel(id)

// And many more...
```

### Error Handling

Axios interceptors handle common errors:

- **401 (Unauthorized)** - Invalid or expired token → Redirect to login
- **403 (Forbidden)** - User lacks permission → Show error message
- **404 (Not Found)** - Resource not found → Show error message
- **500 (Server Error)** - Backend error → Show error message

## ⚙️ Configuration

### Environment Variables

Create `.env` file based on `.env.example`:

```bash
# Backend API URL
# Development:
VITE_API_BASE_URL=http://localhost:8080
# Production:
# VITE_API_BASE_URL=https://lep-system-341885235510.us-central1.run.app

# Optional: Enable mock data
VITE_ENABLE_MOCKS=false

# Optional: API timeout
VITE_API_TIMEOUT=30000

# Optional: Feature flags
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_REPORTS=true
```

### Theme Customization

Access theme customization in Settings:
- Primary & accent colors
- Font selections
- Button styles
- Shadow intensity
- Disabled state opacity

Themes are stored per project and instantly applied.

## 📱 Key Pages & Features

### Dashboard
- Overview of restaurant operations
- Recent reservations and orders
- Quick action buttons

### Reservations
- View all reservations
- Create new reservation
- Update existing reservation
- Cancel reservation
- Filter by status and date

### Waitlist
- View customers waiting for tables
- Estimate wait times
- Seat customers

### Menu / Products
- Display digital menu
- Manage product categories
- Manage product items
- Upload product images
- Filter and search products

### Orders
- View all orders
- Create new order
- Track order status
- View kitchen queue

### Customers
- Manage customer information
- View customer history
- Track customer preferences

### Settings
- Project configuration
- Environment management
- User permissions
- Notification settings
- Theme customization
- Notification templates

## 🎨 Styling & Components

### Tailwind CSS

Global styling uses Tailwind CSS utilities:
```tsx
<div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-lg shadow-lg">
  <h1 className="text-white text-2xl font-bold">Welcome</h1>
</div>
```

### shadcn/ui Components

Pre-built accessible components:
```tsx
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
```

### Custom Components

```tsx
import { DashboardLayout } from "@/components/layouts/DashboardLayout"
import { ReservationCard } from "@/components/cards/ReservationCard"
import { MenuItemForm } from "@/components/forms/MenuItemForm"
```

## 🔄 State Management

### Authentication Context

```tsx
const { user, token, login, logout, isAuthenticated } = useAuth()
```

### Organization & Project Context

```tsx
const { currentOrg, currentProject, setOrganization, setProject } = useTenant()
```

### Theme Context

```tsx
const { theme, setTheme, isDark } = useTheme()
```

## 📡 API Service Examples

### Get All Products

```typescript
// From productService
const products = await productService.getAll()

// Makes GET request to:
// GET /product
// With headers:
// - Authorization: Bearer <token>
// - X-Lpe-Organization-Id: <org-id>
// - X-Lpe-Project-Id: <project-id>
```

### Create Reservation

```typescript
// From reservationService
await reservationService.create({
  customer_id: "uuid",
  table_id: "uuid",
  datetime: "2025-11-25T19:30:00Z",
  party_size: 4,
  notes: "Window seat preferred"
})

// Makes POST request to:
// POST /reservation
// With request body and headers
```

### Upload Product Image

```typescript
// From productService
const formData = new FormData()
formData.append('image', file)

await productService.uploadImage(productId, formData)

// Makes POST request to:
// POST /upload/product/image
// With form data
```

## 🧪 Development

### Code Quality

```bash
# Format code
npm run format

# Lint code
npm run lint

# Type check
npm run type-check
```

### Development Server

```bash
npm run dev

# Starts Vite dev server with:
# - Hot Module Replacement (HMR)
# - Fast refresh
# - TypeScript checking
```

## 📦 Build & Deployment

### Production Build

```bash
npm run build

# Creates optimized bundle in dist/
# - Code splitting
# - Tree shaking
# - Minification
# - CSS optimization
```

### Preview Build Locally

```bash
npm run preview

# Serves production bundle locally
# Useful for testing before deployment
```

## 📖 Additional Documentation

- **[LATEST_UPDATES.txt](LATEST_UPDATES.txt)** - Recent changes and improvements
- **[CLAUDE.md](CLAUDE.md)** - Development guidelines
- **[Backend CLAUDE.md](../LEP-Back/CLAUDE.md)** - Backend integration guidelines

## ✅ Status

- ✅ Frontend: Production Ready
- ✅ Build: Optimized (0 errors, type-safe)
- ✅ Authentication: JWT-based with role support
- ✅ Multi-tenant: Organization/Project support
- ✅ API Integration: Complete service layer
- ✅ Styling: Tailwind + shadcn/ui + custom components

---

**Version**: 1.0
**Status**: ✅ Production Ready
**Last Updated**: 2025-11-09
