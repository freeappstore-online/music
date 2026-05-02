import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'

const OUT = join(__dirname, '../web/public')

type Artist = { id: string; name: string; fullName: string; years: string; genre: string; bio: string }
type Work = { slug: string; title: string; composer: string; year: number; type: string; description: string }

const ARTISTS: Artist[] = [
  // Classical (44)
  { id: 'bach', name: 'Bach', fullName: 'Johann Sebastian Bach', years: '1685–1750', genre: 'Classical', bio: 'German composer and musician of the Baroque period. Known for the Brandenburg Concertos, Mass in B minor, The Well-Tempered Clavier, and numerous cantatas, chorales, and organ works. Widely regarded as one of the greatest composers in Western musical history.' },
  { id: 'mozart', name: 'Mozart', fullName: 'Wolfgang Amadeus Mozart', years: '1756–1791', genre: 'Classical', bio: 'Austrian composer of the Classical period. A child prodigy who composed over 800 works including symphonies, concertos, operas (The Magic Flute, Don Giovanni, The Marriage of Figaro), chamber music, and the unfinished Requiem.' },
  { id: 'beethoven', name: 'Beethoven', fullName: 'Ludwig van Beethoven', years: '1770–1827', genre: 'Classical', bio: 'German composer who bridged the Classical and Romantic periods. His works include 9 symphonies, 5 piano concertos, 32 piano sonatas including the Moonlight Sonata, and the iconic Für Elise. He continued composing masterworks despite progressive hearing loss.' },
  { id: 'chopin', name: 'Chopin', fullName: 'Frédéric Chopin', years: '1810–1849', genre: 'Classical', bio: 'Polish composer and virtuoso pianist of the Romantic era. Known primarily for solo piano works including nocturnes, études, preludes, waltzes, mazurkas, and polonaises. His poetic genius and technical innovation made him one of the great masters of Romantic music.' },
  { id: 'vivaldi', name: 'Vivaldi', fullName: 'Antonio Vivaldi', years: '1678–1741', genre: 'Classical', bio: 'Italian Baroque composer, virtuoso violinist, and priest. Best known for The Four Seasons, one of the most popular pieces of Baroque music. He composed over 500 concertos and 46 operas, and was hugely influential on later composers including Bach.' },
  { id: 'brahms', name: 'Brahms', fullName: 'Johannes Brahms', years: '1833–1897', genre: 'Classical', bio: 'German composer and pianist of the Romantic period. Known for four symphonies, the German Requiem, piano concertos, and chamber music. Often grouped with Bach and Beethoven as one of the "Three Bs" of classical music.' },
  { id: 'tchaikovsky', name: 'Tchaikovsky', fullName: 'Pyotr Ilyich Tchaikovsky', years: '1840–1893', genre: 'Classical', bio: 'Russian Romantic composer famous for Swan Lake, The Nutcracker, Sleeping Beauty, the 1812 Overture, and six symphonies. His music combines emotional depth with memorable melodies and brilliant orchestration.' },
  { id: 'debussy', name: 'Debussy', fullName: 'Claude Debussy', years: '1862–1918', genre: 'Classical', bio: 'French Impressionist composer whose innovations in harmony, rhythm, and orchestral color profoundly influenced 20th-century music. Known for Clair de Lune, La Mer, and Prélude à l\'après-midi d\'un faune.' },
  { id: 'schubert', name: 'Schubert', fullName: 'Franz Schubert', years: '1797–1828', genre: 'Classical', bio: 'Austrian composer who bridged the Classical and Romantic periods. Despite dying at 31, he composed over 600 songs (lieder), symphonies, chamber music, and piano works. His "Unfinished" Symphony and "Trout" Quintet remain beloved.' },
  { id: 'handel', name: 'Handel', fullName: 'George Frideric Handel', years: '1685–1759', genre: 'Classical', bio: 'German-born British Baroque composer known for operas, oratorios, and concerti grossi. His Messiah, featuring the famous "Hallelujah" chorus, is one of the most frequently performed choral works.' },
  { id: 'liszt', name: 'Liszt', fullName: 'Franz Liszt', years: '1811–1886', genre: 'Classical', bio: 'Hungarian Romantic composer and virtuoso pianist, considered one of the greatest pianists of all time. He invented the symphonic poem and influenced Wagner, Debussy, and later composers. Known for Hungarian Rhapsodies and Liebestraum.' },
  { id: 'ravel', name: 'Ravel', fullName: 'Maurice Ravel', years: '1875–1937', genre: 'Classical', bio: 'French composer known for his melodic and orchestral genius. His works include Boléro, Daphnis et Chloé, and the Piano Concerto in G major. Often associated with Impressionism alongside Debussy.' },
  { id: 'haydn', name: 'Haydn', fullName: 'Joseph Haydn', years: '1732–1809', genre: 'Classical', bio: 'Austrian composer known as the "Father of the Symphony" and "Father of the String Quartet." His innovations established the forms that would define the Classical period and influence Mozart and Beethoven.' },
  { id: 'mendelssohn', name: 'Mendelssohn', fullName: 'Felix Mendelssohn', years: '1809–1847', genre: 'Classical', bio: 'German Romantic composer known for the Violin Concerto in E minor, A Midsummer Night\'s Dream, and the "Italian" and "Scottish" Symphonies. He also revived interest in Bach\'s music.' },
  { id: 'dvorak', name: 'Dvořák', fullName: 'Antonín Dvořák', years: '1841–1904', genre: 'Classical', bio: 'Czech Romantic composer known for the "New World" Symphony, the Cello Concerto in B minor, and Slavonic Dances. His music blends classical forms with folk music traditions.' },
  { id: 'rachmaninoff', name: 'Rachmaninoff', fullName: 'Sergei Rachmaninoff', years: '1873–1943', genre: 'Classical', bio: 'Russian Romantic composer, pianist, and conductor. Known for his Piano Concertos No. 2 and 3, Rhapsody on a Theme of Paganini, and richly emotional orchestral style.' },
  { id: 'mahler', name: 'Mahler', fullName: 'Gustav Mahler', years: '1860–1911', genre: 'Classical', bio: 'Austrian late-Romantic composer and conductor. His ten symphonies and song cycles expanded the symphony to unprecedented emotional and philosophical depths.' },
  { id: 'shostakovich', name: 'Shostakovich', fullName: 'Dmitri Shostakovich', years: '1906–1975', genre: 'Classical', bio: 'Soviet-era Russian composer whose 15 symphonies and 15 string quartets chronicle the 20th century. His music ranges from the triumphant to the darkly satirical, often reflecting life under Soviet rule.' },
  { id: 'verdi', name: 'Verdi', fullName: 'Giuseppe Verdi', years: '1813–1901', genre: 'Classical', bio: 'Italian Romantic opera composer. His operas including La Traviata, Aida, Rigoletto, and Otello are cornerstones of the operatic repertoire.' },
  { id: 'puccini', name: 'Puccini', fullName: 'Giacomo Puccini', years: '1858–1924', genre: 'Classical', bio: 'Italian opera composer whose works La Bohème, Tosca, Madama Butterfly, and Turandot are among the most frequently performed operas worldwide.' },
  { id: 'wagner', name: 'Wagner', fullName: 'Richard Wagner', years: '1813–1883', genre: 'Classical', bio: 'German composer known for his operas, or "music dramas." The Ring Cycle, Tristan und Isolde, and Parsifal revolutionized opera with their scale, orchestration, and use of leitmotifs.' },
  { id: 'stravinsky', name: 'Stravinsky', fullName: 'Igor Stravinsky', years: '1882–1971', genre: 'Classical', bio: 'Russian-born composer whose The Rite of Spring caused a riot at its 1913 premiere and revolutionized modern music. His work spans neoclassicism, serialism, and Russian folk influences.' },
  { id: 'prokofiev', name: 'Prokofiev', fullName: 'Sergei Prokofiev', years: '1891–1953', genre: 'Classical', bio: 'Russian composer known for Peter and the Wolf, Romeo and Juliet ballet, and seven symphonies. His music combines modernist dissonance with lyrical melody.' },
  { id: 'grieg', name: 'Grieg', fullName: 'Edvard Grieg', years: '1843–1907', genre: 'Classical', bio: 'Norwegian Romantic composer best known for the Piano Concerto in A minor and Peer Gynt suite. He drew on Norwegian folk music to create a distinctive national style.' },
  { id: 'satie', name: 'Satie', fullName: 'Erik Satie', years: '1866–1925', genre: 'Classical', bio: 'French composer and pianist whose minimalist, sometimes absurdist works presaged ambient music and minimalism. Known for the Gymnopédies and Gnossiennes.' },
  { id: 'saint-saens', name: 'Saint-Saëns', fullName: 'Camille Saint-Saëns', years: '1835–1921', genre: 'Classical', bio: 'French Romantic composer known for The Carnival of the Animals, Danse Macabre, and the "Organ" Symphony. A child prodigy who remained prolific throughout his long career.' },
  { id: 'bizet', name: 'Bizet', fullName: 'Georges Bizet', years: '1838–1875', genre: 'Classical', bio: 'French Romantic composer best known for the opera Carmen, one of the most popular and frequently performed operas. He died at 36, just months after Carmen\'s controversial premiere.' },
  { id: 'holst', name: 'Holst', fullName: 'Gustav Holst', years: '1874–1934', genre: 'Classical', bio: 'English composer best known for the orchestral suite The Planets, whose seven movements represent the astrological character of each planet. Mars, the Bringer of War influenced film music.' },
  // Jazz (37)
  { id: 'miles-davis', name: 'Miles Davis', fullName: 'Miles Davis', years: '1926–1991', genre: 'Jazz', bio: 'American trumpeter and bandleader who shaped modern jazz across five decades. Kind of Blue is the best-selling jazz album ever. He pioneered cool jazz, hard bop, modal jazz, and jazz fusion, constantly reinventing his sound.' },
  { id: 'john-coltrane', name: 'John Coltrane', fullName: 'John Coltrane', years: '1926–1967', genre: 'Jazz', bio: 'American saxophonist whose technical mastery and spiritual searching pushed jazz into new territory. A Love Supreme is considered sacred in jazz. His "sheets of sound" technique and modal explorations influenced every saxophonist who followed.' },
  { id: 'duke-ellington', name: 'Duke Ellington', fullName: 'Duke Ellington', years: '1899–1974', genre: 'Jazz', bio: 'American composer, pianist, and bandleader who led his orchestra for over 50 years. He composed thousands of songs and is considered the greatest jazz composer. Known for Take the A Train and It Don\'t Mean a Thing.' },
  { id: 'louis-armstrong', name: 'Louis Armstrong', fullName: 'Louis Armstrong', years: '1901–1971', genre: 'Jazz', bio: 'American trumpeter and vocalist who transformed jazz from ensemble music to a soloist\'s art. His gravelly voice, charisma, and virtuosity made him the first true jazz superstar. Known for What a Wonderful World and Hello, Dolly!' },
  { id: 'ella-fitzgerald', name: 'Ella Fitzgerald', fullName: 'Ella Fitzgerald', years: '1917–1996', genre: 'Jazz', bio: 'The "First Lady of Song" — her vocal range, purity of tone, and scat singing were unmatched. She recorded the definitive Songbook series covering Cole Porter, Gershwin, and others. Winner of 13 Grammy Awards.' },
  { id: 'charlie-parker', name: 'Charlie Parker', fullName: 'Charlie Parker', years: '1920–1955', genre: 'Jazz', bio: 'American alto saxophonist who co-invented bebop, revolutionizing jazz with unprecedented speed, harmonic complexity, and improvisational brilliance. Known as "Bird," his influence on jazz is immeasurable.' },
  { id: 'thelonious-monk', name: 'Thelonious Monk', fullName: 'Thelonious Monk', years: '1917–1982', genre: 'Jazz', bio: 'American jazz pianist and composer known for his unique improvisational style and contributions to bebop. His angular melodies and dissonant harmonies in tunes like Round Midnight became jazz standards.' },
  { id: 'billie-holiday', name: 'Billie Holiday', fullName: 'Billie Holiday', years: '1915–1959', genre: 'Jazz', bio: 'American jazz vocalist whose emotional depth and phrasing transformed jazz singing. Known as "Lady Day," her recording of Strange Fruit is considered one of the most important songs of the 20th century.' },
  { id: 'dizzy-gillespie', name: 'Dizzy Gillespie', fullName: 'Dizzy Gillespie', years: '1917–1993', genre: 'Jazz', bio: 'American trumpeter and bandleader who co-founded bebop with Charlie Parker. Known for his bent trumpet, puffed cheeks, and role in introducing Afro-Cuban rhythms to jazz.' },
  { id: 'dave-brubeck', name: 'Dave Brubeck', fullName: 'Dave Brubeck', years: '1920–2012', genre: 'Jazz', bio: 'American pianist whose Time Out album, featuring Take Five in 5/4 time, became one of the first jazz albums to sell a million copies. He pioneered unusual time signatures in jazz.' },
  { id: 'nina-simone', name: 'Nina Simone', fullName: 'Nina Simone', years: '1933–2003', genre: 'Jazz', bio: 'American singer, pianist, and civil rights activist whose music spanned jazz, blues, folk, and classical. Known for Feeling Good, My Baby Just Cares for Me, and her powerful activism through music.' },
  { id: 'chet-baker', name: 'Chet Baker', fullName: 'Chet Baker', years: '1929–1988', genre: 'Jazz', bio: 'American trumpeter and vocalist known for his lyrical, intimate cool jazz style. His version of My Funny Valentine became iconic. Despite a troubled life, his musicianship remained extraordinary.' },
  // Blues (24)
  { id: 'robert-johnson', name: 'Robert Johnson', fullName: 'Robert Johnson', years: '1911–1938', genre: 'Blues', bio: 'The "King of the Delta Blues." His 29 recordings from 1936-37 became the foundation of modern blues and rock. Songs like Cross Road Blues and Hellhound on My Trail are among the most influential in music history. Legend says he sold his soul at the crossroads.' },
  { id: 'bb-king', name: 'B.B. King', fullName: 'B.B. King', years: '1925–2015', genre: 'Blues', bio: 'The "King of the Blues." For over 50 years, his expressive guitar playing with his beloved guitar "Lucille" and his warm vocals defined modern blues. The Thrill Is Gone is his signature song.' },
  { id: 'muddy-waters', name: 'Muddy Waters', fullName: 'Muddy Waters', years: '1913–1983', genre: 'Blues', bio: 'The "Father of Modern Chicago Blues" who electrified the Delta blues and directly inspired rock and roll. Hoochie Coochie Man, Mannish Boy, and Rollin\' Stone shaped a generation of musicians.' },
  { id: 'howlin-wolf', name: 'Howlin\' Wolf', fullName: 'Howlin\' Wolf', years: '1910–1976', genre: 'Blues', bio: 'One of the most powerful and influential blues performers. His massive voice, physical presence, and songs like Smokestack Lightning and Killing Floor made him a legend of Chicago blues.' },
  { id: 'john-lee-hooker', name: 'John Lee Hooker', fullName: 'John Lee Hooker', years: '1917–2001', genre: 'Blues', bio: 'American blues guitarist and singer whose boogie style became a defining sound of electric blues. Boom Boom is among his best-known songs. He recorded over 100 albums in his career.' },
  { id: 'bessie-smith', name: 'Bessie Smith', fullName: 'Bessie Smith', years: '1894–1937', genre: 'Blues', bio: 'The "Empress of the Blues." The most popular female blues singer of the 1920s-30s, she was the highest-paid Black entertainer of her era. Her powerful voice influenced generations of singers.' },
  { id: 'stevie-ray-vaughan', name: 'Stevie Ray Vaughan', fullName: 'Stevie Ray Vaughan', years: '1954–1990', genre: 'Blues', bio: 'American guitarist who led a blues revival in the 1980s. His fiery playing on Texas Flood and Pride and Joy proved blues could still electrify audiences. He died tragically young in a helicopter crash at 35.' },
  { id: 'etta-james', name: 'Etta James', fullName: 'Etta James', years: '1938–2012', genre: 'Blues', bio: 'American singer whose powerful voice spanned blues, R&B, soul, and jazz. At Last became one of the most recognizable love songs in American music. She won six Grammy Awards.' },
  { id: 'lead-belly', name: 'Lead Belly', fullName: 'Lead Belly', years: '1888–1949', genre: 'Blues', bio: 'American folk and blues musician whose songs Goodnight, Irene, Midnight Special, and Cotton Fields became American standards. He mastered the twelve-string guitar and influenced the folk revival.' },
]

