import './App.css'
import { Navbar } from './components/navbar'
import { Hero } from './components/Hero'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors duration-300">
          <Navbar />
          <Hero />
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
