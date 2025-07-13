import { useGetTodosQuery } from '../../services/todo';
import Analytics from './Analytics'; 
import Loader from './Loader';

const TodoAnalytics = () => {
  const { data: todos, error, isLoading } = useGetTodosQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-600 text-xl">
        <Loader />
        Loading analytics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">
        Failed to load analytics data.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Analytics todos={todos || []} />
      </div>
    </div>
  );
};

export default TodoAnalytics;
