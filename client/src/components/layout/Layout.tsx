import React, { useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../../features/auth/hooks/useAuth";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              to="/dashboard"
              className="text-xl font-bold text-white shrink-0"
            >
              ORS Tracker
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/dashboard"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/ors"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                ORS Plans
              </Link>
            </div>

            {/* Desktop User Info & Logout */}
            <div className="hidden md:flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-white">{user?.username}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm cursor-pointer"
              >
                <LogOut size={18} />
                <span className="hidden lg:inline">Logout</span>
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-300 hover:text-white p-2"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-700 py-4">
              <div className="flex flex-col space-y-2">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/ors"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-300 hover:text-white hover:bg-gray-700 px-3 py-2 rounded-md text-base font-medium"
                >
                  ORS Plans
                </Link>
                <div className="border-t border-gray-700 pt-2 mt-2">
                  <div className="px-3 py-2">
                    <p className="text-sm text-white font-medium">
                      {user?.username}
                    </p>
                    <p className="text-xs text-gray-400 capitalize">
                      {user?.role}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm mt-2"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
