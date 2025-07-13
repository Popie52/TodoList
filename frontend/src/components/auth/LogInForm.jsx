import { useState, useEffect } from "react";
import {
  loginUser,
  resetAuthState,
  setLogin,
} from "../../reducers/authReducer";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const LogInForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, success, error, isLoggedIn, authToken, authUser } =
    useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/dashboard");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    dispatch(resetAuthState());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        dispatch(resetAuthState());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (!isLoggedIn && success && authToken && authUser) {
      const clearId = setTimeout(() => {
        dispatch(setLogin({ authToken, authUser }));
        navigate("/dashboard");
      }, 1000);
      return () => clearTimeout(clearId);
    }
  }, [success, authToken, authUser, isLoggedIn, dispatch, navigate]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <form onSubmit={onSubmit} className="space-y-6">
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
                onChange={onChange}
                value={formData.username}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="Enter your username"
              />
            </div>

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
                onChange={onChange}
                value={formData.password}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="Enter your password"
              />
            </div>

            <div className="text-right">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                onClick={() => navigate("/forgot-password")}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:transform hover:-translate-y-0.5 hover:shadow-lg"
              }`}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {success && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">
                Login successful! Redirecting...
              </p>
            </div>
          )}
        </div>

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

export default LogInForm;
