'use client';

import { useState } from 'react';
import { signOut } from '@/app/(auth)/actions';
import { updateProfile, togglePrivateAccount } from '@/app/(main)/actions';
import { unblockUser } from '@/app/(main)/settings/actions';
import { useTheme } from '@/components/ThemeProvider';
import { getInitials, cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface SettingsClientProps {
    profile: {
        id: string; username: string; full_name: string | null; avatar_url: string | null;
        bio: string | null; is_private: boolean; email?: string;
        location?: string | null; website?: string | null;
    };
    blockedUsers: { id: string; blocked_id: string; profiles: { username: string; avatar_url: string | null } }[];
    pendingRequests: { id: string; requester_id: string; profiles: { username: string; avatar_url: string | null } }[];
}

export default function SettingsClient({ profile, blockedUsers, pendingRequests }: SettingsClientProps) {
    const { theme, toggleTheme } = useTheme();
    const [isPrivate, setIsPrivate] = useState(profile.is_private);
    const router = useRouter();

    async function handleTogglePrivate() {
        setIsPrivate(!isPrivate);
        await togglePrivateAccount();
    }

    return (
        <div className="feed-layout">
            <div className="feed-center" style={{ maxWidth: '700px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '24px' }}>Settings</h1>

                {/* Account Section */}
                <div className="settings-section">
                    <div className="settings-section-title">Account</div>
                    <div className="glass-card" style={{ padding: '8px' }}>
                        <div className="settings-row">
                            <div>
                                <div className="settings-row-label">Username</div>
                                <div className="settings-row-desc">@{profile.username}</div>
                            </div>
                        </div>
                        <div className="settings-row">
                            <div>
                                <div className="settings-row-label">Display Name</div>
                                <div className="settings-row-desc">{profile.full_name || 'Not set'}</div>
                            </div>
                        </div>
                        <div className="settings-row">
                            <div>
                                <div className="settings-row-label">Bio</div>
                                <div className="settings-row-desc">{profile.bio || 'Not set'}</div>
                            </div>
                        </div>
                        <div className="settings-row">
                            <div>
                                <div className="settings-row-label">Location</div>
                                <div className="settings-row-desc">{profile.location || 'Not set'}</div>
                            </div>
                        </div>
                        <div className="settings-row">
                            <div>
                                <div className="settings-row-label">Website</div>
                                <div className="settings-row-desc">{profile.website || 'Not set'}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Privacy & Security */}
                <div className="settings-section">
                    <div className="settings-section-title">Privacy & Security</div>
                    <div className="glass-card" style={{ padding: '8px' }}>
                        <div className="settings-row">
                            <div>
                                <div className="settings-row-label">Private Account</div>
                                <div className="settings-row-desc">Only approved followers can see your posts</div>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" checked={isPrivate} onChange={handleTogglePrivate} />
                                <span className="toggle-slider" />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Appearance */}
                <div className="settings-section">
                    <div className="settings-section-title">Appearance</div>
                    <div className="glass-card" style={{ padding: '8px' }}>
                        <div className="settings-row">
                            <div>
                                <div className="settings-row-label">Dark Mode</div>
                                <div className="settings-row-desc">Switch between light and dark themes</div>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} />
                                <span className="toggle-slider" />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Blocked Users */}
                {blockedUsers.length > 0 && (
                    <div className="settings-section">
                        <div className="settings-section-title">Blocked Users</div>
                        <div className="glass-card" style={{ padding: '8px' }}>
                            {blockedUsers.map((block: any) => (
                                <div key={block.id} className="settings-row">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div className="w-8 h-8 avatar text-xs">
                                            {block.profiles?.avatar_url ? <img src={block.profiles.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" /> : getInitials(block.profiles?.username || '?')}
                                        </div>
                                        <div className="settings-row-label">@{block.profiles?.username}</div>
                                    </div>
                                    <form action={async () => { await unblockUser(block.blocked_id); router.refresh(); }}>
                                        <button type="submit" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-accent)', background: 'none', border: 'none', cursor: 'pointer' }}>Unblock</button>
                                    </form>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Pending Follow Requests */}
                {pendingRequests.length > 0 && (
                    <div className="settings-section">
                        <div className="settings-section-title">Pending Follow Requests</div>
                        <div className="glass-card" style={{ padding: '8px' }}>
                            {pendingRequests.map((req: any) => (
                                <div key={req.id} className="settings-row">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div className="w-8 h-8 avatar text-xs">
                                            {req.profiles?.avatar_url ? <img src={req.profiles.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" /> : getInitials(req.profiles?.username || '?')}
                                        </div>
                                        <div className="settings-row-label">@{req.profiles?.username}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Danger Zone */}
                <div className="settings-section">
                    <div className="settings-section-title">Danger Zone</div>
                    <div className="glass-card" style={{ padding: '8px' }}>
                        <div className="settings-row">
                            <div>
                                <div className="settings-row-label" style={{ color: 'var(--color-danger)' }}>Log Out</div>
                                <div className="settings-row-desc">Sign out of your account</div>
                            </div>
                            <form action={signOut}>
                                <button type="submit" className="btn" style={{ fontSize: '12px', padding: '6px 16px', background: 'var(--color-danger)', color: 'white', border: 'none' }}>Log Out</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <aside className="feed-right-sidebar">
                <div className="glass-card">
                    <h3 className="sidebar-section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        Account Summary
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div className="w-12 h-12 avatar text-sm flex-shrink-0">
                            {profile.avatar_url ? <img src={profile.avatar_url} alt="" className="w-12 h-12 rounded-full object-cover" /> : getInitials(profile.full_name || profile.username)}
                        </div>
                        <div>
                            <p style={{ fontSize: '14px', fontWeight: 600 }}>{profile.full_name || profile.username}</p>
                            <p style={{ fontSize: '12px', color: 'var(--color-muted)' }}>@{profile.username}</p>
                        </div>
                    </div>
                    <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: '12px' }}>
                        <p style={{ fontSize: '13px', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                            {isPrivate ? 'Private account' : 'Public account'}
                        </p>
                        <p style={{ fontSize: '13px', color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {theme === 'dark' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5" /></svg>
                            )}
                            {theme === 'dark' ? 'Dark mode' : 'Light mode'}
                        </p>
                    </div>
                </div>

                <div className="glass-card">
                    <h3 className="sidebar-section-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                        Help & Support
                    </h3>
                    <p style={{ fontSize: '13px', color: 'var(--color-secondary)', lineHeight: 1.6 }}>
                        Need help? Visit our community page or check the privacy policy for more information about how we handle your data.
                    </p>
                </div>
            </aside>
        </div>
    );
}
