'use client';

import { useState } from 'react';
import { toggleFollow, updateProfile } from '@/app/(main)/actions';
import { signOut } from '@/app/(auth)/actions';
import { getOrCreateConversation } from '@/app/(main)/chat/actions';
import { blockUser, reportContent } from '@/app/(main)/settings/actions';
import { getInitials, formatDate, cn } from '@/lib/utils';
import PostCard from '@/components/feed/PostCard';
import { useRouter } from 'next/navigation';

interface ProfileClientProps {
    profile: { id: string; username: string; full_name: string | null; avatar_url: string | null; bio: string | null; created_at?: string; is_private?: boolean; follower_count?: number; following_count?: number; post_count?: number; };
    posts: any[];
    followersCount: number;
    followingCount: number;
    currentUserId: string;
    isOwnProfile: boolean;
    isFollowing?: boolean;
    isBlocked?: boolean;
    hasRequestedFollow?: boolean;
}

export default function ProfileClient({ profile, posts, followersCount, followingCount, currentUserId, isOwnProfile, isFollowing = false, isBlocked = false, hasRequestedFollow = false }: ProfileClientProps) {
    const [following, setFollowing] = useState(isFollowing);
    const [requested, setRequested] = useState(hasRequestedFollow);
    const [blocked, setBlocked] = useState(isBlocked);
    const [editing, setEditing] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [fCount, setFCount] = useState(profile.follower_count ?? followersCount);
    const [activeTab, setActiveTab] = useState<'posts' | 'media'>('posts');
    const router = useRouter();
    const mediaPosts = posts.filter((p) => p.image_url);

    async function handleFollow() {
        if (profile.is_private && !following) {
            const result = await toggleFollow(profile.id);
            if (result.status === 'requested') setRequested(true);
            else if (result.status === 'cancelled') setRequested(false);
        } else {
            setFollowing(!following);
            setFCount((c) => (following ? c - 1 : c + 1));
            await toggleFollow(profile.id);
        }
    }

    async function handleBlock() {
        await blockUser(profile.id);
        setBlocked(true);
        setFollowing(false);
        setShowMenu(false);
        router.refresh();
    }

    async function handleReport(reason: string) {
        await reportContent('user', profile.id, reason);
        setShowReport(false);
        setShowMenu(false);
    }

    async function handleEditSubmit(formData: FormData) {
        const result = await updateProfile(formData);
        if (result.error) {
            alert(result.error);
        } else {
            setEditing(false);
            router.refresh();
        }
    }

    if (blocked) {
        return (
            <div className="max-w-xl mx-auto px-4 py-6 text-center fade-in">
                <div className="card p-8 rounded-lg">
                    <p className="text-secondary text-sm">You have blocked this user</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-xl mx-auto px-4 py-6 fade-in">
            {/* Banner */}
            <div className="h-28 rounded-lg bg-accent/30 relative mb-14">
                <div className="absolute -bottom-10 left-4">
                    <div className="w-20 h-20 rounded-full bg-bg border-[5px] border-bg overflow-hidden flex items-center justify-center">
                        {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full avatar text-lg">{getInitials(profile.full_name || profile.username)}</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="card rounded-lg p-5 mb-4">
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-lg font-bold">{profile.full_name || profile.username}</h1>
                            {profile.is_private && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                            )}
                        </div>
                        <p className="text-sm text-muted">@{profile.username}</p>
                    </div>
                    {isOwnProfile ? (
                        <div className="flex gap-2">
                            <button onClick={() => setEditing(!editing)} className="btn btn-secondary text-xs px-3 py-1.5">Edit Profile</button>
                            <form action={signOut}>
                                <button type="submit" className="btn btn-ghost text-xs px-2 py-1.5 text-danger">Logout</button>
                            </form>
                        </div>
                    ) : (
                        <div className="flex gap-2 items-center">
                            <button onClick={handleFollow} className={cn('btn text-xs px-3 py-1.5', following ? 'btn-secondary' : requested ? 'btn-outline' : 'btn-primary')}>
                                {following ? 'Following' : requested ? 'Requested' : 'Follow'}
                            </button>
                            <button onClick={async () => { const r = await getOrCreateConversation(profile.id); if (r.conversationId) router.push(`/chat/${r.conversationId}`); }} className="btn btn-secondary text-xs px-2 py-1.5" title="Message">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                            </button>
                            {/* Menu */}
                            <div className="relative">
                                <button onClick={() => setShowMenu(!showMenu)} className="btn btn-ghost p-1.5 text-muted">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                                </button>
                                {showMenu && (
                                    <div className="absolute right-0 top-8 bg-bg-tertiary rounded-md p-1 min-w-[120px] z-10 shadow-lg scale-in">
                                        <button onClick={handleBlock} className="flex items-center gap-2 px-2.5 py-1.5 text-xs rounded hover:bg-surface-hover w-full text-secondary">Block</button>
                                        <button onClick={() => { setShowReport(true); setShowMenu(false); }} className="flex items-center gap-2 px-2.5 py-1.5 text-xs rounded hover:bg-danger/10 w-full text-danger">Report</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {profile.bio && <p className="text-sm text-secondary mb-2">{profile.bio}</p>}

                {profile.created_at && (
                    <p className="text-xs text-muted flex items-center gap-1 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                        Joined {formatDate(profile.created_at)}
                    </p>
                )}

                <div className="flex gap-4">
                    <span className="text-sm"><strong>{fCount}</strong> <span className="text-muted">followers</span></span>
                    <span className="text-sm"><strong>{profile.following_count ?? followingCount}</strong> <span className="text-muted">following</span></span>
                    <span className="text-sm"><strong>{profile.post_count ?? posts.length}</strong> <span className="text-muted">posts</span></span>
                </div>

                {/* Edit modal */}
                {editing && isOwnProfile && (
                    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4" onClick={() => setEditing(false)}>
                        <div className="card-glass w-full max-w-lg scale-in" onClick={(e) => e.stopPropagation()}>
                            <div className="h-24 rounded-t-xl bg-accent/30 relative">
                                <div className="absolute -bottom-8 left-5">
                                    <div className="w-16 h-16 rounded-full bg-bg-secondary border-[4px] border-bg-secondary overflow-hidden flex items-center justify-center">
                                        {profile.avatar_url ? <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full avatar text-sm">{getInitials(profile.full_name || profile.username)}</div>}
                                    </div>
                                </div>
                            </div>
                            <form action={handleEditSubmit} className="p-5 pt-12 space-y-3">
                                <div>
                                    <label className="block text-xs font-bold text-secondary uppercase tracking-wide mb-1">Username</label>
                                    <input name="username" defaultValue={profile.username} className="input" minLength={3} maxLength={30} pattern="^[a-z0-9_.]+$" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-secondary uppercase tracking-wide mb-1">Display Name</label>
                                    <input name="full_name" defaultValue={profile.full_name || ''} className="input" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-secondary uppercase tracking-wide mb-1">About Me</label>
                                    <textarea name="bio" defaultValue={profile.bio || ''} rows={3} className="input resize-none" maxLength={160} />
                                    <p className="text-[10px] text-muted mt-0.5">Max 160 characters</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-secondary uppercase tracking-wide mb-1">Avatar</label>
                                    <input name="avatar" type="file" accept="image/jpeg,image/png,image/webp" className="text-sm text-muted" />
                                    <p className="text-[10px] text-muted mt-0.5">Max 5MB • JPEG, PNG, WEBP</p>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button type="button" onClick={() => setEditing(false)} className="btn btn-ghost flex-1 py-2 text-sm">Cancel</button>
                                    <button type="submit" className="btn btn-green flex-1 py-2 text-sm">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Report modal */}
                {showReport && (
                    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4" onClick={() => setShowReport(false)}>
                        <div className="card-glass w-full max-w-sm p-5 scale-in" onClick={(e) => e.stopPropagation()}>
                            <h3 className="font-bold mb-3">Report User</h3>
                            <div className="space-y-1">
                                {['spam', 'harassment', 'nudity', 'misinformation', 'violence', 'other'].map((reason) => (
                                    <button key={reason} onClick={() => handleReport(reason)} className="w-full text-left px-3 py-2 rounded hover:bg-surface-hover text-sm capitalize">{reason}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Private account guard */}
            {profile.is_private && !isOwnProfile && !following && (
                <div className="card p-8 rounded-lg text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-muted mb-2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                    <p className="text-secondary text-sm font-medium">This account is private</p>
                    <p className="text-muted text-xs mt-1">Follow to see their posts</p>
                </div>
            )}

            {/* Content — only show if public, own profile, or following */}
            {(!profile.is_private || isOwnProfile || following) && (
                <>
                    <div className="flex mb-4 bg-bg-secondary rounded-lg overflow-hidden">
                        {(['posts', 'media'] as const).map((t) => (
                            <button key={t} onClick={() => setActiveTab(t)} className={cn('flex-1 text-sm font-medium py-2.5 text-center transition-colors capitalize', activeTab === t ? 'bg-surface-hover text-primary' : 'text-muted hover:text-secondary')}>
                                {t}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'posts' ? (
                        posts.length === 0 ? <p className="text-center text-muted text-sm py-12">No posts yet</p> :
                            posts.map((post) => <PostCard key={post.id} post={post} currentUserId={currentUserId} />)
                    ) : (
                        mediaPosts.length === 0 ? <p className="text-center text-muted text-sm py-12">No media yet</p> :
                            <div className="grid grid-cols-3 gap-1 rounded-lg overflow-hidden">
                                {mediaPosts.map((post) => (
                                    <div key={post.id} className="aspect-square bg-bg-tertiary overflow-hidden">
                                        {/\.(mp4|webm|ogg|mov)$/i.test(post.image_url) ? (
                                            <video src={post.image_url} className="w-full h-full object-cover" />
                                        ) : (
                                            <img src={post.image_url} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                                        )}
                                    </div>
                                ))}
                            </div>
                    )}
                </>
            )}
        </div>
    );
}
