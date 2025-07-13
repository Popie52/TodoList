import { useState, useCallback, useMemo } from "react";
import {
  Calendar, 
  Timer, 
  CheckCircle, 
  Circle, 
  Edit3, 
  Save, 
  X, 
  Flag, 
  Plus,
  Trash2
} from "lucide-react";
import { useUpdateTodoMutation, useDeleteTodoMutation } from "../../services/todo";

const GridTodoItem = ({ todo, onSelect }) => {
  const [editMode, setEditMode] = useState(false);
  const [updatedTodo, setUpdatedTodo] = useState(todo);
  const [newTag, setNewTag] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [updateTodo, { isLoading: isUpdating }] = useUpdateTodoMutation();
  const [deleteTodo, { isLoading: isDeleting }] = useDeleteTodoMutation();

  // Predefined colors for tags
  const tagColors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-yellow-100 text-yellow-800',
    'bg-red-100 text-red-800',
    'bg-purple-100 text-purple-800',
    'bg-pink-100 text-pink-800',
    'bg-indigo-100 text-indigo-800',
    'bg-orange-100 text-orange-800',
    'bg-teal-100 text-teal-800',
    'bg-cyan-100 text-cyan-800'
  ];

  // Function to get consistent color for a tag
  const getTagColor = useCallback((tag) => {
    const hash = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return tagColors[hash % tagColors.length];
  }, []);

  // Time calculations
  const timeStatus = useMemo(() => {
    const now = new Date();
    const dueDate = todo.dueDate ? new Date(todo.dueDate) : null;
    
    if (!dueDate) return { status: 'no-due', isOverdue: false, message: null };
    
    const daysRemaining = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));
    
    if (todo.completed) return { status: 'completed', isOverdue: false, message: null };
    
    if (daysRemaining < 0) {
      return { 
        status: 'overdue', 
        isOverdue: true, 
        message: `${Math.abs(daysRemaining)}d overdue` 
      };
    }
    
    if (daysRemaining === 0) return { status: 'due-today', isOverdue: false, message: 'Due today' };
    if (daysRemaining === 1) return { status: 'due-tomorrow', isOverdue: false, message: 'Due tomorrow' };
    
    return { status: 'normal', isOverdue: false, message: null };
  }, [todo.dueDate, todo.completed]);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }, []);

  // Event handlers
  const stopPropagation = useCallback((e) => e.stopPropagation(), []);

  const handleToggleCompleted = useCallback(async (e) => {
    e.stopPropagation();
    try {
      await updateTodo({ ...todo, completed: !todo.completed }).unwrap();
    } catch (error) {
      console.error('Failed to update todo:', error);
    }
  }, [todo, updateTodo]);

  const handleEdit = useCallback((e) => {
    e.stopPropagation();
    setEditMode(true);
    setUpdatedTodo(todo);
  }, [todo]);

  const handleSave = useCallback(async (e) => {
    e.stopPropagation();
    try {
      await updateTodo(updatedTodo).unwrap();
      setEditMode(false);
    } catch (error) {
      console.error('Failed to save todo:', error);
    }
  }, [updatedTodo, updateTodo]);

  const handleCancel = useCallback((e) => {
    e.stopPropagation();
    setUpdatedTodo(todo);
    setEditMode(false);
    setNewTag('');
  }, [todo]);

  const handleDelete = useCallback((e) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  }, []);

  const handleConfirmDelete = useCallback(async (e) => {
    e.stopPropagation();
    try {
      await deleteTodo(todo.id).unwrap();
      setShowDeleteConfirm(false);
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  }, [todo.id, deleteTodo]);

  const handleCancelDelete = useCallback((e) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
  }, []);

  const handleSelect = useCallback(() => {
    if (!editMode && !showDeleteConfirm) onSelect(todo);
  }, [editMode, showDeleteConfirm, onSelect, todo]);

  const handleAddTag = useCallback((e) => {
    e.stopPropagation();
    if (newTag.trim() && !updatedTodo.tags?.includes(newTag.trim())) {
      setUpdatedTodo({
        ...updatedTodo,
        tags: [...(updatedTodo.tags || []), newTag.trim()]
      });
      setNewTag('');
    }
  }, [newTag, updatedTodo]);

  const handleRemoveTag = useCallback((tagToRemove) => {
    setUpdatedTodo({
      ...updatedTodo,
      tags: updatedTodo.tags?.filter(tag => tag !== tagToRemove) || []
    });
  }, [updatedTodo]);

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSave(e);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel(e);
    }
  }, [handleSave, handleCancel]);

  // Delete confirmation overlay
  if (showDeleteConfirm) {
    return (
      <div className="bg-white rounded-lg border border-red-200 p-4 transition-all duration-200 shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <Trash2 className="w-5 h-5 text-red-500 flex-shrink-0" />
          <h3 className="text-lg font-medium text-gray-900">Delete Todo</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to delete "<span className="font-medium">{todo.title}</span>"? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={handleCancelDelete}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmDelete}
            disabled={isDeleting}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 transition-colors duration-200"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group bg-white rounded-lg border border-gray-200 p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:border-gray-300 ${
        editMode ? 'ring-2 ring-blue-500' : ''
      } ${todo.completed ? 'opacity-60' : ''} ${
        editMode ? 'max-w-full overflow-hidden' : ''
      }`}
      onClick={handleSelect}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <button
          onClick={handleToggleCompleted}
          className="mt-1 flex-shrink-0 transition-colors duration-200"
        >
          {todo.completed ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          {editMode ? (
            <input
              value={updatedTodo.title}
              onChange={(e) => setUpdatedTodo({ ...updatedTodo, title: e.target.value })}
              onClick={stopPropagation}
              onKeyDown={handleKeyPress}
              className="w-full text-base sm:text-lg font-medium text-gray-900 border-b border-gray-300 pb-1 focus:outline-none focus:border-blue-500 transition-colors duration-200 min-w-0"
              placeholder="Todo title"
              autoFocus
            />
          ) : (
            <h3 className={`text-base sm:text-lg font-medium leading-tight break-words ${
              todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'
            }`}>
              {todo.title}
            </h3>
          )}
        </div>

        {/* Action buttons - shows on hover */}
        {!editMode && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={handleEdit}
              className="text-gray-400 hover:text-gray-600 p-1 transition-all duration-200 hover:bg-gray-100 rounded flex-shrink-0"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className="text-gray-400 hover:text-red-600 p-1 transition-all duration-200 hover:bg-red-50 rounded flex-shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Description */}
      {(todo.description || editMode) && (
        <div className="mb-3 ml-8">
          {editMode ? (
            <textarea
              value={updatedTodo.description || ''}
              onChange={(e) => setUpdatedTodo({ ...updatedTodo, description: e.target.value })}
              onClick={stopPropagation}
              className="w-full text-sm text-gray-600 border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 min-h-[60px] max-h-[120px]"
              rows={2}
              placeholder="Description..."
            />
          ) : (
            <p className="text-sm text-gray-600 line-clamp-2 break-words">
              {todo.description}
            </p>
          )}
        </div>
      )}

      {/* Tags */}
      {((todo.tags && todo.tags.length > 0) || editMode) && (
        <div className="mb-3 ml-8">
          <div className="flex flex-wrap gap-1 mb-2">
            {(editMode ? updatedTodo.tags : todo.tags || []).map((tag, index) => (
              <span 
                key={index} 
                className={`inline-flex items-center text-xs px-2 py-1 rounded-full font-medium transition-colors duration-200 ${getTagColor(tag)} max-w-full`}
              >
                <span className="truncate">{tag}</span>
                {editMode && (
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-current hover:text-red-600 transition-colors duration-200 flex-shrink-0"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </span>
            ))}
          </div>
          
          {editMode && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag(e)}
                onClick={stopPropagation}
                className="flex-1 min-w-0 text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                placeholder="Add tag..."
              />
              <button
                onClick={handleAddTag}
                className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-1 rounded transition-colors duration-200 flex-shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between ml-8 text-sm text-gray-500 gap-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
          {/* Due Date */}
          {(todo.dueDate || editMode) && (
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4 flex-shrink-0" />
              {editMode ? (
                <input
                  type="date"
                  value={updatedTodo.dueDate ? new Date(updatedTodo.dueDate).toISOString().split('T')[0] : ''}
                  onChange={(e) => setUpdatedTodo({ ...updatedTodo, dueDate: e.target.value })}
                  onClick={stopPropagation}
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 min-w-0"
                />
              ) : (
                <span className={`transition-colors duration-200 ${timeStatus.isOverdue ? 'text-red-600' : ''}`}>
                  {formatDate(todo.dueDate)}
                </span>
              )}
            </div>
          )}

          {/* Priority */}
          {(todo.priority || editMode) && (
            <div className="flex items-center gap-1">
              <Flag className={`w-4 h-4 flex-shrink-0 transition-colors duration-200 ${
                todo.priority === 'high' ? 'text-red-500' :
                todo.priority === 'medium' ? 'text-yellow-500' :
                'text-green-500'
              }`} />
              {editMode ? (
                <select
                  value={updatedTodo.priority || ''}
                  onChange={(e) => setUpdatedTodo({ ...updatedTodo, priority: e.target.value })}
                  onClick={stopPropagation}
                  className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 min-w-0"
                >
                  <option value="">None</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              ) : (
                <span className="capitalize">{todo.priority}</span>
              )}
            </div>
          )}
        </div>

        {/* Status message */}
        {timeStatus.message && (
          <span className={`text-xs px-2 py-1 rounded-full font-medium transition-colors duration-200 ${
            timeStatus.isOverdue ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
          } flex-shrink-0`}>
            {timeStatus.message}
          </span>
        )}
      </div>

      {/* Category */}
      {(todo.category || editMode) && (
        <div className="mt-2 ml-8">
          {editMode ? (
            <input
              value={updatedTodo.category || ''}
              onChange={(e) => setUpdatedTodo({ ...updatedTodo, category: e.target.value })}
              onClick={stopPropagation}
              className="w-full text-xs text-gray-600 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 min-w-0"
              placeholder="Category"
            />
          ) : (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {todo.category}
            </span>
          )}
        </div>
      )}

      {/* Save/Cancel */}
      {editMode && (
        <div className="flex flex-col sm:flex-row justify-end gap-2 mt-4 pt-3 border-t border-gray-200">
          <button
            onClick={handleCancel}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors duration-200 order-2 sm:order-1"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isUpdating || !updatedTodo.title.trim()}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors duration-200 order-1 sm:order-2"
          >
            {isUpdating ? 'Saving...' : 'Save'}
          </button>
        </div>
      )}
    </div>
  );
};

export default GridTodoItem;