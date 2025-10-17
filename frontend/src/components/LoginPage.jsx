import React from 'react';
import { Github } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Navbar } from './Navbar';

export function LoginPage() {
    const { login } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 dark:from-dark-bg dark:to-gray-900">
            <Navbar />
            
            <div className="flex items-center justify-center min-h-[calc(100vh-6rem)] px-4">
                <div className="text-center space-y-8 max-w-5xl w-full">
                    {/* Logo and Hero Section */}
                    <div className="space-y-4">
                        <div className="flex justify-center">
                            <div className="w-20 h-20 bg-light-accent dark:bg-dark-accent rounded-full flex items-center justify-center">
                                <Github className="w-12 h-12 text-white" />
                            </div>
                        </div>
                        
                        <h1 className="text-5xl font-bold bg-gradient-to-r from-light-accent to-blue-600 dark:from-dark-accent dark:to-blue-400 bg-clip-text text-transparent">
                            GitHub Repository Search
                        </h1>
                        
                        <p className="text-xl text-light-muted dark:text-dark-muted max-w-md mx-auto">
                            Search and explore repositories — powered by GitHub
                        </p>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mt-12">
                        <div className="card p-6 space-y-2">
                            <div className="text-2xl">🔍</div>
                            <h3 className="font-semibold">Advanced Search</h3>
                            <p className="text-sm text-light-muted dark:text-dark-muted">
                                Filter by language, stars, and more
                            </p>
                        </div>
                        
                        <div className="card p-6 space-y-2">
                            <div className="text-2xl">⚡</div>
                            <h3 className="font-semibold">Lightning Fast</h3>
                            <p className="text-sm text-light-muted dark:text-dark-muted">
                                Instant results with powerful search
                            </p>
                        </div>
                        
                        <div className="card p-6 space-y-2">
                            <div className="text-2xl">🌙</div>
                            <h3 className="font-semibold">Dark Mode</h3>
                            <p className="text-sm text-light-muted dark:text-dark-muted">
                                Easy on the eyes, day or night
                            </p>
                        </div>
                    </div>

                    {/* Login Button */}
                    <button
                        onClick={login}
                        className="btn-primary flex items-center gap-3 text-lg px-8 py-4 mx-auto mt-12 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        <Github className="w-6 h-6" />
                        Continue with GitHub
                    </button>

                    <p className="text-xs text-light-muted dark:text-dark-muted mt-4">
                        We'll redirect you to GitHub for authentication
                    </p>
                </div>
            </div>
        </div>
    );
}