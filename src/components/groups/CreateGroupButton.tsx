'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { createGroup } from '@/app/(main)/groups/actions';
import { getInitials } from '@/lib/utils';
import { useRouter } from 'next/navigation';

export default function CreateGroupButton() {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [search, setSearch] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [selected, setSelected] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function handleSearch(q: string) {
        setSearch(q);
        if (q.length < 2) { setResults([]); return; }
        const supabase = createClient();
        const { data } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url')
            .ilike('username', `%${q}%`)
            .limit(10);
        setResults((data || []).filter((u) => !selected.some((s) => s.id === u.id)));
    }

    function addMember(user: any) {
        setSelected([...selected, user]);
        setResults(results.filter((r) => r.id !== user.id));
        setSearch('');
    }

    function removeMember(id: string) {
        setSelected(selected.filter((s) => s.id !== id));
    }

    async function handleCreate() {
        if (!name.trim() || selected.length === 0) return;
        setLoading(true);
        const result = await createGroup(name.trim(), selected.map((s) => s.id));
        setLoading(false);
        if (result.groupId) {
            setOpen(false);
            setName('');
            setSelected([]);
            router.refresh();
            router.push(`/chat/${result.groupId}`);
        }
    }

    if (!open) {
        return (
            <button onClick={() => setOpen(true)} className="btn btn-primary text-xs px-3 py-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                New Group
            </button>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] bg-black/70 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
            <div className="card-glass w-full max-w-md p-6 scale-in" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-lg font-bold mb-4">Create a Group</h2>

                <div className="space-y-3">
                    <div>
                        <label className="block text-xs font-bold text-secondary uppercase tracking-wide mb-1.5">Group Name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} className="input" placeholder="My awesome group" maxLength={50} />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-secondary uppercase tracking-wide mb-1.5">Add Members</label>
                        <input value={search} onChange={(e) => handleSearch(e.target.value)} className="input" placeholder="Search by username..." />
                    </div>

                    {results.length > 0 && (
                        <div className="max-h-32 overflow-y-auto space-y-0.5">
                            {results.map((user) => (
                                <button key={user.id} onClick={() => addMember(user)} className="flex items-center gap-2 w-full px-2 py-1.5 rounded hover:bg-surface-hover transition-colors text-left">
                                    <div className="w-7 h-7 avatar text-[10px]">
                                        {user.avatar_url ? <img src={user.avatar_url} alt="" className="w-7 h-7 rounded-full object-cover" /> : getInitials(user.full_name || user.username)}
                                    </div>
                                    <span className="text-sm">{user.username}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {selected.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                            {selected.map((user) => (
                                <span key={user.id} className="inline-flex items-center gap-1 bg-accent/20 text-accent text-xs px-2 py-1 rounded">
                                    {user.username}
                                    <button onClick={() => removeMember(user.id)} className="hover:text-primary">×</button>
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-2 pt-2">
                        <button onClick={() => setOpen(false)} className="btn btn-secondary flex-1 py-2">Cancel</button>
                        <button onClick={handleCreate} disabled={!name.trim() || selected.length === 0 || loading} className="btn btn-primary flex-1 py-2">
                            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
