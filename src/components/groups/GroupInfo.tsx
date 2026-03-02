'use client';

import { useState, useEffect } from 'react';
import { getGroupMembers, addGroupMember, kickGroupMember, leaveGroup } from '@/app/(main)/groups/actions';
import { createClient } from '@/lib/supabase/client';
import { getInitials } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface GroupInfoProps {
    groupId: string;
    groupName: string;
    currentUserId: string;
    isAdmin: boolean;
}

export default function GroupInfo({ groupId, groupName, currentUserId, isAdmin }: GroupInfoProps) {
    const [open, setOpen] = useState(false);
    const [members, setMembers] = useState<any[]>([]);
    const [search, setSearch] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (open) {
            getGroupMembers(groupId).then(setMembers);
        }
    }, [open, groupId]);

    async function handleSearch(q: string) {
        setSearch(q);
        if (q.length < 2) { setResults([]); return; }
        const supabase = createClient();
        const { data } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url')
            .ilike('username', `%${q}%`)
            .limit(10);
        const memberIds = members.map((m) => m.user_id);
        setResults((data || []).filter((u) => !memberIds.includes(u.id)));
    }

    async function handleAdd(userId: string) {
        await addGroupMember(groupId, userId);
        setSearch('');
        setResults([]);
        getGroupMembers(groupId).then(setMembers);
    }

    async function handleKick(userId: string) {
        await kickGroupMember(groupId, userId);
        getGroupMembers(groupId).then(setMembers);
    }

    async function handleLeave() {
        await leaveGroup(groupId);
        router.push('/groups');
    }

    return (
        <>
            <button onClick={() => setOpen(true)} className="btn btn-ghost p-1.5 rounded text-muted hover:text-primary" title="Group info">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
            </button>

            {open && (
                <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
                    <div className="card-glass w-full max-w-sm p-5 scale-in max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold">{groupName}</h2>
                            <button onClick={() => setOpen(false)} className="btn btn-ghost p-1 text-muted">✕</button>
                        </div>

                        <p className="text-xs font-bold text-secondary uppercase tracking-wide mb-2">Members — {members.length}</p>

                        <div className="space-y-0.5 mb-4">
                            {members.map((m: any) => (
                                <div key={m.user_id} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-surface-hover group">
                                    <div className="w-8 h-8 avatar text-xs">
                                        {m.profiles?.avatar_url ? (
                                            <img src={m.profiles.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                                        ) : getInitials(m.profiles?.full_name || m.profiles?.username || '')}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{m.profiles?.username}</p>
                                    </div>
                                    {m.role === 'admin' && (
                                        <span className="text-[10px] font-bold text-accent bg-accent/10 px-1.5 py-0.5 rounded">ADMIN</span>
                                    )}
                                    {isAdmin && m.user_id !== currentUserId && (
                                        <button onClick={() => handleKick(m.user_id)} className="btn btn-ghost p-1 text-danger text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                            Kick
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        {isAdmin && (
                            <div className="mb-4">
                                <p className="text-xs font-bold text-secondary uppercase tracking-wide mb-1.5">Add Member</p>
                                <input value={search} onChange={(e) => handleSearch(e.target.value)} className="input text-sm" placeholder="Search username..." />
                                {results.map((user) => (
                                    <button key={user.id} onClick={() => handleAdd(user.id)} className="flex items-center gap-2 w-full px-2 py-1.5 rounded hover:bg-surface-hover mt-0.5">
                                        <div className="w-7 h-7 avatar text-[10px]">
                                            {user.avatar_url ? <img src={user.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover" /> : getInitials(user.full_name || user.username)}
                                        </div>
                                        <span className="text-sm">{user.username}</span>
                                        <span className="ml-auto text-xs text-accent">Add</span>
                                    </button>
                                ))}
                            </div>
                        )}

                        <button onClick={handleLeave} className="btn btn-danger w-full text-sm py-2">
                            Leave Group
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
