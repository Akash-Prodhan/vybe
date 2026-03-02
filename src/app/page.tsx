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
    <div className="min-h-screen bg-bg-tertiary overflow-hidden relative">
      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-4">
        <h1 className="text-xl font-bold font-display gradient-text">Vybe</h1>
        <div className="flex items-center gap-2">
          <Link href="/login" className="btn btn-ghost text-sm">Log In</Link>
          <Link href="/signup" className="btn btn-primary text-sm px-5">Sign Up</Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 pt-20 md:pt-28 pb-20 text-center">
        <div className="fade-in">
          <h2 className="text-4xl md:text-6xl font-extrabold font-display tracking-tight leading-[1.1] mb-5">
            Imagine a place...
          </h2>
          <p className="text-secondary text-base md:text-lg max-w-xl mx-auto leading-relaxed mb-8">
            ...where you can share stories, post moments, chat in real-time, and build communities with people who get you.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="btn btn-primary px-8 py-3 text-base font-semibold">
              Get Started — It&apos;s Free
            </Link>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-20">
          {[
            {
              emoji: '💬',
              title: 'Real-time Chat',
              desc: 'Instant private messaging with live delivery and group conversations.',
            },
            {
              emoji: '📸',
              title: 'Stories & Posts',
              desc: '24h stories, photo & video posts to share your moments with everyone.',
            },
            {
              emoji: '👥',
              title: 'Groups',
              desc: 'Create groups, add friends, and build your community together.',
            },
          ].map((f) => (
            <div key={f.title} className="card p-5 rounded-lg text-left hover:bg-surface-hover transition-colors">
              <span className="text-2xl mb-3 block">{f.emoji}</span>
              <h3 className="font-semibold mb-1">{f.title}</h3>
              <p className="text-secondary text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
