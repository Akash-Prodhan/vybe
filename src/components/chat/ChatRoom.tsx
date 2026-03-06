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
            {/* Header - WhatsApp style teal/green header */}
            <div className="flex items-center gap-3 px-4 h-14 bg-bg-secondary border-b border-border-light flex-shrink-0">
                <Link href={isGroup ? '/groups' : '/chat'} className="btn btn-ghost p-1 md:hidden text-muted">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                </Link>

                <div className="w-10 h-10 avatar text-xs flex-shrink-0">
                    {!isGroup && otherUser?.avatar_url ? (
                        <img src={otherUser.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                        getInitials(isGroup ? (groupName || 'G') : (otherUser?.full_name || otherUser?.username || 'U'))
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <span className="text-[15px] font-semibold truncate block">{title}</span>
                    {!isGroup && <span className="text-xs text-muted">tap for contact info</span>}
                </div>

                <div className="flex items-center gap-1">
                    {isGroup && (
                        <GroupInfo groupId={conversationId} groupName={groupName || 'Group'} currentUserId={currentUserId} isAdmin={isGroupAdmin || false} />
                    )}
                </div>
            </div>

            {/* Messages area — WhatsApp wallpaper style  */}
            <div className="flex-1 overflow-y-auto px-4 py-3 bg-bg" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%239C92AC\' fill-opacity=\'0.03\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
                {messages.length === 0 && (
                    <div className="text-center py-12 fade-in">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center pulse-glow">
                            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                        </div>
                        <p className="text-primary font-semibold">
                            {isGroup ? `Welcome to ${groupName}!` : `Start chatting with ${otherUser?.username}`}
                        </p>
                        <p className="text-muted text-sm mt-1">Messages are end-to-end secured 🔒</p>
                    </div>
                )}

                {messages.map((msg, i) => {
                    const isMine = msg.sender_id === currentUserId;
                    const showTime = i === 0 || messages[i - 1].sender_id !== msg.sender_id;

                    return (
                        <div
                            key={msg.id}
                            className={cn(
                                'flex mb-1',
                                isMine ? 'justify-end' : 'justify-start',
                                showTime && 'mt-3'
                            )}
                        >
                            {/* Received: show avatar */}
                            {!isMine && showTime && (
                                <div className="w-8 h-8 avatar text-[9px] flex-shrink-0 mr-2 mt-1">
                                    {msg.profiles?.avatar_url ? (
                                        <img src={msg.profiles.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                                    ) : getInitials(msg.profiles?.username || '')}
                                </div>
                            )}
                            {!isMine && !showTime && <div className="w-8 mr-2 flex-shrink-0" />}

                            <div className={cn(
                                'max-w-[75%] px-3 py-2 slide-in-right',
                                isMine ? 'bubble-sent' : 'bubble-received'
                            )}>
                                {/* Show sender name in groups for received messages */}
                                {!isMine && showTime && isGroup && (
                                    <p className="text-xs font-semibold text-accent mb-0.5">{msg.profiles?.username}</p>
                                )}
                                <p className="text-sm leading-relaxed break-words">{msg.content}</p>
                                <p className={cn('text-[10px] mt-0.5 text-right', isMine ? 'text-green-dark/60' : 'text-muted')}>
                                    {formatRelativeTime(msg.created_at)}
                                    {isMine && (
                                        <span className="ml-1">✓✓</span>
                                    )}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* Input - WhatsApp style */}
            <div className="px-3 py-2 bg-bg-secondary border-t border-border-light flex-shrink-0 pb-20 md:pb-2">
                <form onSubmit={handleSend} className="flex items-center gap-2">
                    <div className="flex-1 flex items-center bg-surface rounded-full border border-border-light overflow-hidden px-4">
                        <input
                            ref={inputRef}
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message"
                            className="flex-1 bg-transparent py-2.5 text-sm text-primary placeholder:text-muted outline-none"
                            maxLength={2000}
                            autoFocus
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className={cn(
                            'w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200',
                            newMessage.trim()
                                ? 'bg-green text-white shadow-lg hover:shadow-xl hover:scale-105'
                                : 'bg-bg-tertiary text-muted'
                        )}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                    </button>
                </form>
            </div>
        </div>
    );
}
