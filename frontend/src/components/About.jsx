import React from 'react';
import { usePageTitle } from '../hooks/usePageTitle';

export function About() {
  usePageTitle('About');

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 bg-background transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* Mission Section */}
        <section className="text-center space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground animate-gradient">
            About Lens+Github
          </h1>
          <p className="text-xl text-muted max-w-2xl mx-auto leading-relaxed">
            Our mission is to empower developers to explore, discover, and understand the vast universe of Open Source software in a beautiful and intuitive way.
          </p>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-3 gap-8">
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all duration-200">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">Advanced Search</h3>
            <p className="text-muted">Perform granular searches across millions of repositories with powerful filters for language, popularity, and more.</p>
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all duration-200">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 text-accent">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/></svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">Deep Analytics</h3>
            <p className="text-muted">Gain insights into language usage, growth trends, and community engagement with our visualization tools.</p>
          </div>
          <div className="p-6 rounded-2xl bg-card border border-border shadow-sm hover:shadow-md transition-all duration-200">
             <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 text-accent">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
            </div>
            <h3 className="text-xl font-bold mb-2 text-foreground">Save & Organize</h3>
            <p className="text-muted">Bookmark your favorite repositories and manage your personal collection of open source gems.</p>
          </div>
        </section>

        {/* Tech Stack */}
        <section className="bg-header rounded-3xl p-8 md:p-12 border border-border">
          <h2 className="text-3xl font-bold mb-8 text-center text-foreground">Built With Modern Tech</h2>
          <div className="flex flex-wrap justify-center gap-4">
             {['React', 'Tailwind CSS', 'FastAPI', 'Python', 'OpenAI', 'RAG', 'PostgreSQL', 'Vercel'].map((tech) => (
               <span key={tech} className="px-4 py-2 rounded-full bg-background border border-border font-medium text-foreground text-sm shadow-sm">
                 {tech}
               </span>
             ))}
          </div>
        </section>

      </div>
    </div>
  );
}
