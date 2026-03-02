'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createStory(formData: FormData) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    const file = formData.get('media') as File;
    const caption = formData.get('caption') as string;

    if (!file || file.size === 0) return { error: 'No media selected' };

    const isVideo = file.type.startsWith('video/');
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
        .from('stories')
        .upload(fileName, file);

    if (uploadError) return { error: 'Failed to upload' };

    const { data: { publicUrl } } = supabase.storage
        .from('stories')
        .getPublicUrl(fileName);

    const { error } = await supabase.from('stories').insert({
        user_id: user.id,
        media_url: publicUrl,
        media_type: isVideo ? 'video' : 'image',
        caption: caption || null,
    });

    if (error) return { error: error.message };
    revalidatePath('/feed');
    return { success: true };
}

export async function getActiveStories() {
    const supabase = await createClient();

    const { data } = await supabase
        .from('stories')
        .select(`
            id, media_url, media_type, caption, created_at, expires_at, user_id,
            profiles!stories_user_id_fkey (username, full_name, avatar_url)
        `)
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: false });

    // Group by user
    const grouped: Record<string, any> = {};
    (data || []).forEach((story: any) => {
        if (!grouped[story.user_id]) {
            grouped[story.user_id] = {
                userId: story.user_id,
                profile: story.profiles,
                stories: [],
            };
        }
        grouped[story.user_id].stories.push(story);
    });

    return Object.values(grouped);
}

export async function deleteStory(storyId: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('stories').delete().eq('id', storyId);
    if (error) return { error: error.message };
    revalidatePath('/feed');
    return { success: true };
}
