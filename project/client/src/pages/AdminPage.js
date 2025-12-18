import React, { useState } from 'react';
import { Settings, MapPin, ShoppingBag, User, DollarSign } from 'lucide-react';
import CourtsManagement from '../components/Admin/CourtsManagement';
import EquipmentManagement from '../components/Admin/EquipmentManagement';
import CoachesManagement from '../components/Admin/CoachesManagement';
import PricingManagement from '../components/Admin/PricingManagement';

function AdminPage() {
  const [activeTab, setActiveTab] = useState('courts');

  const tabs = [
    { key: 'courts', label: 'Courts', icon: MapPin },
    { key: 'equipment', label: 'Equipment', icon: ShoppingBag },
    { key: 'coaches', label: 'Coaches', icon: User },
    { key: 'pricing', label: 'Pricing Rules', icon: DollarSign }
  ];

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'courts':
        return <CourtsManagement />;
      case 'equipment':
        return <EquipmentManagement />;
      case 'coaches':
        return <CoachesManagement />;
      case 'pricing':
        return <PricingManagement />;
      default:
        return <CourtsManagement />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-2">
          <Settings className="w-8 h-8 text-primary-500" />
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        </div>
        <p className="text-gray-600">Manage courts, equipment, coaches, and pricing rules</p>
      </div>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.key
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {renderActiveComponent()}
    </div>
  );
}

export default AdminPage;