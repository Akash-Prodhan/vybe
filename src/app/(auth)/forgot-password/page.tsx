'use client';

import { useState } from 'react';
import { forgotPassword } from '../actions';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError('');
        setSuccess('');
        const result = await forgotPassword(formData);
        if (result?.error) {
            setError(result.error);
        } else if (result?.success) {
            setSuccess(result.success);
        }
        setLoading(false);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg gradient-mesh px-4">
            <div className="w-full max-w-md fade-in">
                <div className="text-center mb-6">
                    <Link href="/" className="text-3xl font-extrabold font-display gradient-text">Vybe</Link>
                </div>

                <div className="card-glass p-8 md:p-10">
                    <h1 className="text-2xl font-bold font-display mb-1">Reset password</h1>
                    <p className="text-secondary text-sm mb-6">We&apos;ll send you a reset link</p>

                    <form action={handleSubmit} className="space-y-4">
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

                        <input id="email" name="email" type="email" placeholder="Email address" required className="input" />

                        <button type="submit" disabled={loading} className="btn btn-primary w-full py-3 font-semibold">
                            {loading ? (
                                <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>

                    <p className="mt-5 text-center text-sm text-secondary">
                        Remember your password?{' '}
                        <Link href="/login" className="text-accent font-medium hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
