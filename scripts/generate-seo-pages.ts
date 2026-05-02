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
  // Pop (20)
  { id: 'elvis-presley', name: 'Elvis Presley', fullName: 'Elvis Presley', years: '1935–1977', genre: 'Pop', bio: 'The "King of Rock and Roll." Elvis brought rhythm and blues to mainstream America, selling over 500 million records worldwide. Heartbreak Hotel, Hound Dog, and Jailhouse Rock defined a generation. His cultural impact transcended music, making him one of the most significant cultural icons of the 20th century.' },
  { id: 'michael-jackson', name: 'Michael Jackson', fullName: 'Michael Jackson', years: '1958–2009', genre: 'Pop', bio: 'The "King of Pop." Thriller remains the best-selling album of all time with over 70 million copies sold. His moonwalk, music videos, and songs like Billie Jean and Beat It transformed pop music and MTV. He won 13 Grammy Awards and influenced every pop artist who followed.' },
  { id: 'madonna', name: 'Madonna', fullName: 'Madonna', years: '1958–', genre: 'Pop', bio: 'The "Queen of Pop." With over 300 million records sold, she is the best-selling female music artist of all time. Like a Virgin, Material Girl, and Like a Prayer redefined pop music. She constantly reinvented her image and pushed boundaries of artistic expression.' },
  { id: 'prince', name: 'Prince', fullName: 'Prince', years: '1958–2016', genre: 'Pop', bio: 'A multi-instrumentalist genius who played all 27 instruments on his debut album. Purple Rain became one of the greatest albums ever made. His blend of funk, rock, R&B, and pop, combined with his flamboyant stage presence, made him one of the most creative artists in music history.' },
  { id: 'whitney-houston', name: 'Whitney Houston', fullName: 'Whitney Houston', years: '1963–2012', genre: 'Pop', bio: 'Known as "The Voice," Whitney Houston possessed one of the greatest vocal instruments in pop history. I Will Always Love You became one of the best-selling singles of all time. She won six Grammy Awards and was the only artist to chart seven consecutive No. 1 singles.' },
  { id: 'david-bowie', name: 'David Bowie', fullName: 'David Bowie', years: '1947–2016', genre: 'Pop', bio: 'A chameleon of pop music who constantly reinvented himself through personas like Ziggy Stardust and the Thin White Duke. His innovations in glam rock, art rock, and electronic music influenced generations. Space Oddity, Heroes, and Let\'s Dance remain timeless.' },
  { id: 'stevie-wonder', name: 'Stevie Wonder', fullName: 'Stevie Wonder', years: '1950–', genre: 'Pop', bio: 'A child prodigy who signed with Motown at age 11 and became one of the most creative forces in popular music. Blind from birth, he mastered multiple instruments and pioneered the use of synthesizers. Songs in the Key of Life is considered one of the greatest albums ever recorded. He won 25 Grammy Awards.' },
  { id: 'aretha-franklin', name: 'Aretha Franklin', fullName: 'Aretha Franklin', years: '1942–2018', genre: 'Pop', bio: 'The "Queen of Soul." Her powerful voice and songs like Respect, Natural Woman, and Think became anthems of the civil rights and feminist movements. She was the first woman inducted into the Rock and Roll Hall of Fame and won 18 Grammy Awards.' },
  { id: 'elton-john', name: 'Elton John', fullName: 'Elton John', years: '1947–', genre: 'Pop', bio: 'One of the best-selling music artists of all time with over 300 million records sold. His partnership with lyricist Bernie Taupin produced classics like Rocket Man, Tiny Dancer, and Crocodile Rock. He won five Grammy Awards, an Academy Award, and a Tony Award.' },
  { id: 'freddie-mercury', name: 'Freddie Mercury', fullName: 'Freddie Mercury', years: '1946–1991', genre: 'Pop', bio: 'Lead vocalist of Queen, known for his four-octave vocal range, flamboyant stage persona, and extraordinary showmanship. Bohemian Rhapsody, We Will Rock You, and We Are the Champions are among the most recognizable songs in music history. His Live Aid performance in 1985 is considered the greatest live rock performance ever.' },
  { id: 'bob-marley', name: 'Bob Marley', fullName: 'Bob Marley', years: '1945–1981', genre: 'Pop', bio: 'The king of reggae who brought Jamaican music to the world. Songs like No Woman, No Cry, One Love, and Redemption Song became global anthems of peace and resistance. Legend is the best-selling reggae album of all time. He remains a symbol of unity and social justice.' },
  { id: 'ray-charles', name: 'Ray Charles', fullName: 'Ray Charles', years: '1930–2004', genre: 'Pop', bio: 'The "Genius of Soul" who pioneered soul music by combining gospel, R&B, blues, and jazz. Blind since age seven, he broke racial barriers in music. Georgia on My Mind, Hit the Road Jack, and I Got a Woman are American standards. He won 17 Grammy Awards.' },
  { id: 'frank-sinatra', name: 'Frank Sinatra', fullName: 'Frank Sinatra', years: '1915–1998', genre: 'Pop', bio: 'The "Chairman of the Board" and the defining voice of American popular music. My Way, Fly Me to the Moon, and New York, New York became eternal standards. He sold over 150 million records, won 11 Grammy Awards, and defined the concept of the modern pop vocalist.' },
  { id: 'amy-winehouse', name: 'Amy Winehouse', fullName: 'Amy Winehouse', years: '1983–2011', genre: 'Pop', bio: 'British singer-songwriter whose deep contralto voice and blend of soul, jazz, and R&B revitalized classic sounds for a modern audience. Back to Black became one of the best-selling albums in UK history. Rehab and Back to Black won five Grammy Awards. She died tragically at 27.' },
  { id: 'marvin-gaye', name: 'Marvin Gaye', fullName: 'Marvin Gaye', years: '1939–1984', genre: 'Pop', bio: 'The "Prince of Motown" who transformed soul music from pop entertainment into artistic expression. What\'s Going On is considered one of the greatest albums ever made. Sexual Healing, Let\'s Get It On, and I Heard It Through the Grapevine are defining songs of American music.' },
  { id: 'james-brown', name: 'James Brown', fullName: 'James Brown', years: '1933–2006', genre: 'Pop', bio: 'The "Godfather of Soul" who invented funk and influenced hip-hop, dance music, and virtually every genre that followed. I Got You (I Feel Good), Papa\'s Got a Brand New Bag, and Get Up (I Feel Like Being a) Sex Machine revolutionized rhythm in popular music.' },
  { id: 'tina-turner', name: 'Tina Turner', fullName: 'Tina Turner', years: '1939–2023', genre: 'Pop', bio: 'The "Queen of Rock \'n\' Roll." After a turbulent early career with Ike Turner, her solo comeback with Private Dancer became one of the greatest in music history. What\'s Love Got to Do with It, Simply the Best, and Proud Mary showcase her electrifying energy. She sold over 200 million records.' },
  { id: 'otis-redding', name: 'Otis Redding', fullName: 'Otis Redding', years: '1941–1967', genre: 'Pop', bio: 'The "King of Soul" whose raw, passionate voice defined Southern soul. (Sittin\' On) The Dock of the Bay, released posthumously, became his biggest hit. Try a Little Tenderness and These Arms of Mine are soul classics. He died in a plane crash at just 26.' },
  { id: 'sam-cooke', name: 'Sam Cooke', fullName: 'Sam Cooke', years: '1931–1964', genre: 'Pop', bio: 'The "King of Soul" and a pioneer who helped define the genre. A Change Is Gonna Come became a civil rights anthem. You Send Me, Cupid, and Twistin\' the Night Away showcase his smooth tenor and songwriting genius. He was also one of the first Black artists to found his own record label.' },
  { id: 'nat-king-cole', name: 'Nat King Cole', fullName: 'Nat King Cole', years: '1919–1965', genre: 'Pop', bio: 'One of the most beloved vocalists in American music. His warm baritone graced classics like Unforgettable, Mona Lisa, and The Christmas Song. He was also an accomplished jazz pianist and the first African American to host a national TV variety show.' },
  // Rock (20)
  { id: 'the-beatles', name: 'The Beatles', fullName: 'The Beatles', years: '1960–1970', genre: 'Rock', bio: 'The most influential band in rock history. John Lennon, Paul McCartney, George Harrison, and Ringo Starr transformed popular music with albums like Sgt. Pepper\'s Lonely Hearts Club Band, Abbey Road, and Revolver. They sold over 600 million records and changed the course of Western culture.' },
  { id: 'led-zeppelin', name: 'Led Zeppelin', fullName: 'Led Zeppelin', years: '1968–1980', genre: 'Rock', bio: 'British rock band that defined hard rock and heavy metal. Led Zeppelin IV, featuring Stairway to Heaven, is one of the best-selling albums ever. Jimmy Page\'s guitar, Robert Plant\'s vocals, John Paul Jones\'s bass, and John Bonham\'s drums created a sound that still reverberates through rock music.' },
  { id: 'pink-floyd', name: 'Pink Floyd', fullName: 'Pink Floyd', years: '1965–1995', genre: 'Rock', bio: 'Pioneers of progressive and psychedelic rock known for conceptual albums and elaborate live shows. The Dark Side of the Moon spent 937 weeks on the Billboard charts. The Wall and Wish You Were Here are landmarks of rock music, exploring themes of alienation, war, and the human condition.' },
  { id: 'rolling-stones', name: 'The Rolling Stones', fullName: 'The Rolling Stones', years: '1962–', genre: 'Rock', bio: 'The "Greatest Rock and Roll Band in the World." Mick Jagger and Keith Richards led a band that has endured for over six decades. (I Can\'t Get No) Satisfaction, Sympathy for the Devil, and Paint It Black are cornerstones of rock. They have sold over 240 million records.' },
  { id: 'jimi-hendrix', name: 'Jimi Hendrix', fullName: 'Jimi Hendrix', years: '1942–1970', genre: 'Rock', bio: 'Widely regarded as the greatest electric guitarist in history. His innovative use of feedback, distortion, and the wah-wah pedal redefined the instrument. Purple Haze, All Along the Watchtower, and his Woodstock Star-Spangled Banner are defining moments of rock. He died at 27.' },
  { id: 'queen', name: 'Queen', fullName: 'Queen', years: '1970–', genre: 'Rock', bio: 'British rock band fronted by Freddie Mercury, known for their theatrical style and vocal harmonies. Bohemian Rhapsody, We Will Rock You, and We Are the Champions are among the most recognizable songs ever recorded. Their Live Aid performance in 1985 is considered the greatest live rock performance of all time.' },
  { id: 'the-who', name: 'The Who', fullName: 'The Who', years: '1964–', genre: 'Rock', bio: 'British rock band that pioneered the rock opera with Tommy and Quadrophenia. Pete Townshend\'s windmill guitar style, Roger Daltrey\'s powerful vocals, John Entwistle\'s thundering bass, and Keith Moon\'s explosive drumming made them one of the most dynamic live acts in rock history.' },
  { id: 'acdc', name: 'AC/DC', fullName: 'AC/DC', years: '1973–', genre: 'Rock', bio: 'Australian hard rock band whose thunderous riffs and high-voltage performances made them one of the best-selling acts of all time. Back in Black is the second-best-selling album in history. Highway to Hell, Thunderstruck, and T.N.T. are hard rock anthems that define the genre.' },
  { id: 'nirvana', name: 'Nirvana', fullName: 'Nirvana', years: '1987–1994', genre: 'Rock', bio: 'The band that brought grunge to the mainstream. Kurt Cobain\'s raw songwriting, paired with Dave Grohl\'s drumming and Krist Novoselic\'s bass, produced Nevermind — an album that dethroned Michael Jackson from the top of the charts. Smells Like Teen Spirit became a generational anthem.' },
  { id: 'the-doors', name: 'The Doors', fullName: 'The Doors', years: '1965–1973', genre: 'Rock', bio: 'American rock band fronted by the charismatic Jim Morrison. Their blend of rock, blues, jazz, and poetry produced timeless songs like Light My Fire, Riders on the Storm, and The End. Morrison\'s literary lyrics and shamanistic stage presence made them counterculture icons.' },
  { id: 'black-sabbath', name: 'Black Sabbath', fullName: 'Black Sabbath', years: '1968–2017', genre: 'Rock', bio: 'The founders of heavy metal. Tony Iommi\'s crushing guitar riffs, Ozzy Osbourne\'s haunting vocals, Geezer Butler\'s thundering bass, and Bill Ward\'s powerful drumming created a dark, heavy sound that spawned an entire genre. Paranoid, Iron Man, and War Pigs remain metal classics.' },
  { id: 'radiohead', name: 'Radiohead', fullName: 'Radiohead', years: '1985–', genre: 'Rock', bio: 'British band that redefined rock music for the digital age. OK Computer and Kid A are considered among the greatest albums ever made, blending rock with electronic, jazz, and classical influences. Thom Yorke\'s haunting vocals and the band\'s experimental approach influenced a generation of musicians.' },
  { id: 'the-clash', name: 'The Clash', fullName: 'The Clash', years: '1976–1986', genre: 'Rock', bio: 'The "Only Band That Matters." The Clash fused punk with reggae, ska, rockabilly, and hip-hop. London Calling is considered one of the greatest albums ever made. Rock the Casbah and Should I Stay or Should I Go became punk anthems that crossed into the mainstream.' },
  { id: 'fleetwood-mac', name: 'Fleetwood Mac', fullName: 'Fleetwood Mac', years: '1967–', genre: 'Rock', bio: 'British-American rock band whose Rumours album, born from personal turmoil, became one of the best-selling records of all time with over 40 million copies sold. Go Your Own Way, Dreams, and The Chain showcase perfect pop-rock songwriting fueled by real heartbreak.' },
  { id: 'eagles', name: 'Eagles', fullName: 'Eagles', years: '1971–', genre: 'Rock', bio: 'American rock band whose blend of rock, country, and folk produced some of the genre\'s most enduring songs. Hotel California is one of the most recognizable recordings in music history. Their Greatest Hits album was the first to be certified 38x platinum in the US.' },
  { id: 'cream', name: 'Cream', fullName: 'Cream', years: '1966–1968', genre: 'Rock', bio: 'The first rock supergroup, featuring Eric Clapton, Jack Bruce, and Ginger Baker. In just two years, they pioneered blues-rock and laid the groundwork for heavy metal and jam bands. Sunshine of Your Love, White Room, and Crossroads remain cornerstones of rock guitar.' },
  { id: 'velvet-underground', name: 'The Velvet Underground', fullName: 'The Velvet Underground', years: '1964–1973', genre: 'Rock', bio: 'Lou Reed and John Cale\'s band, managed by Andy Warhol, sold few records initially but influenced countless artists. Brian Eno famously said everyone who bought their album started a band. Heroin, Venus in Furs, and Sunday Morning pioneered art rock, punk, and alternative music.' },
  { id: 'grateful-dead', name: 'Grateful Dead', fullName: 'Grateful Dead', years: '1965–1995', genre: 'Rock', bio: 'The quintessential American jam band. Jerry Garcia and the Grateful Dead created a musical community through endless improvisation and touring. Truckin\', Casey Jones, and Touch of Grey blended rock, folk, country, jazz, and psychedelia. Their devoted "Deadheads" followed them for decades.' },
  { id: 'deep-purple', name: 'Deep Purple', fullName: 'Deep Purple', years: '1968–', genre: 'Rock', bio: 'British band that, alongside Black Sabbath and Led Zeppelin, formed the "unholy trinity" of heavy metal. Smoke on the Water features the most famous guitar riff in rock history. Machine Head and In Rock are hard rock milestones. They were listed as the world\'s loudest band by Guinness.' },
  { id: 'talking-heads', name: 'Talking Heads', fullName: 'Talking Heads', years: '1975–1991', genre: 'Rock', bio: 'New York art-rock band led by David Byrne that blended punk, funk, world music, and art-pop into something entirely new. Stop Making Sense is widely considered the greatest concert film ever made. Psycho Killer, Once in a Lifetime, and Burning Down the House are new wave classics.' },
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

