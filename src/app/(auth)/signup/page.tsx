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
        if (result?.error) {
            setError(result.error);
        } else if (result?.success) {
            setSuccess(result.success);
        }
        setLoading(false);
    }

    async function handleGoogleSignIn() {
        const { signInWithGoogle } = await import('../actions');
        await signInWithGoogle();
    }

    return (
        <div className="min-h-screen flex bg-bg gradient-mesh">
            {/* Left — Marketing */}
            <div className="hidden lg:flex flex-col justify-center flex-1 px-12 xl:px-20 relative overflow-hidden">
                <div className="relative z-10 max-w-lg">
                    <Link href="/" className="text-3xl font-extrabold font-display gradient-text mb-2 inline-block">Vybe</Link>
                    <h2 className="text-4xl xl:text-5xl font-bold font-display tracking-tight leading-[1.15] mt-4 mb-6">
                        Join the community<br />
                        <span className="gradient-text">that gets you.</span>
                    </h2>
                    <p className="text-secondary text-lg leading-relaxed mb-10">
                        Share your moments, discover new people, and stay connected through stories, posts, and real-time chat.
                    </p>

                    {/* Feature highlights */}
                    <div className="space-y-5">
                        {[
                            { icon: '💬', title: 'Real-time Messaging', desc: 'Instant private conversations' },
                            { icon: '📸', title: '24h Stories', desc: 'Share moments that matter' },
                            { icon: '🎥', title: 'Video Posts', desc: 'Express with photos & videos' },
                            { icon: '🔒', title: 'Privacy First', desc: 'Your data stays yours' },
                        ].map((f) => (
                            <div key={f.title} className="flex items-center gap-4 group">
                                <div className="w-11 h-11 card-glass flex items-center justify-center text-lg rounded-xl group-hover:scale-110 transition-transform">
                                    {f.icon}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm">{f.title}</p>
                                    <p className="text-secondary text-xs">{f.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Decorative orbs */}
                <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-accent/15 rounded-full blur-3xl" />
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-rose/10 rounded-full blur-3xl" />
            </div>

            {/* Right — Signup Form */}
            <div className="flex-1 lg:max-w-xl flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md fade-in">
                    <div className="lg:hidden text-center mb-8">
                        <Link href="/" className="text-3xl font-extrabold font-display gradient-text">Vybe</Link>
                    </div>

                    <div className="card-glass p-8 md:p-10">
                        <h1 className="text-2xl font-bold font-display mb-1">Create your account</h1>
                        <p className="text-secondary text-sm mb-6">Start your journey with Vybe</p>

                        {/* Google OAuth */}
                        <button
                            onClick={handleGoogleSignIn}
                            className="btn btn-google w-full py-3 mb-4"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Continue with Google
                        </button>

                        <div className="divider my-5">or sign up with email</div>

                        <form action={handleSubmit} className="space-y-3.5">
                            {error && (
                                <div className="p-3 rounded-xl bg-danger/10 text-danger text-sm text-center border border-danger/20">
                                    {error}
                                </div>
                            )}
                            {success && (
                                <div className="p-3 rounded-xl bg-success/10 text-success text-sm text-center border border-success/20">
                                    {success}
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-3">
                                <input id="fullName" name="fullName" type="text" placeholder="Full name" required className="input" />
                                <input id="username" name="username" type="text" placeholder="Username" required pattern="^[a-zA-Z0-9_]+$" title="Letters, numbers, and underscores only" maxLength={30} className="input" />
                            </div>

                            <input id="email" name="email" type="email" placeholder="Email address" required className="input" />

                            <input id="password" name="password" type="password" placeholder="Password (min 6 characters)" required minLength={6} className="input" />

                            <button type="submit" disabled={loading} className="btn btn-primary w-full py-3 font-semibold">
                                {loading ? (
                                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    'Create Account'
                                )}
                            </button>
                        </form>

                        <p className="mt-5 text-center text-sm text-secondary">
                            Already have an account?{' '}
                            <Link href="/login" className="text-accent font-medium hover:underline">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    <p className="text-center text-xs text-secondary/50 mt-6">
                        By signing up, you agree to our Terms & Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
}
