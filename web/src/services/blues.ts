import type { Track, RadioStation } from '../types'
import { advancedSearch } from './jamendo'
import { searchTracks as searchIA } from './archive'
import { getByGenre as getStationsByGenre } from './radio'

export type BluesCategory = {
  id: string
  label: string
  icon: string
  image?: string
  years?: string
  jamendoSearch?: string
  jamendoTags: string
  iaQuery: string
}

const PORTRAITS: Record<string, string> = {
  'robert-johnson': 'https://upload.wikimedia.org/wikipedia/en/b/b3/Robert_Johnson.png',
  'muddy-waters': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/Muddy_Waters_november_1976.jpg/330px-Muddy_Waters_november_1976.jpg',
  'bb-king': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Bbking.jpg/330px-Bbking.jpg',
  'howlin-wolf': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Howlin_Wolf_AABF_1970_JT.jpg/330px-Howlin_Wolf_AABF_1970_JT.jpg',
  'john-lee-hooker': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/John_Lee_Hooker_two.jpg/330px-John_Lee_Hooker_two.jpg',
  'lightnin-hopkins': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Lightnin%27_Hopkins.jpg/330px-Lightnin%27_Hopkins.jpg',
  'lead-belly': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Leadbelly_with_Accordeon.jpg/330px-Leadbelly_with_Accordeon.jpg',
  'bessie-smith': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Bessie_Smith_%281936%29_by_Carl_Van_Vechten.jpg/330px-Bessie_Smith_%281936%29_by_Carl_Van_Vechten.jpg',
  'son-house': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Son_House.jpg/330px-Son_House.jpg',
  'skip-james': 'https://upload.wikimedia.org/wikipedia/en/7/77/Skip_James.jpg',
  'stevie-ray-vaughan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/Stevie_Ray_Vaughan_Live_1983.jpg/330px-Stevie_Ray_Vaughan_Live_1983.jpg',
  'koko-taylor': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/KokoTaylor2006.jpg/330px-KokoTaylor2006.jpg',
  'etta-james': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Etta_James04.JPG/330px-Etta_James04.JPG',
  'blind-lemon-jefferson': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Blindlemonjeffersoncirca1926.jpg/330px-Blindlemonjeffersoncirca1926.jpg',
  'albert-collins': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/AlbertCollins1990.jpg/330px-AlbertCollins1990.jpg',
}

function artist(id: string, label: string, icon: string, fullName: string, years: string): BluesCategory {
  return {
    id, label, icon,
    image: PORTRAITS[id],
    years,
    jamendoSearch: fullName.toLowerCase(),
    jamendoTags: 'blues',
    iaQuery: `creator:(${fullName.toLowerCase()}) subject:blues mediatype:audio`,
  }
}

function bluesTag(id: string, label: string, icon: string, tag: string, iaSubject?: string): BluesCategory {
  return {
    id, label, icon,
    jamendoTags: `blues+${tag}`,
    iaQuery: `subject:(${iaSubject || tag}) subject:blues mediatype:audio`,
  }
}

export const ARTISTS: BluesCategory[] = [
  artist('robert-johnson', 'Robert Johnson', '🎸', 'Robert Johnson', '1911–1938'),
  artist('muddy-waters', 'Muddy Waters', '🎸', 'Muddy Waters', '1913–1983'),
  artist('bb-king', 'B.B. King', '🎸', 'B.B. King', '1925–2015'),
  artist('howlin-wolf', 'Howlin\' Wolf', '🎤', 'Howlin Wolf', '1910–1976'),
  artist('john-lee-hooker', 'John Lee Hooker', '🎸', 'John Lee Hooker', '1917–2001'),
  artist('lightnin-hopkins', 'Lightnin\' Hopkins', '🎸', 'Lightnin Hopkins', '1912–1982'),
  artist('lead-belly', 'Lead Belly', '🎸', 'Lead Belly', '1888–1949'),
  artist('bessie-smith', 'Bessie Smith', '🎤', 'Bessie Smith', '1894–1937'),
  artist('son-house', 'Son House', '🎸', 'Son House', '1902–1988'),
  artist('skip-james', 'Skip James', '🎸', 'Skip James', '1902–1969'),
  artist('elmore-james', 'Elmore James', '🎸', 'Elmore James', '1918–1963'),
  artist('albert-king', 'Albert King', '🎸', 'Albert King', '1923–1992'),
  artist('buddy-guy', 'Buddy Guy', '🎸', 'Buddy Guy', '1936–'),
  artist('willie-dixon', 'Willie Dixon', '🎸', 'Willie Dixon', '1915–1992'),
  artist('stevie-ray-vaughan', 'Stevie Ray Vaughan', '🎸', 'Stevie Ray Vaughan', '1954–1990'),
  artist('etta-james', 'Etta James', '🎤', 'Etta James', '1938–2012'),
  artist('big-mama-thornton', 'Big Mama Thornton', '🎤', 'Big Mama Thornton', '1926–1984'),
  artist('sister-rosetta-tharpe', 'Sister Rosetta Tharpe', '🎸', 'Sister Rosetta Tharpe', '1915–1973'),
  artist('t-bone-walker', 'T-Bone Walker', '🎸', 'T-Bone Walker', '1910–1975'),
  artist('blind-lemon-jefferson', 'Blind Lemon Jefferson', '🎸', 'Blind Lemon Jefferson', '1893–1929'),
  artist('ma-rainey', 'Ma Rainey', '🎤', 'Ma Rainey', '1886–1939'),
  artist('koko-taylor', 'Koko Taylor', '🎤', 'Koko Taylor', '1928–2009'),
  artist('albert-collins', 'Albert Collins', '🎸', 'Albert Collins', '1932–1993'),
  artist('otis-rush', 'Otis Rush', '🎸', 'Otis Rush', '1934–2018'),
]

