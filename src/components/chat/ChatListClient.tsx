'use client';

import Link from 'next/link';
import { getInitials, formatRelativeTime } from '@/lib/utils';

interface ChatListClientProps {
    conversations: {
        id: string;
        updated_at: string;
        otherUser: {
            username: string;
            full_name: string | null;
            avatar_url: string | null;
        };
    }[];
    currentUserId: string;
}

export default function ChatListClient({ conversations, currentUserId }: ChatListClientProps) {
    return (
        <div className="max-w-xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold">Messages</h1>
            </div>

            {conversations.length === 0 ? (
                <div className="text-center py-16">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mx-auto text-border mb-4"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                    <p className="text-secondary text-sm">No conversations yet</p>
                    <p className="text-secondary/60 text-xs mt-1">Visit a profile to start chatting</p>
                </div>
            ) : (
                <div className="space-y-1">
                    {conversations.map((conv) => (
                        <Link
                            key={conv.id}
                            href={`/chat/${conv.id}`}
                            className="card p-4 flex items-center gap-3 hover:bg-bg-secondary transition-colors block"
                        >
                            <div className="w-11 h-11 avatar text-sm bg-bg-tertiary flex-shrink-0">
                                {conv.otherUser.avatar_url ? (
                                    <img src={conv.otherUser.avatar_url} alt="" className="w-11 h-11 rounded-full object-cover" />
                                ) : (
                                    getInitials(conv.otherUser.full_name || conv.otherUser.username)
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">
                                    {conv.otherUser.full_name || conv.otherUser.username}
                                </p>
                                <p className="text-xs text-secondary">@{conv.otherUser.username}</p>
                            </div>
                            <span className="text-xs text-secondary/60">{formatRelativeTime(conv.updated_at)}</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
