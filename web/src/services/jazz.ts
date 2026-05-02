import { lower } from '../lib/format'
import type { Track, RadioStation } from '../types'
import { advancedSearch } from './jamendo'
import { searchTracks as searchIA } from './archive'
import { getByGenre as getStationsByGenre } from './radio'

export type JazzCategory = {
  id: string
  label: string
  icon: string
  image?: string
  years?: string
  jamendoSearch?: string
  jamendoTags: string
  iaQuery: string
}

// Portraits from Wikimedia Commons (public domain)
const PORTRAITS: Record<string, string> = {
  'miles-davis': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Miles_Davis_by_Palumbo_cropped.jpg/330px-Miles_Davis_by_Palumbo_cropped.jpg',
  'john-coltrane': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/John_Coltrane_1963_cropped_ver2.jpg/330px-John_Coltrane_1963_cropped_ver2.jpg',
  'duke-ellington': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Duke_Ellington_-_publicity.JPG/330px-Duke_Ellington_-_publicity.JPG',
  'charlie-parker': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Portrait_of_Charlie_Parker_in_1947.jpg/330px-Portrait_of_Charlie_Parker_in_1947.jpg',
  'thelonious-monk': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/Thelonious_Monk%2C_Minton%27s_Playhouse%2C_New_York%2C_N.Y.%2C_ca._Sept._1947_%28William_P._Gottlieb_06191%29.jpg/330px-Thelonious_Monk%2C_Minton%27s_Playhouse%2C_New_York%2C_N.Y.%2C_ca._Sept._1947_%28William_P._Gottlieb_06191%29.jpg',
  'louis-armstrong': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/16/Louis_Armstrong_in_Color_%28restored%29.jpg/330px-Louis_Armstrong_in_Color_%28restored%29.jpg',
  'ella-fitzgerald': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/Ella_Fitzgerald_1962.JPG/330px-Ella_Fitzgerald_1962.JPG',
  'billie-holiday': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/Portrait_of_Billie_Holiday_and_Mister%2C_Downbeat%2C_New_York%2C_N.Y.%2C_ca._Feb._1947_%28LOC%2C_5020400274%2C_cropped%29.jpg/330px-Portrait_of_Billie_Holiday_and_Mister%2C_Downbeat%2C_New_York%2C_N.Y.%2C_ca._Feb._1947_%28LOC%2C_5020400274%2C_cropped%29.jpg',
  'dave-brubeck': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bc/Dave_Brubeck_%281964%29.jpg/330px-Dave_Brubeck_%281964%29.jpg',
  'oscar-peterson': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Oscar_Peterson.jpg/330px-Oscar_Peterson.jpg',
  'dizzy-gillespie': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Portrait_of_Dizzy_Gillespie%2C_Famous_Door%2C_New_York%2C_N.Y.%2C_ca._June_1946_%28cropped%29.jpg/330px-Portrait_of_Dizzy_Gillespie%2C_Famous_Door%2C_New_York%2C_N.Y.%2C_ca._June_1946_%28cropped%29.jpg',
  'chet-baker': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Chet_Baker_%281955_portrait%29.jpg/330px-Chet_Baker_%281955_portrait%29.jpg',
  'nina-simone': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Nina_Simone_-1969.jpg/330px-Nina_Simone_-1969.jpg',
  'wes-montgomery': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Wes_Montgomery_%281967_Gibson_portrait%29.jpg/330px-Wes_Montgomery_%281967_Gibson_portrait%29.jpg',
  'django-reinhardt': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Django_Reinhardt_%28Gottlieb_07301%29.jpg/330px-Django_Reinhardt_%28Gottlieb_07301%29.jpg',
  'ornette-coleman': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Ornette-Coleman-2008-Heidelberg-schindelbeck.jpg/330px-Ornette-Coleman-2008-Heidelberg-schindelbeck.jpg',
  'benny-goodman': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Benny_Goodman_1942.jpg/330px-Benny_Goodman_1942.jpg',
  'mccoy-tyner': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/79/Mccoy_Tyner_1973_gh_%28cropped%29.jpg/330px-Mccoy_Tyner_1973_gh_%28cropped%29.jpg',
  'keith-jarrett': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Keith_Jarrett.jpg/330px-Keith_Jarrett.jpg',
  'pharoah-sanders': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/Pharoah_Sanders_photo.jpg/330px-Pharoah_Sanders_photo.jpg',
  'herbie-hancock': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Herbie_Hancock_2023.jpg/330px-Herbie_Hancock_2023.jpg',
  'charles-mingus': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Charles_Mingus_1976_cropped.jpg/330px-Charles_Mingus_1976_cropped.jpg',
  'art-blakey': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Art_blakey_studio_portrait.jpg/330px-Art_blakey_studio_portrait.jpg',
  'stan-getz': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Stan_Getz%2C_tenor_saxophonist_at_Kastrup_Airport_CPH%2C_Copenhagen_%28cropped%29.jpg/330px-Stan_Getz%2C_tenor_saxophonist_at_Kastrup_Airport_CPH%2C_Copenhagen_%28cropped%29.jpg',
  'count-basie': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Count_Basie_%281955_Kriegsmann_portrait_-_square_crop%29.jpg/330px-Count_Basie_%281955_Kriegsmann_portrait_-_square_crop%29.jpg',
  'sonny-rollins': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Sonny_Rollins_2011.jpg/330px-Sonny_Rollins_2011.jpg',
  'coleman-hawkins': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Coleman_Hawkins.jpg/330px-Coleman_Hawkins.jpg',
  'wynton-marsalis': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Wynton_Marsalis_2009_09_13.jpg/330px-Wynton_Marsalis_2009_09_13.jpg',
  'sarah-vaughan': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Sarah_Vaughan_-_William_P._Gottlieb_-_No._1.jpg/330px-Sarah_Vaughan_-_William_P._Gottlieb_-_No._1.jpg',
  'dexter-gordon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Dexter_Gordon1.jpg/330px-Dexter_Gordon1.jpg',
  'pat-metheny': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/39/Pat_metheny_orch2.jpg/330px-Pat_metheny_orch2.jpg',
}

