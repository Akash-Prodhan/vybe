'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export async function signUp(formData: FormData) {
    const supabase = await createClient();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const username = formData.get('username') as string;
    const fullName = formData.get('fullName') as string;

    // Password validation
    if (password.length < 8) return { error: 'Password must be at least 8 characters' };
    if (!/[A-Z]/.test(password)) return { error: 'Password needs 1 uppercase letter' };
    if (!/[0-9]/.test(password)) return { error: 'Password needs 1 number' };
    if (!/[^a-zA-Z0-9]/.test(password)) return { error: 'Password needs 1 special character' };

    // Username validation
    const uname = username.toLowerCase();
    if (uname.length < 3 || uname.length > 30) return { error: 'Username must be 3-30 characters' };
    if (!/^[a-z0-9_.]+$/.test(uname)) return { error: 'Username: lowercase, numbers, _ and . only' };
    if (/^[_.]|[_.]$/.test(uname)) return { error: 'Cannot start/end with _ or .' };
    if (/__|\.\./.test(uname)) return { error: 'No consecutive _ or .' };

    const reserved = ['admin', 'support', 'official', 'null', 'undefined', 'system', 'moderator', 'help', 'vybe'];
    if (reserved.includes(uname)) return { error: 'Username is reserved' };

    // Check if username is taken
    const { data: existing } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', uname)
        .single();

    if (existing) {
        return { error: 'Username is already taken' };
    }

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                username: username.toLowerCase(),
                full_name: fullName,
            },
        },
    });

    if (error) {
        return { error: error.message };
    }

    return { success: 'Check your email to confirm your account!' };
}

export async function signIn(formData: FormData) {
    const supabase = await createClient();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { error: error.message };
    }

    redirect('/feed');
}

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/login');
}

export async function forgotPassword(formData: FormData) {
    const supabase = await createClient();
    const email = formData.get('email') as string;
    const headersList = await headers();
    const origin = headersList.get('origin') || 'http://localhost:3000';

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?next=/feed`,
    });

    if (error) {
        return { error: error.message };
    }

    return { success: 'Check your email for a password reset link' };
}

export async function signInWithGoogle() {
    const supabase = await createClient();
    const headersList = await headers();
    const origin = headersList.get('origin') || 'http://localhost:3000';

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${origin}/auth/callback`,
        },
    });

    if (error) {
        return { error: error.message };
    }

    if (data?.url) {
        redirect(data.url);
    }
}
