import { Ban, Heart, Music, Play, Radio } from 'lucide-react'

export function MusicNote({ className = 'w-5 h-5' }: { className?: string }) {
  return <Music className={className} strokeWidth={2} />
}

export function RadioIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return <Radio className={className} strokeWidth={2} />
}

export function PlayIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return <Play className={className} strokeWidth={2} />
}

export function HeartIcon({ filled, className = 'w-5 h-5' }: { filled: boolean; className?: string }) {
  return <Heart className={`${className} ${filled ? 'text-red-400' : 'text-text-muted'}`} fill={filled ? 'currentColor' : 'none'} strokeWidth={1.8} />
}

export function DislikeIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return <Ban className={className} strokeWidth={1.8} />
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
