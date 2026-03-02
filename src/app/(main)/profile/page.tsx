import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileClient from '@/components/profile/ProfileClient';

export default async function MyProfilePage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (!profile) redirect('/login');

    const { count: followersCount } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', user.id);

    const { count: followingCount } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', user.id);

    const { data: posts } = await supabase
        .from('posts')
        .select(`
      id, content, image_url, created_at, updated_at, user_id,
      profiles!posts_user_id_fkey (username, full_name, avatar_url),
      likes (user_id),
      comments (id, content, created_at, user_id, profiles!comments_user_id_fkey (username, avatar_url))
    `)
        .eq('user_id', user.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false })
        .limit(20);

    return (
        <ProfileClient
            profile={profile}
            posts={posts || []}
            followersCount={followersCount || 0}
            followingCount={followingCount || 0}
            currentUserId={user.id}
            isOwnProfile={true}
        />
    );
}
