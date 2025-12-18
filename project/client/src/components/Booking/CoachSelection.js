import React from 'react';
import { User, Star, Clock } from 'lucide-react';

function CoachSelection({ coaches, selectedCoach, onCoachSelect, date, timeSlot }) {
  const formatAvailability = (availability) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return availability.map(av => 
      `${days[av.dayOfWeek]}: ${av.startTime}-${av.endTime}`
    ).join(', ');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center space-x-2 mb-4">
        <User className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Book a Coach</h2>
        <span className="text-sm text-gray-500">(Optional)</span>
      </div>

      <div className="space-y-4">
        <div
          onClick={() => onCoachSelect(null)}
          className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
            selectedCoach === null
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className="text-center text-gray-600">
            <User className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <span>No coach needed</span>
          </div>
        </div>

        {coaches.map((coach) => (
          <div
            key={coach._id}
            onClick={() => onCoachSelect(coach)}
            className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
              selectedCoach?._id === coach._id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-medium text-gray-900">{coach.name}</h3>
                <p className="text-sm text-gray-600">{coach.email}</p>
                {coach.phone && (
                  <p className="text-sm text-gray-600">{coach.phone}</p>
                )}
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  ${coach.hourlyRate}/hour
                </div>
              </div>
            </div>

            {coach.bio && (
              <p className="text-sm text-gray-600 mb-2">{coach.bio}</p>
            )}

            {coach.specialization && coach.specialization.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {coach.specialization.map((spec, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Clock className="w-3 h-3" />
              <span>Available: {formatAvailability(coach.availability)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CoachSelection;