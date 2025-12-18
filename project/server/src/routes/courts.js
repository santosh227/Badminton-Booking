import express from 'express';
import Court from '../models/Court.js';

const router = express.Router();

// Get all courts
router.get('/', async (req, res) => {
  try {
    // Fetch only active courts
    const courts = await Court.find({ isActive: true });
    res.json(courts);
  } catch (error) {
    // Handle errors
    res.status(500).json({ error: error.message });
  }
});

// Get court by ID
router.get('/:id', async (req, res) => {
  try {
    // Fetch court by ID
    const court = await Court.findById(req.params.id);
    if (!court) {
      return res.status(404).json({ error: 'Court not found' });
    }
    // Return court details
    res.json(court);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new court (Admin)
router.post('/', async (req, res) => {
  try {
    // Create and save new court
    const court = new Court(req.body);
    // Save court to database
    await court.save();
    // Return created court
    res.status(201).json(court);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update court (Admin)
router.put('/:id', async (req, res) => {
  try {
    const court = await Court.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!court) {
      return res.status(404).json({ error: 'Court not found' });
    }
    res.json(court);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete court (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const court = await Court.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!court) {
      return res.status(404).json({ error: 'Court not found' });
    }
    res.json({ message: 'Court deactivated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;