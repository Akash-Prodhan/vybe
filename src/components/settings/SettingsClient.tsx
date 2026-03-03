'use client';

import { useState } from 'react';
import { togglePrivacy, unblockUser, acceptFollowRequest, declineFollowRequest, deleteAccount } from '@/app/(main)/settings/actions';
import { getInitials, formatRelativeTime, cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface SettingsClientProps {
    profile: { username: string; full_name: string | null; avatar_url: string | null; bio: string | null; is_private: boolean; last_username_change_at: string | null; created_at: string; };
    blockedUsers: { blocked_id: string; created_at: string; profiles: { username: string; full_name: string | null; avatar_url: string | null } }[];
    pendingRequests: { id: string; requester_id: string; created_at: string; profiles: { username: string; full_name: string | null; avatar_url: string | null } }[];
    userEmail: string;
}

export default function SettingsClient({ profile, blockedUsers, pendingRequests, userEmail }: SettingsClientProps) {
    const [tab, setTab] = useState<'account' | 'privacy' | 'blocked' | 'requests'>('account');
    const [isPrivate, setIsPrivate] = useState(profile.is_private);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const router = useRouter();

    async function handleTogglePrivacy() {
        const result = await togglePrivacy();
        if (result.success) setIsPrivate(result.is_private!);
    }

    async function handleUnblock(blockedId: string) {
        await unblockUser(blockedId);
        router.refresh();
    }

    async function handleAccept(requestId: string, requesterId: string) {
        await acceptFollowRequest(requestId, requesterId);
        router.refresh();
    }

    async function handleDecline(requestId: string) {
        await declineFollowRequest(requestId);
        router.refresh();
    }

    async function handleDeleteAccount() {
        await deleteAccount();
        router.push('/login');
    }

    const tabs = [
        { key: 'account' as const, label: 'Account' },
        { key: 'privacy' as const, label: 'Privacy' },
        { key: 'blocked' as const, label: 'Blocked' },
        { key: 'requests' as const, label: `Requests${pendingRequests.length > 0 ? ` (${pendingRequests.length})` : ''}` },
    ];

    return (
        <div className="max-w-xl mx-auto px-4 py-6 fade-in">
            <h1 className="text-lg font-bold mb-5">Settings</h1>

            {/* Tabs */}
            <div className="flex mb-5 bg-bg-secondary rounded-lg overflow-hidden">
                {tabs.map((t) => (
                    <button key={t.key} onClick={() => setTab(t.key)} className={cn('flex-1 text-xs font-medium py-2.5 text-center transition-colors', tab === t.key ? 'bg-surface-hover text-primary' : 'text-muted hover:text-secondary')}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Account Tab */}
            {tab === 'account' && (
                <div className="space-y-4">
                    <div className="card p-4 rounded-lg">
                        <p className="text-xs font-bold text-secondary uppercase tracking-wide mb-2">Account Info</p>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center py-1">
                                <span className="text-sm text-muted">Email</span>
                                <span className="text-sm">{userEmail}</span>
                            </div>
                            <div className="flex justify-between items-center py-1">
                                <span className="text-sm text-muted">Username</span>
                                <span className="text-sm">@{profile.username}</span>
                            </div>
                            {profile.last_username_change_at && (
                                <p className="text-[10px] text-muted">Last changed: {formatRelativeTime(profile.last_username_change_at)}</p>
                            )}
                        </div>
                    </div>

                    <div className="card p-4 rounded-lg">
                        <p className="text-xs font-bold text-secondary uppercase tracking-wide mb-2">Danger Zone</p>
                        {!showDeleteConfirm ? (
                            <button onClick={() => setShowDeleteConfirm(true)} className="btn btn-danger text-xs w-full py-2">Delete Account</button>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-sm text-danger">This will delete all your posts, comments, and data. This cannot be undone after 30 days.</p>
                                <div className="flex gap-2">
                                    <button onClick={() => setShowDeleteConfirm(false)} className="btn btn-secondary flex-1 text-xs py-2">Cancel</button>
                                    <button onClick={handleDeleteAccount} className="btn btn-danger flex-1 text-xs py-2">Confirm Delete</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Privacy Tab */}
            {tab === 'privacy' && (
                <div className="space-y-4">
                    <div className="card p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold">Private Account</p>
                                <p className="text-xs text-muted mt-0.5">Only followers can see your posts</p>
                            </div>
                            <button onClick={handleTogglePrivacy} className={cn('w-11 h-6 rounded-full transition-colors relative', isPrivate ? 'bg-accent' : 'bg-bg-tertiary')}>
                                <span className={cn('absolute top-1 w-4 h-4 bg-white rounded-full transition-transform', isPrivate ? 'left-6' : 'left-1')} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Blocked Users Tab */}
            {tab === 'blocked' && (
                <div>
                    {blockedUsers.length === 0 ? (
                        <p className="text-center text-muted text-sm py-12">No blocked users</p>
                    ) : (
                        <div className="space-y-0.5">
                            {blockedUsers.map((block: any) => (
                                <div key={block.blocked_id} className="flex items-center gap-3 px-2.5 py-2 rounded-md hover:bg-surface-hover">
                                    <div className="w-8 h-8 avatar text-xs flex-shrink-0">
                                        {block.profiles?.avatar_url ? <img src={block.profiles.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" /> : getInitials(block.profiles?.full_name || block.profiles?.username || '')}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{block.profiles?.username}</p>
                                    </div>
                                    <button onClick={() => handleUnblock(block.blocked_id)} className="btn btn-secondary text-xs px-2.5 py-1">Unblock</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Follow Requests Tab */}
            {tab === 'requests' && (
                <div>
                    {pendingRequests.length === 0 ? (
                        <p className="text-center text-muted text-sm py-12">No pending requests</p>
                    ) : (
                        <div className="space-y-0.5">
                            {pendingRequests.map((req: any) => (
                                <div key={req.id} className="flex items-center gap-3 px-2.5 py-2 rounded-md hover:bg-surface-hover">
                                    <div className="w-8 h-8 avatar text-xs flex-shrink-0">
                                        {req.profiles?.avatar_url ? <img src={req.profiles.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" /> : getInitials(req.profiles?.full_name || req.profiles?.username || '')}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{req.profiles?.username}</p>
                                        <p className="text-[10px] text-muted">{formatRelativeTime(req.created_at)}</p>
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => handleAccept(req.id, req.requester_id)} className="btn btn-primary text-xs px-2 py-1">Accept</button>
                                        <button onClick={() => handleDecline(req.id)} className="btn btn-secondary text-xs px-2 py-1">Decline</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
