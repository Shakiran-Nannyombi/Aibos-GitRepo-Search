import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from './components/navbar'
import { Hero } from './components/Hero'
import { Dashboard } from './components/Dashboard'
import { SavedRepos } from './components/SavedRepos'
import { Analytics } from './components/Analytics'
import { AuthCallback } from './components/AuthCallback'
import { Login } from './components/Login'
import { Signup } from './components/Signup'
import { Features } from './components/Features'
import { About } from './components/About'
import { Footer } from './components/Footer'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'

// Protected route wrapper for home page
function HomePage() {
  const { user, isAuthenticated } = useAuth();
  
  // If user is logged in, redirect to dashboard
  if (user || isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen transition-colors duration-300 flex flex-col bg-background text-foreground">
      <Navbar />
      <Hero />
      <Features />
      <Footer />
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
            
            {/* Dashboard - protected */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <div className="min-h-screen transition-colors duration-300 flex flex-col bg-background text-foreground">
                  <Dashboard />
                  <Footer />
                </div>
              </ProtectedRoute>
            } />
            
            {/* Saved Repos - protected */}
            <Route path="/saved" element={
              <ProtectedRoute>
                <div className="min-h-screen transition-colors duration-300 relative overflow-hidden bg-background text-foreground">
                  <div className="relative z-10 flex flex-col min-h-screen">
                    <Navbar />
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32 flex-grow">
                      <SavedRepos />
                    </main>
                    <Footer />
                  </div>
                </div>
              </ProtectedRoute>
            } />
            
            {/* Analytics - protected */}
            <Route path="/analytics" element={
              <ProtectedRoute>
                <div className="min-h-screen transition-colors duration-300 relative overflow-hidden bg-background text-foreground">
                  <div className="relative z-10 flex flex-col min-h-screen">
                    <Navbar />
                    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32 flex-grow">
                      <Analytics />
                    </main>
                    <Footer />
                  </div>
                </div>
              </ProtectedRoute>
            } />
            
            {/* Auth callback */}
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Local Auth */}
            <Route path="/login" element={
              <div className="min-h-screen transition-colors duration-300 flex flex-col bg-background text-foreground">
                <Navbar />
                <Login />
                <Footer />
              </div>
            } />
            <Route path="/register" element={
              <div className="min-h-screen transition-colors duration-300 flex flex-col bg-background text-foreground">
                <Navbar />
                <Signup />
                <Footer />
              </div>
            } />
            
            {/* About Page */}
            <Route path="/about" element={
              <div className="min-h-screen transition-colors duration-300 flex flex-col bg-background text-foreground">
                <Navbar />
                <About />
                <Footer />
              </div>
            } />
            
            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
