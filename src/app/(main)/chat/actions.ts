'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getOrCreateConversation(otherUserId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    // Find existing conversation between these two users
    const { data: myConversations } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);

    if (myConversations && myConversations.length > 0) {
        const myConvIds = myConversations.map((c) => c.conversation_id);

        const { data: sharedConv } = await supabase
            .from('conversation_participants')
            .select('conversation_id')
            .eq('user_id', otherUserId)
            .in('conversation_id', myConvIds)
            .limit(1)
            .single();

        if (sharedConv) {
            return { conversationId: sharedConv.conversation_id };
        }
    }

    // Create new conversation
    const { data: newConv, error: convError } = await supabase
        .from('conversations')
        .insert({})
        .select('id')
        .single();

    if (convError || !newConv) return { error: 'Failed to create conversation' };

    // Add both participants
    await supabase.from('conversation_participants').insert([
        { conversation_id: newConv.id, user_id: user.id },
        { conversation_id: newConv.id, user_id: otherUserId },
    ]);

    revalidatePath('/chat');
    return { conversationId: newConv.id };
}

export async function sendMessage(conversationId: string, content: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const { error } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: user.id,
        content,
    });

    if (error) return { error: error.message };

    // Update conversation timestamp
    await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

    // Notify the other participant
    const { data: participants } = await supabase
        .from('conversation_participants')
        .select('user_id')
        .eq('conversation_id', conversationId)
        .neq('user_id', user.id);

    if (participants) {
        for (const p of participants) {
            await supabase.from('notifications').insert({
                user_id: p.user_id,
                actor_id: user.id,
                type: 'message',
                reference_id: conversationId,
            });
        }
    }

    return { success: true };
}
