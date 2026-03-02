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

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="w-full max-w-sm fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-primary">Vybe</h1>
                    <p className="text-secondary mt-2">Create your account</p>
                </div>

                <form action={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm text-center">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="p-3 rounded-xl bg-green-50 text-green-600 text-sm text-center">
                            {success}
                        </div>
                    )}

                    <div>
                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            placeholder="Full name"
                            required
                            className="input"
                        />
                    </div>

                    <div>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="Username"
                            required
                            pattern="^[a-zA-Z0-9_]+$"
                            title="Letters, numbers, and underscores only"
                            maxLength={30}
                            className="input"
                        />
                    </div>

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
                            placeholder="Password (min 6 characters)"
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
                            'Create Account'
                        )}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-secondary">
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary font-medium hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
