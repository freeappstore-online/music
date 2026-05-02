import { advancedSearch } from './jamendo'
import { searchTracks as searchIA } from './archive'
import type { Track } from '../types'

export type JazzWorkType = 'album' | 'standard' | 'composition'

export type JazzWork = {
  title: string
  artist: string
  artistId: string
  year: number
  type: JazzWorkType
  searchQuery: string
}

export const JAZZ_WORK_TYPES: { id: JazzWorkType | 'all'; label: string; icon: string }[] = [
  { id: 'all', label: 'All', icon: '🎵' },
  { id: 'album', label: 'Albums', icon: '💿' },
  { id: 'standard', label: 'Standards', icon: '🎶' },
  { id: 'composition', label: 'Compositions', icon: '📝' },
]

export const JAZZ_WORKS = [
  // Landmark albums
  { title: 'Kind of Blue', artist: 'Miles Davis', artistId: 'miles-davis', year: 1959, type: 'album', searchQuery: 'kind of blue miles davis' },
  { title: 'A Love Supreme', artist: 'John Coltrane', artistId: 'john-coltrane', year: 1965, type: 'album', searchQuery: 'love supreme coltrane' },
  { title: 'Time Out', artist: 'Dave Brubeck', artistId: 'dave-brubeck', year: 1959, type: 'album', searchQuery: 'time out brubeck' },
  { title: 'Blue Train', artist: 'John Coltrane', artistId: 'john-coltrane', year: 1958, type: 'album', searchQuery: 'blue train coltrane' },
  { title: 'Bitches Brew', artist: 'Miles Davis', artistId: 'miles-davis', year: 1970, type: 'album', searchQuery: 'bitches brew miles davis' },
  { title: 'Mingus Ah Um', artist: 'Charles Mingus', artistId: 'charles-mingus', year: 1959, type: 'album', searchQuery: 'mingus ah um' },
  { title: 'Moanin\'', artist: 'Art Blakey', artistId: 'art-blakey', year: 1958, type: 'album', searchQuery: 'moanin art blakey' },
  { title: 'Head Hunters', artist: 'Herbie Hancock', artistId: 'herbie-hancock', year: 1973, type: 'album', searchQuery: 'head hunters hancock' },
  { title: 'The Köln Concert', artist: 'Keith Jarrett', artistId: 'keith-jarrett', year: 1975, type: 'album', searchQuery: 'koln concert jarrett' },
  { title: 'Saxophone Colossus', artist: 'Sonny Rollins', artistId: 'sonny-rollins', year: 1956, type: 'album', searchQuery: 'saxophone colossus rollins' },
  { title: 'Ella and Louis', artist: 'Ella Fitzgerald', artistId: 'ella-fitzgerald', year: 1956, type: 'album', searchQuery: 'ella louis armstrong' },
  { title: 'Getz/Gilberto', artist: 'Stan Getz', artistId: 'stan-getz', year: 1964, type: 'album', searchQuery: 'getz gilberto' },
  { title: 'Speak No Evil', artist: 'Wayne Shorter', artistId: 'wayne-shorter', year: 1966, type: 'album', searchQuery: 'speak no evil shorter' },

  // Jazz standards
  { title: 'Take Five', artist: 'Dave Brubeck', artistId: 'dave-brubeck', year: 1959, type: 'standard', searchQuery: 'take five brubeck' },
  { title: 'So What', artist: 'Miles Davis', artistId: 'miles-davis', year: 1959, type: 'standard', searchQuery: 'so what miles davis' },
  { title: 'Round Midnight', artist: 'Thelonious Monk', artistId: 'thelonious-monk', year: 1944, type: 'standard', searchQuery: 'round midnight monk' },
  { title: 'My Favorite Things', artist: 'John Coltrane', artistId: 'john-coltrane', year: 1961, type: 'standard', searchQuery: 'my favorite things coltrane' },
  { title: 'Summertime', artist: 'Various', artistId: 'ella-fitzgerald', year: 1935, type: 'standard', searchQuery: 'summertime jazz gershwin' },
  { title: 'Autumn Leaves', artist: 'Various', artistId: 'bill-evans', year: 1945, type: 'standard', searchQuery: 'autumn leaves jazz' },
  { title: 'All Blues', artist: 'Miles Davis', artistId: 'miles-davis', year: 1959, type: 'standard', searchQuery: 'all blues miles davis' },
  { title: 'Blue in Green', artist: 'Miles Davis', artistId: 'miles-davis', year: 1959, type: 'standard', searchQuery: 'blue in green miles davis' },
  { title: 'Giant Steps', artist: 'John Coltrane', artistId: 'john-coltrane', year: 1960, type: 'standard', searchQuery: 'giant steps coltrane' },
  { title: 'Sing Sing Sing', artist: 'Benny Goodman', artistId: 'benny-goodman', year: 1937, type: 'standard', searchQuery: 'sing sing sing goodman' },
  { title: 'Strange Fruit', artist: 'Billie Holiday', artistId: 'billie-holiday', year: 1939, type: 'standard', searchQuery: 'strange fruit billie holiday' },
  { title: 'The Girl from Ipanema', artist: 'Stan Getz', artistId: 'stan-getz', year: 1964, type: 'standard', searchQuery: 'girl from ipanema' },
  { title: 'What a Wonderful World', artist: 'Louis Armstrong', artistId: 'louis-armstrong', year: 1967, type: 'standard', searchQuery: 'wonderful world armstrong' },

  // Compositions
  { title: 'In a Sentimental Mood', artist: 'Duke Ellington', artistId: 'duke-ellington', year: 1935, type: 'composition', searchQuery: 'sentimental mood ellington' },
  { title: 'Take the A Train', artist: 'Duke Ellington', artistId: 'duke-ellington', year: 1941, type: 'composition', searchQuery: 'take a train ellington' },
  { title: 'Goodbye Pork Pie Hat', artist: 'Charles Mingus', artistId: 'charles-mingus', year: 1959, type: 'composition', searchQuery: 'goodbye pork pie hat mingus' },
  { title: 'Watermelon Man', artist: 'Herbie Hancock', artistId: 'herbie-hancock', year: 1962, type: 'composition', searchQuery: 'watermelon man hancock' },
  { title: 'Naima', artist: 'John Coltrane', artistId: 'john-coltrane', year: 1960, type: 'composition', searchQuery: 'naima coltrane' },
].sort((a, b) => a.year - b.year) as JazzWork[]

export async function searchJazzWork(work: JazzWork, limit = 15): Promise<Track[]> {
  const [jamendo, ia] = await Promise.all([
    advancedSearch({ search: `${work.artist} ${work.searchQuery}`, tags: 'jazz' }, limit),
    searchIA(`"${work.searchQuery}" subject:jazz mediatype:audio`, 10),
  ])
  return [...jamendo, ...ia].slice(0, limit)
}