export const STYLES: BluesCategory[] = [
  bluesTag('delta', 'Delta Blues', '🏞️', 'delta', 'delta blues'),
  bluesTag('chicago', 'Chicago Blues', '🏙️', 'chicago', 'chicago blues'),
  bluesTag('electric', 'Electric Blues', '⚡', 'electric', 'electric blues'),
  bluesTag('acoustic', 'Acoustic Blues', '🎸', 'acoustic', 'acoustic blues'),
  bluesTag('texas', 'Texas Blues', '🤠', 'texas', 'texas blues'),
  bluesTag('piedmont', 'Piedmont Blues', '🌿', 'piedmont', 'piedmont blues'),
  bluesTag('country', 'Country Blues', '🌾', 'country', 'country blues'),
  bluesTag('jump', 'Jump Blues', '💃', 'jump', 'jump blues'),
  bluesTag('soul-blues', 'Soul Blues', '💜', 'soul', 'soul blues'),
  bluesTag('blues-rock', 'Blues Rock', '🔥', 'rock', 'blues rock'),
]

export const INSTRUMENTS: BluesCategory[] = [
  bluesTag('guitar', 'Guitar', '🎸', 'guitar'),
  bluesTag('harmonica', 'Harmonica', '🎵', 'harmonica'),
  bluesTag('piano', 'Piano', '🎹', 'piano'),
  bluesTag('vocals', 'Vocals', '🎤', 'vocal'),
  bluesTag('bass', 'Bass', '🎸', 'bass'),
  bluesTag('drums', 'Drums', '🥁', 'drums'),
  bluesTag('slide', 'Slide Guitar', '🎸', 'slide', 'slide guitar'),
]

export const MOODS: BluesCategory[] = [
  bluesTag('slow', 'Slow & Soulful', '🌧️', 'slow', 'slow blues'),
  bluesTag('upbeat', 'Upbeat & Groovy', '🔥', 'energetic', 'upbeat blues'),
  bluesTag('melancholy', 'Melancholy', '😢', 'sad', 'sad blues'),
  bluesTag('raw', 'Raw & Gritty', '💀', 'dark', 'raw blues'),
  bluesTag('smooth', 'Smooth', '🌊', 'smooth', 'smooth blues'),
  bluesTag('late-night', 'Late Night', '🌙', 'lounge', 'late night blues'),
]

export const ERAS: BluesCategory[] = [
  bluesTag('pre-war', 'Pre-War (1920s–40s)', '📻', 'acoustic', 'pre-war blues'),
  bluesTag('classic', 'Classic Blues (1920s–30s)', '🎤', 'classic', 'classic blues'),
  bluesTag('postwar', 'Post-War / Chicago (1940s–60s)', '🏙️', 'chicago', 'chicago blues'),
  bluesTag('electric-era', 'Electric Era (1950s–70s)', '⚡', 'electric', 'electric blues'),
  bluesTag('modern', 'Modern Blues (1980s+)', '🔷', 'contemporary', 'modern blues'),
]

export async function getBluesTracks(category: BluesCategory, limit = 50, onMore?: (tracks: Track[]) => void): Promise<Track[]> {
  const jamendo = await advancedSearch({ tags: category.jamendoTags, search: category.jamendoSearch }, limit)
  if (onMore) {
    searchIA(category.iaQuery, 20).then(ia => {
      if (ia.length > 0) onMore([...jamendo, ...ia])
    })
  }
  return jamendo
}

export async function getBluesRadio(limit = 10): Promise<RadioStation[]> {
  return getStationsByGenre('blues', limit)
}

export async function searchBlues(query: string, limit = 20): Promise<Track[]> {
  const [jamendo, ia] = await Promise.all([
    advancedSearch({ search: query, tags: 'blues' }, limit),
    searchIA(`(${query}) subject:blues mediatype:audio`, 8),
  ])
  return [...jamendo, ...ia].slice(0, limit)
}
