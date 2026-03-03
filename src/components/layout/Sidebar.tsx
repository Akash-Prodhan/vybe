'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/components/ThemeProvider';

const navItems = [
    {
        href: '/feed',
        label: 'Feed',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>,
    },
    {
        href: '/search',
        label: 'Explore',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
    },
    {
        href: '/chat',
        label: 'Messages',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>,
    },
    {
        href: '/groups',
        label: 'Groups',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>,
    },
    {
        href: '/notifications',
        label: 'Alerts',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>,
    },
    {
        href: '/settings',
        label: 'Settings',
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" /></svg>,
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem('vybe-sidebar');
        if (stored === 'collapsed') setCollapsed(true);
    }, []);

    function handleToggle() {
        const next = !collapsed;
        setCollapsed(next);
        localStorage.setItem('vybe-sidebar', next ? 'collapsed' : 'expanded');
    }

    return (
        <aside className={cn(
            'hidden md:flex flex-col h-screen sticky top-0 bg-bg-secondary transition-all duration-200',
            collapsed ? 'w-[72px]' : 'w-60'
        )}>
            {/* Logo */}
            <div className={cn('flex items-center h-12 px-4 shadow-[0_1px_0_0] shadow-bg-tertiary', collapsed && 'justify-center')}>
                <Link href="/feed" className="font-bold font-display gradient-text text-lg">
                    {collapsed ? 'V' : 'Vybe'}
                </Link>
                {!collapsed && (
                    <button onClick={handleToggle} className="ml-auto btn btn-ghost p-1 rounded text-muted hover:text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" /></svg>
                    </button>
                )}
            </div>

            {collapsed && (
                <button onClick={handleToggle} className="mx-auto mt-2 btn btn-ghost p-1 rounded text-muted hover:text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" /></svg>
                </button>
            )}

            {/* Nav */}
            <nav className="flex-1 px-2 pt-2 overflow-y-auto">
                {!collapsed && (
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted px-2 mb-1.5">Navigation</p>
                )}
                <ul className="space-y-0.5">
                    {navItems.map((item) => {
                        const active = pathname.startsWith(item.href);
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    title={collapsed ? item.label : undefined}
                                    className={cn(
                                        'flex items-center gap-3 rounded text-sm font-medium transition-colors duration-100',
                                        collapsed ? 'justify-center px-2 py-2.5' : 'px-2.5 py-2',
                                        active
                                            ? 'bg-surface-hover text-primary'
                                            : 'text-muted hover:bg-surface-hover hover:text-secondary'
                                    )}
                                >
                                    <span className={cn(active && 'text-primary')}>{item.icon}</span>
                                    {!collapsed && item.label}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Footer */}
            <div className="bg-bg-tertiary px-2 py-2 flex items-center gap-1">
                <Link
                    href="/profile"
                    title="Profile"
                    className={cn(
                        'flex items-center gap-2 rounded px-2 py-1.5 text-sm font-medium flex-1 min-w-0 transition-colors',
                        pathname === '/profile' ? 'text-primary' : 'text-muted hover:text-secondary'
                    )}
                >
                    <div className="w-8 h-8 avatar text-xs flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    </div>
                    {!collapsed && <span className="truncate">Profile</span>}
                </Link>

                <button
                    onClick={toggleTheme}
                    title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                    className="btn btn-ghost p-1.5 rounded text-muted"
                >
                    {theme === 'dark' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
                    )}
                </button>
            </div>
        </aside>
    );
}
