import type { Track, RadioStation } from '../types'
import { advancedSearch } from './jamendo'
import { searchTracks as searchIA } from './archive'
import { getByGenre as getStationsByGenre } from './radio'

// ===== Taxonomy =====

export type ClassicalCategory = {
  id: string
  label: string
  icon: string
  // Jamendo: always uses tags=classical + optional search term
  jamendoSearch?: string    // search= param (composer name, form, etc.)
  jamendoTags: string       // tags= param (always includes classical)
  // Internet Archive: precise queries with subject:classical
  iaQuery: string
}

// Helper to define a composer entry
function composer(id: string, label: string, icon: string, fullName?: string): ClassicalCategory {
  const name = fullName || label
  return {
    id, label, icon,
    jamendoSearch: name.toLowerCase(),
    jamendoTags: 'classical',
    iaQuery: `creator:"${name}" subject:classical mediatype:audio`,
  }
}

// Helper for tag-based categories (instruments, forms, moods)
function classicalTag(id: string, label: string, icon: string, tag: string, iaSubject?: string): ClassicalCategory {
  return {
    id, label, icon,
    jamendoTags: `classical+${tag}`,
    iaQuery: `subject:(${iaSubject || tag}) subject:classical mediatype:audio`,
  }
}

export const ERAS: ClassicalCategory[] = [
  { id: 'baroque', label: 'Baroque', icon: '🏛️', jamendoTags: 'baroque', iaQuery: 'subject:baroque subject:classical mediatype:audio' },
  { id: 'classical-era', label: 'Classical Era', icon: '🎼', jamendoTags: 'classical', iaQuery: 'subject:"classical period" mediatype:audio' },
  { id: 'romantic', label: 'Romantic', icon: '🌹', jamendoTags: 'classical+romantic', iaQuery: 'subject:romantic subject:classical mediatype:audio' },
  { id: 'impressionist', label: 'Impressionist', icon: '🎨', jamendoTags: 'classical', jamendoSearch: 'impressionist', iaQuery: 'subject:impressionist mediatype:audio' },
  { id: 'modern', label: '20th Century', icon: '🔷', jamendoTags: 'classical+contemporary', iaQuery: 'subject:"20th century" subject:classical mediatype:audio' },
  { id: 'minimalist', label: 'Minimalist', icon: '◻️', jamendoTags: 'classical', jamendoSearch: 'minimalist', iaQuery: 'subject:minimalist subject:classical mediatype:audio' },
]

export const COMPOSERS: ClassicalCategory[] = [
  composer('bach', 'Bach', '⛪', 'Johann Sebastian Bach'),
  composer('mozart', 'Mozart', '🎼', 'Wolfgang Amadeus Mozart'),
  composer('beethoven', 'Beethoven', '🎵', 'Ludwig van Beethoven'),
  composer('chopin', 'Chopin', '🎹', 'Frédéric Chopin'),
  composer('vivaldi', 'Vivaldi', '🎻', 'Antonio Vivaldi'),
  composer('brahms', 'Brahms', '🎵', 'Johannes Brahms'),
  composer('tchaikovsky', 'Tchaikovsky', '🩰', 'Pyotr Ilyich Tchaikovsky'),
  composer('debussy', 'Debussy', '🌊', 'Claude Debussy'),
  composer('schubert', 'Schubert', '🎵', 'Franz Schubert'),
  composer('handel', 'Handel', '🎵', 'George Frideric Handel'),
  composer('liszt', 'Liszt', '🎹', 'Franz Liszt'),
  composer('ravel', 'Ravel', '🎵', 'Maurice Ravel'),
  composer('haydn', 'Haydn', '🎼', 'Joseph Haydn'),
  composer('mendelssohn', 'Mendelssohn', '🎵', 'Felix Mendelssohn'),
  composer('dvorak', 'Dvořák', '🎵', 'Antonín Dvořák'),
  composer('rachmaninoff', 'Rachmaninoff', '🎹', 'Sergei Rachmaninoff'),
  composer('mahler', 'Mahler', '🎼', 'Gustav Mahler'),
  composer('shostakovich', 'Shostakovich', '🎵', 'Dmitri Shostakovich'),
  composer('strauss', 'Strauss', '💃', 'Johann Strauss'),
  composer('verdi', 'Verdi', '🎤', 'Giuseppe Verdi'),
  composer('puccini', 'Puccini', '🎭', 'Giacomo Puccini'),
  composer('wagner', 'Wagner', '🎭', 'Richard Wagner'),
  composer('grieg', 'Grieg', '🏔️', 'Edvard Grieg'),
  composer('saint-saens', 'Saint-Saëns', '🎵', 'Camille Saint-Saëns'),
]

