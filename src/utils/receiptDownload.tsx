/* eslint-disable @typescript-eslint/no-explicit-any */
import  { useState } from 'react';
import {  FaDownload, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';


const ReceiptDownload = ({ receiptUrl, orderId, receivedFrom }:any) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
   
      
      const response = await fetch(receiptUrl);
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      if (receivedFrom === "pending"){
        a.download = `receipt_initial_${orderId}.pdf`;
      } else {
        a.download = `receipt_${orderId}.pdf`;

      }
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      toast.error('Failed to download receipt. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // const handlePreview = () => {
  //   window.open(receiptUrl, '_blank');
  // };


  

  return (
    <div className="flex gap-2">
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        {isDownloading ? (
          <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <FaDownload className="w-4 h-4 mr-2" />
        )}
        Receipt
      </button>
      
    </div>
  );
};

export default ReceiptDownload;