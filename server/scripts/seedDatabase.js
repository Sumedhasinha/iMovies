// server/scripts/seedDatabase.js
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../src/config/db.js';
import User from '../src/models/User.js';
import Movie from '../src/models/Movie.js';
import Theatre from '../src/models/Theatre.js';
import Showtime from '../src/models/Showtime.js';
import Booking from '../src/models/Booking.js';
import { generateBookingReference } from '../src/utils/generateBookingReference.js';

// Seed Theatres Data
const THEATRES_SEED = [
  {
    slug: 'th-1',
    name: 'Starlight IMAX Cinema & Lounge',
    address: '100 Cultural Boulevard, Suite 400',
    location: 'Downtown Cultural Hub, Screen 1 (Laser IMAX)',
    city: 'Downtown',
    formats: ['IMAX 3D', 'Dolby Atmos', 'Laser 4K'],
    amenities: ['Recliner Seats', 'Gourmet Bar', 'Laser Projection'],
    screens: [
      {
        screenNumber: 1,
        name: 'Screen 1 (Laser IMAX)',
        format: 'Laser IMAX',
        totalSeats: 108,
        seatLayout: {
          rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J'],
          columns: 12,
          tiers: {
            A: 'standard',
            B: 'standard',
            C: 'standard',
            D: 'premium',
            E: 'premium',
            F: 'premium',
            G: 'premium',
            H: 'vip',
            J: 'vip'
          }
        }
      }
    ]
  },
  {
    slug: 'th-2',
    name: 'CineLuxe Dolby Cinema',
    address: '450 Westfield Grand Avenue',
    location: 'Westfield Grand Avenue, Screen 4',
    city: 'Downtown',
    formats: ['Dolby Cinema', 'Dolby Atmos 2D'],
    amenities: ['Dual 4K Laser', 'Heated Recliners', 'At-Seat Service'],
    screens: [
      {
        screenNumber: 4,
        name: 'Screen 4 (Dolby Cinema)',
        format: 'Dolby Cinema',
        totalSeats: 108,
        seatLayout: {
          rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J'],
          columns: 12,
          tiers: {
            A: 'standard',
            B: 'standard',
            C: 'standard',
            D: 'premium',
            E: 'premium',
            F: 'premium',
            G: 'premium',
            H: 'vip',
            J: 'vip'
          }
        }
      }
    ]
  },
  {
    slug: 'th-3',
    name: 'Metropolis 4DX Experience',
    address: '780 Riverside Promenade',
    location: 'Riverside Promenade, Screen 2',
    city: 'Riverside',
    formats: ['4DX Motion', '3D Surround'],
    amenities: ['Motion Seats', 'Environmental Effects', 'Vibration'],
    screens: [
      {
        screenNumber: 2,
        name: 'Screen 2 (4DX Motion)',
        format: '4DX Motion',
        totalSeats: 108,
        seatLayout: {
          rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J'],
          columns: 12,
          tiers: {
            A: 'standard',
            B: 'standard',
            C: 'standard',
            D: 'premium',
            E: 'premium',
            F: 'premium',
            G: 'premium',
            H: 'vip',
            J: 'vip'
          }
        }
      }
    ]
  },
  {
    slug: 'th-4',
    name: 'Royal Heritage Premiere Hall',
    address: '12 Crown Plaza Gardens',
    location: 'Crown Plaza, Screen Gold',
    city: 'Crown Heights',
    formats: ['Standard 2D', 'Dolby 7.1'],
    amenities: ['Plush Velvet Seats', 'Artisan Popcorn', 'Vintage Ambience'],
    screens: [
      {
        screenNumber: 1,
        name: 'Screen Gold',
        format: 'Standard 2D',
        totalSeats: 108,
        seatLayout: {
          rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J'],
          columns: 12,
          tiers: {
            A: 'standard',
            B: 'standard',
            C: 'standard',
            D: 'premium',
            E: 'premium',
            F: 'premium',
            G: 'premium',
            H: 'vip',
            J: 'vip'
          }
        }
      }
    ]
  }
];

