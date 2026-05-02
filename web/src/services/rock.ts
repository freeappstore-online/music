export type RockArtist = {
  id: string
  label: string
  icon: string
  image?: string
  years?: string
}

const PORTRAITS: Record<string, string> = {
  'the-beatles': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/The_Fabs.JPG/330px-The_Fabs.JPG',
  'led-zeppelin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Led_Zeppelin%2C_1973_%28cropped%29.jpg/330px-Led_Zeppelin%2C_1973_%28cropped%29.jpg',
  'pink-floyd': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Pink_Floyd_-_all_members.jpg/330px-Pink_Floyd_-_all_members.jpg',
  'rolling-stones': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/The_Rolling_Stones_in_2024.jpg/330px-The_Rolling_Stones_in_2024.jpg',
  'jimi-hendrix': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Jimi_Hendrix_1967.png/330px-Jimi_Hendrix_1967.png',
  'queen': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/Queen_1976.jpg/330px-Queen_1976.jpg',
  'the-who': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Who_-_Lyon_-_2007_-_01.jpg/330px-Who_-_Lyon_-_2007_-_01.jpg',
  'acdc': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/ACDC_In_Tacoma_2009.jpg/330px-ACDC_In_Tacoma_2009.jpg',
  'nirvana': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Nirvana_around_1992.jpg/330px-Nirvana_around_1992.jpg',
  'the-doors': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/The_Doors_1968.JPG/330px-The_Doors_1968.JPG',
  'black-sabbath': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Black_Sabbath_%281970%29.png/330px-Black_Sabbath_%281970%29.png',
  'radiohead': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Radiohead.jpg/330px-Radiohead.jpg',
  'the-clash': 'https://upload.wikimedia.org/wikipedia/en/e/e5/The_Clash_-_London_Calling.jpg',
  'fleetwood-mac': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Fleetwood_Mac_%281977%29.jpg/330px-Fleetwood_Mac_%281977%29.jpg',
  'eagles': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dc/Eagles_%28band%29.jpg/330px-Eagles_%28band%29.jpg',
  'cream': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Cream_on_Fanclub_1968.png/330px-Cream_on_Fanclub_1968.png',
  'velvet-underground': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Velvet_Underground_%26_Nico_1966.jpg/330px-Velvet_Underground_%26_Nico_1966.jpg',
  'grateful-dead': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Grateful_Dead_at_the_Warfield-1980.jpg/330px-Grateful_Dead_at_the_Warfield-1980.jpg',
  'deep-purple': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Deep_Purple_in_2004.jpg/330px-Deep_Purple_in_2004.jpg',
  'talking-heads': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Talking_Heads_-_once_in_a_lifetime.jpg/330px-Talking_Heads_-_once_in_a_lifetime.jpg',
}

function artist(id: string, label: string, icon: string, years: string): RockArtist {
  return { id, label, icon, image: PORTRAITS[id], years }
}

export const ARTISTS: RockArtist[] = [
  artist('the-beatles', 'The Beatles', '🎸', '1960–1970'),
  artist('led-zeppelin', 'Led Zeppelin', '🎸', '1968–1980'),
  artist('pink-floyd', 'Pink Floyd', '🌈', '1965–1995'),
  artist('rolling-stones', 'The Rolling Stones', '🎸', '1962–'),
  artist('jimi-hendrix', 'Jimi Hendrix', '🎸', '1942–1970'),
  artist('queen', 'Queen', '👑', '1970–'),
  artist('the-who', 'The Who', '🎸', '1964–'),
  artist('acdc', 'AC/DC', '⚡', '1973–'),
  artist('nirvana', 'Nirvana', '🎸', '1987–1994'),
  artist('the-doors', 'The Doors', '🚪', '1965–1973'),
  artist('black-sabbath', 'Black Sabbath', '🤘', '1968–2017'),
  artist('radiohead', 'Radiohead', '📻', '1985–'),
  artist('the-clash', 'The Clash', '⚡', '1976–1986'),
  artist('fleetwood-mac', 'Fleetwood Mac', '🎸', '1967–'),
  artist('eagles', 'Eagles', '🦅', '1971–'),
  artist('cream', 'Cream', '🎸', '1966–1968'),
  artist('velvet-underground', 'The Velvet Underground', '🎸', '1964–1973'),
  artist('grateful-dead', 'Grateful Dead', '💀', '1965–1995'),
  artist('deep-purple', 'Deep Purple', '🎸', '1968–'),
  artist('talking-heads', 'Talking Heads', '🎸', '1975–1991'),
]

export const ERAS: RockArtist[] = [
  { id: '1950s', label: '1950s Rock & Roll', icon: '🎸' },
  { id: '1960s', label: '1960s British Invasion', icon: '🇬🇧' },
  { id: '1970s', label: '1970s Classic Rock', icon: '🤘' },
  { id: '1980s', label: '1980s Arena Rock', icon: '🏟️' },
  { id: '1990s', label: '1990s Alternative', icon: '📻' },
  { id: '2000s', label: '2000s Indie Rock', icon: '🎵' },
]

export const SUBGENRES: RockArtist[] = [
  { id: 'classic-rock', label: 'Classic Rock', icon: '🎸' },
  { id: 'hard-rock', label: 'Hard Rock', icon: '🔥' },
  { id: 'progressive', label: 'Progressive', icon: '🌀' },
  { id: 'punk', label: 'Punk', icon: '⚡' },
  { id: 'alternative', label: 'Alternative', icon: '📻' },
  { id: 'psychedelic', label: 'Psychedelic', icon: '🌈' },
  { id: 'grunge', label: 'Grunge', icon: '🔊' },
  { id: 'metal', label: 'Heavy Metal', icon: '🤘' },
]
