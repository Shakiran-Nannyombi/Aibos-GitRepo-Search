import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Star, GitFork, Users, Code, TrendingUp, Share2, UserPlus, Award, Activity, GitCommit, Calendar, ExternalLink } from 'lucide-react';
import { AnalyticsSidebar } from './AnalyticsSidebar';

export function Analytics() {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSidebar, setShowSidebar] = useState(false);

    const fetchUserStats = useCallback(async () => {
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
        } catch (err) {
            console.error('Error fetching stats:', err);
        } finally {
            setLoading(false);
        }
    }, [user?.login]);

    useEffect(() => {
        if (user) {
            fetchUserStats();
        }
    }, [user, fetchUserStats]);

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
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="text-center">
                    <Activity className="w-12 h-12 animate-spin mx-auto mb-4 text-accent" />
                    <p className="text-muted">Analyzing your open source journey...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto px-4 py-8">
            {/* Header with Profile */}
            <div className="relative p-8 rounded-2xl border border-border bg-header shadow-sm overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl"></div>
                
                <div className="relative flex flex-col md:flex-row items-center gap-6">
                    <img
                        src={user.avatar_url}
                        alt={user.login}
                        className="w-24 h-24 rounded-full border-2 border-border shadow-sm"
                    />
                    
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-foreground mb-1">
                            {user.name || user.login}
                        </h1>
                        <p className="text-muted text-lg mb-4">
                            @{user.login} • Developer Analytics
                        </p>
                        
                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            <button
                                onClick={() => setShowSidebar(true)}
                                className="flex items-center gap-2 px-5 py-2 rounded-lg
                                         bg-accent text-white font-semibold
                                         hover:bg-accent-hover
                                         transition-all shadow-sm"
                            >
                                <Share2 className="w-4 h-4" />
                                Share & Invite
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { icon: Code, label: 'Repos', value: stats?.totalRepos || 0, color: 'text-blue-500' },
                    { icon: Star, label: 'Stars', value: stats?.totalStars || 0, color: 'text-yellow-500' },
                    { icon: GitFork, label: 'Forks', value: stats?.totalForks || 0, color: 'text-green-500' },
                    { icon: GitCommit, label: 'Commits', value: stats?.totalCommits || 0, color: 'text-muted' }
                ].map((stat, i) => (
                    <div key={i} className="group p-6 rounded-xl border border-border bg-header shadow-sm transition-all hover:border-muted">
                        <stat.icon className={`w-8 h-8 mb-3 ${stat.color}`} />
                        <p className="text-3xl font-bold text-foreground mb-1">
                            {stat.value.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted font-medium">
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>

            {/* Content Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Language Breakdown */}
                <div className="p-6 rounded-2xl border border-border bg-header shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-5 h-5 text-muted" />
                        <h2 className="text-xl font-bold text-foreground">
                            Top Languages
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {stats?.topLanguages?.map(([lang, count]) => {
                            const percentage = (count / stats.totalRepos) * 100;
                            return (
                                <div key={lang}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div 
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: languageColors[lang] || 'var(--muted)' }}
                                            />
                                            <span className="font-semibold text-foreground">
                                                {lang}
                                            </span>
                                        </div>
                                        <span className="text-xs text-muted">
                                            {count} repos ({percentage.toFixed(1)}%)
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                                        <div 
                                            className="h-full rounded-full transition-all duration-1000"
                                            style={{ 
                                                width: `${percentage}%`,
                                                backgroundColor: languageColors[lang] || 'var(--muted)'
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Top Repositories */}
                <div className="p-6 rounded-2xl border border-border bg-header shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <Award className="w-5 h-5 text-muted" />
                        <h2 className="text-xl font-bold text-foreground">
                            Notable Projects
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {stats?.topRepos?.map((repo) => (
                            <a
                                key={repo.id}
                                href={repo.html_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3 rounded-lg border border-border hover:border-muted bg-background transition-all group"
                            >
                                <div className="min-w-0 pr-4">
                                    <h3 className="font-bold text-foreground text-sm group-hover:text-accent truncate">
                                        {repo.name}
                                    </h3>
                                    <div className="flex items-center gap-3 mt-1 text-xs text-muted">
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-current" />
                                            {repo.stargazers_count}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <GitFork className="w-3 h-3" />
                                            {repo.forks_count}
                                        </div>
                                    </div>
                                </div>
                                <ExternalLink className="w-4 h-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl border border-border bg-header shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Calendar className="w-5 h-5 text-muted" />
                        <h2 className="text-lg font-bold text-foreground">
                            Activity Overview
                        </h2>
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-foreground">{stats?.recentActivity || 0}</span>
                        <span className="text-muted text-sm font-medium">Active days (Last 30D)</span>
                    </div>
                </div>

                <div className="p-6 rounded-2xl border border-border bg-header shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <Activity className="w-5 h-5 text-muted" />
                        <h2 className="text-lg font-bold text-foreground">
                            Repository Types
                        </h2>
                    </div>
                    <div className="flex gap-8">
                        <div>
                            <p className="text-xs text-muted font-medium uppercase tracking-wider mb-1">Public</p>
                            <p className="text-2xl font-bold text-foreground">{stats?.publicRepos || 0}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted font-medium uppercase tracking-wider mb-1">Private</p>
                            <p className="text-2xl font-bold text-foreground">{stats?.privateRepos || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            <AnalyticsSidebar 
                isOpen={showSidebar} 
                onClose={() => setShowSidebar(false)}
                user={user}
            />
        </div>
    );
}
