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
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
        ),
    },
    {
        href: '/search',
        label: 'Search',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
        ),
    },
    {
        href: '/chat',
        label: 'Chat',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
        ),
    },
    {
        href: '/notifications',
        label: 'Alerts',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>
        ),
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
            'hidden md:flex flex-col h-screen sticky top-0 border-r border-border bg-surface transition-all duration-300',
            collapsed ? 'w-[72px]' : 'w-64'
        )}>
            {/* Logo + Toggle */}
            <div className={cn('flex items-center p-5', collapsed ? 'justify-center' : 'justify-between')}>
                <Link href="/feed" className={cn('font-extrabold font-display gradient-text transition-all', collapsed ? 'text-xl' : 'text-2xl')}>
                    {collapsed ? 'V' : 'Vybe'}
                </Link>
                {!collapsed && (
                    <button onClick={handleToggle} className="btn btn-ghost p-1.5 rounded-lg" title="Collapse sidebar">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="11 17 6 12 11 7" /><polyline points="18 17 13 12 18 7" /></svg>
                    </button>
                )}
            </div>

            {collapsed && (
                <button onClick={handleToggle} className="mx-auto btn btn-ghost p-1.5 rounded-lg mb-2" title="Expand sidebar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="13 17 18 12 13 7" /><polyline points="6 17 11 12 6 7" /></svg>
                </button>
            )}

            {/* Nav Items */}
            <nav className="flex-1 px-3">
                <ul className="space-y-1">
                    {navItems.map((item) => {
                        const active = pathname.startsWith(item.href);
                        return (
                            <li key={item.href}>
                                <Link
                                    href={item.href}
                                    title={collapsed ? item.label : undefined}
                                    className={cn(
                                        'flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200',
                                        collapsed ? 'justify-center px-2 py-3' : 'px-4 py-3',
                                        active
                                            ? 'bg-accent/10 text-accent'
                                            : 'text-secondary hover:bg-bg-secondary hover:text-primary'
                                    )}
                                >
                                    <span className={cn(active && 'text-accent')}>{item.icon}</span>
                                    {!collapsed && item.label}
                                    {active && !collapsed && (
                                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent" />
                                    )}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>

            {/* Bottom Actions */}
            <div className="p-3 space-y-1 border-t border-border">
                {/* Theme toggle */}
                <button
                    onClick={toggleTheme}
                    title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
                    className={cn(
                        'flex items-center gap-3 w-full rounded-xl text-sm font-medium text-secondary hover:bg-bg-secondary hover:text-primary transition-all',
                        collapsed ? 'justify-center px-2 py-3' : 'px-4 py-3'
                    )}
                >
                    {theme === 'dark' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
                    )}
                    {!collapsed && (theme === 'dark' ? 'Light Mode' : 'Dark Mode')}
                </button>

                {/* Profile */}
                <Link
                    href="/profile"
                    title={collapsed ? 'Profile' : undefined}
                    className={cn(
                        'flex items-center gap-3 rounded-xl text-sm font-medium transition-all',
                        collapsed ? 'justify-center px-2 py-3' : 'px-4 py-3',
                        pathname === '/profile'
                            ? 'bg-accent/10 text-accent'
                            : 'text-secondary hover:bg-bg-secondary hover:text-primary'
                    )}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    {!collapsed && 'Profile'}
                </Link>
            </div>
        </aside>
    );
}
