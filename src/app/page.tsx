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
    <div className="min-h-screen bg-bg relative overflow-hidden">
      {/* Ambient gradients */}
      <div className="absolute top-[-300px] left-[-200px] w-[700px] h-[700px] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-purple/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-4">
        <h1 className="text-2xl font-bold font-display gradient-text">Vybe</h1>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn btn-ghost text-sm font-semibold">Log In</Link>
          <Link href="/signup" className="btn btn-primary text-sm px-6 py-2.5">Create Account</Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-20">
        <div className="text-center fade-in">
          <div className="inline-block mb-6">
            <span className="badge badge-accent px-4 py-1 text-xs font-bold tracking-wide bounce-in">✨ NOW IN BETA</span>
          </div>
          <h2 className="text-4xl md:text-7xl font-extrabold font-display tracking-tight leading-[1.08] mb-6">
            Connect, Share,<br />
            <span className="gradient-text">Build Community</span>
          </h2>
          <p className="text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            The social platform where your content reaches everyone.
            No algorithms hiding your posts. No ads interrupting your feed. Just real connections.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link href="/signup" className="btn btn-primary px-10 py-3.5 text-base font-bold pulse-glow">
              Get Started Free →
            </Link>
            <Link href="/login" className="btn btn-outline px-10 py-3.5 text-base font-semibold">
              Welcome Back
            </Link>
          </div>

          <p className="text-muted text-sm">Free forever · No credit card · No ads</p>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 md:gap-16 mt-16 mb-16 fade-in stagger-1">
          {[
            { value: '100%', label: 'Free Forever' },
            { value: '0', label: 'Ads Shown' },
            { value: '∞', label: 'Post Reach' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl md:text-4xl font-extrabold gradient-text">{s.value}</p>
              <p className="text-sm text-muted mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            { icon: '💬', title: 'Real-time Chat', desc: 'WhatsApp-style private messaging with instant delivery, read receipts, and group conversations.', color: 'from-green to-green-dark' },
            { icon: '📸', title: 'Stories & Posts', desc: '24h stories, photos & videos. Every follower sees every post — guaranteed, no algorithm gatekeeping.', color: 'from-accent to-purple' },
            { icon: '👥', title: 'Groups', desc: 'Create communities, add friends, manage members. Like WhatsApp groups with the power of a social feed.', color: 'from-purple to-rose' },
          ].map((f, i) => (
            <div key={f.title} className={`card-glass p-6 hover-lift fade-in stagger-${i + 1}`}>
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-2xl mb-4 shadow-lg`}>
                {f.icon}
              </div>
              <h3 className="font-bold text-lg mb-2">{f.title}</h3>
              <p className="text-secondary text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Trust section */}
        <div className="mt-20 card-glass p-8 md:p-12 text-center fade-in stagger-4">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Privacy You Can Trust</h3>
          <p className="text-secondary max-w-xl mx-auto mb-8">
            Row-Level Security enforced at the database layer. Your private messages are architecturally inaccessible — not just promised in a terms of service.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { icon: '🔒', text: 'Database-layer encryption' },
              { icon: '🛡️', text: 'GDPR compliant by design' },
              { icon: '🚫', text: 'Zero data selling' },
            ].map((t) => (
              <div key={t.text} className="flex items-center gap-2 justify-center py-2">
                <span className="text-lg">{t.icon}</span>
                <span className="text-sm font-medium">{t.text}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center pb-8 text-muted text-sm">
        <p>© 2026 Vybe. Built with ❤️ and real privacy.</p>
      </footer>
    </div>
  );
}
