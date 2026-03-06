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

    return (
        <div className="min-h-screen flex relative overflow-hidden">
            {/* Ambient background */}
            <div className="absolute inset-0 bg-bg" />
            <div className="absolute top-[-200px] right-[-200px] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-200px] left-[-200px] w-[500px] h-[500px] bg-purple/10 rounded-full blur-[100px] pointer-events-none" />

            {/* Left panel — branding */}
            <div className="hidden lg:flex flex-col justify-center w-1/2 px-16 relative z-10">
                <div className="max-w-md fade-in">
                    <Link href="/" className="text-4xl font-extrabold font-display gradient-text mb-6 block">Vybe</Link>
                    <h2 className="text-3xl font-bold leading-tight mb-4">
                        Connect with friends and the world around you.
                    </h2>
                    <p className="text-lg text-secondary leading-relaxed mb-8">
                        Share moments, have private conversations, build communities — all in one beautiful platform.
                    </p>
                    <div className="space-y-3">
                        {['✨ No ads, ever', '🔒 Privacy by design', '⚡ Instant messaging', '👥 Groups & communities'].map((f) => (
                            <div key={f} className="flex items-center gap-3 text-secondary text-sm">
                                <span className="text-base">{f.slice(0, 2)}</span>
                                <span className="font-medium">{f.slice(3)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
                <div className="w-full max-w-md fade-in">
                    <div className="card-glass p-8">
                        <div className="text-center mb-6 lg:hidden">
                            <Link href="/" className="text-3xl font-extrabold font-display gradient-text">Vybe</Link>
                        </div>
                        <h1 className="text-2xl font-bold text-center mb-1">Create your account</h1>
                        <p className="text-center text-muted text-sm mb-6">It&apos;s quick and easy.</p>

                        <form action={handleSubmit} className="space-y-4">
                            {error && <div className="p-3 rounded-lg bg-danger/10 text-danger text-sm text-center font-medium bounce-in">{error}</div>}
                            {success && <div className="p-3 rounded-lg bg-success/10 text-success text-sm text-center font-medium bounce-in">{success}</div>}

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label htmlFor="fullName" className="block text-xs font-semibold text-secondary mb-1">Full Name</label>
                                    <input id="fullName" name="fullName" type="text" required className="input" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label htmlFor="username" className="block text-xs font-semibold text-secondary mb-1">Username</label>
                                    <input id="username" name="username" type="text" required pattern="^[a-z0-9_.]+$" minLength={3} maxLength={30} className="input" placeholder="johndoe" />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-xs font-semibold text-secondary mb-1">Email</label>
                                <input id="email" name="email" type="email" required className="input" placeholder="you@example.com" />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-xs font-semibold text-secondary mb-1">Password</label>
                                <input id="password" name="password" type="password" required minLength={8} pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}" title="Min 8 chars, 1 uppercase, 1 number, 1 special character" className="input" placeholder="Min 8 chars • A-z, 0-9, !@#" />
                                <p className="text-[10px] text-muted mt-1">Min 8 chars • 1 uppercase • 1 number • 1 special</p>
                            </div>

                            <button type="submit" disabled={loading} className="btn btn-primary w-full py-3 text-base font-bold">
                                {loading ? <span className="inline-block w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Sign Up'}
                            </button>
                        </form>

                        <div className="divider my-5">or</div>

                        <button onClick={handleGoogleSignIn} className="btn btn-google w-full py-2.5">
                            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                            Continue with Google
                        </button>

                        <p className="mt-6 text-sm text-center text-muted">
                            Already have an account?{' '}<Link href="/login" className="text-accent font-semibold hover:underline">Log In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
