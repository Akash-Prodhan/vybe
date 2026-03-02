'use client';

import { useState } from 'react';
import { toggleFollow, updateProfile } from '@/app/(main)/actions';
import { signOut } from '@/app/(auth)/actions';
import { getOrCreateConversation } from '@/app/(main)/chat/actions';
import { getInitials } from '@/lib/utils';
import PostCard from '@/components/feed/PostCard';
import { useRouter } from 'next/navigation';

interface ProfileClientProps {
    profile: {
        id: string;
        username: string;
        full_name: string | null;
        avatar_url: string | null;
        bio: string | null;
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
    const router = useRouter();

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
        <div className="max-w-xl mx-auto px-4 py-6">
            {/* Profile header */}
            <div className="card p-6 mb-6">
                <div className="flex items-start gap-4">
                    <div className="w-16 h-16 avatar text-lg bg-bg-tertiary flex-shrink-0">
                        {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt={profile.username} className="w-16 h-16 rounded-full object-cover" />
                        ) : (
                            getInitials(profile.full_name || profile.username)
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-lg font-bold">{profile.full_name || profile.username}</h1>
                                <p className="text-sm text-secondary">@{profile.username}</p>
                            </div>

                            {isOwnProfile ? (
                                <div className="flex gap-2">
                                    <button onClick={() => setEditing(!editing)} className="btn btn-secondary text-xs px-3 py-1.5">
                                        Edit
                                    </button>
                                    <form action={signOut}>
                                        <button type="submit" className="btn btn-ghost text-xs px-3 py-1.5 text-danger">
                                            Logout
                                        </button>
                                    </form>
                                </div>
                            ) : (
                                <div className="flex gap-2">
                                    <button onClick={handleFollow} className={`btn text-xs px-4 py-1.5 ${following ? 'btn-secondary' : 'btn-primary'}`}>
                                        {following ? 'Unfollow' : 'Follow'}
                                    </button>
                                    <button
                                        onClick={async () => {
                                            const result = await getOrCreateConversation(profile.id);
                                            if (result.conversationId) {
                                                router.push(`/chat/${result.conversationId}`);
                                            }
                                        }}
                                        className="btn btn-secondary text-xs px-3 py-1.5"
                                        title="Send message"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                                    </button>
                                </div>
                            )}
                        </div>

                        {profile.bio && (
                            <p className="text-sm mt-2 leading-relaxed">{profile.bio}</p>
                        )}

                        <div className="flex gap-6 mt-3">
                            <span className="text-sm"><strong>{fCount}</strong> <span className="text-secondary">followers</span></span>
                            <span className="text-sm"><strong>{followingCount}</strong> <span className="text-secondary">following</span></span>
                            <span className="text-sm"><strong>{posts.length}</strong> <span className="text-secondary">posts</span></span>
                        </div>
                    </div>
                </div>

                {/* Edit form */}
                {editing && isOwnProfile && (
                    <form action={handleEditSubmit} className="mt-4 pt-4 border-t border-border-light slide-up space-y-3">
                        <input name="username" defaultValue={profile.username} placeholder="Username" className="input" />
                        <input name="full_name" defaultValue={profile.full_name || ''} placeholder="Full name" className="input" />
                        <textarea name="bio" defaultValue={profile.bio || ''} placeholder="Bio" rows={3} className="input resize-none" maxLength={160} />
                        <div>
                            <label className="text-xs text-secondary block mb-1">Avatar</label>
                            <input name="avatar" type="file" accept="image/*" className="text-sm" />
                        </div>
                        <button type="submit" className="btn btn-primary text-xs px-4 py-2">Save Changes</button>
                    </form>
                )}
            </div>

            {/* User posts */}
            <h2 className="text-sm font-semibold text-secondary mb-3">Posts</h2>
            {posts.length === 0 ? (
                <p className="text-center text-secondary text-sm py-8">No posts yet</p>
            ) : (
                posts.map((post) => (
                    <PostCard key={post.id} post={post} currentUserId={currentUserId} />
                ))
            )}
        </div>
    );
}
