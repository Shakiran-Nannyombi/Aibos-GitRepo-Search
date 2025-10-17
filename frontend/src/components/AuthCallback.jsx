import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';

export function AuthCallback() {
    const { setUser } = useAuth();
    const navigate = useNavigate();

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
                    
                    // Set user in context
                    setUser(user);
                    
                    // Wait a bit for state to update, then redirect
                    setTimeout(() => {
                        navigate('/dashboard', { replace: true });
                    }, 500);
                } catch (error) {
                    navigate('/?error=auth_failed', { replace: true });
                }
            } else {
                navigate('/?error=missing_params', { replace: true });
            }
        };

        handleCallback();
    }, [setUser, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner message="Completing authentication..." />
        </div>
    );
}
