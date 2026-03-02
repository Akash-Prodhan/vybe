'use client';

import { useState } from 'react';
import { signIn } from '../actions';
import Link from 'next/link';

export default function LoginPage() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError('');
        const result = await signIn(formData);
        if (result?.error) {
            setError(result.error);
            setLoading(false);
        }
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
                        Welcome back to<br />
                        <span className="gradient-text">your space.</span>
                    </h2>
                    <p className="text-secondary text-lg leading-relaxed">
                        Your friends are waiting. Jump back into conversations, catch up on stories, and see what's new.
                    </p>
                </div>

                <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-accent/15 rounded-full blur-3xl" />
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-rose/10 rounded-full blur-3xl" />
            </div>

            {/* Right — Login Form */}
            <div className="flex-1 lg:max-w-xl flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md fade-in">
                    <div className="lg:hidden text-center mb-8">
                        <Link href="/" className="text-3xl font-extrabold font-display gradient-text">Vybe</Link>
                    </div>

                    <div className="card-glass p-8 md:p-10">
                        <h1 className="text-2xl font-bold font-display mb-1">Sign in</h1>
                        <p className="text-secondary text-sm mb-6">Welcome back to Vybe</p>

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

                        <div className="divider my-5">or</div>

                        <form action={handleSubmit} className="space-y-3.5">
                            {error && (
                                <div className="p-3 rounded-xl bg-danger/10 text-danger text-sm text-center border border-danger/20">
                                    {error}
                                </div>
                            )}

                            <input id="email" name="email" type="email" placeholder="Email address" required className="input" />
                            <input id="password" name="password" type="password" placeholder="Password" required minLength={6} className="input" />

                            <button type="submit" disabled={loading} className="btn btn-primary w-full py-3 font-semibold">
                                {loading ? (
                                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        <div className="mt-5 text-center space-y-2">
                            <Link href="/forgot-password" className="text-sm text-secondary hover:text-accent transition-colors block">
                                Forgot password?
                            </Link>
                            <p className="text-sm text-secondary">
                                Don&apos;t have an account?{' '}
                                <Link href="/signup" className="text-accent font-medium hover:underline">
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
