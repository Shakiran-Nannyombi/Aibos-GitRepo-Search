import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Menu, X, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { ThemeToggle } from './ThemeToggle';

const publicLinks = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
];

const appLinks = [
  { to: '/dashboard', label: 'Search' },
  { to: '/saved', label: 'Saved' },
  { to: '/analytics', label: 'Analytics' },
];

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export function Navbar({ isHidden = false }) {
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mobileMenuRef = useRef(null);
  const tl = useRef(null);
  const dropdownRef = useRef(null);

  const links = user ? appLinks : publicLinks;

  // Mobile menu slide-in; skipped entirely when the visitor prefers reduced motion.
  useEffect(() => {
    const menu = mobileMenuRef.current;
    if (!menu) return;
    tl.current?.kill();
    tl.current = gsap.timeline({ paused: true });
    tl.current.set(menu, { display: 'flex' });
    tl.current.to(menu, { duration: prefersReducedMotion() ? 0 : 0.4, x: '0%', ease: 'power3.inOut' });
    tl.current.from(menu.querySelectorAll('[data-menu-item]'), {
      duration: prefersReducedMotion() ? 0 : 0.3,
      y: 24,
      opacity: 0,
      stagger: 0.06,
      ease: 'power3.out',
      clearProps: 'all',
    }, '-=0.15');
    return () => tl.current?.kill();
  }, [user]);

  useEffect(() => {
    if (!tl.current) return;
    if (isMobileMenuOpen) {
      tl.current.play();
      document.body.style.overflow = 'hidden';
    } else {
      tl.current.reverse();
      document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen]);

  // Close menus on navigation.
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowDropdown(false);
  }, [location.pathname]);

  // Escape closes whichever menu is open; outside click closes the dropdown.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setShowDropdown(false);
        setIsMobileMenuOpen(false);
      }
    };
    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, []);

  if (isHidden) return null;

  const linkClass = ({ isActive }) =>
    `relative px-3 py-1.5 text-[15px] font-medium rounded-[var(--radius-control)] transition-colors ${
      isActive ? 'text-foreground bg-background' : 'text-muted hover:text-foreground'
    }`;

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 px-3 sm:px-4 pt-3">
        <nav
          aria-label="Main"
          className="max-w-6xl mx-auto h-14 flex items-center gap-4 px-3 sm:px-4 rounded-[var(--radius-panel)] border border-border bg-surface/85 backdrop-blur-xl shadow-[var(--shadow-float)]"
        >
          <Link to="/" className="flex items-center gap-2.5 shrink-0 rounded-[var(--radius-control)]">
            <img
              src={theme === 'dark' ? '/logoLight.svg' : '/logoDark.svg'}
              alt=""
              className="w-8 h-8"
            />
            <span className="text-[17px] font-bold tracking-tight text-foreground">Lens+Github</span>
          </Link>

          <div className="hidden md:flex items-center gap-1 ml-4">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
                {l.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2 ml-auto">
            <ThemeToggle />
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown((v) => !v)}
                  aria-expanded={showDropdown}
                  aria-haspopup="menu"
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 rounded-[var(--radius-control)] border border-border text-foreground hover:bg-background transition-colors"
                >
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt="" className="w-6 h-6 rounded-full" />
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-accent text-on-accent grid place-items-center text-xs font-bold">
                      {(user.login || user.username || '?').charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span className="text-sm font-medium max-w-[10rem] truncate">{user.login || user.username}</span>
                  <ChevronDown className={`w-4 h-4 text-muted transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showDropdown && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-60 rounded-[var(--radius-row)] border border-border bg-surface shadow-[var(--shadow-float)] overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-border">
                      <p className="font-semibold text-foreground truncate">{user.name || user.login || user.username}</p>
                      {user.login && <p className="text-sm text-muted truncate">@{user.login}</p>}
                    </div>
                    <div className="p-1.5">
                      {user.login && (
                        <a
                          role="menuitem"
                          href={`https://github.com/${user.login}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-3 py-2 rounded-[var(--radius-control)] text-sm text-foreground hover:bg-background"
                        >
                          View GitHub profile
                        </a>
                      )}
                      <button
                        role="menuitem"
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-[var(--radius-control)] text-sm text-foreground hover:bg-background"
                      >
                        <LogOut className="w-4 h-4 text-muted" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-[15px] font-medium text-muted hover:text-foreground rounded-[var(--radius-control)]"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-[15px] font-semibold rounded-[var(--radius-control)] bg-foreground text-background hover:opacity-90 transition-opacity"
                >
                  Create account
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            className="md:hidden ml-auto p-2 -mr-1 text-foreground rounded-[var(--radius-control)] relative z-50"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>
      </header>

      {/* Full-screen mobile menu */}
      <div
        id="mobile-menu"
        ref={mobileMenuRef}
        className="fixed inset-0 z-40 bg-background flex-col justify-center px-8"
        style={{ transform: 'translateX(100%)', display: 'none' }}
      >
        <div className="flex flex-col gap-2 text-3xl font-bold tracking-tight">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              data-menu-item
              className={({ isActive }) => `py-2 ${isActive ? 'text-accent' : 'text-foreground'}`}
            >
              {l.label}
            </NavLink>
          ))}

          <div data-menu-item className="h-px bg-border my-4" />

          {user ? (
            <button data-menu-item onClick={logout} className="py-2 text-left text-xl font-semibold text-muted">
              Sign out
            </button>
          ) : (
            <>
              <button data-menu-item onClick={() => navigate('/login')} className="py-2 text-left text-xl font-semibold text-muted">
                Sign in
              </button>
              <button data-menu-item onClick={() => navigate('/register')} className="py-2 text-left text-xl font-semibold text-muted">
                Create account
              </button>
            </>
          )}

          <div data-menu-item className="mt-6">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  );
}
