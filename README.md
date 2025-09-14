# LEP System

LEP System is a web application built with **React + Vite +
TypeScript**, designed for restaurant and hospitality management.\
This MVP (Minimum Viable Product) focuses on three main areas:
**reservations**, **waitlist management**, and a **digital menu with
order placement**.

------------------------------------------------------------------------

## 🚀 Features

### 1. User Management

-   Centralized login with **Context API** (`UserContext`).
-   Stores `userId`, `orgId`, and `projId` globally.
-   Persists session with **localStorage**.
-   Provides a custom hook (`useUserContext`) to easily access user data
    in any component.

### 2. Public Access (No Login Required)

-   Guests can view the **digital menu**.
-   By providing their **table number**, they can place an order
    directly.
-   Ideal for restaurants where customers interact without needing to
    log in.

### 3. Authenticated Access (Logged Users)

Logged-in users have full access to: - **Dashboard**: Quick overview of
operations. - **User Management**: Manage restaurant staff accounts. -
**Customer Management**: Access customer details and history. - **Table
Management**: View and assign tables. - **Product Management**: CRUD for
dishes, beverages, etc. - **Reservations**: Manage bookings. -
**Waitlist**: Handle waiting customers. - **Orders**: Monitor and manage
all incoming orders.

### 4. Services Layer

Structured services for modularity and scalability: - `UserService` --
handles authentication and user operations. - `CustomerService` --
manages customers. - `TableService` -- handles table availability and
assignments. - `ProductService` -- CRUD operations for menu items. -
`ReservationService` -- bookings and reservations. - `WaitlistService`
-- queue management. - `OrderService` -- order processing.

### 5. Navigation (Navbar)

-   **Responsive navbar** with conditional rendering.
-   If logged in → full feature set (users, customers, tables, products,
    reservations, waitlist, orders).
-   If not logged in → public view (menu, make an order).

------------------------------------------------------------------------

## 🛠️ Tech Stack

-   **React 18** with **Vite** (fast dev environment).
-   **TypeScript** for type safety.
-   **React Router DOM** for navigation.
-   **TailwindCSS** for minimal styling.
-   **Context API** for global state management.

------------------------------------------------------------------------

## 📂 Project Structure

    src/
     ├─ components/       # Reusable UI components (Navbar, etc.)
     ├─ context/          # UserContext for global state
     ├─ pages/            # Application pages (Login, Dashboard, Menu, Orders, etc.)
     ├─ services/         # Service layer (API and business logic)
     ├─ App.tsx           # App routes
     └─ main.tsx          # Entry point

------------------------------------------------------------------------

## ⚙️ Installation & Setup

1.  Clone the repository:

    ``` bash
    git clone https://github.com/your-org/lep-system.git
    cd lep-system
    ```

2.  Install dependencies:

    ``` bash
    npm install
    ```

3.  Run the development server:

    ``` bash
    npm run dev
    ```

4.  Build for production:

    ``` bash
    npm run build
    ```

5.  Preview production build:

    ``` bash
    npm run preview
    ```

------------------------------------------------------------------------

## 🔮 Next Steps (Future Improvements)

-   Authentication with real backend (JWT or OAuth).
-   Role-based access control (Admin, Waiter, Kitchen Staff).
-   Database integration for persistent data (PostgreSQL, MongoDB,
    etc.).
-   API layer for services.
-   Mobile-first responsive design improvements.
-   Real-time updates for orders and waitlist using WebSockets.

------------------------------------------------------------------------

## 📜 License

This project is licensed under the **MIT License**.
