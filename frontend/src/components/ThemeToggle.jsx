import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const Icon = theme === 'light' ? Moon : Sun;

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
      className="p-2 rounded-[var(--radius-control)] border border-border text-muted hover:text-foreground hover:bg-background transition-colors"
    >
      <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
    </button>
  );
}