// ===== Rich composer pages =====
import { COMPOSER_BIOS, type ComposerBio } from './composer-data'

function richComposerPage(c: ComposerBio): string {
  const timelineHTML = c.milestones.map(m => `
    <div class="tl-item">
      <div class="tl-dot">${m.icon}</div>
      <div class="tl-content">
        <div class="tl-year">${m.year}</div>
        <div class="tl-title">${m.title}</div>
        <div class="tl-desc">${m.desc}</div>
      </div>
    </div>`).join('')

  const worksHTML = c.keyWorks.map(w => `
    <div class="work-item">
      <span class="work-year">${w.year}</span>
      <span class="work-title">${w.title}</span>
      <span class="work-type">${w.type}</span>
    </div>`).join('')

  const relatedHTML = c.related.map(id => {
    const r = ARTISTS.find(a => a.id === id)
    return r ? `<a href="/artist/${r.id}.html" class="related-link">${r.fullName}</a>` : ''
  }).filter(Boolean).join('')

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${c.fullName} — Life, Works & Music | FreeMusic</title>
  <meta name="description" content="${c.tagline}. Listen to ${c.fullName} (${c.years}) for free. ${c.intro.slice(0, 120)}">
  <meta property="og:title" content="${c.fullName} — Life, Works & Free Music">
  <meta property="og:description" content="${c.tagline}">
  <meta name="theme-color" content="#111113">
  <link rel="canonical" href="https://freemusicapp.online/artist/${c.id}.html">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"Person","name":"${c.fullName}","birthDate":"${c.birthYear}","deathDate":"${c.deathYear || ''}","nationality":"${c.nationality}","description":"${c.tagline.replace(/"/g, '\\"')}","sameAs":"https://en.wikipedia.org/wiki/${c.fullName.replace(/ /g, '_')}"}</script>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:#111113;color:#f0f0f2;font-family:'Inter',system-ui,sans-serif;line-height:1.7;-webkit-font-smoothing:antialiased}
    .c{max-width:720px;margin:0 auto;padding:40px 24px 80px}
    a{color:#6ECE9E;text-decoration:none}a:hover{text-decoration:underline}
    .back{display:inline-flex;align-items:center;gap:6px;font-size:14px;font-weight:500;margin-bottom:32px}
    .hero{text-align:center;margin-bottom:48px}
    .hero h1{font-family:'DM Serif Display',serif;font-size:clamp(32px,6vw,48px);font-weight:700;margin-bottom:4px}
    .hero .sub{color:#9090a0;font-size:16px;margin-bottom:8px}
    .hero .tagline{font-style:italic;color:#c0c0cc;font-size:15px;max-width:500px;margin:0 auto 20px}
    .badge{display:inline-block;padding:4px 14px;border-radius:99px;font-size:12px;font-weight:600;background:#6ECE9E20;color:#6ECE9E;margin-bottom:16px}
    .meta{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;margin-bottom:8px}
    .meta span{font-size:13px;color:#9090a0}
    h2{font-family:'DM Serif Display',serif;font-size:24px;margin:40px 0 16px;color:#f0f0f2}
    h3{font-size:16px;font-weight:600;margin:24px 0 8px}
    p{font-size:15px;color:#c0c0cc;margin-bottom:16px}
    .cta{display:inline-flex;align-items:center;gap:8px;background:#6ECE9E;color:#111113;padding:14px 28px;border-radius:12px;font-weight:600;font-size:15px;margin:8px 0 0}
    .cta:hover{background:#5cb888;text-decoration:none}

    /* Timeline */
    .timeline{position:relative;padding-left:40px;margin:24px 0}
    .timeline::before{content:'';position:absolute;left:15px;top:0;bottom:0;width:2px;background:#2e2e35}
    .tl-item{position:relative;margin-bottom:24px}
    .tl-dot{position:absolute;left:-40px;width:30px;height:30px;border-radius:50%;background:#1a1a1e;border:2px solid #2e2e35;display:flex;align-items:center;justify-content:center;font-size:14px}
    .tl-year{font-size:12px;color:#6ECE9E;font-weight:600;margin-bottom:2px}
    .tl-title{font-size:14px;font-weight:600;color:#f0f0f2}
    .tl-desc{font-size:13px;color:#9090a0}

    /* Works */
    .works-grid{display:flex;flex-direction:column;gap:8px;margin:16px 0}
    .work-item{display:flex;align-items:center;gap:12px;padding:10px 14px;background:#1a1a1e;border-radius:10px;border:1px solid #2e2e35}
    .work-year{font-size:12px;color:#6ECE9E;font-weight:600;min-width:36px}
    .work-title{flex:1;font-size:14px;font-weight:500;color:#f0f0f2}
    .work-type{font-size:11px;color:#9090a0;background:#ffffff08;padding:2px 8px;border-radius:99px}

    /* Fun fact */
    .fact{background:#6ECE9E10;border-left:3px solid #6ECE9E;padding:16px 20px;border-radius:0 12px 12px 0;margin:24px 0}
    .fact-label{font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#6ECE9E;font-weight:600;margin-bottom:4px}
    .fact p{color:#c0c0cc;margin:0;font-size:14px;font-style:italic}

    /* Related */
    .related{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}
    .related-link{font-size:13px;padding:6px 14px;background:#1a1a1e;border:1px solid #2e2e35;border-radius:10px;color:#f0f0f2;font-weight:500}
    .related-link:hover{border-color:#6ECE9E;text-decoration:none}

    .footer{margin-top:48px;font-size:12px;color:#60606e;text-align:center}
    .footer a{color:#6ECE9E}
  </style>
</head>
<body>
<div class="c">
  <a href="/" class="back">&larr; Back to FreeMusic</a>

  <div class="hero">
    <div class="badge">${c.era} · ${c.nationality}</div>
    <h1>${c.fullName}</h1>
    <div class="sub">${c.years}</div>
    <div class="meta">
      <span>${c.nationality} ${c.genre === 'Classical' ? 'Composer' : 'Musician'}</span>
      <span>${c.era}</span>
      <span>${c.keyWorks.length} major works</span>
    </div>
    <p class="tagline">"${c.tagline}"</p>
    <a href="/" class="cta">
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd"/></svg>
      Play ${c.fullName.split(' ').pop()} on FreeMusic
    </a>
  </div>

  <p>${c.intro}</p>

  <h2>Early Life</h2>
  <p>${c.earlyLife}</p>

  <h2>Life Timeline</h2>
  <div class="timeline">${timelineHTML}
  </div>

  <h2>Career & Music</h2>
  <p>${c.career}</p>

  <h2>Key Works</h2>
  <div class="works-grid">${worksHTML}
  </div>

  <div class="fact">
    <div class="fact-label">Did you know?</div>
    <p>${c.funFact}</p>
  </div>

  <h2>Legacy</h2>
  <p>${c.legacy}</p>

  ${c.related.length > 0 ? `<h3>Related Composers</h3><div class="related">${relatedHTML}</div>` : ''}

  <h2>Listen Free</h2>
  <p>Stream ${c.fullName}'s music for free on FreeMusic. No ads, no subscription, no account required. All music is Creative Commons licensed or public domain.</p>
  <a href="/" class="cta">
    <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path fill-rule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clip-rule="evenodd"/></svg>
    Play on FreeMusic
  </a>

  <div class="footer">
    <a href="/legal/privacy.html">Privacy</a> · <a href="/legal/terms.html">Terms</a> · <a href="https://github.com/FreeMusicApp/freemusic">GitHub</a>
    <p style="margin-top:8px">&copy; 2026 FreeMusic. Open source, open music.</p>
  </div>
</div>
</body>
</html>`
}

// Override simple pages with rich ones where available
for (const bio of COMPOSER_BIOS) {
  writeFileSync(join(OUT, 'artist', `${bio.id}.html`), richComposerPage(bio))
}
console.log(`Enhanced ${COMPOSER_BIOS.length} composer pages with rich bios + timelines`)

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
