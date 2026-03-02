'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

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

    return (
        <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 border-r border-border bg-white">
            <div className="p-6">
                <Link href="/feed" className="text-2xl font-bold tracking-tight text-primary">
                    Vybe
                </Link>
            </div>

            <nav className="flex-1 px-3">
                <ul className="space-y-1">
                    {navItems.map((item) => (
                        <li key={item.href}>
                            <Link
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                                    pathname.startsWith(item.href)
                                        ? 'bg-bg-tertiary text-primary'
                                        : 'text-secondary hover:bg-bg-secondary hover:text-primary'
                                )}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-4 border-t border-border">
                <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-secondary hover:bg-bg-secondary hover:text-primary transition-all"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                    Profile
                </Link>
            </div>
        </aside>
    );
}
