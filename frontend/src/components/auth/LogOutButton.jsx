import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogOut } from "../../reducers/authReducer";
import {resetApiState} from '../../services/todo.js';

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const check = window.confirm("Are you sure you want to logout?");
    if(check) {
      try {
        dispatch(setLogOut());
        dispatch(resetApiState());
        navigate("/login");
      } catch (error) {
        alert('Logout Failed. Please Try again.');
      }
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