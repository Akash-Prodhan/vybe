'use client';

import { useState } from 'react';
import Link from 'next/link';
import CreateGroupButton from '@/components/groups/CreateGroupButton';

interface GroupsClientProps {
    groups: {
        id: string;
        group_name: string | null;
        group_avatar_url: string | null;
        memberCount: number;
    }[];
}

export default function GroupsClient({ groups }: GroupsClientProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filtered = searchQuery.trim()
        ? groups.filter(g => g.group_name?.toLowerCase().includes(searchQuery.toLowerCase()))
        : groups;

    return (
        <div className="feed-layout">
            <div className="feed-center" style={{ maxWidth: '800px' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h1 style={{ fontSize: '22px', fontWeight: 800 }}>Groups</h1>
                    <CreateGroupButton />
                </div>

                {/* Search */}
                <div className="explore-search-bar" style={{ marginBottom: '24px' }}>
                    <span className="search-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                    </span>
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search groups..."
                    />
                </div>

                {/* Groups Grid */}
                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                        <div style={{ width: '56px', height: '56px', margin: '0 auto 16px', borderRadius: '50%', background: 'var(--color-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
                        </div>
                        <p style={{ color: 'var(--color-secondary)', fontSize: '14px', fontWeight: 500 }}>
                            {searchQuery ? 'No groups match your search' : 'No groups yet'}
                        </p>
                        <p style={{ color: 'var(--color-muted)', fontSize: '12px', marginTop: '4px' }}>Create a group to get started</p>
                    </div>
                ) : (
                    <div className="groups-grid">
                        {filtered.map((group) => (
                            <Link key={group.id} href={`/chat/${group.id}`} className="group-card">
                                <div className="group-card-banner">
                                    {group.group_avatar_url ? (
                                        <img src={group.group_avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <span style={{ fontSize: '32px', fontWeight: 700, color: 'white' }}>
                                            {group.group_name?.charAt(0)?.toUpperCase() || 'G'}
                                        </span>
                                    )}
                                </div>
                                <div className="group-card-body">
                                    <p className="group-card-name">{group.group_name}</p>
                                    <p className="group-card-meta">{group.memberCount} members</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Right Sidebar */}
            <aside className="feed-right-sidebar">
                <div className="glass-card">
                    <h3 className="sidebar-section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
                        About Groups
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--color-secondary)', lineHeight: 1.6 }}>
                        Groups let you connect with people who share your interests. Create or join a group to start discussions, share content, and collaborate.
                    </p>
                </div>
            </aside>
        </div>
    );
}
