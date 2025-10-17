import { Github, LogOut, User, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from './ThemeToggle';

export function Navbar() {
  const { user, logout, login } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="sticky top-0 z-50 pt-4 pb-2 bg-gradient-to-b from-gray-200 via-gray-100 to-transparent dark:from-gray-800 dark:via-gray-900">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-gray-900 rounded-full shadow-lg border border-gray-300 dark:border-gray-700 backdrop-blur-sm">
          <div className="flex items-center justify-between h-14 px-6">
            {/* Logo */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 bg-gradient-to-br from-gray-600 to-gray-800 dark:from-gray-700 dark:to-gray-900 rounded-full flex items-center justify-center">
                <Github className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                RepoScope
              </span>
            </div>

            {/* Center Navigation Links */}
            <div className="hidden md:flex items-center gap-1 flex-1 justify-center px-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-400 transition-colors rounded-full hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown className="w-4 h-4" />}
                </a>
              ))}
            </div>

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
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all"
                  >
                    <img
                      src={user?.avatar_url}
                      alt={user?.login}
                      className="w-7 h-7 rounded-full ring-2 ring-gray-500/20"
                    />
                  </button>

                  {showDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowDropdown(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-300 dark:border-gray-700 z-20 overflow-hidden">
                        <div className="p-4 border-b border-gray-300 dark:border-gray-700">
                          <p className="font-semibold text-gray-900 dark:text-white">
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
                            className="flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors text-gray-700 dark:text-gray-300"
                          >
                            <User className="w-4 h-4" />
                            View Profile
                          </a>
                          <button
                            onClick={() => {
                              logout();
                              setShowDropdown(false);
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-600 dark:text-red-400"
                          >
                            <LogOut className="w-4 h-4" />
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
                  className="px-4 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
                >
                  Sign in
                </button>
              )}

              {/* CTA Button */}
              <button 
                onClick={login}
                className="px-5 py-1.5 bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white text-sm font-semibold rounded-full shadow-md hover:shadow-lg transition-all transform hover:scale-105"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}