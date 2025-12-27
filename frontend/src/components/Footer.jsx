import { Mail, Github, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="backdrop-blur-md border-t mt-auto" style={{backgroundColor: '#1a0f11cc', borderColor: '#3d2a2f'}}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Left side - Project info */}
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
            <div className="flex items-center space-x-2">
              <span className="font-semibold" style={{color: '#f4e6e9'}}>
                Aibos GitHub Search
              </span>
              <Heart className="w-4 h-4" style={{color: '#d94062'}} />
            </div>
            <span className="text-sm" style={{color: '#c4b7ba'}}>
              &copy; {currentYear} All rights reserved
            </span>
          </div>

          {/* Right side - Contact info */}
          <div className="flex items-center space-x-6">
            <a
              href="mailto:devkiran256@gmail.com"
              className="flex items-center space-x-2 transition-colors duration-200" style={{color: '#c4b7ba'}}
            >
              <Mail className="w-4 h-4" />
              <span className="text-sm">devkiran256@gmail.com</span>
            </a>
            
            <a
              href="https://github.com/Shakiran-Nannyombi"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 transition-colors duration-200" style={{color: '#c4b7ba'}}
            >
              <Github className="w-4 h-4" />
              <span className="text-sm">GitHub</span>
            </a>
          </div>
        </div>

        {/* Bottom text */}
        <div className="mt-6 pt-6 border-t" style={{borderColor: '#3d2a2f'}}>
          <p className="text-center text-xs" style={{color: '#9a8a8d'}}>
            Built with React and FastAPI
          </p>
        </div>
      </div>
    </footer>
  );
}
