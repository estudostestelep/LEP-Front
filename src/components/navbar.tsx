import { Link } from "react-router-dom";
import { useUser } from "../context/userContext";

export default function Navbar() {
  const { user } = useUser();

  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-14 items-center">
          {/* Left section */}
          <div className="flex items-center space-x-6">
            <Link to="/" className="text-lg font-semibold hover:text-blue-400">
              LEP System
            </Link>

            {user ? (
              <div className="flex space-x-4">
                <Link to="/users" className="hover:text-blue-400">
                  Users
                </Link>
                <Link to="/customers" className="hover:text-blue-400">
                  Customers
                </Link>
                <Link to="/tables" className="hover:text-blue-400">
                  Tables
                </Link>
                <Link to="/products" className="hover:text-blue-400">
                  Products
                </Link>
                <Link to="/reservations" className="hover:text-blue-400">
                  Reservations
                </Link>
                <Link to="/waitlist" className="hover:text-blue-400">
                  Waitlist
                </Link>
                <Link to="/orders" className="hover:text-blue-400">
                  Orders
                </Link>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link to="/menu" className="hover:text-blue-400">
                  Menu
                </Link>
                <Link to="/order" className="hover:text-blue-400">
                  Make an Order
                </Link>
              </div>
            )}
          </div>

          {/* Right section */}
          <div>
            {user ? (
              <span className="text-sm text-gray-300">
                Welcome, <span className="font-medium">{user.userId}</span>
              </span>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-blue-500 transition"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
