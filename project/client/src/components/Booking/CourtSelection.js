import React from 'react';
import { MapPin, Wifi, Car, Coffee } from 'lucide-react';

function CourtSelection({ courts, selectedCourt, onCourtSelect, isActive }) {
 
  const safeCourts = Array.isArray(courts) ? courts : [];

  const getCourtIcon = (amenity) => {
    const icons = {
      wifi: <Wifi className="w-4 h-4" />,
      parking: <Car className="w-4 h-4" />,
      cafe: <Coffee className="w-4 h-4" />
    };

    // amenity might be undefined, so guard before toLowerCase
    return icons[amenity?.toLowerCase()] || <MapPin className="w-4 h-4" />;
  };

  return (
    <div
      className={`p-6 bg-white rounded-lg shadow-sm border ${
        isActive ? 'border-primary-200' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Select Court</h2>
        <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
          Step 1
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {safeCourts.map((court) => (
          <div
            key={court._id}
            onClick={() => onCourtSelect(court)}
            className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
              selectedCourt?._id === court._id
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">{court.name}</h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  court.type === 'indoor'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-green-100 text-green-700'
                }`}
              >
                {court.type}
              </span>
            </div>

            <div className="text-sm text-gray-600 mb-3">
              Base Price:{' '}
              <span className="font-medium text-gray-900">
                ${court.basePrice}/hour
              </span>
            </div>

            {Array.isArray(court.amenities) && court.amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {court.amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-1 text-xs text-gray-500"
                  >
                    {getCourtIcon(amenity)}
                    <span className="capitalize">{amenity}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourtSelection;
