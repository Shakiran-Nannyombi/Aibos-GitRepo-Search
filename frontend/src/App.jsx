import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from './components/navbar'
import { Hero } from './components/Hero'
import { Dashboard } from './components/Dashboard'
import { AuthCallback } from './components/AuthCallback'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'

// Protected route wrapper for home page
function HomePage() {
  const { user, isAuthenticated } = useAuth();
  
  // If user is logged in, redirect to dashboard
  if (user || isAuthenticated) {
    console.log('User is logged in, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
      <Navbar />
      <Hero />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Home page - redirects to dashboard if logged in */}
            <Route path="/" element={<HomePage />} />
            
            {/* Dashboard - already includes its own Navbar */}
            <Route path="/dashboard" element={
              <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
                <Dashboard />
              </div>
            } />
            
            {/* Auth callback */}
            <Route path="/auth/callback" element={<AuthCallback />} />
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
