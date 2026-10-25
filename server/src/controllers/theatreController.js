// server/src/controllers/theatreController.js
import mongoose from 'mongoose';
import Theatre from '../models/Theatre.js';

/**
 * Get all active theatres
 * GET /api/theatres
 */
export async function getTheatres(req, res, next) {
  try {
    const { city } = req.query;
    const query = { isActive: true };

    if (city && city !== 'All') {
      query.city = { $regex: new RegExp(`^${city}$`, 'i') };
    }

    const theatres = await Theatre.find(query).sort({ name: 1 });
    return res.status(200).json({
      success: true,
      count: theatres.length,
      data: theatres
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get theatre details by MongoDB ObjectId or slug
 * GET /api/theatres/:id
 */
export async function getTheatreById(req, res, next) {
  try {
    const { id } = req.params;
    let theatre = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      theatre = await Theatre.findOne({ _id: id, isActive: true });
    }

    if (!theatre) {
      theatre = await Theatre.findOne({ slug: id.toLowerCase(), isActive: true });
    }

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found with specified identifier.'
      });
    }

    return res.status(200).json({
      success: true,
      data: theatre
    });
  } catch (error) {
    next(error);
  }
}