function artist(id: string, label: string, icon: string, fullName: string, years: string): JazzCategory {
  return {
    id, label, icon,
    image: PORTRAITS[id],
    years,
    jamendoSearch: fullName.toLowerCase(),
    jamendoTags: 'jazz',
    iaQuery: `creator:(${fullName.toLowerCase()}) subject:jazz mediatype:audio`,
  }
}

function jazzTag(id: string, label: string, icon: string, tag: string, iaSubject?: string): JazzCategory {
  return {
    id, label, icon,
    jamendoTags: `jazz+${tag}`,
    iaQuery: `subject:(${iaSubject || tag}) subject:jazz mediatype:audio`,
  }
}

export const ARTISTS: JazzCategory[] = [
  artist('miles-davis', 'Miles Davis', '🎺', 'Miles Davis', '1926–1991'),
  artist('john-coltrane', 'John Coltrane', '🎷', 'John Coltrane', '1926–1967'),
  artist('duke-ellington', 'Duke Ellington', '🎹', 'Duke Ellington', '1899–1974'),
  artist('charlie-parker', 'Charlie Parker', '🎷', 'Charlie Parker', '1920–1955'),
  artist('thelonious-monk', 'Thelonious Monk', '🎹', 'Thelonious Monk', '1917–1982'),
  artist('louis-armstrong', 'Louis Armstrong', '🎺', 'Louis Armstrong', '1901–1971'),
  artist('ella-fitzgerald', 'Ella Fitzgerald', '🎤', 'Ella Fitzgerald', '1917–1996'),
  artist('billie-holiday', 'Billie Holiday', '🎤', 'Billie Holiday', '1915–1959'),
  artist('dave-brubeck', 'Dave Brubeck', '🎹', 'Dave Brubeck', '1920–2012'),
  artist('oscar-peterson', 'Oscar Peterson', '🎹', 'Oscar Peterson', '1925–2007'),
  artist('herbie-hancock', 'Herbie Hancock', '🎹', 'Herbie Hancock', '1940–'),
  artist('bill-evans', 'Bill Evans', '🎹', 'Bill Evans', '1929–1980'),
  artist('dizzy-gillespie', 'Dizzy Gillespie', '🎺', 'Dizzy Gillespie', '1917–1993'),
  artist('charles-mingus', 'Charles Mingus', '🎸', 'Charles Mingus', '1922–1979'),
  artist('art-blakey', 'Art Blakey', '🥁', 'Art Blakey', '1919–1990'),
  artist('chet-baker', 'Chet Baker', '🎺', 'Chet Baker', '1929–1988'),
  artist('stan-getz', 'Stan Getz', '🎷', 'Stan Getz', '1927–1991'),
  artist('nina-simone', 'Nina Simone', '🎤', 'Nina Simone', '1933–2003'),
  artist('count-basie', 'Count Basie', '🎹', 'Count Basie', '1904–1984'),
  artist('wes-montgomery', 'Wes Montgomery', '🎸', 'Wes Montgomery', '1923–1968'),
  artist('django-reinhardt', 'Django Reinhardt', '🎸', 'Django Reinhardt', '1910–1953'),
  artist('coleman-hawkins', 'Coleman Hawkins', '🎷', 'Coleman Hawkins', '1904–1969'),
  artist('sonny-rollins', 'Sonny Rollins', '🎷', 'Sonny Rollins', '1930–'),
  artist('wynton-marsalis', 'Wynton Marsalis', '🎺', 'Wynton Marsalis', '1961–'),
  artist('ornette-coleman', 'Ornette Coleman', '🎷', 'Ornette Coleman', '1930–2015'),
  artist('benny-goodman', 'Benny Goodman', '🎵', 'Benny Goodman', '1909–1986'),
  artist('sarah-vaughan', 'Sarah Vaughan', '🎤', 'Sarah Vaughan', '1924–1990'),
  artist('cannonball-adderley', 'Cannonball Adderley', '🎷', 'Cannonball Adderley', '1928–1975'),
  artist('dexter-gordon', 'Dexter Gordon', '🎷', 'Dexter Gordon', '1923–1990'),
  artist('mccoy-tyner', 'McCoy Tyner', '🎹', 'McCoy Tyner', '1938–2020'),
  artist('chick-corea', 'Chick Corea', '🎹', 'Chick Corea', '1941–2021'),
  artist('pat-metheny', 'Pat Metheny', '🎸', 'Pat Metheny', '1954–'),
  artist('keith-jarrett', 'Keith Jarrett', '🎹', 'Keith Jarrett', '1945–'),
  artist('wayne-shorter', 'Wayne Shorter', '🎷', 'Wayne Shorter', '1933–2023'),
  artist('max-roach', 'Max Roach', '🥁', 'Max Roach', '1924–2007'),
  artist('pharoah-sanders', 'Pharoah Sanders', '🎷', 'Pharoah Sanders', '1940–2022'),
]

