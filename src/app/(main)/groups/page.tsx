import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getGroups } from './actions';
import Link from 'next/link';
import CreateGroupButton from '@/components/groups/CreateGroupButton';

export default async function GroupsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const groups = await getGroups();

    return (
        <div className="max-w-xl mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-5">
                <h1 className="text-lg font-bold">Groups</h1>
                <CreateGroupButton />
            </div>

            {groups.length === 0 ? (
                <div className="text-center py-16">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-accent/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
                    </div>
                    <p className="text-secondary text-sm font-medium">No groups yet</p>
                    <p className="text-muted text-xs mt-1">Create a group to get started</p>
                </div>
            ) : (
                <div className="space-y-1">
                    {(groups as any[]).map((group) => (
                        <Link
                            key={group.id}
                            href={`/chat/${group.id}`}
                            className="card p-3.5 flex items-center gap-3 hover:bg-surface-hover transition-colors block rounded-lg"
                        >
                            <div className="w-10 h-10 avatar text-sm flex-shrink-0 bg-accent">
                                {group.group_name?.charAt(0)?.toUpperCase() || 'G'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">{group.group_name}</p>
                                <p className="text-xs text-muted">{group.memberCount} members</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
