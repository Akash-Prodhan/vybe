import Link from 'next/link';

export default function CommunityPage() {
    const stats = [
        { val: '10K+', label: 'Active Users' }, { val: '50K+', label: 'Messages Daily' },
        { val: '2K+', label: 'Groups Created' }, { val: '99.9%', label: 'Uptime SLA' },
    ];
    const steps = [
        { num: '1', title: 'Create', desc: 'Set up your profile and define your interests in seconds.', color: '#7616f3' },
        { num: '2', title: 'Connect', desc: 'Find your people using our intelligent discovery engine.', color: '#1877f2' },
        { num: '3', title: 'Thrive', desc: 'Grow together, share ideas, and build lasting friendships.', color: '#f02849' },
    ];
    const testimonials = [
        { quote: 'Vybe has completely changed how I find collaborators for my creative projects. The community vibe is unmatched!', name: 'Sarah Chen', role: 'UI Designer', color: '#7616f3' },
        { quote: 'The groups are high-quality and free of the usual social media noise. It feels like home.', name: 'Marcus Rivera', role: 'Software Engineer', color: '#1877f2' },
        { quote: 'I found my best friends in the Photography group. This platform is actually built for connection.', name: 'Aisha Patel', role: 'Content Creator', color: '#f02849' },
    ];
    const groups = [
        { name: 'Design Hub', members: '1.2K', badge: 'Creative', color: '#7616f3', desc: 'The premier space for UI/UX enthusiasts to share daily inspiration.' },
        { name: 'Indie Hackers', members: '890', badge: 'Tech', color: '#1877f2', desc: 'Building products, sharing revenue, and helping each other grow.' },
        { name: 'Photography Pro', members: '2.1K', badge: 'Art', color: '#f02849', desc: 'Weekly challenges and professional critique for all skill levels.' },
    ];
    const glass = { background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(165deg, #f0f0ff 0%, #f8f5ff 30%, #fdf5f5 60%, #f0f0ff 100%)', fontFamily: "'Inter', system-ui, sans-serif", color: '#1c1e21', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-200px', right: '-150px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(240,40,73,0.06) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-200px', left: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(118,22,243,0.06) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

            <nav style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 48px', maxWidth: '1280px', margin: '0 auto' }}>
                <Link href="/" style={{ fontSize: '28px', fontWeight: 800, background: 'linear-gradient(135deg, #7616f3, #1877f2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textDecoration: 'none' }}>Vybe</Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <div style={{ display: 'flex', gap: '28px' }}>
                        <Link href="/features" style={{ fontSize: '14px', fontWeight: 500, color: '#606770', textDecoration: 'none' }}>Features</Link>
                        <Link href="/privacy-security" style={{ fontSize: '14px', fontWeight: 500, color: '#606770', textDecoration: 'none' }}>Privacy</Link>
                        <Link href="/community" style={{ fontSize: '14px', fontWeight: 600, color: '#7616f3', textDecoration: 'none', borderBottom: '2px solid #7616f3', paddingBottom: '4px' }}>Community</Link>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Link href="/login" style={{ padding: '10px 24px', fontSize: '14px', fontWeight: 600, color: '#7616f3', border: '1.5px solid #7616f3', borderRadius: '12px', textDecoration: 'none' }}>Log In</Link>
                        <Link href="/signup" style={{ padding: '10px 24px', fontSize: '14px', fontWeight: 600, color: 'white', background: 'linear-gradient(135deg, #7616f3, #5a10d0)', borderRadius: '12px', textDecoration: 'none', boxShadow: '0 4px 16px rgba(118,22,243,0.3)' }}>Create Account</Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <section className="fade-in" style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '800px', margin: '0 auto', padding: '60px 24px 20px' }}>
                <div className="infinite-bounce" style={{ fontSize: '64px', marginBottom: '20px' }}>👥</div>
                <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-1px', marginBottom: '16px' }}>
                    Built <span style={{ background: 'linear-gradient(135deg, #7616f3, #1877f2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>By The Community</span>, For The Community
                </h1>
                <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#606770', maxWidth: '560px', margin: '0 auto' }}>Vybe is more than just an app. It&apos;s a movement powered by thousands of creators, thinkers, and explorers worldwide.</p>
            </section>

            {/* Stats */}
            <section className="fade-in" style={{ display: 'flex', justifyContent: 'center', gap: '48px', padding: '40px 24px 60px', maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 10, flexWrap: 'wrap' }}>
                {stats.map(s => (
                    <div key={s.label} className="infinite-bounce" style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: '40px', fontWeight: 800, lineHeight: 1, background: 'linear-gradient(135deg, #7616f3, #1877f2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{s.val}</p>
                        <p style={{ fontSize: '13px', color: '#8a8d91', marginTop: '6px', fontWeight: 500 }}>{s.label}</p>
                    </div>
                ))}
            </section>

            {/* How It Works */}
            <section className="fade-in" style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px 60px', position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
                    {steps.map((s, i) => (
                        <div key={s.title} style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <div className="hover-lift" style={{ textAlign: 'center', width: '220px', transition: 'all 300ms' }}>
                                <div className="infinite-bounce" style={{ width: '56px', height: '56px', borderRadius: '50%', background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: 800, color: 'white', margin: '0 auto 12px', boxShadow: `0 4px 16px ${s.color}40` }}>{s.num}</div>
                                <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>{s.title}</h3>
                                <p style={{ fontSize: '14px', lineHeight: 1.5, color: '#606770' }}>{s.desc}</p>
                            </div>
                            {i < 2 && <div style={{ width: '40px', borderTop: '2px dashed #d1d5db', marginTop: '28px' }} />}
                        </div>
                    ))}
                </div>
            </section>

            {/* Testimonials + Groups */}
            <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px 60px', position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                    {/* Testimonials */}
                    <div>
                        <h2 className="fade-in" style={{ fontSize: '22px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>💬 Community Voices</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {testimonials.map((t, i) => (
                                <div key={t.name} className={`fade-in stagger-${i + 1} hover-lift`} style={{ ...glass, padding: '24px', transition: 'all 300ms' }}>
                                    <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#4a4d52', fontStyle: 'italic', marginBottom: '16px' }}>&ldquo;{t.quote}&rdquo;</p>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `linear-gradient(135deg, ${t.color}, ${t.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '14px' }}>{t.name[0]}</div>
                                        <div><p style={{ fontSize: '14px', fontWeight: 700 }}>{t.name}</p><p style={{ fontSize: '12px', color: '#8a8d91' }}>{t.role}</p></div>
                                        <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#f9a825' }}>⭐⭐⭐⭐⭐</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Groups */}
                    <div>
                        <h2 className="fade-in" style={{ fontSize: '22px', fontWeight: 800, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>🔥 Trending Groups</h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {groups.map((g, i) => (
                                <div key={g.name} className={`fade-in stagger-${i + 1} hover-lift`} style={{ ...glass, padding: '24px', transition: 'all 300ms' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <h3 style={{ fontSize: '17px', fontWeight: 700 }}>{g.name}</h3>
                                        <span style={{ padding: '4px 12px', borderRadius: '999px', background: `${g.color}12`, color: g.color, fontSize: '11px', fontWeight: 700 }}>{g.badge}</span>
                                    </div>
                                    <p style={{ fontSize: '14px', lineHeight: 1.5, color: '#606770', marginBottom: '10px' }}>{g.desc}</p>
                                    <p style={{ fontSize: '12px', color: '#8a8d91', fontWeight: 500 }}>👥 {g.members} members</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Open Source */}
            <section className="fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px 60px', position: 'relative', zIndex: 10 }}>
                <div style={{ ...glass, borderRadius: '24px', padding: '48px', textAlign: 'center' }}>
                    <div className="infinite-bounce" style={{ fontSize: '40px', marginBottom: '16px' }}>🌐</div>
                    <h2 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '10px' }}>Open Source & Transparent</h2>
                    <p style={{ fontSize: '15px', color: '#606770', marginBottom: '24px', maxWidth: '500px', margin: '0 auto 24px' }}>We believe in building in public. All our core infrastructure is open to the community for contribution and audit.</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                        <a href="https://github.com/Akash-Prodhan/vybe" target="_blank" style={{ padding: '12px 24px', fontSize: '14px', fontWeight: 600, color: 'white', background: '#1c1e21', borderRadius: '12px', textDecoration: 'none' }}>⭐ View on GitHub</a>
                        <a href="#" style={{ padding: '12px 24px', fontSize: '14px', fontWeight: 600, color: '#7616f3', border: '1.5px solid #7616f3', borderRadius: '12px', textDecoration: 'none' }}>Read Our Blog</a>
                    </div>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px 80px', position: 'relative', zIndex: 10 }}>
                <div style={{ ...glass, borderRadius: '24px', padding: '56px 48px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '30px', fontWeight: 800, marginBottom: '10px' }}>Be Part of Something Real</h2>
                    <p style={{ fontSize: '16px', color: '#606770', marginBottom: '28px' }}>No ads. No algorithms. Just people.</p>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                        <Link href="/signup" className="pulse-glow" style={{ padding: '14px 36px', fontSize: '16px', fontWeight: 700, color: 'white', background: 'linear-gradient(135deg, #7616f3, #5a10d0)', borderRadius: '14px', textDecoration: 'none', boxShadow: '0 6px 24px rgba(118,22,243,0.35)' }}>Join the Community →</Link>
                        <Link href="/features" style={{ padding: '14px 36px', fontSize: '16px', fontWeight: 600, color: '#7616f3', border: '2px solid rgba(118,22,243,0.25)', borderRadius: '14px', textDecoration: 'none', background: 'rgba(255,255,255,0.6)' }}>Explore Features</Link>
                    </div>
                </div>
            </section>

            <footer style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '24px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <p style={{ fontSize: '13px', color: '#8a8d91', marginBottom: '12px' }}>© 2026 Vybe. Built with ❤️ and real privacy.</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
                    {['About', 'Guidelines', 'Safety', 'Status'].map(l => <a key={l} href="#" style={{ fontSize: '12px', color: '#8a8d91', textDecoration: 'none', fontWeight: 500 }}>{l}</a>)}
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
        .hover-lift { transition: all 400ms cubic-bezier(0.4,0,0.2,1) !important; cursor: pointer; }
        .hover-lift:hover { transform: translateY(-6px) scale(1.02) !important; box-shadow: 0 16px 48px rgba(118,22,243,0.1) !important; }
        @media (max-width: 768px) {
          nav > div:first-of-type > div:first-child { display: none !important; }
          div[style*="1fr 1fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    );
}
