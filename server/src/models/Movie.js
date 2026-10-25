// server/src/models/Movie.js
import mongoose from 'mongoose';

const castSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    avatar: { type: String }
  },
  { _id: false }
);

const movieSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
      index: true
    },
    tagline: {
      type: String,
      trim: true
    },
    synopsis: {
      type: String,
      required: [true, 'Movie synopsis is required']
    },
    posterUrl: {
      type: String,
      required: [true, 'Poster image URL is required']
    },
    backdropUrl: {
      type: String,
      required: [true, 'Backdrop image URL is required']
    },
    genres: {
      type: [String],
      required: [true, 'At least one genre is required'],
      index: true
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 10
    },
    voteCount: {
      type: String,
      default: '1k'
    },
    durationMinutes: {
      type: Number,
      required: [true, 'Duration in minutes is required'],
      min: 1
    },
    duration: {
      type: String
    },
    language: {
      type: String,
      required: [true, 'Language is required'],
      index: true
    },
    releaseDate: {
      type: Date,
      required: [true, 'Release date is required']
    },
    releaseStatus: {
      type: String,
      enum: {
        values: ['now_showing', 'coming_soon', 'trending', 'inactive'],
        message: '{VALUE} is not a valid release status'
      },
      default: 'now_showing',
      index: true
    },
    certificate: {
      type: String,
      default: 'PG-13'
    },
    director: {
      type: String,
      trim: true
    },
    cast: [castSchema],
    trailerUrl: {
      type: String
    },
    featured: {
      type: Boolean,
      default: false,
      index: true
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound text index for title, director, and synopsis search
movieSchema.index({ title: 'text', synopsis: 'text', director: 'text' });

// Auto-generate duration string if missing (e.g. 166 min -> "2h 46m")
movieSchema.pre('save', function (next) {
  if (this.durationMinutes && !this.duration) {
    const hours = Math.floor(this.durationMinutes / 60);
    const mins = this.durationMinutes % 60;
    this.duration = `${hours}h ${mins}m`;
  }
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

const Movie = mongoose.model('Movie', movieSchema);
export default Movie;
