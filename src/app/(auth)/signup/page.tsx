'use client';

import { useState } from 'react';
import { signUp } from '../actions';
import Link from 'next/link';

export default function SignupPage() {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError('');
        setSuccess('');
        const result = await signUp(formData);
        if (result?.error) setError(result.error);
        else if (result?.success) setSuccess(result.success);
        setLoading(false);
    }

    async function handleGoogleSignIn() {
        const { signInWithGoogle } = await import('../actions');
        await signInWithGoogle();
    }

    const inputStyle = {
        width: '100%', padding: '14px 16px', fontSize: '15px', borderRadius: '12px',
        border: '1.5px solid #e0e0e0', outline: 'none', background: 'rgba(255,255,255,0.6)',
        transition: 'border-color 200ms', fontFamily: "'Inter', sans-serif", boxSizing: 'border-box' as const,
    };

    const features = [
        { icon: '✨', text: 'No ads, ever' },
        { icon: '🔒', text: 'Privacy by design' },
        { icon: '⚡', text: 'Instant messaging' },
        { icon: '👥', text: 'Groups & communities' },
    ];

    return (
        <div style={{
            minHeight: '100vh', display: 'flex',
            fontFamily: "'Inter', system-ui, sans-serif", color: '#1c1e21',
            position: 'relative', overflow: 'hidden',
        }}>
            {/* LEFT: Branding Panel */}
            <div className="mobile-hide" style={{
                width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center',
                padding: '64px',
                background: 'linear-gradient(135deg, #7616f3 0%, #5a10d0 50%, #1877f2 100%)',
                position: 'relative', overflow: 'hidden',
            }}>
                {/* Decorative circles */}
                <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

                <div className="fade-in" style={{ maxWidth: '440px', position: 'relative', zIndex: 2 }}>
                    <Link href="/" className="infinite-bounce" style={{
                        display: 'inline-block', fontSize: '40px', fontWeight: 800,
                        fontFamily: "'Outfit', sans-serif", color: 'white',
                        textDecoration: 'none', marginBottom: '32px',
                    }}>Vybe</Link>

                    <h2 style={{ fontSize: '32px', fontWeight: 700, lineHeight: 1.2, color: 'white', marginBottom: '16px' }}>
                        Connect with friends and the world around you.
                    </h2>
                    <p style={{ fontSize: '17px', lineHeight: 1.7, color: 'rgba(255,255,255,0.7)', marginBottom: '40px' }}>
                        Experience the next generation of social interaction built for the future.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {features.map((f, i) => (
                            <div key={f.text} className="infinite-bounce" style={{
                                display: 'flex', alignItems: 'center', gap: '14px',
                                animationDelay: `${i * 0.2}s`,
                            }}>
                                <span style={{
                                    width: '40px', height: '40px', borderRadius: '12px',
                                    background: 'rgba(255,255,255,0.12)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '18px', flexShrink: 0,
                                }}>{f.icon}</span>
                                <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '15px', fontWeight: 500 }}>{f.text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* RIGHT: Form Panel */}
            <div className="mobile-full mobile-page" style={{
                width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '32px',
                background: 'linear-gradient(165deg, #f0f0ff 0%, #f8f5ff 30%, #fdf5f5 60%, #f0f0ff 100%)',
                position: 'relative',
            }}>
                {/* Ambient blobs */}
                <div style={{ position: 'absolute', top: '-150px', right: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(118,22,243,0.07) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-150px', left: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(24,119,242,0.06) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

                <div className="fade-in" style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 10 }}>
                    {/* Glass Card */}
                    <div style={{
                        background: 'rgba(255,255,255,0.8)',
                        backdropFilter: 'blur(24px) saturate(180%)',
                        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                        border: '1px solid rgba(255,255,255,0.5)',
                        borderRadius: '24px', padding: '40px',
                        boxShadow: '0 8px 40px rgba(0,0,0,0.06)',
                    }}>
                        <h1 style={{ fontSize: '26px', fontWeight: 800, textAlign: 'center', marginBottom: '4px' }}>Create your account</h1>
                        <p style={{ fontSize: '14px', color: '#8a8d91', textAlign: 'center', marginBottom: '24px' }}>It&apos;s quick and easy.</p>

                        <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            {error && <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(240,40,73,0.08)', color: '#f02849', fontSize: '14px', textAlign: 'center', fontWeight: 500 }}>{error}</div>}
                            {success && <div style={{ padding: '12px', borderRadius: '12px', background: 'rgba(0,196,154,0.08)', color: '#00a884', fontSize: '14px', textAlign: 'center', fontWeight: 500 }}>{success}</div>}

                            {/* Name + Username row */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#4a4d52', marginBottom: '6px' }}>Full Name</label>
                                    <input name="fullName" type="text" required placeholder="John Doe" style={inputStyle}
                                        onFocus={e => e.currentTarget.style.borderColor = '#7616f3'}
                                        onBlur={e => e.currentTarget.style.borderColor = '#e0e0e0'} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#4a4d52', marginBottom: '6px' }}>Username</label>
                                    <input name="username" type="text" required pattern="^[a-z0-9_.]+$" minLength={3} maxLength={30} placeholder="johndoe" style={inputStyle}
                                        onFocus={e => e.currentTarget.style.borderColor = '#7616f3'}
                                        onBlur={e => e.currentTarget.style.borderColor = '#e0e0e0'} />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#4a4d52', marginBottom: '6px' }}>Email</label>
                                <input name="email" type="email" required placeholder="you@example.com" style={inputStyle}
                                    onFocus={e => e.currentTarget.style.borderColor = '#7616f3'}
                                    onBlur={e => e.currentTarget.style.borderColor = '#e0e0e0'} />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#4a4d52', marginBottom: '6px' }}>Password</label>
                                <input name="password" type="password" required minLength={8}
                                    pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}"
                                    title="Min 8 chars, 1 uppercase, 1 number, 1 special character"
                                    placeholder="Min 8 chars • A-z, 0-9, !@#" style={inputStyle}
                                    onFocus={e => e.currentTarget.style.borderColor = '#7616f3'}
                                    onBlur={e => e.currentTarget.style.borderColor = '#e0e0e0'} />
                                <p style={{ fontSize: '11px', color: '#8a8d91', marginTop: '6px' }}>Min 8 chars • 1 uppercase • 1 number • 1 special</p>
                            </div>

                            <button type="submit" disabled={loading} className="pulse-glow" style={{
                                width: '100%', padding: '14px', fontSize: '16px', fontWeight: 700,
                                color: 'white', background: 'linear-gradient(135deg, #7616f3, #5a10d0)',
                                borderRadius: '14px', border: 'none', cursor: 'pointer',
                                boxShadow: '0 6px 24px rgba(118,22,243,0.35)',
                                position: 'relative', overflow: 'hidden',
                            }}>
                                {loading ? (
                                    <span style={{ display: 'inline-block', width: '20px', height: '20px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.6s linear infinite' }} />
                                ) : 'Sign Up'}
                            </button>
                        </form>

                        {/* Divider */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '20px 0' }}>
                            <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
                            <span style={{ fontSize: '13px', color: '#8a8d91', fontWeight: 500 }}>or</span>
                            <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }} />
                        </div>

                        {/* Google */}
                        <button onClick={handleGoogleSignIn} style={{
                            width: '100%', padding: '12px', fontSize: '15px', fontWeight: 600,
                            color: '#1c1e21', background: 'rgba(255,255,255,0.8)',
                            border: '1.5px solid #e0e0e0', borderRadius: '12px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                            transition: 'all 200ms',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(118,22,243,0.04)'; e.currentTarget.style.borderColor = '#7616f3'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.8)'; e.currentTarget.style.borderColor = '#e0e0e0'; }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                            Continue with Google
                        </button>

                        <p style={{ marginTop: '20px', fontSize: '14px', textAlign: 'center', color: '#606770' }}>
                            Already have an account?{' '}
                            <Link href="/login" style={{ color: '#7616f3', fontWeight: 600, textDecoration: 'none' }}>Log In</Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Mobile: hide left panel, full-width form */}
            <style>{`
                @keyframes infiniteBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
                .infinite-bounce { animation: infiniteBounce 2.5s ease-in-out infinite; }
                @keyframes pulseGlow { 0%, 100% { box-shadow: 0 6px 24px rgba(118,22,243,0.35); } 50% { box-shadow: 0 8px 40px rgba(118,22,243,0.55); } }
                .pulse-glow { animation: pulseGlow 2s ease-in-out infinite; }
                .pulse-glow::before { content: ''; position: absolute; top: 0; left: -100%; width: 60%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent); transform: skewX(-20deg); }
                .pulse-glow:hover::before { animation: shimmerSweep 0.8s ease forwards; }
                @keyframes shimmerSweep { 0% { left: -100%; } 100% { left: 150%; } }
                @keyframes spin { to { transform: rotate(360deg); } }
                @media (max-width: 768px) {
                    div[style*="width: 50%"]:first-of-type { display: none !important; }
                    div[style*="width: 50%"]:last-of-type { width: 100% !important; }
                }
            `}</style>
        </div>
    );
}
