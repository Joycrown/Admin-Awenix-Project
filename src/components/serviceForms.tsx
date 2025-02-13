// components/ServiceForm.tsx
import React from 'react';
import { ServiceFormData } from '../utils/interface';


interface ServiceFormProps {
  onSubmit: (e: React.FormEvent) => Promise<void>;
  formData: ServiceFormData;
  setFormData: React.Dispatch<React.SetStateAction<ServiceFormData>>;
  isEdit?: boolean;
  onCancel: () => void;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({
  onSubmit,
  formData,
  setFormData,
  isEdit = false,
  onCancel
}) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="space-y-2">
      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
        Name
      </label>
      <input
        id="name"
        type="text"
        value={formData.name}
        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        required
      />
    </div>
    <div className="space-y-2">
      <label htmlFor="description" className="block text-sm font-medium text-gray-700">
        Description
      </label>
      <textarea
        id="description"
        value={formData.description}
        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-32"
      />
    </div>
    <div className="space-y-2">
      <label htmlFor="price" className="block text-sm font-medium text-gray-700">
        Price
      </label>
      <input
        id="price"
        type="number"
        value={formData.price}
        onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        required
        min="0"
        step="0.01"
      />
    </div>
    <div className="flex justify-end space-x-2 pt-4">
      <button
        type="button"
        onClick={onCancel}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded hover:bg-blue-060"
      >
        {isEdit ? "Update" : "Add"} Service
      </button>
    </div>
  </form>
);