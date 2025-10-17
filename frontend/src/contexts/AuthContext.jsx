import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/User'; // Import User type

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // User type can be inferred
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored auth token
    const token = localStorage.getItem('github_token');
    const storedUser = localStorage.getItem('github_user');

    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('github_user');
      }
    }
  }, []);

  const login = () => {
    // Redirect to backend OAuth endpoint
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    window.location.href = `${backendUrl}/auth/github`;
  };

  const logout = () => {
    localStorage.removeItem('github_token');
    localStorage.removeItem('github_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

/**
 * @typedef {Object} AuthProviderProps
 * @property {React.ReactNode} children
 */

/**
 * @param {AuthProviderProps} props
 */
export function AuthProvider({ children }) {
  // ... existing code ...
}
