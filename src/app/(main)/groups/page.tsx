import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getGroups } from './actions';
import Link from 'next/link';
import CreateGroupButton from '@/components/groups/CreateGroupButton';
import GroupsClient from '@/components/groups/GroupsClient';

export default async function GroupsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const groups = await getGroups();

    return (
        <GroupsClient groups={groups as any[]} />
    );
}
