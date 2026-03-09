import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import NotificationsClient from '@/components/notifications/NotificationsClient';

export default async function NotificationsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: notifications } = await supabase
        .from('notifications')
        .select(`
      id, type, reference_id, read, created_at,
      profiles!notifications_actor_id_fkey (username, full_name, avatar_url)
    `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

    // Stats for right sidebar
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { count: likesToday } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('type', 'like')
        .gte('created_at', today.toISOString());

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);

    const { count: newFollowersWeek } = await supabase
        .from('notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .in('type', ['follow', 'new_follower'])
        .gte('created_at', weekAgo.toISOString());

    return (
        <NotificationsClient
            notifications={(notifications || []) as any}
            likesToday={likesToday || 0}
            newFollowersWeek={newFollowersWeek || 0}
        />
    );
}
