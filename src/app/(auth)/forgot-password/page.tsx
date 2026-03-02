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
        if (result?.error) setError(result.error);
        else if (result?.success) setSuccess(result.success);
        setLoading(false);
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-bg-tertiary px-4">
            <div className="w-full max-w-md fade-in">
                <div className="card-glass p-8">
                    <div className="text-center mb-6">
                        <Link href="/" className="text-2xl font-bold font-display gradient-text">Vybe</Link>
                        <h1 className="text-xl font-bold mt-3">Reset Password</h1>
                    </div>

                    <form action={handleSubmit} className="space-y-4">
                        {error && <div className="p-2.5 rounded-md bg-danger/10 text-danger text-sm text-center">{error}</div>}
                        {success && <div className="p-2.5 rounded-md bg-success/10 text-success text-sm text-center">{success}</div>}

                        <div>
                            <label htmlFor="email" className="block text-xs font-bold text-secondary uppercase tracking-wide mb-1.5">Email</label>
                            <input id="email" name="email" type="email" required className="input" />
                        </div>

                        <button type="submit" disabled={loading} className="btn btn-primary w-full py-2.5 font-medium">
                            {loading ? <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Send Reset Link'}
                        </button>
                    </form>

                    <p className="mt-5 text-sm text-muted">
                        <Link href="/login" className="text-accent hover:underline">Back to Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
