import { useState } from "react";
import { CheckCircle, Circle, ChevronRight, Calendar, Timer, Pencil, Save, X } from "lucide-react";
import { useUpdateTodoMutation } from '../../services/todo'; // your RTK query mutation

const CompactTodoItem = ({ todo, onSelect }) => {
  const [editMode, setEditMode] = useState(false);
  const [updatedTodo, setUpdatedTodo] = useState(todo);
  const [updateTodo, { isLoading }] = useUpdateTodoMutation();

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-600';
      case 'medium': return 'bg-yellow-100 text-yellow-600';
      case 'low': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && !todo.completed;
  };

  // Toggle completed status directly by clicking the circle
  const handleToggleCompleted = async (e) => {
    e.stopPropagation();
    try {
      await updateTodo({ ...todo, completed: !todo.completed }).unwrap();
      // The parent list will remove completed tasks via filtering
    } catch (err) {
      console.error("Failed to toggle completed", err);
    }
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    try {
      await updateTodo(updatedTodo).unwrap();
      setEditMode(false);
    } catch (err) {
      console.error('Failed to update todo', err);
    }
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setUpdatedTodo(todo); // reset to original if cancelled
    setEditMode(false);
  };

  // prevent onSelect firing when clicking inside edit inputs or buttons
  const stopPropagation = (e) => e.stopPropagation();

  return (
    <div
      className="relative p-4 rounded-lg border border-gray-200 bg-white hover:border-gray-300 cursor-pointer transition-all duration-200 hover:shadow-md hover:transform hover:-translate-y-1"
      onClick={() => !editMode && onSelect(todo)}
    >
      {/* EDIT ICON - shows only on hover */}
      {!editMode && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setEditMode(true);
            setUpdatedTodo(todo);
          }}
          title="Edit"
          className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-blue-600 hover:text-blue-800"
        >
          <Pencil className="w-5 h-5" />
        </button>
      )}

      <div className="flex items-center justify-between mb-3 group">
        {/* Circle toggle */}
        <div
          onClick={handleToggleCompleted}
          className="flex-shrink-0 cursor-pointer"
          title={todo.completed ? "Mark as incomplete" : "Mark as completed"}
        >
          {todo.completed ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          )}
        </div>

        {/* Title */}
        <div className="flex-1 mx-3">
          {editMode ? (
            <input
              type="text"
              value={updatedTodo.title}
              onChange={(e) => setUpdatedTodo({ ...updatedTodo, title: e.target.value })}
              onClick={stopPropagation}
              className="font-medium truncate border border-gray-300 rounded px-1 py-0.5 w-full"
              autoFocus
            />
          ) : (
            <h3 className={`font-medium truncate ${
              todo.completed ? "text-gray-500 line-through" : "text-gray-900"
            }`}>
              {todo.title}
            </h3>
          )}
        </div>

        {/* Save/Cancel buttons in edit mode */}
        {editMode && (
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="text-green-600 hover:text-green-800"
              title="Save"
            >
              <Save className="w-5 h-5" />
            </button>
            <button
              onClick={handleCancel}
              className="text-red-600 hover:text-red-800"
              title="Cancel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Chevron for navigation when not editing */}
        {!editMode && (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        )}
      </div>

      <div className="flex items-center justify-between mb-2">
        {/* Priority */}
        {editMode ? (
          <select
            value={updatedTodo.priority || ''}
            onChange={(e) => setUpdatedTodo({ ...updatedTodo, priority: e.target.value })}
            onClick={stopPropagation}
            className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(updatedTodo.priority)}`}
          >
            <option value="">Normal</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        ) : (
          <div className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(todo.priority)}`}>
            {todo.priority || 'Normal'}
          </div>
        )}

        {/* Category */}
        {editMode ? (
          <input
            type="text"
            value={updatedTodo.category || ''}
            onChange={(e) => setUpdatedTodo({ ...updatedTodo, category: e.target.value })}
            onClick={stopPropagation}
            placeholder="Category"
            className="text-xs text-gray-500 border-b border-gray-300 focus:outline-none focus:border-blue-500"
          />
        ) : (
          <div className="text-xs text-gray-500">
            {todo.category}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-1">
          <Calendar className="w-3 h-3" />
          <span className={isOverdue(todo.dueDate) ? 'text-red-500 font-medium' : ''}>
            {formatDate(todo.dueDate)}
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <Timer className="w-3 h-3" />
          <span>{todo.estimatedTime || 0}min</span>
        </div>
      </div>
    </div>
  );
};

export default CompactTodoItem;
