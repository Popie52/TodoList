import Navbar from "./Navbar";
import Login from "./Login";
import Register from './Register';
import { Routes, Route } from "react-router-dom";
import Welcome from "./Welcome";
import DashBoard  from "./Dashboard";
import PrivateRoute from "./PrivateRoute";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register /> } />
        <Route path="/dashboard" element={ <PrivateRoute>
              <DashBoard />
          </PrivateRoute> } />
      </Routes>
    </div>
  );
};

export default Home;
