import { useState, useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Area, AreaChart
} from 'recharts';
import { 
  Calendar, CheckCircle, TrendingUp, Target, AlertTriangle,
  Award, Activity, Download
} from 'lucide-react';
import { useGetTodosQuery } from '../../services/todo';
import Loader from './Loader';

const Analytics = () => {
  const { data: todos, isLoading, error } = useGetTodosQuery();
  const [timeRange, setTimeRange] = useState('30'); 
  const [selectedMetric, setSelectedMetric] = useState('completion');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Failed to load analytics data.
      </div>
    );
  }

  const analytics = useMemo(() => {
    if (!todos || todos.length === 0) return null;

    const now = new Date();
    const daysAgo = new Date(now - parseInt(timeRange) * 24 * 60 * 60 * 1000);

    // Filter todos by time range
    const filteredTodos = todos.filter(todo => {
      const createdDate = new Date(todo.createdAt || todo.created_at);
      return createdDate >= daysAgo;
    });

    // Basic stats
    const totalTasks = filteredTodos.length;
    const completedTasks = filteredTodos.filter(todo => todo.completed).length;
    const overdueTasks = filteredTodos.filter(todo => {
      if (!todo.dueDate || todo.completed) return false;
      return new Date(todo.dueDate) < now;
    }).length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks * 100).toFixed(1) : 0;

    // Priority distribution
    const priorityStats = filteredTodos.reduce((acc, todo) => {
      const priority = todo.priority || 'low';
      acc[priority] = (acc[priority] || 0) + 1;
      return acc;
    }, {});

    const priorityData = Object.entries(priorityStats).map(([priority, count]) => ({
      name: priority.charAt(0).toUpperCase() + priority.slice(1),
      value: count,
      color: priority === 'high' ? '#EF4444' : priority === 'medium' ? '#F59E0B' : '#10B981'
    }));

    // Category distribution
    const categoryStats = filteredTodos.reduce((acc, todo) => {
      const category = todo.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const categoryData = Object.entries(categoryStats).map(([category, count]) => ({
      name: category,
      value: count
    }));

    // Daily completion trend (last 7 days)
    const dailyCompletions = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.setHours(0, 0, 0, 0));
      const dayEnd = new Date(date.setHours(23, 59, 59, 999));
      
      const dayCompletions = filteredTodos.filter(todo => {
        if (!todo.completed) return false;
        const completedDate = new Date(todo.completedAt || todo.updatedAt);
        return completedDate >= dayStart && completedDate <= dayEnd;
      }).length;

      dailyCompletions.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed: dayCompletions
      });
    }

    // Monthly trend
    const monthlyData = [];
    const monthsToShow = Math.min(6, Math.ceil(parseInt(timeRange) / 30));
    
    for (let i = monthsToShow - 1; i >= 0; i--) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthTodos = todos.filter(todo => {
        const createdDate = new Date(todo.createdAt || todo.created_at);
        return createdDate >= monthStart && createdDate <= monthEnd;
      });

      const monthCompleted = monthTodos.filter(todo => todo.completed).length;
      
      monthlyData.push({
        month: monthStart.toLocaleDateString('en-US', { month: 'short' }),
        created: monthTodos.length,
        completed: monthCompleted
      });
    }

    // Productivity score (0-100)
    const productivityScore = Math.round(
      (completionRate * 0.5) + 
      (totalTasks > 0 ? Math.min(totalTasks / 10, 1) * 25 : 0) + 
      (overdueTasks === 0 ? 25 : Math.max(0, 25 - overdueTasks * 5))
    );

    return {
      totalTasks,
      completedTasks,
      overdueTasks,
      completionRate,
      priorityData,
      categoryData,
      dailyCompletions,
      monthlyData,
      productivityScore
    };
  }, [todos, timeRange]);

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <Activity className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Data Available</h2>
            <p className="text-gray-600">Create some tasks to see your analytics.</p>
          </div>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color = "blue", subtitle }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-bold text-${color}-600 mt-1`}>{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 bg-${color}-50 rounded-lg`}>
          <Icon className={`w-6 h-6 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p className="text-gray-600 mt-1">Track your productivity and task completion patterns</p>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Tasks"
            value={analytics.totalTasks}
            icon={Calendar}
            color="blue"
          />
          <StatCard
            title="Completed"
            value={analytics.completedTasks}
            icon={CheckCircle}
            color="green"
            subtitle={`${analytics.completionRate}% completion rate`}
          />
          <StatCard
            title="Overdue"
            value={analytics.overdueTasks}
            icon={AlertTriangle}
            color="red"
          />
          <StatCard
            title="Productivity Score"
            value={`${analytics.productivityScore}/100`}
            icon={Award}
            color="purple"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Completion Trend</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.dailyCompletions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="completed" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="created" fill="#94A3B8" name="Created" />
                <Bar dataKey="completed" fill="#10B981" name="Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.categoryData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">Productivity</span>
              </div>
              <p className="text-sm text-blue-700">
                {analytics.completionRate >= 70 
                  ? "Great job! You're maintaining high productivity." 
                  : "Consider breaking down large tasks into smaller ones."}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">Goals</span>
              </div>
              <p className="text-sm text-green-700">
                {analytics.overdueTasks === 0 
                  ? "Excellent! No overdue tasks." 
                  : `You have ${analytics.overdueTasks} overdue tasks. Focus on deadlines.`}
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="w-5 h-5 text-purple-600" />
                <span className="font-medium text-purple-900">Pattern</span>
              </div>
              <p className="text-sm text-purple-700">
                {analytics.dailyCompletions.reduce((sum, day) => sum + day.completed, 0) > 0
                  ? "You're consistently completing tasks daily."
                  : "Try to complete at least one task daily for better momentum."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;