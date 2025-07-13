import { Routes, Route } from "react-router-dom";

import Welcome from "./Welcome";
import LogInForm from "./auth/LogInForm";
import SignUpForm from "./auth/SignUpForm";
import Navbar from "./Navbar";
import PrivateRoute from "./PrivateRoute";
import TodoDashBoard from "./Todos/TodoDashBoard";
import TodosForm from "./Todos/TodosForm";
import TodoAnalytics from "./Todos/TodoAnalytics";
import CompletedTasks from "./Todos/CompletedTasks";

const Home = () => {
  return (
    <div className="flex min-h-screen">

      <div className="flex-1 flex flex-col">
        <Navbar  />
        <main className="p-4">
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/login" element={<LogInForm />} />
            <Route path="/signup" element={<SignUpForm />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <TodoDashBoard />
                </PrivateRoute>
              }
            />
            <Route path="/analytics" element={ <TodoAnalytics/> } />
            <Route path="/todos" element={<TodosForm />} />
            <Route path="/completed" element={<CompletedTasks /> } />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Home;
