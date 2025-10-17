import React, { createContext, useContext, useState, useEffect } from 'react';

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
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        console.log('User restored from localStorage:', parsedUser);
      } catch {
        localStorage.removeItem('github_user');
        localStorage.removeItem('github_token');
      }
    }
  }, []);

  // Update isAuthenticated when user changes
  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

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
    // Redirect to home page after logout
    window.location.href = '/';
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
