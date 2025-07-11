import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useAuth();

  // if(!isLoggedIn) {
  //   return <Navigate to="/login" replace/>
  // }

  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
