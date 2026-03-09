'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export function Navbar() {
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Close menu when route changes
    useEffect(() => {
        setIsMenuOpen(false);
    }, [pathname]);

    const links = [
        { label: 'Features', href: '/features' },
        { label: 'Privacy', href: '/privacy-security' },
        { label: 'Community', href: '/community' },
    ];

    // Determine if we are on login or signup to potentially handle differently?
    // Actually the user said "add hamberger menu in nav bar for feaures, community, privacy pages... keep on header section for all landing page, features page and privacy pages"
    // So we use it on landing, features, privacy, community pages.

    return (
        <nav className="mobile-nav" style={{
            position: 'relative', zIndex: 50,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 48px', maxWidth: '1280px', margin: '0 auto',
        }}>
            <Link href="/" style={{
                fontSize: '28px', fontWeight: 800,
                background: 'linear-gradient(135deg, #7616f3, #1877f2)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                textDecoration: 'none',
            }}>Vybe</Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                <div className="mobile-nav-links" style={{ display: 'flex', gap: '28px' }}>
                    {links.map(item => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.label} href={item.href} style={{
                                fontSize: '14px',
                                fontWeight: isActive ? 600 : 500,
                                color: isActive ? '#7616f3' : '#606770',
                                textDecoration: 'none',
                                borderBottom: isActive ? '2px solid #7616f3' : 'none',
                                paddingBottom: isActive ? '4px' : '0',
                                transition: 'color 200ms',
                            }}>
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                <div className="mobile-nav-btns" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <Link href="/login" style={{
                        padding: '10px 24px', fontSize: '14px', fontWeight: 600,
                        color: '#7616f3', border: '1.5px solid #7616f3',
                        borderRadius: '12px', textDecoration: 'none',
                        background: 'transparent', transition: 'all 200ms',
                    }}>Log In</Link>
                    <Link href="/signup" style={{
                        padding: '10px 24px', fontSize: '14px', fontWeight: 600,
                        color: 'white', background: 'linear-gradient(135deg, #7616f3, #5a10d0)',
                        borderRadius: '12px', textDecoration: 'none',
                        boxShadow: '0 4px 16px rgba(118,22,243,0.3)', border: 'none',
                        transition: 'all 200ms',
                    }}>Create Account</Link>

                    {/* Hamburger Button (shown only on mobile) */}
                    <button
                        className="mobile-hamburger"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        style={{
                            display: 'none', // Hidden on desktop, shown via CSS on mobile
                            background: 'none', border: 'none', cursor: 'pointer',
                            padding: '4px', marginLeft: '4px', zIndex: 60,
                            flexDirection: 'column', gap: '5px',
                        }}
                    >
                        <div style={{ width: '22px', height: '2px', background: '#1c1e21', transition: '0.3s', borderRadius: '2px', transform: isMenuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
                        <div style={{ width: '22px', height: '2px', background: '#1c1e21', transition: '0.3s', borderRadius: '2px', opacity: isMenuOpen ? 0 : 1 }} />
                        <div style={{ width: '22px', height: '2px', background: '#1c1e21', transition: '0.3s', borderRadius: '2px', transform: isMenuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
                    borderBottom: '1px solid rgba(0,0,0,0.05)', borderTop: '1px solid rgba(0,0,0,0.05)',
                    padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '8px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
                    zIndex: 40
                }}>
                    {links.map(item => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.label} href={item.href}
                                onClick={() => setIsMenuOpen(false)}
                                style={{
                                    fontSize: '16px',
                                    fontWeight: isActive ? 600 : 500,
                                    color: isActive ? '#7616f3' : '#1c1e21',
                                    textDecoration: 'none',
                                    padding: '12px 16px',
                                    background: isActive ? 'rgba(118,22,243,0.05)' : 'transparent',
                                    borderRadius: '12px'
                                }}>
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            )}
        </nav>
    );
}
