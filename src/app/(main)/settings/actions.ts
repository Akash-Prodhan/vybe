'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

// ========== BLOCK SYSTEM ==========

export async function blockUser(targetUserId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };
    if (user.id === targetUserId) return { error: 'Cannot block yourself' };

    // Insert block
    const { error } = await supabase.from('user_blocks').insert({
        blocker_id: user.id,
        blocked_id: targetUserId,
    });
    if (error) return { error: error.message };

    // Remove follow relationships in both directions
    await supabase.from('followers').delete()
        .eq('follower_id', user.id).eq('following_id', targetUserId);
    await supabase.from('followers').delete()
        .eq('follower_id', targetUserId).eq('following_id', user.id);

    // Remove any pending follow requests
    await supabase.from('follow_requests').delete()
        .eq('requester_id', user.id).eq('target_id', targetUserId);
    await supabase.from('follow_requests').delete()
        .eq('requester_id', targetUserId).eq('target_id', user.id);

    revalidatePath('/');
    return { success: true };
}

export async function unblockUser(targetUserId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const { error } = await supabase.from('user_blocks').delete()
        .eq('blocker_id', user.id).eq('blocked_id', targetUserId);

    if (error) return { error: error.message };
    revalidatePath('/');
    return { success: true };
}

export async function getBlockedUsers() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
        .from('user_blocks')
        .select('blocked_id, created_at, profiles!user_blocks_blocked_id_fkey(username, full_name, avatar_url)')
        .eq('blocker_id', user.id)
        .order('created_at', { ascending: false });

    return data || [];
}

export async function isUserBlocked(targetUserId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data } = await supabase
        .from('user_blocks')
        .select('id')
        .or(`and(blocker_id.eq.${user.id},blocked_id.eq.${targetUserId}),and(blocker_id.eq.${targetUserId},blocked_id.eq.${user.id})`)
        .limit(1);

    return (data && data.length > 0) || false;
}

// ========== PRIVACY ==========

export async function togglePrivacy() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const { data: profile } = await supabase
        .from('profiles')
        .select('is_private')
        .eq('id', user.id)
        .single();

    if (!profile) return { error: 'Profile not found' };

    const { error } = await supabase
        .from('profiles')
        .update({ is_private: !profile.is_private })
        .eq('id', user.id);

    if (error) return { error: error.message };
    revalidatePath('/settings');
    return { success: true, is_private: !profile.is_private };
}

// ========== FOLLOW REQUESTS ==========

export async function sendFollowRequest(targetUserId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const { error } = await supabase.from('follow_requests').insert({
        requester_id: user.id,
        target_id: targetUserId,
    });

    if (error) return { error: error.message };

    // Send notification
    await supabase.from('notifications').insert({
        user_id: targetUserId,
        actor_id: user.id,
        type: 'follow_request',
    });

    revalidatePath('/');
    return { success: true };
}

export async function acceptFollowRequest(requestId: string, requesterId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    // Update request status
    await supabase.from('follow_requests')
        .update({ status: 'approved', updated_at: new Date().toISOString() })
        .eq('id', requestId);

    // Create follower relationship
    await supabase.from('followers').insert({
        follower_id: requesterId,
        following_id: user.id,
    });

    // Notify requester
    await supabase.from('notifications').insert({
        user_id: requesterId,
        actor_id: user.id,
        type: 'follow_accepted',
    });

    revalidatePath('/');
    return { success: true };
}

export async function declineFollowRequest(requestId: string) {
    const supabase = await createClient();
    await supabase.from('follow_requests').delete().eq('id', requestId);
    revalidatePath('/');
    return { success: true };
}

export async function getPendingFollowRequests() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data } = await supabase
        .from('follow_requests')
        .select('id, requester_id, created_at, profiles!follow_requests_requester_id_fkey(username, full_name, avatar_url)')
        .eq('target_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

    return data || [];
}

// ========== REPORT ==========

export async function reportContent(targetType: 'user' | 'post', targetId: string, reason: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const insertData: Record<string, string> = {
        reporter_id: user.id,
        reason,
    };

    if (targetType === 'user') insertData.reported_user_id = targetId;
    else insertData.reported_post_id = targetId;

    const { error } = await supabase.from('reports').insert(insertData);
    if (error) return { error: error.message };
    return { success: true };
}

// ========== ACCOUNT DELETION ==========

export async function deleteAccount() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    // Soft-delete all user content
    const now = new Date().toISOString();
    await supabase.from('posts').update({ deleted_at: now }).eq('user_id', user.id);
    await supabase.from('comments').update({ deleted_at: now }).eq('user_id', user.id);
    await supabase.from('messages').update({ deleted_at: now }).eq('sender_id', user.id);

    // Sign out
    await supabase.auth.signOut();
    return { success: true };
}
