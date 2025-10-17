import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { useLocation } from 'react-router-dom';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Repositories', href: '/repositories' },
  { label: 'Search', href: '/search' },
];

export function Navbar() {
  const { user, logout, login } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme } = useTheme();
  const location = useLocation();
  
  // Show nav links only when user is logged in and not on home page
  const showNavLinks = user && location.pathname !== '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50 pt-4 pb-2">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`rounded-full shadow-lg border transition-all duration-300 ${
          isScrolled 
            ? 'bg-gray-100 dark:bg-gray-900 border-gray-300 dark:border-gray-700 backdrop-blur-sm' 
            : 'bg-transparent border-transparent'
        }`}>
          <div className="flex items-center justify-between h-16 px-6">
          {/* Logo */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <img
              src={theme === 'dark' ? '/logoLight.svg' : '/logoDark.svg'}
              alt="GitHub Repository Search"
              className="w-10 h-10"
            />
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Lens+Github
            </span>
          </div>

          {/* Center Navigation Links - Only show when logged in */}
          {showNavLinks && (
            <div className="hidden md:flex items-center gap-1 flex-1 justify-center px-8">
              <a
                href="/repositories"
                className="px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-800 hover:text-white dark:hover:bg-gray-200 dark:hover:text-gray-900 transition-colors rounded-full"
              >
                Repositories
              </a>
              <a
                href="/search"
                className="px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-800 hover:text-white dark:hover:bg-gray-200 dark:hover:text-gray-900 transition-colors rounded-full"
              >
                Search
              </a>
            </div>
          )}
          
          {/* Spacer when no nav links */}
          {!showNavLinks && <div className="flex-1" />}

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Theme Toggle */}
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            
            {/* Sign In / User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-3 py-2 rounded-full border border-gray-300 dark:border-gray-600 hover:bg-gray-800 hover:text-white dark:hover:bg-gray-200 dark:hover:text-gray-900 transition-all"
                >
                  <img
                    src={user?.avatar_url}
                    alt={user?.login}
                    className="w-6 h-6 rounded-full"
                  />
                  <span className="text-sm font-medium">{user?.login}</span>
                </button>

                {showDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-gray-50 dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 rounded-2xl z-20 overflow-hidden">
                      <div className="p-4 border-b-2 border-gray-300 dark:border-gray-600">
                        <p className="font-bold text-gray-900 dark:text-gray-100">
                          {user?.name || user?.login}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          @{user?.login}
                        </p>
                      </div>
                      <div className="p-2">
                        <a
                          href={`https://github.com/${user?.login}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-3 py-2.5 rounded-lg hover:bg-gray-800 hover:text-white dark:hover:bg-gray-200 dark:hover:text-gray-900 transition-colors text-gray-900 dark:text-gray-100 font-medium"
                        >
                          View Profile
                        </a>
                        <button
                          onClick={() => {
                            logout();
                            setShowDropdown(false);
                          }}
                          className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-800 hover:text-white dark:hover:bg-gray-200 dark:hover:text-gray-900 transition-colors text-gray-900 dark:text-gray-100 font-medium"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button 
                onClick={login}
                className="px-4 py-2 rounded-full text-sm font-semibold text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 hover:bg-gray-800 hover:text-white dark:hover:bg-gray-200 dark:hover:text-gray-900 transition-colors"
              >
                Sign in
              </button>
            )}

            {/* CTA Button - Only show when not logged in */}
            {!user && (
              <button 
                onClick={login}
                className="px-5 py-2 rounded-full bg-gray-800 text-white dark:bg-gray-200 dark:text-gray-900 text-sm font-bold border-2 border-gray-800 dark:border-gray-200 hover:bg-gray-900 dark:hover:bg-gray-300 transition-all"
              >
                Get Started
              </button>
            )}
          </div>
          </div>
        </div>
      </nav>
    </div>
  );
}