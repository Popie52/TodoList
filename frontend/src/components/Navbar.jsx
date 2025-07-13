import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Home, LayoutDashboard, Plus, History, BarChart3, Settings, Calendar } from "lucide-react";
import LogOutButton from "./auth/LogOutButton.jsx";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { isLoggedIn, authUser } = useSelector(state => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/todos", label: "Add Task", icon: Plus },
    { to: "/completed", label: "History", icon: History },
    { to: "/analytics", label: "Analytics", icon: BarChart3 },
  ];

  const isActiveLink = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link 
              to="/" 
              className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors"
            >
              TodoApp
            </Link>

            <div className="hidden lg:flex items-center space-x-1">
              {!isLoggedIn ? (
                <>
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900 font-medium px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-md font-medium transition-colors ${
                          isActiveLink(item.to)
                            ? 'bg-blue-50 text-blue-600 border border-blue-200'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="hidden xl:block">{item.label}</span>
                      </Link>
                    );
                  })}
                  
                  <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {authUser?.name?.charAt(0).toUpperCase() || "U"}
                        </span>
                      </div>
                      <span className="hidden xl:block text-gray-700 font-medium">
                        {authUser?.name || "User"}
                      </span>
                    </div>
                    <LogOutButton />
                  </div>
                </>
              )}
            </div>

            <div className="lg:hidden">
              {isLoggedIn ? (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {authUser?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                  <button
                    onClick={toggleMobileMenu}
                    className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                  >
                    {isMobileMenuOpen ? (
                      <X className="w-6 h-6" />
                    ) : (
                      <Menu className="w-6 h-6" />
                    )}
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link
                    to="/login"
                    className="text-gray-600 hover:text-gray-900 font-medium px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-blue-600 text-white px-3 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}

      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-medium">
                  {authUser?.name?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {authUser?.name || "User"}
                </h3>
                <p className="text-sm text-gray-600">{authUser?.email || "user@example.com"}</p>
              </div>
            </div>
            <button
              onClick={closeMobileMenu}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={closeMobileMenu}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                    isActiveLink(item.to)
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="flex justify-center">
              <LogOutButton />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;