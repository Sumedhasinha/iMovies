# IMovies Backend — Cinema Ticket Booking REST API

A production-grade, secure REST API backend for **IMovies**, built with **Node.js**, **Express.js**, and **MongoDB (Mongoose)**. Designed with defensive security, atomic double-booking prevention, role-based access control (RBAC), and automated testing.

---

## 🏗️ Architecture Overview

The backend uses a modular layered architecture separating HTTP routing, controller orchestration, atomic business logic services, and data models:

```
server/
├── scripts/
│   └── seedDatabase.js          # Seeds 14 movies, 4 theatres, 112 showtimes, admin & customer
├── src/
│   ├── config/
│   │   └── db.js                # MongoDB Mongoose connection and graceful termination
│   ├── controllers/
│   │   ├── adminController.js   # Analytics, inventory metrics, admin CRUD
│   │   ├── authController.js    # Registration, login, current user, logout
│   │   ├── bookingController.js # Reservation creation, my bookings, cancellation
│   │   ├── movieController.js   # Catalogue, filters, slugs, genres, featured
│   │   ├── showtimeController.js# Daily showtimes, grouped theatre format, seat layouts
│   │   └── theatreController.js # Theatre venues and screens
│   ├── middleware/
│   │   ├── adminMiddleware.js   # Role-based 403 guard
│   │   ├── authMiddleware.js    # JWT Bearer / cookie token verification
│   │   ├── errorMiddleware.js   # Centralized error handler (404, CastError, duplicate key)
│   │   ├── rateLimiter.js       # IP rate limiting for auth, bookings, and public APIs
│   │   └── validateRequest.js   # express-validator result formatter
│   ├── models/
│   │   ├── Booking.js           # Immutable booking snapshot, seat breakdown, pricing
│   │   ├── Movie.js             # Validated cinema title schema, text search indexes
│   │   ├── Showtime.js          # Show slots, seat tiers, atomic occupiedSeats inventory
│   │   ├── Theatre.js           # Physical venues, screens, and seat layouts
│   │   └── User.js              # Bcrypt-hashed user accounts with RBAC ('user' | 'admin')
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── bookingRoutes.js
│   │   ├── movieRoutes.js
│   │   ├── showtimeRoutes.js
│   │   └── theatreRoutes.js
│   ├── services/
│   │   └── bookingService.js    # Atomic double-booking prevention, ticket reference generator
│   ├── utils/
│   │   ├── generateBookingReference.js # Collision-resistant ticket code generator (IMV-XXXXXX)
│   │   ├── jwtUtils.js          # JWT signing and verification helper
│   │   └── pricingCalculator.js # Authoritative server-side pricing calculation
│   ├── app.js                   # Express application setup, security headers, CORS
│   └── server.js                # HTTP server bootstrap with DB readiness check
├── tests/
│   ├── auth.test.js             # User registration, login, JWT guards
│   ├── bookings.test.js         # Concurrent booking prevention, race conditions, cancellation
│   ├── movies.test.js           # Catalogue filtering, search, slug lookup
│   └── showtimes.test.js        # Theatres, seat layouts, showtime schedules
├── .env.example
├── package.json
└── vitest.config.js
```

---

## ⚡ Prerequisites

- **Node.js**: v18.0.0 or later
- **MongoDB**: v6.0 or later (Local Community Server or MongoDB Atlas cluster)
- **npm**: v9.0.0 or later

---

## ⚙️ Environment Variables

Create a `.env` file in the `server/` directory:

```env
# Server Port
PORT=5001

# Environment Mode
NODE_ENV=development

# MongoDB Connection String (Atlas or Local)
MONGODB_URI=mongodb://127.0.0.1:27017/imovies

# JWT Secret Key (Use a cryptographically secure 64+ char random string in production)
JWT_SECRET=imovies_super_secret_jwt_signing_key_production_grade_cinema_platform_2026!

# JWT Token Lifetime
JWT_EXPIRES_IN=7d

# Allowed Frontend Origins (CORS)
CLIENT_ORIGIN=http://localhost:5173
```

