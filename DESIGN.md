# Design System -- FreeMusic

## Product Context
- **What this is:** Free music aggregator and player. CC-licensed tracks, public domain audio, live radio -- all in one app.
- **Who it's for:** Anyone who wants free music without ads, subscriptions, or accounts. Music lovers who value independence from Big Tech streaming.
- **Space/industry:** Music streaming -- but open, free, and community-driven.
- **Project type:** PWA (web app, installable) + native iOS app + marketing website
- **Memorable thing:** "Music belongs to everyone"

## Aesthetic Direction
- **Direction:** Immersive/Player-first
- **Decoration level:** Minimal -- the content (album art, waveforms, controls) IS the decoration
- **Mood:** Late-night listening session. Premium headphones. Dark room, glowing screen. The app should feel like a high-end audio experience that happens to be free.
- **Reference apps:** Spotify (layout patterns), Apple Music (polish), Plexamp (dark aesthetic) -- we depart from all three by being darker, simpler, and more focused
- **Anti-references:** SoundCloud (too cluttered), YouTube Music (too Google), Pandora (too dated)

## Typography
- **Display/Hero:** DM Serif Display -- elegant italic for brand moments. Used sparingly: About page hero, full player, genre labels in marketing.
- **Body/UI:** Inter -- crisp, modern, excellent at small sizes. The workhorse font. Tight letter-spacing (-0.01em) for a premium feel.
- **Monospace:** Not needed (no code/data surfaces)
- **Loading:** Google Fonts: `DM+Serif+Display:ital@0;1` + `Inter:wght@400;500;600;700`
- **Scale:**
  - Display: 40px / 2.5rem (mobile), 72px / 4.5rem (desktop)
  - H1: 24px / 1.5rem
  - H2: 18px / 1.125rem (section headers)
  - H3: 14px / 0.875rem (section subheaders, uppercase tracking-wider)
  - Body: 13px / 0.8125rem (track titles, station names)
  - Small: 11px / 0.6875rem (metadata, durations, artist names)
  - XS: 10px / 0.625rem (tab labels, chip text, timestamps)
- **Weight usage:** 400 (metadata), 500 (body), 600 (section headers), 700 (page titles, card labels)
- **Note:** Type is deliberately small and dense -- music apps show lots of items on screen. Larger type is reserved for the full-screen player.

