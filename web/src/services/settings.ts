const KEY = 'fm-settings'

type Settings = {
  fontSize: number // 0=small, 1=normal, 2=large, 3=xlarge
}

const DEFAULTS: Settings = { fontSize: 1 }

function load(): Settings {
  try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') } } catch { return DEFAULTS }
}

function save(s: Settings) {
  localStorage.setItem(KEY, JSON.stringify(s))
  applyFontSize(s.fontSize)
}

export function getSettings(): Settings { return load() }

export function setFontSize(size: number) {
  const s = load()
  s.fontSize = size
  save(s)
}

export function getFontSize(): number { return load().fontSize }

const FONT_SCALE = [0.88, 1, 1.12, 1.25]

export function applyFontSize(size?: number) {
  const s = size ?? load().fontSize
  const scale = FONT_SCALE[s]
  // Use zoom to scale everything (including px values)
  document.documentElement.style.zoom = String(scale)
  // Fallback for Firefox which doesn't support zoom
  document.documentElement.style.fontSize = `${scale * 16}px`
}
