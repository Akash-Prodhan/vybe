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

    return (
        <NotificationsClient notifications={(notifications || []) as any} />
    );
}
