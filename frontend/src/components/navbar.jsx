import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Menu, X } from 'lucide-react';

export function Navbar({ isHidden = false }) {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  
  const mobileMenuRef = useRef(null);
  const menuItemsRef = useRef([]);
  const tl = useRef(null);

  // Show nav links only when user is logged in and not on home page
  const showNavLinks = user && location.pathname !== '/';

  useEffect(() => {
    // Re-initialize timeline when user state changes
    if (tl.current) tl.current.kill();
    
    tl.current = gsap.timeline({ paused: true });
    
    tl.current.set(mobileMenuRef.current, { display: 'flex' });
    tl.current.to(mobileMenuRef.current, {
      duration: 0.5,
      x: '0%',
      ease: 'power3.inOut'
    });
    
    if (menuItemsRef.current.length > 0) {
      tl.current.from(menuItemsRef.current, {
        duration: 0.4,
        y: 40,
        opacity: 0,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'all'
      }, '-=0.2');
    }

  }, [user]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      tl.current.play();
      document.body.style.overflow = 'hidden';
    } else {
      tl.current.reverse();
      document.body.style.overflow = 'auto';
    }
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  if (isHidden) {
    return null;
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const addToRefs = (el) => {
    if (el && !menuItemsRef.current.includes(el)) {
      menuItemsRef.current.push(el);
    }
  };

  // Clear refs on every render to ensure we only have current elements
  menuItemsRef.current = [];


  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-50 pt-4 pb-2`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`rounded-full shadow-lg transition-all duration-300 border border-white/20 dark:border-white/10 bg-header/90 backdrop-blur-xl relative overflow-hidden group`}>
            {/* Subtle gradient glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            <div className="flex items-center justify-between h-16 px-6 relative z-10">
            {/* Logo */}
            <div className="flex items-center gap-3 flex-shrink-0 z-50">
              <a href="/" className="flex items-center gap-3">
                <img
                  src={theme === 'dark' ? '/logoLight.svg' : '/logoDark.svg'}
                  alt="GitHub Repository Search"
                  className="w-10 h-10"
                />
                <span className="text-xl font-bold text-foreground">
                  Lens+Github
                </span>
              </a>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center gap-1 flex-1 justify-center px-8 text-foreground font-medium">
              {!user && (
                <>
                  <a
                    href="/"
                    className={`px-3 py-2 text-sm transition-all relative after:absolute after:bottom-1 after:left-3 after:right-3 after:h-0.5 after:bg-accent after:transition-transform after:duration-300 ${
                      location.pathname === '/' ? 'text-accent after:scale-x-100' : 'hover:text-accent after:scale-x-0 hover:after:scale-x-100'
                    }`}
                  >
                    Home
                  </a>
                  <a
                    href="/about"
                    className={`px-3 py-2 text-sm transition-all relative after:absolute after:bottom-1 after:left-3 after:right-3 after:h-0.5 after:bg-accent after:transition-transform after:duration-300 ${
                      location.pathname === '/about' ? 'text-accent after:scale-x-100' : 'hover:text-accent after:scale-x-0 hover:after:scale-x-100'
                    }`}
                  >
                    About
                  </a>
                </>
              )}
              
              {showNavLinks && (
                <>
                  <a
                    href="/dashboard"
                    className={`px-3 py-2 text-sm transition-all relative after:absolute after:bottom-1 after:left-3 after:right-3 after:h-0.5 after:bg-accent after:transition-transform after:duration-300 ${
                      location.pathname === '/dashboard' ? 'text-accent after:scale-x-100' : 'hover:text-accent after:scale-x-0 hover:after:scale-x-100'
                    }`}
                  >
                    Search
                  </a>
                  <a
                    href="/saved"
                    className={`px-3 py-2 text-sm transition-all relative after:absolute after:bottom-1 after:left-3 after:right-3 after:h-0.5 after:bg-accent after:transition-transform after:duration-300 ${
                      location.pathname === '/saved' ? 'text-accent after:scale-x-100' : 'hover:text-accent after:scale-x-0 hover:after:scale-x-100'
                    }`}
                  >
                    Saved
                  </a>
                  <a
                    href="/analytics"
                    className={`px-3 py-2 text-sm transition-all relative after:absolute after:bottom-1 after:left-3 after:right-3 after:h-0.5 after:bg-accent after:transition-transform after:duration-300 ${
                      location.pathname === '/analytics' ? 'text-accent after:scale-x-100' : 'hover:text-accent after:scale-x-0 hover:after:scale-x-100'
                    }`}
                  >
                    Analytics
                  </a>
                </>
              )}
            </div>
            

            {/* Right Side Actions (Desktop) */}
            <div className="hidden md:flex items-center gap-3 flex-shrink-0">
              {/* Logout Button - Only show when logged in */}
              {user && (
                <button
                  onClick={logout}
                  className="px-4 py-2 rounded-full transition-all duration-300 font-medium text-muted hover:text-foreground"
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
                    className="flex items-center gap-2 px-3 py-2 rounded-full border border-border hover:bg-border/50 transition-all text-foreground"
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
                      <div className="absolute right-0 mt-2 w-56 bg-header border border-border rounded-xl shadow-xl z-20 overflow-hidden">
                        <div className="p-4 border-b border-border">
                          <p className="font-bold text-foreground">
                            {user?.name || user?.login}
                          </p>
                          <p className="text-sm text-muted">
                            @{user?.login}
                          </p>
                        </div>
                        <div className="p-2">
                          <a
                            href={`https://github.com/${user?.login}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block px-3 py-2.5 rounded-lg hover:bg-border/50 transition-colors text-foreground font-medium"
                          >
                            View Profile
                          </a>
                          <a
                            href="/analytics"
                            onClick={() => setShowDropdown(false)}
                            className="block px-3 py-2.5 rounded-lg hover:bg-border/50 transition-colors text-foreground font-medium"
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
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 rounded-full text-sm font-semibold text-foreground border border-border hover:bg-border/50 transition-colors"
                >
                  Sign in
                </button>
              )}

              {/* CTA Button - Only show when not logged in */}
              {!user && (
                <button 
                  onClick={() => navigate('/login')}
                  className="px-5 py-2 rounded-full bg-foreground text-background text-sm font-bold border border-foreground hover:opacity-90 transition-all"
                >
                  Get Started
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex md:hidden items-center z-50">
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-foreground focus:outline-none"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Fullscreen Mobile Menu Overlay */}
      <div
        ref={mobileMenuRef}
        className="fixed inset-0 z-40 bg-background flex flex-col items-center justify-center"
        style={{ transform: 'translateX(100%)', display: 'none' }}
      >
        <div className="flex flex-col items-center gap-8 text-2xl font-bold">
          {!user && (
            <>
              <a href="/" ref={addToRefs} className="text-foreground hover:text-accent transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </a>
              <a href="/about" ref={addToRefs} className="text-foreground hover:text-accent transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                About
              </a>
            </>
          )}
          
          {user && (
            <>
              <a href="/dashboard" ref={addToRefs} className="text-foreground hover:text-accent transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                Search
              </a>
              <a href="/saved" ref={addToRefs} className="text-foreground hover:text-accent transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                Saved Repos
              </a>
              <a href="/analytics" ref={addToRefs} className="text-foreground hover:text-accent transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                Analytics
              </a>
            </>
          )}
          
          <div ref={addToRefs} className="w-16 h-px bg-border my-2" />

          {!user ? (
            <button
              ref={addToRefs}
              onClick={() => { navigate('/login'); setIsMobileMenuOpen(false); }}
              className="text-foreground hover:text-accent transition-colors"
            >
              Sign In
            </button>
          ) : (
             <button
              ref={addToRefs}
              onClick={() => { logout(); setIsMobileMenuOpen(false); }}
              className="text-foreground hover:text-accent transition-colors"
            >
              Sign Out
            </button>
          )}
          
          <div ref={addToRefs} className="mt-4">
             <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  );
}