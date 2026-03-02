import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import FeedClient from '@/components/feed/FeedClient';
import StoryBar from '@/components/stories/StoryBar';
import { getActiveStories } from '@/app/(main)/stories/actions';

export default async function FeedPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: posts } = await supabase
        .from('posts')
        .select(`
            id, content, image_url, created_at, user_id, updated_at,
            profiles!posts_user_id_fkey (username, full_name, avatar_url),
            likes (id, user_id),
            comments (id, content, user_id, created_at, profiles!comments_user_id_fkey (username, avatar_url))
        `)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(30);

    const storyGroups = await getActiveStories();

    return (
        <div className="max-w-xl mx-auto px-4 py-6">
            <StoryBar storyGroups={storyGroups as any} currentUserId={user.id} />
            <FeedClient posts={(posts || []) as any} currentUserId={user.id} />
        </div>
    );
}
