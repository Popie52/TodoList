import { useLogin } from "../hooks/useAuth.js";
import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { login, isLoggedIn } = useAuth();
  const mutation = useLogin();
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  if (isLoggedIn) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogin = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    
    // Clear previous error message
    setErrorMessage(null);
    
    if (!username || !password) {
      setErrorMessage("Both fields are required.");
      return;
    }
    
    mutation.mutate(
      { username, password },
      {
        onError: (error) => {
          setErrorMessage(error.message || "Login failed");
        },
        onSuccess: (data) => {
          const user = { username: data.username, name: data.name };
          login(data.token, user);
          navigate("/dashboard");
        },
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">
            Sign in to your account
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Username Field */}
            <div>
              <label 
                htmlFor="username" 
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="Enter your username"
              />
            </div>

            {/* Password Field */}
            <div>
              <label 
                htmlFor="password" 
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="Enter your password"
              />
            </div>

            {/* Forgot Password Link */}
            <div className="text-right">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={mutation.isLoading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                mutation.isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:transform hover:-translate-y-0.5 hover:shadow-lg"
              }`}
            >
              {mutation.isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">
                {errorMessage}
              </p>
            </div>
          )}

          {/* Success Message */}
          {mutation.isSuccess && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">
                Login successful! Redirecting...
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{" "}
            <button
              onClick={() => navigate("/signup")}
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;