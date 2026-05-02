export function MusicNote({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.37 4.37 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z" />
    </svg>
  )
}

export function RadioIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm3 2h6v4H7V5zm8 8v2h1v-2h-1zm-2-2H7v4h6v-4zm2 0h1V9h-1v2zm1-4V5h-1v2h1zM5 5v2H4V5h1zm-1 4h1v2H4V9zm1 4v2H4v-2h1z" clipRule="evenodd" />
    </svg>
  )
}

export function PlayIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
    </svg>
  )
}

export function HeartIcon({ filled, className = 'w-5 h-5' }: { filled: boolean; className?: string }) {
  return (
    <svg
      className={`${className} ${filled ? 'text-red-400 fill-red-400' : 'text-text-muted'}`}
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    </svg>
  )
}

export function ThumbDownIcon({ active, className = 'w-5 h-5' }: { active?: boolean; className?: string }) {
  return (
    <svg
      className={`${className} ${active ? 'text-red-400' : 'text-text-muted'}`}
      fill={active ? 'currentColor' : 'none'}
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19.145 15h-1.286c-.392 0-.651-.385-.575-.75M7.5 15H5.625c-.621 0-1.125-.504-1.125-1.125v-6.75c0-.621.504-1.125 1.125-1.125h1.5c.631 0 1.167.414 1.353 1.002M7.5 15l1.256-4.812A2.67 2.67 0 0111.36 8.25h1.436a1.5 1.5 0 001.342-.83l.58-1.161a1.5 1.5 0 011.342-.83h.146c.789 0 1.428.64 1.428 1.428v.003" />
    </svg>
  )
}

export function PlayingBars() {
  return (
    <div className="flex items-end gap-[2px] h-4">
      <div className="w-[3px] bg-accent rounded-full animate-bounce" style={{ height: '60%', animationDelay: '0ms' }} />
      <div className="w-[3px] bg-accent rounded-full animate-bounce" style={{ height: '100%', animationDelay: '150ms' }} />
      <div className="w-[3px] bg-accent rounded-full animate-bounce" style={{ height: '40%', animationDelay: '300ms' }} />
    </div>
  )
}
