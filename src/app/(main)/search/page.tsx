'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { getInitials, cn } from '@/lib/utils';

type TabKey = 'all' | 'people' | 'posts' | 'groups';

const TABS: { key: TabKey; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'people', label: 'People' },
    { key: 'posts', label: 'Posts' },
    { key: 'groups', label: 'Groups' },
];

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [activeTab, setActiveTab] = useState<TabKey>('all');
    const [userResults, setUserResults] = useState<any[]>([]);
    const [postResults, setPostResults] = useState<any[]>([]);
    const [groupResults, setGroupResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    async function handleSearch(e?: React.FormEvent) {
        e?.preventDefault();
        if (!query.trim()) return;
        setLoading(true);
        setSearched(true);
        const supabase = createClient();

        // Search users
        const { data: users } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url, bio, follower_count')
            .ilike('username', `%${query}%`)
            .limit(20);
        setUserResults(users || []);

        // Search posts
        const { data: posts } = await supabase
            .from('posts')
            .select(`id, content, image_url, created_at, user_id, profiles!posts_user_id_fkey (username, full_name, avatar_url)`)
            .ilike('content', `%${query}%`)
            .is('deleted_at', null)
            .order('created_at', { ascending: false })
            .limit(20);
        setPostResults(posts || []);

        // Search groups
        const { data: groups } = await supabase
            .from('conversations')
            .select('id, group_name, group_avatar_url, created_at')
            .eq('is_group', true)
            .ilike('group_name', `%${query}%`)
            .limit(10);
        setGroupResults(groups || []);

        setLoading(false);
    }

    const filteredUsers = (activeTab === 'all' || activeTab === 'people') ? userResults : [];
    const filteredPosts = (activeTab === 'all' || activeTab === 'posts') ? postResults : [];
    const filteredGroups = (activeTab === 'all' || activeTab === 'groups') ? groupResults : [];
    const hasResults = filteredUsers.length > 0 || filteredPosts.length > 0 || filteredGroups.length > 0;

    return (
        <div className="feed-layout">
            <div className="feed-center" style={{ maxWidth: '700px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '20px' }}>Explore</h1>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="explore-search-bar">
                    <span className="search-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                    </span>
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search people, posts, groups..."
                    />
                </form>

                {/* Filter Tabs */}
                <div className="explore-tabs">
                    {TABS.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={cn('explore-tab', activeTab === tab.key && 'active')}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Loading */}
                {loading && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {[1, 2, 3].map((i) => <div key={i} className="skeleton" style={{ height: '52px', borderRadius: '12px' }} />)}
                    </div>
                )}

                {/* No results */}
                {!loading && searched && !hasResults && (
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                        <p style={{ color: 'var(--color-muted)', fontSize: '14px' }}>No results found for &quot;{query}&quot;</p>
                    </div>
                )}

                {/* People Results */}
                {!loading && filteredUsers.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>People</h3>
                        <div className="glass-card" style={{ padding: '8px' }}>
                            {filteredUsers.map((user) => (
                                <Link key={user.id} href={`/profile/${user.username}`} className="suggested-user" style={{ padding: '10px 12px' }}>
                                    <div className="w-10 h-10 avatar text-xs flex-shrink-0">
                                        {user.avatar_url ? <img src={user.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" /> : getInitials(user.full_name || user.username)}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-primary)' }}>{user.full_name || user.username}</p>
                                        <p style={{ fontSize: '12px', color: 'var(--color-muted)' }}>@{user.username} · {user.follower_count || 0} followers</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Post Results */}
                {!loading && filteredPosts.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Posts</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {filteredPosts.map((post: any) => (
                                <div key={post.id} className="glass-card" style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                        <div className="w-8 h-8 avatar text-xs flex-shrink-0">
                                            {post.profiles?.avatar_url ? <img src={post.profiles.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" /> : getInitials(post.profiles?.full_name || post.profiles?.username || '?')}
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-primary)' }}>{post.profiles?.full_name || post.profiles?.username}</p>
                                            <p style={{ fontSize: '11px', color: 'var(--color-muted)' }}>@{post.profiles?.username}</p>
                                        </div>
                                    </div>
                                    <p style={{ fontSize: '14px', color: 'var(--color-primary)', lineHeight: 1.5 }}>{post.content}</p>
                                    {post.image_url && <img src={post.image_url} alt="" style={{ width: '100%', borderRadius: '12px', marginTop: '10px', maxHeight: '200px', objectFit: 'cover' }} />}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Group Results */}
                {!loading && filteredGroups.length > 0 && (
                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-muted)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Groups</h3>
                        <div className="groups-grid">
                            {filteredGroups.map((group: any) => (
                                <Link key={group.id} href={`/chat/${group.id}`} className="group-card">
                                    <div className="group-card-banner">
                                        <span style={{ fontSize: '28px', fontWeight: 700, color: 'white' }}>{group.group_name?.charAt(0)?.toUpperCase() || 'G'}</span>
                                    </div>
                                    <div className="group-card-body">
                                        <p className="group-card-name">{group.group_name}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Placeholder */}
                {!searched && (
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                        <div style={{ width: '56px', height: '56px', margin: '0 auto 16px', borderRadius: '50%', background: 'var(--color-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                        </div>
                        <p style={{ color: 'var(--color-secondary)', fontSize: '14px', fontWeight: 500 }}>Search for people, posts, and groups</p>
                    </div>
                )}
            </div>

            {/* Right Sidebar */}
            <aside className="feed-right-sidebar">
                <div className="glass-card">
                    <h3 className="sidebar-section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
                        Explore Vybe
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--color-secondary)', lineHeight: 1.6 }}>
                        Discover new people, trending posts, and active groups. Use the search bar to find exactly what you&apos;re looking for.
                    </p>
                </div>
            </aside>
        </div>
    );
}
