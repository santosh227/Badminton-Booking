import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, DollarSign, Clock, Calendar } from 'lucide-react';
import { api } from '../../utils/api';

function PricingManagement() {
  const [pricingRules, setPricingRules] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'peak_hours',
    multiplier: '',
    conditions: {},
    isActive: true,
    priority: '1'
  });

  useEffect(() => {
    loadPricingRules();
  }, []);

  const loadPricingRules = async () => {
    try {
      const response = await api.get('/pricing');
      setPricingRules(response.data);
    } catch (error) {
      console.error('Error loading pricing rules:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const ruleData = {
        ...formData,
        multiplier: parseFloat(formData.multiplier),
        priority: parseInt(formData.priority)
      };

      if (editingRule) {
        await api.put(`/pricing/${editingRule._id}`, ruleData);
      } else {
        await api.post('/pricing', ruleData);
      }

      loadPricingRules();
      resetForm();
    } catch (error) {
      console.error('Error saving pricing rule:', error);
      alert('Error saving pricing rule. Please try again.');
    }
  };

  const handleEdit = (rule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      type: rule.type,
      multiplier: rule.multiplier.toString(),
      conditions: rule.conditions || {},
      isActive: rule.isActive,
      priority: rule.priority.toString()
    });
    setShowForm(true);
  };

  const handleDelete = async (rule) => {
    if (!window.confirm(`Are you sure you want to delete the rule "${rule.name}"?`)) {
      return;
    }

    try {
      await api.delete(`/pricing/${rule._id}`);
      loadPricingRules();
    } catch (error) {
      console.error('Error deleting pricing rule:', error);
      alert('Error deleting pricing rule. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      type: 'peak_hours',
      multiplier: '',
      conditions: {},
      isActive: true,
      priority: '1'
    });
    setEditingRule(null);
    setShowForm(false);
  };

  const handleConditionChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        [field]: value
      }
    }));
  };

  const renderConditionFields = () => {
    switch (formData.type) {
      case 'peak_hours':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={formData.conditions.startTime || ''}
                onChange={(e) => handleConditionChange('startTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                value={formData.conditions.endTime || ''}
                onChange={(e) => handleConditionChange('endTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        );

      case 'weekend':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Days (0 = Sunday, 6 = Saturday)
            </label>
            <div className="grid grid-cols-7 gap-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                <label key={index} className="flex items-center space-x-1">
                  <input
                    type="checkbox"
                    checked={(formData.conditions.days || []).includes(index)}
                    onChange={(e) => {
                      const currentDays = formData.conditions.days || [];
                      if (e.target.checked) {
                        handleConditionChange('days', [...currentDays, index]);
                      } else {
                        handleConditionChange('days', currentDays.filter(d => d !== index));
                      }
                    }}
                    className="rounded"
                  />
                  <span className="text-xs">{day}</span>
                </label>
              ))}
            </div>
          </div>
        );

      case 'court_type':
        return (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Court Type
            </label>
            <select
              value={formData.conditions.courtType || ''}
              onChange={(e) => handleConditionChange('courtType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select Court Type</option>
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
            </select>
          </div>
        );

      case 'seasonal':
        return (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={formData.conditions.startDate || ''}
                onChange={(e) => handleConditionChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                value={formData.conditions.endDate || ''}
                onChange={(e) => handleConditionChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getRuleTypeIcon = (type) => {
    switch (type) {
      case 'peak_hours':
        return <Clock className="w-4 h-4" />;
      case 'weekend':
        return <Calendar className="w-4 h-4" />;
      case 'court_type':
        return <DollarSign className="w-4 h-4" />;
      case 'seasonal':
        return <Calendar className="w-4 h-4" />;
      default:
        return <DollarSign className="w-4 h-4" />;
    }
  };

  const formatConditions = (type, conditions) => {
    switch (type) {
      case 'peak_hours':
        return `${conditions.startTime || 'N/A'} - ${conditions.endTime || 'N/A'}`;
      case 'weekend':
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        return (conditions.days || []).map(d => days[d]).join(', ') || 'N/A';
      case 'court_type':
        return conditions.courtType || 'N/A';
      case 'seasonal':
        return `${conditions.startDate || 'N/A'} to ${conditions.endDate || 'N/A'}`;
      default:
        return 'N/A';
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">Pricing Rules Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg"
        >
          <Plus className="w-4 h-4" />
          <span>Add Pricing Rule</span>
        </button>
      </div>

      {/* Pricing Rule Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              {editingRule ? 'Edit Pricing Rule' : 'Add New Pricing Rule'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rule Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Peak Hours Premium"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rule Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value, conditions: {} }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="peak_hours">Peak Hours</option>
                    <option value="weekend">Weekend</option>
                    <option value="court_type">Court Type</option>
                    <option value="seasonal">Seasonal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Multiplier
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    max="10"
                    value={formData.multiplier}
                    onChange={(e) => setFormData(prev => ({ ...prev, multiplier: e.target.value }))}
                    placeholder="1.5"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Conditions
                </label>
                {renderConditionFields()}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority (higher number = higher priority)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="rounded"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                  Rule is active
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg"
                >
                  {editingRule ? 'Update Rule' : 'Add Rule'}
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

      {/* Pricing Rules List */}
      <div className="space-y-4">
        {pricingRules.map((rule) => (
          <div key={rule._id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                {getRuleTypeIcon(rule.type)}
                <h3 className="text-lg font-semibold text-gray-900">{rule.name}</h3>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  rule.isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {rule.isActive ? 'Active' : 'Inactive'}
                </span>
                <button
                  onClick={() => handleEdit(rule)}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(rule)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Type:</span>
                <div className="font-medium capitalize">{rule.type.replace('_', ' ')}</div>
              </div>

              <div>
                <span className="text-gray-600">Multiplier:</span>
                <div className="font-medium">×{rule.multiplier}</div>
              </div>

              <div>
                <span className="text-gray-600">Priority:</span>
                <div className="font-medium">{rule.priority}</div>
              </div>

              <div>
                <span className="text-gray-600">Conditions:</span>
                <div className="font-medium">{formatConditions(rule.type, rule.conditions)}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PricingManagement;