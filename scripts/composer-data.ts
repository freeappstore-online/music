export type Milestone = {
  year: number
  icon: string
  title: string
  desc: string
}

export type KeyWork = {
  title: string
  year: number
  type: string
}

export type ComposerBio = {
  id: string
  fullName: string
  years: string
  birthYear: number
  deathYear: number | null
  genre: string
  nationality: string
  era: string
  portrait?: string
  tagline: string
  intro: string
  earlyLife: string
  career: string
  legacy: string
  milestones: Milestone[]
  keyWorks: KeyWork[]
  funFact: string
  related: string[] // IDs of related composers
}

export const COMPOSER_BIOS: ComposerBio[] = [
  {
    id: 'mozart',
    fullName: 'Wolfgang Amadeus Mozart',
    years: '1756–1791',
    birthYear: 1756,
    deathYear: 1791,
    genre: 'Classical',
    nationality: 'Austrian',
    era: 'Classical Period',
    tagline: 'The divine genius who composed over 800 works in just 35 years',
    intro: 'Wolfgang Amadeus Mozart is widely regarded as one of the greatest composers in Western musical history. A child prodigy who began composing at age five, he produced an astonishing body of work across every genre of his era — symphonies, concertos, operas, chamber music, and choral works — all marked by melodic beauty, formal elegance, and emotional depth.',
    earlyLife: 'Born in Salzburg on January 27, 1756, Mozart showed extraordinary musical talent from his earliest years. His father Leopold, himself a composer and violinist, recognized his son\'s gifts and began teaching him keyboard and violin at age three. By five, Wolfgang was composing short pieces. At six, his father took him and his sister Nannerl on a grand tour of European courts, where the child prodigy astonished audiences from Munich to Paris to London. By age twelve, he had written his first opera.',
    career: 'After years of service to the Archbishop of Salzburg, Mozart moved to Vienna in 1781, where he worked as a freelance composer and performer. The Vienna years were his most productive: he composed The Marriage of Figaro (1786), Don Giovanni (1787), and Così fan tutte (1790) — three operas that remain cornerstones of the repertoire. He also produced his final symphonies (Nos. 39, 40, 41 "Jupiter"), piano concertos, string quartets, and his iconic Requiem, left unfinished at his death.',
    legacy: 'Mozart died on December 5, 1791, at just 35 years old, leaving behind over 800 compositions. His music embodies the Classical ideal of balance, clarity, and beauty while hinting at the emotional depths that would define Romanticism. Beethoven, Schubert, and countless others built upon his innovations. Today, his works are among the most performed and recorded in the classical repertoire.',
    milestones: [
      { year: 1756, icon: '👶', title: 'Born in Salzburg', desc: 'Born to Leopold and Anna Maria Mozart' },
      { year: 1761, icon: '🎹', title: 'First composition', desc: 'Composes Andante in C at age 5' },
      { year: 1762, icon: '🏰', title: 'European tour begins', desc: 'Father takes him to perform at royal courts' },
      { year: 1764, icon: '🎼', title: 'First symphony', desc: 'Writes Symphony No. 1 in E-flat at age 8' },
      { year: 1768, icon: '🎭', title: 'First opera', desc: 'Composes Bastien und Bastienne at age 12' },
      { year: 1781, icon: '🏙️', title: 'Moves to Vienna', desc: 'Leaves Salzburg to become freelance composer' },
      { year: 1782, icon: '💒', title: 'Marriage', desc: 'Marries Constanze Weber' },
      { year: 1786, icon: '🎭', title: 'The Marriage of Figaro', desc: 'Premieres his most beloved opera' },
      { year: 1787, icon: '🎭', title: 'Don Giovanni', desc: 'Composes the "opera of all operas"' },
      { year: 1788, icon: '🎼', title: 'Final symphonies', desc: 'Writes Symphonies 39, 40, and 41 "Jupiter"' },
      { year: 1791, icon: '🎭', title: 'The Magic Flute', desc: 'His last opera premieres in September' },
      { year: 1791, icon: '🕯️', title: 'Death', desc: 'Dies December 5 while composing the Requiem' },
    ],
    keyWorks: [
      { title: 'The Marriage of Figaro', year: 1786, type: 'Opera' },
      { title: 'Don Giovanni', year: 1787, type: 'Opera' },
      { title: 'The Magic Flute', year: 1791, type: 'Opera' },
      { title: 'Symphony No. 40', year: 1788, type: 'Symphony' },
      { title: 'Symphony No. 41 "Jupiter"', year: 1788, type: 'Symphony' },
      { title: 'Piano Concerto No. 21', year: 1785, type: 'Concerto' },
      { title: 'Requiem in D minor', year: 1791, type: 'Choral' },
      { title: 'Eine kleine Nachtmusik', year: 1787, type: 'Serenade' },
      { title: 'Clarinet Concerto', year: 1791, type: 'Concerto' },
    ],
    funFact: 'Mozart could hear a piece of music once and write it down from memory. At age 14, he transcribed Allegri\'s Miserere — a closely guarded Vatican composition — after a single hearing.',
    related: ['haydn', 'beethoven', 'schubert'],
  },
  {
    id: 'beethoven',
    fullName: 'Ludwig van Beethoven',
    years: '1770–1827',
    birthYear: 1770,
    deathYear: 1827,
    genre: 'Classical',
    nationality: 'German',
    era: 'Classical → Romantic',
    tagline: 'The titan who conquered deafness to revolutionize music',
    intro: 'Ludwig van Beethoven bridged the Classical and Romantic periods, expanding every form he touched — symphony, sonata, concerto, quartet — with unprecedented emotional power and structural ambition. His music is a testament to human willpower: he composed many of his greatest works while profoundly deaf.',
    earlyLife: 'Born in Bonn in December 1770, Beethoven grew up in a musical household — his father Johann was a court musician who pushed the young Ludwig relentlessly, hoping to create another Mozart. Despite a difficult childhood, Beethoven\'s talent was undeniable. By age 11, he was deputy court organist. At 16, he traveled to Vienna to study with Mozart (though the visit was cut short). In 1792, he moved permanently to Vienna to study with Haydn.',
    career: 'Beethoven quickly established himself in Vienna as a virtuoso pianist and bold composer. His "Heroic" period (1803–1812) produced the Eroica Symphony, the Fifth Symphony with its iconic four-note motif, the Pastoral Symphony, the Emperor Concerto, and his only opera, Fidelio. As his hearing deteriorated, his music became more inward and experimental. His late period yielded the Ninth Symphony with its choral finale, the Missa Solemnis, and the late string quartets — works that continue to astonish.',
    legacy: 'Beethoven died on March 26, 1827. An estimated 20,000 people attended his funeral. He transformed the symphony from aristocratic entertainment into a vehicle for profound human expression. The Ninth Symphony\'s "Ode to Joy" became the Anthem of Europe. Every composer who followed — Brahms, Wagner, Mahler — worked in his shadow.',
    milestones: [
      { year: 1770, icon: '👶', title: 'Born in Bonn', desc: 'Born to Johann van Beethoven, a court musician' },
      { year: 1778, icon: '🎹', title: 'First public performance', desc: 'Performs publicly at age 7' },
      { year: 1783, icon: '🎼', title: 'First published works', desc: 'Three piano sonatas published at age 12' },
      { year: 1787, icon: '✨', title: 'Meets Mozart', desc: 'Brief visit to Vienna; Mozart reportedly says "Keep your eyes on him"' },
      { year: 1792, icon: '🏙️', title: 'Moves to Vienna', desc: 'Studies with Haydn; never returns to Bonn' },
      { year: 1798, icon: '👂', title: 'Hearing loss begins', desc: 'First symptoms of the deafness that would define his life' },
      { year: 1802, icon: '📝', title: 'Heiligenstadt Testament', desc: 'Writes desperate letter about his deafness, resolves to live for his art' },
      { year: 1804, icon: '🎼', title: 'Eroica Symphony', desc: 'Symphony No. 3 — dedicates then retracts dedication to Napoleon' },
      { year: 1808, icon: '🎵', title: 'Fifth Symphony', desc: 'Da-da-da-DUM: the most famous opening in music' },
      { year: 1810, icon: '🎹', title: 'Für Elise', desc: 'Composes the world\'s most recognizable piano piece' },
      { year: 1824, icon: '🎼', title: 'Ninth Symphony', desc: 'Premieres the choral symphony while completely deaf' },
      { year: 1827, icon: '🕯️', title: 'Death in Vienna', desc: '20,000 people attend his funeral' },
    ],
    keyWorks: [
      { title: 'Symphony No. 5', year: 1808, type: 'Symphony' },
      { title: 'Symphony No. 9 "Choral"', year: 1824, type: 'Symphony' },
      { title: 'Symphony No. 3 "Eroica"', year: 1804, type: 'Symphony' },
      { title: 'Moonlight Sonata', year: 1801, type: 'Piano Sonata' },
      { title: 'Piano Concerto No. 5 "Emperor"', year: 1811, type: 'Concerto' },
      { title: 'Violin Concerto', year: 1806, type: 'Concerto' },
      { title: 'Fidelio', year: 1805, type: 'Opera' },
      { title: 'Für Elise', year: 1810, type: 'Piano' },
    ],
    funFact: 'When the Ninth Symphony premiered in 1824, Beethoven was so deaf he couldn\'t hear the audience\'s thunderous applause. A soloist had to turn him around so he could see the standing ovation.',
    related: ['mozart', 'brahms', 'schubert'],
  },
  {
    id: 'bach',
    fullName: 'Johann Sebastian Bach',
    years: '1685–1750',
    birthYear: 1685,
    deathYear: 1750,
    genre: 'Classical',
    nationality: 'German',
    era: 'Baroque',
    tagline: 'The father of Western music who wove mathematics and devotion into sound',
    intro: 'Johann Sebastian Bach is regarded as one of the greatest composers of all time. A master of counterpoint, harmony, and musical architecture, his works — from the Brandenburg Concertos to the Mass in B minor — represent the pinnacle of the Baroque era and laid the foundation for all Western music that followed.',
    earlyLife: 'Born in Eisenach in 1685 into a large musical family (over 50 Bachs were professional musicians), Johann Sebastian was orphaned by age 10. Raised by his eldest brother, he studied organ, harpsichord, and violin. He walked 250 miles to hear the great organist Buxtehude play — and stayed three months longer than his employer allowed.',
    career: 'Bach served as organist, court musician, and cantor throughout his career, most notably as Thomaskantor in Leipzig from 1723 until his death. In Leipzig, he composed a cantata for nearly every Sunday — over 200 in total. He also produced the Mass in B minor, the St. Matthew Passion, the Well-Tempered Clavier, the Goldberg Variations, and The Art of Fugue. He was more famous as an organist than a composer during his lifetime.',
    legacy: 'Bach died on July 28, 1750. His music was largely forgotten until Felix Mendelssohn revived the St. Matthew Passion in 1829, sparking a Bach renaissance. Today he is considered the supreme genius of Western music. His influence on harmony, counterpoint, and musical structure is incalculable — Beethoven called him "the immortal god of harmony."',
    milestones: [
      { year: 1685, icon: '👶', title: 'Born in Eisenach', desc: 'Into a family of over 50 professional musicians' },
      { year: 1695, icon: '😢', title: 'Orphaned', desc: 'Both parents die within a year; raised by eldest brother' },
      { year: 1703, icon: '⛪', title: 'First organist position', desc: 'Appointed organist at Arnstadt at age 18' },
      { year: 1705, icon: '🚶', title: 'Walks 250 miles', desc: 'Travels on foot to hear Buxtehude play organ' },
      { year: 1708, icon: '🏰', title: 'Weimar court', desc: 'Becomes court organist and chamber musician' },
      { year: 1717, icon: '🎼', title: 'Brandenburg Concertos', desc: 'Composes six concertos for the Margrave of Brandenburg' },
      { year: 1722, icon: '🎹', title: 'Well-Tempered Clavier Book I', desc: '24 preludes and fugues in all keys' },
      { year: 1723, icon: '⛪', title: 'Thomaskantor in Leipzig', desc: 'Takes the position he\'ll hold for 27 years' },
      { year: 1727, icon: '✝️', title: 'St. Matthew Passion', desc: 'His greatest sacred work' },
      { year: 1741, icon: '🎹', title: 'Goldberg Variations', desc: 'An aria with 30 variations — a summit of keyboard music' },
      { year: 1749, icon: '🎼', title: 'Mass in B minor', desc: 'Completes his monumental setting of the Latin Mass' },
      { year: 1750, icon: '🕯️', title: 'Death in Leipzig', desc: 'Dies after a failed eye surgery; leaves The Art of Fugue unfinished' },
    ],
    keyWorks: [
      { title: 'Brandenburg Concertos', year: 1721, type: 'Concerto' },
      { title: 'Well-Tempered Clavier', year: 1722, type: 'Keyboard' },
      { title: 'St. Matthew Passion', year: 1727, type: 'Oratorio' },
      { title: 'Mass in B minor', year: 1749, type: 'Choral' },
      { title: 'Goldberg Variations', year: 1741, type: 'Keyboard' },
      { title: 'Cello Suites', year: 1720, type: 'Suite' },
      { title: 'Toccata and Fugue in D minor', year: 1708, type: 'Organ' },
      { title: 'The Art of Fugue', year: 1750, type: 'Keyboard' },
    ],
    funFact: 'Bach had 20 children with two wives. Four of his sons became famous composers themselves. The Bach family produced so many musicians that in some parts of Germany, "Bach" became a synonym for "musician."',
    related: ['handel', 'vivaldi', 'mozart'],
  },
]
