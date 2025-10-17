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
        } catch (err) {
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

    const shareViaWhatsApp = () => {
        const text = encodeURIComponent(`${shareText} ${shareUrl}`);
        window.open(`https://wa.me/?text=${text}`, '_blank');
    };

    const shareViaWebAPI = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: shareTitle,
                    text: shareText,
                    url: shareUrl,
                });
            } catch (err) {
                if (err.name !== 'AbortError') {
                    // Share failed silently
                }
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
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className="fixed right-0 top-0 h-full w-full sm:w-96 
                          bg-white dark:bg-black 
                          border-l-2 border-gray-200 dark:border-gray-800 
                          z-50 shadow-2xl overflow-y-auto
                          animate-in slide-in-from-right duration-300">
                
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-black border-b-2 border-gray-200 dark:border-gray-800 p-6 z-10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Share & Invite
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setActiveTab('share')}
                            className={`flex-1 px-4 py-2 rounded-xl font-semibold transition-all ${
                                activeTab === 'share'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400'
                            }`}
                        >
                            <Share2 className="w-4 h-4 inline mr-2" />
                            Share
                        </button>
                        <button
                            onClick={() => setActiveTab('invite')}
                            className={`flex-1 px-4 py-2 rounded-xl font-semibold transition-all ${
                                activeTab === 'invite'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-400'
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
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 border-2 border-gray-200/30 dark:border-gray-700/30">
                                <div className="flex items-center gap-3 mb-3">
                                    <img
                                        src={user.avatar_url}
                                        alt={user.login}
                                        className="w-12 h-12 rounded-full border-2 border-white dark:border-gray-900"
                                    />
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-gray-100">
                                            {user.name || user.login}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            @{user.login}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Share Link */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">
                                    Your Analytics Link
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        readOnly
                                        value={shareUrl}
                                        className="flex-1 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 
                                                 text-gray-900 dark:text-gray-100 font-mono text-sm
                                                 border-2 border-gray-200 dark:border-gray-800"
                                    />
                                    <button
                                        onClick={copyToClipboard}
                                        className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                                            copied
                                                ? 'bg-green-500 text-white'
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                    >
                                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Quick Share Options */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-3">
                                    Quick Share
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={shareViaEmail}
                                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                                                 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100
                                                 border-2 border-gray-200 dark:border-gray-800
                                                 hover:border-gray-400 dark:hover:border-gray-500
                                                 transition-all font-semibold"
                                    >
                                        <Mail className="w-4 h-4" />
                                        Email
                                    </button>
                                    <button
                                        onClick={shareViaTwitter}
                                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                                                 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100
                                                 border-2 border-gray-200 dark:border-gray-800
                                                 hover:border-gray-400 dark:hover:border-gray-500
                                                 transition-all font-semibold"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        Twitter
                                    </button>
                                    <button
                                        onClick={shareViaLinkedIn}
                                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                                                 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100
                                                 border-2 border-gray-200 dark:border-gray-800
                                                 hover:border-gray-400 dark:hover:border-gray-500
                                                 transition-all font-semibold"
                                    >
                                        <Linkedin className="w-4 h-4" />
                                        LinkedIn
                                    </button>
                                    <button
                                        onClick={shareViaFacebook}
                                        className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                                                 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100
                                                 border-2 border-gray-200 dark:border-gray-800
                                                 hover:border-gray-400 dark:hover:border-gray-500
                                                 transition-all font-semibold"
                                    >
                                        <Facebook className="w-4 h-4" />
                                        Facebook
                                    </button>
                                </div>
                            </div>

                            {/* Native Share (Mobile) */}
                            {navigator.share && (
                                <button
                                    onClick={shareViaWebAPI}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                                             bg-blue-600 text-white font-semibold
                                             hover:bg-blue-700
                                             transition-all shadow-lg"
                                >
                                    <Share2 className="w-4 h-4" />
                                    Share via...
                                </button>
                            )}
                        </>
                    ) : (
                        <>
                            {/* Invite Form */}
                            <div>
                                <label className="block text-sm font-bold text-gray-900 dark:text-gray-100 mb-2">
                                    Invite Friends via Email
                                </label>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    Send your friends an invitation to check out Lens+Github!
                                </p>
                                <form onSubmit={sendInvite} className="space-y-3">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="friend@example.com"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-900 
                                                 text-gray-900 dark:text-gray-100
                                                 border-2 border-gray-200 dark:border-gray-800
                                                 focus:outline-none focus:border-gray-400 dark:focus:border-gray-500
                                                 transition-all"
                                    />
                                    <button
                                        type="submit"
                                        className="w-full px-4 py-3 rounded-xl font-semibold
                                                 bg-blue-600 text-white
                                                 hover:bg-blue-700
                                                 transition-all shadow-lg"
                                    >
                                        Send Invitation
                                    </button>
                                </form>
                            </div>

                            {/* Invites List */}
                            {invites.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <label className="block text-sm font-bold text-gray-900 dark:text-gray-100">
                                            Recent Invites ({invites.length})
                                        </label>
                                        <button
                                            onClick={() => {
                                                setInvites([]);
                                                localStorage.removeItem('invites');
                                            }}
                                            className="text-xs hover:underline transition-colors"
                                            style={{color: '#dc2626'}}
                                            onMouseEnter={(e) => e.target.style.color = '#b91c1c'}
                                            onMouseLeave={(e) => e.target.style.color = '#dc2626'}
                                        >
                                            Clear All
                                        </button>
                                    </div>
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {invites.slice().reverse().map((invite, i) => (
                                            <div
                                                key={i}
                                                className="p-3 rounded-xl bg-gray-100 dark:bg-gray-900 
                                                         border-2 border-gray-200 dark:border-gray-800
                                                         flex items-center justify-between"
                                            >
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                                        {invite.email}
                                                    </p>
                                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                                        {new Date(invite.date).toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Info */}
                            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200/30 dark:border-blue-800/30">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    💡 <strong>Tip:</strong> Invite your team members to track everyone's progress together!
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
