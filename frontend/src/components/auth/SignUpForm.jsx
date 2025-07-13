import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  resetAuthState,
  setLogin,
  signupUser,
} from "../../reducers/authReducer";

const SignUpForm = () => {
  const navigate = useNavigate();
  const { loading, success, isLoggedIn, authToken, authUser, error } =
    useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: "",
    name: "",
    password: "",
  });

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
      const timer = setTimeout(() => {
        dispatch(setLogin({ authToken, authUser }));
        navigate("/dashboard");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate, authToken, authUser, isLoggedIn, dispatch]);

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(signupUser(formData));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h2>
          <p className="text-gray-600">Join us and start your journey</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={onChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="Enter your full name"
              />
            </div>

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
                value={formData.username}
                onChange={onChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="Choose a username"
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
                placeholder="Create a secure password"
              />
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
              {loading ? "Creating Account..." : "Create Account"}
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
                Account created successfully!
              </p>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
