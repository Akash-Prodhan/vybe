import { createClient } from '@/lib/supabase/server';
import { notFound, redirect } from 'next/navigation';
import ProfileClient from '@/components/profile/ProfileClient';

export default async function UserProfilePage({ params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

    if (!profile) notFound();

    // Redirect to own profile page if viewing self
    if (profile.id === user.id) {
        redirect('/profile');
    }

    const { count: followersCount } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('following_id', profile.id);

    const { count: followingCount } = await supabase
        .from('followers')
        .select('*', { count: 'exact', head: true })
        .eq('follower_id', profile.id);

    const { data: isFollowing } = await supabase
        .from('followers')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', profile.id)
        .single();

    const { data: posts } = await supabase
        .from('posts')
        .select(`
      id, content, image_url, created_at, updated_at, user_id,
      profiles!posts_user_id_fkey (username, full_name, avatar_url),
      likes (user_id),
      comments (id, content, created_at, user_id, profiles!comments_user_id_fkey (username, avatar_url))
    `)
        .eq('user_id', profile.id)
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
            isOwnProfile={false}
            isFollowing={!!isFollowing}
        />
    );
}
