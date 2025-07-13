import { useState, useMemo } from 'react';
import {
  CheckCircle2, Search, Filter, Calendar, Trash2, RotateCcw, 
  Award, TrendingUp, Calendar as CalendarIcon, Clock, 
  Archive, Download, ChevronDown, ChevronUp, Target
} from "lucide-react";
import { useGetTodosQuery, useDeleteTodoMutation, useUpdateTodoMutation } from '../../services/todo';
import { useSelector } from 'react-redux';
import Loader from './Loader';

const CompletedTasks = () => {
  const { authUser } = useSelector(state => state.auth);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [timeRange, setTimeRange] = useState('all');
  const [sortBy, setSortBy] = useState('completedAt');
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [showStats, setShowStats] = useState(true);

  const { data: todos, error, isLoading } = useGetTodosQuery();
  const [deleteTodo] = useDeleteTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600 text-xl">
        <Loader />
        Loading completed tasks...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">
        Failed to load completed tasks.
      </div>
    );
  }

  const completedTasks = todos?.filter(todo => todo.completed) || [];
  const categories = [...new Set(completedTasks.map(todo => todo.category).filter(Boolean))];

  // Calculate stats
  const stats = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisWeek = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      total: completedTasks.length,
      today: completedTasks.filter(task => {
        const completedDate = new Date(task.completedAt || task.updatedAt);
        return completedDate >= today;
      }).length,
      thisWeek: completedTasks.filter(task => {
        const completedDate = new Date(task.completedAt || task.updatedAt);
        return completedDate >= thisWeek;
      }).length,
      thisMonth: completedTasks.filter(task => {
        const completedDate = new Date(task.completedAt || task.updatedAt);
        return completedDate >= thisMonth;
      }).length,
      byPriority: {
        high: completedTasks.filter(task => task.priority === 'high').length,
        medium: completedTasks.filter(task => task.priority === 'medium').length,
        low: completedTasks.filter(task => task.priority === 'low').length,
      }
    };
  }, [completedTasks]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    let filtered = completedTasks.filter(task => {
      const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
      const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;

      let matchesTime = true;
      if (timeRange !== 'all') {
        const completedDate = new Date(task.completedAt || task.updatedAt);
        const now = new Date();
        
        switch (timeRange) {
          case 'today':
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            matchesTime = completedDate >= today;
            break;
          case 'week':
            const weekAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
            matchesTime = completedDate >= weekAgo;
            break;
          case 'month':
            const monthAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
            matchesTime = completedDate >= monthAgo;
            break;
        }
      }

      return matchesSearch && matchesCategory && matchesPriority && matchesTime;
    });

    // Sort tasks
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'completedAt':
          return new Date(b.completedAt || b.updatedAt) - new Date(a.completedAt || a.updatedAt);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        case 'category':
          return (a.category || '').localeCompare(b.category || '');
        default:
          return 0;
      }
    });

    return filtered;
  }, [completedTasks, searchTerm, filterCategory, filterPriority, timeRange, sortBy]);

  const handleTaskSelect = (taskId) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSelectAll = () => {
    setSelectedTasks(
      selectedTasks.length === filteredTasks.length 
        ? [] 
        : filteredTasks.map(task => task.id)
    );
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Delete ${selectedTasks.length} completed tasks?`)) {
      for (const taskId of selectedTasks) {
        await deleteTodo(taskId);
      }
      setSelectedTasks([]);
    }
  };

  const handleRestoreTask = async (task) => {
    await updateTodo({
      id: task.id,
      ...task,
      completed: false,
      completedAt: null
    });
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Delete this completed task?')) {
      await deleteTodo(taskId);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Completed Tasks
                </h1>
                <p className="text-gray-600 mt-1">
                  Great job, {authUser?.name}! You've completed {stats.total} tasks
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowStats(!showStats)}
              className="flex items-center space-x-1 text-gray-600 hover:text-gray-900"
            >
              <span className="text-sm">Stats</span>
              {showStats ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {showStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today</p>
                  <p className="text-2xl font-bold text-green-600">{stats.today}</p>
                </div>
                <Target className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Week</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.thisWeek}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.thisMonth}</p>
                </div>
                <CalendarIcon className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Award className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search completed tasks..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>

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

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="completedAt">Completed Date</option>
                <option value="title">Title</option>
                <option value="priority">Priority</option>
                <option value="category">Category</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedTasks.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-blue-800 font-medium">
                {selectedTasks.length} task{selectedTasks.length !== 1 ? 's' : ''} selected
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4 inline mr-1" />
                  Delete Selected
                </button>
                <button
                  onClick={() => setSelectedTasks([])}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tasks List */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Tasks ({filteredTasks.length})
            </h2>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleSelectAll}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                {selectedTasks.length === filteredTasks.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>
          </div>

          {filteredTasks.length > 0 ? (
            <div className="space-y-4">
              {filteredTasks.map(task => (
                <div
                  key={task.id}
                  className={`border rounded-lg p-4 transition-all ${
                    selectedTasks.includes(task.id) 
                      ? 'border-blue-300 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedTasks.includes(task.id)}
                        onChange={() => handleTaskSelect(task.id)}
                        className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 line-through">
                          {task.title}
                        </h3>
                        {task.description && (
                          <p className="text-gray-600 mt-1 text-sm line-through">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 mt-2">
                          {task.priority && (
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          )}
                          {task.category && (
                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">
                              {task.category}
                            </span>
                          )}
                          <div className="flex items-center text-gray-500 text-sm">
                            <Clock className="w-4 h-4 mr-1" />
                            Completed {formatDate(task.completedAt || task.updatedAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleRestoreTask(task)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Restore task"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Archive className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No completed tasks found
              </h3>
              <p className="text-gray-600">
                {searchTerm || filterCategory !== 'all' || filterPriority !== 'all' || timeRange !== 'all'
                  ? "Try adjusting your filters."
                  : "Complete some tasks to see them here!"
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompletedTasks;