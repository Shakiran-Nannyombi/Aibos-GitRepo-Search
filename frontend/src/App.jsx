import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from './components/navbar'
import { Hero } from './components/Hero'
import { Dashboard } from './components/Dashboard'
import { SavedRepos } from './components/SavedRepos'
import { Analytics } from './components/Analytics'
import { AuthCallback } from './components/AuthCallback'
import { QuickActions } from './components/QuickActions'
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
            
            {/* Saved Repos */}
            <Route path="/saved" element={
              <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300 relative overflow-hidden">
                {/* Animated background grid */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `
                      linear-gradient(to right, currentColor 1px, transparent 1px),
                      linear-gradient(to bottom, currentColor 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                    color: 'currentColor'
                  }} />
                </div>
                
                <div className="relative z-10">
                  <Navbar noBorder={true} />
                  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
                    <SavedRepos />
                  </main>
                </div>
              </div>
            } />
            
            {/* Analytics */}
            <Route path="/analytics" element={
              <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300 relative overflow-hidden">
                {/* Animated background grid */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `
                      linear-gradient(to right, currentColor 1px, transparent 1px),
                      linear-gradient(to bottom, currentColor 1px, transparent 1px)
                    `,
                    backgroundSize: '50px 50px',
                    color: 'currentColor'
                  }} />
                </div>
                
                <div className="relative z-10">
                  <Navbar noBorder={true} />
                  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
                    <Analytics />
                  </main>
                </div>
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
