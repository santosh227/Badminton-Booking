import React from 'react';
import { Clock } from 'lucide-react';

function TimeSlotSelection({ 
  availableSlots, 
  selectedCourt, 
  selectedTimeSlot, 
  onTimeSlotSelect, 
  isActive 
}) {
  const courtSlots = availableSlots.find(
    slot => slot.court._id === selectedCourt?._id
  );

  if (!isActive || !selectedCourt) {
    return null;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-primary-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Select Time Slot</h2>
        <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
          Step 2
        </span>
      </div>

      <div className="mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Court: {selectedCourt.name}</span>
        </div>
      </div>

      {courtSlots ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {courtSlots.slots.map((slot, index) => (
            <button
              key={index}
              onClick={() => slot.available && onTimeSlotSelect(slot)}
              disabled={!slot.available}
              className={`p-3 rounded-lg text-sm font-medium transition-all ${
                selectedTimeSlot?.startTime === slot.startTime
                  ? 'bg-primary-500 text-white'
                  : slot.available
                    ? 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <div>{slot.startTime}</div>
              <div className="text-xs opacity-80">
                {slot.available ? 'Available' : 'Booked'}
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-4 opacity-30" />
          <p>Loading available time slots...</p>
        </div>
      )}
    </div>
  );
}

export default TimeSlotSelection;