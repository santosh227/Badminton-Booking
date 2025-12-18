import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin, User, ShoppingBag, X } from 'lucide-react';
import { api } from '../utils/api';

function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, confirmed, cancelled, completed

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const response = await api.get('/bookings');
      setBookings(response.data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await api.patch(`/bookings/${bookingId}/cancel`);
      loadBookings(); // Reload bookings
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Error cancelling booking. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true;
    return booking.status === filter;
  });

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading bookings...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookings</h1>
        <p className="text-gray-600">View and manage all court bookings</p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { key: 'all', label: 'All Bookings' },
              { key: 'confirmed', label: 'Confirmed' },
              { key: 'completed', label: 'Completed' },
              { key: 'cancelled', label: 'Cancelled' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  filter === tab.key
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
                <span className="ml-2 py-0.5 px-2 rounded-full text-xs bg-gray-100 text-gray-600">
                  {bookings.filter(b => tab.key === 'all' || b.status === tab.key).length}
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
          <p className="text-gray-600">
            {filter === 'all' 
              ? 'There are no bookings yet.' 
              : `There are no ${filter} bookings.`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {booking.customerName}
                  </h3>
                  <p className="text-gray-600">{booking.customerEmail}</p>
                  {booking.customerPhone && (
                    <p className="text-gray-600">{booking.customerPhone}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                  
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => handleCancelBooking(booking._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Cancel booking"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Date & Time */}
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium">
                      {format(new Date(booking.date), 'MMM dd, yyyy')}
                    </div>
                    <div className="text-xs text-gray-600">
                      {booking.startTime} - {booking.endTime}
                    </div>
                  </div>
                </div>

                {/* Court */}
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm font-medium">{booking.court.name}</div>
                    <div className="text-xs text-gray-600 capitalize">{booking.court.type}</div>
                  </div>
                </div>

                {/* Equipment */}
                {booking.equipment && booking.equipment.length > 0 ? (
                  <div className="flex items-center space-x-2">
                    <ShoppingBag className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium">Equipment</div>
                      <div className="text-xs text-gray-600">
                        {booking.equipment.map(eq => `${eq.item.name} (${eq.quantity})`).join(', ')}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-gray-400">
                    <ShoppingBag className="w-4 h-4" />
                    <div className="text-sm">No equipment</div>
                  </div>
                )}

                {/* Coach */}
                {booking.coach ? (
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium">{booking.coach.name}</div>
                      <div className="text-xs text-gray-600">Coach</div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 text-gray-400">
                    <User className="w-4 h-4" />
                    <div className="text-sm">No coach</div>
                  </div>
                )}
              </div>

              {/* Pricing */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    <span>Court: ${booking.pricing.courtPrice}</span>
                    {booking.pricing.equipmentPrice > 0 && (
                      <span className="ml-4">Equipment: ${booking.pricing.equipmentPrice}</span>
                    )}
                    {booking.pricing.coachPrice > 0 && (
                      <span className="ml-4">Coach: ${booking.pricing.coachPrice}</span>
                    )}
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    Total: ${booking.pricing.totalPrice}
                  </div>
                </div>

                {booking.pricing.appliedRules && booking.pricing.appliedRules.length > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    Applied rules: {booking.pricing.appliedRules.map(rule => rule.ruleName).join(', ')}
                  </div>
                )}
              </div>

              {booking.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-1">Notes:</div>
                  <div className="text-sm text-gray-600">{booking.notes}</div>
                </div>
              )}

              <div className="mt-4 text-xs text-gray-500">
                Booked on {format(new Date(booking.createdAt), 'MMM dd, yyyy \'at\' h:mm a')}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookingsPage;