import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';

export function ProtectedRoute({ children }) {
  const { user, isAuthenticated } = useAuth();
  
  // You might want to add a loading state check here if your AuthContext has one
  // For example: if (isLoading) return <LoadingSpinner />;

  // If not authenticated, redirect to home
  if (!user && !isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
