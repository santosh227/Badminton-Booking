import express from 'express';
import { body, validationResult } from 'express-validator';
import Booking from '../models/Booking.js';
import Court from '../models/Court.js';
import Coach from '../models/Coach.js';
import Equipment from '../models/Equipment.js';
import PricingRule from '../models/PricingRule.js';

const router = express.Router();

// Get all bookings
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('court')
      .populate('equipment.item')
      .populate('coach')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('court')
      .populate('equipment.item')
      .populate('coach');
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new booking
router.post('/',
  [
    body('customerName').notEmpty().withMessage('Customer name is required'),
    body('customerEmail').isEmail().withMessage('Valid email is required'),
    body('court').notEmpty().withMessage('Court selection is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('startTime').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid start time is required'),
    body('endTime').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid end time is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const {
        customerName,
        customerEmail,
        customerPhone,
        court,
        date,
        startTime,
        endTime,
        equipment,
        coach,
        notes
      } = req.body;

      // Calculate duration
      const start = new Date(`2000-01-01T${startTime}:00`);
      const end = new Date(`2000-01-01T${endTime}:00`);
      const duration = (end - start) / (1000 * 60 * 60); // hours

      // Get court details
      const courtDetails = await Court.findById(court);
      if (!courtDetails) {
        return res.status(400).json({ error: 'Invalid court selection' });
      }

      // Calculate pricing
      const pricing = await calculateBookingPrice({
        court: courtDetails,
        date: new Date(date),
        startTime,
        endTime,
        duration,
        equipment: equipment || [],
        coach: coach || null
      });

      // Create booking
      const booking = new Booking({
        customerName,
        customerEmail,
        customerPhone,
        court,
        date: new Date(date),
        startTime,
        endTime,
        duration,
        equipment: equipment || [],
        coach: coach || null,
        pricing,
        notes
      });

      await booking.save();

      // Update equipment availability
      if (equipment && equipment.length > 0) {
        for (const item of equipment) {
          await Equipment.findByIdAndUpdate(
            item.item,
            { $inc: { availableQuantity: -item.quantity } }
          );
        }
      }

      // Populate the booking before sending response
      await booking.populate(['court', 'equipment.item', 'coach']);

      res.status(201).json(booking);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
);

// Cancel booking
router.patch('/:id/cancel', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Restore equipment availability
    if (booking.equipment && booking.equipment.length > 0) {
      for (const item of booking.equipment) {
        await Equipment.findByIdAndUpdate(
          item.item,
          { $inc: { availableQuantity: item.quantity } }
        );
      }
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Helper function to calculate pricing
async function calculateBookingPrice({ court, date, startTime, endTime, duration, equipment, coach }) {
  let courtPrice = court.basePrice * duration;
  let equipmentPrice = 0;
  let coachPrice = 0;
  const appliedRules = [];

  // Get active pricing rules
  const pricingRules = await PricingRule.find({ isActive: true }).sort({ priority: -1 });
  
  // Apply pricing rules
  for (const rule of pricingRules) {
    let ruleApplies = false;
    
    switch (rule.type) {
      case 'peak_hours':
        const startHour = parseInt(startTime.split(':')[0]);
        const ruleStartHour = parseInt(rule.conditions.startTime.split(':')[0]);
        const ruleEndHour = parseInt(rule.conditions.endTime.split(':')[0]);
        if (startHour >= ruleStartHour && startHour < ruleEndHour) {
          ruleApplies = true;
        }
        break;
        
      case 'weekend':
        const dayOfWeek = date.getDay();
        if (rule.conditions.days && rule.conditions.days.includes(dayOfWeek)) {
          ruleApplies = true;
        }
        break;
        
      case 'court_type':
        if (rule.conditions.courtType === court.type) {
          ruleApplies = true;
        }
        break;
    }
    
    if (ruleApplies) {
      courtPrice *= rule.multiplier;
      appliedRules.push({
        ruleName: rule.name,
        multiplier: rule.multiplier
      });
    }
  }

  // Calculate equipment price
  if (equipment && equipment.length > 0) {
    for (const item of equipment) {
      const equipmentItem = await Equipment.findById(item.item);
      if (equipmentItem) {
        equipmentPrice += equipmentItem.pricePerHour * item.quantity * duration;
      }
    }
  }

  // Calculate coach price
  if (coach) {
    const coachDetails = await Coach.findById(coach);
    if (coachDetails) {
      coachPrice = coachDetails.hourlyRate * duration;
    }
  }

  const totalPrice = courtPrice + equipmentPrice + coachPrice;

  return {
    courtPrice: Math.round(courtPrice * 100) / 100,
    equipmentPrice: Math.round(equipmentPrice * 100) / 100,
    coachPrice: Math.round(coachPrice * 100) / 100,
    totalPrice: Math.round(totalPrice * 100) / 100,
    appliedRules
  };
}

export default router;