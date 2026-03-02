'use client';

import { useState } from 'react';
import { toggleFollow, updateProfile } from '@/app/(main)/actions';
import { signOut } from '@/app/(auth)/actions';
import { getOrCreateConversation } from '@/app/(main)/chat/actions';
import { getInitials, formatDate, cn } from '@/lib/utils';
import PostCard from '@/components/feed/PostCard';
import { useRouter } from 'next/navigation';

interface ProfileClientProps {
    profile: {
        id: string;
        username: string;
        full_name: string | null;
        avatar_url: string | null;
        bio: string | null;
        created_at?: string;
    };
    posts: any[];
    followersCount: number;
    followingCount: number;
    currentUserId: string;
    isOwnProfile: boolean;
    isFollowing?: boolean;
}

export default function ProfileClient({
    profile,
    posts,
    followersCount,
    followingCount,
    currentUserId,
    isOwnProfile,
    isFollowing = false,
}: ProfileClientProps) {
    const [following, setFollowing] = useState(isFollowing);
    const [editing, setEditing] = useState(false);
    const [fCount, setFCount] = useState(followersCount);
    const [activeTab, setActiveTab] = useState<'posts' | 'media'>('posts');
    const router = useRouter();

    const mediaPosts = posts.filter((p) => p.image_url);

    async function handleFollow() {
        setFollowing(!following);
        setFCount((c) => (following ? c - 1 : c + 1));
        await toggleFollow(profile.id);
    }

    async function handleEditSubmit(formData: FormData) {
        const result = await updateProfile(formData);
        if (!result.error) {
            setEditing(false);
            router.refresh();
        }
    }

    return (
        <div className="max-w-xl mx-auto px-4 py-6 fade-in">
            {/* Cover / Banner */}
            <div className="relative h-36 rounded-2xl bg-gradient-to-br from-accent/20 via-accent/10 to-rose/20 mb-12 overflow-hidden">
                <div className="absolute inset-0 gradient-mesh opacity-60" />

                {/* Avatar */}
                <div className="absolute -bottom-10 left-6">
                    <div className="avatar-ring">
                        <div className="w-20 h-20 avatar text-xl bg-bg-tertiary">
                            {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt={profile.username} className="w-20 h-20 rounded-full object-cover" />
                            ) : (
                                getInitials(profile.full_name || profile.username)
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Info */}
            <div className="card p-6 mb-4">
                <div className="flex items-start justify-between mb-3">
                    <div>
                        <h1 className="text-xl font-bold font-display">{profile.full_name || profile.username}</h1>
                        <p className="text-sm text-secondary">@{profile.username}</p>
                    </div>

                    {isOwnProfile ? (
                        <div className="flex gap-2">
                            <button onClick={() => setEditing(!editing)} className="btn btn-secondary text-xs px-4 py-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                Edit
                            </button>
                            <form action={signOut}>
                                <button type="submit" className="btn btn-ghost text-xs px-3 py-2 text-danger">
                                    Logout
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <button onClick={handleFollow} className={cn('btn text-xs px-4 py-2 font-semibold', following ? 'btn-secondary' : 'btn-primary')}>
                                {following ? 'Following' : 'Follow'}
                            </button>
                            <button
                                onClick={async () => {
                                    const result = await getOrCreateConversation(profile.id);
                                    if (result.conversationId) router.push(`/chat/${result.conversationId}`);
                                }}
                                className="btn btn-secondary text-xs px-3 py-2"
                                title="Send message"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                            </button>
                        </div>
                    )}
                </div>

                {profile.bio && (
                    <p className="text-sm leading-relaxed mb-3">{profile.bio}</p>
                )}

                {/* Joined date */}
                {profile.created_at && (
                    <p className="text-xs text-secondary/60 flex items-center gap-1 mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                        Joined {formatDate(profile.created_at)}
                    </p>
                )}

                {/* Stats */}
                <div className="flex gap-5">
                    <span className="text-sm group cursor-default">
                        <strong className="font-semibold">{fCount}</strong>{' '}
                        <span className="text-secondary group-hover:text-accent transition-colors">followers</span>
                    </span>
                    <span className="text-sm group cursor-default">
                        <strong className="font-semibold">{followingCount}</strong>{' '}
                        <span className="text-secondary group-hover:text-accent transition-colors">following</span>
                    </span>
                    <span className="text-sm group cursor-default">
                        <strong className="font-semibold">{posts.length}</strong>{' '}
                        <span className="text-secondary group-hover:text-accent transition-colors">posts</span>
                    </span>
                </div>

                {/* Edit form modal */}
                {editing && isOwnProfile && (
                    <form action={handleEditSubmit} className="mt-4 pt-4 border-t border-border-light slide-up space-y-3">
                        <input name="username" defaultValue={profile.username} placeholder="Username" className="input" />
                        <input name="full_name" defaultValue={profile.full_name || ''} placeholder="Full name" className="input" />
                        <textarea name="bio" defaultValue={profile.bio || ''} placeholder="Bio" rows={3} className="input resize-none" maxLength={160} />
                        <div>
                            <label className="text-xs text-secondary block mb-1">Avatar</label>
                            <input name="avatar" type="file" accept="image/*" className="text-sm" />
                        </div>
                        <div className="flex gap-2">
                            <button type="submit" className="btn btn-primary text-xs px-4 py-2">Save Changes</button>
                            <button type="button" onClick={() => setEditing(false)} className="btn btn-secondary text-xs px-4 py-2">Cancel</button>
                        </div>
                    </form>
                )}
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border mb-4">
                <button
                    onClick={() => setActiveTab('posts')}
                    className={cn(
                        'flex-1 text-sm font-medium py-3 text-center transition-colors border-b-2',
                        activeTab === 'posts'
                            ? 'text-accent border-accent'
                            : 'text-secondary border-transparent hover:text-primary'
                    )}
                >
                    Posts
                </button>
                <button
                    onClick={() => setActiveTab('media')}
                    className={cn(
                        'flex-1 text-sm font-medium py-3 text-center transition-colors border-b-2',
                        activeTab === 'media'
                            ? 'text-accent border-accent'
                            : 'text-secondary border-transparent hover:text-primary'
                    )}
                >
                    Media
                </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'posts' ? (
                <>
                    {posts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-secondary text-sm">No posts yet</p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <PostCard key={post.id} post={post} currentUserId={currentUserId} />
                        ))
                    )}
                </>
            ) : (
                <>
                    {mediaPosts.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-secondary text-sm">No media yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-3 gap-1 rounded-xl overflow-hidden">
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
