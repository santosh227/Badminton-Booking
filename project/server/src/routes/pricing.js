import express from 'express';
import PricingRule from '../models/PricingRule.js';

const router = express.Router();

// Get all pricing rules
router.get('/', async (req, res) => {
  try {
    const rules = await PricingRule.find().sort({ priority: -1 });
    res.json(rules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new pricing rule (Admin)
router.post('/', async (req, res) => {
  try {
    const rule = new PricingRule(req.body);
    await rule.save();
    res.status(201).json(rule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update pricing rule (Admin)
router.put('/:id', async (req, res) => {
  try {
    const rule = await PricingRule.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!rule) {
      return res.status(404).json({ error: 'Pricing rule not found' });
    }
    res.json(rule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete pricing rule (Admin)
router.delete('/:id', async (req, res) => {
  try {
    await PricingRule.findByIdAndDelete(req.params.id);
    res.json({ message: 'Pricing rule deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Calculate price for booking
router.post('/calculate', async (req, res) => {
  try {
    const { courtId, date, startTime, endTime, equipment, coachId } = req.body;
    
    // This is a simplified calculation - would need to import models and implement full logic
    const pricing = {
      courtPrice: 0,
      equipmentPrice: 0,
      coachPrice: 0,
      totalPrice: 0,
      appliedRules: []
    };
    
    res.json(pricing);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;