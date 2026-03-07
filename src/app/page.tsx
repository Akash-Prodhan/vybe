import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/feed');
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(165deg, #f0f0ff 0%, #f8f5ff 30%, #fdf5f5 60%, #f0f0ff 100%)',
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      color: '#1c1e21',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Ambient background blobs */}
      <div style={{ position: 'absolute', top: '-250px', left: '-150px', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(118,22,243,0.08) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '30%', right: '-200px', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(24,119,242,0.06) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-200px', left: '30%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(240,40,73,0.05) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

      {/* ===== NAVBAR ===== */}
      <nav style={{
        position: 'relative', zIndex: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 48px',
        maxWidth: '1280px', margin: '0 auto',
      }}>
        <Link href="/" style={{
          fontSize: '28px', fontWeight: 800,
          background: 'linear-gradient(135deg, #7616f3, #1877f2)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          textDecoration: 'none',
        }}>Vybe</Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div style={{ display: 'flex', gap: '28px' }}>
            {['Features', 'Privacy', 'Community'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} style={{
                fontSize: '14px', fontWeight: 500, color: '#606770',
                textDecoration: 'none', transition: 'color 200ms',
              }}>{item}</a>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/login" style={{
              padding: '10px 24px', fontSize: '14px', fontWeight: 600,
              color: '#7616f3', border: '1.5px solid #7616f3',
              borderRadius: '12px', textDecoration: 'none',
              transition: 'all 200ms',
              background: 'transparent',
            }}>Log In</Link>
            <Link href="/signup" style={{
              padding: '10px 24px', fontSize: '14px', fontWeight: 600,
              color: 'white', background: 'linear-gradient(135deg, #7616f3, #5a10d0)',
              borderRadius: '12px', textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(118,22,243,0.3)',
              transition: 'all 200ms', border: 'none',
            }}>Create Account</Link>
          </div>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="fade-in" style={{
        position: 'relative', zIndex: 10,
        textAlign: 'center',
        maxWidth: '900px', margin: '0 auto',
        padding: '80px 24px 40px',
      }}>
        {/* Beta badge */}
        <div className="bounce-in" style={{ marginBottom: '24px' }}>
          <span className="infinite-bounce" style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '6px 18px', fontSize: '12px', fontWeight: 700,
            color: '#7616f3', background: 'rgba(118,22,243,0.08)',
            borderRadius: '999px', border: '1px solid rgba(118,22,243,0.15)',
            letterSpacing: '0.5px',
          }}>✨ NOW IN BETA</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(40px, 6vw, 72px)', fontWeight: 800,
          lineHeight: 1.08, letterSpacing: '-1.5px',
          marginBottom: '20px',
        }}>
          Connect, Share,<br />
          <span style={{
            background: 'linear-gradient(135deg, #7616f3, #1877f2, #f02849)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Build Community</span>
        </h1>

        <p style={{
          fontSize: '18px', lineHeight: 1.7, color: '#606770',
          maxWidth: '600px', margin: '0 auto 36px',
        }}>
          Experience a new era of social interaction on Vybe. Built with clarity for connection and impact for creators.
        </p>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/signup" className="pulse-glow" style={{
            padding: '14px 36px', fontSize: '16px', fontWeight: 700,
            color: 'white', background: 'linear-gradient(135deg, #7616f3, #5a10d0)',
            borderRadius: '14px', textDecoration: 'none',
            boxShadow: '0 6px 24px rgba(118,22,243,0.35)',
            transition: 'all 200ms', border: 'none',
          }}>Get Started Free →</Link>
          <Link href="/login" style={{
            padding: '14px 36px', fontSize: '16px', fontWeight: 600,
            color: '#7616f3', border: '2px solid rgba(118,22,243,0.25)',
            borderRadius: '14px', textDecoration: 'none',
            background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(12px)',
            transition: 'all 200ms',
          }}>Welcome Back</Link>
        </div>

        <p style={{ marginTop: '20px', fontSize: '13px', color: '#8a8d91' }}>
          Free forever · No credit card · No ads
        </p>
      </section>

      {/* ===== STATS ROW ===== */}
      <section className="fade-in stagger-1" style={{
        display: 'flex', justifyContent: 'center', gap: '80px',
        padding: '40px 24px 60px',
        maxWidth: '700px', margin: '0 auto',
        position: 'relative', zIndex: 10,
      }}>
        {[
          { val: '100%', label: 'Free Forever' },
          { val: '0', label: 'Ads Shown' },
          { val: '∞', label: 'Post Reach' },
        ].map(s => (
          <div key={s.label} className="infinite-bounce" style={{ textAlign: 'center' }}>
            <p style={{
              fontSize: '48px', fontWeight: 800, lineHeight: 1,
              background: 'linear-gradient(135deg, #7616f3, #1877f2)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            }}>{s.val}</p>
            <p style={{ fontSize: '14px', color: '#8a8d91', marginTop: '8px', fontWeight: 500 }}>{s.label}</p>
          </div>
        ))}
      </section>

      {/* ===== PREMIUM FEATURES ===== */}
      <section id="features" style={{
        maxWidth: '1100px', margin: '0 auto',
        padding: '40px 24px 80px',
        position: 'relative', zIndex: 10,
      }}>
        <h2 className="fade-in" style={{
          textAlign: 'center', fontSize: '36px', fontWeight: 800,
          marginBottom: '12px', letterSpacing: '-0.5px',
        }}>Premium Features</h2>
        <p className="fade-in" style={{
          textAlign: 'center', fontSize: '16px', color: '#606770',
          marginBottom: '48px', maxWidth: '500px', margin: '0 auto 48px',
        }}>Everything you need to connect, create, and grow your community.</p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            {
              icon: '🔐', title: 'Encrypted Chat', gradient: 'linear-gradient(135deg, #00a884, #00c49a)',
              desc: 'Real-time messaging protected by military-grade end-to-end encryption. Your conversations stay private.',
            },
            {
              icon: '📸', title: 'Immersive Stories', gradient: 'linear-gradient(135deg, #7616f3, #9b4dff)',
              desc: 'Share your daily moments with high-fidelity visuals and interactive widgets that truly represent you.',
            },
            {
              icon: '👥', title: 'Dynamic Groups', gradient: 'linear-gradient(135deg, #f02849, #ff6b6b)',
              desc: 'Build meaningful micro-communities with powerful moderation tools and custom collaborative spaces.',
            },
          ].map((f, i) => (
            <div key={f.title} className={`fade-in stagger-${i + 1} hover-lift`} style={{
              background: 'rgba(255,255,255,0.75)',
              backdropFilter: 'blur(24px) saturate(180%)',
              WebkitBackdropFilter: 'blur(24px) saturate(180%)',
              border: '1px solid rgba(255,255,255,0.5)',
              borderRadius: '20px',
              padding: '36px 28px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
              transition: 'all 300ms cubic-bezier(0.4,0,0.2,1)',
            }}>
              <div className="infinite-bounce" style={{
                width: '56px', height: '56px',
                background: f.gradient,
                borderRadius: '16px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '26px',
                marginBottom: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}>{f.icon}</div>
              <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '10px' }}>{f.title}</h3>
              <p style={{ fontSize: '15px', lineHeight: 1.65, color: '#606770' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== TRUST / PRIVACY ===== */}
      <section id="privacy" className="fade-in stagger-3" style={{
        maxWidth: '900px', margin: '0 auto',
        padding: '0 24px 80px',
        position: 'relative', zIndex: 10,
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.5)',
          borderRadius: '24px',
          padding: '56px 48px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
          textAlign: 'center',
        }}>
          <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.5px' }}>
            Privacy You Can Trust
          </h2>
          <p style={{ fontSize: '16px', lineHeight: 1.7, color: '#606770', maxWidth: '560px', margin: '0 auto 36px' }}>
            We believe your data is your property. Our platform is architected around security from the ground up.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', maxWidth: '600px', margin: '0 auto' }}>
            {[
              { icon: '🔒', text: 'Database-layer encryption' },
              { icon: '🛡️', text: 'GDPR compliant by design' },
              { icon: '🚫', text: 'Zero data selling' },
            ].map(t => (
              <div key={t.text} className="infinite-bounce" style={{
                display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: '8px',
                padding: '16px',
                background: 'rgba(118,22,243,0.04)',
                borderRadius: '16px',
                border: '1px solid rgba(118,22,243,0.08)',
              }}>
                <span style={{ fontSize: '24px' }}>{t.icon}</span>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#4a4d52' }}>{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer style={{
        position: 'relative', zIndex: 10,
        textAlign: 'center',
        padding: '24px',
        borderTop: '1px solid rgba(0,0,0,0.06)',
      }}>
        <p style={{ fontSize: '13px', color: '#8a8d91', marginBottom: '12px' }}>
          © 2026 Vybe. Built with ❤️ and real privacy.
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
          {['Terms', 'Privacy', 'Cookies', 'Security'].map(link => (
            <a key={link} href="#" style={{ fontSize: '12px', color: '#8a8d91', textDecoration: 'none', fontWeight: 500 }}>{link}</a>
          ))}
        </div>
      </footer>

      {/* ===== INLINE CSS FOR ANIMATIONS + HOVER EFFECTS ===== */}
      <style>{`
        /* === INFINITE BOUNCE === */
        @keyframes infiniteBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        .infinite-bounce {
          animation: infiniteBounce 2.5s ease-in-out infinite;
        }
        .infinite-bounce:nth-child(2) { animation-delay: 0.3s; }
        .infinite-bounce:nth-child(3) { animation-delay: 0.6s; }

        /* === PULSE GLOW on CTA === */
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 6px 24px rgba(118,22,243,0.35); }
          50% { box-shadow: 0 8px 40px rgba(118,22,243,0.55); }
        }
        .pulse-glow {
          animation: pulseGlow 2s ease-in-out infinite;
          position: relative;
          overflow: hidden;
        }

        /* === SHIMMER SWEEP on purple buttons === */
        .pulse-glow::before {
          content: '';
          position: absolute;
          top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
          transform: skewX(-20deg);
          transition: none;
        }
        .pulse-glow:hover::before {
          animation: shimmerSweep 0.8s ease forwards;
        }
        @keyframes shimmerSweep {
          0% { left: -100%; }
          100% { left: 150%; }
        }
        .pulse-glow:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 12px 48px rgba(118,22,243,0.5) !important;
        }

        /* === OUTLINE BUTTON hover glow === */
        a[href="/login"]:not([style*="background: linear"]) {
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        a[href="/login"]:not([style*="background: linear"]):hover {
          background: rgba(118,22,243,0.06) !important;
          border-color: #7616f3 !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 20px rgba(118,22,243,0.15);
        }

        /* === NAV LINK hover effects === */
        a[href^="#"] {
          transition: all 200ms ease !important;
          position: relative;
        }
        a[href^="#"]:hover {
          color: #7616f3 !important;
          transform: translateY(-1px);
        }
        a[href^="#"]::after {
          content: '';
          position: absolute;
          bottom: -4px; left: 0;
          width: 0; height: 2px;
          background: linear-gradient(90deg, #7616f3, #1877f2);
          border-radius: 1px;
          transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1);
        }
        a[href^="#"]:hover::after {
          width: 100%;
        }

        /* === NAV Create Account button hover === */
        a[href="/signup"][style*="linear-gradient"] {
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1) !important;
          position: relative !important;
          overflow: hidden !important;
        }
        a[href="/signup"][style*="linear-gradient"]:hover {
          transform: translateY(-2px) scale(1.04) !important;
          box-shadow: 0 8px 32px rgba(118,22,243,0.45) !important;
        }

        /* === FEATURE CARD 3D TILT + GLOW === */
        .hover-lift {
          transition: all 400ms cubic-bezier(0.4, 0, 0.2, 1) !important;
          cursor: pointer;
          position: relative;
        }
        .hover-lift::before {
          content: '';
          position: absolute;
          inset: -1px;
          border-radius: 21px;
          background: linear-gradient(135deg, rgba(118,22,243,0.3), rgba(24,119,242,0.3), rgba(240,40,73,0.2));
          opacity: 0;
          transition: opacity 400ms ease;
          z-index: -1;
          filter: blur(1px);
        }
        .hover-lift:hover::before {
          opacity: 1;
        }
        .hover-lift:hover {
          transform: translateY(-8px) scale(1.02) !important;
          box-shadow: 0 20px 60px rgba(118,22,243,0.12), 0 8px 24px rgba(0,0,0,0.06) !important;
          border-color: rgba(118,22,243,0.2) !important;
        }
        .hover-lift:hover .infinite-bounce {
          animation: none !important;
          transform: scale(1.15) rotate(-5deg);
          transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .hover-lift:hover h3 {
          background: linear-gradient(135deg, #7616f3, #1877f2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          transition: all 300ms ease;
        }

        /* === TRUST BADGE hover pop === */
        section#privacy .infinite-bounce {
          transition: all 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer;
        }
        section#privacy .infinite-bounce:hover {
          animation-play-state: paused !important;
          transform: translateY(-4px) scale(1.08) !important;
          background: rgba(118,22,243,0.08) !important;
          border-color: rgba(118,22,243,0.2) !important;
          box-shadow: 0 8px 24px rgba(118,22,243,0.1);
        }
        section#privacy .infinite-bounce:hover span:first-child {
          transform: scale(1.3);
          transition: transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1);
          display: inline-block;
        }

        /* === FOOTER LINK underline slide === */
        footer a {
          position: relative !important;
          transition: color 200ms ease !important;
        }
        footer a:hover {
          color: #7616f3 !important;
        }
        footer a::after {
          content: '';
          position: absolute;
          bottom: -2px; left: 50%;
          width: 0; height: 1.5px;
          background: #7616f3;
          transition: all 300ms cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateX(-50%);
        }
        footer a:hover::after {
          width: 100%;
        }

        /* === RESPONSIVE === */
        @media (max-width: 768px) {
          nav { padding: 16px 20px !important; }
          nav > div:first-of-type > div:first-child { display: none !important; }
          section[style*="gridTemplateColumns: repeat(3"] > div,
          div[style*="gridTemplateColumns: repeat(3"] {
            grid-template-columns: 1fr !important;
          }
          h1 { font-size: 36px !important; }
        }
      `}</style>
    </div>
  );
}
