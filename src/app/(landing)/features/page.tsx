import Link from 'next/link';

export default function FeaturesPage() {
    const features = [
        {
            icon: '🔐', title: 'Encrypted Chat', gradient: 'linear-gradient(135deg, #00a884, #00c49a)',
            desc: 'Secure end-to-end messaging for your privacy. Your conversations stay between you and your circle.',
            bullets: ['Private keys stored on-device only', 'Zero tracking or message scanning', 'Instant cross-device sync'],
        },
        {
            icon: '📸', title: 'Stories & Moments', gradient: 'linear-gradient(135deg, #7616f3, #9b4dff)',
            desc: 'Share your daily highlights with immersive visuals and interactive elements.',
            bullets: ['24h lifespan with auto-expire', 'High-res photo & video support', 'Interactive stickers & polls'],
        },
        {
            icon: '📝', title: 'Smart Feed', gradient: 'linear-gradient(135deg, #1877f2, #42a5f5)',
            desc: 'AI-driven content discovery tailored to your unique interests and habits.',
            bullets: ['Interest-based recommendations', 'Ad-free chronological option', 'Chronological toggle always available'],
        },
        {
            icon: '👥', title: 'Dynamic Groups', gradient: 'linear-gradient(135deg, #f02849, #ff6b6b)',
            desc: 'Collaborative spaces for your niche communities and hobby groups.',
            bullets: ['Custom admin & moderator roles', 'Event planning & announcements', 'Shared media vaults & archives'],
        },
        {
            icon: '🔔', title: 'Smart Notifications', gradient: 'linear-gradient(135deg, #ff9800, #ffb74d)',
            desc: 'Stay updated without the digital noise. Only get notified for what truly matters.',
            bullets: ['Priority inbox with smart filters', 'Quiet hours & DND scheduling', 'Batch delivery for less interrupts'],
        },
        {
            icon: '🎭', title: 'Rich Profiles', gradient: 'linear-gradient(135deg, #00bcd4, #4dd0e1)',
            desc: 'Express yourself with customizable themes and integrated portfolios.',
            bullets: ['Public/private profile toggle', 'Achievement badge system', 'Portfolio & link integration'],
        },
    ];

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(165deg, #f0f0ff 0%, #f8f5ff 30%, #fdf5f5 60%, #f0f0ff 100%)',
            fontFamily: "'Inter', system-ui, sans-serif",
            color: '#1c1e21', overflow: 'hidden', position: 'relative',
        }}>
            {/* Ambient blobs */}
            <div style={{ position: 'absolute', top: '-200px', right: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(118,22,243,0.07) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-200px', left: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(24,119,242,0.06) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

            {/* Navbar */}
            <nav style={{
                position: 'relative', zIndex: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 48px', maxWidth: '1280px', margin: '0 auto',
            }}>
                <Link href="/" style={{ fontSize: '28px', fontWeight: 800, background: 'linear-gradient(135deg, #7616f3, #1877f2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textDecoration: 'none' }}>Vybe</Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <div style={{ display: 'flex', gap: '28px' }}>
                        <Link href="/features" style={{ fontSize: '14px', fontWeight: 600, color: '#7616f3', textDecoration: 'none', borderBottom: '2px solid #7616f3', paddingBottom: '4px' }}>Features</Link>
                        <Link href="/privacy-security" style={{ fontSize: '14px', fontWeight: 500, color: '#606770', textDecoration: 'none' }}>Privacy</Link>
                        <Link href="/community" style={{ fontSize: '14px', fontWeight: 500, color: '#606770', textDecoration: 'none' }}>Community</Link>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Link href="/login" style={{ padding: '10px 24px', fontSize: '14px', fontWeight: 600, color: '#7616f3', border: '1.5px solid #7616f3', borderRadius: '12px', textDecoration: 'none', background: 'transparent' }}>Log In</Link>
                        <Link href="/signup" style={{ padding: '10px 24px', fontSize: '14px', fontWeight: 600, color: 'white', background: 'linear-gradient(135deg, #7616f3, #5a10d0)', borderRadius: '12px', textDecoration: 'none', boxShadow: '0 4px 16px rgba(118,22,243,0.3)' }}>Create Account</Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="fade-in" style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '800px', margin: '0 auto', padding: '60px 24px 20px' }}>
                <div className="infinite-bounce" style={{ marginBottom: '24px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 18px', fontSize: '12px', fontWeight: 700, color: '#7616f3', background: 'rgba(118,22,243,0.08)', borderRadius: '999px', border: '1px solid rgba(118,22,243,0.15)', letterSpacing: '0.5px' }}>🚀 PLATFORM FEATURES</span>
                </div>
                <h1 style={{ fontSize: 'clamp(36px, 5vw, 60px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-1px', marginBottom: '16px' }}>
                    Everything You Need to{' '}
                    <span style={{ background: 'linear-gradient(135deg, #7616f3, #1877f2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Connect & Create</span>
                </h1>
                <p style={{ fontSize: '18px', lineHeight: 1.7, color: '#606770', maxWidth: '560px', margin: '0 auto' }}>
                    Experience the next generation of social interaction with Vybe&apos;s premium suite of tools designed for creators and communities.
                </p>
            </section>

            {/* Feature Grid */}
            <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '48px 24px 80px', position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                    {features.map((f, i) => (
                        <div key={f.title} className={`fade-in stagger-${(i % 4) + 1} hover-lift`} style={{
                            background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                            border: '1px solid rgba(255,255,255,0.5)', borderRadius: '20px', padding: '32px 28px',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.06)', transition: 'all 300ms cubic-bezier(0.4,0,0.2,1)',
                        }}>
                            <div className="infinite-bounce" style={{
                                width: '56px', height: '56px', background: f.gradient, borderRadius: '16px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px',
                                marginBottom: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            }}>{f.icon}</div>
                            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>{f.title}</h3>
                            <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#606770', marginBottom: '16px' }}>{f.desc}</p>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {f.bullets.map(b => (
                                    <li key={b} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#4a4d52' }}>
                                        <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(118,22,243,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', flexShrink: 0 }}>✓</span>
                                        {b}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px 80px', position: 'relative', zIndex: 10 }}>
                <div style={{
                    background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                    border: '1px solid rgba(255,255,255,0.5)', borderRadius: '24px', padding: '56px 48px',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.06)', textAlign: 'center',
                }}>
                    <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '12px' }}>Ready to Experience Vybe?</h2>
                    <p style={{ fontSize: '16px', color: '#606770', marginBottom: '28px' }}>Join over 250,000+ creators and influencers worldwide.</p>
                    <Link href="/signup" className="pulse-glow" style={{
                        display: 'inline-block', padding: '14px 36px', fontSize: '16px', fontWeight: 700,
                        color: 'white', background: 'linear-gradient(135deg, #7616f3, #5a10d0)',
                        borderRadius: '14px', textDecoration: 'none', boxShadow: '0 6px 24px rgba(118,22,243,0.35)',
                    }}>Create Free Account →</Link>
                    <p style={{ marginTop: '16px', fontSize: '13px', color: '#8a8d91' }}>No credit card required</p>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '24px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <p style={{ fontSize: '13px', color: '#8a8d91', marginBottom: '12px' }}>© 2026 Vybe. Built with ❤️ and real privacy.</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
                    {['Terms', 'Privacy', 'Cookies', 'Security'].map(link => (
                        <a key={link} href="#" style={{ fontSize: '12px', color: '#8a8d91', textDecoration: 'none', fontWeight: 500 }}>{link}</a>
                    ))}
                </div>
            </footer>

            <style>{`
        @keyframes infiniteBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .infinite-bounce { animation: infiniteBounce 2.5s ease-in-out infinite; }
        .infinite-bounce:nth-child(2) { animation-delay: 0.3s; }
        .infinite-bounce:nth-child(3) { animation-delay: 0.6s; }
        @keyframes pulseGlow { 0%, 100% { box-shadow: 0 6px 24px rgba(118,22,243,0.35); } 50% { box-shadow: 0 8px 40px rgba(118,22,243,0.55); } }
        .pulse-glow { animation: pulseGlow 2s ease-in-out infinite; position: relative; overflow: hidden; }
        .pulse-glow::before { content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent); transform: skewX(-20deg); }
        .pulse-glow:hover::before { animation: shimmerSweep 0.8s ease forwards; }
        @keyframes shimmerSweep { 0% { left: -100%; } 100% { left: 150%; } }
        .pulse-glow:hover { transform: translateY(-3px) scale(1.03); box-shadow: 0 12px 48px rgba(118,22,243,0.5) !important; }
        .hover-lift { transition: all 400ms cubic-bezier(0.4,0,0.2,1) !important; cursor: pointer; position: relative; }
        .hover-lift::before { content: ''; position: absolute; inset: -1px; border-radius: 21px; background: linear-gradient(135deg, rgba(118,22,243,0.3), rgba(24,119,242,0.3), rgba(240,40,73,0.2)); opacity: 0; transition: opacity 400ms ease; z-index: -1; filter: blur(1px); }
        .hover-lift:hover::before { opacity: 1; }
        .hover-lift:hover { transform: translateY(-8px) scale(1.02) !important; box-shadow: 0 20px 60px rgba(118,22,243,0.12), 0 8px 24px rgba(0,0,0,0.06) !important; border-color: rgba(118,22,243,0.2) !important; }
        .hover-lift:hover .infinite-bounce { animation: none !important; transform: scale(1.15) rotate(-5deg); transition: transform 300ms cubic-bezier(0.34,1.56,0.64,1); }
        .hover-lift:hover h3 { background: linear-gradient(135deg, #7616f3, #1877f2); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        @media (max-width: 768px) {
          nav > div:first-of-type > div:first-child { display: none !important; }
          div[style*="gridTemplateColumns: repeat(2"] { grid-template-columns: 1fr !important; }
          h1 { font-size: 32px !important; }
        }
      `}</style>
        </div>
    );
}
