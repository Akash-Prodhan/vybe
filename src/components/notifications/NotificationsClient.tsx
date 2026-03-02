'use client';

import { markNotificationRead, markAllNotificationsRead } from '@/app/(main)/actions';
import { formatRelativeTime, getInitials, cn } from '@/lib/utils';
import Link from 'next/link';

interface NotificationsClientProps {
    notifications: {
        id: string; type: string; reference_id: string | null; read: boolean; created_at: string;
        profiles: { username: string; full_name: string | null; avatar_url: string | null; } | null;
    }[];
}

function getNotificationMessage(type: string) {
    switch (type) {
        case 'like': return 'liked your post';
        case 'comment': return 'commented on your post';
        case 'follow': return 'started following you';
        case 'message': return 'sent you a message';
        default: return 'interacted with you';
    }
}

export default function NotificationsClient({ notifications }: NotificationsClientProps) {
    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <div className="max-w-xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-5">
                <h1 className="text-lg font-bold">Notifications</h1>
                {unreadCount > 0 && (
                    <form action={markAllNotificationsRead}>
                        <button type="submit" className="btn btn-ghost text-xs text-accent">Mark all read</button>
                    </form>
                )}
            </div>

            {notifications.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>
                    </div>
                    <p className="text-secondary text-sm">No notifications yet</p>
                </div>
            ) : (
                <div className="space-y-0.5">
                    {notifications.map((n) => (
                        <div
                            key={n.id}
                            onClick={() => !n.read && markNotificationRead(n.id)}
                            className={cn(
                                'flex items-center gap-3 px-2.5 py-2.5 rounded-md cursor-pointer transition-colors',
                                n.read ? 'hover:bg-surface-hover' : 'bg-accent/5 hover:bg-accent/10'
                            )}
                        >
                            <div className="w-8 h-8 avatar text-xs flex-shrink-0">
                                {n.profiles?.avatar_url ? <img src={n.profiles.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" /> : getInitials(n.profiles?.full_name || n.profiles?.username || '?')}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm">
                                    {n.profiles ? (
                                        <Link href={`/profile/${n.profiles.username}`} className="font-semibold hover:underline text-primary">{n.profiles.full_name || n.profiles.username}</Link>
                                    ) : <span className="font-semibold">Someone</span>}{' '}
                                    <span className="text-secondary">{getNotificationMessage(n.type)}</span>
                                </p>
                                <p className="text-[10px] text-muted mt-0.5">{formatRelativeTime(n.created_at)}</p>
                            </div>
                            {!n.read && <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
