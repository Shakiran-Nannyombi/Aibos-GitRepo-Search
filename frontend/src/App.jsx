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

// Shared frame for every page: fixed navbar, centered content column, footer.
function PageShell({ children, bare = false }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      {bare ? (
        children
      ) : (
        <main className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 flex-grow">
          {children}
        </main>
      )}
      <Footer />
    </div>
  );
}

// Signed-in visitors skip the landing page.
function HomePage() {
  const { user, isAuthenticated } = useAuth();

  if (user || isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <PageShell bare>
      <main className="flex-grow">
        <Hero />
        <Features />
      </main>
    </PageShell>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <PageShell><Dashboard /></PageShell>
              </ProtectedRoute>
            } />

            <Route path="/saved" element={
              <ProtectedRoute>
                <PageShell><SavedRepos /></PageShell>
              </ProtectedRoute>
            } />

            <Route path="/analytics" element={
              <ProtectedRoute>
                <PageShell><Analytics /></PageShell>
              </ProtectedRoute>
            } />

            <Route path="/auth/callback" element={<AuthCallback />} />

            <Route path="/login" element={<PageShell><Login /></PageShell>} />
            <Route path="/register" element={<PageShell><Signup /></PageShell>} />
            <Route path="/about" element={<PageShell><About /></PageShell>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
