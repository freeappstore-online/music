import type { Track, RadioStation } from '../types'
import { advancedSearch } from './jamendo'
import { searchTracks as searchIA } from './archive'
import { getByGenre as getStationsByGenre } from './radio'

// ===== Taxonomy =====

export type ClassicalCategory = {
  id: string
  label: string
  icon: string
  image?: string
  years?: string
  // Jamendo: always uses tags=classical + optional search term
  jamendoSearch?: string
  jamendoTags: string
  // Internet Archive: precise queries with subject:classical
  iaQuery: string
}

// Composer portraits from Wikimedia Commons (public domain)
const PORTRAITS: Record<string, string> = {
  bach: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Johann_Sebastian_Bach.jpg/330px-Johann_Sebastian_Bach.jpg',
  mozart: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/The_Mozart_Family_-_Wolfgang_Amadeus_Mozart_headshot.jpg/330px-The_Mozart_Family_-_Wolfgang_Amadeus_Mozart_headshot.jpg',
  beethoven: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Joseph_Karl_Stieler%27s_Beethoven_mit_dem_Manuskript_der_Missa_solemnis.jpg/330px-Joseph_Karl_Stieler%27s_Beethoven_mit_dem_Manuskript_der_Missa_solemnis.jpg',
  chopin: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Frederic_Chopin_photo.jpeg/330px-Frederic_Chopin_photo.jpeg',
  vivaldi: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bd/Vivaldi.jpg/330px-Vivaldi.jpg',
  brahms: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/JohannesBrahms_%28cropped%29.jpg/330px-JohannesBrahms_%28cropped%29.jpg',
  tchaikovsky: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Tchaikovsky_by_Reutlinger_%28cropped%29.jpg/330px-Tchaikovsky_by_Reutlinger_%28cropped%29.jpg',
  debussy: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Claude_Debussy_by_Atelier_Nadar.jpg/330px-Claude_Debussy_by_Atelier_Nadar.jpg',
  schubert: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Franz_Schubert_by_Wilhelm_August_Rieder_1875.jpg/330px-Franz_Schubert_by_Wilhelm_August_Rieder_1875.jpg',
  handel: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/George_Frideric_Handel_by_Balthasar_Denner.jpg/330px-George_Frideric_Handel_by_Balthasar_Denner.jpg',
  liszt: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Franz_Liszt_by_Herman_Biow-_1843.png/330px-Franz_Liszt_by_Herman_Biow-_1843.png',
  ravel: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Maurice_Ravel_1925.jpg/330px-Maurice_Ravel_1925.jpg',
  haydn: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Joseph_Haydn.jpg/330px-Joseph_Haydn.jpg',
  mendelssohn: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Felix_Mendelssohn_Bartholdy_by_Eduard_Magnus_%281833%29.jpg/330px-Felix_Mendelssohn_Bartholdy_by_Eduard_Magnus_%281833%29.jpg',
  dvorak: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Dvorak.jpg/330px-Dvorak.jpg',
  rachmaninoff: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/Sergei_Rachmaninoff_cph.3a40575.jpg/330px-Sergei_Rachmaninoff_cph.3a40575.jpg',
  mahler: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Photo_of_Gustav_Mahler_by_Moritz_N%C3%A4hr_01.jpg/330px-Photo_of_Gustav_Mahler_by_Moritz_N%C3%A4hr_01.jpg',
  shostakovich: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/%D0%9A%D0%BE%D0%BC%D0%BF%D0%BE%D0%B7%D0%B8%D1%82%D0%BE%D1%80_%D0%94%D0%BC%D0%B8%D1%82%D1%80%D0%B8%D0%B9_%D0%94%D0%BC%D0%B8%D1%82%D1%80%D0%B8%D0%B5%D0%B2%D0%B8%D1%87_%D0%A8%D0%BE%D1%81%D1%82%D0%B0%D0%BA%D0%BE%D0%B2%D0%B8%D1%87.jpg/330px-%D0%9A%D0%BE%D0%BC%D0%BF%D0%BE%D0%B7%D0%B8%D1%82%D0%BE%D1%80_%D0%94%D0%BC%D0%B8%D1%82%D1%80%D0%B8%D0%B9_%D0%94%D0%BC%D0%B8%D1%82%D1%80%D0%B8%D0%B5%D0%B2%D0%B8%D1%87_%D0%A8%D0%BE%D1%81%D1%82%D0%B0%D0%BA%D0%BE%D0%B2%D0%B8%D1%87.jpg',
  strauss: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Johann_Strauss_II_by_Fritz_Luckhardt_3-4_crop.jpg/330px-Johann_Strauss_II_by_Fritz_Luckhardt_3-4_crop.jpg',
  verdi: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Giuseppe_Verdi_by_Ferdinand_Mulnier_BW.jpg/330px-Giuseppe_Verdi_by_Ferdinand_Mulnier_BW.jpg',
  puccini: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/GiacomoPuccini.jpg/330px-GiacomoPuccini.jpg',
  wagner: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/RichardWagner.jpg/330px-RichardWagner.jpg',
  grieg: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Edvard_Grieg_portrait_%28cropped%29.jpg/330px-Edvard_Grieg_portrait_%28cropped%29.jpg',
  'saint-saens': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Saint-Sa%C3%ABns-circa-1880.jpg/330px-Saint-Sa%C3%ABns-circa-1880.jpg',
  prokofiev: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Sergei_Prokofiev_circa_1918_over_Chair_Bain.jpg/330px-Sergei_Prokofiev_circa_1918_over_Chair_Bain.jpg',
  stravinsky: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Igor_Stravinsky_LOC_32392u.jpg/330px-Igor_Stravinsky_LOC_32392u.jpg',
  sibelius: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Jean_Sibelius_circa_1898-1900_%283x4_cropped%29.jpg/330px-Jean_Sibelius_circa_1898-1900_%283x4_cropped%29.jpg',
  bartok: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/Bart%C3%B3k_B%C3%A9la_1927.jpg/330px-Bart%C3%B3k_B%C3%A9la_1927.jpg',
  monteverdi: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Bernardo_Strozzi_-_Claudio_Monteverdi_%28c.1630%29.jpg/330px-Bernardo_Strozzi_-_Claudio_Monteverdi_%28c.1630%29.jpg',
  telemann: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/Telemann.jpg/330px-Telemann.jpg',
  purcell: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Henry_Purcell_Closterman.jpg/330px-Henry_Purcell_Closterman.jpg',
  paganini: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Paganini.jpeg/330px-Paganini.jpeg',
  schumann: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Robert_Schumann_1839.jpg/330px-Robert_Schumann_1839.jpg',
  berlioz: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Hector-Berlioz-1845.png/330px-Hector-Berlioz-1845.png',
  satie: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/58/Ericsatie.jpg/330px-Ericsatie.jpg',
  'rimsky-korsakov': 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Walentin_Alexandrowitsch_Serow_004_%28cropped_3x4%29.jpg/330px-Walentin_Alexandrowitsch_Serow_004_%28cropped_3x4%29.jpg',
  borodin: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Borodin.jpg/330px-Borodin.jpg',
  copland: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Aaron_Copland_1970.JPG/330px-Aaron_Copland_1970.JPG',
  glass: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Philip_Glass_in_Florence%2C_Italy_-_1993_%28cropped%29.jpg/330px-Philip_Glass_in_Florence%2C_Italy_-_1993_%28cropped%29.jpg',
}

