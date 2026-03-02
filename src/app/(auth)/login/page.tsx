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

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="w-full max-w-sm fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Vybe</h1>
                    <p className="text-secondary mt-2">Welcome back</p>
                </div>

                <form action={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            required
                            className="input"
                        />
                    </div>

                    <div>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Password"
                            required
                            minLength={6}
                            className="input"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-primary w-full py-3"
                    >
                        {loading ? (
                            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center space-y-2">
                    <Link
                        href="/forgot-password"
                        className="text-sm text-secondary hover:text-primary transition-colors"
                    >
                        Forgot password?
                    </Link>
                    <p className="text-sm text-secondary">
                        Don&apos;t have an account?{' '}
                        <Link href="/signup" className="text-primary font-medium hover:underline">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
