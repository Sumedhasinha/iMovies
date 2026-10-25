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

### Frontend:
- **React 18** (Vite build system)
- **JavaScript (ES Modules)**
- **React Router DOM v7** (declarative client routing)
- **Plain CSS3** (Custom properties/CSS variables, responsive media queries, glassmorphism)
- **Lucide React** (consistent iconography)
- **React Context API** (`AuthContext`, `BookingContext`, `WatchlistContext`, `ToastContext`)
- **Canvas Confetti** (celebration effects)

### Backend (`server/`):
- **Node.js & Express.js** (REST API)
- **MongoDB & Mongoose** (Data models with text indexes and atomic locking)
- **JWT (JSON Web Tokens)** & **Bcrypt.js** (Authentication & password hashing)
- **Helmet, CORS, Rate Limiting** (Defensive API security)
- **Vitest & Supertest** (Automated backend test suite)

---

## 🚀 Running the Full-Stack Application

### Prerequisites
- **Node.js** (v18+)
- **MongoDB** (Local Community Server running on `mongodb://127.0.0.1:27017` or MongoDB Atlas)
- **npm** (v9+)

### 1. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..
```

### 2. Seed MongoDB Database
Populates MongoDB with 14 movies, 4 theatres, 112 multi-day showtimes, admin user (`admin@imovies.vip` / `AdminPass2026!`), and customer demo (`alex.morgan@imovies.vip` / `CinemaPass2026!`):
```bash
npm run seed
```

### 3. Start the Development Servers

You can launch both frontend and backend concurrently with a single command:
```bash
npm run dev:all
```

Or run them individually in separate terminal sessions:
```bash
# Terminal 1 — Backend REST API (Port 5001)
npm run server

# Terminal 2 — Frontend UI (Port 5173)
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 🧪 Running Automated Tests

Run backend integration and unit tests (auth, movies, showtimes, and concurrent race-condition booking tests):
```bash
npm run test:server
```

---

## 🔌 Live REST API Integration

The frontend connects directly to the Express + MongoDB backend via `src/services/api.js`. If the backend is temporarily offline, the frontend seamlessly falls back to local data with persistent LocalStorage state.

| API Service | REST Endpoint | Backend Implementation |
|---|---|---|
| `getMovies(filters)` | `GET /api/movies` | MongoDB text search, genre and release status filters |
| `getMovieById(id)` | `GET /api/movies/:id` | Queries movie by unique slug or MongoDB ObjectId |
| `getShowtimes(movieId, date)` | `GET /api/showtimes` | Groups showtimes by theatre with format and pricing tiers |
| `getOccupiedSeats(showtimeId)` | `GET /api/showtimes/:id/seats` | Real-time seat inventory and occupied seat identifiers |
| `createBooking(data)` | `POST /api/bookings` | **Atomic double-booking prevention**, price verification, ticket generation |
| `getMyBookings()` | `GET /api/bookings/my` | JWT authenticated user reservation history |
| `cancelBooking(id)` | `PATCH /api/bookings/:id/cancel` | Cancels reservation and releases seats back into inventory |
| `login(credentials)` | `POST /api/auth/login` | Bcrypt password check, JWT token issuance |
| `signup(userData)` | `POST /api/auth/signup` | Validated user registration |

> **Security Note**: All demo checkout payments are simulated for presentation purposes. Server-side price calculation strictly enforces ticket pricing, convenience fees, and taxes.

For detailed backend architecture and API documentation, see [`server/README.md`](file:///C:/Users/sumed/.gemini/antigravity/scratch/imovies/server/README.md).
