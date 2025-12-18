import React, { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import CourtSelection from '../components/Booking/CourtSelection';
import TimeSlotSelection from '../components/Booking/TimeSlotSelection';
import EquipmentSelection from '../components/Booking/EquipmentSelection';
import CoachSelection from '../components/Booking/CoachSelection';
import BookingForm from '../components/Booking/BookingForm';
import PriceBreakdown from '../components/Booking/PriceBreakdown';
import { api } from '../utils/api';

function BookingPage() {
  const [bookingData, setBookingData] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    court: null,
    timeSlot: null,
    equipment: [],
    coach: null,
    customerInfo: {
      name: '',
      email: '',
      phone: ''
    }
  });
  
  const [courts, setCourts] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (bookingData.date) {
      loadAvailableSlots();
    }
  }, [bookingData.date]);

  useEffect(() => {
    if (bookingData.court && bookingData.timeSlot) {
      calculatePricing();
    }
  }, [bookingData.court, bookingData.timeSlot, bookingData.equipment, bookingData.coach]);

  const loadInitialData = async () => {
    try {
      const [courtsRes, equipmentRes, coachesRes] = await Promise.all([
        api.get('/courts'),
        api.get('/equipment'),
        api.get('/coaches')
      ]);
      
      setCourts(courtsRes.data);
      setEquipment(equipmentRes.data);
      setCoaches(coachesRes.data);
    } catch (error) {
      console.error('Error loading initial data:', error);
    }
  };

  const loadAvailableSlots = async () => {
    try {
      const response = await api.get(`/availability/slots?date=${bookingData.date}`);
      setAvailableSlots(response.data);
    } catch (error) {
      console.error('Error loading available slots:', error);
    }
  };

  const calculatePricing = async () => {
    if (!bookingData.court || !bookingData.timeSlot) return;

    try {
      const response = await api.post('/pricing/calculate', {
        courtId: bookingData.court._id,
        date: bookingData.date,
        startTime: bookingData.timeSlot.startTime,
        endTime: bookingData.timeSlot.endTime,
        equipment: bookingData.equipment,
        coachId: bookingData.coach?._id
      });
      
      setPricing(response.data);
    } catch (error) {
      console.error('Error calculating pricing:', error);
    }
  };

  const handleDateChange = (date) => {
    setBookingData(prev => ({
      ...prev,
      date,
      court: null,
      timeSlot: null
    }));
    setStep(1);
  };

  const handleCourtSelect = (court) => {
    setBookingData(prev => ({
      ...prev,
      court,
      timeSlot: null
    }));
    setStep(2);
  };

  const handleTimeSlotSelect = (timeSlot) => {
    setBookingData(prev => ({
      ...prev,
      timeSlot
    }));
    setStep(3);
  };

  const handleEquipmentChange = (selectedEquipment) => {
    setBookingData(prev => ({
      ...prev,
      equipment: selectedEquipment
    }));
  };

  const handleCoachSelect = (coach) => {
    setBookingData(prev => ({
      ...prev,
      coach
    }));
  };

  const handleCustomerInfoChange = (customerInfo) => {
    setBookingData(prev => ({
      ...prev,
      customerInfo
    }));
  };

  const handleBookingSubmit = async () => {
    setLoading(true);
    try {
      const bookingPayload = {
        customerName: bookingData.customerInfo.name,
        customerEmail: bookingData.customerInfo.email,
        customerPhone: bookingData.customerInfo.phone,
        court: bookingData.court._id,
        date: bookingData.date,
        startTime: bookingData.timeSlot.startTime,
        endTime: bookingData.timeSlot.endTime,
        equipment: bookingData.equipment.map(eq => ({
          item: eq.item._id,
          quantity: eq.quantity
        })),
        coach: bookingData.coach?._id || null
      };

      const response = await api.post('/bookings', bookingPayload);
      
      // Reset form
      setBookingData({
        date: format(new Date(), 'yyyy-MM-dd'),
        court: null,
        timeSlot: null,
        equipment: [],
        coach: null,
        customerInfo: {
          name: '',
          email: '',
          phone: ''
        }
      });
      setStep(1);
      setPricing(null);
      
      alert('Booking confirmed successfully!');
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Error creating booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canProceedToNextStep = () => {
    switch (step) {
      case 1: return bookingData.court !== null;
      case 2: return bookingData.timeSlot !== null;
      case 3: return true; // Equipment and coach are optional
      default: return false;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Book a Court</h1>
        <p className="text-gray-600">Select your preferred date, court, and time slot</p>
      </div>

      {/* Date Selection */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Date
        </label>
        <div className="flex space-x-2">
          {[0, 1, 2, 3, 4, 5, 6].map(days => {
            const date = addDays(new Date(), days);
            const dateStr = format(date, 'yyyy-MM-dd');
            return (
              <button
                key={dateStr}
                onClick={() => handleDateChange(dateStr)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  bookingData.date === dateStr
                    ? 'bg-primary-500 text-white'
                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div>{format(date, 'MMM dd')}</div>
                <div className="text-xs">{format(date, 'EEE')}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Court Selection */}
          <CourtSelection
            courts={courts}
            selectedCourt={bookingData.court}
            onCourtSelect={handleCourtSelect}
            isActive={step >= 1}
          />

          {/* Step 2: Time Slot Selection */}
          {step >= 2 && (
            <TimeSlotSelection
              availableSlots={availableSlots}
              selectedCourt={bookingData.court}
              selectedTimeSlot={bookingData.timeSlot}
              onTimeSlotSelect={handleTimeSlotSelect}
              isActive={step >= 2}
            />
          )}

          {/* Step 3: Equipment and Coach Selection */}
          {step >= 3 && (
            <>
              <EquipmentSelection
                equipment={equipment}
                selectedEquipment={bookingData.equipment}
                onEquipmentChange={handleEquipmentChange}
              />

              <CoachSelection
                coaches={coaches}
                selectedCoach={bookingData.coach}
                onCoachSelect={handleCoachSelect}
                date={bookingData.date}
                timeSlot={bookingData.timeSlot}
              />

              <BookingForm
                customerInfo={bookingData.customerInfo}
                onCustomerInfoChange={handleCustomerInfoChange}
                onSubmit={handleBookingSubmit}
                loading={loading}
                canSubmit={bookingData.customerInfo.name && bookingData.customerInfo.email}
              />
            </>
          )}
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <PriceBreakdown
            bookingData={bookingData}
            pricing={pricing}
            onNextStep={() => setStep(step + 1)}
            canProceed={canProceedToNextStep()}
            currentStep={step}
          />
        </div>
      </div>
    </div>
  );
}

export default BookingPage;