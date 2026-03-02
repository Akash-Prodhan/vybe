'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createGroup(name: string, memberIds: string[]) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const { data: conv, error: convError } = await supabase
        .from('conversations')
        .insert({
            is_group: true,
            group_name: name,
            created_by: user.id,
        })
        .select('id')
        .single();

    if (convError || !conv) return { error: 'Failed to create group' };

    // Add creator as admin
    const participants = [
        { conversation_id: conv.id, user_id: user.id, role: 'admin' },
        ...memberIds.map((id) => ({
            conversation_id: conv.id,
            user_id: id,
            role: 'member' as const,
        })),
    ];

    await supabase.from('conversation_participants').insert(participants);

    revalidatePath('/groups');
    return { groupId: conv.id };
}

export async function getGroups() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data: myParticipations } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);

    const convIds = myParticipations?.map((p) => p.conversation_id) || [];
    if (convIds.length === 0) return [];

    const { data: groups } = await supabase
        .from('conversations')
        .select('id, group_name, group_avatar_url, updated_at, created_by')
        .eq('is_group', true)
        .in('id', convIds)
        .order('updated_at', { ascending: false });

    // Get member counts
    const result = [];
    for (const group of groups || []) {
        const { count } = await supabase
            .from('conversation_participants')
            .select('*', { count: 'exact', head: true })
            .eq('conversation_id', group.id);
        result.push({ ...group, memberCount: count || 0 });
    }

    return result;
}

export async function getGroupMembers(groupId: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from('conversation_participants')
        .select(`
            user_id, role,
            profiles!conversation_participants_user_id_fkey (username, full_name, avatar_url)
        `)
        .eq('conversation_id', groupId);
    return data || [];
}

export async function addGroupMember(groupId: string, userId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    // Check if current user is admin
    const { data: myRole } = await supabase
        .from('conversation_participants')
        .select('role')
        .eq('conversation_id', groupId)
        .eq('user_id', user.id)
        .single();

    if (!myRole || myRole.role !== 'admin') return { error: 'Only admins can add members' };

    // Check if already member
    const { data: existing } = await supabase
        .from('conversation_participants')
        .select('user_id')
        .eq('conversation_id', groupId)
        .eq('user_id', userId)
        .single();

    if (existing) return { error: 'Already a member' };

    const { error } = await supabase.from('conversation_participants').insert({
        conversation_id: groupId,
        user_id: userId,
        role: 'member',
    });

    if (error) return { error: error.message };
    revalidatePath(`/chat/${groupId}`);
    return { success: true };
}

export async function kickGroupMember(groupId: string, userId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const { data: myRole } = await supabase
        .from('conversation_participants')
        .select('role')
        .eq('conversation_id', groupId)
        .eq('user_id', user.id)
        .single();

    if (!myRole || myRole.role !== 'admin') return { error: 'Only admins can remove members' };
    if (userId === user.id) return { error: 'Cannot remove yourself' };

    const { error } = await supabase
        .from('conversation_participants')
        .delete()
        .eq('conversation_id', groupId)
        .eq('user_id', userId);

    if (error) return { error: error.message };
    revalidatePath(`/chat/${groupId}`);
    return { success: true };
}

export async function leaveGroup(groupId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const { error } = await supabase
        .from('conversation_participants')
        .delete()
        .eq('conversation_id', groupId)
        .eq('user_id', user.id);

    if (error) return { error: error.message };
    revalidatePath('/groups');
    return { success: true };
}
