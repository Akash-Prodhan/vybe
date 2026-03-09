'use client';

import { useState } from 'react';
import { markNotificationRead, markAllNotificationsRead } from '@/app/(main)/actions';
import { formatRelativeTime, getInitials, cn } from '@/lib/utils';
import Link from 'next/link';

interface NotificationsClientProps {
    notifications: {
        id: string; type: string; reference_id: string | null; read: boolean; created_at: string;
        profiles: { username: string; full_name: string | null; avatar_url: string | null; } | null;
    }[];
    likesToday: number;
    newFollowersWeek: number;
}

const TABS = [
    { key: 'all', label: 'All' },
    { key: 'like', label: 'Likes' },
    { key: 'comment', label: 'Comments' },
    { key: 'follow', label: 'Follows' },
    { key: 'mention', label: 'Mentions' },
];

function getNotificationMessage(type: string) {
    switch (type) {
        case 'like': return 'liked your post';
        case 'comment': return 'commented on your post';
        case 'follow': return 'started following you';
        case 'new_follower': return 'started following you';
        case 'follow_request': return 'requested to follow you';
        case 'follow_accepted': return 'accepted your follow request';
        case 'message': return 'sent you a message';
        case 'mention': return 'mentioned you in a post';
        default: return 'interacted with you';
    }
}

function getNotificationIcon(type: string) {
    switch (type) {
        case 'like': return (
            <div className="notification-icon like">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
            </div>
        );
        case 'comment': return (
            <div className="notification-icon comment">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
            </div>
        );
        case 'follow': case 'new_follower': case 'follow_request': case 'follow_accepted': return (
            <div className="notification-icon follow">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
            </div>
        );
        case 'message': return (
            <div className="notification-icon message">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
            </div>
        );
        case 'mention': return (
            <div className="notification-icon mention">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4" /><path d="M16 8v5a3 3 0 006 0v-1a10 10 0 10-3.92 7.94" /></svg>
            </div>
        );
        default: return (
            <div className="notification-icon comment">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /></svg>
            </div>
        );
    }
}

export default function NotificationsClient({ notifications, likesToday, newFollowersWeek }: NotificationsClientProps) {
    const [activeTab, setActiveTab] = useState('all');
    const unreadCount = notifications.filter((n) => !n.read).length;

    const filtered = activeTab === 'all'
        ? notifications
        : notifications.filter(n => {
            if (activeTab === 'follow') return ['follow', 'new_follower', 'follow_request', 'follow_accepted'].includes(n.type);
            return n.type === activeTab;
        });

    return (
        <div className="feed-layout">
            <div className="feed-center" style={{ maxWidth: '700px' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h1 style={{ fontSize: '22px', fontWeight: 800 }}>Notifications</h1>
                    {unreadCount > 0 && (
                        <form action={markAllNotificationsRead}>
                            <button type="submit" className="btn btn-ghost" style={{ fontSize: '13px', color: 'var(--color-accent)' }}>Mark all read</button>
                        </form>
                    )}
                </div>

                {/* Filter Tabs */}
                <div className="notification-tabs">
                    {TABS.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={cn('notification-tab', activeTab === tab.key && 'active')}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Notification List */}
                {filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                        <div style={{ width: '56px', height: '56px', margin: '0 auto 16px', borderRadius: '50%', background: 'var(--color-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>
                        </div>
                        <p style={{ color: 'var(--color-secondary)', fontSize: '14px', fontWeight: 500 }}>No notifications yet</p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {filtered.map((n) => (
                            <div
                                key={n.id}
                                onClick={() => !n.read && markNotificationRead(n.id)}
                                className={cn('notification-card', !n.read && 'unread')}
                            >
                                {getNotificationIcon(n.type)}
                                <div className="w-8 h-8 avatar text-xs flex-shrink-0">
                                    {n.profiles?.avatar_url ? <img src={n.profiles.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" /> : getInitials(n.profiles?.full_name || n.profiles?.username || '?')}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: '14px' }}>
                                        {n.profiles ? (
                                            <Link href={`/profile/${n.profiles.username}`} style={{ fontWeight: 600, color: 'var(--color-primary)', textDecoration: 'none' }}>{n.profiles.full_name || n.profiles.username}</Link>
                                        ) : <span style={{ fontWeight: 600 }}>Someone</span>}{' '}
                                        <span style={{ color: 'var(--color-secondary)' }}>{getNotificationMessage(n.type)}</span>
                                    </p>
                                    <p style={{ fontSize: '11px', color: 'var(--color-muted)', marginTop: '2px' }}>{formatRelativeTime(n.created_at)}</p>
                                </div>
                                {!n.read && <div style={{ width: '8px', height: '8px', background: 'var(--color-accent)', borderRadius: '50%', flexShrink: 0 }} />}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Right Sidebar */}
            <aside className="feed-right-sidebar">
                <div className="glass-card">
                    <h3 className="sidebar-section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                        Quick Stats
                    </h3>
                    <div className="stat-card">
                        <div className="stat-card-icon" style={{ background: 'rgba(240, 40, 73, 0.1)', color: 'var(--color-rose)' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                        </div>
                        <div>
                            <div className="stat-card-value">{likesToday}</div>
                            <div className="stat-card-label">Likes today</div>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card-icon" style={{ background: 'rgba(118, 70, 255, 0.1)', color: 'var(--color-purple)' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
                        </div>
                        <div>
                            <div className="stat-card-value">{newFollowersWeek}</div>
                            <div className="stat-card-label">New followers this week</div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
}
