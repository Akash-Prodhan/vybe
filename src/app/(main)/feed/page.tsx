import { createClient } from '@/lib/supabase/server';
import CreatePost from '@/components/feed/CreatePost';
import PostCard from '@/components/feed/PostCard';
import FeedClient from '@/components/feed/FeedClient';

export default async function FeedPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: posts } = await supabase
        .from('posts')
        .select(`
      id, content, image_url, created_at, updated_at, user_id,
      profiles!posts_user_id_fkey (username, full_name, avatar_url),
      likes (user_id),
      comments (id, content, created_at, user_id, profiles!comments_user_id_fkey (username, avatar_url))
    `)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(20);

    return (
        <div className="max-w-xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold">Feed</h1>
            </div>

            <FeedClient
                initialPosts={posts || []}
                currentUserId={user!.id}
            />
        </div>
    );
}