const WORKS: Work[] = [
  { slug: 'moonlight-sonata', title: 'Moonlight Sonata', composer: 'Ludwig van Beethoven', year: 1801, type: 'Sonata', description: 'Piano Sonata No. 14 in C-sharp minor, "Quasi una Fantasia." One of the most famous piano compositions ever written. The first movement\'s arpeggiated triplets create a hypnotic atmosphere that has captivated listeners for over 200 years.' },
  { slug: 'four-seasons', title: 'The Four Seasons', composer: 'Antonio Vivaldi', year: 1725, type: 'Concerto', description: 'Four violin concertos depicting spring, summer, autumn, and winter. Each concerto is accompanied by a sonnet describing the season. One of the most popular and recognized pieces of Baroque music worldwide.' },
  { slug: 'symphony-no-5', title: 'Symphony No. 5 in C minor', composer: 'Ludwig van Beethoven', year: 1808, type: 'Symphony', description: 'The most famous symphony in classical music. The iconic four-note opening motif (da-da-da-DUM) pervades the entire work, transforming from darkness to triumph — a journey from C minor to C major.' },
  { slug: 'symphony-no-9', title: 'Symphony No. 9 "Choral"', composer: 'Ludwig van Beethoven', year: 1824, type: 'Symphony', description: 'Beethoven\'s final complete symphony, featuring the "Ode to Joy" — the first major symphony to include voices. The melody was adopted as the Anthem of Europe. Beethoven was completely deaf when he composed it.' },
  { slug: 'swan-lake', title: 'Swan Lake', composer: 'Pyotr Ilyich Tchaikovsky', year: 1877, type: 'Ballet', description: 'One of the most popular ballets ever composed. The story of Odette, a princess cursed to live as a swan, features some of Tchaikovsky\'s most beloved music, including the iconic "Swan Theme."' },
  { slug: 'nutcracker', title: 'The Nutcracker', composer: 'Pyotr Ilyich Tchaikovsky', year: 1892, type: 'Ballet', description: 'The world\'s most performed ballet, especially during Christmas. Features the Dance of the Sugar Plum Fairy, Waltz of the Flowers, and the famous Overture. A holiday tradition since the 1960s.' },
  { slug: 'kind-of-blue', title: 'Kind of Blue', composer: 'Miles Davis', year: 1959, type: 'Album', description: 'The best-selling jazz album of all time and a landmark of modal jazz. Featuring John Coltrane, Cannonball Adderley, and Bill Evans. Every track — So What, Blue in Green, All Blues — is a masterpiece.' },
  { slug: 'magic-flute', title: 'The Magic Flute', composer: 'Wolfgang Amadeus Mozart', year: 1791, type: 'Opera', description: 'Mozart\'s last opera, combining fairy tale, comedy, Masonic symbolism, and sublime music. Features the famous Queen of the Night aria, one of the most demanding soprano arias ever written.' },
  { slug: 'messiah', title: 'Messiah', composer: 'George Frideric Handel', year: 1741, type: 'Oratorio', description: 'The most frequently performed choral work in Western music. The "Hallelujah" chorus is so famous that King George II reportedly stood upon hearing it, starting a tradition that continues today.' },
  { slug: 'rite-of-spring', title: 'The Rite of Spring', composer: 'Igor Stravinsky', year: 1913, type: 'Ballet', description: 'A ballet that caused a riot at its Paris premiere. Its pounding rhythms, dissonant harmonics, and primitive energy revolutionized music. It remains one of the most influential compositions of the 20th century.' },
  { slug: 'bolero', title: 'Boléro', composer: 'Maurice Ravel', year: 1928, type: 'Orchestral', description: 'A single melody repeated with gradually increasing orchestration and volume over 15 minutes. One of the most recognizable pieces of classical music, demonstrating Ravel\'s genius as an orchestrator.' },
  { slug: 'love-supreme', title: 'A Love Supreme', composer: 'John Coltrane', year: 1965, type: 'Album', description: 'A four-part spiritual suite considered one of the greatest jazz recordings ever made. Coltrane\'s passionate tenor saxophone and the tight quartet create an intensely personal declaration of faith and gratitude.' },
  { slug: 'goldberg-variations', title: 'Goldberg Variations', composer: 'Johann Sebastian Bach', year: 1741, type: 'Keyboard', description: 'An aria with 30 variations, considered one of the most important works for harpsichord/piano. Glenn Gould\'s 1955 recording brought it to worldwide fame. A masterwork of Baroque counterpoint and expression.' },
  { slug: 'well-tempered-clavier', title: 'The Well-Tempered Clavier', composer: 'Johann Sebastian Bach', year: 1722, type: 'Keyboard', description: '48 preludes and fugues in all major and minor keys, composed in two books. Called the "Old Testament of piano music," it demonstrated the viability of well-tempered tuning and is a cornerstone of keyboard literature.' },
  { slug: 'clair-de-lune', title: 'Clair de Lune', composer: 'Claude Debussy', year: 1905, type: 'Piano', description: 'The third movement of Suite bergamasque, and Debussy\'s most famous piano piece. Its shimmering arpeggios and gentle melody evoke moonlight, making it one of the most recognizable piano works ever composed.' },
  { slug: 'carmen', title: 'Carmen', composer: 'Georges Bizet', year: 1875, type: 'Opera', description: 'One of the most performed operas in the world. The story of the passionate, free-spirited Carmen features unforgettable music including the Toreador Song and the Habanera. Bizet died three months after its premiere.' },
]

