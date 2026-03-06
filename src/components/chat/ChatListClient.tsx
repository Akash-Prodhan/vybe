'use client';

import Link from 'next/link';
import { getInitials, formatRelativeTime } from '@/lib/utils';

interface ChatListClientProps {
    conversations: {
        id: string;
        updated_at: string;
        otherUser: { username: string; full_name: string | null; avatar_url: string | null };
    }[];
    currentUserId: string;
}

export default function ChatListClient({ conversations, currentUserId }: ChatListClientProps) {
    return (
        <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="px-5 py-4 bg-bg-secondary border-b border-border-light sticky top-0 z-10 flex items-center justify-between">
                <h1 className="text-xl font-bold">Chats</h1>
                <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-bg-tertiary flex items-center justify-center text-secondary hover:bg-border transition-colors cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                    </div>
                </div>
            </div>

            {conversations.length === 0 ? (
                <div className="text-center py-20 fade-in">
                    <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-accent/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                    </div>
                    <p className="text-lg font-semibold mb-1">No conversations yet</p>
                    <p className="text-muted text-sm">Visit someone&apos;s profile to start chatting</p>
                </div>
            ) : (
                <div className="divide-y divide-border-light">
                    {conversations.map((conv, i) => (
                        <Link
                            key={conv.id}
                            href={`/chat/${conv.id}`}
                            className={`flex items-center gap-3 px-5 py-3 hover:bg-surface-hover transition-all duration-200 fade-in stagger-${Math.min(i + 1, 4)}`}
                        >
                            <div className="relative">
                                <div className="w-12 h-12 avatar text-sm flex-shrink-0">
                                    {conv.otherUser.avatar_url ? (
                                        <img src={conv.otherUser.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover" />
                                    ) : getInitials(conv.otherUser.full_name || conv.otherUser.username)}
                                </div>
                                <div className="badge-online absolute -bottom-0.5 -right-0.5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[15px] font-semibold truncate">{conv.otherUser.full_name || conv.otherUser.username}</p>
                                <p className="text-sm text-muted truncate">Tap to open chat</p>
                            </div>
                            <span className="text-xs text-muted whitespace-nowrap">{formatRelativeTime(conv.updated_at)}</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
