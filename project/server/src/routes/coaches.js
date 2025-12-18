import express from 'express';
import Coach from '../models/Coach.js';

const router = express.Router();

// Get all coaches
router.get('/', async (req, res) => {
  try {
    const coaches = await Coach.find({ isActive: true });
    res.json(coaches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get coach by ID
router.get('/:id', async (req, res) => {
  try {
    const coach = await Coach.findById(req.params.id);
    if (!coach) {
      return res.status(404).json({ error: 'Coach not found' });
    }
    res.json(coach);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new coach (Admin)
router.post('/', async (req, res) => {
  try {
    const coach = new Coach(req.body);
    await coach.save();
    res.status(201).json(coach);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update coach (Admin)
router.put('/:id', async (req, res) => {
  try {
    const coach = await Coach.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!coach) {
      return res.status(404).json({ error: 'Coach not found' });
    }
    res.json(coach);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete coach (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const coach = await Coach.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!coach) {
      return res.status(404).json({ error: 'Coach not found' });
    }
    res.json({ message: 'Coach deactivated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;