export const STYLES: JazzCategory[] = [
  jazzTag('bebop', 'Bebop', '⚡', 'bebop'),
  jazzTag('swing', 'Swing', '💃', 'swing'),
  jazzTag('cool', 'Cool Jazz', '❄️', 'cool', 'cool jazz'),
  jazzTag('fusion', 'Fusion', '🔥', 'fusion', 'jazz fusion'),
  jazzTag('latin', 'Latin Jazz', '💃', 'latin', 'latin jazz'),
  jazzTag('smooth', 'Smooth Jazz', '🌊', 'smooth', 'smooth jazz'),
  jazzTag('free', 'Free Jazz', '🌀', 'experimental', 'free jazz'),
  jazzTag('big-band', 'Big Band', '🎺', 'bigband', 'big band'),
  jazzTag('bossa', 'Bossa Nova', '🌴', 'bossanova', 'bossa nova'),
  jazzTag('dixieland', 'Dixieland', '🎭', 'dixieland'),
  jazzTag('gypsy', 'Gypsy Jazz', '🎸', 'gypsy', 'gypsy jazz'),
  jazzTag('modal', 'Modal Jazz', '🎵', 'modal', 'modal jazz'),
]

export const INSTRUMENTS: JazzCategory[] = [
  jazzTag('saxophone', 'Saxophone', '🎷', 'saxophone'),
  jazzTag('trumpet', 'Trumpet', '🎺', 'trumpet'),
  jazzTag('piano', 'Piano', '🎹', 'piano'),
  jazzTag('guitar', 'Guitar', '🎸', 'guitar'),
  jazzTag('bass', 'Bass', '🎸', 'bass', 'double bass'),
  jazzTag('drums', 'Drums', '🥁', 'drums'),
  jazzTag('vocals', 'Vocals', '🎤', 'vocal'),
  jazzTag('organ', 'Organ', '🎹', 'organ'),
  jazzTag('vibraphone', 'Vibraphone', '🎵', 'vibraphone'),
  jazzTag('clarinet', 'Clarinet', '🎵', 'clarinet'),
]

