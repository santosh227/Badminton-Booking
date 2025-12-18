// import Express Modules
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectToMongo from './src/config/database.js';

// Import routes
import courtRoutes from './src/routes/courts.js';
import equipmentRoutes from './src/routes/equipment.js';
import coachRoutes from './src/routes/coaches.js';
import bookingRoutes from './src/routes/bookings.js';
import pricingRoutes from './src/routes/pricing.js';
import availabilityRoutes from './src/routes/availability.js';

// config .env
dotenv.config();

const app = express();
// port 
const PORT = process.env.PORT || 5000;

// Connect to MongoDB - server/
connectToMongo();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/courts', courtRoutes);
app.use('/api/equipment', equipmentRoutes);
app.use('/api/coaches', coachRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/pricing', pricingRoutes);
app.use('/api/availability', availabilityRoutes);

// Health check for server
app.get('/api/health', (req, res) => {
  res.json({ message: 'Badminton Booking API is running!' });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});