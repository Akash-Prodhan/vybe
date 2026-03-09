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
    profile: {
        id: string; username: string; full_name: string | null; avatar_url: string | null;
        bio: string | null; created_at?: string; is_private?: boolean;
        follower_count?: number; following_count?: number; post_count?: number;
        location?: string | null; cover_photo_url?: string | null; website?: string | null;
    };
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
    const [activeTab, setActiveTab] = useState<'posts' | 'media' | 'likes'>('posts');
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
            <div className="feed-layout">
                <div className="feed-center" style={{ maxWidth: '700px', textAlign: 'center', padding: '80px 0' }}>
                    <div className="glass-card" style={{ padding: '40px' }}>
                        <p style={{ color: 'var(--color-secondary)', fontSize: '14px' }}>You have blocked this user</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="feed-layout">
            <div className="feed-center" style={{ maxWidth: '700px' }}>
                {/* Cover Photo */}
                <div className="profile-cover">
                    {profile.cover_photo_url && <img src={profile.cover_photo_url} alt="" />}
                    <div className="profile-cover-overlay" />
                    <div className="profile-avatar-wrap">
                        {profile.avatar_url ? (
                            <img src={profile.avatar_url} alt={profile.username} className="profile-avatar-large" />
                        ) : (
                            <div className="profile-avatar-large">{getInitials(profile.full_name || profile.username)}</div>
                        )}
                    </div>
                </div>

                {/* Profile Info Card */}
                <div className="glass-card" style={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <h1 style={{ fontSize: '20px', fontWeight: 800 }}>{profile.full_name || profile.username}</h1>
                                {profile.is_private && (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ color: 'var(--color-muted)' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                                )}
                            </div>
                            <p style={{ fontSize: '14px', color: 'var(--color-muted)', marginBottom: '8px' }}>@{profile.username}</p>
                        </div>

                        {isOwnProfile ? (
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => setEditing(!editing)} className="btn btn-primary" style={{ fontSize: '13px', padding: '8px 20px' }}>Edit Profile</button>
                                <form action={signOut}>
                                    <button type="submit" className="btn btn-ghost" style={{ fontSize: '13px', color: 'var(--color-danger)' }}>Logout</button>
                                </form>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <button onClick={handleFollow} className={cn('btn', following ? 'btn-secondary' : requested ? 'btn-outline' : 'btn-primary')} style={{ fontSize: '13px', padding: '8px 20px' }}>
                                    {following ? 'Following' : requested ? 'Requested' : 'Follow'}
                                </button>
                                <button onClick={async () => { const r = await getOrCreateConversation(profile.id); if (r.conversationId) router.push(`/chat/${r.conversationId}`); }} className="btn btn-secondary" style={{ padding: '8px' }} title="Message">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                                </button>
                                <div style={{ position: 'relative' }}>
                                    <button onClick={() => setShowMenu(!showMenu)} className="btn btn-ghost" style={{ padding: '8px', color: 'var(--color-muted)' }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
                                    </button>
                                    {showMenu && (
                                        <div style={{ position: 'absolute', right: 0, top: '36px', background: 'var(--color-bg-tertiary)', borderRadius: '10px', padding: '4px', minWidth: '140px', zIndex: 10, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}>
                                            <button onClick={handleBlock} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', fontSize: '13px', borderRadius: '8px', width: '100%', border: 'none', cursor: 'pointer', background: 'none', color: 'var(--color-secondary)' }}>Block</button>
                                            <button onClick={() => { setShowReport(true); setShowMenu(false); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', fontSize: '13px', borderRadius: '8px', width: '100%', border: 'none', cursor: 'pointer', background: 'none', color: 'var(--color-danger)' }}>Report</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {profile.bio && <p style={{ fontSize: '14px', color: 'var(--color-secondary)', marginBottom: '12px', lineHeight: 1.5 }}>{profile.bio}</p>}

                    {/* Meta info: location, join date, website */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                        {profile.location && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--color-muted)' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                {profile.location}
                            </span>
                        )}
                        {profile.created_at && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--color-muted)' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                Joined {formatDate(profile.created_at)}
                            </span>
                        )}
                        {profile.website && (
                            <a href={profile.website} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--color-accent)', textDecoration: 'none' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>
                                {profile.website.replace(/^https?:\/\//, '')}
                            </a>
                        )}
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'flex', gap: '24px' }}>
                        <div className="profile-stat">
                            <div className="profile-stat-value">{profile.post_count ?? posts.length}</div>
                            <div className="profile-stat-label">Posts</div>
                        </div>
                        <div className="profile-stat">
                            <div className="profile-stat-value">{fCount}</div>
                            <div className="profile-stat-label">Followers</div>
                        </div>
                        <div className="profile-stat">
                            <div className="profile-stat-value">{profile.following_count ?? followingCount}</div>
                            <div className="profile-stat-label">Following</div>
                        </div>
                    </div>
                </div>

                {/* Private account guard */}
                {profile.is_private && !isOwnProfile && !following && (
                    <div className="glass-card" style={{ textAlign: 'center', padding: '40px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ margin: '0 auto 12px', display: 'block', color: 'var(--color-muted)' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                        <p style={{ color: 'var(--color-secondary)', fontSize: '14px', fontWeight: 500 }}>This account is private</p>
                        <p style={{ color: 'var(--color-muted)', fontSize: '12px', marginTop: '4px' }}>Follow to see their posts</p>
                    </div>
                )}

                {/* Content */}
                {(!profile.is_private || isOwnProfile || following) && (
                    <>
                        {/* Tabs */}
                        <div className="profile-tabs">
                            {(['posts', 'media', 'likes'] as const).map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setActiveTab(t)}
                                    className={cn('profile-tab', activeTab === t && 'active')}
                                    style={{ textTransform: 'capitalize' }}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>

                        {activeTab === 'posts' ? (
                            posts.length === 0 ? <p style={{ textAlign: 'center', color: 'var(--color-muted)', fontSize: '14px', padding: '48px 0' }}>No posts yet</p> :
                                posts.map((post) => <PostCard key={post.id} post={post} currentUserId={currentUserId} />)
                        ) : activeTab === 'media' ? (
                            mediaPosts.length === 0 ? <p style={{ textAlign: 'center', color: 'var(--color-muted)', fontSize: '14px', padding: '48px 0' }}>No media yet</p> :
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', borderRadius: '12px', overflow: 'hidden' }}>
                                    {mediaPosts.map((post) => (
                                        <div key={post.id} style={{ aspectRatio: '1', overflow: 'hidden', background: 'var(--color-bg-tertiary)' }}>
                                            {/\.(mp4|webm|ogg|mov)$/i.test(post.image_url) ? (
                                                <video src={post.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                            ) : (
                                                <img src={post.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 300ms' }} />
                                            )}
                                        </div>
                                    ))}
                                </div>
                        ) : (
                            <p style={{ textAlign: 'center', color: 'var(--color-muted)', fontSize: '14px', padding: '48px 0' }}>Liked posts will appear here</p>
                        )}
                    </>
                )}

                {/* Edit modal */}
                {editing && isOwnProfile && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={() => setEditing(false)}>
                        <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: 0 }} onClick={(e) => e.stopPropagation()}>
                            <div style={{ height: '96px', borderRadius: '16px 16px 0 0', background: 'linear-gradient(135deg, #7616f3, #1877f2)', position: 'relative' }}>
                                <div style={{ position: 'absolute', bottom: '-32px', left: '20px' }}>
                                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '4px solid var(--color-surface)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg-secondary)' }}>
                                        {profile.avatar_url ? <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div className="avatar" style={{ width: '100%', height: '100%', fontSize: '18px' }}>{getInitials(profile.full_name || profile.username)}</div>}
                                    </div>
                                </div>
                            </div>
                            <form action={handleEditSubmit} style={{ padding: '48px 20px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Username</label>
                                    <input name="username" defaultValue={profile.username} className="input" minLength={3} maxLength={30} pattern="^[a-z0-9_.]+$" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Display Name</label>
                                    <input name="full_name" defaultValue={profile.full_name || ''} className="input" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Bio</label>
                                    <textarea name="bio" defaultValue={profile.bio || ''} rows={3} className="input" style={{ resize: 'none' }} maxLength={160} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: 'var(--color-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>Avatar</label>
                                    <input name="avatar" type="file" accept="image/jpeg,image/png,image/webp" style={{ fontSize: '13px', color: 'var(--color-muted)' }} />
                                </div>
                                <div style={{ display: 'flex', gap: '8px', paddingTop: '8px' }}>
                                    <button type="button" onClick={() => setEditing(false)} className="btn btn-ghost" style={{ flex: 1, padding: '10px' }}>Cancel</button>
                                    <button type="submit" className="btn btn-primary" style={{ flex: 1, padding: '10px' }}>Save Changes</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Report modal */}
                {showReport && (
                    <div style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={() => setShowReport(false)}>
                        <div className="glass-card" style={{ width: '100%', maxWidth: '360px' }} onClick={(e) => e.stopPropagation()}>
                            <h3 style={{ fontWeight: 700, marginBottom: '12px' }}>Report User</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {['spam', 'harassment', 'nudity', 'misinformation', 'violence', 'other'].map((reason) => (
                                    <button key={reason} onClick={() => handleReport(reason)} style={{ width: '100%', textAlign: 'left', padding: '10px 12px', borderRadius: '8px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', textTransform: 'capitalize', color: 'var(--color-primary)' }}>{reason}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Right Sidebar */}
            <aside className="feed-right-sidebar">
                <div className="glass-card">
                    <h3 className="sidebar-section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        About
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div className="stat-card">
                            <div>
                                <div className="stat-card-value">{profile.post_count ?? posts.length}</div>
                                <div className="stat-card-label">Total posts</div>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div>
                                <div className="stat-card-value">{fCount}</div>
                                <div className="stat-card-label">Followers</div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
}