export const INSTRUMENTS: ClassicalCategory[] = [
  classicalTag('piano', 'Piano', '🎹', 'piano'),
  classicalTag('violin', 'Violin', '🎻', 'violin'),
  classicalTag('cello', 'Cello', '🎻', 'cello'),
  classicalTag('orchestra', 'Orchestra', '🎼', 'orchestra'),
  classicalTag('organ', 'Organ', '⛪', 'organ'),
  classicalTag('quartet', 'String Quartet', '🎶', 'quartet', 'string quartet'),
  classicalTag('opera', 'Opera / Voice', '🎤', 'opera', 'opera'),
  classicalTag('guitar', 'Guitar', '🎸', 'guitar'),
  classicalTag('flute', 'Flute', '🎵', 'flute'),
  classicalTag('harp', 'Harp', '🎵', 'harp'),
  classicalTag('trumpet', 'Trumpet', '🎺', 'trumpet'),
  classicalTag('clarinet', 'Clarinet', '🎵', 'clarinet'),
]

export const FORMS: ClassicalCategory[] = [
  classicalTag('symphony', 'Symphony', '🎼', 'symphony', 'symphony'),
  classicalTag('concerto', 'Concerto', '🎹', 'concerto', 'concerto'),
  classicalTag('sonata', 'Sonata', '🎵', 'sonata', 'sonata'),
  classicalTag('chamber', 'Chamber Music', '🏠', 'chamber', 'chamber music'),
  classicalTag('choral', 'Choral', '🎶', 'choral', 'choral'),
  classicalTag('nocturne', 'Nocturne', '🌙', 'nocturne', 'nocturne'),
  classicalTag('etude', 'Étude', '📖', 'etude', 'etude'),
  classicalTag('waltz', 'Waltz', '💃', 'waltz', 'waltz'),
  classicalTag('prelude', 'Prelude', '🎵', 'prelude', 'prelude'),
  classicalTag('fugue', 'Fugue', '🔄', 'fugue', 'fugue'),
  classicalTag('overture', 'Overture', '🎬', 'overture', 'overture'),
  classicalTag('requiem', 'Requiem', '🕯️', 'requiem', 'requiem'),
]

export const MOODS: ClassicalCategory[] = [
  classicalTag('peaceful', 'Peaceful', '☁️', 'relaxation', 'peaceful'),
  classicalTag('dramatic', 'Dramatic', '⚡', 'epic', 'dramatic'),
  classicalTag('melancholic', 'Melancholic', '🌧️', 'sad', 'melancholy'),
  classicalTag('triumphant', 'Triumphant', '🏆', 'energetic', 'triumphant'),
  classicalTag('meditative', 'Meditative', '🧘', 'ambient', 'meditation'),
  classicalTag('joyful', 'Joyful', '☀️', 'happy', 'joyful'),
  classicalTag('dark', 'Dark & Intense', '🖤', 'dark', 'dark'),
  classicalTag('pastoral', 'Pastoral', '🌿', 'nature', 'pastoral'),
]

// ===== Data fetching =====

export async function getClassicalTracks(category: ClassicalCategory, limit = 20): Promise<Track[]> {
  const [jamendo, ia] = await Promise.all([
    // Jamendo: always filter by classical tags + optional search
    advancedSearch({
      tags: category.jamendoTags,
      search: category.jamendoSearch,
    }, limit),
    // Internet Archive: use precise query with subject:classical
    searchIA(category.iaQuery, Math.min(limit, 8)),
  ])
  return [...jamendo, ...ia].slice(0, limit)
}

export async function getClassicalRadio(limit = 10): Promise<RadioStation[]> {
  return getStationsByGenre('classical', limit)
}

export async function searchClassical(query: string, limit = 20): Promise<Track[]> {
  const [jamendo, ia] = await Promise.all([
    // Always require classical tag when searching
    advancedSearch({ search: query, tags: 'classical' }, limit),
    // IA: combine query with subject:classical to exclude non-classical
    searchIA(`(${query}) subject:classical mediatype:audio`, Math.min(limit, 8)),
  ])
  return [...jamendo, ...ia].slice(0, limit)
}
