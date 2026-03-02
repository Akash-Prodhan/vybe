import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/feed');
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="text-center max-w-lg fade-in">
        <div className="mb-8">
          <h1 className="text-5xl font-bold tracking-tight text-primary mb-2">
            Vybe
          </h1>
          <div className="w-12 h-1 bg-primary mx-auto rounded-full" />
        </div>

        <p className="text-secondary text-lg mb-8 leading-relaxed">
          Share moments, connect with people, and chat in real-time.
          Your modern social space.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/signup"
            className="btn btn-primary px-8 py-3 text-base"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="btn btn-secondary px-8 py-3 text-base"
          >
            Sign In
          </Link>
        </div>

        <p className="mt-12 text-sm text-secondary/60">
          Free &middot; Private &middot; Modern
        </p>
      </div>
    </div>
  );
}
