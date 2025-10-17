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

export function Navbar({ noBorder = false }) {
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
    <div className="fixed top-0 left-0 right-0 z-50 pt-4 pb-2 bg-white dark:bg-black">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`rounded-full shadow-lg transition-all duration-300 ${
          noBorder 
            ? 'bg-white dark:bg-black' 
            : isScrolled 
              ? 'bg-gray-100 dark:bg-gray-900 border-2 border-gray-300 dark:border-gray-700' 
              : 'bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800'
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
                href="/dashboard"
                className="px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-800 hover:text-white dark:hover:bg-gray-200 dark:hover:text-gray-900 transition-colors rounded-full"
              >
                Search
              </a>
              <a
                href="/saved"
                className="px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-800 hover:text-white dark:hover:bg-gray-200 dark:hover:text-gray-900 transition-colors rounded-full"
              >
                Saved
              </a>
              <a
                href="/analytics"
                className="px-4 py-2 text-sm font-semibold text-gray-900 dark:text-gray-100 hover:bg-gray-800 hover:text-white dark:hover:bg-gray-200 dark:hover:text-gray-900 transition-colors rounded-full"
              >
                Analytics
              </a>
            </div>
          )}
          
          {/* Spacer when no nav links */}
          {!showNavLinks && <div className="flex-1" />}

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Logout Button - Only show when logged in */}
            {user && (
              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 rounded-full
                         bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400
                         border-2 border-red-200 dark:border-red-800
                         hover:bg-red-100 dark:hover:bg-red-950/50
                         hover:border-red-300 dark:hover:border-red-700
                         transition-all font-semibold text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden md:inline">Sign Out</span>
              </button>
            )}
            
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
                        <a
                          href="/analytics"
                          onClick={() => setShowDropdown(false)}
                          className="block px-3 py-2.5 rounded-lg hover:bg-gray-800 hover:text-white dark:hover:bg-gray-200 dark:hover:text-gray-900 transition-colors text-gray-900 dark:text-gray-100 font-medium"
                        >
                          Analytics
                        </a>
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