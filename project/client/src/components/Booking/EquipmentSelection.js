import React from 'react';
import { ShoppingBag, Minus, Plus } from 'lucide-react';

function EquipmentSelection({ equipment, selectedEquipment, onEquipmentChange }) {
  const handleQuantityChange = (equipmentItem, change) => {
    const existingItem = selectedEquipment.find(
      item => item.item._id === equipmentItem._id
    );
    
    let newSelectedEquipment = [...selectedEquipment];
    
    if (existingItem) {
      const newQuantity = existingItem.quantity + change;
      
      if (newQuantity <= 0) {
        newSelectedEquipment = newSelectedEquipment.filter(
          item => item.item._id !== equipmentItem._id
        );
      } else if (newQuantity <= equipmentItem.availableQuantity) {
        existingItem.quantity = newQuantity;
      }
    } else if (change > 0 && equipmentItem.availableQuantity > 0) {
      newSelectedEquipment.push({
        item: equipmentItem,
        quantity: 1
      });
    }
    
    onEquipmentChange(newSelectedEquipment);
  };

  const getSelectedQuantity = (equipmentItem) => {
    const selected = selectedEquipment.find(
      item => item.item._id === equipmentItem._id
    );
    return selected ? selected.quantity : 0;
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center space-x-2 mb-4">
        <ShoppingBag className="w-5 h-5 text-gray-600" />
        <h2 className="text-lg font-semibold text-gray-900">Equipment Rental</h2>
        <span className="text-sm text-gray-500">(Optional)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {equipment.map((item) => {
          const selectedQty = getSelectedQuantity(item);
          
          return (
            <div key={item._id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.type === 'racket'
                    ? 'bg-orange-100 text-orange-700'
                    : item.type === 'shoes'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-700'
                }`}>
                  {item.type}
                </span>
              </div>

              {item.description && (
                <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              )}

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span className="font-medium text-gray-900">
                    ${item.pricePerHour}/hour
                  </span>
                  <div className="text-gray-500">
                    {item.availableQuantity} available
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleQuantityChange(item, -1)}
                    disabled={selectedQty === 0}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  
                  <span className="w-8 text-center font-medium">
                    {selectedQty}
                  </span>
                  
                  <button
                    onClick={() => handleQuantityChange(item, 1)}
                    disabled={selectedQty >= item.availableQuantity}
                    className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EquipmentSelection;