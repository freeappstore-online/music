import type { Track, RadioStation } from '../types'
import { getByGenre, advancedSearch } from './jamendo'
import { searchTracks as searchIA } from './archive'
import { getByGenre as getStationsByGenre } from './radio'

// ===== Taxonomy =====

export type ClassicalCategory = {
  id: string
  label: string
  icon: string
  query: string // Jamendo tag or IA search query
  iaQuery?: string // Override for Internet Archive search
}

export const ERAS: ClassicalCategory[] = [
  { id: 'baroque', label: 'Baroque', icon: '🏛️', query: 'baroque', iaQuery: 'baroque' },
  { id: 'classical', label: 'Classical', icon: '🎼', query: 'classical', iaQuery: 'classical+period' },
  { id: 'romantic', label: 'Romantic', icon: '🌹', query: 'romantic+classical', iaQuery: 'romantic+classical' },
  { id: 'modern', label: 'Modern', icon: '🔷', query: 'contemporary+classical', iaQuery: '20th+century+classical' },
]

export const COMPOSERS: ClassicalCategory[] = [
  { id: 'mozart', label: 'Mozart', icon: '🎵', query: 'mozart', iaQuery: 'creator:mozart' },
  { id: 'beethoven', label: 'Beethoven', icon: '🎵', query: 'beethoven', iaQuery: 'creator:beethoven' },
  { id: 'bach', label: 'Bach', icon: '🎵', query: 'bach', iaQuery: 'creator:bach' },
  { id: 'chopin', label: 'Chopin', icon: '🎹', query: 'chopin', iaQuery: 'creator:chopin' },
  { id: 'vivaldi', label: 'Vivaldi', icon: '🎻', query: 'vivaldi', iaQuery: 'creator:vivaldi' },
  { id: 'brahms', label: 'Brahms', icon: '🎵', query: 'brahms', iaQuery: 'creator:brahms' },
  { id: 'tchaikovsky', label: 'Tchaikovsky', icon: '🩰', query: 'tchaikovsky', iaQuery: 'creator:tchaikovsky' },
  { id: 'debussy', label: 'Debussy', icon: '🌊', query: 'debussy', iaQuery: 'creator:debussy' },
  { id: 'schubert', label: 'Schubert', icon: '🎵', query: 'schubert', iaQuery: 'creator:schubert' },
  { id: 'handel', label: 'Handel', icon: '🎵', query: 'handel', iaQuery: 'creator:handel' },
  { id: 'liszt', label: 'Liszt', icon: '🎹', query: 'liszt', iaQuery: 'creator:liszt' },
  { id: 'ravel', label: 'Ravel', icon: '🎵', query: 'ravel', iaQuery: 'creator:ravel' },
]

export const INSTRUMENTS: ClassicalCategory[] = [
  { id: 'piano', label: 'Piano', icon: '🎹', query: 'piano+classical', iaQuery: 'piano+classical' },
  { id: 'violin', label: 'Violin', icon: '🎻', query: 'violin+classical', iaQuery: 'violin+classical' },
  { id: 'cello', label: 'Cello', icon: '🎻', query: 'cello+classical', iaQuery: 'cello+classical' },
  { id: 'orchestra', label: 'Orchestra', icon: '🎼', query: 'orchestra+classical', iaQuery: 'orchestra+classical' },
  { id: 'organ', label: 'Organ', icon: '⛪', query: 'organ+classical', iaQuery: 'organ+classical' },
  { id: 'quartet', label: 'String Quartet', icon: '🎶', query: 'string+quartet', iaQuery: 'string+quartet' },
  { id: 'opera', label: 'Opera / Voice', icon: '🎤', query: 'opera', iaQuery: 'opera' },
  { id: 'guitar', label: 'Guitar', icon: '🎸', query: 'guitar+classical', iaQuery: 'guitar+classical' },
]

export const FORMS: ClassicalCategory[] = [
  { id: 'symphony', label: 'Symphony', icon: '🎼', query: 'symphony', iaQuery: 'symphony' },
  { id: 'concerto', label: 'Concerto', icon: '🎹', query: 'concerto', iaQuery: 'concerto' },
  { id: 'sonata', label: 'Sonata', icon: '🎵', query: 'sonata', iaQuery: 'sonata' },
  { id: 'chamber', label: 'Chamber', icon: '🏠', query: 'chamber+music', iaQuery: 'chamber+music' },
  { id: 'choral', label: 'Choral', icon: '🎶', query: 'choral', iaQuery: 'choral' },
  { id: 'nocturne', label: 'Nocturne', icon: '🌙', query: 'nocturne', iaQuery: 'nocturne' },
]

export const MOODS: ClassicalCategory[] = [
  { id: 'peaceful', label: 'Peaceful', icon: '☁️', query: 'classical+relaxation', iaQuery: 'classical+peaceful' },
  { id: 'dramatic', label: 'Dramatic', icon: '⚡', query: 'classical+epic', iaQuery: 'classical+dramatic' },
  { id: 'melancholic', label: 'Melancholic', icon: '🌧️', query: 'classical+sad', iaQuery: 'classical+melancholic' },
  { id: 'triumphant', label: 'Triumphant', icon: '🏆', query: 'classical+energetic', iaQuery: 'classical+triumphant' },
  { id: 'meditative', label: 'Meditative', icon: '🧘', query: 'classical+ambient', iaQuery: 'classical+meditation' },
  { id: 'joyful', label: 'Joyful', icon: '☀️', query: 'classical+happy', iaQuery: 'classical+joyful' },
]

// ===== Data fetching =====

export async function getClassicalTracks(category: ClassicalCategory, limit = 20): Promise<Track[]> {
  const [jamendo, ia] = await Promise.all([
    getByGenre(category.query, limit),
    searchIA(category.iaQuery || category.query, Math.min(limit, 8)),
  ])
  // Merge, Jamendo first (better metadata), IA for depth
  return [...jamendo, ...ia].slice(0, limit)
}

export async function getClassicalRadio(limit = 10): Promise<RadioStation[]> {
  return getStationsByGenre('classical', limit)
}

export async function searchClassical(query: string, limit = 20): Promise<Track[]> {
  const [jamendo, ia] = await Promise.all([
    advancedSearch({ search: query, tags: 'classical' }, limit),
    searchIA(`${query} classical`, Math.min(limit, 8)),
  ])
  return [...jamendo, ...ia].slice(0, limit)
}
