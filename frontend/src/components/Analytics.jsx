import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Star, GitFork, Share2 } from 'lucide-react';
import { languageColor } from '../lib/languageColors';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorAlert } from './ErrorAlert';
import { usePageTitle } from '../hooks/usePageTitle';
import { AnalyticsSidebar } from './AnalyticsSidebar';
import { Avatar } from './Avatar';

export function Analytics() {
    usePageTitle('Analytics');
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showSidebar, setShowSidebar] = useState(false);

    const fetchUserStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('github_token');
            
            // Fetch user repos
            const reposRes = await fetch(`https://api.github.com/user/repos?per_page=100`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (!reposRes.ok) {
                throw new Error(
                    reposRes.status === 401
                        ? 'Your GitHub session has expired. Sign out and sign in again to see your analytics.'
                        : reposRes.status === 403 || reposRes.status === 429
                            ? 'GitHub’s rate limit was reached. Wait a minute, then try again.'
                            : `GitHub returned an error (${reposRes.status}). Try again in a moment.`
                );
            }
            const repos = await reposRes.json();

            // Fetch user events for activity
            const eventsRes = await fetch(`https://api.github.com/users/${user.login}/events/public?per_page=100`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Activity is a nice-to-have: an events failure shouldn't hide the rest.
            const events = eventsRes.ok ? await eventsRes.json() : [];

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
            
            // Events per day for the last 30 days, oldest first.
            const activityMap = {};
            events.forEach(event => {
                const date = new Date(event.created_at).toDateString();
                activityMap[date] = (activityMap[date] || 0) + 1;
            });
            const activityDays = Array.from({ length: 30 }, (_, i) => {
                const day = new Date();
                day.setHours(0, 0, 0, 0);
                day.setDate(day.getDate() - (29 - i));
                return { date: day, count: activityMap[day.toDateString()] || 0 };
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
                recentActivity: activityDays.filter(d => d.count > 0).length,
                activityDays,
            });
        } catch (err) {
            setError(err instanceof TypeError
                ? 'Couldn’t reach GitHub. Check your connection and try again.'
                : err.message);
        } finally {
            setLoading(false);
        }
    }, [user?.login]);

    useEffect(() => {
        if (user) {
            fetchUserStats();
        }
    }, [user, fetchUserStats]);

    if (loading) {
        return <LoadingSpinner message="Reading your GitHub activity..." />;
    }

    if (error) {
        return (
            <div className="max-w-xl space-y-4">
                <h1 className="text-3xl font-extrabold tracking-[-0.03em]">Analytics</h1>
                <ErrorAlert message={error} />
                <button
                    onClick={fetchUserStats}
                    className="px-4 py-2.5 rounded-[var(--radius-control)] font-semibold bg-accent text-on-accent hover:bg-accent-hover transition-colors"
                >
                    Try again
                </button>
            </div>
        );
    }

    const maxDaily = Math.max(1, ...(stats?.activityDays || []).map(d => d.count));

    const totals = [
        { label: 'Repositories', value: stats?.totalRepos || 0 },
        { label: 'Stars earned', value: stats?.totalStars || 0, signal: true },
        { label: 'Forks', value: stats?.totalForks || 0 },
        { label: 'Recent commits', value: stats?.totalCommits || 0 },
    ];

    const panel = 'p-6 rounded-[var(--radius-panel)] border border-border bg-surface';

    return (
        <div className="space-y-8">
            {/* Profile */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <Avatar
                    src={user.avatar_url}
                    name={user.name || user.login}
                    className="w-20 h-20 rounded-full border border-border text-3xl"
                />
                <div className="flex-1 min-w-0">
                    <h1 className="text-3xl font-extrabold tracking-[-0.03em] truncate">{user.name || user.login}</h1>
                    <p className="mt-1 text-muted">@{user.login}</p>
                </div>
                <button
                    onClick={() => setShowSidebar(true)}
                    className="self-start sm:self-center flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-control)] border border-border font-semibold text-foreground hover:bg-surface transition-colors"
                >
                    <Share2 className="w-4 h-4" />
                    Share
                </button>
            </div>

            {/* Totals */}
            <dl className="grid grid-cols-2 lg:grid-cols-4 rounded-[var(--radius-panel)] border border-border bg-surface overflow-hidden">
                {totals.map((t, i) => (
                    <div
                        key={t.label}
                        className={`p-5 sm:p-6 border-border ${i % 2 === 1 ? 'border-l' : ''} ${i >= 2 ? 'border-t lg:border-t-0' : ''} ${i === 2 ? 'lg:border-l' : ''}`}
                    >
                        <dt className="text-sm text-muted">{t.label}</dt>
                        <dd className={`mt-1 text-3xl font-bold tabular-nums ${t.signal ? 'text-signal' : 'text-foreground'}`}>
                            {t.signal && <Star className="inline w-6 h-6 -mt-1 mr-1 fill-current" aria-hidden="true" />}
                            {t.value.toLocaleString()}
                        </dd>
                    </div>
                ))}
            </dl>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Languages */}
                <section className={panel}>
                    <h2 className="text-lg font-bold">Top languages</h2>
                    <p className="text-sm text-muted mt-1">Share of your repositories by primary language</p>

                    {stats?.topLanguages?.length ? (
                        <>
                            <div className="mt-6 flex h-3 rounded-full overflow-hidden bg-border" aria-hidden="true">
                                {stats.topLanguages.map(([lang, count]) => (
                                    <span
                                        key={lang}
                                        style={{ width: `${(count / stats.totalRepos) * 100}%`, backgroundColor: languageColor(lang) }}
                                    />
                                ))}
                            </div>
                            <ul className="mt-5 space-y-3">
                                {stats.topLanguages.map(([lang, count]) => (
                                    <li key={lang} className="flex items-center justify-between gap-4 text-sm">
                                        <span className="flex items-center gap-2 font-medium">
                                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: languageColor(lang) }} />
                                            {lang}
                                        </span>
                                        <span className="flex items-baseline gap-4 text-muted">
                                            <span>{count} {count === 1 ? 'repo' : 'repos'}</span>
                                            <span className="w-10 text-right font-semibold text-foreground">
                                                {((count / stats.totalRepos) * 100).toFixed(0)}%
                                            </span>
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <p className="mt-6 text-sm text-muted">No language data yet. Push some code and check back.</p>
                    )}
                </section>

                {/* Top repositories */}
                <section className={panel}>
                    <h2 className="text-lg font-bold">Most-starred projects</h2>
                    <ol className="mt-4 divide-y divide-border">
                        {stats?.topRepos?.map((repo) => (
                            <li key={repo.id}>
                                <a
                                    href={repo.html_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between gap-4 py-3 group"
                                >
                                    <span className="font-medium text-foreground group-hover:text-accent truncate">{repo.name}</span>
                                    <span className="flex items-center gap-4 text-sm shrink-0 tabular-nums">
                                        <span className="flex items-center gap-1 text-signal font-semibold">
                                            <Star className="w-4 h-4 fill-current" aria-hidden="true" />
                                            {repo.stargazers_count.toLocaleString()}
                                        </span>
                                        <span className="flex items-center gap-1 text-muted">
                                            <GitFork className="w-4 h-4" aria-hidden="true" />
                                            {repo.forks_count.toLocaleString()}
                                        </span>
                                    </span>
                                </a>
                            </li>
                        ))}
                    </ol>
                </section>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className={panel}>
                    <h2 className="text-lg font-bold">Activity</h2>
                    <p className="mt-4 flex items-baseline gap-2">
                        <span className="text-4xl font-bold tabular-nums">{stats?.recentActivity || 0}</span>
                        <span className="text-muted">active days in the last 30</span>
                    </p>
                    <ol
                        aria-label="Public GitHub events per day, last 30 days"
                        className="mt-5 grid grid-cols-[repeat(30,minmax(0,1fr))] gap-[3px]"
                    >
                        {stats?.activityDays?.map(({ date, count }) => (
                            <li
                                key={date.toISOString()}
                                title={`${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}: ${count} ${count === 1 ? 'event' : 'events'}`}
                                className={`h-8 rounded-[3px] ${count ? 'bg-accent' : 'bg-border'}`}
                                style={count ? { opacity: 0.35 + 0.65 * (count / maxDaily) } : undefined}
                            >
                                <span className="sr-only">
                                    {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}: {count}
                                </span>
                            </li>
                        ))}
                    </ol>
                    <div className="mt-2 flex justify-between text-xs text-muted">
                        <span>30 days ago</span>
                        <span>Today</span>
                    </div>
                </section>

                <section className={panel}>
                    <h2 className="text-lg font-bold">Visibility</h2>
                    <div className="mt-4 flex gap-10">
                        <p>
                            <span className="block text-4xl font-bold tabular-nums">{stats?.publicRepos || 0}</span>
                            <span className="text-sm text-muted">public</span>
                        </p>
                        <p>
                            <span className="block text-4xl font-bold tabular-nums">{stats?.privateRepos || 0}</span>
                            <span className="text-sm text-muted">private</span>
                        </p>
                    </div>
                </section>
            </div>

            <AnalyticsSidebar
                isOpen={showSidebar}
                onClose={() => setShowSidebar(false)}
                user={user}
            />
        </div>
    );
}
