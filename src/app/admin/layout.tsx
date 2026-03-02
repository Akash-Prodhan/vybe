import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    // Double-check admin role server-side (defense in depth)
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (!profile || profile.role !== 'admin') {
        redirect('/feed');
    }

    return (
        <div className="min-h-screen bg-white">
            <header className="border-b border-border px-6 py-4">
                <div className="flex items-center gap-3">
                    <h1 className="text-lg font-bold">Vybe Admin</h1>
                    <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full">Admin</span>
                </div>
            </header>
            <main className="p-6">
                {children}
            </main>
        </div>
    );
}