export const MOODS: JazzCategory[] = [
  jazzTag('chill', 'Chill', '😌', 'chill', 'relaxing jazz'),
  jazzTag('upbeat', 'Upbeat', '🔥', 'energetic', 'upbeat jazz'),
  jazzTag('romantic', 'Romantic', '❤️', 'romantic', 'romantic jazz'),
  jazzTag('melancholy', 'Melancholy', '🌧️', 'sad', 'melancholy jazz'),
  jazzTag('late-night', 'Late Night', '🌙', 'lounge', 'late night jazz'),
  jazzTag('rainy-day', 'Rainy Day', '☔', 'ambient', 'rainy day'),
  jazzTag('cocktail', 'Cocktail Hour', '🍸', 'lounge', 'cocktail jazz'),
  jazzTag('study', 'Study / Focus', '📚', 'ambient', 'study jazz'),
]

export const ERAS: JazzCategory[] = [
  jazzTag('early', 'Early Jazz (1900s–20s)', '📻', 'dixieland', 'early jazz'),
  jazzTag('swing-era', 'Swing Era (1930s–40s)', '💃', 'swing', 'swing era'),
  jazzTag('bebop-era', 'Bebop (1940s–50s)', '⚡', 'bebop', 'bebop'),
  jazzTag('hard-bop', 'Hard Bop (1950s–60s)', '🔥', 'hardbop', 'hard bop'),
  jazzTag('modal-era', 'Modal (1960s)', '🎵', 'modal', 'modal jazz'),
  jazzTag('fusion-era', 'Fusion (1970s–80s)', '🎸', 'fusion', 'jazz fusion'),
  jazzTag('contemporary', 'Contemporary', '🔷', 'contemporary', 'contemporary jazz'),
]

// ===== Data fetching =====

export async function getJazzTracks(category: JazzCategory, limit = 50, onMore?: (tracks: Track[]) => void): Promise<Track[]> {
  const isArtistSearch = !!category.jamendoSearch && !!category.years

  if (isArtistSearch) {
    // For specific artists: IA has real recordings of famous jazz artists
    const [jamendo, ia] = await Promise.all([
      advancedSearch({ tags: category.jamendoTags, search: category.jamendoSearch }, limit),
      searchIA(category.iaQuery, 20),
    ])
    const artistLower = (category.jamendoSearch || '').toLowerCase()
    const verifiedIA = ia.filter(t =>
      lower(t.artist).includes(artistLower) ||
      lower(t.title).includes(artistLower) ||
      lower(t.album).includes(artistLower)
    )
    return [...jamendo, ...(verifiedIA.length > 0 ? verifiedIA : ia)].slice(0, limit)
  }

  // For style/mood/instrument: Jamendo first
  const jamendo = await advancedSearch({ tags: category.jamendoTags, search: category.jamendoSearch }, limit)
  if (onMore) {
    searchIA(category.iaQuery, 20).then(ia => {
      if (ia.length > 0) onMore([...jamendo, ...ia])
    })
  }
  return jamendo
}

export async function getJazzRadio(limit = 10): Promise<RadioStation[]> {
  return getStationsByGenre('jazz', limit)
}

export async function searchJazz(query: string, limit = 20): Promise<Track[]> {
  const [jamendo, ia] = await Promise.all([
    advancedSearch({ search: query, tags: 'jazz' }, limit),
    searchIA(`(${query}) subject:jazz mediatype:audio`, Math.min(limit, 8)),
  ])
  return [...jamendo, ...ia].slice(0, limit)
}
