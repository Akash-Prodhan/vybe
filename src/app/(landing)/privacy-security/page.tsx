import Link from 'next/link';

export default function PrivacySecurityPage() {
    const pillars = [
        {
            icon: '🔒', title: 'Row-Level Security', gradient: 'linear-gradient(135deg, #00a884, #00c49a)',
            desc: 'PostgreSQL RLS policy integration for absolute data isolation between users.'
        },
        {
            icon: '🔐', title: 'E2E Encryption', gradient: 'linear-gradient(135deg, #7616f3, #9b4dff)',
            desc: 'Three-step cryptographic flow ensuring only you and your recipient hold the keys.'
        },
        {
            icon: '🚫', title: 'Zero Data Selling', gradient: 'linear-gradient(135deg, #f02849, #ff6b6b)',
            desc: "We don't track you across sites. No advertising profiles. No data harvesting."
        },
    ];
    const controls = [
        { icon: '📥', title: 'Full Export', desc: 'Download every byte of data in JSON/CSV.' },
        { icon: '🗑️', title: 'Right to Erase', desc: 'Instant account deletion with data purging.' },
        { icon: '👁️', title: 'Granular Visibility', desc: 'Choose who sees your profile and posts.' },
        { icon: '🚷', title: 'Safety Blocking', desc: 'Block users and filter interactions.' },
    ];
    const glass = { background: 'rgba(255,255,255,0.75)', backdropFilter: 'blur(24px) saturate(180%)', WebkitBackdropFilter: 'blur(24px) saturate(180%)', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.06)' };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(165deg, #f0f0ff 0%, #f8f5ff 30%, #f5fdf5 60%, #f0f0ff 100%)', fontFamily: "'Inter', system-ui, sans-serif", color: '#1c1e21', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '-200px', left: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(0,168,132,0.06) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', bottom: '-200px', right: '-100px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(118,22,243,0.06) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

            <nav style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 48px', maxWidth: '1280px', margin: '0 auto' }}>
                <Link href="/" style={{ fontSize: '28px', fontWeight: 800, background: 'linear-gradient(135deg, #7616f3, #1877f2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textDecoration: 'none' }}>Vybe</Link>
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <div style={{ display: 'flex', gap: '28px' }}>
                        <Link href="/features" style={{ fontSize: '14px', fontWeight: 500, color: '#606770', textDecoration: 'none' }}>Features</Link>
                        <Link href="/privacy-security" style={{ fontSize: '14px', fontWeight: 600, color: '#7616f3', textDecoration: 'none', borderBottom: '2px solid #7616f3', paddingBottom: '4px' }}>Privacy</Link>
                        <Link href="/community" style={{ fontSize: '14px', fontWeight: 500, color: '#606770', textDecoration: 'none' }}>Community</Link>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Link href="/login" style={{ padding: '10px 24px', fontSize: '14px', fontWeight: 600, color: '#7616f3', border: '1.5px solid #7616f3', borderRadius: '12px', textDecoration: 'none' }}>Log In</Link>
                        <Link href="/signup" style={{ padding: '10px 24px', fontSize: '14px', fontWeight: 600, color: 'white', background: 'linear-gradient(135deg, #7616f3, #5a10d0)', borderRadius: '12px', textDecoration: 'none', boxShadow: '0 4px 16px rgba(118,22,243,0.3)' }}>Create Account</Link>
                    </div>
                </div>
            </nav>

            <section className="fade-in" style={{ position: 'relative', zIndex: 10, textAlign: 'center', maxWidth: '800px', margin: '0 auto', padding: '60px 24px 20px' }}>
                <div className="infinite-bounce" style={{ fontSize: '64px', marginBottom: '20px' }}>🛡️</div>
                <h1 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-1px', marginBottom: '16px' }}>
                    Your Privacy is Our <span style={{ background: 'linear-gradient(135deg, #7616f3, #00a884)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Architecture</span>
                </h1>
                <p style={{ fontSize: '17px', lineHeight: 1.7, color: '#606770', maxWidth: '580px', margin: '0 auto 24px' }}>We enforce privacy at the database layer. Your data is architecturally inaccessible to anyone but you.</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                    {['🏆 GDPR Compliant', '🔒 SOC 2 Ready'].map(b => (
                        <span key={b} style={{ padding: '6px 16px', fontSize: '12px', fontWeight: 600, color: '#7616f3', background: 'rgba(118,22,243,0.06)', borderRadius: '999px', border: '1px solid rgba(118,22,243,0.15)' }}>{b}</span>
                    ))}
                </div>
            </section>

            <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px', position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                    {pillars.map((p, i) => (
                        <div key={p.title} className={`fade-in stagger-${i + 1} hover-lift`} style={{ ...glass, padding: '32px 24px', transition: 'all 300ms' }}>
                            <div className="infinite-bounce" style={{ width: '56px', height: '56px', background: p.gradient, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', marginBottom: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>{p.icon}</div>
                            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px' }}>{p.title}</h3>
                            <p style={{ fontSize: '15px', lineHeight: 1.6, color: '#606770' }}>{p.desc}</p>
                            {i === 0 && <div style={{ marginTop: '16px', background: '#1e1e2e', borderRadius: '12px', padding: '14px', fontFamily: 'monospace', fontSize: '12px', color: '#a6e3a1', lineHeight: 1.6 }}><span style={{ color: '#89b4fa' }}>CREATE POLICY</span> user_isolation<br /><span style={{ color: '#89b4fa' }}>ON</span> user_data <span style={{ color: '#89b4fa' }}>FOR ALL</span><br /><span style={{ color: '#89b4fa' }}>USING</span> (user_id = <span style={{ color: '#f38ba8' }}>auth.uid()</span>);</div>}
                            {i === 1 && <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '16px' }}>{[{ e: '🔑', l: 'Encrypt', c: '#7616f3' }, { e: '📡', l: 'Transit', c: '#1877f2' }, { e: '🔓', l: 'Decrypt', c: '#00a884' }].map((s, j) => (<div key={s.l} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ textAlign: 'center' }}><div style={{ width: '44px', height: '44px', borderRadius: '10px', background: `${s.c}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', margin: '0 auto 4px' }}>{s.e}</div><span style={{ fontSize: '10px', fontWeight: 600, color: s.c }}>{s.l}</span></div>{j < 2 && <span style={{ color: '#ccc', marginBottom: '14px' }}>→</span>}</div>))}</div>}
                            {i === 2 && <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '16px' }}><span style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(240,40,73,0.08)', fontSize: '12px', fontWeight: 600, color: '#f02849', textDecoration: 'line-through' }}>📢 Ads</span><span style={{ padding: '6px 12px', borderRadius: '8px', background: 'rgba(240,40,73,0.08)', fontSize: '12px', fontWeight: 600, color: '#f02849', textDecoration: 'line-through' }}>📊 Tracking</span><span style={{ padding: '6px 12px', borderRadius: '999px', background: 'rgba(0,168,132,0.1)', fontSize: '11px', fontWeight: 700, color: '#00a884' }}>✅ Privacy First</span></div>}
                        </div>
                    ))}
                </div>
            </section>

            <section className="fade-in" style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 24px 60px', position: 'relative', zIndex: 10 }}>
                <div style={{ ...glass, borderRadius: '24px', padding: '48px 40px' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 800, textAlign: 'center', marginBottom: '8px' }}>Complete Data Control</h2>
                    <p style={{ fontSize: '15px', color: '#606770', textAlign: 'center', marginBottom: '36px' }}>Your information, your rules.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
                        {controls.map(d => (
                            <div key={d.title} className="hover-lift" style={{ textAlign: 'center', padding: '20px 12px', borderRadius: '16px', background: 'rgba(118,22,243,0.03)', border: '1px solid rgba(118,22,243,0.06)', transition: 'all 300ms' }}>
                                <div className="infinite-bounce" style={{ fontSize: '32px', marginBottom: '12px' }}>{d.icon}</div>
                                <h4 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '8px' }}>{d.title}</h4>
                                <p style={{ fontSize: '13px', lineHeight: 1.5, color: '#606770' }}>{d.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="fade-in" style={{ maxWidth: '700px', margin: '0 auto', padding: '0 24px 60px', position: 'relative', zIndex: 10 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                    {['GDPR', 'CCPA', 'SOC 2', 'ISO 27001'].map(c => (
                        <div key={c} className="hover-lift" style={{ ...glass, borderRadius: '14px', padding: '20px 12px', textAlign: 'center', transition: 'all 300ms' }}>
                            <span style={{ fontSize: '20px', display: 'block', marginBottom: '6px' }}>✅</span>
                            <span style={{ fontSize: '14px', fontWeight: 700 }}>{c}</span>
                        </div>
                    ))}
                </div>
            </section>

            <section className="fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 24px 80px', position: 'relative', zIndex: 10 }}>
                <div style={{ ...glass, borderRadius: '24px', padding: '56px 48px', textAlign: 'center' }}>
                    <h2 style={{ fontSize: '28px', fontWeight: 800, marginBottom: '12px' }}>Privacy shouldn&apos;t be a premium feature.</h2>
                    <p style={{ fontSize: '16px', color: '#606770', marginBottom: '28px' }}>Join thousands who trust Vybe for secure social interactions.</p>
                    <Link href="/signup" className="pulse-glow" style={{ display: 'inline-block', padding: '14px 36px', fontSize: '16px', fontWeight: 700, color: 'white', background: 'linear-gradient(135deg, #7616f3, #5a10d0)', borderRadius: '14px', textDecoration: 'none', boxShadow: '0 6px 24px rgba(118,22,243,0.35)' }}>Create Secure Account →</Link>
                </div>
            </section>

            <footer style={{ position: 'relative', zIndex: 10, textAlign: 'center', padding: '24px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
                <p style={{ fontSize: '13px', color: '#8a8d91', marginBottom: '12px' }}>© 2026 Vybe. Built with ❤️ and real privacy.</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
                    {['Terms', 'Privacy', 'Cookies', 'Security'].map(l => <a key={l} href="#" style={{ fontSize: '12px', color: '#8a8d91', textDecoration: 'none', fontWeight: 500 }}>{l}</a>)}
                </div>
            </footer>

            <style>{`
        @keyframes infiniteBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        .infinite-bounce { animation: infiniteBounce 2.5s ease-in-out infinite; }
        @keyframes pulseGlow { 0%, 100% { box-shadow: 0 6px 24px rgba(118,22,243,0.35); } 50% { box-shadow: 0 8px 40px rgba(118,22,243,0.55); } }
        .pulse-glow { animation: pulseGlow 2s ease-in-out infinite; position: relative; overflow: hidden; }
        .pulse-glow::before { content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent); transform: skewX(-20deg); }
        .pulse-glow:hover::before { animation: shimmerSweep 0.8s ease forwards; }
        @keyframes shimmerSweep { 0% { left: -100%; } 100% { left: 150%; } }
        .hover-lift { transition: all 400ms cubic-bezier(0.4,0,0.2,1) !important; cursor: pointer; }
        .hover-lift:hover { transform: translateY(-6px) scale(1.02) !important; box-shadow: 0 16px 48px rgba(118,22,243,0.1) !important; }
        @media (max-width: 768px) {
          nav > div:first-of-type > div:first-child { display: none !important; }
          div[style*="repeat(3"] { grid-template-columns: 1fr !important; }
          div[style*="repeat(4"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
        </div>
    );
}
