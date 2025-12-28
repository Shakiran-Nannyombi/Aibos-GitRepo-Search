import { Mail, Github, Heart, Globe, Code2, Twitter } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-header border-t border-border mt-auto overflow-hidden">
      {/* Creative Background Element */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand & Theme */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center space-x-2">
              <Code2 className="w-6 h-6 text-accent" />
              <span className="font-bold text-xl text-foreground tracking-tight">
                Lens+Github
              </span>
            </div>
            <p className="text-sm text-muted">
              Exploring the open source universe, one repository at a time.
            </p>
            <div className="pt-2">
               <ThemeToggle />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Discover</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li><a href="/dashboard" className="hover:text-accent transition-colors">Search Repos</a></li>
              <li><a href="/saved" className="hover:text-accent transition-colors">Saved Collections</a></li>
              <li><a href="/analytics" className="hover:text-accent transition-colors">Analytics</a></li>
            </ul>
          </div>

          {/* Comunity */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Community</h3>
             <ul className="space-y-2 text-sm text-muted">
              <li><a href="#" className="hover:text-accent transition-colors">Contributors</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Changelog</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Feedback</a></li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Connect</h3>
            <div className="flex flex-col space-y-3">
              <a
                href="mailto:devkiran256@gmail.com"
                className="flex items-center space-x-2 text-muted hover:text-accent transition-colors group"
              >
                <div className="p-2 rounded-full bg-background border border-border group-hover:border-accent transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-sm">Email Us</span>
              </a>
              
              <a
                href="https://github.com/Shakiran-Nannyombi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-muted hover:text-accent transition-colors group"
              >
                <div className="p-2 rounded-full bg-background border border-border group-hover:border-accent transition-colors">
                  <Github className="w-4 h-4" />
                </div>
                <span className="text-sm">GitHub</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted">
            &copy; {currentYear} Lens+Github Search. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-1 text-sm text-muted">
             <span>Made with</span>
             <Heart className="w-4 h-4 text-red-500 fill-current animate-pulse" />
             <span>by dev-kiran</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
