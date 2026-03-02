'use client';

import { useState, useEffect, useRef } from 'react';
import { sendMessage } from '@/app/(main)/chat/actions';
import { createClient } from '@/lib/supabase/client';
import { getInitials, formatRelativeTime, cn } from '@/lib/utils';
import Link from 'next/link';
import GroupInfo from '@/components/groups/GroupInfo';

interface ChatRoomProps {
    conversationId: string;
    currentUserId: string;
    otherUser?: { username: string; full_name: string | null; avatar_url: string | null } | null;
    isGroup?: boolean;
    groupName?: string;
    isGroupAdmin?: boolean;
    initialMessages: {
        id: string;
        content: string;
        created_at: string;
        sender_id: string;
        profiles: { username: string; avatar_url: string | null };
    }[];
}

export default function ChatRoom({ conversationId, currentUserId, otherUser, isGroup, groupName, isGroupAdmin, initialMessages }: ChatRoomProps) {
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        const supabase = createClient();
        const channel = supabase
            .channel(`chat:${conversationId}`)
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${conversationId}` },
                async (payload) => {
                    const newMsg = payload.new as any;
                    if (messages.some((m) => m.id === newMsg.id)) return;
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('username, avatar_url')
                        .eq('id', newMsg.sender_id)
                        .single();
                    setMessages((prev) => [...prev, { ...newMsg, profiles: profile || { username: 'Unknown', avatar_url: null } }]);
                }
            )
            .subscribe();
        return () => { supabase.removeChannel(channel); };
    }, [conversationId]);

    async function handleSend(e: React.FormEvent) {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;
        const content = newMessage.trim();
        setNewMessage('');
        setSending(true);
        const optimisticMsg = {
            id: `temp-${Date.now()}`,
            content,
            created_at: new Date().toISOString(),
            sender_id: currentUserId,
            profiles: { username: 'You', avatar_url: null },
        };
        setMessages((prev) => [...prev, optimisticMsg]);
        await sendMessage(conversationId, content);
        setSending(false);
        inputRef.current?.focus();
    }

    const title = isGroup ? groupName : (otherUser?.full_name || otherUser?.username || 'Chat');

    return (
        <div className="flex flex-col h-screen md:h-[calc(100vh)]">
            {/* Header - Discord style */}
            <div className="flex items-center gap-3 px-4 h-12 shadow-[0_1px_0_0] shadow-bg-tertiary bg-bg flex-shrink-0">
                <Link href={isGroup ? '/groups' : '/chat'} className="btn btn-ghost p-1 md:hidden text-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                </Link>

                {isGroup ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted flex-shrink-0"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
                ) : (
                    <span className="text-muted text-lg font-bold">@</span>
                )}

                <span className="text-sm font-semibold truncate">{title}</span>

                <div className="ml-auto flex items-center gap-1">
                    {isGroup && (
                        <GroupInfo groupId={conversationId} groupName={groupName || 'Group'} currentUserId={currentUserId} isAdmin={isGroupAdmin || false} />
                    )}
                </div>
            </div>

            {/* Messages - Discord style (no bubbles, left-aligned) */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
                {messages.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-accent/10 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                        </div>
                        <p className="text-primary font-semibold">
                            {isGroup ? `Welcome to ${groupName}!` : `This is the beginning of your DM with ${otherUser?.username}`}
                        </p>
                        <p className="text-muted text-sm mt-1">Send a message to get started 👋</p>
                    </div>
                )}

                {messages.map((msg, i) => {
                    const isMine = msg.sender_id === currentUserId;
                    const showAvatar = i === 0 || messages[i - 1].sender_id !== msg.sender_id;

                    return (
                        <div
                            key={msg.id}
                            className={cn(
                                'group flex gap-3 px-2 py-0.5 hover:bg-surface-hover/50 rounded',
                                showAvatar && 'mt-3 pt-1'
                            )}
                        >
                            {/* Avatar column */}
                            <div className="w-8 flex-shrink-0">
                                {showAvatar && (
                                    <div className="w-8 h-8 avatar text-[10px]">
                                        {msg.profiles?.avatar_url ? (
                                            <img src={msg.profiles.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                                        ) : (
                                            getInitials(msg.profiles?.username || '')
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                {showAvatar && (
                                    <div className="flex items-baseline gap-2">
                                        <span className={cn('text-sm font-semibold', isMine ? 'text-accent-light' : 'text-primary')}>
                                            {isMine ? 'You' : msg.profiles?.username}
                                        </span>
                                        <span className="text-[10px] text-muted">{formatRelativeTime(msg.created_at)}</span>
                                    </div>
                                )}
                                <p className="text-sm text-secondary leading-relaxed break-words">{msg.content}</p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input - Discord style */}
            <div className="px-4 pb-4 md:pb-4 pb-20 flex-shrink-0">
                <form onSubmit={handleSend} className="flex items-center gap-0 bg-bg-tertiary rounded-lg overflow-hidden">
                    <input
                        ref={inputRef}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={`Message ${isGroup ? groupName : (otherUser?.username ? '@' + otherUser.username : '#chat')}`}
                        className="flex-1 bg-transparent px-4 py-2.5 text-sm text-primary placeholder:text-muted outline-none"
                        maxLength={2000}
                        autoFocus
                    />
                    <button type="submit" disabled={!newMessage.trim() || sending} className="btn btn-ghost px-3 text-muted hover:text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                    </button>
                </form>
            </div>
        </div>
    );
}
