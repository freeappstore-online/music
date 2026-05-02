import { lower } from '../lib/format'
import { advancedSearch } from './jamendo'
import { searchTracks as searchIA } from './archive'
import type { Track } from '../types'

export type WorkType = 'opera' | 'symphony' | 'concerto' | 'sonata' | 'ballet' | 'oratorio' | 'quartet' | 'requiem' | 'suite' | 'tone-poem'

export type Work = {
  title: string
  composer: string
  composerId: string
  year: number
  type: WorkType
  key?: string
  searchQuery: string // what to search to find recordings
}

export const WORK_TYPES: { id: WorkType; label: string; icon: string }[] = [
  { id: 'opera', label: 'Opera', icon: '🎭' },
  { id: 'symphony', label: 'Symphony', icon: '🎼' },
  { id: 'concerto', label: 'Concerto', icon: '🎹' },
  { id: 'sonata', label: 'Sonata', icon: '🎵' },
  { id: 'ballet', label: 'Ballet', icon: '🩰' },
  { id: 'oratorio', label: 'Oratorio', icon: '⛪' },
  { id: 'quartet', label: 'Quartet', icon: '🎶' },
  { id: 'requiem', label: 'Requiem', icon: '🕯️' },
  { id: 'suite', label: 'Suite', icon: '🎵' },
  { id: 'tone-poem', label: 'Tone Poem', icon: '🌊' },
]

