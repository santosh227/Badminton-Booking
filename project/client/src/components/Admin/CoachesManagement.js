import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, User, Clock } from 'lucide-react';
import { api } from '../../utils/api';

function CoachesManagement() {
  const [coaches, setCoaches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCoach, setEditingCoach] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    hourlyRate: '',
    specialization: [],
    availability: [],
    bio: '',
    isActive: true
  });

  const daysOfWeek = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' }
  ];

  useEffect(() => {
    loadCoaches();
  }, []);

  const loadCoaches = async () => {
    try {
      const response = await api.get('/coaches');
      setCoaches(response.data);
    } catch (error) {
      console.error('Error loading coaches:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const coachData = {
        ...formData,
        hourlyRate: parseFloat(formData.hourlyRate),
        specialization: formData.specialization.filter(s => s.trim() !== ''),
        availability: formData.availability.filter(av => av.dayOfWeek !== undefined)
      };

      if (editingCoach) {
        await api.put(`/coaches/${editingCoach._id}`, coachData);
      } else {
        await api.post('/coaches', coachData);
      }

      loadCoaches();
      resetForm();
    } catch (error) {
      console.error('Error saving coach:', error);
      alert('Error saving coach. Please try again.');
    }
  };

  const handleEdit = (coach) => {
    setEditingCoach(coach);
    setFormData({
      name: coach.name,
      email: coach.email,
      phone: coach.phone || '',
      hourlyRate: coach.hourlyRate.toString(),
      specialization: coach.specialization || [],
      availability: coach.availability || [],
      bio: coach.bio || '',
      isActive: coach.isActive
    });
    setShowForm(true);
  };

  const handleDelete = async (coach) => {
    if (!window.confirm(`Are you sure you want to delete ${coach.name}?`)) {
      return;
    }

    try {
      await api.delete(`/coaches/${coach._id}`);
      loadCoaches();
    } catch (error) {
      console.error('Error deleting coach:', error);
      alert('Error deleting coach. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      hourlyRate: '',
      specialization: [],
      availability: [],
      bio: '',
      isActive: true
    });
    setEditingCoach(null);
    setShowForm(false);
  };

  const addSpecialization = () => {
    setFormData(prev => ({
      ...prev,
      specialization: [...prev.specialization, '']
    }));
  };

  const updateSpecialization = (index, value) => {
    const newSpecialization = [...formData.specialization];
    newSpecialization[index] = value;
    setFormData(prev => ({
      ...prev,
      specialization: newSpecialization
    }));
  };

  const removeSpecialization = (index) => {
    setFormData(prev => ({
      ...prev,
      specialization: prev.specialization.filter((_, i) => i !== index)
    }));
  };

  const addAvailability = () => {
    setFormData(prev => ({
      ...prev,
      availability: [...prev.availability, { dayOfWeek: 1, startTime: '09:00', endTime: '17:00' }]
    }));
  };

  const updateAvailability = (index, field, value) => {
    const newAvailability = [...formData.availability];
    newAvailability[index] = { ...newAvailability[index], [field]: value };
    setFormData(prev => ({
      ...prev,
      availability: newAvailability
    }));
  };

  const removeAvailability = (index) => {
    setFormData(prev => ({
      ...prev,
      availability: prev.availability.filter((_, i) => i !== index)
    }));
  };

  const formatAvailability = (availability) => {
    return availability.map(av => 
      `${daysOfWeek.find(d => d.value === av.dayOfWeek)?.label}: ${av.startTime}-${av.endTime}`
    ).join(', ');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Coaches Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add Coach</span>
        </button>
      </div>

      {/* Coach Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl m-4 max-h-screen overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingCoach ? 'Edit Coach' : 'Add New Coach'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Coach Name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="coach@example.com"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="Phone number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hourly Rate
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: e.target.value }))}
                    placeholder="0.00"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  placeholder="Coach biography and experience..."
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Specializations
                  </label>
                  <button
                    type="button"
                    onClick={addSpecialization}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    + Add Specialization
                  </button>
                </div>
                {formData.specialization.map((spec, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={spec}
                      onChange={(e) => updateSpecialization(index, e.target.value)}
                      placeholder="e.g., Singles, Doubles, Beginners"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpecialization(index)}
                      className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Availability
                  </label>
                  <button
                    type="button"
                    onClick={addAvailability}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    + Add Schedule
                  </button>
                </div>
                {formData.availability.map((av, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <select
                      value={av.dayOfWeek}
                      onChange={(e) => updateAvailability(index, 'dayOfWeek', parseInt(e.target.value))}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    >
                      {daysOfWeek.map(day => (
                        <option key={day.value} value={day.value}>{day.label}</option>
                      ))}
                    </select>
                    <input
                      type="time"
                      value={av.startTime}
                      onChange={(e) => updateAvailability(index, 'startTime', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                    <input
                      type="time"
                      value={av.endTime}
                      onChange={(e) => updateAvailability(index, 'endTime', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeAvailability(index)}
                      className="px-2 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg"
                >
                  {editingCoach ? 'Update Coach' : 'Add Coach'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-2 px-4 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coaches List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {coaches.map((coach) => (
          <div key={coach._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">{coach.name}</h3>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEdit(coach)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(coach)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Email:</span>
                <span className="ml-2 text-sm font-medium">{coach.email}</span>
              </div>

              {coach.phone && (
                <div>
                  <span className="text-sm text-gray-600">Phone:</span>
                  <span className="ml-2 text-sm font-medium">{coach.phone}</span>
                </div>
              )}

              <div>
                <span className="text-sm text-gray-600">Rate:</span>
                <span className="ml-2 font-medium">${coach.hourlyRate}/hour</span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  coach.isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {coach.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {coach.bio && (
                <div>
                  <span className="text-sm text-gray-600">Bio:</span>
                  <p className="text-sm text-gray-800 mt-1">{coach.bio}</p>
                </div>
              )}

              {coach.specialization && coach.specialization.length > 0 && (
                <div>
                  <span className="text-sm text-gray-600">Specializations:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {coach.specialization.map((spec, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {coach.availability && coach.availability.length > 0 && (
                <div>
                  <div className="flex items-center space-x-1 text-sm text-gray-600 mb-1">
                    <Clock className="w-3 h-3" />
                    <span>Availability:</span>
                  </div>
                  <p className="text-xs text-gray-700">{formatAvailability(coach.availability)}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CoachesManagement;