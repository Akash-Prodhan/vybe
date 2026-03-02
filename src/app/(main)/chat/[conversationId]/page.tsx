import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ChatRoom from '@/components/chat/ChatRoom';

export default async function ChatConversationPage({ params }: { params: Promise<{ conversationId: string }> }) {
    const { conversationId } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    // Verify participant
    const { data: participant } = await supabase
        .from('conversation_participants')
        .select('user_id, role')
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id)
        .single();

    if (!participant) redirect('/chat');

    // Check if group
    const { data: conv } = await supabase
        .from('conversations')
        .select('is_group, group_name, group_avatar_url')
        .eq('id', conversationId)
        .single();

    const isGroup = conv?.is_group || false;
    const isGroupAdmin = participant.role === 'admin';

    // Get other user profile (for DMs)
    let otherUser = null;
    if (!isGroup) {
        const { data: otherParticipant } = await supabase
            .from('conversation_participants')
            .select('user_id, profiles!conversation_participants_user_id_fkey (username, full_name, avatar_url)')
            .eq('conversation_id', conversationId)
            .neq('user_id', user.id)
            .single();
        otherUser = (otherParticipant as any)?.profiles || null;
    }

    // Get messages
    const { data: messages } = await supabase
        .from('messages')
        .select('id, content, created_at, sender_id, profiles!messages_sender_id_fkey (username, avatar_url)')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(100);

    return (
        <ChatRoom
            conversationId={conversationId}
            currentUserId={user.id}
            otherUser={otherUser}
            isGroup={isGroup}
            groupName={conv?.group_name || 'Group'}
            isGroupAdmin={isGroupAdmin}
            initialMessages={(messages || []) as any}
        />
    );
}
