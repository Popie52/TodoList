import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
  const { isLoggedIn, authUser } = useAuth();

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors duration-200"
            >
              AuthSystem
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            {!isLoggedIn ? (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 hover:transform hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-50"
                >
                  Dashboard
                </Link>
                
                {/* User Info */}
                <div className="flex items-center space-x-4">
                  <div className="hidden sm:flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {authUser.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="text-gray-700 font-medium">
                      Hello, {authUser.name}
                    </span>
                  </div>
                  
                  {/* Mobile user greeting */}
                  <div className="sm:hidden">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {authUser.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <LogoutButton />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;