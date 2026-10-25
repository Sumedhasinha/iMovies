// src/data/movies.js
// Realistic movie mock data with high-res curated imagery, showtimes, and theatres

export const THEATRES = [
  {
    id: 'th-1',
    name: 'Starlight IMAX Cinema & Lounge',
    location: 'Downtown Cultural Hub, Screen 1 (Laser IMAX)',
    formats: ['IMAX 3D', 'Dolby Atmos', 'Laser 4K'],
    amenities: ['Recliner Seats', 'Gourmet Bar', 'Laser Projection']
  },
  {
    id: 'th-2',
    name: 'CineLuxe Dolby Cinema',
    location: 'Westfield Grand Avenue, Screen 4',
    formats: ['Dolby Cinema', 'Dolby Atmos 2D'],
    amenities: ['Dual 4K Laser', 'Heated Recliners', 'At-Seat Service']
  },
  {
    id: 'th-3',
    name: 'Metropolis 4DX Experience',
    location: 'Riverside Promenade, Screen 2',
    formats: ['4DX Motion', '3D Surround'],
    amenities: ['Motion Seats', 'Environmental Effects', 'Vibration']
  },
  {
    id: 'th-4',
    name: 'Royal Heritage Premiere Hall',
    location: 'Crown Plaza, Screen Gold',
    formats: ['Standard 2D', 'Dolby 7.1'],
    amenities: ['Plush Velvet Seats', 'Artisan Popcorn', 'Vintage Ambience']
  }
];

export const GENRES = [
  'All',
  'Action',
  'Sci-Fi',
  'Drama',
  'Thriller',
  'Adventure',
  'Animation',
  'Comedy',
  'Horror',
  'Crime'
];

export const LANGUAGES = [
  'All',
  'English',
  'Spanish',
  'Japanese',
  'French',
  'Korean',
  'German'
];

