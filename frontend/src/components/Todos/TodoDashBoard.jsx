import { useState } from 'react';
import {
  Calendar, Timer, Grid, Search, Plus, Circle, AlertTriangle, Sun, Moon, Coffee
} from "lucide-react";
import { useGetTodosQuery } from '../../services/todo';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import GridTodoItem from './GridTodoItem';
import Loader from './Loader';

const TodoDashboard = () => {
  const navigate = useNavigate();
  const { authUser } = useSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const { data: todos, error, isLoading } = useGetTodosQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600 text-xl">
        <Loader/>
        Loading your tasks...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">
        Failed to load tasks.
      </div>
    );
  }

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good morning", icon: Sun };
    if (hour < 17) return { text: "Good afternoon", icon: Sun };
    if (hour < 21) return { text: "Good evening", icon: Moon };
    return { text: "Good night", icon: Moon };
  };

  const greeting = getGreeting();
  const GreetingIcon = greeting.icon;

  // Filter out completed tasks and separate overdue
  const incompleteTodos = todos?.filter(todo => !todo.completed) || [];
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const overdueTodos = incompleteTodos.filter(todo => {
    if (!todo.dueDate) return false;
    const dueDate = new Date(todo.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate < currentDate;
  });

  const regularTodos = incompleteTodos.filter(todo => {
    if (!todo.dueDate) return true;
    const dueDate = new Date(todo.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate >= currentDate;
  });

  const categories = [...new Set(incompleteTodos.map(todo => todo.category).filter(Boolean))];

  const filterTodos = (todosArray) => {
    return todosArray.filter(todo => {
      const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        todo.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPriority =
        filterPriority === 'all' ||
        todo.priority?.toLowerCase() === filterPriority;

      const matchesCategory =
        filterCategory === 'all' ||
        todo.category === filterCategory;

      return matchesSearch && matchesPriority && matchesCategory;
    });
  };

  const filteredOverdueTodos = filterTodos(overdueTodos);
  const filteredRegularTodos = filterTodos(regularTodos);

  const renderTodoGrid = (todoArray) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {todoArray.map(todo => (
        <GridTodoItem key={todo.id} todo={todo} onSelect={() => {}} />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Greeting Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GreetingIcon className="w-8 h-8 text-yellow-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {greeting.text}, {authUser?.name || 'User'}!
                </h1>
                <p className="text-gray-600 mt-1">
                  {incompleteTodos.length === 0 
                    ? "All caught up! Time to relax ☕" 
                    : `You have ${incompleteTodos.length} pending task${incompleteTodos.length !== 1 ? 's' : ''} today`
                  }
                </p>
              </div>
            </div>
            <div className="hidden sm:flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span>{overdueTodos.length} overdue</span>
              </div>
              <div className="flex items-center space-x-1">
                <Timer className="w-4 h-4 text-blue-500" />
                <span>{regularTodos.length} pending</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search todos..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Overdue Tasks */}
        {filteredOverdueTodos.length > 0 && (
          <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Overdue Tasks ({filteredOverdueTodos.length})
                </h2>
              </div>
            </div>
            {renderTodoGrid(filteredOverdueTodos)}
          </div>
        )}

        {/* Regular Tasks */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Your Tasks ({filteredRegularTodos.length})
            </h2>
            <button
              onClick={() => navigate('/todos')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200"
            >
              <Plus className="w-4 h-4 inline-block mr-1" />
              Add New Task
            </button>
          </div>

          {filteredRegularTodos.length > 0 ? (
            renderTodoGrid(filteredRegularTodos)
          ) : (
            <div className="text-center py-12">
              <Circle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No pending tasks found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || filterPriority !== 'all' || filterCategory !== 'all' 
                  ? "Try adjusting your search or filters."
                  : "You're all caught up! Great job!"
                }
              </p>
              <button
                onClick={() => navigate('/todos')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Create New Task
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoDashboard;