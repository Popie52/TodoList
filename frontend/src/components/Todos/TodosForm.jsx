import { useState } from "react";
import {
  Plus, Calendar, Flag, CheckCircle, Loader2, ClipboardList
} from "lucide-react";
import {
  useCreateTodoMutation
} from "../../services/todo.js";
import { useNavigate } from "react-router-dom";

const TodosForm = () => {
  const [createTodo, { isLoading, isSuccess, isError, error }] = useCreateTodoMutation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
    completed: '',
    dueDate: '',
    category: '',
    tags: ''
  });

  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { title, description, priority, completed, dueDate, category, tags } = formData;

    if (!title || !description || !priority || !completed || !dueDate) return;

    const todoData = {
      title,
      description,
      priority,
      completed: completed === 'true',
      dueDate: new Date(dueDate),
      category: category || null,
      tags: tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '')
    };

    try {
      await createTodo(todoData).unwrap();
      setSuccessMessage('Todo created successfully!');
      setFormData({
        title: '',
        description: '',
        priority: '',
        completed: '',
        dueDate: '',
        category: '',
        tags: ''
      });
      setTimeout(() => setSuccessMessage(''), 3000);
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (err) {
      console.error('Create Todo failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <ClipboardList className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create New Todo</h2>
          <p className="text-gray-600">Add a new task to your todo list</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
          <div className={`space-y-6 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}>
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                <ClipboardList className="inline w-4 h-4 mr-1" /> Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
                placeholder="Enter todo title"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400 resize-none"
                placeholder="Enter todo description"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-2">
                  <Flag className="inline w-4 h-4 mr-1" /> Priority
                </label>
                <select
                  name="priority"
                  id="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label htmlFor="completed" className="block text-sm font-semibold text-gray-700 mb-2">
                  <CheckCircle className="inline w-4 h-4 mr-1" /> Status
                </label>
                <select
                  name="completed"
                  id="completed"
                  value={formData.completed}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">Select status</option>
                  <option value="false">In Progress</option>
                  <option value="true">Completed</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="dueDate" className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="inline w-4 h-4 mr-1" /> Due Date
              </label>
              <input
                type="date"
                name="dueDate"
                id="dueDate"
                value={formData.dueDate}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                id="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Enter category (e.g., Work, Personal)"
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-semibold text-gray-700 mb-2">
                Tags <span className="text-gray-400 text-xs">(comma-separated)</span>
              </label>
              <input
                type="text"
                name="tags"
                id="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., react, frontend, ui"
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:transform hover:-translate-y-0.5 hover:shadow-lg"
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Todo...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Add Todo</span>
                </div>
              )}
            </button>
          </div>

 
          {successMessage && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600">{successMessage}</p>
            </div>
          )}

  
          {isError && error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">
                {error?.data || 'Failed to create todo.'}
              </p>
            </div>
          )}
        </div>

        <div className="text-center">
          <p className="text-gray-600 text-sm">
            Need help managing your todos?{" "}
            <button className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
              View Guide
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default TodosForm;