function artistPage(a: Artist): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${a.fullName} — Free ${a.genre} Music | FreeMusic</title>
  <meta name="description" content="Listen to ${a.fullName} (${a.years}) for free on FreeMusic. ${a.bio.slice(0, 140)}">
  <meta property="og:title" content="${a.fullName} — Free ${a.genre} Music | FreeMusic">
  <meta property="og:description" content="${a.bio.slice(0, 200)}">
  <meta name="theme-color" content="#111113">
  <link rel="canonical" href="https://freemusicapp.online/artist/${a.id}.html">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"MusicGroup","name":"${a.fullName}","genre":"${a.genre}","description":"${a.bio.replace(/"/g, '\\"').slice(0, 200)}"}</script>
  <style>*{box-sizing:border-box;margin:0;padding:0}body{background:#111113;color:#f0f0f2;font-family:'Inter',system-ui,sans-serif;line-height:1.7;-webkit-font-smoothing:antialiased}.c{max-width:680px;margin:0 auto;padding:48px 24px 80px}a{color:#6ECE9E}h1{font-family:'DM Serif Display',serif;font-size:36px;font-weight:700;margin-bottom:4px}.sub{color:#9090a0;font-size:15px;margin-bottom:32px}h2{font-size:20px;font-weight:600;margin:32px 0 12px}p{font-size:16px;color:#c0c0cc;margin-bottom:16px}.back{display:inline-flex;align-items:center;gap:6px;color:#6ECE9E;text-decoration:none;font-size:14px;font-weight:500;margin-bottom:32px}.back:hover{text-decoration:underline}.cta{display:inline-flex;align-items:center;gap:8px;background:#6ECE9E;color:#111113;padding:12px 24px;border-radius:12px;font-weight:600;font-size:15px;text-decoration:none;margin-top:16px}.cta:hover{background:#5cb888}.badge{display:inline-block;padding:4px 12px;border-radius:99px;font-size:12px;font-weight:600;background:#6ECE9E20;color:#6ECE9E;margin-bottom:16px}</style>
</head>
<body>
<div class="c">
  <a href="/" class="back">&larr; Back to FreeMusic</a>
  <div class="badge">${a.genre}</div>
  <h1>${a.fullName}</h1>
  <p class="sub">${a.years}</p>
  <p>${a.bio}</p>
  <h2>Listen Free</h2>
  <p>Stream ${a.name}'s music for free on FreeMusic. No ads, no subscription, no account required. All music is Creative Commons licensed or public domain.</p>
  <a href="/" class="cta"><svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/></svg>Play ${a.name} on FreeMusic</a>
  <p style="margin-top:48px;font-size:12px;color:#60606e"><a href="/legal/privacy.html">Privacy</a> · <a href="/legal/terms.html">Terms</a> · <a href="https://github.com/FreeMusicApp/freemusic">GitHub</a></p>
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
  <title>${w.title} by ${w.composer} — Free Music | FreeMusic</title>
  <meta name="description" content="Listen to ${w.title} by ${w.composer} (${w.year}) for free. ${w.description.slice(0, 140)}">
  <meta property="og:title" content="${w.title} — ${w.composer} | FreeMusic">
  <meta property="og:description" content="${w.description.slice(0, 200)}">
  <meta name="theme-color" content="#111113">
  <link rel="canonical" href="https://freemusicapp.online/work/${w.slug}.html">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"MusicComposition","name":"${w.title}","composer":{"@type":"Person","name":"${w.composer}"},"dateCreated":"${w.year}","description":"${w.description.replace(/"/g, '\\"').slice(0, 200)}"}</script>
  <style>*{box-sizing:border-box;margin:0;padding:0}body{background:#111113;color:#f0f0f2;font-family:'Inter',system-ui,sans-serif;line-height:1.7;-webkit-font-smoothing:antialiased}.c{max-width:680px;margin:0 auto;padding:48px 24px 80px}a{color:#6ECE9E}h1{font-family:'DM Serif Display',serif;font-size:32px;font-weight:700;margin-bottom:4px;font-style:italic}.sub{color:#9090a0;font-size:15px;margin-bottom:32px}h2{font-size:20px;font-weight:600;margin:32px 0 12px}p{font-size:16px;color:#c0c0cc;margin-bottom:16px}.back{display:inline-flex;align-items:center;gap:6px;color:#6ECE9E;text-decoration:none;font-size:14px;font-weight:500;margin-bottom:32px}.back:hover{text-decoration:underline}.cta{display:inline-flex;align-items:center;gap:8px;background:#6ECE9E;color:#111113;padding:12px 24px;border-radius:12px;font-weight:600;font-size:15px;text-decoration:none;margin-top:16px}.cta:hover{background:#5cb888}.badge{display:inline-block;padding:4px 12px;border-radius:99px;font-size:12px;font-weight:600;background:#6ECE9E20;color:#6ECE9E;margin-bottom:16px}.meta{display:flex;gap:16px;margin-bottom:24px;flex-wrap:wrap}.meta span{font-size:13px;color:#9090a0}</style>
</head>
<body>
<div class="c">
  <a href="/" class="back">&larr; Back to FreeMusic</a>
  <div class="badge">${w.type}</div>
  <h1>${w.title}</h1>
  <p class="sub">${w.composer}</p>
  <div class="meta"><span>Composed: ${w.year}</span><span>Type: ${w.type}</span></div>
  <p>${w.description}</p>
  <h2>Listen Free</h2>
  <p>Stream ${w.title} for free on FreeMusic. No ads, no subscription, no account required.</p>
  <a href="/" class="cta"><svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/></svg>Play on FreeMusic</a>
  <p style="margin-top:48px;font-size:12px;color:#60606e"><a href="/legal/privacy.html">Privacy</a> · <a href="/legal/terms.html">Terms</a> · <a href="https://github.com/FreeMusicApp/freemusic">GitHub</a></p>
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

// Sitemap
const urls = [
  'https://freemusicapp.online/',
  'https://freemusicapp.online/legal/privacy.html',
  'https://freemusicapp.online/legal/terms.html',
  ...ARTISTS.map(a => `https://freemusicapp.online/artist/${a.id}.html`),
  ...WORKS.map(w => `https://freemusicapp.online/work/${w.slug}.html`),
]
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${u}</loc></url>`).join('\n')}\n</urlset>`
writeFileSync(join(OUT, 'sitemap.xml'), sitemap)

// Robots.txt
writeFileSync(join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: https://freemusicapp.online/sitemap.xml\n`)

console.log(`Generated ${ARTISTS.length} artist pages, ${WORKS.length} work pages, sitemap.xml, robots.txt`)
