import React, { useState, useEffect } from 'react';
import { CheckCircle, Calendar, Flag, Tag, Folder, Plus, TrendingUp, ArrowRight, BarChart3, UserPlus, LogIn, Star, Shield, Users, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useGetTodosQuery } from '../services/todo';
import Loader from './Todos/Loader';

const Welcome = () => {
  const navigate = useNavigate();
  const { authUser } = useSelector(state => state.auth);
  const { data: todos, isLoading } = useGetTodosQuery();
  
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [hoveredStat, setHoveredStat] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const calculateStats = () => {
    if (!todos || todos.length === 0) {
      return {
        total: 0,
        completed: 0,
        inProgress: 0,
        overdue: 0
      };
    }

    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const completed = todos.filter(todo => todo.completed).length;
    const inProgress = todos.filter(todo => !todo.completed).length;
    const overdue = todos.filter(todo => {
      if (!todo.dueDate || todo.completed) return false;
      const dueDate = new Date(todo.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate < currentDate;
    }).length;

    return {
      total: todos.length,
      completed,
      inProgress,
      overdue
    };
  };

  const stats = calculateStats();

  const userFeatures = [
    {
      icon: CheckCircle,
      title: "Task Management",
      description: "Create, edit, and complete tasks with ease. Mark them as done when finished.",
      color: "green",
      delay: 0,
      action: () => navigate('/dashboard')
    },
    {
      icon: Calendar,
      title: "Due Dates",
      description: "Set deadlines for your tasks and never miss an important deadline again.",
      color: "blue",
      delay: 100,
      action: () => navigate('/calendar')
    },
    {
      icon: Flag,
      title: "Priorities",
      description: "Set high, medium, or low priorities to focus on what matters most.",
      color: "red",
      delay: 200,
      action: () => navigate('/dashboard')
    },
    {
      icon: Folder,
      title: "Categories",
      description: "Organize your todos into categories for better task management.",
      color: "purple",
      delay: 300,
      action: () => navigate('/dashboard')
    },
    {
      icon: Tag,
      title: "Tags",
      description: "Add tags to your todos for better organization and quick filtering.",
      color: "yellow",
      delay: 400,
      action: () => navigate('/dashboard')
    },
    {
      icon: TrendingUp,
      title: "Progress Tracking",
      description: "Monitor your productivity and track completed tasks over time.",
      color: "indigo",
      delay: 500,
      action: () => navigate('/analytics')
    }
  ];

  // Features for guests
  const guestFeatures = [
    {
      icon: CheckCircle,
      title: "Smart Task Management",
      description: "Organize your daily tasks with our intuitive interface. Create, edit, and track progress effortlessly.",
      color: "green",
      delay: 0,
      action: () => navigate('/signup')
    },
    {
      icon: Calendar,
      title: "Deadline Tracking",
      description: "Never miss important deadlines with our smart date management and notification system.",
      color: "blue",
      delay: 100,
      action: () => navigate('/signup')
    },
    {
      icon: Flag,
      title: "Priority System",
      description: "Focus on what matters most with our advanced priority management features.",
      color: "red",
      delay: 200,
      action: () => navigate('/signup')
    },
    {
      icon: TrendingUp,
      title: "Analytics & Insights",
      description: "Track your productivity trends and get insights into your work patterns.",
      color: "indigo",
      delay: 300,
      action: () => navigate('/signup')
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Share tasks and collaborate with your team members in real-time.",
      color: "purple",
      delay: 400,
      action: () => navigate('/signup')
    },
    {
      icon: Shield,
      title: "Secure & Reliable",
      description: "Your data is protected with enterprise-grade security and regular backups.",
      color: "gray",
      delay: 500,
      action: () => navigate('/signup')
    }
  ];

  const userQuickActions = [
    {
      title: "Create New Task",
      description: "Add a new todo to get started",
      action: () => navigate('/todos'),
      icon: Plus,
      color: "blue"
    },
    {
      title: "View Dashboard",
      description: "See all your pending tasks",
      action: () => navigate('/dashboard'),
      icon: BarChart3,
      color: "green"
    },
    {
      title: "Check History",
      description: "Review completed tasks",
      action: () => navigate('/completed'),
      icon: CheckCircle,
      color: "purple"
    }
  ];

  const guestQuickActions = [
    {
      title: "Sign Up Free",
      description: "Create your account and start organizing",
      action: () => navigate('/signup'),
      icon: UserPlus,
      color: "blue"
    },
    {
      title: "Sign In",
      description: "Access your existing account",
      action: () => navigate('/login'),
      icon: LogIn,
      color: "green"
    },
    {
      title: "Learn More",
      description: "Discover all features and benefits",
      action: () => navigate('/features'),
      icon: Star,
      color: "purple"
    }
  ];

  const quickStats = [
    { value: stats.total.toString(), label: "Total Tasks", color: "gray", action: () => navigate('/dashboard') },
    { value: stats.completed.toString(), label: "Completed", color: "green", action: () => navigate('/completed') },
    { value: stats.inProgress.toString(), label: "In Progress", color: "blue", action: () => navigate('/dashboard') },
    { value: stats.overdue.toString(), label: "Overdue", color: "red", action: () => navigate('/dashboard') }
  ];

  const guestStats = [
    { value: "10+", label: "Active Users", color: "blue" },
    { value: "95%", label: "Satisfaction Rate", color: "green" },
    { value: "24/7", label: "Support", color: "purple" },
    { value: "Free", label: "To Start", color: "gray" }
  ];

  if (isLoading && authUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600">
        <Loader />
        <p className="mt-4 text-lg">Loading your workspace...</p>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className={`text-center mb-8 transition-all duration-800 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors duration-300">
              Welcome to TaskMaster
            </h1>
            <p className="text-xl text-gray-600 transition-all duration-300 hover:text-gray-700">
              Your ultimate productivity companion for organizing and managing tasks
            </p>
          </div>

          <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8 transition-all duration-800 ease-out hover:shadow-xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '200ms' }}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 transition-colors duration-300 hover:text-blue-600">
              Join Thousands of Productive Users
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {guestStats.map((stat, index) => (
                <div
                  key={index}
                  className={`text-center p-4 bg-${stat.color}-50 rounded-lg transition-all duration-300 hover:bg-${stat.color}-100 hover:scale-105 cursor-pointer border border-${stat.color}-100 hover:border-${stat.color}-300`}
                  onMouseEnter={() => setHoveredStat(index)}
                  onMouseLeave={() => setHoveredStat(null)}
                >
                  <div className={`text-3xl font-bold text-${stat.color}-600 transition-all duration-300 ${hoveredStat === index ? 'scale-110' : ''}`}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600 transition-colors duration-300 hover:text-gray-700">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8 transition-all duration-800 ease-out hover:shadow-xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '300ms' }}>
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-blue-200 hover:scale-110">
                  <CheckCircle className="w-10 h-10 text-blue-600 transition-all duration-300 hover:scale-110" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 transition-colors duration-300 hover:text-blue-600">
                  Start Your Productivity Journey Today
                </h2>
                <p className="text-gray-600 max-w-md mx-auto transition-colors duration-300 hover:text-gray-700">
                  Join thousands of users who have transformed their productivity with our powerful task management platform.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {guestQuickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={action.action}
                      className={`group p-6 border-2 border-${action.color}-200 rounded-lg hover:border-${action.color}-400 transition-all duration-300 hover:shadow-md hover:-translate-y-1 text-left`}
                    >
                      <div className={`w-12 h-12 bg-${action.color}-100 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-${action.color}-200`}>
                        <Icon className={`w-6 h-6 text-${action.color}-600`} />
                      </div>
                      <h3 className={`font-semibold text-gray-900 mb-2 group-hover:text-${action.color}-600 transition-colors duration-300`}>
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                        {action.description}
                      </p>
                      <ArrowRight className="w-4 h-4 text-gray-400 mt-2 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {guestFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`bg-white shadow-md border border-gray-100 rounded-xl p-6 transition-all duration-500 ease-out hover:shadow-lg hover:-translate-y-2 hover:border-${feature.color}-200 cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                  style={{ 
                    transitionDelay: `${400 + feature.delay}ms`,
                  }}
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  onClick={feature.action}
                >
                  <div className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 ${hoveredFeature === index ? `bg-${feature.color}-200 scale-110` : ''}`}>
                    <Icon className={`w-6 h-6 text-${feature.color}-600 transition-all duration-300 ${hoveredFeature === index ? 'scale-110' : ''}`} />
                  </div>
                  <h3 className={`text-lg font-semibold text-gray-900 mb-2 transition-colors duration-300 ${hoveredFeature === index ? `text-${feature.color}-600` : ''}`}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm transition-colors duration-300 hover:text-gray-700">
                    {feature.description}
                  </p>
                  
                  <div className="mt-4 h-0.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-${feature.color}-400 rounded-full transition-all duration-500 ease-out ${hoveredFeature === index ? 'w-full' : 'w-0'}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition-all duration-800 ease-out hover:shadow-xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '900ms' }}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 transition-colors duration-300 hover:text-blue-600">
              How It Works
            </h3>
            <div className="space-y-3">
              {[
                "Sign up for free in less than 30 seconds",
                "Create your first task and set priorities",
                "Organize tasks with categories and tags",
                "Track your progress and boost productivity"
              ].map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 text-sm p-3 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:translate-x-2 cursor-pointer ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                  style={{ transitionDelay: `${1000 + index * 100}ms` }}
                >
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:bg-blue-200 hover:scale-110">
                    <span className="text-blue-600 font-semibold text-xs">{index + 1}</span>
                  </div>
                  <span className="text-gray-700 transition-colors duration-300 hover:text-blue-600">
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className={`text-center mb-8 transition-all duration-800 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors duration-300">
            Welcome back, {authUser?.name || 'User'}!
          </h1>
          <p className="text-xl text-gray-600 transition-all duration-300 hover:text-gray-700">
            {stats.total === 0 
              ? "Ready to start organizing your tasks?" 
              : `You have ${stats.inProgress} pending tasks to complete`
            }
          </p>
        </div>

        <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-8 transition-all duration-800 ease-out hover:shadow-xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '200ms' }}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 transition-colors duration-300 hover:text-blue-600">
            Your Progress Overview
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickStats.map((stat, index) => (
              <div
                key={index}
                className={`text-center p-4 bg-${stat.color}-50 rounded-lg transition-all duration-300 hover:bg-${stat.color}-100 hover:scale-105 cursor-pointer border border-${stat.color}-100 hover:border-${stat.color}-300`}
                onMouseEnter={() => setHoveredStat(index)}
                onMouseLeave={() => setHoveredStat(null)}
                onClick={stat.action}
              >
                <div className={`text-3xl font-bold text-${stat.color}-600 transition-all duration-300 ${hoveredStat === index ? 'scale-110' : ''}`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 transition-colors duration-300 hover:text-gray-700">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {stats.total === 0 && (
          <div className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8 transition-all duration-800 ease-out hover:shadow-xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '300ms' }}>
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-blue-200 hover:scale-110">
                  <CheckCircle className="w-10 h-10 text-blue-600 transition-all duration-300 hover:scale-110" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2 transition-colors duration-300 hover:text-blue-600">
                  Get Started with Your First Task
                </h2>
                <p className="text-gray-600 max-w-md mx-auto transition-colors duration-300 hover:text-gray-700">
                  Create, organize, and track your todos with our simple and intuitive interface.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {userQuickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <button
                      key={index}
                      onClick={action.action}
                      className={`group p-6 border-2 border-${action.color}-200 rounded-lg hover:border-${action.color}-400 transition-all duration-300 hover:shadow-md hover:-translate-y-1 text-left`}
                    >
                      <div className={`w-12 h-12 bg-${action.color}-100 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 group-hover:bg-${action.color}-200`}>
                        <Icon className={`w-6 h-6 text-${action.color}-600`} />
                      </div>
                      <h3 className={`font-semibold text-gray-900 mb-2 group-hover:text-${action.color}-600 transition-colors duration-300`}>
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                        {action.description}
                      </p>
                      <ArrowRight className="w-4 h-4 text-gray-400 mt-2 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-300" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {userFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className={`bg-white shadow-md border border-gray-100 rounded-xl p-6 transition-all duration-500 ease-out hover:shadow-lg hover:-translate-y-2 hover:border-${feature.color}-200 cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                style={{ 
                  transitionDelay: `${400 + feature.delay}ms`,
                }}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
                onClick={feature.action}
              >
                <div className={`w-12 h-12 bg-${feature.color}-100 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 ${hoveredFeature === index ? `bg-${feature.color}-200 scale-110` : ''}`}>
                  <Icon className={`w-6 h-6 text-${feature.color}-600 transition-all duration-300 ${hoveredFeature === index ? 'scale-110' : ''}`} />
                </div>
                <h3 className={`text-lg font-semibold text-gray-900 mb-2 transition-colors duration-300 ${hoveredFeature === index ? `text-${feature.color}-600` : ''}`}>
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm transition-colors duration-300 hover:text-gray-700">
                  {feature.description}
                </p>
                
                <div className="mt-4 h-0.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-${feature.color}-400 rounded-full transition-all duration-500 ease-out ${hoveredFeature === index ? 'w-full' : 'w-0'}`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 transition-all duration-800 ease-out hover:shadow-xl ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '900ms' }}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 transition-colors duration-300 hover:text-blue-600">
            {stats.total === 0 ? 'Quick Start Guide' : 'Tips for Better Productivity'}
          </h3>
          <div className="space-y-3">
            {stats.total === 0 ? [
              "Click \"Add New Task\" to create your first todo",
              "Add a description, set priority, due date, and category",
              "Use the dashboard to view and manage your tasks",
              "Mark tasks as complete when finished"
            ] : [
              "Use the dashboard to see overdue tasks first",
              "Set priorities to focus on important tasks",
              "Check your analytics to track productivity",
              "Review completed tasks in your history"
            ].map((step, index) => (
              <div
                key={index}
                className={`flex items-center space-x-3 text-sm p-3 rounded-lg transition-all duration-300 hover:bg-blue-50 hover:translate-x-2 cursor-pointer ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                style={{ transitionDelay: `${1000 + index * 100}ms` }}
              >
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:bg-blue-200 hover:scale-110">
                  <span className="text-blue-600 font-semibold text-xs">{index + 1}</span>
                </div>
                <span className="text-gray-700 transition-colors duration-300 hover:text-blue-600">
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;