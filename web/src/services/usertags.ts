const KEY = 'fm-user-tags'

type TagMap = Record<string, string[]>

function load(): TagMap {
  try { return JSON.parse(localStorage.getItem(KEY) || '{}') } catch { return {} }
}

function save(map: TagMap) {
  localStorage.setItem(KEY, JSON.stringify(map))
}

export function getUserTags(id: string): string[] {
  return load()[id] || []
}

export function addUserTag(id: string, tag: string) {
  const map = load()
  const tags = map[id] || []
  if (!tags.includes(tag)) {
    tags.push(tag)
    map[id] = tags
    save(map)
  }
}

export function removeUserTag(id: string, tag: string) {
  const map = load()
  const tags = map[id] || []
  map[id] = tags.filter(t => t !== tag)
  if (map[id].length === 0) delete map[id]
  save(map)
}

export function getAllUserTags(): string[] {
  const map = load()
  const all = new Set<string>()
  for (const tags of Object.values(map)) {
    for (const t of tags) all.add(t)
  }
  return [...all].sort()
}
