'use client';

import { useState, useEffect, useRef } from 'react';
import { sendMessage } from '@/app/(main)/chat/actions';
import { createClient } from '@/lib/supabase/client';
import { getInitials, formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ChatRoomProps {
    conversationId: string;
    currentUserId: string;
    otherUser: {
        username: string;
        full_name: string | null;
        avatar_url: string | null;
    };
    initialMessages: {
        id: string;
        content: string;
        created_at: string;
        sender_id: string;
        profiles: {
            username: string;
            avatar_url: string | null;
        };
    }[];
}

export default function ChatRoom({ conversationId, currentUserId, otherUser, initialMessages }: ChatRoomProps) {
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Subscribe to realtime messages
    useEffect(() => {
        const supabase = createClient();

        const channel = supabase
            .channel(`chat:${conversationId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                    filter: `conversation_id=eq.${conversationId}`,
                },
                async (payload) => {
                    const newMsg = payload.new as any;
                    // Don't add if we already have it (from optimistic update)
                    if (messages.some((m) => m.id === newMsg.id)) return;

                    // Fetch the sender profile
                    const { data: profile } = await supabase
                        .from('profiles')
                        .select('username, avatar_url')
                        .eq('id', newMsg.sender_id)
                        .single();

                    setMessages((prev) => [
                        ...prev,
                        {
                            ...newMsg,
                            profiles: profile || { username: 'Unknown', avatar_url: null },
                        },
                    ]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [conversationId]);

    async function handleSend(e: React.FormEvent) {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        const content = newMessage.trim();
        setNewMessage('');
        setSending(true);

        // Optimistic update
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

    return (
        <div className="flex flex-col h-screen md:h-[calc(100vh)] max-w-xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-white sticky top-0 z-10">
                <Link href="/chat" className="btn btn-ghost p-1.5 md:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
                </Link>
                <Link href={`/profile/${otherUser.username}`} className="flex items-center gap-3 group">
                    <div className="w-9 h-9 avatar text-xs bg-bg-tertiary">
                        {otherUser.avatar_url ? (
                            <img src={otherUser.avatar_url} alt="" className="w-9 h-9 rounded-full object-cover" />
                        ) : (
                            getInitials(otherUser.full_name || otherUser.username)
                        )}
                    </div>
                    <div>
                        <p className="text-sm font-semibold group-hover:underline">{otherUser.full_name || otherUser.username}</p>
                        <p className="text-xs text-secondary">@{otherUser.username}</p>
                    </div>
                </Link>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                {messages.length === 0 && (
                    <p className="text-center text-secondary text-sm py-8">No messages yet. Say hello! 👋</p>
                )}

                {messages.map((msg) => {
                    const isMine = msg.sender_id === currentUserId;
                    return (
                        <div
                            key={msg.id}
                            className={cn('flex', isMine ? 'justify-end' : 'justify-start')}
                        >
                            <div
                                className={cn(
                                    'max-w-[75%] rounded-2xl px-4 py-2.5',
                                    isMine
                                        ? 'bg-primary text-white rounded-br-md'
                                        : 'bg-bg-tertiary text-primary rounded-bl-md'
                                )}
                            >
                                <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                                <p className={cn(
                                    'text-[10px] mt-1',
                                    isMine ? 'text-white/60' : 'text-secondary/60'
                                )}>
                                    {formatRelativeTime(msg.created_at)}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="sticky bottom-0 px-4 py-3 border-t border-border bg-white mb-16 md:mb-0">
                <form onSubmit={handleSend} className="flex gap-2">
                    <input
                        ref={inputRef}
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="input flex-1"
                        maxLength={2000}
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="btn btn-primary px-4"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                    </button>
                </form>
            </div>
        </div>
    );
}
