# IMovies — Premium Cinema Ticket Booking Platform

**IMovies** is a responsive, modern frontend application for cinema movie discovery and seat reservation. Inspired by high-end cinema chains and modern streaming platforms, it delivers a dark cinema aesthetic with crimson accents, interactive seating maps, ticket breakdown, and local state persistence.

---

## 📽️ Features & Pages

### 1. Home Page (`/`)
- **Cinematic Hero Spotlight**: Featured title with high-res backdrop, rating badge, runtime, genre tags, storyline snippet, and instant trailer modal launcher.
- **Value Propositions Strip**: Laser IMAX & Dolby Atmos acoustics, VIP Recliner lounges, and instant mobile gate pass.
- **Now Showing Section**: Curated grid with quick booking and detail inspection overlays.
- **Trending Section**: High-demand releases with popularity indicators.
- **Genre Showcase**: Quick navigation cards to filter movies by genre.
- **Coming Soon Section**: Upcoming premieres and advance schedule previews.
- **Cinema Footer**: Formats showcase, VIP newsletter demo subscription, and portfolio notice.

### 2. Movie Catalogue (`/movies`)
- **Full Catalogue Grid**: Responsive layout adapting smoothly across mobile, tablet, and widescreen.
- **Search**: Search by title, director, cast members, or genre keywords.
- **Filters**:
  - Filter by Genre (Action, Sci-Fi, Drama, Thriller, Animation, Comedy, etc.)
  - Filter by Language (English, Spanish, Japanese, French, Korean, German)
  - Filter by Release Status (Now Showing, Trending, Coming Soon)
  - Sort by: Featured, Highest Rated, Release Date, Runtime, Title (A-Z)
- **State Management**: Search params synchronized with the browser URL (`?search=...&genre=...&status=...`).
- **Empty States**: Friendly empty states with one-click filter reset.

### 3. Movie Details (`/movies/:id`)
- **Cinematic Header**: Dynamic backdrop with dark vignette, poster card, and director credits.
- **Trailer Modal**: Interactive YouTube/preview modal with autoplay and responsive aspect ratio.
- **Synopsis & Cast**: Actor roles, names, and character avatars with graceful image fallbacks.
- **Audio & Visual Specs**: Dolby Atmos, IMAX 12-Track, laser projection badges.
- **Interactive Showtime Selector**:
  - Date selector for the next 7 days (Today, Tomorrow, subsequent days).
  - Multi-theatre listings (Starlight IMAX, CineLuxe Dolby, Metropolis 4DX, Royal Heritage).
  - Showtime buttons with format indicators (`IMAX 3D`, `Laser 4K`, `Dolby Cinema`, `4DX Motion`) and base prices.
  - One-click continuation to seat reservation.

### 4. Interactive Seat Selection (`/booking/:movieId`)
- **Curved Auditorium Screen**: Realistic screen glow reflection and row orientation.
- **Seat Tier Classification**:
  - **Standard**: Front auditorium plush seating.
  - **Premium**: Prime central viewing angles with extended legroom.
  - **VIP Recliner**: Luxury leather recliners with motorized footrests.
- **Visual States**: Available, Selected (Crimson with glow), and Occupied (simulated demo bookings).
- **Multi-Seat Picking**: Select up to 8 tickets per transaction with instant counter.
- **Cinema Concessions Bar**: Optional add-on of luxury movie snacks (Truffle Popcorn, Nachos Grande, Wildberry Slushies, Premiere Combos) with real-time quantity controllers.
- **Real-Time Sticky Summary**: Seat breakdown pills, concessions subtotal, tier breakdown, convenience fees, taxes, and total.

### 5. Checkout (`/checkout`)
- **Order Review**: Itemized summary of movie, venue, date, showtime, and chosen seats.
- **Contact Details**: Name, email (for e-ticket delivery), and mobile number.
- **Payment Method Simulation**:
  - Credit / Debit Card (with card number, expiry, and CVV validation).
  - Digital Wallets (Apple Pay / Google Pay one-touch demo).
  - UPI / Net Banking.
