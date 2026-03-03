import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SettingsClient from '@/components/settings/SettingsClient';
import { getBlockedUsers, getPendingFollowRequests } from './actions';

export default async function SettingsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: profile } = await supabase
        .from('profiles')
        .select('username, full_name, avatar_url, bio, is_private, last_username_change_at, created_at')
        .eq('id', user.id)
        .single();

    const blockedUsers = await getBlockedUsers();
    const pendingRequests = await getPendingFollowRequests();

    return (
        <SettingsClient
            profile={profile as any}
            blockedUsers={blockedUsers as any}
            pendingRequests={pendingRequests as any}
            userEmail={user.email || ''}
        />
    );
}
