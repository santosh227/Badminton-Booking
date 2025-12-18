import express from 'express';
import { format, parse, isAfter, isBefore, getDay } from 'date-fns';
import Booking from '../models/Booking.js';
import Court from '../models/Court.js';
import Coach from '../models/Coach.js';
import Equipment from '../models/Equipment.js';

const router = express.Router();

// Check availability for a specific date
router.get('/check', async (req, res) => {
  try {
    const { date, startTime, endTime, courtId, coachId, equipment } = req.query;
    
    const bookingDate = new Date(date);
    const dayOfWeek = getDay(bookingDate);
    
    // Check court availability
    let courtAvailable = true;
    if (courtId) {
      const courtBookings = await Booking.find({
        court: courtId,
        date: bookingDate,
        status: { $ne: 'cancelled' },
        $or: [
          {
            $and: [
              { startTime: { $lte: startTime } },
              { endTime: { $gt: startTime } }
            ]
          },
          {
            $and: [
              { startTime: { $lt: endTime } },
              { endTime: { $gte: endTime } }
            ]
          },
          {
            $and: [
              { startTime: { $gte: startTime } },
              { endTime: { $lte: endTime } }
            ]
          }
        ]
      });
      courtAvailable = courtBookings.length === 0;
    }
    
    // Check coach availability
    let coachAvailable = true;
    if (coachId) {
      const coach = await Coach.findById(coachId);
      if (coach) {
        // Check coach's general availability for the day
        const dayAvailability = coach.availability.find(av => av.dayOfWeek === dayOfWeek);
        if (!dayAvailability) {
          coachAvailable = false;
        } else {
          // Check if requested time is within coach's available hours
          const coachStart = parse(dayAvailability.startTime, 'HH:mm', bookingDate);
          const coachEnd = parse(dayAvailability.endTime, 'HH:mm', bookingDate);
          const requestStart = parse(startTime, 'HH:mm', bookingDate);
          const requestEnd = parse(endTime, 'HH:mm', bookingDate);
          
          if (isBefore(requestStart, coachStart) || isAfter(requestEnd, coachEnd)) {
            coachAvailable = false;
          } else {
            // Check for existing bookings
            const coachBookings = await Booking.find({
              coach: coachId,
              date: bookingDate,
              status: { $ne: 'cancelled' },
              $or: [
                {
                  $and: [
                    { startTime: { $lte: startTime } },
                    { endTime: { $gt: startTime } }
                  ]
                },
                {
                  $and: [
                    { startTime: { $lt: endTime } },
                    { endTime: { $gte: endTime } }
                  ]
                },
                {
                  $and: [
                    { startTime: { $gte: startTime } },
                    { endTime: { $lte: endTime } }
                  ]
                }
              ]
            });
            coachAvailable = coachBookings.length === 0;
          }
        }
      }
    }
    
    // Check equipment availability
    let equipmentAvailable = true;
    const equipmentStatus = [];
    
    if (equipment) {
      const equipmentList = JSON.parse(equipment);
      for (const item of equipmentList) {
        const equipmentItem = await Equipment.findById(item.equipmentId);
        if (!equipmentItem) {
          equipmentAvailable = false;
          equipmentStatus.push({
            equipmentId: item.equipmentId,
            available: false,
            reason: 'Equipment not found'
          });
        } else if (equipmentItem.availableQuantity < item.quantity) {
          equipmentAvailable = false;
          equipmentStatus.push({
            equipmentId: item.equipmentId,
            available: false,
            reason: `Only ${equipmentItem.availableQuantity} available, requested ${item.quantity}`
          });
        } else {
          equipmentStatus.push({
            equipmentId: item.equipmentId,
            available: true,
            availableQuantity: equipmentItem.availableQuantity
          });
        }
      }
    }
    
    res.json({
      available: courtAvailable && coachAvailable && equipmentAvailable,
      courtAvailable,
      coachAvailable,
      equipmentAvailable,
      equipmentStatus
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get available time slots for a specific date
router.get('/slots', async (req, res) => {
  try {
    const { date } = req.query;
    const bookingDate = new Date(date);
    
    // Get all courts
    const courts = await Court.find({ isActive: true });
    
    // Generate time slots (9 AM to 10 PM, 1-hour slots)
    const timeSlots = [];
    for (let hour = 9; hour < 22; hour++) {
      const startTime = `${hour.toString().padStart(2, '0')}:00`;
      const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
      timeSlots.push({ startTime, endTime });
    }
    
    // Get existing bookings for the date
    const bookings = await Booking.find({
      date: bookingDate,
      status: { $ne: 'cancelled' }
    }).populate('court');
    
    // Mark available slots for each court
    const availableSlots = courts.map(court => {
      const courtBookings = bookings.filter(booking => 
        booking.court._id.toString() === court._id.toString()
      );
      
      const slots = timeSlots.map(slot => {
        const isBooked = courtBookings.some(booking => 
          booking.startTime === slot.startTime
        );
        
        return {
          ...slot,
          available: !isBooked
        };
      });
      
      return {
        court: court,
        slots: slots
      };
    });
    // Return available slots
    res.json(availableSlots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;