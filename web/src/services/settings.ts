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

const FONT_SCALE = ['0.85', '1', '1.15', '1.3']

export function applyFontSize(size?: number) {
  const s = size ?? load().fontSize
  document.documentElement.style.fontSize = `${parseFloat(FONT_SCALE[s]) * 16}px`
}
