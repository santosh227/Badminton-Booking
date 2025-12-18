import React from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, ShoppingBag, User, DollarSign } from 'lucide-react';

function PriceBreakdown({ bookingData, pricing, onNextStep, canProceed, currentStep }) {
  const formatDate = (dateStr) => {
    return format(new Date(dateStr), 'EEEE, MMMM dd, yyyy');
  };

  const getTotalEquipmentQuantity = () => {
    return bookingData.equipment.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h2>

      <div className="space-y-4">
        {/* Date */}
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-gray-400" />
          <div>
            <div className="text-sm text-gray-600">Date</div>
            <div className="font-medium">{formatDate(bookingData.date)}</div>
          </div>
        </div>

        {/* Court */}
        {bookingData.court && (
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-sm text-gray-600">Court</div>
              <div className="font-medium">{bookingData.court.name}</div>
              <div className="text-xs text-gray-500 capitalize">{bookingData.court.type}</div>
            </div>
          </div>
        )}

        {/* Time Slot */}
        {bookingData.timeSlot && (
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-sm text-gray-600">Time</div>
              <div className="font-medium">
                {bookingData.timeSlot.startTime} - {bookingData.timeSlot.endTime}
              </div>
              <div className="text-xs text-gray-500">1 hour</div>
            </div>
          </div>
        )}

        {/* Equipment */}
        {bookingData.equipment.length > 0 && (
          <div className="flex items-start space-x-3">
            <ShoppingBag className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <div className="text-sm text-gray-600 mb-1">Equipment</div>
              {bookingData.equipment.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.item.name} × {item.quantity}</span>
                  <span className="text-gray-600">${item.item.pricePerHour * item.quantity}/hr</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Coach */}
        {bookingData.coach && (
          <div className="flex items-center space-x-3">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <div className="text-sm text-gray-600">Coach</div>
              <div className="font-medium">{bookingData.coach.name}</div>
              <div className="text-xs text-gray-500">${bookingData.coach.hourlyRate}/hour</div>
            </div>
          </div>
        )}

        {/* Price Breakdown */}
        {pricing && (
          <div className="border-t pt-4 mt-4">
            <div className="flex items-center space-x-2 mb-3">
              <DollarSign className="w-5 h-5 text-gray-400" />
              <span className="font-medium">Price Breakdown</span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Court Fee</span>
                <span>${pricing.courtPrice}</span>
              </div>

              {pricing.equipmentPrice > 0 && (
                <div className="flex justify-between">
                  <span>Equipment Rental</span>
                  <span>${pricing.equipmentPrice}</span>
                </div>
              )}

              {pricing.coachPrice > 0 && (
                <div className="flex justify-between">
                  <span>Coach Fee</span>
                  <span>${pricing.coachPrice}</span>
                </div>
              )}

              {pricing.appliedRules && pricing.appliedRules.length > 0 && (
                <div className="text-xs text-gray-600 pt-2">
                  <div>Applied pricing rules:</div>
                  {pricing.appliedRules.map((rule, index) => (
                    <div key={index} className="flex justify-between">
                      <span>• {rule.ruleName}</span>
                      <span>×{rule.multiplier}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t pt-2 flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>${pricing.totalPrice}</span>
              </div>
            </div>
          </div>
        )}

        {/* Next Step Button */}
        {currentStep < 3 && canProceed && (
          <button
            onClick={onNextStep}
            className="w-full mt-6 py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-colors"
          >
            Continue to {currentStep === 1 ? 'Time Selection' : 'Additional Options'}
          </button>
        )}
      </div>
    </div>
  );
}

export default PriceBreakdown;