'use client';

import { useState, useEffect } from 'react';

export default function SidebarSpacer() {
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        // Read initial state
        const saved = localStorage.getItem('vybe-sidebar-collapsed');
        if (saved === 'true') setCollapsed(true);

        // Listen for storage changes (triggered by Sidebar toggle)
        function handleStorage(e: StorageEvent) {
            if (e.key === 'vybe-sidebar-collapsed') {
                setCollapsed(e.newValue === 'true');
            }
        }

        // Also listen for custom event for same-tab updates
        function handleCustom() {
            const val = localStorage.getItem('vybe-sidebar-collapsed');
            setCollapsed(val === 'true');
        }

        window.addEventListener('storage', handleStorage);
        window.addEventListener('sidebar-toggle', handleCustom);
        return () => {
            window.removeEventListener('storage', handleStorage);
            window.removeEventListener('sidebar-toggle', handleCustom);
        };
    }, []);

    return (
        <div
            className="hidden md:block flex-shrink-0"
            style={{
                width: collapsed ? '72px' : '260px',
                transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1)',
            }}
        />
    );
}