A complete `.env.example` template is provided in the `server/` root.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Seed the Database
Populates MongoDB with comprehensive real-world cinema data:
- **1 Admin account**: `admin@imovies.vip` (Password: `AdminPass2026!`)
- **1 Customer demo account**: `alex.morgan@imovies.vip` (Password: `CinemaPass2026!`)
- **4 Cinema Theatres**: Starlight IMAX, CineLuxe Dolby, Metropolis 4DX, Royal Heritage
- **14 Movies**: Dune: Part Two, Oppenheimer, Interstellar, Cyberpunk: Neo Tokyo, etc.
- **112 Showtimes**: Multi-tier seat inventories across 7 consecutive dates.

Run:
```bash
npm run seed
```

### 3. Start the Development Server
```bash
npm run dev
```
The server will connect to MongoDB and listen on `http://localhost:5001`.

---

## 🛡️ Double-Booking Prevention & Concurrency Control

In high-concurrency ticket booking, two users attempting to reserve seat `E5` at the same second must not both succeed.

Rather than relying on client-side state or vulnerable multi-step read-modify-write patterns, IMovies uses **MongoDB atomic update queries** via `bookingService.js`:

```javascript
// Atomically reserve seats only if ALL requested seats are currently NOT in occupiedSeats
const showtime = await Showtime.findOneAndUpdate(
  {
    _id: showtimeId,
    status: 'open',
    'occupiedSeats.seatId': { $nin: requestedSeatIds }
  },
  {
    $push: {
      occupiedSeats: {
        $each: requestedSeatIds.map((seatId) => ({
          seatId,
          status: 'booked',
          lockedAt: new Date()
        }))
      }
    }
  },
  { new: true }
);

if (!showtime) {
  // Query to pinpoint which specific seat caused the collision
  const currentShowtime = await Showtime.findById(showtimeId);
  const alreadyBooked = requestedSeatIds.filter((id) =>
    currentShowtime?.occupiedSeats?.some((occ) => occ.seatId === id)
  );
  throw new Error(`Seats already reserved: ${alreadyBooked.join(', ')}`);
}
```

### Key Guarantees:
1. **Atomicity**: The query match and update occur in a single atomic database lock in the MongoDB engine.
2. **Zero Double-Bookings**: If even one seat in `requestedSeatIds` is already occupied, the query condition fails and zero seats are updated.
3. **No Replica Set Transactions Required**: Operates reliably on both standalone local MongoDB instances and replica set / Atlas clusters.

---

## 🔒 Security Implementations

1. **Password Hashing**: `bcryptjs` with 12 salt rounds; passwords never exposed in query responses (`select: false`).
2. **HTTP Security Headers**: `helmet` enforces strict HSTS, content security policies, and hides `X-Powered-By`.
3. **CORS Restrictions**: Explicitly whitelists `CLIENT_ORIGIN` (`http://localhost:5173`).
4. **Rate Limiting**:
   - Authentication (`/api/auth/*`): 15 attempts per 15 minutes.
   - Ticket Checkout (`POST /api/bookings`): 30 requests per 10 minutes.
   - Public APIs: 300 requests per 15 minutes.
5. **Authoritative Server Pricing**: Subtotals, seat category pricing, concession totals, booking fees ($1.50/seat), and taxes (8%) are computed strictly on the backend. Client-submitted prices are ignored.
6. **Input Sanitization & Validation**: `express-validator` validates and normalizes all incoming payload structures before reaching business controllers.

---

## 📡 REST API Reference

### Health Check
- `GET /health` — Returns server uptime and MongoDB connection state.

---

### Authentication (`/api/auth`)

