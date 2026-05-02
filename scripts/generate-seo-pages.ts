import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const OUT = join(__dirname, '../web/public')

// ===== Data (extracted from services) =====

type Artist = { id: string; name: string; fullName: string; years: string; genre: string; image?: string; bio: string }
type Work = { slug: string; title: string; composer: string; year: number; type: string; description: string }

const ARTISTS: Artist[] = [
  // Classical
  { id: 'bach', name: 'Bach', fullName: 'Johann Sebastian Bach', years: '1685–1750', genre: 'Classical', bio: 'German composer and musician of the Baroque period. Known for the Brandenburg Concertos, Mass in B minor, The Well-Tempered Clavier, and numerous cantatas, chorales, and organ works.' },
  { id: 'mozart', name: 'Mozart', fullName: 'Wolfgang Amadeus Mozart', years: '1756–1791', genre: 'Classical', bio: 'Austrian composer of the Classical period. A prolific and influential composer of over 800 works including symphonies, concertos, operas (The Magic Flute, Don Giovanni), and the Requiem.' },
  { id: 'beethoven', name: 'Beethoven', fullName: 'Ludwig van Beethoven', years: '1770–1827', genre: 'Classical', bio: 'German composer who bridged the Classical and Romantic periods. His works include 9 symphonies, 5 piano concertos, the Moonlight Sonata, and Für Elise. He continued composing despite losing his hearing.' },
  { id: 'chopin', name: 'Chopin', fullName: 'Frédéric Chopin', years: '1810–1849', genre: 'Classical', bio: 'Polish composer and pianist of the Romantic era, known primarily for solo piano works. His output includes nocturnes, études, preludes, waltzes, mazurkas, and polonaises.' },
  { id: 'vivaldi', name: 'Vivaldi', fullName: 'Antonio Vivaldi', years: '1678–1741', genre: 'Classical', bio: 'Italian Baroque composer, known for The Four Seasons, one of the most popular pieces of Baroque music. He composed over 500 concertos and 46 operas.' },
  { id: 'tchaikovsky', name: 'Tchaikovsky', fullName: 'Pyotr Ilyich Tchaikovsky', years: '1840–1893', genre: 'Classical', bio: 'Russian Romantic composer known for Swan Lake, The Nutcracker, Sleeping Beauty, the 1812 Overture, and six symphonies. His music is known for its emotional depth.' },
  // Jazz
  { id: 'miles-davis', name: 'Miles Davis', fullName: 'Miles Davis', years: '1926–1991', genre: 'Jazz', bio: 'American trumpeter and bandleader who shaped the course of modern jazz. His album Kind of Blue is the best-selling jazz album of all time. He pioneered cool jazz, hard bop, modal jazz, and jazz fusion.' },
  { id: 'john-coltrane', name: 'John Coltrane', fullName: 'John Coltrane', years: '1926–1967', genre: 'Jazz', bio: 'American saxophonist whose work pushed the boundaries of jazz. A Love Supreme is considered one of the greatest jazz recordings. His innovations influenced generations of musicians.' },
  { id: 'duke-ellington', name: 'Duke Ellington', fullName: 'Duke Ellington', years: '1899–1974', genre: 'Jazz', bio: 'American composer, pianist, and bandleader who led his orchestra for over 50 years. He composed thousands of songs including Take the A Train and In a Sentimental Mood.' },
  { id: 'louis-armstrong', name: 'Louis Armstrong', fullName: 'Louis Armstrong', years: '1901–1971', genre: 'Jazz', bio: 'American trumpeter and vocalist who was one of the most influential figures in jazz. Known for What a Wonderful World and his virtuosic trumpet playing that transformed jazz from ensemble music to a soloist\'s art.' },
  { id: 'ella-fitzgerald', name: 'Ella Fitzgerald', fullName: 'Ella Fitzgerald', years: '1917–1996', genre: 'Jazz', bio: 'The "First Lady of Song" and "Queen of Jazz." Known for her vocal range, purity of tone, and legendary scat singing. She recorded over 200 albums and won 13 Grammy Awards.' },
  // Blues
  { id: 'robert-johnson', name: 'Robert Johnson', fullName: 'Robert Johnson', years: '1911–1938', genre: 'Blues', bio: 'American blues musician who is considered one of the most influential musicians of all time. His recordings from 1936-37, including Cross Road Blues and Hellhound on My Trail, became foundational to modern blues and rock.' },
  { id: 'bb-king', name: 'B.B. King', fullName: 'B.B. King', years: '1925–2015', genre: 'Blues', bio: 'The "King of the Blues." American blues guitarist and singer-songwriter known for his expressive guitar playing with his guitar "Lucille." His influence spans blues, rock, and soul music.' },
  { id: 'muddy-waters', name: 'Muddy Waters', fullName: 'Muddy Waters', years: '1913–1983', genre: 'Blues', bio: 'Father of modern Chicago blues. His electric blues style directly influenced the development of rock and roll. Known for Hoochie Coochie Man and Rollin\' Stone (which inspired the band\'s name).' },
]

