import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ChatListClient from '@/components/chat/ChatListClient';

export default async function ChatPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    // Get user's conversations with the other participant's profile
    const { data: myParticipations } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);

    const convIds = myParticipations?.map((p) => p.conversation_id) || [];

    let conversations: any[] = [];

    if (convIds.length > 0) {
        // For each conversation, get the other participant
        const { data: allParticipants } = await supabase
            .from('conversation_participants')
            .select(`
        conversation_id,
        user_id,
        profiles!conversation_participants_user_id_fkey (username, full_name, avatar_url)
      `)
            .in('conversation_id', convIds)
            .neq('user_id', user.id);

        // Get latest message for each conversation
        const { data: convos } = await supabase
            .from('conversations')
            .select('id, updated_at')
            .in('id', convIds)
            .order('updated_at', { ascending: false });

        if (convos && allParticipants) {
            conversations = convos.map((conv) => {
                const participant = allParticipants.find((p) => p.conversation_id === conv.id);
                return {
                    id: conv.id,
                    updated_at: conv.updated_at,
                    otherUser: participant?.profiles || null,
                };
            }).filter((c) => c.otherUser);
        }
    }

    return (
        <ChatListClient conversations={conversations} currentUserId={user.id} />
    );
}
