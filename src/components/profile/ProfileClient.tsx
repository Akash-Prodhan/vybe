'use client';

import { useState } from 'react';
import { toggleFollow, updateProfile } from '@/app/(main)/actions';
import { signOut } from '@/app/(auth)/actions';
import { getOrCreateConversation } from '@/app/(main)/chat/actions';
import { getInitials, formatDate, cn } from '@/lib/utils';
import PostCard from '@/components/feed/PostCard';
import { useRouter } from 'next/navigation';

interface ProfileClientProps {
    profile: { id: string; username: string; full_name: string | null; avatar_url: string | null; bio: string | null; created_at?: string; };
    posts: any[];
    followersCount: number;
    followingCount: number;
    currentUserId: string;
    isOwnProfile: boolean;
    isFollowing?: boolean;
}

export default function ProfileClient({ profile, posts, followersCount, followingCount, currentUserId, isOwnProfile, isFollowing = false }: ProfileClientProps) {
    const [following, setFollowing] = useState(isFollowing);
    const [editing, setEditing] = useState(false);
    const [fCount, setFCount] = useState(followersCount);
    const [activeTab, setActiveTab] = useState<'posts' | 'media'>('posts');
    const router = useRouter();
    const mediaPosts = posts.filter((p) => p.image_url);

    async function handleFollow() { setFollowing(!following); setFCount((c) => (following ? c - 1 : c + 1)); await toggleFollow(profile.id); }

    async function handleEditSubmit(formData: FormData) {
        const result = await updateProfile(formData);
        if (!result.error) { setEditing(false); router.refresh(); }
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
                        <h1 className="text-lg font-bold">{profile.full_name || profile.username}</h1>
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
                        <div className="flex gap-2">
                            <button onClick={handleFollow} className={cn('btn text-xs px-3 py-1.5', following ? 'btn-secondary' : 'btn-primary')}>
                                {following ? 'Following' : 'Follow'}
                            </button>
                            <button onClick={async () => { const r = await getOrCreateConversation(profile.id); if (r.conversationId) router.push(`/chat/${r.conversationId}`); }} className="btn btn-secondary text-xs px-2 py-1.5" title="Message">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                            </button>
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
                    <span className="text-sm"><strong>{followingCount}</strong> <span className="text-muted">following</span></span>
                    <span className="text-sm"><strong>{posts.length}</strong> <span className="text-muted">posts</span></span>
                </div>

                {/* Discord-style edit form */}
                {editing && isOwnProfile && (
                    <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4" onClick={() => setEditing(false)}>
                        <div className="card-glass w-full max-w-lg scale-in" onClick={(e) => e.stopPropagation()}>
                            {/* Preview banner */}
                            <div className="h-24 rounded-t-xl bg-accent/30 relative">
                                <div className="absolute -bottom-8 left-5">
                                    <div className="w-16 h-16 rounded-full bg-bg-secondary border-[4px] border-bg-secondary overflow-hidden flex items-center justify-center">
                                        {profile.avatar_url ? (
                                            <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full avatar text-sm">{getInitials(profile.full_name || profile.username)}</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <form action={handleEditSubmit} className="p-5 pt-12 space-y-3">
                                <div>
                                    <label className="block text-xs font-bold text-secondary uppercase tracking-wide mb-1">Username</label>
                                    <input name="username" defaultValue={profile.username} className="input" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-secondary uppercase tracking-wide mb-1">Display Name</label>
                                    <input name="full_name" defaultValue={profile.full_name || ''} className="input" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-secondary uppercase tracking-wide mb-1">About Me</label>
                                    <textarea name="bio" defaultValue={profile.bio || ''} rows={3} className="input resize-none" maxLength={160} />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-secondary uppercase tracking-wide mb-1">Avatar</label>
                                    <input name="avatar" type="file" accept="image/*" className="text-sm text-muted" />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button type="button" onClick={() => setEditing(false)} className="btn btn-ghost flex-1 py-2 text-sm">Cancel</button>
                                    <button type="submit" className="btn btn-green flex-1 py-2 text-sm">Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            {/* Tabs */}
            <div className="flex mb-4 bg-bg-secondary rounded-lg overflow-hidden">
                {(['posts', 'media'] as const).map((tab) => (
                    <button key={tab} onClick={() => setActiveTab(tab)} className={cn('flex-1 text-sm font-medium py-2.5 text-center transition-colors capitalize', activeTab === tab ? 'bg-surface-hover text-primary' : 'text-muted hover:text-secondary')}>
                        {tab}
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
        </div>
    );
}
