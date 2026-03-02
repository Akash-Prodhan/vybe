import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import BottomNav from '@/components/layout/BottomNav';

export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    return (
        <div className="flex min-h-screen bg-white">
            <Sidebar />
            <main className="flex-1 min-h-screen pb-16 md:pb-0">
                {children}
            </main>
            <BottomNav />
        </div>
    );
}
