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
        <div className="min-h-screen flex items-center justify-center bg-bg-tertiary px-4">
            <div className="w-full max-w-md fade-in">
                <div className="card-glass p-8">
                    <div className="text-center mb-6">
                        <Link href="/" className="text-2xl font-bold font-display gradient-text">Vybe</Link>
                        <h1 className="text-xl font-bold mt-3">Create an account</h1>
                    </div>

                    <form action={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-2.5 rounded-md bg-danger/10 text-danger text-sm text-center">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="p-2.5 rounded-md bg-success/10 text-success text-sm text-center">
                                {success}
                            </div>
                        )}

                        <div>
                            <label htmlFor="fullName" className="block text-xs font-bold text-secondary uppercase tracking-wide mb-1.5">Full Name</label>
                            <input id="fullName" name="fullName" type="text" required className="input" />
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-xs font-bold text-secondary uppercase tracking-wide mb-1.5">Username</label>
                            <input id="username" name="username" type="text" required pattern="^[a-zA-Z0-9_]+$" title="Letters, numbers, and underscores only" maxLength={30} className="input" />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-xs font-bold text-secondary uppercase tracking-wide mb-1.5">Email</label>
                            <input id="email" name="email" type="email" required className="input" />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-bold text-secondary uppercase tracking-wide mb-1.5">Password</label>
                            <input id="password" name="password" type="password" required minLength={6} className="input" />
                        </div>

                        <button type="submit" disabled={loading} className="btn btn-primary w-full py-2.5 font-medium">
                            {loading ? (
                                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : 'Continue'}
                        </button>
                    </form>

                    <div className="divider my-5">or</div>

                    <button onClick={handleGoogleSignIn} className="btn btn-google w-full py-2.5">
                        <svg width="16" height="16" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                        Continue with Google
                    </button>

                    <p className="mt-5 text-sm text-muted">
                        Already have an account?{' '}
                        <Link href="/login" className="text-accent hover:underline">Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
