// components/DeleteConfirmation.tsx
import React from 'react';

interface DeleteConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  onConfirm,
  onCancel,
}) => (
  <div>
    <h2 className="text-xl font-bold mb-4">Delete Service</h2>
    <p className="mb-4">Are you sure you want to delete this service? This action cannot be undone.</p>
    <div className="flex justify-end space-x-2">
      <button
        onClick={onCancel}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
      >
        Cancel
      </button>
      <button
        onClick={onConfirm}
        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
      >
        Delete
      </button>
    </div>
  </div>
);