// components/ServiceTable.tsx
import React from 'react';
import { ServiceProps } from '../utils/interface';


interface ServiceTableProps {
  services: ServiceProps[];
  onEdit: (service: ServiceProps) => void;
  onDelete: (service: ServiceProps) => void;
}

export const ServiceTable: React.FC<ServiceTableProps> = ({
  services,
  onEdit,
  onDelete,
}) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Name
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Description
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Price
          </th>
          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        {services.map((service) => (
          <tr key={service.id} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-gray-900">{service.name}</div>
            </td>
            <td className="px-6 py-4">
              <div className="text-sm text-gray-500">{service.description}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-gray-900">₦ {service.price.toFixed(2)}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <button
                onClick={() => onEdit(service)}
                className="text-blue-500 hover:text-blue-400 mr-4"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(service)}
                className="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);