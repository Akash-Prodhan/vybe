'use client';

import { useState } from 'react';
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
    const [searchQuery, setSearchQuery] = useState('');

    const filtered = searchQuery.trim()
        ? conversations.filter(c =>
            c.otherUser.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.otherUser.username.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : conversations;

    return (
        <div className="chat-layout">
            <div className="chat-list-panel">
                {/* Header */}
                <div className="chat-list-header">
                    <h1 style={{ fontSize: '20px', fontWeight: 800 }}>Messenger</h1>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '50%',
                            background: 'var(--color-surface-hover)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: 'var(--color-secondary)'
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        </div>
                    </div>
                </div>

                {/* Search */}
                <div className="chat-search" style={{ position: 'relative' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ position: 'absolute', left: '28px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-muted)' }}>
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search conversations..."
                        style={{ paddingLeft: '40px' }}
                    />
                </div>

                {/* Conversation List */}
                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {filtered.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                            <div style={{ width: '64px', height: '64px', margin: '0 auto 16px', borderRadius: '50%', background: 'var(--color-accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                            </div>
                            <p style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>No conversations yet</p>
                            <p style={{ fontSize: '13px', color: 'var(--color-muted)' }}>Visit someone&apos;s profile to start chatting</p>
                        </div>
                    ) : (
                        filtered.map((conv, i) => (
                            <Link
                                key={conv.id}
                                href={`/chat/${conv.id}`}
                                className="chat-conversation-item"
                            >
                                <div style={{ position: 'relative' }}>
                                    <div className="w-12 h-12 avatar text-sm flex-shrink-0">
                                        {conv.otherUser.avatar_url ? (
                                            <img src={conv.otherUser.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover" />
                                        ) : getInitials(conv.otherUser.full_name || conv.otherUser.username)}
                                    </div>
                                    <div style={{
                                        position: 'absolute', bottom: '0', right: '0',
                                        width: '12px', height: '12px', borderRadius: '50%',
                                        background: 'var(--color-green)',
                                        border: '2px solid var(--color-bg-secondary)'
                                    }} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontSize: '15px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {conv.otherUser.full_name || conv.otherUser.username}
                                    </p>
                                    <p style={{ fontSize: '13px', color: 'var(--color-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        Tap to open chat
                                    </p>
                                </div>
                                <span style={{ fontSize: '11px', color: 'var(--color-muted)', whiteSpace: 'nowrap' }}>
                                    {formatRelativeTime(conv.updated_at)}
                                </span>
                            </Link>
                        ))
                    )}
                </div>
            </div>

            {/* Chat Window Placeholder */}
            <div className="chat-window" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-bg)' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ width: '80px', height: '80px', margin: '0 auto 20px', borderRadius: '50%', background: 'linear-gradient(135deg, #7616f3, #1877f2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                    </div>
                    <p style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Your Messages</p>
                    <p style={{ fontSize: '14px', color: 'var(--color-muted)', maxWidth: '300px' }}>Select a conversation from the left to start chatting</p>
                </div>
            </div>
        </div>
    );
}
