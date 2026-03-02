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
        <div className="max-w-xl mx-auto px-4 py-6">
            <h1 className="text-lg font-bold mb-5">Direct Messages</h1>

            {conversations.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                    </div>
                    <p className="text-secondary text-sm font-medium">No conversations yet</p>
                    <p className="text-muted text-xs mt-1">Visit a profile to start chatting</p>
                </div>
            ) : (
                <div className="space-y-0.5">
                    {conversations.map((conv) => (
                        <Link
                            key={conv.id}
                            href={`/chat/${conv.id}`}
                            className="flex items-center gap-3 px-2.5 py-2 rounded-md hover:bg-surface-hover transition-colors block"
                        >
                            <div className="w-8 h-8 avatar text-xs flex-shrink-0">
                                {conv.otherUser.avatar_url ? (
                                    <img src={conv.otherUser.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                                ) : getInitials(conv.otherUser.full_name || conv.otherUser.username)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{conv.otherUser.full_name || conv.otherUser.username}</p>
                            </div>
                            <span className="text-[10px] text-muted">{formatRelativeTime(conv.updated_at)}</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
