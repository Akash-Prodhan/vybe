'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const content = formData.get('content') as string;
    const imageFile = formData.get('image') as File | null;

    // Validate content length
    if (content && content.length > 500) return { error: 'Post content cannot exceed 500 characters' };

    let image_url = null;

    if (imageFile && imageFile.size > 0) {
        if (imageFile.size > 10 * 1024 * 1024) return { error: 'File too large (max 10MB)' };
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
            .from('posts')
            .upload(fileName, imageFile);

        if (uploadError) return { error: 'Failed to upload image' };

        const { data: { publicUrl } } = supabase.storage
            .from('posts')
            .getPublicUrl(fileName);
        image_url = publicUrl;
    }

    if (!content && !image_url) return { error: 'Post must have content or media' };

    const { error } = await supabase.from('posts').insert({
        user_id: user.id,
        content: content || null,
        image_url,
    });

    if (error) return { error: error.message };
    revalidatePath('/feed');
    return { success: true };
}

export async function deletePost(postId: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('posts')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', postId);

    if (error) return { error: error.message };
    revalidatePath('/feed');
    return { success: true };
}

export async function editPost(postId: string, content: string) {
    if (content && content.length > 500) return { error: 'Content too long' };
    const supabase = await createClient();
    const { error } = await supabase
        .from('posts')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', postId);

    if (error) return { error: error.message };
    revalidatePath('/feed');
    return { success: true };
}

export async function toggleLike(postId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const { data: existing } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

    if (existing) {
        await supabase.from('likes').delete().eq('id', existing.id);
    } else {
        await supabase.from('likes').insert({ post_id: postId, user_id: user.id });

        const { data: post } = await supabase
            .from('posts')
            .select('user_id')
            .eq('id', postId)
            .single();

        if (post && post.user_id !== user.id) {
            await supabase.from('notifications').insert({
                user_id: post.user_id,
                actor_id: user.id,
                type: 'like',
                reference_id: postId,
            });
        }
    }

    revalidatePath('/feed');
    return { success: true };
}

export async function addComment(postId: string, content: string) {
    if (content.length > 280) return { error: 'Comment too long (max 280)' };
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const { error } = await supabase.from('comments').insert({
        post_id: postId,
        user_id: user.id,
        content,
    });

    if (error) return { error: error.message };

    const { data: post } = await supabase
        .from('posts')
        .select('user_id')
        .eq('id', postId)
        .single();

    if (post && post.user_id !== user.id) {
        await supabase.from('notifications').insert({
            user_id: post.user_id,
            actor_id: user.id,
            type: 'comment',
            reference_id: postId,
        });
    }

    revalidatePath('/feed');
    return { success: true };
}

export async function toggleFollow(targetUserId: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };
    if (user.id === targetUserId) return { error: 'Cannot follow yourself' };

    // Check if already following
    const { data: existing } = await supabase
        .from('followers')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .single();

    if (existing) {
        // Unfollow
        await supabase.from('followers').delete().eq('id', existing.id);
    } else {
        // Check if target is private
        const { data: targetProfile } = await supabase
            .from('profiles')
            .select('is_private')
            .eq('id', targetUserId)
            .single();

        if (targetProfile?.is_private) {
            // Check existing request
            const { data: existingReq } = await supabase
                .from('follow_requests')
                .select('id')
                .eq('requester_id', user.id)
                .eq('target_id', targetUserId)
                .single();

            if (existingReq) {
                // Cancel request
                await supabase.from('follow_requests').delete().eq('id', existingReq.id);
                return { success: true, status: 'cancelled' };
            }

            // Send follow request
            await supabase.from('follow_requests').insert({
                requester_id: user.id,
                target_id: targetUserId,
            });

            await supabase.from('notifications').insert({
                user_id: targetUserId,
                actor_id: user.id,
                type: 'follow_request',
            });

            return { success: true, status: 'requested' };
        }

        // Public account — direct follow
        await supabase.from('followers').insert({
            follower_id: user.id,
            following_id: targetUserId,
        });

        await supabase.from('notifications').insert({
            user_id: targetUserId,
            actor_id: user.id,
            type: 'follow',
        });
    }

    revalidatePath('/feed');
    return { success: true };
}

export async function updateProfile(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const username = (formData.get('username') as string)?.toLowerCase();
    const full_name = formData.get('full_name') as string;
    const bio = formData.get('bio') as string;
    const avatarFile = formData.get('avatar') as File | null;

    // Username validation
    if (!username || username.length < 3 || username.length > 30) {
        return { error: 'Username must be 3-30 characters' };
    }
    if (!/^[a-z0-9_.]+$/.test(username)) {
        return { error: 'Username: only lowercase letters, numbers, underscores, periods' };
    }
    if (/^[_.]|[_.]$/.test(username)) {
        return { error: 'Username cannot start or end with _ or .' };
    }
    if (/__|\.\./.test(username)) {
        return { error: 'No consecutive underscores or periods' };
    }

    const reserved = ['admin', 'support', 'official', 'null', 'undefined', 'system', 'moderator', 'help', 'vybe'];
    if (reserved.includes(username)) return { error: 'Username is reserved' };

    // Bio length
    if (bio && bio.length > 160) return { error: 'Bio cannot exceed 160 characters' };

    // Check username uniqueness
    const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .neq('id', user.id)
        .single();

    if (existing) return { error: 'Username is already taken' };

    // Check 30-day username change rate limit
    const { data: currentProfile } = await supabase
        .from('profiles')
        .select('username, last_username_change_at')
        .eq('id', user.id)
        .single();

    if (currentProfile && currentProfile.username !== username && currentProfile.last_username_change_at) {
        const lastChange = new Date(currentProfile.last_username_change_at);
        const daysSince = (Date.now() - lastChange.getTime()) / (1000 * 60 * 60 * 24);
        if (daysSince < 30) {
            return { error: `Username can be changed in ${Math.ceil(30 - daysSince)} days` };
        }
    }

    let avatar_url: string | undefined;

    if (avatarFile && avatarFile.size > 0) {
        if (avatarFile.size > 5 * 1024 * 1024) return { error: 'Avatar too large (max 5MB)' };
        const fileExt = avatarFile.name.split('.').pop();
        const fileName = `${user.id}/avatar.${fileExt}`;
        const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, avatarFile, { upsert: true });

        if (uploadError) return { error: 'Failed to upload avatar' };

        const { data: { publicUrl } } = supabase.storage
            .from('avatars')
            .getPublicUrl(fileName);
        avatar_url = publicUrl;
    }

    const updateData: Record<string, any> = {
        full_name,
        bio,
        updated_at: new Date().toISOString(),
    };

    if (currentProfile && currentProfile.username !== username) {
        updateData.username = username;
        updateData.last_username_change_at = new Date().toISOString();
    }

    if (avatar_url) updateData.avatar_url = avatar_url;

    const { error } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);

    if (error) return { error: error.message };
    revalidatePath('/profile');
    return { success: true };
}

export async function markNotificationRead(notificationId: string) {
    const supabase = await createClient();
    await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('id', notificationId);
    revalidatePath('/notifications');
}

export async function markAllNotificationsRead() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
        .from('notifications')
        .update({ read: true, read_at: new Date().toISOString() })
        .eq('user_id', user.id)
        .eq('read', false);
    revalidatePath('/notifications');
}
