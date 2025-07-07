import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    const check = window.confirm("Are you sure you want to logout?");
    if (check) {
      logout();
      navigate("/login");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="text-red-600 hover:text-red-700 font-medium px-3 py-2 rounded-md hover:bg-red-50 transition-all duration-200 border border-red-200 hover:border-red-300"
    >
      Logout
    </button>
  );
};

export default LogoutButton;