const WORKS: Work[] = [
  { slug: 'moonlight-sonata', title: 'Moonlight Sonata', composer: 'Ludwig van Beethoven', year: 1801, type: 'Sonata', description: 'Piano Sonata No. 14 in C-sharp minor, one of the most famous piano compositions ever written. The nickname "Moonlight" was given by music critic Ludwig Rellstab.' },
  { slug: 'four-seasons', title: 'The Four Seasons', composer: 'Antonio Vivaldi', year: 1725, type: 'Concerto', description: 'A group of four violin concertos, each giving musical expression to a season of the year. One of the most popular pieces of Baroque music ever composed.' },
  { slug: 'symphony-no-5', title: 'Symphony No. 5', composer: 'Ludwig van Beethoven', year: 1808, type: 'Symphony', description: 'One of the most recognized compositions in classical music. The famous four-note opening motif (da-da-da-DUM) represents "fate knocking at the door."' },
  { slug: 'swan-lake', title: 'Swan Lake', composer: 'Pyotr Ilyich Tchaikovsky', year: 1877, type: 'Ballet', description: 'A ballet composed in 1875-76, now one of the most popular of all ballets. It tells the story of Odette, a princess turned into a swan by an evil sorcerer.' },
  { slug: 'kind-of-blue', title: 'Kind of Blue', composer: 'Miles Davis', year: 1959, type: 'Album', description: 'The best-selling jazz album of all time. It pioneered modal jazz and features legendary musicians including John Coltrane, Cannonball Adderley, and Bill Evans.' },
  { slug: 'nutcracker', title: 'The Nutcracker', composer: 'Pyotr Ilyich Tchaikovsky', year: 1892, type: 'Ballet', description: 'A two-act ballet featuring the famous Dance of the Sugar Plum Fairy. It has become one of the most performed ballets in the world, especially during the Christmas season.' },
  { slug: 'magic-flute', title: 'The Magic Flute', composer: 'Wolfgang Amadeus Mozart', year: 1791, type: 'Opera', description: 'Mozart\'s last opera, a singspiel combining comedy, fantasy, and Masonic symbolism. Features the iconic Queen of the Night aria.' },
  { slug: 'messiah', title: 'Messiah', composer: 'George Frideric Handel', year: 1741, type: 'Oratorio', description: 'An English-language oratorio featuring the famous "Hallelujah" chorus. One of the most performed choral works in Western music.' },
]

// ===== HTML Template =====