- **Validation**: Client-side field validations with inline error messaging.
- **Safety Disclaimer**: Prominent reminder that this is a simulated demo and no real financial credentials should be entered.

### 6. Booking Confirmation (`/booking-confirmation/:bookingId`)
- **Celebration Animation**: Canvas confetti burst on successful reservation.
- **Digital Cinema Pass**:
  - Perforated cinema ticket aesthetic with notched edges.
  - Unique booking reference code (e.g. `IMV-849204`).
  - Movie poster, theatre hall, date, time, and seat tags.
  - Decorative SVG QR code and barcode clearly labeled as a simulated pass.
  - Print / Save Ticket action (`window.print()`).
  - Navigation to My Bookings and Return Home.

### 7. My Bookings (`/bookings`)
- **Booking History**: Categorized by All, Confirmed, and Cancelled tabs.
- **Persistence**: All reservations persist across browser refreshes via `localStorage`.
- **View Pass**: Modal to re-inspect digital tickets with QR code.
- **Cancel Booking**: Real-time cancellation dialog releasing reserved seats.
- **Empty State**: Guided CTA to browse titles if no bookings are present.

### 8. Authentication (`/login` & `/signup`)
- **VIP Member Login**: Email and password with show/hide toggle.
- **Quick Demo Login**: 1-click test button to log in immediately as "Alex Morgan".
- **Member Signup**: Form with validation for name, email, and password.
- **Context Integration**: Persistent login state in `AuthContext` and user avatar dropdown in the navigation header.

---

## 🛠️ Technology Stack

- **React 18** (Vite build system)
- **JavaScript (ES Modules)**
- **React Router DOM v7** (declarative client routing)
- **Plain CSS3** (Custom properties/CSS variables, responsive media queries, glassmorphism)
- **Lucide React** (consistent iconography)
- **React Context API** (`AuthContext`, `BookingContext`, `ToastContext`)
- **LocalStorage API** (demo persistence for bookings, user sessions, and active drafts)
- **Canvas Confetti** (celebration effects)

---

## 🚀 Running the Project

### Prerequisites
- Node.js (v18+)
- npm (v9+)

### Installation & Launch
```bash
# Navigate to the project directory
cd imovies

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

### Building for Production
```bash
npm run build
```
The optimized production bundle will be generated in `dist/`.

---

## 🔌 Future Backend Readiness & Simulated Components

The application includes a clean service layer in `src/services/api.js` structured for future connection to an **Express.js REST API** and **MongoDB**:

| API Service Function | Current Demo Behavior | Future Backend Integration |
|---|---|---|
| `getMovies(filters)` | Filters and sorts in-memory mock dataset (`src/data/movies.js`) with simulated async latency | `GET /api/v1/movies?genre=...&search=...` |
| `getMovieById(id)` | Queries movie by slug/ID from mock data | `GET /api/v1/movies/:id` |
| `getShowtimes(movieId, date)` | Returns scheduled times and auditorium formats | `GET /api/v1/theatres/showtimes?movieId=...&date=...` |
| `getOccupiedSeats(showtimeKey)` | Generates deterministic occupied seats + incorporates locally booked seats | `GET /api/v1/bookings/occupied-seats/:showtimeId` |
| `createBooking(data)` | Validates payload and stores in browser `localStorage` | `POST /api/v1/bookings` with transactional seat locking in MongoDB |
| `getMyBookings()` | Reads saved booking array from `localStorage` | `GET /api/v1/users/me/bookings` with JWT authentication |
| `login(credentials)` | Simulates JWT login and saves demo user to `localStorage` | `POST /api/v1/auth/login` (bcrypt hash verification & HTTP-only cookies) |
| `signup(userData)` | Simulates user creation and logs in user | `POST /api/v1/auth/register` |

> **Note on Simulated Data**: All payments, card processing, seat occupancy, and QR codes are strictly simulated for frontend presentation and portfolio demonstration. No real charges are made.
