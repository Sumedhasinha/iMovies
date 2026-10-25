// server/src/models/Theatre.js
import mongoose from 'mongoose';

const screenSchema = new mongoose.Schema(
  {
    screenNumber: {
      type: Number,
      required: true
    },
    name: {
      type: String,
      required: true // e.g. "Screen 1 (Laser IMAX)"
    },
    format: {
      type: String,
      default: 'Laser 4K' // e.g. "IMAX 3D", "Dolby Cinema", "4DX Motion"
    },
    totalSeats: {
      type: Number,
      default: 108
    },
    seatLayout: {
      rows: {
        type: [String],
        default: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J']
      },
      columns: {
        type: Number,
        default: 12
      },
      tiers: {
        type: Map,
        of: String,
        default: () => ({
          A: 'standard',
          B: 'standard',
          C: 'standard',
          D: 'premium',
          E: 'premium',
          F: 'premium',
          G: 'premium',
          H: 'vip',
          J: 'vip'
        })
      }
    }
  },
  { _id: true }
);

const theatreSchema = new mongoose.Schema(
  {
    slug: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    name: {
      type: String,
      required: [true, 'Theatre name is required'],
      trim: true
    },
    address: {
      type: String,
      required: [true, 'Theatre address is required']
    },
    location: {
      type: String,
      required: [true, 'Location description is required']
    },
    city: {
      type: String,
      default: 'Downtown',
      index: true
    },
    formats: {
      type: [String],
      default: ['Laser 4K', 'Dolby Atmos']
    },
    amenities: {
      type: [String],
      default: ['Recliner Seats', 'Gourmet Bar']
    },
    screens: [screenSchema],
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

const Theatre = mongoose.model('Theatre', theatreSchema);
export default Theatre;
