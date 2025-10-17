import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';

export function AuthCallback() {
    const { setUser } = useAuth();

    useEffect(() => {
        const handleCallback = async () => {
            const params = new URLSearchParams(window.location.search);
            const token = params.get('token');
            const userParam = params.get('user');

            if (token && userParam) {
                try {
                    const user = JSON.parse(decodeURIComponent(userParam));
                    localStorage.setItem('github_token', token);
                    localStorage.setItem('github_user', JSON.stringify(user));
                    setUser(user);
                    
                    // Redirect to dashboard
                    window.location.href = '/';
                } catch (error) {
                    console.error('Failed to parse user data:', error);
                    window.location.href = '/?error=auth_failed';
                }
            } else {
                window.location.href = '/?error=missing_params';
            }
        };

        handleCallback();
    }, [setUser]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner message="Completing authentication..." />
        </div>
    );
}
