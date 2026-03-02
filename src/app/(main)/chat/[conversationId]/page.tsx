import { createClient } from '@/lib/supabase/server';
import { redirect, notFound } from 'next/navigation';
import ChatRoom from '@/components/chat/ChatRoom';

export default async function ChatRoomPage({ params }: { params: Promise<{ conversationId: string }> }) {
    const { conversationId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    // Verify user is a participant
    const { data: participation } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id)
        .single();

    if (!participation) notFound();

    // Get the other participant
    const { data: otherParticipant } = await supabase
        .from('conversation_participants')
        .select(`
      user_id,
      profiles!conversation_participants_user_id_fkey (username, full_name, avatar_url)
    `)
        .eq('conversation_id', conversationId)
        .neq('user_id', user.id)
        .single();

    // Get messages
    const { data: messages } = await supabase
        .from('messages')
        .select(`
      id, content, created_at, sender_id,
      profiles!messages_sender_id_fkey (username, avatar_url)
    `)
        .eq('conversation_id', conversationId)
        .is('deleted_at', null)
        .order('created_at', { ascending: true })
        .limit(100);

    const otherUserProfile = otherParticipant?.profiles as any;

    return (
        <ChatRoom
            conversationId={conversationId}
            currentUserId={user.id}
            otherUser={otherUserProfile || { username: 'Unknown', full_name: null, avatar_url: null }}
            initialMessages={(messages || []) as any}
        />
    );
}
