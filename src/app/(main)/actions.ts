'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createPost(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const content = formData.get('content') as string;
    const imageFile = formData.get('image') as File | null;

    let image_url = null;

    if (imageFile && imageFile.size > 0) {
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

        // Get post owner for notification
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
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const { error } = await supabase.from('comments').insert({
        post_id: postId,
        user_id: user.id,
        content,
    });

    if (error) return { error: error.message };

    // Notify post owner
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

    const { data: existing } = await supabase
        .from('followers')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', targetUserId)
        .single();

    if (existing) {
        await supabase.from('followers').delete().eq('id', existing.id);
    } else {
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

    const username = formData.get('username') as string;
    const full_name = formData.get('full_name') as string;
    const bio = formData.get('bio') as string;
    const avatarFile = formData.get('avatar') as File | null;

    // Check username uniqueness
    const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username.toLowerCase())
        .neq('id', user.id)
        .single();

    if (existing) return { error: 'Username is already taken' };

    let avatar_url: string | undefined;

    if (avatarFile && avatarFile.size > 0) {
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

    const updateData: Record<string, string> = {
        username: username.toLowerCase(),
        full_name,
        bio,
        updated_at: new Date().toISOString(),
    };

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
        .update({ read: true })
        .eq('id', notificationId);
    revalidatePath('/notifications');
}

export async function markAllNotificationsRead() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);
    revalidatePath('/notifications');
}
