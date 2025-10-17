import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Star, GitFork, Users, Code, TrendingUp, Share2, UserPlus, Award, Activity, GitCommit, Calendar } from 'lucide-react';
import { AnalyticsSidebar } from './AnalyticsSidebar';

export function Analytics() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSidebar, setShowSidebar] = useState(false);

    useEffect(() => {
        if (user) {
            fetchUserStats();
        }
    }, [user]);

    const fetchUserStats = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('github_token');
            
            // Fetch user repos
            const reposRes = await fetch(`https://api.github.com/user/repos?per_page=100`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const repos = await reposRes.json();

            // Fetch user events for activity
            const eventsRes = await fetch(`https://api.github.com/users/${user.login}/events/public?per_page=100`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const events = await eventsRes.json();

            // Calculate stats
            const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
            const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
            const languages = {};
            
            repos.forEach(repo => {
                if (repo.language) {
                    languages[repo.language] = (languages[repo.language] || 0) + 1;
                }
            });

            const topLanguages = Object.entries(languages)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5);

            const topRepos = repos
                .sort((a, b) => b.stargazers_count - a.stargazers_count)
                .slice(0, 5);

            // Calculate activity stats
            const commitEvents = events.filter(e => e.type === 'PushEvent');
            const totalCommits = commitEvents.reduce((sum, e) => sum + (e.payload.commits?.length || 0), 0);
            
            // Activity heatmap (last 30 days)
            const activityMap = {};
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            events.forEach(event => {
                const date = new Date(event.created_at).toDateString();
                if (new Date(event.created_at) >= thirtyDaysAgo) {
                    activityMap[date] = (activityMap[date] || 0) + 1;
                }
            });

            setStats({
                totalRepos: repos.length,
                totalStars,
                totalForks,
                topLanguages,
                topRepos,
                publicRepos: repos.filter(r => !r.private).length,
                privateRepos: repos.filter(r => r.private).length,
                totalCommits,
                recentActivity: Object.entries(activityMap).length,
                activityMap
            });
        } catch (error) {
            console.error('Failed to fetch stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const languageColors = {
        JavaScript: '#f1e05a',
        TypeScript: '#3178c6',
        Python: '#3572A5',
        Java: '#b07219',
        Go: '#00ADD8',
        Rust: '#dea584',
        Ruby: '#701516',
        PHP: '#4F5D95',
        C: '#555555',
        'C++': '#f34b7d',
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Activity className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-500 dark:text-purple-500" />
                    <p className="text-gray-600 dark:text-gray-400">Loading your analytics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Profile */}
            <div className="relative p-8 rounded-3xl border-2 border-blue-200/30 dark:border-purple-800/30 
                          bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-purple-950/20 dark:to-blue-950/20 
                          backdrop-blur-md overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 dark:bg-purple-500/10 rounded-full blur-3xl"></div>
                
                <div className="relative flex flex-col md:flex-row items-center gap-6">
                    <img
                        src={user.avatar_url}
                        alt={user.login}
                        className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-900 shadow-xl"
                    />
                    
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                            {user.name || user.login}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                            @{user.login} • GitHub Analytics
                        </p>
                        
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            <button
                                onClick={() => setShowSidebar(true)}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                                         bg-blue-500 dark:bg-purple-500 text-white font-semibold
                                         hover:bg-blue-600 dark:hover:bg-purple-600
                                         transition-all shadow-lg"
                            >
                                <Share2 className="w-4 h-4" />
                                Share & Invite
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                    { icon: Code, label: 'Total Repositories', value: stats?.totalRepos || 0, color: 'blue', gradient: 'from-blue-500 to-blue-600' },
                    { icon: Star, label: 'Total Stars', value: stats?.totalStars || 0, color: 'yellow', gradient: 'from-yellow-500 to-orange-500' },
                    { icon: GitFork, label: 'Total Forks', value: stats?.totalForks || 0, color: 'green', gradient: 'from-green-500 to-emerald-600' },
                    { icon: GitCommit, label: 'Recent Commits', value: stats?.totalCommits || 0, color: 'purple', gradient: 'from-purple-500 to-pink-600' }
                ].map((stat, i) => (
                    <div key={i} className="group relative p-6 rounded-2xl border-2 border-blue-200/30 dark:border-purple-800/30 
                                          bg-blue-50/20 dark:bg-purple-950/15 backdrop-blur-md
                                          hover:border-blue-400 dark:hover:border-purple-400
                                          hover:scale-105 transition-all duration-300 overflow-hidden">
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-2xl`}></div>
                        <stat.icon className={`relative w-10 h-10 mb-3 text-${stat.color}-500`} strokeWidth={2} />
                        <p className="relative text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                            {stat.value.toLocaleString()}
                        </p>
                        <p className="relative text-sm text-gray-600 dark:text-gray-400 font-medium">
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>

            {/* Language Breakdown */}
            <div className="p-6 rounded-2xl border-2 border-blue-200/30 dark:border-purple-800/30 
                          bg-blue-50/20 dark:bg-purple-950/15 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-6 h-6 text-blue-500 dark:text-purple-500" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Top Languages
                    </h2>
                </div>

                <div className="space-y-4">
                    {stats?.topLanguages?.map(([lang, count], i) => {
                        const percentage = (count / stats.totalRepos) * 100;
                        return (
                            <div key={lang}>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div 
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: languageColors[lang] || '#858585' }}
                                        />
                                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                                            {lang}
                                        </span>
                                    </div>
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {count} repos ({percentage.toFixed(1)}%)
                                    </span>
                                </div>
                                <div className="w-full h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full rounded-full transition-all duration-1000"
                                        style={{ 
                                            width: `${percentage}%`,
                                            backgroundColor: languageColors[lang] || '#858585'
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Top Repositories */}
            <div className="p-6 rounded-2xl border-2 border-blue-200/30 dark:border-purple-800/30 
                          bg-blue-50/20 dark:bg-purple-950/15 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-6">
                    <Award className="w-6 h-6 text-blue-500 dark:text-purple-500" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Top Repositories
                    </h2>
                </div>

                <div className="grid gap-4">
                    {stats?.topRepos?.map((repo, i) => (
                        <a
                            key={repo.id}
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-between p-4 rounded-xl
                                     bg-white dark:bg-black border-2 border-gray-200 dark:border-gray-800
                                     hover:border-blue-400 dark:hover:border-purple-400
                                     transition-all group"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-2xl font-bold text-gray-400 dark:text-gray-600">
                                        #{i + 1}
                                    </span>
                                    <h3 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-purple-400">
                                        {repo.name}
                                    </h3>
                                </div>
                                {repo.description && (
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                                        {repo.description}
                                    </p>
                                )}
                            </div>
                            
                            <div className="flex items-center gap-4 ml-4">
                                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                    <Star className="w-4 h-4 fill-current" />
                                    <span className="font-semibold">{repo.stargazers_count}</span>
                                </div>
                                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                    <GitFork className="w-4 h-4" />
                                    <span className="font-semibold">{repo.forks_count}</span>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            </div>

            {/* Activity Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Recent Activity Count */}
                <div className="p-6 rounded-2xl border-2 border-blue-200/30 dark:border-purple-800/30 
                              bg-blue-50/20 dark:bg-purple-950/15 backdrop-blur-md">
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-6 h-6 text-blue-500 dark:text-purple-500" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Activity (Last 30 Days)
                        </h2>
                    </div>
                    <p className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {stats?.recentActivity || 0}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                        Active days this month
                    </p>
                </div>

                {/* Repo Breakdown */}
                <div className="p-6 rounded-2xl border-2 border-blue-200/30 dark:border-purple-800/30 
                              bg-blue-50/20 dark:bg-purple-950/15 backdrop-blur-md">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-6 h-6 text-blue-500 dark:text-purple-500" />
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Repository Breakdown
                        </h2>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Public Repos</span>
                            <span className="text-xl font-bold text-green-600 dark:text-green-400">
                                {stats?.publicRepos || 0}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Private Repos</span>
                            <span className="text-xl font-bold text-gray-600 dark:text-gray-400">
                                {stats?.privateRepos || 0}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <AnalyticsSidebar 
                isOpen={showSidebar} 
                onClose={() => setShowSidebar(false)}
                user={user}
            />
        </div>
    );
}
