export function AboutTab() {
  return (
    <div className="pb-4">
      {/* Hero */}
      <div className="px-4 pt-6 pb-8 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-accent/15 text-accent rounded-full text-xs font-semibold mb-4">
          <span>&#9835;</span> 100% Free &middot; No Ads &middot; No Account
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight mb-3" style={{ fontFamily: "'DM Serif Display', serif" }}>
          All the world's<br/><em className="text-accent italic">free music</em><br/>in one app
        </h1>
        <p className="text-muted text-base max-w-md mx-auto">
          600,000+ Creative Commons tracks. 30,000+ live radio stations. Public domain recordings. Zero cost, forever.
        </p>
      </div>

      {/* Stats */}
      <div className="mx-4 grid grid-cols-3 border border-border rounded-2xl overflow-hidden mb-8">
        <div className="bg-surface p-4 text-center border-r border-border">
          <div className="text-xl font-bold text-accent" style={{ fontFamily: "'DM Serif Display', serif" }}>600K+</div>
          <div className="text-xs text-muted">Free Tracks</div>
        </div>
        <div className="bg-surface p-4 text-center border-r border-border">
          <div className="text-xl font-bold text-accent" style={{ fontFamily: "'DM Serif Display', serif" }}>30K+</div>
          <div className="text-xs text-muted">Radio Stations</div>
        </div>
        <div className="bg-surface p-4 text-center">
          <div className="text-xl font-bold text-accent" style={{ fontFamily: "'DM Serif Display', serif" }}>$0</div>
          <div className="text-xs text-muted">Forever</div>
        </div>
      </div>

      {/* Features */}
      <div className="px-4 mb-8">
        <h2 className="text-lg font-bold mb-4">Why FreeMusic</h2>
        <div className="grid gap-3">
          {[
            { icon: '🎵', title: 'No Ads, Ever', desc: 'No audio ads. No banners. No sponsored playlists. Just music.' },
            { icon: '🔒', title: 'No Account Required', desc: 'No sign-up, no email. Open and start listening immediately.' },
            { icon: '📡', title: 'No Tracking', desc: "We don't collect data. No analytics. Your music is your business." },
            { icon: '🌍', title: 'Works Everywhere', desc: 'Browser, PWA, iOS. Save to home screen for a native feel.' },
            { icon: '📻', title: 'Live Radio', desc: '30,000+ stations from every country and genre on earth.' },
            { icon: '🔊', title: 'Background Playback', desc: 'Lock your phone, switch apps — music keeps playing.' },
          ].map(f => (
            <div key={f.title} className="flex gap-3 bg-surface border border-border rounded-xl p-4">
              <span className="text-2xl flex-shrink-0">{f.icon}</span>
              <div>
                <div className="text-sm font-semibold mb-0.5">{f.title}</div>
                <div className="text-xs text-muted leading-relaxed">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sources */}
      <div className="px-4 mb-8">
        <h2 className="text-lg font-bold mb-4">Where the music comes from</h2>
        <p className="text-sm text-muted mb-4">Every track is Creative Commons licensed or public domain. Completely legal.</p>
        <div className="grid gap-3">
          {[
            { name: 'Jamendo', count: '600,000+', desc: "World's largest CC music catalog. Every genre." },
            { name: 'Radio Browser', count: '30,000+', desc: 'Community database of internet radio stations worldwide.' },
            { name: 'Internet Archive', count: 'Millions', desc: 'Live concerts, vintage albums, public domain audio.' },
          ].map(s => (
            <div key={s.name} className="bg-surface border border-border rounded-xl p-4 text-center">
              <div className="text-lg font-bold text-accent" style={{ fontFamily: "'DM Serif Display', serif" }}>{s.count}</div>
              <div className="text-sm font-semibold">{s.name}</div>
              <div className="text-xs text-muted mt-1">{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Vision */}
      <div className="px-4 mb-8">
        <h2 className="text-lg font-bold mb-3">Our Vision</h2>
        <p className="text-sm text-muted leading-relaxed mb-4">
          Music belongs to everyone. Access shouldn't require a credit card, an account, or sitting through ads.
          Hundreds of thousands of artists have chosen to share freely. We're building the stage.
        </p>
        <div className="grid gap-2">
          {[
            ['Open source', 'Code on GitHub. Anyone can inspect, contribute, or fork.'],
            ['Artist-first', 'We credit artists and respect their licenses.'],
            ['No venture capital', 'No investors pushing monetization. Community project.'],
            ['Privacy by design', 'No accounts, no analytics, no data collection.'],
            ['Forever free', 'Not freemium. Not "free with ads." Free. Period.'],
          ].map(([title, desc]) => (
            <div key={title} className="flex gap-2.5 items-start">
              <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-accent" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/></svg>
              </div>
              <div className="text-sm text-muted"><strong className="text-txt">{title}.</strong> {desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* GitHub link */}
      <div className="px-4 mb-8">
        <a
          href="https://github.com/FreeMusicApp/freemusic"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-surface border border-border rounded-xl text-sm font-semibold hover:border-accent transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          View on GitHub
        </a>
      </div>

      <div className="px-4 pb-4 text-center text-xs text-muted/50">
        &copy; 2026 FreeMusic. Open source, open music.
      </div>
    </div>
  )
}
