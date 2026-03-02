'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function signUp(formData: FormData) {
    const supabase = await createClient();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const username = formData.get('username') as string;
    const fullName = formData.get('fullName') as string;

    // Check if username is taken
    const { data: existing } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username.toLowerCase())
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

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL ? '' : 'http://localhost:3000'}/auth/callback?next=/feed`,
    });

    if (error) {
        return { error: error.message };
    }

    return { success: 'Check your email for a password reset link' };
}