function artistPage(a: Artist): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${a.fullName} — Free ${a.genre} Music | FreeMusic</title>
  <meta name="description" content="Listen to ${a.fullName} (${a.years}) for free. ${a.bio.slice(0, 150)}">
  <meta property="og:title" content="${a.fullName} — Free ${a.genre} Music">
  <meta property="og:description" content="${a.bio.slice(0, 200)}">
  <meta name="theme-color" content="#111113">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#111113;color:#f0f0f2;font-family:'Inter',system-ui,sans-serif;line-height:1.7;-webkit-font-smoothing:antialiased}
    .c{max-width:680px;margin:0 auto;padding:48px 24px 80px}
    a{color:#6ECE9E}
    h1{font-family:'DM Serif Display',serif;font-size:36px;font-weight:700;margin-bottom:4px}
    .sub{color:#9090a0;font-size:15px;margin-bottom:32px}
    h2{font-size:20px;font-weight:600;margin:32px 0 12px}
    p{font-size:16px;color:#c0c0cc;margin-bottom:16px}
    .back{display:inline-flex;align-items:center;gap:6px;color:#6ECE9E;text-decoration:none;font-size:14px;font-weight:500;margin-bottom:32px}
    .back:hover{text-decoration:underline}
    .cta{display:inline-flex;align-items:center;gap:8px;background:#6ECE9E;color:#111113;padding:12px 24px;border-radius:12px;font-weight:600;font-size:15px;text-decoration:none;margin-top:16px}
    .cta:hover{background:#5cb888}
    .badge{display:inline-block;padding:4px 12px;border-radius:99px;font-size:12px;font-weight:600;background:#6ECE9E20;color:#6ECE9E;margin-bottom:16px}
  </style>
</head>
<body>
<div class="c">
  <a href="/" class="back">&larr; Back to FreeMusic</a>
  <div class="badge">${a.genre}</div>
  <h1>${a.fullName}</h1>
  <p class="sub">${a.years}</p>
  <p>${a.bio}</p>
  <h2>Listen Free</h2>
  <p>Stream ${a.name}'s music for free on FreeMusic. No ads, no subscription, no account required.</p>
  <a href="/" class="cta">
    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/></svg>
    Play ${a.name} on FreeMusic
  </a>
  <h2>About FreeMusic</h2>
  <p>FreeMusic aggregates Creative Commons and public domain music from Jamendo, Internet Archive, and Radio Browser. All music is free to listen to, forever.</p>
  <p style="margin-top:32px;font-size:12px;color:#60606e">
    <a href="/legal/privacy.html">Privacy</a> · <a href="/legal/terms.html">Terms</a> · <a href="https://github.com/FreeMusicApp/freemusic">GitHub</a>
  </p>
</div>
</body>
</html>`
}

function workPage(w: Work): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${w.title} by ${w.composer} — Free Classical Music | FreeMusic</title>
  <meta name="description" content="Listen to ${w.title} by ${w.composer} (${w.year}) for free. ${w.description.slice(0, 150)}">
  <meta property="og:title" content="${w.title} — ${w.composer}">
  <meta property="og:description" content="${w.description.slice(0, 200)}">
  <meta name="theme-color" content="#111113">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#111113;color:#f0f0f2;font-family:'Inter',system-ui,sans-serif;line-height:1.7;-webkit-font-smoothing:antialiased}
    .c{max-width:680px;margin:0 auto;padding:48px 24px 80px}
    a{color:#6ECE9E}
    h1{font-family:'DM Serif Display',serif;font-size:32px;font-weight:700;margin-bottom:4px;font-style:italic}
    .sub{color:#9090a0;font-size:15px;margin-bottom:32px}
    h2{font-size:20px;font-weight:600;margin:32px 0 12px}
    p{font-size:16px;color:#c0c0cc;margin-bottom:16px}
    .back{display:inline-flex;align-items:center;gap:6px;color:#6ECE9E;text-decoration:none;font-size:14px;font-weight:500;margin-bottom:32px}
    .back:hover{text-decoration:underline}
    .cta{display:inline-flex;align-items:center;gap:8px;background:#6ECE9E;color:#111113;padding:12px 24px;border-radius:12px;font-weight:600;font-size:15px;text-decoration:none;margin-top:16px}
    .cta:hover{background:#5cb888}
    .badge{display:inline-block;padding:4px 12px;border-radius:99px;font-size:12px;font-weight:600;background:#6ECE9E20;color:#6ECE9E;margin-bottom:16px}
    .meta{display:flex;gap:16px;margin-bottom:24px;flex-wrap:wrap}
    .meta span{font-size:13px;color:#9090a0}
  </style>
</head>
<body>
<div class="c">
  <a href="/" class="back">&larr; Back to FreeMusic</a>
  <div class="badge">${w.type}</div>
  <h1>${w.title}</h1>
  <p class="sub">${w.composer}</p>
  <div class="meta">
    <span>Composed: ${w.year}</span>
    <span>Type: ${w.type}</span>
  </div>
  <p>${w.description}</p>
  <h2>Listen Free</h2>
  <p>Stream ${w.title} for free on FreeMusic. No ads, no subscription, no account required.</p>
  <a href="/" class="cta">
    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/></svg>
    Play on FreeMusic
  </a>
  <h2>About FreeMusic</h2>
  <p>FreeMusic aggregates Creative Commons and public domain music from Jamendo, Internet Archive, and Radio Browser. All music is free to listen to, forever.</p>
  <p style="margin-top:32px;font-size:12px;color:#60606e">
    <a href="/legal/privacy.html">Privacy</a> · <a href="/legal/terms.html">Terms</a> · <a href="https://github.com/FreeMusicApp/freemusic">GitHub</a>
  </p>
</div>
</body>
</html>`
}

// ===== Generate =====

mkdirSync(join(OUT, 'artist'), { recursive: true })
mkdirSync(join(OUT, 'work'), { recursive: true })

for (const a of ARTISTS) {
  writeFileSync(join(OUT, 'artist', `${a.id}.html`), artistPage(a))
}

for (const w of WORKS) {
  writeFileSync(join(OUT, 'work', `${w.slug}.html`), workPage(w))
}

console.log(`Generated ${ARTISTS.length} artist pages and ${WORKS.length} work pages`)
