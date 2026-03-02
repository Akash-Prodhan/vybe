'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { getInitials } from '@/lib/utils';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setSearched(true);
        const supabase = createClient();

        const { data } = await supabase
            .from('profiles')
            .select('id, username, full_name, avatar_url, bio')
            .ilike('username', `%${query}%`)
            .limit(20);

        setResults(data || []);
        setLoading(false);
    }

    return (
        <div className="max-w-xl mx-auto px-4 py-6">
            <h1 className="text-xl font-bold mb-6">Search</h1>

            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by username..."
                    className="input flex-1"
                />
                <button type="submit" disabled={loading} className="btn btn-primary px-4">
                    {loading ? (
                        <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                    )}
                </button>
            </form>

            {loading && (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="skeleton h-16 w-full rounded-xl" />
                    ))}
                </div>
            )}

            {!loading && searched && results.length === 0 && (
                <p className="text-center text-secondary text-sm py-8">No users found</p>
            )}

            {!loading && results.length > 0 && (
                <div className="space-y-2">
                    {results.map((user) => (
                        <Link
                            key={user.id}
                            href={`/profile/${user.username}`}
                            className="card p-4 flex items-center gap-3 hover:bg-bg-secondary transition-colors block"
                        >
                            <div className="w-10 h-10 avatar text-sm bg-bg-tertiary flex-shrink-0">
                                {user.avatar_url ? (
                                    <img src={user.avatar_url} alt={user.username} className="w-10 h-10 rounded-full object-cover" />
                                ) : (
                                    getInitials(user.full_name || user.username)
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">{user.full_name || user.username}</p>
                                <p className="text-xs text-secondary">@{user.username}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {!searched && (
                <p className="text-center text-secondary text-sm py-8">Search for users by username</p>
            )}
        </div>
    );
}
