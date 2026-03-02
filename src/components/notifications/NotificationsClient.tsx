'use client';

import { markNotificationRead, markAllNotificationsRead } from '@/app/(main)/actions';
import { formatRelativeTime, getInitials } from '@/lib/utils';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface NotificationsClientProps {
    notifications: {
        id: string;
        type: string;
        reference_id: string | null;
        read: boolean;
        created_at: string;
        profiles: {
            username: string;
            full_name: string | null;
            avatar_url: string | null;
        } | null;
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

function getNotificationIcon(type: string) {
    switch (type) {
        case 'like':
            return <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="none" className="text-danger"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>;
        case 'comment':
            return <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>;
        case 'follow':
            return <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>;
        case 'message':
            return <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>;
        default:
            return null;
    }
}

export default function NotificationsClient({ notifications }: NotificationsClientProps) {
    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <div className="max-w-xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold">Notifications</h1>
                {unreadCount > 0 && (
                    <form action={markAllNotificationsRead}>
                        <button type="submit" className="btn btn-ghost text-xs text-accent">
                            Mark all read
                        </button>
                    </form>
                )}
            </div>

            {notifications.length === 0 ? (
                <p className="text-center text-secondary text-sm py-16">No notifications yet</p>
            ) : (
                <div className="space-y-1">
                    {notifications.map((notification) => (
                        <div
                            key={notification.id}
                            onClick={() => !notification.read && markNotificationRead(notification.id)}
                            className={cn(
                                'card p-4 flex items-center gap-3 cursor-pointer transition-colors',
                                !notification.read && 'bg-blue-50/50 border-accent/10'
                            )}
                        >
                            <div className="w-9 h-9 avatar text-xs bg-bg-tertiary flex-shrink-0">
                                {notification.profiles?.avatar_url ? (
                                    <img src={notification.profiles.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" />
                                ) : (
                                    getInitials(notification.profiles?.full_name || notification.profiles?.username || '?')
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm">
                                    {notification.profiles ? (
                                        <Link href={`/profile/${notification.profiles.username}`} className="font-semibold hover:underline">
                                            {notification.profiles.full_name || notification.profiles.username}
                                        </Link>
                                    ) : (
                                        <span className="font-semibold">Someone</span>
                                    )}{' '}
                                    {getNotificationMessage(notification.type)}
                                </p>
                                <p className="text-xs text-secondary mt-0.5">{formatRelativeTime(notification.created_at)}</p>
                            </div>

                            <div className="flex-shrink-0">
                                {getNotificationIcon(notification.type)}
                            </div>

                            {!notification.read && (
                                <div className="w-2 h-2 bg-accent rounded-full flex-shrink-0" />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