function composer(id: string, label: string, icon: string, fullName: string, years: string): ClassicalCategory {
  return {
    id, label, icon,
    image: PORTRAITS[id],
    years,
    jamendoSearch: fullName.toLowerCase(),
    jamendoTags: 'classical',
    iaQuery: `creator:"${fullName}" subject:classical mediatype:audio`,
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
  composer('bach', 'Bach', '⛪', 'Johann Sebastian Bach', '1685–1750'),
  composer('mozart', 'Mozart', '🎼', 'Wolfgang Amadeus Mozart', '1756–1791'),
  composer('beethoven', 'Beethoven', '🎵', 'Ludwig van Beethoven', '1770–1827'),
  composer('chopin', 'Chopin', '🎹', 'Frédéric Chopin', '1810–1849'),
  composer('vivaldi', 'Vivaldi', '🎻', 'Antonio Vivaldi', '1678–1741'),
  composer('brahms', 'Brahms', '🎵', 'Johannes Brahms', '1833–1897'),
  composer('tchaikovsky', 'Tchaikovsky', '🩰', 'Pyotr Ilyich Tchaikovsky', '1840–1893'),
  composer('debussy', 'Debussy', '🌊', 'Claude Debussy', '1862–1918'),
  composer('schubert', 'Schubert', '🎵', 'Franz Schubert', '1797–1828'),
  composer('handel', 'Handel', '🎵', 'George Frideric Handel', '1685–1759'),
  composer('liszt', 'Liszt', '🎹', 'Franz Liszt', '1811–1886'),
  composer('ravel', 'Ravel', '🎵', 'Maurice Ravel', '1875–1937'),
  composer('haydn', 'Haydn', '🎼', 'Joseph Haydn', '1732–1809'),
  composer('mendelssohn', 'Mendelssohn', '🎵', 'Felix Mendelssohn', '1809–1847'),
  composer('dvorak', 'Dvořák', '🎵', 'Antonín Dvořák', '1841–1904'),
  composer('rachmaninoff', 'Rachmaninoff', '🎹', 'Sergei Rachmaninoff', '1873–1943'),
  composer('mahler', 'Mahler', '🎼', 'Gustav Mahler', '1860–1911'),
  composer('shostakovich', 'Shostakovich', '🎵', 'Dmitri Shostakovich', '1906–1975'),
  composer('strauss', 'Strauss', '💃', 'Johann Strauss II', '1825–1899'),
  composer('verdi', 'Verdi', '🎤', 'Giuseppe Verdi', '1813–1901'),
  composer('puccini', 'Puccini', '🎭', 'Giacomo Puccini', '1858–1924'),
  composer('wagner', 'Wagner', '🎭', 'Richard Wagner', '1813–1883'),
  composer('grieg', 'Grieg', '🏔️', 'Edvard Grieg', '1843–1907'),
  composer('saint-saens', 'Saint-Saëns', '🎵', 'Camille Saint-Saëns', '1835–1921'),
  composer('prokofiev', 'Prokofiev', '🎵', 'Sergei Prokofiev', '1891–1953'),
  composer('stravinsky', 'Stravinsky', '🔥', 'Igor Stravinsky', '1882–1971'),
  composer('sibelius', 'Sibelius', '🌲', 'Jean Sibelius', '1865–1957'),
  composer('bartok', 'Bartók', '🎵', 'Béla Bartók', '1881–1945'),
  composer('monteverdi', 'Monteverdi', '🏛️', 'Claudio Monteverdi', '1567–1643'),
  composer('telemann', 'Telemann', '🎵', 'Georg Philipp Telemann', '1681–1767'),
  composer('purcell', 'Purcell', '👑', 'Henry Purcell', '1659–1695'),
  composer('paganini', 'Paganini', '🎻', 'Niccolò Paganini', '1782–1840'),
  composer('schumann', 'Schumann', '🎹', 'Robert Schumann', '1810–1856'),
  composer('berlioz', 'Berlioz', '🎼', 'Hector Berlioz', '1803–1869'),
  composer('satie', 'Satie', '🌙', 'Erik Satie', '1866–1925'),
  composer('rimsky-korsakov', 'Rimsky-Korsakov', '🐝', 'Nikolai Rimsky-Korsakov', '1844–1908'),
  composer('borodin', 'Borodin', '🎵', 'Alexander Borodin', '1833–1887'),
  composer('copland', 'Copland', '🇺🇸', 'Aaron Copland', '1900–1990'),
  composer('glass', 'Philip Glass', '◻️', 'Philip Glass', '1937–'),
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

// Returns Jamendo results fast, then appends IA results via callback
export async function getClassicalTracks(category: ClassicalCategory, limit = 50, onMore?: (tracks: Track[]) => void): Promise<Track[]> {
  const jamendo = await advancedSearch({
    tags: category.jamendoTags,
    search: category.jamendoSearch,
  }, limit)

  if (onMore) {
    searchIA(category.iaQuery, 20).then(ia => {
      if (ia.length > 0) onMore([...jamendo, ...ia])
    })
  }

  return jamendo
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
