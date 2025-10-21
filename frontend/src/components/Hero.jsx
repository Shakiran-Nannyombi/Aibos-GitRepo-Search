import { useState, useEffect, useRef } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';

// SVG Icon Components
const GitBranchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="3" x2="6" y2="15"></line>
    <circle cx="18" cy="6" r="3"></circle>
    <circle cx="6" cy="18" r="3"></circle>
    <path d="M18 9a9 9 0 0 1-9 9"></path>
  </svg>
);

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);

const CodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6"></polyline>
    <polyline points="8 6 2 12 8 18"></polyline>
  </svg>
);

const GitCommitIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4"></circle>
    <line x1="1.05" y1="12" x2="7" y2="12"></line>
    <line x1="17.01" y1="12" x2="22.96" y2="12"></line>
  </svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
);

const FolderIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
  </svg>
);

const GitPullRequestIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="18" r="3"></circle>
    <circle cx="6" cy="6" r="3"></circle>
    <path d="M13 6h3a2 2 0 0 1 2 2v7"></path>
    <line x1="6" y1="9" x2="6" y2="21"></line>
  </svg>
);

const PackageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16.5 9.4 7.55 4.24"></path>
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

export function Hero() {
  usePageTitle('Home');
  
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const phrases = [
    'Search GitHub Repositories',
    'Discover Amazing Projects',
    'Explore Open Source',
    'Find Your Next Contribution',
    'Connect with Developers'
  ];

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const handleTyping = () => {
      const current = loopNum % phrases.length;
      const fullText = phrases[current];

      setText(
        isDeleting
          ? fullText.substring(0, text.length - 1)
          : fullText.substring(0, text.length + 1)
      );

      setTypingSpeed(isDeleting ? 50 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, phrases, typingSpeed]);

  // Generate GitHub-themed floating elements in a grid pattern
  const iconComponents = [StarIcon, GitBranchIcon, CodeIcon, GitCommitIcon, SearchIcon, FolderIcon, GitPullRequestIcon, PackageIcon];
  
  const floatingElements = [];
  const cols = 8;
  const rows = 6;
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      floatingElements.push({
        id: row * cols + col,
        initialX: (col / (cols - 1)) * 100,
        initialY: (row / (rows - 1)) * 100,
        size: 40 + (Math.random() * 20 - 10),
        Icon: iconComponents[(row * cols + col) % iconComponents.length],
        rotation: Math.random() * 360
      });
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-8"
    >
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Floating GitHub-themed elements */}
      {floatingElements.map((element) => {
        const distanceX = mousePosition.x - (element.initialX * window.innerWidth / 100);
        const distanceY = mousePosition.y - (element.initialY * window.innerHeight / 100);
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        const maxDistance = 300;
        const influence = Math.max(0, 1 - distance / maxDistance);
        
        const offsetX = distanceX * influence * 0.3;
        const offsetY = distanceY * influence * 0.3;
        const IconComponent = element.Icon;

        return (
          <div
            key={element.id}
            className="absolute pointer-events-none transition-all duration-300 ease-out opacity-20 text-gray-600 dark:text-gray-400"
            style={{
              left: `${element.initialX}%`,
              top: `${element.initialY}%`,
              width: `${element.size}px`,
              height: `${element.size}px`,
              transform: `translate(${offsetX}px, ${offsetY}px) rotate(${element.rotation + influence * 30}deg)`,
              filter: `blur(${Math.max(0, 1 - influence * 1)}px)`,
            }}
          >
            <IconComponent />
          </div>
        );
      })}

      {/* Mouse follower glow */}
      <div
        className="absolute pointer-events-none w-96 h-96 rounded-full opacity-20 blur-3xl transition-all duration-500"
        style={{
          background: 'radial-gradient(circle, rgba(100, 100, 255, 0.4) 0%, transparent 70%)',
          left: mousePosition.x - 192,
          top: mousePosition.y - 192,
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-5xl -mt-20">
        {/* Main heading with typing effect */}
        <h1 className="text-6xl md:text-8xl font-bold mb-6" style={{color: '#f4e6e9'}}>
          <span className="inline-block">Lens+Github</span>
        </h1>
        
        {/* Typing animation */}
        <div className="h-24 md:h-32 flex items-center justify-center">
          <h2 className="text-3xl md:text-5xl font-semibold" style={{color: '#dd8c9e'}}>
            {text}
            <span className="animate-pulse">|</span>
          </h2>
        </div>

        {/* Feature highlights */}
        <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto" style={{color: '#c4b7ba'}}>
          Your gateway to exploring millions of GitHub repositories. 
          Search, discover, and connect with the world's largest developer community.
        </p>

        {/* Call to action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="group relative px-8 py-4 font-bold text-lg rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl" style={{backgroundColor: '#dd8c9e', color: '#0b0405'}}>
            <span className="relative z-10">Start Exploring</span>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{background: 'linear-gradient(to right, #8e233b, #d94062)'}} />
          </button>
          
          <button className="px-8 py-4 border-2 font-bold text-lg rounded-full transition-all duration-300" style={{borderColor: '#dd8c9e', color: '#dd8c9e'}}>
            Learn More
          </button>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-4xl font-bold mb-2" style={{color: '#f4e6e9'}}>100M+</div>
            <div className="text-sm" style={{color: '#9a8a8d'}}>Repositories</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2" style={{color: '#f4e6e9'}}>90M+</div>
            <div className="text-sm" style={{color: '#9a8a8d'}}>Developers</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-2" style={{color: '#f4e6e9'}}>∞</div>
            <div className="text-sm" style={{color: '#9a8a8d'}}>Possibilities</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-gray-600 dark:text-gray-400"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </div>
  );
}