// Curated catalog of famous classical works
export const WORKS = [
  // Operas
  { title: 'The Magic Flute', composer: 'Mozart', composerId: 'mozart', year: 1791, type: 'opera', searchQuery: 'magic flute mozart' },
  { title: 'The Marriage of Figaro', composer: 'Mozart', composerId: 'mozart', year: 1786, type: 'opera', searchQuery: 'marriage figaro mozart' },
  { title: 'Don Giovanni', composer: 'Mozart', composerId: 'mozart', year: 1787, type: 'opera', searchQuery: 'don giovanni mozart' },
  { title: 'La Traviata', composer: 'Verdi', composerId: 'verdi', year: 1853, type: 'opera', searchQuery: 'la traviata verdi' },
  { title: 'Aida', composer: 'Verdi', composerId: 'verdi', year: 1871, type: 'opera', searchQuery: 'aida verdi' },
  { title: 'Rigoletto', composer: 'Verdi', composerId: 'verdi', year: 1851, type: 'opera', searchQuery: 'rigoletto verdi' },
  { title: 'La Bohème', composer: 'Puccini', composerId: 'puccini', year: 1896, type: 'opera', searchQuery: 'la boheme puccini' },
  { title: 'Tosca', composer: 'Puccini', composerId: 'puccini', year: 1900, type: 'opera', searchQuery: 'tosca puccini' },
  { title: 'Madama Butterfly', composer: 'Puccini', composerId: 'puccini', year: 1904, type: 'opera', searchQuery: 'madama butterfly puccini' },
  { title: 'The Ring Cycle', composer: 'Wagner', composerId: 'wagner', year: 1876, type: 'opera', searchQuery: 'ring nibelung wagner' },
  { title: 'Tristan und Isolde', composer: 'Wagner', composerId: 'wagner', year: 1865, type: 'opera', searchQuery: 'tristan isolde wagner' },
  { title: 'Carmen', composer: 'Bizet', composerId: 'bizet', year: 1875, type: 'opera', searchQuery: 'carmen bizet' },
  { title: 'The Barber of Seville', composer: 'Rossini', composerId: 'rossini', year: 1816, type: 'opera', searchQuery: 'barber seville rossini' },
  { title: 'Orfeo', composer: 'Monteverdi', composerId: 'monteverdi', year: 1607, type: 'opera', searchQuery: 'orfeo monteverdi' },

  // Symphonies
  { title: 'Symphony No. 5', composer: 'Beethoven', composerId: 'beethoven', year: 1808, type: 'symphony', key: 'C minor', searchQuery: 'beethoven symphony 5' },
  { title: 'Symphony No. 9 "Choral"', composer: 'Beethoven', composerId: 'beethoven', year: 1824, type: 'symphony', key: 'D minor', searchQuery: 'beethoven symphony 9' },
  { title: 'Symphony No. 3 "Eroica"', composer: 'Beethoven', composerId: 'beethoven', year: 1804, type: 'symphony', searchQuery: 'beethoven eroica' },
  { title: 'Symphony No. 6 "Pastoral"', composer: 'Beethoven', composerId: 'beethoven', year: 1808, type: 'symphony', searchQuery: 'beethoven pastoral symphony' },
  { title: 'Symphony No. 40', composer: 'Mozart', composerId: 'mozart', year: 1788, type: 'symphony', key: 'G minor', searchQuery: 'mozart symphony 40' },
  { title: 'Symphony No. 41 "Jupiter"', composer: 'Mozart', composerId: 'mozart', year: 1788, type: 'symphony', searchQuery: 'mozart jupiter symphony' },
  { title: 'Symphony No. 9 "New World"', composer: 'Dvořák', composerId: 'dvorak', year: 1893, type: 'symphony', searchQuery: 'dvorak new world symphony' },
  { title: 'Symphony No. 5', composer: 'Tchaikovsky', composerId: 'tchaikovsky', year: 1888, type: 'symphony', searchQuery: 'tchaikovsky symphony 5' },
  { title: 'Symphony No. 6 "Pathétique"', composer: 'Tchaikovsky', composerId: 'tchaikovsky', year: 1893, type: 'symphony', searchQuery: 'tchaikovsky pathetique' },
  { title: 'Symphony No. 5', composer: 'Mahler', composerId: 'mahler', year: 1902, type: 'symphony', searchQuery: 'mahler symphony 5' },
  { title: 'Symphony No. 2 "Resurrection"', composer: 'Mahler', composerId: 'mahler', year: 1894, type: 'symphony', searchQuery: 'mahler resurrection symphony' },
  { title: 'Symphony No. 5', composer: 'Shostakovich', composerId: 'shostakovich', year: 1937, type: 'symphony', searchQuery: 'shostakovich symphony 5' },
  { title: 'Symphonie fantastique', composer: 'Berlioz', composerId: 'berlioz', year: 1830, type: 'symphony', searchQuery: 'berlioz symphonie fantastique' },
  { title: 'Symphony No. 3 "Organ"', composer: 'Saint-Saëns', composerId: 'saint-saens', year: 1886, type: 'symphony', searchQuery: 'saint-saens organ symphony' },

  // Concertos
  { title: 'Piano Concerto No. 21', composer: 'Mozart', composerId: 'mozart', year: 1785, type: 'concerto', searchQuery: 'mozart piano concerto 21' },
  { title: 'Piano Concerto No. 5 "Emperor"', composer: 'Beethoven', composerId: 'beethoven', year: 1811, type: 'concerto', searchQuery: 'beethoven emperor concerto' },
  { title: 'Violin Concerto', composer: 'Beethoven', composerId: 'beethoven', year: 1806, type: 'concerto', key: 'D major', searchQuery: 'beethoven violin concerto' },
  { title: 'Piano Concerto No. 1', composer: 'Tchaikovsky', composerId: 'tchaikovsky', year: 1875, type: 'concerto', searchQuery: 'tchaikovsky piano concerto 1' },
  { title: 'Violin Concerto', composer: 'Brahms', composerId: 'brahms', year: 1878, type: 'concerto', key: 'D major', searchQuery: 'brahms violin concerto' },
  { title: 'Piano Concerto No. 2', composer: 'Rachmaninoff', composerId: 'rachmaninoff', year: 1901, type: 'concerto', searchQuery: 'rachmaninoff piano concerto 2' },
  { title: 'Piano Concerto No. 3', composer: 'Rachmaninoff', composerId: 'rachmaninoff', year: 1909, type: 'concerto', searchQuery: 'rachmaninoff piano concerto 3' },
  { title: 'The Four Seasons', composer: 'Vivaldi', composerId: 'vivaldi', year: 1725, type: 'concerto', searchQuery: 'vivaldi four seasons' },
  { title: 'Cello Concerto', composer: 'Dvořák', composerId: 'dvorak', year: 1895, type: 'concerto', searchQuery: 'dvorak cello concerto' },
  { title: 'Piano Concerto in A minor', composer: 'Grieg', composerId: 'grieg', year: 1868, type: 'concerto', searchQuery: 'grieg piano concerto' },

  // Sonatas
  { title: 'Moonlight Sonata', composer: 'Beethoven', composerId: 'beethoven', year: 1801, type: 'sonata', searchQuery: 'beethoven moonlight sonata' },
  { title: 'Pathétique Sonata', composer: 'Beethoven', composerId: 'beethoven', year: 1798, type: 'sonata', searchQuery: 'beethoven pathetique sonata' },
  { title: 'Piano Sonata No. 11 "Alla Turca"', composer: 'Mozart', composerId: 'mozart', year: 1783, type: 'sonata', searchQuery: 'mozart alla turca' },

  // Ballets
  { title: 'Swan Lake', composer: 'Tchaikovsky', composerId: 'tchaikovsky', year: 1877, type: 'ballet', searchQuery: 'tchaikovsky swan lake' },
  { title: 'The Nutcracker', composer: 'Tchaikovsky', composerId: 'tchaikovsky', year: 1892, type: 'ballet', searchQuery: 'tchaikovsky nutcracker' },
  { title: 'Sleeping Beauty', composer: 'Tchaikovsky', composerId: 'tchaikovsky', year: 1890, type: 'ballet', searchQuery: 'tchaikovsky sleeping beauty' },
  { title: 'The Rite of Spring', composer: 'Stravinsky', composerId: 'stravinsky', year: 1913, type: 'ballet', searchQuery: 'stravinsky rite spring' },
  { title: 'The Firebird', composer: 'Stravinsky', composerId: 'stravinsky', year: 1910, type: 'ballet', searchQuery: 'stravinsky firebird' },
  { title: 'Romeo and Juliet', composer: 'Prokofiev', composerId: 'prokofiev', year: 1935, type: 'ballet', searchQuery: 'prokofiev romeo juliet ballet' },

  // Oratorios & Requiems
  { title: 'Messiah', composer: 'Handel', composerId: 'handel', year: 1741, type: 'oratorio', searchQuery: 'handel messiah' },
  { title: 'Requiem', composer: 'Mozart', composerId: 'mozart', year: 1791, type: 'requiem', searchQuery: 'mozart requiem' },
  { title: 'Requiem', composer: 'Verdi', composerId: 'verdi', year: 1874, type: 'requiem', searchQuery: 'verdi requiem' },
  { title: 'St Matthew Passion', composer: 'Bach', composerId: 'bach', year: 1727, type: 'oratorio', searchQuery: 'bach matthew passion' },
  { title: 'Mass in B minor', composer: 'Bach', composerId: 'bach', year: 1749, type: 'oratorio', searchQuery: 'bach mass b minor' },

  // Suites & Tone Poems
  { title: 'The Planets', composer: 'Holst', composerId: 'holst', year: 1918, type: 'suite', searchQuery: 'holst planets' },
  { title: 'Peer Gynt', composer: 'Grieg', composerId: 'grieg', year: 1875, type: 'suite', searchQuery: 'grieg peer gynt' },
  { title: 'Also sprach Zarathustra', composer: 'R. Strauss', composerId: 'strauss', year: 1896, type: 'tone-poem', searchQuery: 'strauss zarathustra' },
  { title: 'The Moldau', composer: 'Smetana', composerId: 'smetana', year: 1874, type: 'tone-poem', searchQuery: 'smetana moldau' },
  { title: 'Boléro', composer: 'Ravel', composerId: 'ravel', year: 1928, type: 'tone-poem', searchQuery: 'ravel bolero' },
  { title: 'Clair de Lune', composer: 'Debussy', composerId: 'debussy', year: 1905, type: 'suite', searchQuery: 'debussy clair de lune' },
  { title: 'Goldberg Variations', composer: 'Bach', composerId: 'bach', year: 1741, type: 'suite', searchQuery: 'bach goldberg variations' },
  { title: 'Well-Tempered Clavier', composer: 'Bach', composerId: 'bach', year: 1722, type: 'suite', searchQuery: 'bach well tempered clavier' },

  // Quartets
  { title: 'String Quartet No. 14 "Death and the Maiden"', composer: 'Schubert', composerId: 'schubert', year: 1824, type: 'quartet', searchQuery: 'schubert death maiden quartet' },
  { title: 'String Quartet No. 8', composer: 'Shostakovich', composerId: 'shostakovich', year: 1960, type: 'quartet', searchQuery: 'shostakovich string quartet 8' },
].sort((a, b) => a.year - b.year) as Work[]

export async function searchWork(work: Work, limit = 15): Promise<Track[]> {
  // Use composer name + work title for precise matching
  const jamendoQuery = `${work.composer} ${work.searchQuery}`
  const iaQuery = `"${work.searchQuery}" creator:(${work.composer.toLowerCase()}) subject:classical mediatype:audio`

  const [jamendo, ia] = await Promise.all([
    advancedSearch({ search: jamendoQuery, tags: 'classical' }, limit),
    searchIA(iaQuery, 10),
  ])

  // Filter results: keep only tracks that mention the composer name
  const composerLower = work.composer.toLowerCase()
  const filtered = [...jamendo, ...ia].filter(t =>
    lower(t.artist).includes(composerLower) ||
    lower(t.title).includes(composerLower) ||
    lower(t.album).includes(composerLower)
  )

  // Fall back to unfiltered if nothing matches (some tracks have performer names, not composer)
  return filtered.length > 0 ? filtered.slice(0, limit) : [...jamendo, ...ia].slice(0, limit)
}
