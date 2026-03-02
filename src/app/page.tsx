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
    <div className="min-h-screen bg-bg gradient-mesh overflow-hidden">
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
        <h1 className="text-2xl font-bold font-display gradient-text">Vybe</h1>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn btn-ghost text-sm px-4 py-2">Sign In</Link>
          <Link href="/signup" className="btn btn-primary text-sm px-5 py-2">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-24">
        <div className="text-center max-w-3xl mx-auto fade-in">
          <div className="inline-flex items-center gap-2 badge-accent px-4 py-1.5 rounded-full text-sm mb-6">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            Now in Beta — Join the Vybe
          </div>

          <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold font-display tracking-tight leading-[1.1] mb-6">
            Your Social Space,{' '}
            <span className="gradient-text">Reimagined</span>
          </h2>

          <p className="text-secondary text-lg md:text-xl leading-relaxed max-w-2xl mx-auto mb-10">
            Share moments, tell stories, chat in real-time, and connect with people who matter.
            Beautiful, fast, and private by design.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup" className="btn btn-primary px-8 py-3.5 text-base font-semibold">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              Start for Free
            </Link>
            <Link href="/login" className="btn btn-secondary px-8 py-3.5 text-base">
              Welcome Back
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-24">
          {[
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
              ),
              title: 'Real-time Chat',
              desc: 'Instant messaging with live delivery. Connect one-on-one, privately and securely.',
              color: 'from-indigo-500 to-violet-500',
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              ),
              title: '24h Stories',
              desc: 'Share fleeting moments with photos and videos that disappear after 24 hours.',
              color: 'from-rose-500 to-pink-500',
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
              ),
              title: 'Follow & Connect',
              desc: 'Build your network. Follow creators, discover content, grow your community.',
              color: 'from-amber-500 to-orange-500',
            },
          ].map((feat) => (
            <div key={feat.title} className="card-glass p-6 hover:scale-[1.02] transition-transform duration-300 group">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                {feat.icon}
              </div>
              <h3 className="font-semibold font-display text-lg mb-2">{feat.title}</h3>
              <p className="text-secondary text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-12 mt-20">
          {[
            { val: 'Free', label: 'Forever' },
            { val: 'Private', label: 'By Design' },
            { val: 'Fast', label: 'Real-time' },
            { val: 'Open', label: 'Community' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-bold font-display gradient-text">{s.val}</p>
              <p className="text-xs text-secondary mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Floating orbs for visual interest */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl float pointer-events-none" />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-rose/8 rounded-full blur-3xl float pointer-events-none" style={{ animationDelay: '3s' }} />
    </div>
  );
}
