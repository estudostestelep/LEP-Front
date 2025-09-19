# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LEP System is a React + TypeScript restaurant management SaaS application focused on Reservations, Waitlist, and Digital Menu functionalities. Built with Vite, the project follows a modular architecture with API services, context management, and both public and private routes.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview
```

## Project Architecture

### Tech Stack
- **Frontend**: React 19.1.1 with TypeScript
- **Build Tool**: Vite 7.1.2
- **Styling**: Tailwind CSS with shadcn/ui components
- **HTTP Client**: Axios with interceptors
- **Routing**: React Router DOM 7.9.1
- **Animations**: Framer Motion
- **Icons**: Lucide React

### Directory Structure
```
src/
├── api/                    # API service layer
│   ├── api.ts             # Axios instance with interceptors
│   ├── userService.ts
│   ├── customerService.ts
│   ├── tableService.ts
│   ├── productService.ts
│   ├── bookingService.ts  # Reservations
│   ├── waitingLineService.ts
│   └── ordersService.ts
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── magicui/          # Custom animated components
│   ├── navbar.tsx
│   ├── confirmModal.tsx
│   └── formModal.tsx
├── context/
│   └── authContext.tsx    # User authentication & tenant context
├── pages/
│   ├── home/
│   ├── menu/             # Public digital menu
│   ├── login/
│   ├── users/            # Private admin area
│   ├── products/         # Private admin area
│   └── customers/        # Private admin area
└── lib/
    ├── utils.ts          # Tailwind merge utilities
    └── mock-data.ts      # Development mock data
```

### Authentication & Context

The application uses `AuthContext` to manage user sessions with the following structure:
```typescript
interface User {
  id: string;
  name: string;
  email?: string;
  role?: string;
  orgId: string;      # Multi-tenant organization ID
  projectId: string;  # Multi-tenant project ID
}
```

**Important**: All API calls automatically include `orgId` and `projId` headers via axios interceptors for multi-tenant support.

### API Configuration

- Base URL: `http://localhost:3000/api` (hardcoded in `src/api/api.ts`)
- Automatic header injection: `orgId` and `projId` from localStorage
- Centralized error handling through axios interceptors

### Routing Strategy

- **Public Routes**: `/`, `/menu` (no authentication required)
- **Private Routes**: `/users`, `/products` (require authentication via `PrivateRoute` component)
- Navigation managed by `src/components/navbar.tsx`

### Key Business Logic

1. **Multi-tenant Architecture**: Each request includes orgId/projectId for tenant isolation
2. **Public Digital Menu**: Customers can view menu without authentication
3. **Admin Interface**: Protected CRUD operations for restaurant management
4. **Session Persistence**: User data stored in localStorage with automatic context hydration

### Environment Variables

Expected environment variables:
- `VITE_API_BASE_URL`: Backend API base URL
- `VITE_ENABLE_MOCKS`: Enable/disable mock data (optional)

### Important Implementation Notes

- Path aliasing configured: `@/` maps to `src/`
- Tailwind CSS with custom component library (shadcn/ui + magicui)
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Responsive design with mobile-first approach

### API Service Pattern

All API services follow a consistent pattern:
```typescript
// Example from userService.ts
export const getUsers = () => api.get('/users');
export const createUser = (data: any) => api.post('/users', data);
export const updateUser = (id: string, data: any) => api.put(`/users/${id}`, data);
export const deleteUser = (id: string) => api.delete(`/users/${id}`);
```

Services automatically include tenant headers through the api interceptor in `src/api/api.ts`.