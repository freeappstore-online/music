export type PopArtist = {
  id: string
  label: string
  icon: string
  image?: string
  years?: string
}

const PORTRAITS: Record<string, string> = {
  'elvis-presley': 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Elvis_Presley_promoting_Jailhouse_Rock.jpg/330px-Elvis_Presley_promoting_Jailhouse_Rock.jpg',
  'michael-jackson': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Michael_Jackson_in_1988.jpg/330px-Michael_Jackson_in_1988.jpg',
  'madonna': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Madonna_à_Nice_4.jpg/330px-Madonna_à_Nice_4.jpg',
  'prince': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Prince_at_Coachella_%28cropped%29.jpg/330px-Prince_at_Coachella_%28cropped%29.jpg',
  'whitney-houston': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/11/Whitney_Houston_Welcome_Home_Heroes_1.jpg/330px-Whitney_Houston_Welcome_Home_Heroes_1.jpg',
  'david-bowie': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/David-Bowie_Chicago_2002-08-08_photoby_Adam-Bielawski-cropped.jpg/330px-David-Bowie_Chicago_2002-08-08_photoby_Adam-Bielawski-cropped.jpg',
  'stevie-wonder': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/54/Stevie_Wonder_1973.jpg/330px-Stevie_Wonder_1973.jpg',
  'aretha-franklin': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Aretha_Franklin_1968.jpg/330px-Aretha_Franklin_1968.jpg',
  'elton-john': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Elton_John_2011_Shankbone_2_%28cropped%29.JPG/330px-Elton_John_2011_Shankbone_2_%28cropped%29.JPG',
  'freddie-mercury': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Freddie_Mercury_performing_in_New_Haven%2C_CT%2C_November_1977.jpg/330px-Freddie_Mercury_performing_in_New_Haven%2C_CT%2C_November_1977.jpg',
  'bob-marley': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Bob-Marley.jpg/330px-Bob-Marley.jpg',
  'ray-charles': 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Ray_Charles_classic_piano_pose.jpg/330px-Ray_Charles_classic_piano_pose.jpg',
  'frank-sinatra': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/af/Frank_Sinatra_%2757.jpg/330px-Frank_Sinatra_%2757.jpg',
  'amy-winehouse': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Amy_Winehouse_f4962007_crop.jpg/330px-Amy_Winehouse_f4962007_crop.jpg',
  'marvin-gaye': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Marvin_Gaye_in_1973.jpg/330px-Marvin_Gaye_in_1973.jpg',
  'james-brown': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/James_Brown_Live_Hamburg_1973_1702730029.jpg/330px-James_Brown_Live_Hamburg_1973_1702730029.jpg',
  'tina-turner': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Tina_Turner_-_Arnhem_-_5.jpg/330px-Tina_Turner_-_Arnhem_-_5.jpg',
  'otis-redding': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Otis_Redding_1967.jpg/330px-Otis_Redding_1967.jpg',
  'sam-cooke': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Sam_Cooke.png/330px-Sam_Cooke.png',
  'nat-king-cole': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Nat_King_Cole_1959.jpg/330px-Nat_King_Cole_1959.jpg',
}

function artist(id: string, label: string, icon: string, years: string): PopArtist {
  return { id, label, icon, image: PORTRAITS[id], years }
}

export const ARTISTS: PopArtist[] = [
  artist('elvis-presley', 'Elvis Presley', '🎤', '1935–1977'),
  artist('michael-jackson', 'Michael Jackson', '🕺', '1958–2009'),
  artist('madonna', 'Madonna', '👑', '1958–'),
  artist('prince', 'Prince', '💜', '1958–2016'),
  artist('whitney-houston', 'Whitney Houston', '🎤', '1963–2012'),
  artist('david-bowie', 'David Bowie', '⚡', '1947–2016'),
  artist('stevie-wonder', 'Stevie Wonder', '🎹', '1950–'),
  artist('aretha-franklin', 'Aretha Franklin', '👑', '1942–2018'),
  artist('elton-john', 'Elton John', '🎹', '1947–'),
  artist('freddie-mercury', 'Freddie Mercury', '🎤', '1946–1991'),
  artist('bob-marley', 'Bob Marley', '🌴', '1945–1981'),
  artist('ray-charles', 'Ray Charles', '🎹', '1930–2004'),
  artist('frank-sinatra', 'Frank Sinatra', '🎤', '1915–1998'),
  artist('amy-winehouse', 'Amy Winehouse', '🎤', '1983–2011'),
  artist('marvin-gaye', 'Marvin Gaye', '💜', '1939–1984'),
  artist('james-brown', 'James Brown', '🕺', '1933–2006'),
  artist('tina-turner', 'Tina Turner', '🎤', '1939–2023'),
  artist('otis-redding', 'Otis Redding', '🎤', '1941–1967'),
  artist('sam-cooke', 'Sam Cooke', '🎤', '1931–1964'),
  artist('nat-king-cole', 'Nat King Cole', '🎹', '1919–1965'),
]

export const ERAS: PopArtist[] = [
  { id: '1950s', label: '1950s', icon: '🎸' },
  { id: '1960s', label: '1960s', icon: '☮️' },
  { id: '1970s', label: '1970s', icon: '🕺' },
  { id: '1980s', label: '1980s', icon: '📼' },
  { id: '1990s', label: '1990s', icon: '💿' },
  { id: '2000s', label: '2000s', icon: '💻' },
]

export const SUBGENRES: PopArtist[] = [
  { id: 'pop-rock', label: 'Pop Rock', icon: '🎸' },
  { id: 'soul', label: 'Soul', icon: '💜' },
  { id: 'rnb', label: 'R&B', icon: '🎶' },
  { id: 'disco', label: 'Disco', icon: '🪩' },
  { id: 'synth-pop', label: 'Synth Pop', icon: '🎹' },
  { id: 'motown', label: 'Motown', icon: '🎤' },
  { id: 'funk', label: 'Funk', icon: '🎵' },
  { id: 'reggae', label: 'Reggae', icon: '🌴' },
]