export const MOVIES = [
  {
    id: 'dune-part-two',
    title: 'Dune: Part Two',
    tagline: 'Long live the fighters.',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1920&auto=format&fit=crop',
    genre: ['Sci-Fi', 'Adventure', 'Action'],
    rating: 8.8,
    voteCount: '48.2k',
    duration: '2h 46m',
    durationMinutes: 166,
    language: 'English',
    releaseDate: '2024-03-01',
    status: 'now_showing',
    certificate: 'PG-13',
    director: 'Denis Villeneuve',
    synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
    cast: [
      { name: 'Timothée Chalamet', role: 'Paul Atreides', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
      { name: 'Zendaya', role: 'Chani', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' },
      { name: 'Rebecca Ferguson', role: 'Lady Jessica', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop' },
      { name: 'Javier Bardem', role: 'Stilgar', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' },
      { name: 'Austin Butler', role: 'Feyd-Rautha', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=200&auto=format&fit=crop' }
    ],
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    featured: true,
    theatres: [
      {
        theatreId: 'th-1',
        showtimes: [
          { time: '10:30 AM', format: 'IMAX 3D', priceStandard: 14.5, pricePremium: 19.5, priceVIP: 26.0 },
          { time: '02:15 PM', format: 'IMAX 3D', priceStandard: 16.0, pricePremium: 21.0, priceVIP: 28.0 },
          { time: '06:30 PM', format: 'Laser IMAX', priceStandard: 17.5, pricePremium: 22.5, priceVIP: 30.0 },
          { time: '10:15 PM', format: 'IMAX 3D', priceStandard: 16.0, pricePremium: 21.0, priceVIP: 28.0 }
        ]
      },
      {
        theatreId: 'th-2',
        showtimes: [
          { time: '11:45 AM', format: 'Dolby Cinema', priceStandard: 15.0, pricePremium: 19.0, priceVIP: 25.0 },
          { time: '04:00 PM', format: 'Dolby Cinema', priceStandard: 16.5, pricePremium: 21.5, priceVIP: 27.5 },
          { time: '08:15 PM', format: 'Dolby Cinema', priceStandard: 18.0, pricePremium: 23.0, priceVIP: 29.0 }
        ]
      },
      {
        theatreId: 'th-3',
        showtimes: [
          { time: '01:00 PM', format: '4DX Motion', priceStandard: 18.0, pricePremium: 23.0, priceVIP: 31.0 },
          { time: '07:30 PM', format: '4DX Motion', priceStandard: 20.0, pricePremium: 25.0, priceVIP: 33.0 }
        ]
      }
    ]
  },
  {
    id: 'oppenheimer',
    title: 'Oppenheimer',
    tagline: 'The world forever changes.',
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop',
    genre: ['Drama', 'Biography', 'History'],
    rating: 8.9,
    voteCount: '52.4k',
    duration: '3h 00m',
    durationMinutes: 180,
    language: 'English',
    releaseDate: '2023-07-21',
    status: 'now_showing',
    certificate: 'R',
    director: 'Christopher Nolan',
    synopsis: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, unraveling the moral weight of technological supremacy.',
    cast: [
      { name: 'Cillian Murphy', role: 'J. Robert Oppenheimer', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop' },
      { name: 'Emily Blunt', role: 'Katherine Oppenheimer', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop' },
      { name: 'Matt Damon', role: 'Leslie Groves', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=200&auto=format&fit=crop' },
      { name: 'Robert Downey Jr.', role: 'Lewis Strauss', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' }
    ],
    trailerUrl: 'https://www.youtube.com/embed/uYPbbksJxIg',
    featured: true,
    theatres: [
      {
        theatreId: 'th-1',
        showtimes: [
          { time: '11:00 AM', format: '70mm IMAX', priceStandard: 15.0, pricePremium: 20.0, priceVIP: 27.0 },
          { time: '03:45 PM', format: '70mm IMAX', priceStandard: 17.0, pricePremium: 22.0, priceVIP: 29.0 },
          { time: '08:00 PM', format: '70mm IMAX', priceStandard: 18.5, pricePremium: 24.0, priceVIP: 31.0 }
        ]
      },
      {
        theatreId: 'th-4',
        showtimes: [
          { time: '01:30 PM', format: 'Dolby 7.1', priceStandard: 12.0, pricePremium: 16.0, priceVIP: 22.0 },
          { time: '06:00 PM', format: 'Dolby 7.1', priceStandard: 13.5, pricePremium: 17.5, priceVIP: 24.0 }
        ]
      }
    ]
  },
  {
    id: 'cyber-odyssey-2088',
    title: 'Cyber Odyssey: Neon Protocol',
    tagline: 'In a city of algorithms, humanity is a glitch.',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1920&auto=format&fit=crop',
    genre: ['Sci-Fi', 'Action', 'Thriller'],
    rating: 8.6,
    voteCount: '31.1k',
    duration: '2h 18m',
    durationMinutes: 138,
    language: 'English',
    releaseDate: '2024-04-12',
    status: 'trending',
    certificate: 'R',
    director: 'Klara Vance',
    synopsis: 'When an enigmatic memory broker stumbles upon a clandestine consciousness vault in Neo-Kyoto, she must navigate rogue corporate enforcers and artificial insurgencies to preserve the last unfiltered human memoirs.',
    cast: [
      { name: 'Elena Rostova', role: 'Kira Jax', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' },
      { name: 'Kenji Sato', role: 'Dax Mercer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
      { name: 'Marcus Sterling', role: 'Director Vance', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' }
    ],
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    featured: true,
    theatres: [
      {
        theatreId: 'th-1',
        showtimes: [
          { time: '12:30 PM', format: 'Laser IMAX', priceStandard: 15.0, pricePremium: 20.0, priceVIP: 27.0 },
          { time: '05:15 PM', format: 'Laser IMAX', priceStandard: 17.0, pricePremium: 22.0, priceVIP: 29.0 },
          { time: '09:45 PM', format: 'Laser IMAX', priceStandard: 16.5, pricePremium: 21.5, priceVIP: 28.5 }
        ]
      },
      {
        theatreId: 'th-3',
        showtimes: [
          { time: '03:15 PM', format: '4DX Motion', priceStandard: 19.0, pricePremium: 24.0, priceVIP: 32.0 },
          { time: '08:45 PM', format: '4DX Motion', priceStandard: 21.0, pricePremium: 26.0, priceVIP: 34.0 }
        ]
      }
    ]
  },
  {
    id: 'interstellar-echoes',
    title: 'Interstellar: Echoes of Eternity',
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    poster: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop',
    genre: ['Sci-Fi', 'Drama', 'Adventure'],
    rating: 9.1,
    voteCount: '78.9k',
    duration: '2h 55m',
    durationMinutes: 175,
    language: 'English',
    releaseDate: '2024-05-18',
    status: 'trending',
    certificate: 'PG-13',
    director: 'Christopher Nolan',
    synopsis: 'A special anniversary re-release featuring remastered deep-space footage and an immersive Dolby Atmos audio mix that plunges viewers into the gravitational vortex of Gargantua.',
    cast: [
      { name: 'Matthew McConaughey', role: 'Cooper', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop' },
      { name: 'Anne Hathaway', role: 'Brand', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop' },
      { name: 'Jessica Chastain', role: 'Murph', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' }
    ],
    trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E',
    featured: false,
    theatres: [
      {
        theatreId: 'th-1',
        showtimes: [
          { time: '01:15 PM', format: 'IMAX 70mm', priceStandard: 16.0, pricePremium: 21.0, priceVIP: 28.0 },
          { time: '07:00 PM', format: 'IMAX 70mm', priceStandard: 18.0, pricePremium: 23.0, priceVIP: 30.0 }
        ]
      },
      {
        theatreId: 'th-2',
        showtimes: [
          { time: '03:30 PM', format: 'Dolby Cinema', priceStandard: 15.0, pricePremium: 19.5, priceVIP: 26.0 },
          { time: '08:30 PM', format: 'Dolby Cinema', priceStandard: 16.5, pricePremium: 21.0, priceVIP: 27.5 }
        ]
      }
    ]
  },
  {
    id: 'silent-depths',
    title: 'Silent Depths',
    tagline: 'Beneath the ice, the truth breathes.',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=1920&auto=format&fit=crop',
    genre: ['Thriller', 'Drama', 'Mystery'],
    rating: 8.3,
    voteCount: '19.4k',
    duration: '2h 05m',
    durationMinutes: 125,
    language: 'French',
    releaseDate: '2024-02-14',
    status: 'now_showing',
    certificate: 'R',
    director: 'Camille Laurent',
    synopsis: 'An oceanographic team stationed under the Greenland ice shelf detects an rhythmic acoustic pattern emanating from miles below the oceanic crust, triggering psychological panic and geopolitical espionage.',
    cast: [
      { name: 'Léa Seydoux', role: 'Dr. Juliette Moreau', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop' },
      { name: 'Mathieu Amalric', role: 'Captain Bernard', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' }
    ],
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    featured: false,
    theatres: [
      {
        theatreId: 'th-2',
        showtimes: [
          { time: '12:00 PM', format: 'Dolby Atmos', priceStandard: 13.5, pricePremium: 17.5, priceVIP: 23.0 },
          { time: '05:45 PM', format: 'Dolby Atmos', priceStandard: 15.0, pricePremium: 19.0, priceVIP: 25.0 }
        ]
      },
      {
        theatreId: 'th-4',
        showtimes: [
          { time: '03:15 PM', format: 'Standard 2D', priceStandard: 11.5, pricePremium: 15.0, priceVIP: 20.0 },
          { time: '08:00 PM', format: 'Standard 2D', priceStandard: 13.0, pricePremium: 16.5, priceVIP: 22.0 }
        ]
      }
    ]
  },
  {
    id: 'tokyo-shadows',
    title: 'Tokyo Shadows: Ronin 0',
    tagline: 'Honor has no expiration date.',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1920&auto=format&fit=crop',
    genre: ['Action', 'Crime', 'Thriller'],
    rating: 8.7,
    voteCount: '27.8k',
    duration: '2h 12m',
    durationMinutes: 132,
    language: 'Japanese',
    releaseDate: '2024-03-29',
    status: 'now_showing',
    certificate: 'R',
    director: 'Takashi Yamazaki',
    synopsis: 'A retired syndicate bodyguard is pulled back onto the neon-drenched streets of Shinjuku when a young whistleblower seeks asylum from both the Yakuza and a corrupt global surveillance cartel.',
    cast: [
      { name: 'Hiroyuki Sanada', role: 'Kenji Arashi', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
      { name: 'Rinko Kikuchi', role: 'Naomi Takeda', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' }
    ],
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    featured: false,
    theatres: [
      {
        theatreId: 'th-1',
        showtimes: [
          { time: '02:00 PM', format: 'IMAX 2D', priceStandard: 14.5, pricePremium: 19.5, priceVIP: 26.0 },
          { time: '07:15 PM', format: 'IMAX 2D', priceStandard: 16.5, pricePremium: 21.5, priceVIP: 28.5 },
          { time: '10:45 PM', format: 'IMAX 2D', priceStandard: 15.0, pricePremium: 19.5, priceVIP: 26.0 }
        ]
      },
      {
        theatreId: 'th-3',
        showtimes: [
          { time: '04:30 PM', format: '4DX Motion', priceStandard: 18.5, pricePremium: 23.5, priceVIP: 31.0 }
        ]
      }
    ]
  },
  {
    id: 'chronicles-of-elysium',
    title: 'Chronicles of Elysium',
    tagline: 'Beyond the stars, an ancient sanctuary awakens.',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop',
    genre: ['Animation', 'Adventure', 'Sci-Fi'],
    rating: 8.5,
    voteCount: '22.6k',
    duration: '1h 54m',
    durationMinutes: 114,
    language: 'English',
    releaseDate: '2024-06-07',
    status: 'coming_soon',
    certificate: 'PG',
    director: 'Hayao Miyazaki & Peter Sohn',
    synopsis: 'An apprentice stellar cartographer ventures across floating sky-islands to restore the sacred chronometer keeping three cosmic dimensions in celestial alignment.',
    cast: [
      { name: 'Hailee Steinfeld', role: 'Lyra Solis (voice)', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop' },
      { name: 'Steven Yeun', role: 'Kaelen (voice)', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' }
    ],
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    featured: false,
    theatres: [
      {
        theatreId: 'th-1',
        showtimes: [
          { time: '10:00 AM', format: 'Laser 3D', priceStandard: 13.0, pricePremium: 17.0, priceVIP: 23.0 },
          { time: '01:30 PM', format: 'Laser 3D', priceStandard: 14.5, pricePremium: 18.5, priceVIP: 25.0 }
        ]
      }
    ]
  },
  {
    id: 'the-last-heist',
    title: 'The Riviera Heist',
    tagline: 'Stealing diamonds is easy. Surviving Monaco is not.',
    poster: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1920&auto=format&fit=crop',
    genre: ['Comedy', 'Crime', 'Action'],
    rating: 7.9,
    voteCount: '15.3k',
    duration: '1h 48m',
    durationMinutes: 108,
    language: 'Spanish',
    releaseDate: '2024-04-05',
    status: 'now_showing',
    certificate: 'PG-13',
    director: 'Daniel Calparsoro',
    synopsis: 'A charismatic troupe of Iberian art forgers target an ultra-secure subterranean vault during the Monaco Grand Prix, only to find the target has already been substituted with an elaborate counterfeit.',
    cast: [
      { name: 'Pedro Pascal', role: 'Rafael Vega', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop' },
      { name: 'Ana de Armas', role: 'Sofia Rossi', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' }
    ],
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    featured: false,
    theatres: [
      {
        theatreId: 'th-2',
        showtimes: [
          { time: '02:30 PM', format: 'Dolby Atmos', priceStandard: 13.0, pricePremium: 17.0, priceVIP: 23.0 },
          { time: '07:45 PM', format: 'Dolby Atmos', priceStandard: 15.5, pricePremium: 19.5, priceVIP: 26.0 }
        ]
      },
      {
        theatreId: 'th-4',
        showtimes: [
          { time: '05:00 PM', format: 'Standard 2D', priceStandard: 12.0, pricePremium: 16.0, priceVIP: 21.0 },
          { time: '09:30 PM', format: 'Standard 2D', priceStandard: 13.5, pricePremium: 17.5, priceVIP: 23.0 }
        ]
      }
    ]
  },
  {
    id: 'echoes-in-the-dark',
    title: 'Echoes in the Dark',
    tagline: 'Some frequencies should never be answered.',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop',
    genre: ['Horror', 'Mystery', 'Thriller'],
    rating: 7.7,
    voteCount: '18.1k',
    duration: '1h 42m',
    durationMinutes: 102,
    language: 'English',
    releaseDate: '2024-05-31',
    status: 'coming_soon',
    certificate: 'R',
    director: 'Ari Aster',
    synopsis: 'A sound archivist isolating radio recordings from a decommissioned Cold War bunker begins hearing phonetic messages mimicking the voices of his deceased family members.',
    cast: [
      { name: 'Toni Collette', role: 'Clara Vance', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop' },
      { name: 'Willem Dafoe', role: 'Prof. Eldridge', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' }
    ],
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    featured: false,
    theatres: [
      {
        theatreId: 'th-1',
        showtimes: [
          { time: '09:30 PM', format: 'Dolby Atmos', priceStandard: 15.0, pricePremium: 19.0, priceVIP: 26.0 }
        ]
      }
    ]
  },
  {
    id: 'quantum-protocol',
    title: 'Quantum Protocol',
    tagline: 'Time is the ultimate currency.',
    poster: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1920&auto=format&fit=crop',
    genre: ['Sci-Fi', 'Thriller', 'Action'],
    rating: 8.4,
    voteCount: '24.7k',
    duration: '2h 20m',
    durationMinutes: 140,
    language: 'English',
    releaseDate: '2024-07-19',
    status: 'coming_soon',
    certificate: 'PG-13',
    director: 'Guillermo del Toro',
    synopsis: 'When a temporal experiment creates quantum anomalies across five major world capitals, a dissident team of temporal physicists must synchronize their timelines to avert universal collapse.',
    cast: [
      { name: 'Michael B. Jordan', role: 'Marcus Thorne', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop' },
      { name: 'Lupita Nyong’o', role: 'Dr. Selene Voss', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' }
    ],
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    featured: false,
    theatres: [
      {
        theatreId: 'th-1',
        showtimes: [
          { time: '11:30 AM', format: 'IMAX 3D', priceStandard: 16.0, pricePremium: 21.0, priceVIP: 28.0 },
          { time: '04:45 PM', format: 'IMAX 3D', priceStandard: 17.5, pricePremium: 22.5, priceVIP: 30.0 }
        ]
      }
    ]
  },
  {
    id: 'neon-velocity',
    title: 'Neon Velocity: Apex',
    tagline: 'Zero speed limits. Zero second chances.',
    poster: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1920&auto=format&fit=crop',
    genre: ['Action', 'Thriller'],
    rating: 8.1,
    voteCount: '34.2k',
    duration: '2h 04m',
    durationMinutes: 124,
    language: 'English',
    releaseDate: '2024-01-26',
    status: 'now_showing',
    certificate: 'PG-13',
    director: 'Joseph Kosinski',
    synopsis: 'In an underground hybrid racing tournament fought across elevated super-highways of Dubai and Singapore, an exiled telemetry engineer builds an experimental hydro-turbine racecraft to conquer the Apex Cup.',
    cast: [
      { name: 'John Boyega', role: 'Chase Miller', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' },
      { name: 'Florence Pugh', role: 'Vesper Holt', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop' }
    ],
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    featured: false,
    theatres: [
      {
        theatreId: 'th-3',
        showtimes: [
          { time: '01:45 PM', format: '4DX Motion', priceStandard: 18.0, pricePremium: 23.0, priceVIP: 30.0 },
          { time: '06:15 PM', format: '4DX Motion', priceStandard: 20.0, pricePremium: 25.0, priceVIP: 33.0 },
          { time: '10:00 PM', format: '4DX Motion', priceStandard: 19.0, pricePremium: 24.0, priceVIP: 31.0 }
        ]
      },
      {
        theatreId: 'th-1',
        showtimes: [
          { time: '03:30 PM', format: 'Laser 4K', priceStandard: 14.0, pricePremium: 18.0, priceVIP: 24.0 }
        ]
      }
    ]
  },
  {
    id: 'whispers-of-seoul',
    title: 'Whispers of Seoul',
    tagline: 'Every secret has its echo in the rain.',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1920&auto=format&fit=crop',
    genre: ['Drama', 'Crime', 'Mystery'],
    rating: 8.8,
    voteCount: '29.3k',
    duration: '2h 15m',
    durationMinutes: 135,
    language: 'Korean',
    releaseDate: '2024-02-09',
    status: 'trending',
    certificate: 'R',
    director: 'Bong Joon-ho',
    synopsis: 'A tenacious criminal defense attorney uncovers an intricate collusion between an elite architectural dynasty and city water engineers after a mysterious sinkhole swallows a historic landmark.',
    cast: [
      { name: 'Song Kang-ho', role: 'Detective Han', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
      { name: 'Choi Woo-shik', role: 'Min-jun', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop' }
    ],
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    featured: false,
    theatres: [
      {
        theatreId: 'th-2',
        showtimes: [
          { time: '01:00 PM', format: 'Dolby Atmos', priceStandard: 14.0, pricePremium: 18.5, priceVIP: 25.0 },
          { time: '06:30 PM', format: 'Dolby Atmos', priceStandard: 16.0, pricePremium: 20.5, priceVIP: 27.0 }
        ]
      },
      {
        theatreId: 'th-4',
        showtimes: [
          { time: '04:15 PM', format: 'Standard 2D', priceStandard: 12.0, pricePremium: 15.5, priceVIP: 21.0 },
          { time: '08:45 PM', format: 'Standard 2D', priceStandard: 13.5, pricePremium: 17.0, priceVIP: 23.0 }
        ]
      }
    ]
  },
  {
    id: 'the-art-of-laughter',
    title: 'The Grand Masquerade',
    tagline: 'When high society plays, the laughs are strictly confidential.',
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1920&auto=format&fit=crop',
    genre: ['Comedy', 'Drama'],
    rating: 7.8,
    voteCount: '12.8k',
    duration: '1h 52m',
    durationMinutes: 112,
    language: 'English',
    releaseDate: '2024-03-15',
    status: 'now_showing',
    certificate: 'PG-13',
    director: 'Wes Anderson',
    synopsis: 'During an eccentric billionaire’s Venetian ball, seven imposter guests accidentally attempt the exact same social-climbing deception on each other.',
    cast: [
      { name: 'Adrien Brody', role: 'Count Lorenzo', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' },
      { name: 'Saoirse Ronan', role: 'Agathe Vance', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop' }
    ],
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    featured: false,
    theatres: [
      {
        theatreId: 'th-4',
        showtimes: [
          { time: '02:00 PM', format: 'Standard 2D', priceStandard: 12.0, pricePremium: 16.0, priceVIP: 22.0 },
          { time: '06:15 PM', format: 'Standard 2D', priceStandard: 13.5, pricePremium: 17.5, priceVIP: 24.0 }
        ]
      }
    ]
  },
  {
    id: 'shadow-of-bavaria',
    title: 'Shadow of Bavaria',
    tagline: 'The mountains remember every betrayal.',
    poster: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=1920&auto=format&fit=crop',
    genre: ['Thriller', 'Crime', 'Drama'],
    rating: 8.2,
    voteCount: '16.5k',
    duration: '2h 08m',
    durationMinutes: 128,
    language: 'German',
    releaseDate: '2024-04-20',
    status: 'now_showing',
    certificate: 'R',
    director: 'Florian Henckel von Donnersmarck',
    synopsis: 'A veteran Alpine search-and-rescue leader investigates the vanishing of a multinational fintech executive, uncovering deep-rooted secrets hidden in a remote mountain sanctuary.',
    cast: [
      { name: 'Daniel Brühl', role: 'Lukas Steiner', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop' },
      { name: 'Paula Beer', role: 'Greta Meyer', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' }
    ],
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    featured: false,
    theatres: [
      {
        theatreId: 'th-2',
        showtimes: [
          { time: '04:00 PM', format: 'Dolby Atmos', priceStandard: 14.0, pricePremium: 18.0, priceVIP: 24.5 },
          { time: '08:45 PM', format: 'Dolby Atmos', priceStandard: 15.5, pricePremium: 19.5, priceVIP: 26.0 }
        ]
      }
    ]
  }
];
