import { LogOut, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export function QuickActions() {
    const { user, logout } = useAuth();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleLogout = () => {
        setShowConfirm(true);
    };

    const confirmLogout = () => {
        logout();
    };

    if (!user) return null;

    return (
        <>
            {/* Quick Action Button */}
            <div className="fixed bottom-6 right-6 z-40">
                <div className="flex flex-col gap-3">
                    {/* User Info Card */}
                    <div className="bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800 
                                  rounded-2xl p-3 shadow-lg backdrop-blur-md
                                  flex items-center gap-3">
                        <img
                            src={user.avatar_url}
                            alt={user.login}
                            className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-800"
                        />
                        <div className="flex-1">
                            <p className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight">
                                {user.name || user.login}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                @{user.login}
                            </p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400
                                     hover:bg-red-100 dark:hover:bg-red-950/50
                                     transition-all border-2 border-red-200 dark:border-red-800"
                            title="Sign Out"
                        >
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center">
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowConfirm(false)}
                    />
                    
                    <div className="relative bg-white dark:bg-black border-2 border-red-200 dark:border-red-800 
                                  rounded-3xl shadow-2xl max-w-md w-full mx-4 p-6
                                  animate-in fade-in zoom-in duration-200">
                        {/* Icon */}
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/50 
                                          flex items-center justify-center">
                                <LogOut className="w-8 h-8 text-red-600 dark:text-red-400" strokeWidth={2.5} />
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl font-bold text-center mb-3 text-gray-900 dark:text-gray-100">
                            Sign Out?
                        </h3>

                        {/* Message */}
                        <p className="text-center text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                            Are you sure you want to sign out? You'll need to authenticate again to access your data.
                        </p>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 px-6 py-3 rounded-xl font-semibold
                                         bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100
                                         border-2 border-gray-200 dark:border-gray-800
                                         hover:bg-gray-200 dark:hover:bg-gray-800
                                         transition-all duration-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="flex-1 px-6 py-3 rounded-xl font-semibold
                                         bg-red-600 dark:bg-red-600 text-white
                                         hover:bg-red-700 dark:hover:bg-red-700
                                         transition-all duration-200 shadow-lg"
                            >
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
