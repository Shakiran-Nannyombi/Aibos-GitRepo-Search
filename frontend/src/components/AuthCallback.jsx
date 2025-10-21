import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingSpinner } from './LoadingSpinner';

export function AuthCallback() {
    const { setUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Read user data from secure cookie instead of URL
                const userCookie = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('user_data='));
                
                if (userCookie) {
                    const userData = userCookie.split('=')[1];
                    const user = JSON.parse(decodeURIComponent(userData));
                    
                    // Set user in context
                    setUser(user);
                    
                    // Navigate to dashboard
                    setTimeout(() => {
                        navigate('/dashboard', { replace: true });
                    }, 500);
                } else {
                    navigate('/?error=auth_failed', { replace: true });
                }
            } catch (error) {
                navigate('/?error=auth_failed', { replace: true });
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