#### 1. Register New Account
- **Endpoint**: `POST /api/auth/signup`
- **Auth**: Public
- **Request Body**:
```json
{
  "name": "Sarah Connor",
  "email": "sarah.connor@example.com",
  "password": "Password123!"
}
```
- **Response** (`201 Created`):
```json
{
  "success": true,
  "message": "User account created successfully",
  "token": "eyJhbGciOi...",
  "user": {
    "id": "67bc94b8e390c502129e9241",
    "name": "Sarah Connor",
    "email": "sarah.connor@example.com",
    "role": "user"
  }
}
```

#### 2. Member Login
- **Endpoint**: `POST /api/auth/login`
- **Auth**: Public
- **Request Body**:
```json
{
  "email": "alex.morgan@imovies.vip",
  "password": "CinemaPass2026!"
}
```
- **Response** (`200 OK`):
```json
{
  "success": true,
  "token": "eyJhbGciOi...",
  "user": {
    "id": "67bc94b8e390c502129e9240",
    "name": "Alex Morgan",
    "email": "alex.morgan@imovies.vip",
    "role": "user"
  }
}
```

#### 3. Current User Profile
- **Endpoint**: `GET /api/auth/me`
- **Auth**: Required (`Bearer <token>`)
- **Response** (`200 OK`):
```json
{
  "success": true,
  "user": {
    "id": "67bc94b8e390c502129e9240",
    "name": "Alex Morgan",
    "email": "alex.morgan@imovies.vip",
    "role": "user"
  }
}
```

---

### Movies (`/api/movies`)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/api/movies` | Search, filter by genre/language/status, sort, and paginate | Public |
| `GET` | `/api/movies/:id` | Fetch movie by ObjectId or slug (e.g. `dune-part-two`) | Public |
| `GET` | `/api/movies/featured` | Fetch top featured movies for homepage hero carousel | Public |
| `GET` | `/api/movies/genres` | Get list of distinct active genres | Public |
| `GET` | `/api/movies/now-showing` | Fetch active titles currently in cinemas | Public |
| `GET` | `/api/movies/coming-soon` | Fetch titles scheduled for upcoming release | Public |

#### Query Parameters for `GET /api/movies`:
- `search`: Case-insensitive title / cast search keyword.
- `genre`: e.g. `Sci-Fi`, `Action`, `Drama`.
- `language`: e.g. `English`, `French`, `Japanese`.
- `status`: `now_showing` or `coming_soon`.
- `sort`: `featured`, `rating`, `releaseDate`, `runtime`, `title`.
- `limit`: Number of items per page (default: 20).
- `page`: Page index (default: 1).

---

### Theatres & Showtimes (`/api/theatres`, `/api/showtimes`)

#### 1. List Theatres
- **Endpoint**: `GET /api/theatres`
- **Auth**: Public

#### 2. Query Showtimes by Date & Movie
- **Endpoint**: `GET /api/showtimes?movieId=dune-part-two&date=2026-10-25&grouped=true`
- **Auth**: Public
- **Description**: Returns showtimes grouped by theatre with formatted venue metadata, screen details, and price tiers (`standard`, `premium`, `vip`).

#### 3. Seat Inventory & Occupancy
- **Endpoint**: `GET /api/showtimes/:id/seats`
- **Auth**: Public
- **Response** (`200 OK`):
```json
{
  "success": true,
  "data": {
    "showtimeId": "67bc94c3e390c502129e92a8",
    "occupiedSeats": ["C4", "D7", "E5", "H6"],
    "totalSeats": 108,
    "availableCount": 104,
    "seatPrices": {
      "standard": 14.0,
      "premium": 18.5,
      "vip": 25.0
    },
    "screen": {
      "screenNumber": 1,
      "name": "Screen 1 (Laser IMAX)",
      "format": "Laser IMAX",
      "seatLayout": {
        "rows": ["A", "B", "C", "D", "E", "F", "G", "H", "J"],
        "columns": 12,
        "tiers": {
          "A": "standard",
          "D": "premium",
          "H": "vip"
        }
      }
    }
  }
}
```

---

### Bookings (`/api/bookings`)