// Seed 14 Rich Movies Data
const MOVIES_SEED = [
  {
    slug: 'dune-part-two',
    title: 'Dune: Part Two',
    tagline: 'Long live the fighters.',
    posterUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1920&auto=format&fit=crop',
    genres: ['Sci-Fi', 'Adventure', 'Action'],
    rating: 8.8,
    voteCount: '48.2k',
    durationMinutes: 166,
    duration: '2h 46m',
    language: 'English',
    releaseDate: new Date('2024-03-01'),
    releaseStatus: 'now_showing',
    certificate: 'PG-13',
    director: 'Denis Villeneuve',
    synopsis: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family. Facing a choice between the love of his life and the fate of the universe, he endeavors to prevent a terrible future only he can foresee.',
    cast: [
      { name: 'Timothée Chalamet', role: 'Paul Atreides', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' },
      { name: 'Zendaya', role: 'Chani', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' },
      { name: 'Rebecca Ferguson', role: 'Lady Jessica', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop' },
      { name: 'Javier Bardem', role: 'Stilgar', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' }
    ],
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    featured: true,
    isActive: true
  },
  {
    slug: 'oppenheimer',
    title: 'Oppenheimer',
    tagline: 'The world forever changes.',
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop',
    genres: ['Drama', 'Biography', 'History'],
    rating: 8.9,
    voteCount: '52.4k',
    durationMinutes: 180,
    duration: '3h 00m',
    language: 'English',
    releaseDate: new Date('2023-07-21'),
    releaseStatus: 'now_showing',
    certificate: 'R',
    director: 'Christopher Nolan',
    synopsis: 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb during World War II, unraveling the moral weight of technological supremacy.',
    cast: [
      { name: 'Cillian Murphy', role: 'J. Robert Oppenheimer', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop' },
      { name: 'Emily Blunt', role: 'Katherine Oppenheimer', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop' },
      { name: 'Matt Damon', role: 'Leslie Groves', avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=200&auto=format&fit=crop' }
    ],
    trailerUrl: 'https://www.youtube.com/embed/uYPbbksJxIg',
    featured: true,
    isActive: true
  },
  {
    slug: 'cyber-odyssey-2088',
    title: 'Cyber Odyssey: Neon Protocol',
    tagline: 'In a city of algorithms, humanity is a glitch.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1920&auto=format&fit=crop',
    genres: ['Sci-Fi', 'Action', 'Thriller'],
    rating: 8.6,
    voteCount: '31.1k',
    durationMinutes: 138,
    duration: '2h 18m',
    language: 'English',
    releaseDate: new Date('2024-04-12'),
    releaseStatus: 'trending',
    certificate: 'R',
    director: 'Klara Vance',
    synopsis: 'When an enigmatic memory broker stumbles upon a clandestine consciousness vault in Neo-Kyoto, she must navigate rogue corporate enforcers and artificial insurgencies to preserve the last unfiltered human memoirs.',
    cast: [
      { name: 'Elena Rostova', role: 'Kira Jax', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop' },
      { name: 'Kenji Sato', role: 'Dax Mercer', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' }
    ],
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    featured: true,
    isActive: true
  },
  {
    slug: 'interstellar-echoes',
    title: 'Interstellar: Echoes of Eternity',
    tagline: 'Mankind was born on Earth. It was never meant to die here.',
    posterUrl: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1920&auto=format&fit=crop',
    genres: ['Sci-Fi', 'Drama', 'Adventure'],
    rating: 9.1,
    voteCount: '78.9k',
    durationMinutes: 175,
    duration: '2h 55m',
    language: 'English',
    releaseDate: new Date('2024-05-18'),
    releaseStatus: 'trending',
    certificate: 'PG-13',
    director: 'Christopher Nolan',
    synopsis: 'A special anniversary re-release featuring remastered deep-space footage and an immersive Dolby Atmos audio mix that plunges viewers into the gravitational vortex of Gargantua.',
    cast: [
      { name: 'Matthew McConaughey', role: 'Cooper', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop' },
      { name: 'Anne Hathaway', role: 'Brand', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop' }
    ],
    trailerUrl: 'https://www.youtube.com/embed/zSWdZVtXT7E',
    featured: false,
    isActive: true
  },
  {
    slug: 'silent-depths',
    title: 'Silent Depths',
    tagline: 'Beneath the ice, the truth breathes.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=1920&auto=format&fit=crop',
    genres: ['Thriller', 'Drama', 'Mystery'],
    rating: 8.3,
    voteCount: '19.4k',
    durationMinutes: 125,
    duration: '2h 05m',
    language: 'French',
    releaseDate: new Date('2024-02-14'),
    releaseStatus: 'now_showing',
    certificate: 'R',
    director: 'Camille Laurent',
    synopsis: 'An oceanographic team stationed under the Greenland ice shelf detects a rhythmic acoustic pattern emanating from miles below the oceanic crust, triggering psychological panic and geopolitical espionage.',
    cast: [
      { name: 'Léa Seydoux', role: 'Dr. Juliette Moreau', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop' }
    ],
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    featured: false,
    isActive: true
  },
  {
    slug: 'tokyo-shadows',
    title: 'Tokyo Shadows: Ronin 0',
    tagline: 'Honor has no expiration date.',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1920&auto=format&fit=crop',
    genres: ['Action', 'Crime', 'Thriller'],
    rating: 8.7,
    voteCount: '27.8k',
    durationMinutes: 132,
    duration: '2h 12m',
    language: 'Japanese',
    releaseDate: new Date('2024-03-29'),
    releaseStatus: 'now_showing',
    certificate: 'R',
    director: 'Takashi Yamazaki',
    synopsis: 'A retired syndicate bodyguard is pulled back onto the neon-drenched streets of Shinjuku when a young whistleblower seeks asylum from both the Yakuza and a corrupt global surveillance cartel.',
    cast: [
      { name: 'Hiroyuki Sanada', role: 'Kenji Arashi', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' }
    ],
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    featured: false,
    isActive: true
  },
  {
    slug: 'chronicles-of-elysium',
    title: 'Chronicles of Elysium',
    tagline: 'Beyond the stars, an ancient sanctuary awakens.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop',
    genres: ['Animation', 'Adventure', 'Sci-Fi'],
    rating: 8.5,
    voteCount: '22.6k',
    durationMinutes: 114,
    duration: '1h 54m',
    language: 'English',
    releaseDate: new Date('2024-06-07'),
    releaseStatus: 'coming_soon',
    certificate: 'PG',
    director: 'Hayao Miyazaki',
    synopsis: 'An apprentice stellar cartographer ventures across floating sky-islands to restore the sacred chronometer keeping three cosmic dimensions in celestial alignment.',
    cast: [
      { name: 'Hailee Steinfeld', role: 'Lyra Solis (voice)', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop' }
    ],
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    featured: false,
    isActive: true
  },
  {
    slug: 'the-last-heist',
    title: 'The Riviera Heist',
    tagline: 'Stealing diamonds is easy. Surviving Monaco is not.',
    posterUrl: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1920&auto=format&fit=crop',
    genres: ['Comedy', 'Crime', 'Action'],
    rating: 7.9,
    voteCount: '15.3k',
    durationMinutes: 108,
    duration: '1h 48m',
    language: 'Spanish',
    releaseDate: new Date('2024-04-05'),
    releaseStatus: 'now_showing',
    certificate: 'PG-13',
    director: 'Daniel Calparsoro',
    synopsis: 'A charismatic troupe of Iberian art forgers target an ultra-secure subterranean vault during the Monaco Grand Prix, only to find the target has already been substituted with an elaborate counterfeit.',
    cast: [
      { name: 'Pedro Pascal', role: 'Rafael Vega', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop' }
    ],
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    featured: false,
    isActive: true
  },
  {
    slug: 'echoes-in-the-dark',
    title: 'Echoes in the Dark',
    tagline: 'Some frequencies should never be answered.',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop',
    genres: ['Horror', 'Mystery', 'Thriller'],
    rating: 7.7,
    voteCount: '18.1k',
    durationMinutes: 102,
    duration: '1h 42m',
    language: 'English',
    releaseDate: new Date('2024-05-31'),
    releaseStatus: 'coming_soon',
    certificate: 'R',
    director: 'Ari Aster',
    synopsis: 'A sound archivist isolating radio recordings from a decommissioned Cold War bunker begins hearing phonetic messages mimicking the voices of his deceased family members.',
    cast: [
      { name: 'Toni Collette', role: 'Clara Vance', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop' }
    ],
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    featured: false,
    isActive: true
  },
  {
    slug: 'quantum-protocol',
    title: 'Quantum Protocol',
    tagline: 'Time is the ultimate currency.',
    posterUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1920&auto=format&fit=crop',
    genres: ['Sci-Fi', 'Thriller', 'Action'],
    rating: 8.4,
    voteCount: '24.7k',
    durationMinutes: 140,
    duration: '2h 20m',
    language: 'English',
    releaseDate: new Date('2024-07-19'),
    releaseStatus: 'coming_soon',
    certificate: 'PG-13',
    director: 'Guillermo del Toro',
    synopsis: 'When a temporal experiment creates quantum anomalies across five major world capitals, a dissident team of temporal physicists must synchronize their timelines to avert universal collapse.',
    cast: [
      { name: 'Michael B. Jordan', role: 'Marcus Thorne', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop' }
    ],
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    featured: false,
    isActive: true
  },
  {
    slug: 'neon-velocity',
    title: 'Neon Velocity: Apex',
    tagline: 'Zero speed limits. Zero second chances.',
    posterUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1920&auto=format&fit=crop',
    genres: ['Action', 'Thriller'],
    rating: 8.1,
    voteCount: '34.2k',
    durationMinutes: 124,
    duration: '2h 04m',
    language: 'English',
    releaseDate: new Date('2024-01-26'),
    releaseStatus: 'now_showing',
    certificate: 'PG-13',
    director: 'Joseph Kosinski',
    synopsis: 'In an underground hybrid racing tournament fought across elevated super-highways of Dubai and Singapore, an exiled telemetry engineer builds an experimental hydro-turbine racecraft to conquer the Apex Cup.',
    cast: [
      { name: 'John Boyega', role: 'Chase Miller', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' }
    ],
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    featured: false,
    isActive: true
  },
  {
    slug: 'whispers-of-seoul',
    title: 'Whispers of Seoul',
    tagline: 'Every secret has its echo in the rain.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1920&auto=format&fit=crop',
    genres: ['Drama', 'Crime', 'Mystery'],
    rating: 8.8,
    voteCount: '29.3k',
    durationMinutes: 135,
    duration: '2h 15m',
    language: 'Korean',
    releaseDate: new Date('2024-02-09'),
    releaseStatus: 'trending',
    certificate: 'R',
    director: 'Bong Joon-ho',
    synopsis: 'A tenacious criminal defense attorney uncovers an intricate collusion between an elite architectural dynasty and city water engineers after a mysterious sinkhole swallows a historic landmark.',
    cast: [
      { name: 'Song Kang-ho', role: 'Detective Han', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop' }
    ],
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    featured: false,
    isActive: true
  },
  {
    slug: 'the-art-of-laughter',
    title: 'The Grand Masquerade',
    tagline: 'When high society plays, the laughs are strictly confidential.',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1920&auto=format&fit=crop',
    genres: ['Comedy', 'Drama'],
    rating: 7.8,
    voteCount: '12.8k',
    durationMinutes: 112,
    duration: '1h 52m',
    language: 'English',
    releaseDate: new Date('2024-03-15'),
    releaseStatus: 'now_showing',
    certificate: 'PG-13',
    director: 'Wes Anderson',
    synopsis: 'During an eccentric billionaire’s Venetian ball, seven imposter guests accidentally attempt the exact same social-climbing deception on each other.',
    cast: [
      { name: 'Adrien Brody', role: 'Count Lorenzo', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop' }
    ],
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    featured: false,
    isActive: true
  },
  {
    slug: 'shadow-of-bavaria',
    title: 'Shadow of Bavaria',
    tagline: 'The mountains remember every betrayal.',
    posterUrl: 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=800&auto=format&fit=crop',
    backdropUrl: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?q=80&w=1920&auto=format&fit=crop',
    genres: ['Thriller', 'Crime', 'Drama'],
    rating: 8.2,
    voteCount: '16.5k',
    durationMinutes: 128,
    duration: '2h 08m',
    language: 'German',
    releaseDate: new Date('2024-04-20'),
    releaseStatus: 'now_showing',
    certificate: 'R',
    director: 'Florian Henckel von Donnersmarck',
    synopsis: 'A veteran Alpine search-and-rescue leader investigates the vanishing of a multinational fintech executive, uncovering deep-rooted secrets hidden in a remote mountain sanctuary.',
    cast: [
      { name: 'Daniel Brühl', role: 'Lukas Steiner', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop' }
    ],
    trailerUrl: 'https://www.youtube.com/embed/Way9Dexny3w',
    featured: false,
    isActive: true
  }
];

async function seed() {
  console.log('--- Starting IMovies Database Seed Process ---');
  try {
    await connectDB();

    // 1. Seed or Upsert Admin User
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@imovies.vip').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminPass2026!';
    const adminName = process.env.ADMIN_NAME || 'IMovies Executive Admin';

    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin'
      });
      console.log(`[Seed] Created default Admin account: ${adminEmail}`);
    } else {
      admin.role = 'admin';
      await admin.save();
      console.log(`[Seed] Verified Admin account: ${adminEmail}`);
    }

    // 2. Seed or Upsert Demo Customer User (Alex Morgan)
    const demoUserEmail = 'alex.morgan@imovies.vip';
    let demoUser = await User.findOne({ email: demoUserEmail });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Alex Morgan',
        email: demoUserEmail,
        password: 'CinemaPass2026!',
        role: 'user'
      });
      console.log(`[Seed] Created Demo Customer account: ${demoUserEmail}`);
    }

    // 3. Seed Theatres
    const theatreDocs = [];
    for (const tData of THEATRES_SEED) {
      const theatre = await Theatre.findOneAndUpdate(
        { slug: tData.slug },
        tData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      theatreDocs.push(theatre);
    }
    console.log(`[Seed] Seeded ${theatreDocs.length} cinema theatres.`);

    // 4. Seed Movies
    const movieDocs = [];
    for (const mData of MOVIES_SEED) {
      const movie = await Movie.findOneAndUpdate(
        { slug: mData.slug },
        mData,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      movieDocs.push(movie);
    }
    console.log(`[Seed] Seeded ${movieDocs.length} movies.`);

    // 5. Seed Showtimes for next 7 days
    console.log('[Seed] Generating showtime schedule across theatres...');
    await Showtime.deleteMany({}); // Fresh showtime generation for pristine seat availability
    const showtimeDocs = [];

    const timeSlots = [
      { time: '10:30 AM', hour: 10, minute: 30, format: 'Laser 4K', pStd: 14.0, pPrm: 18.5, pVip: 25.0 },
      { time: '02:15 PM', hour: 14, minute: 15, format: 'IMAX 3D', pStd: 16.0, pPrm: 21.0, pVip: 28.0 },
      { time: '06:30 PM', hour: 18, minute: 30, format: 'Laser IMAX', pStd: 17.5, pPrm: 22.5, pVip: 30.0 },
      { time: '10:15 PM', hour: 22, minute: 15, format: 'Dolby Cinema', pStd: 15.5, pPrm: 20.0, pVip: 27.0 }
    ];

    const today = new Date();

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const curDate = new Date(today);
      curDate.setDate(today.getDate() + dayOffset);
      const isoDate = curDate.toISOString().split('T')[0];

      // Schedule showtimes for the top 6 active movies
      for (let mIdx = 0; mIdx < Math.min(8, movieDocs.length); mIdx++) {
        const movie = movieDocs[mIdx];
        const theatre = theatreDocs[mIdx % theatreDocs.length];

        // Pick 2-3 showtime slots per day per movie
        const slotsToCreate = mIdx % 2 === 0 ? [timeSlots[0], timeSlots[2]] : [timeSlots[1], timeSlots[3]];

        for (const slot of slotsToCreate) {
          const startTime = new Date(curDate);
          startTime.setHours(slot.hour, slot.minute, 0, 0);

          const endTime = new Date(startTime);
          endTime.setMinutes(startTime.getMinutes() + (movie.durationMinutes || 120));

          // Deterministic sample occupied seats (e.g. A2, D5, E8)
          const sampleOccupied = [
            { seatId: 'C4', status: 'booked', lockedAt: new Date() },
            { seatId: 'D7', status: 'booked', lockedAt: new Date() },
            { seatId: 'E5', status: 'booked', lockedAt: new Date() },
            { seatId: 'H6', status: 'booked', lockedAt: new Date() }
          ];

          const showtime = await Showtime.create({
            movieId: movie._id,
            theatreId: theatre._id,
            screenName: theatre.screens?.[0]?.name || 'Screen 1',
            format: slot.format,
            date: isoDate,
            time: slot.time,
            startTime,
            endTime,
            seatPrices: {
              standard: slot.pStd,
              premium: slot.pPrm,
              vip: slot.pVip
            },
            occupiedSeats: sampleOccupied,
            status: 'open'
          });

          showtimeDocs.push(showtime);
        }
      }
    }
    console.log(`[Seed] Generated ${showtimeDocs.length} active showtimes with live seat inventories.`);

    // 6. Seed Sample Initial Booking for Alex Morgan
    if (showtimeDocs.length > 0) {
      await Booking.deleteMany({ userId: demoUser._id });

      const firstShowtime = showtimeDocs[0];
      const movie = await Movie.findById(firstShowtime.movieId);
      const theatre = await Theatre.findById(firstShowtime.theatreId);

      const refCode = generateBookingReference();
      const bookedSeats = [
        { id: 'E6', row: 'E', number: 6, tier: 'premium', price: firstShowtime.seatPrices.premium },
        { id: 'E7', row: 'E', number: 7, tier: 'premium', price: firstShowtime.seatPrices.premium }
      ];

      const subtotal = Number((firstShowtime.seatPrices.premium * 2).toFixed(2));
      const fee = 3.00;
      const tax = Number(((subtotal + fee) * 0.08).toFixed(2));
      const total = Number((subtotal + fee + tax).toFixed(2));

      const sampleBooking = await Booking.create({
        bookingReference: refCode,
        userId: demoUser._id,
        showtimeId: firstShowtime._id,
        movieSnapshot: {
          id: movie._id.toString(),
          title: movie.title,
          poster: movie.posterUrl,
          certificate: movie.certificate,
          duration: movie.duration,
          language: movie.language
        },
        theatreSnapshot: {
          id: theatre._id.toString(),
          name: theatre.name,
          location: theatre.location
        },
        showtimeSnapshot: {
          date: firstShowtime.date,
          time: firstShowtime.time,
          format: firstShowtime.format
        },
        seats: bookedSeats,
        snacks: [
          { id: 'snack-1', name: 'Truffle & Butter Gourmet Popcorn', price: 8.50, quantity: 1 }
        ],
        pricing: {
          seatCount: 2,
          seatsSubtotal: subtotal,
          snacksSubtotal: 8.50,
          subtotal: subtotal + 8.50,
          convenienceFee: fee,
          tax: tax,
          total: total + 8.50,
          tierBreakdown: {
            premium: { count: 2, price: firstShowtime.seatPrices.premium, subtotal }
          }
        },
        customer: {
          name: demoUser.name,
          email: demoUser.email,
          phone: '+1 (555) 389-2044'
        },
        payment: {
          method: 'card',
          status: 'completed',
          last4: '4242',
          transactionId: 'TXN-INITIAL-DEMO'
        },
        status: 'confirmed'
      });

      // Mark E6 and E7 as booked in showtime
      await Showtime.updateOne(
        { _id: firstShowtime._id },
        {
          $push: {
            occupiedSeats: {
              $each: [
                { seatId: 'E6', userId: demoUser._id, bookingId: sampleBooking._id, status: 'booked' },
                { seatId: 'E7', userId: demoUser._id, bookingId: sampleBooking._id, status: 'booked' }
              ]
            }
          }
        }
      );

      console.log(`[Seed] Seeded initial confirmed demo booking ${refCode} for Alex Morgan.`);
    }

    console.log('--- Database Seeding Completed Successfully! ---');
  } catch (err) {
    console.error('[Seed Error]:', err);
    process.exit(1);
  } finally {
    await disconnectDB();
  }
}

seed();
