import { useState } from 'react';
import { Share2, UserPlus, Mail, MessageCircle, X, Copy, Check, Linkedin, Facebook, Link2 } from 'lucide-react';

export function AnalyticsSidebar({ isOpen, onClose, user }) {
    const [activeTab, setActiveTab] = useState('share');
    const [email, setEmail] = useState('');
    const [copied, setCopied] = useState(false);
    const [invites, setInvites] = useState(() => {
        const saved = localStorage.getItem('invites');
        return saved ? JSON.parse(saved) : [];
    });

    const shareUrl = `${window.location.origin}/analytics/${user.login}`;
    const shareTitle = `${user.name || user.login}'s GitHub Analytics`;
    const shareText = `Check out ${user.name || user.login}'s GitHub Analytics Dashboard! 🚀`;

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Copy failed silently
        }
    };

    const sendInvite = (e) => {
        e.preventDefault();
        if (email) {
            const newInvites = [...invites, { email, date: new Date().toISOString() }];
            setInvites(newInvites);
            localStorage.setItem('invites', JSON.stringify(newInvites));
            setEmail('');
            
            // Simulate sending invitation
            const subject = encodeURIComponent('Join me on Lens+Github!');
            const body = encodeURIComponent(
                `Hi!\n\nI'd love for you to check out Lens+Github - an amazing GitHub repository search and analytics platform!\n\nYou can see my analytics here: ${shareUrl}\n\nJoin me and explore amazing GitHub projects!\n\nBest regards,\n${user.name || user.login}`
            );
            window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');
        }
    };

    const shareViaEmail = () => {
        const subject = encodeURIComponent(shareTitle);
        const body = encodeURIComponent(`${shareText}\n\n${shareUrl}`);
        window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    };

    const shareViaTwitter = () => {
        const text = encodeURIComponent(`${shareText}\n${shareUrl}`);
        window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    };

    const shareViaLinkedIn = () => {
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank');
    };

    const shareViaFacebook = () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
    };


    const shareViaWebAPI = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: shareTitle,
                    text: shareText,
                    url: shareUrl,
                });
            } catch {
                // Share failed silently
            }
        } else {
            copyToClipboard();
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-[2px] z-50"
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className="fixed right-0 top-0 h-full w-full sm:w-96 
                          bg-background border-l border-border 
                          z-50 shadow-2xl overflow-y-auto
                          animate-in slide-in-from-right duration-300">
                
                {/* Header */}
                <div className="sticky top-0 bg-background border-b border-border p-6 z-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-foreground">
                            Share & Invite
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-header transition-colors"
                        >
                            <X className="w-5 h-5 text-muted" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 p-1 bg-header rounded-xl border border-border">
                        <button
                            onClick={() => setActiveTab('share')}
                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                activeTab === 'share'
                                    ? 'bg-accent text-white shadow-sm'
                                    : 'text-muted hover:text-foreground'
                            }`}
                        >
                            <Share2 className="w-4 h-4 inline mr-2" />
                            Share
                        </button>
                        <button
                            onClick={() => setActiveTab('invite')}
                            className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                activeTab === 'invite'
                                    ? 'bg-accent text-white shadow-sm'
                                    : 'text-muted hover:text-foreground'
                            }`}
                        >
                            <UserPlus className="w-4 h-4 inline mr-2" />
                            Invite
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {activeTab === 'share' ? (
                        <>
                            {/* Profile Preview */}
                            <div className="p-4 rounded-xl border border-border bg-header shadow-sm">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={user.avatar_url}
                                        alt={user.login}
                                        className="w-12 h-12 rounded-full border-2 border-border"
                                    />
                                    <div className="min-w-0">
                                        <p className="font-bold text-foreground truncate">
                                            {user.name || user.login}
                                        </p>
                                        <p className="text-sm text-muted truncate">
                                            @{user.login}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Share Link */}
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-2">
                                    Analytics Link
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={shareUrl}
                                        className="flex-1 px-4 py-2 rounded-lg bg-header 
                                                 text-foreground font-mono text-sm
                                                 border border-border focus:outline-none"
                                    />
                                    <button
                                        onClick={copyToClipboard}
                                        className={`px-4 py-2 rounded-lg font-semibold transition-all shadow-sm ${
                                            copied
                                                ? 'bg-green-600 text-white'
                                                : 'bg-accent text-white hover:bg-accent-hover'
                                        }`}
                                    >
                                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Quick Share Options */}
                            <div>
                                <label className="block text-sm font-semibold text-foreground mb-3">
                                    Quick Share
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={shareViaEmail}
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
                                                 bg-header text-foreground border border-border
                                                 hover:bg-border/30 transition-all font-medium text-sm"
                                    >
                                        <Mail className="w-4 h-4 text-muted" />
                                        Email
                                    </button>
                                    <button
                                        onClick={shareViaTwitter}
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
                                                 bg-header text-foreground border border-border
                                                 hover:bg-border/30 transition-all font-medium text-sm"
                                    >
                                        <MessageCircle className="w-4 h-4 text-muted" />
                                        Twitter
                                    </button>
                                    <button
                                        onClick={shareViaLinkedIn}
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
                                                 bg-header text-foreground border border-border
                                                 hover:bg-border/30 transition-all font-medium text-sm"
                                    >
                                        <Linkedin className="w-4 h-4 text-muted" />
                                        LinkedIn
                                    </button>
                                    <button
                                        onClick={shareViaFacebook}
                                        className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
                                                 bg-header text-foreground border border-border
                                                 hover:bg-border/30 transition-all font-medium text-sm"
                                    >
                                        <Facebook className="w-4 h-4 text-muted" />
                                        Facebook
                                    </button>
                                </div>
                            </div>

                            {/* Native Share (Mobile) */}
                            {navigator.share && (
                                <button
                                    onClick={shareViaWebAPI}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                                             bg-accent text-white font-semibold
                                             hover:bg-accent-hover
                                             transition-all shadow-sm"
                                >
                                    <Share2 className="w-4 h-4" />
                                    Share via...
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            {/* Invite Form */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-foreground mb-1">
                                        Invite Friends
                                    </label>
                                    <p className="text-sm text-muted mb-4">
                                        Invite colleagues to check out Lens+Github!
                                    </p>
                                    <form onSubmit={sendInvite} className="space-y-3">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="friend@example.com"
                                            className="w-full px-4 py-2 rounded-lg bg-header 
                                                     text-foreground border border-border
                                                     focus:outline-none focus:border-accent
                                                     transition-all"
                                        />
                                        <button
                                            type="submit"
                                            className="w-full px-4 py-2.5 rounded-lg font-semibold
                                                     bg-accent text-white
                                                     hover:bg-accent-hover
                                                     transition-all shadow-sm"
                                        >
                                            Send Invitation
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Invites List */}
                            {invites.length > 0 && (
                                <div className="pt-6 border-t border-border">
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="block text-sm font-semibold text-foreground">
                                            Recent Invites ({invites.length})
                                        </label>
                                        <button
                                            onClick={() => {
                                                setInvites([]);
                                                localStorage.removeItem('invites');
                                            }}
                                            className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {invites.slice().reverse().map((invite, i) => (
                                            <div
                                                key={i}
                                                className="p-3 rounded-lg bg-header border border-border
                                                         flex items-center justify-between group"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-foreground truncate">
                                                        {invite.email}
                                                    </p>
                                                    <p className="text-xs text-muted">
                                                        {new Date(invite.date).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Info */}
                            <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
                                <p className="text-xs text-muted leading-relaxed">
                                    💡 <strong>Tip:</strong> Invite your team members to track everyone's open source progress together!
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