#### 1. Create Cinema Reservation
- **Endpoint**: `POST /api/bookings`
- **Auth**: Optional (Supports authenticated members and guest checkouts)
- **Request Body**:
```json
{
  "showtimeId": "67bc94c3e390c502129e92a8",
  "seats": [
    { "id": "F5", "row": "F", "number": 5, "tier": "premium" },
    { "id": "F6", "row": "F", "number": 6, "tier": "premium" }
  ],
  "snacks": [
    { "id": "snk-1", "name": "Truffle Butter Popcorn", "price": 9.5, "quantity": 1 }
  ],
  "customer": {
    "name": "Alex Morgan",
    "email": "alex.morgan@imovies.vip",
    "phone": "+1 (555) 382-9102"
  },
  "paymentMethod": "card"
}
```
- **Response** (`201 Created`):
```json
{
  "success": true,
  "message": "Tickets reserved successfully",
  "data": {
    "_id": "67bc95f4e390c502129e93bf",
    "bookingReference": "IMV-482019",
    "movie": {
      "title": "Dune: Part Two",
      "certificate": "PG-13",
      "duration": "166m",
      "language": "English"
    },
    "theatre": {
      "name": "Starlight IMAX Cinema & Lounge",
      "location": "Downtown Cultural Hub, Screen 1 (Laser IMAX)",
      "screenName": "Screen 1 (Laser IMAX)"
    },
    "seats": [
      { "seatId": "F5", "tier": "premium", "price": 18.5 },
      { "seatId": "F6", "tier": "premium", "price": 18.5 }
    ],
    "pricing": {
      "ticketSubtotal": 37.0,
      "snacksSubtotal": 9.5,
      "bookingFee": 3.0,
      "tax": 3.96,
      "grandTotal": 53.46
    },
    "bookingStatus": "confirmed",
    "paymentStatus": "completed"
  }
}
```

#### 2. Get User Bookings
- **Endpoint**: `GET /api/bookings/my`
- **Auth**: Required (`Bearer <token>`)

#### 3. Cancel Booking
- **Endpoint**: `PATCH /api/bookings/:id/cancel`
- **Auth**: Required (Owner or Admin)
- **Description**: Cancels reservation and atomically releases the reserved seats back into the showtime inventory.

---

### Admin (`/api/admin`)

Guarded by `authMiddleware` and `adminMiddleware` (`role === 'admin'`).

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/stats` | Platform metrics (total tickets, revenue, movies count, active showtimes) |
| `GET` | `/api/admin/bookings` | Paginated platform-wide booking audit log |
| `POST` | `/api/admin/movies` | Create new movie with auto-generated slug |
| `PUT` | `/api/admin/movies/:id` | Update movie metadata or activation status |
| `DELETE` | `/api/admin/movies/:id` | Soft-delete movie |
| `POST` | `/api/admin/showtimes` | Schedule new showtime slot |

---

## 🧪 Automated Testing

Automated test suites are implemented with **Vitest** and **Supertest** in `server/tests/`:

- `auth.test.js`: Validates registration, duplicate email rejection, login authentication, password hash security, and RBAC token protection.
- `movies.test.js`: Validates full-text search, genre filters, slug resolution, and 404 handlers.
- `showtimes.test.js`: Validates showtime queries, seat inventory masking, and pricing tier accuracy.
- `bookings.test.js`: Tests server-side price calculation, **concurrent race condition double-booking prevention**, user ownership verification, and seat release on cancellation.

### Run Tests:
```bash
cd server
npm test
```

---

## 🚀 Production Deployment & Future Enhancements

1. **Payment Gateways**: Replace simulated payments with Stripe Payment Intents or PayPal Webhooks.
2. **WebSocket Live Seat Map**: Integrate Socket.io so when User A selects seat `E5`, it displays as temporarily locked in real-time on User B's screen.
3. **Redis Caching**: Cache catalogue queries (`/api/movies`) and showtimes with 60-second TTL invalidation.
4. **Email / SMS E-Tickets**: Send PDF passes with barcodes via Nodemailer (SendGrid / AWS SES) and Twilio SMS.
