import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { api } from '../../utils/api';

function CourtsManagement() {
  const [courts, setCourts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCourt, setEditingCourt] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'indoor',
    basePrice: '',
    amenities: [],
    isActive: true,
  });

  useEffect(() => {
    loadCourts();
  }, []);

  const loadCourts = async () => {
    try {
      const response = await api.get('/courts');
      const data = Array.isArray(response.data) ? response.data : [];
      setCourts(data);
    } catch (error) {
      console.error('Error loading courts:', error);
      setCourts([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const courtData = {
        ...formData,
        basePrice: parseFloat(formData.basePrice || '0'),
        amenities: Array.isArray(formData.amenities)
          ? formData.amenities.filter((a) => a && a.trim() !== '')
          : [],
      };

      if (editingCourt) {
        await api.put(`/courts/${editingCourt._id}`, courtData);
      } else {
        await api.post('/courts', courtData);
      }

      await loadCourts();
      resetForm();
    } catch (error) {
      console.error('Error saving court:', error);
      alert('Error saving court. Please try again.');
    }
  };

  const handleEdit = (court) => {
    setEditingCourt(court);
    setFormData({
      name: court.name || '',
      type: court.type || 'indoor',
      basePrice:
        typeof court.basePrice === 'number'
          ? court.basePrice.toString()
          : court.basePrice || '',
      amenities: Array.isArray(court.amenities) ? court.amenities : [],
      isActive: court.isActive ?? true,
    });
    setShowForm(true);
  };

  const handleDelete = async (court) => {
    if (!window.confirm(`Are you sure you want to delete ${court.name}?`)) {
      return;
    }

    try {
      await api.delete(`/courts/${court._id}`);
      await loadCourts();
    } catch (error) {
      console.error('Error deleting court:', error);
      alert('Error deleting court. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'indoor',
      basePrice: '',
      amenities: [],
      isActive: true,
    });
    setEditingCourt(null);
    setShowForm(false);
  };

  const addAmenity = () => {
    setFormData((prev) => ({
      ...prev,
      amenities: Array.isArray(prev.amenities)
        ? [...prev.amenities, '']
        : [''],
    }));
  };

  const updateAmenity = (index, value) => {
    const prevAmenities = Array.isArray(formData.amenities)
      ? formData.amenities
      : [];
    const newAmenities = [...prevAmenities];
    newAmenities[index] = value;
    setFormData((prev) => ({
      ...prev,
      amenities: newAmenities,
    }));
  };

  const removeAmenity = (index) => {
    setFormData((prev) => ({
      ...prev,
      amenities: Array.isArray(prev.amenities)
        ? prev.amenities.filter((_, i) => i !== index)
        : [],
    }));
  };

  const safeCourts = Array.isArray(courts) ? courts : [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Courts Management
        </h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add Court</span>
        </button>
      </div>

      {/* Court Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingCourt ? 'Edit Court' : 'Add New Court'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Court Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g., Court A"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Court Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="indoor">Indoor</option>
                  <option value="outdoor">Outdoor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base Price (per hour)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.basePrice}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      basePrice: e.target.value,
                    }))
                  }
                  placeholder="0.00"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Amenities
                  </label>
                  <button
                    type="button"
                    onClick={addAmenity}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    + Add Amenity
                  </button>
                </div>
                {Array.isArray(formData.amenities) &&
                  formData.amenities.map((amenity, index) => (
                    <div key={index} className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={amenity}
                        onChange={(e) => updateAmenity(index, e.target.value)}
                        placeholder="e.g., WiFi, Parking"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeAmenity(index)}
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
                  {editingCourt ? 'Update Court' : 'Add Court'}
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

      {/* Courts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {safeCourts.map((court) => (
          <div
            key={court._id}
            className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">
                  {court.name}
                </h3>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEdit(court)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(court)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Type:</span>
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

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Base Price:</span>
                <span className="font-medium">
                  ${court.basePrice}/hour
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Status:</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    court.isActive
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {court.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>

              {Array.isArray(court.amenities) &&
                court.amenities.length > 0 && (
                  <div>
                    <span className="text-sm text-gray-600">Amenities:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {court.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CourtsManagement;