## Color
- **Approach:** Monochrome dark with one signature accent. Color is earned -- only the accent, playing indicators, and favorites get color.
- **Accent:** Mint green `#6ECE9E` -- distinctive, not Spotify-green (#1DB954), not Apple-red, not YouTube-red. Calming, premium, unique in the music app space.
- **Dark mode (only -- no light mode):**
  - Background: `#0A0A0B` (near-black, cool)
  - Surface: `#151517` (cards, inputs, elevated elements)
  - Surface hover: `#1C1C1F`
  - Border: `#232326` (very subtle, structural only)
  - Border subtle: `rgba(255,255,255,0.06)` (ring borders on artwork)
  - Text primary: `#F0F0F2` (off-white, slight cool)
  - Text muted: `#78787E` (metadata, secondary info)
  - Accent: `#6ECE9E` (mint green)
  - Accent glow: `#6ECE9E40` (25% opacity, for glows and highlights)
  - Accent surface: `#6ECE9E15` (chips, badges, subtle backgrounds)
- **Semantic:**
  - Favorite/heart: `#F87171` (red-400, filled when active)
  - Playing: `#6ECE9E` (accent, animated equalizer bars)
  - Error: `#EF4444`
  - Loading: accent with `border-t-transparent` spin animation
- **Glass effects:**
  - Tab bar: `bg-[var(--bg)]/90 backdrop-blur-xl`
  - Mini player: `bg-[var(--surface)]/90 backdrop-blur-xl` + accent glow underneath
  - Full player: solid `var(--bg)` (no blur, full immersion)

## Spacing
- **Base unit:** 4px
- **Density:** Compact -- music apps are content-dense. Track rows are 48px tall (12px padding + 48px content).
- **Scale:** 2xs(2px) xs(4px) sm(8px) md(12px) lg(16px) xl(24px) 2xl(32px) 3xl(48px)
- **Section gaps:** 16-24px between major sections on home
- **Horizontal padding:** 16px (px-4) consistently on all tab content

## Layout
- **Approach:** Single-column, mobile-first. Content is constrained on desktop.
- **Max content width:** 672px (max-w-2xl) -- keeps the app feeling like a phone even on desktop
- **Tab bar:** Fixed bottom, 5 tabs (Home, Search, Radio, Favorites, About)
- **Mini player:** Fixed above tab bar, floating with rounded corners and glow
- **Full player:** Full-screen modal, slides up from bottom
- **Artwork sizes:**
  - Track row: 48x48px, rounded-lg (8px)
  - Trending card: 128x128px, rounded-xl (12px)
  - Station card: 96x96px, rounded-xl
  - Full player: 256x256px (mobile), 288x288px (sm+), rounded-2xl (16px)
  - Quick-play cards: full-width, h-auto, rounded-2xl
- **Border radius:** sm:4px, md:8px, lg:12px, xl:16px, full:9999px (pills/chips)

## Motion
- **Approach:** Micro-interactions only. No page transitions (tabs switch instantly).
- **Easing:** all ease (CSS default), 150ms duration
- **Press feedback:** `active:scale-[0.97]` on all tappable elements
- **Playing indicator:** Three bars with staggered `animate-bounce` (0ms, 150ms, 300ms delay)
- **Progress bar:** `transition-all duration-500` for smooth scrubbing
- **Full player:** `slideUp` animation, 300ms ease-out
- **Loading:** Accent-colored spinner, 2px border, `animate-spin`

## Iconography
- **System:** Heroicons Solid 20x20 (inline SVG, no icon font)
- **Style:** Filled for active states, outlined for inactive/actions
- **Core icons:**
  - Home: house (filled)
  - Search: magnifying glass (outlined, stroke-2)
  - Radio: radio (filled, evenodd)
  - Favorites: heart (filled)
  - About: info circle (outlined, stroke-2)
  - Play: play-circle (filled)
  - Pause: pause-circle (filled)
  - Next: forward (filled)
  - Previous: backward (filled)
  - Music note: note (filled, placeholder for missing artwork)
  - Favorite toggle: heart outline (stroke-2) / heart filled (red-400)
- **Tab active indicator:** 2px wide, accent-colored bar at top of tab, centered with `w-5`

## Components
- **Quick-play cards:** 3-column grid, gradient backgrounds (emerald/violet/amber), rounded-2xl, play button top-right, icon + label + subtitle
- **Track row:** 48px artwork + title/artist + playing indicator + heart button. Group hover reveals heart at full opacity.
- **Station row:** Same as track row but with radio icon fallback
- **Genre chips:** Gradient backgrounds, rounded-xl, h-11, text-[11px] font-semibold
- **Search input:** Surface bg, rounded-xl, border, magnifying glass icon left, text-sm
- **Filter pills:** rounded-full, px-3 py-1.5, text-xs font-semibold. Active: accent bg + dark text. Inactive: surface bg + muted text.
- **Section headers:** text-sm font-bold, with optional "Play All" accent link right-aligned

## Brand
- **Name:** FreeMusic
- **Tagline:** "Music belongs to everyone."
- **Alternate taglines:** "One tap. Your music. Right now." / "Free forever. No ads. No account."
- **Voice:** Direct, confident, minimal. Not corporate, not trying too hard. Think: a friend who found something amazing and just shares it.
- **Logo:** Concentric circles (vinyl record / sound waves) in accent green on dark background. SVG, works at all sizes.
- **Domain:** freemusicapp.github.io/freemusic (current), custom domain TBD

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-05-02 | Mint green (#6ECE9E) over Spotify green | Calmer, more premium, immediately distinguishable |
| 2026-05-02 | Near-black background (#0A0A0B) | Deeper than competitors, makes artwork and accent pop |
| 2026-05-02 | Inter for UI, DM Serif Display for brand | Inter is the best screen font at small sizes; DM Serif adds personality sparingly |
| 2026-05-02 | Dark mode only | Music apps are used at night, in headphones, eyes-adjusted. Light mode would be jarring and off-brand |
| 2026-05-02 | Compact typography (13px body) | More tracks visible on screen = faster browsing = better music discovery |
| 2026-05-02 | Three quick-play cards on home | One-tap-to-music is the core UX promise. Radio/Playlist/Genre covers all listening intents |
| 2026-05-02 | No album art in quick-play cards | Cards are about the ACTION (play radio, play genre), not specific content. Icons + gradients keep it clean |
| 2026-05-02 | Glass morphism on mini player | Player floats above content, feels premium, doesn't block browsing |
| 2026-05-02 | Max-w-2xl on desktop | App should feel like a phone app even in a browser window. Wide layouts look empty for music lists |
