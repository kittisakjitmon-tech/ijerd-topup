import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { createOrder, generatePaymentQRData } from '../services/orderService';

const OrderForm = ({ game, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    targetId: '',
    packageName: '',
    amount: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Default packages - you can customize these or fetch from Firestore
  const defaultPackages = [
    { name: 'Starter Pack', amount: 9.99 },
    { name: 'Standard Pack', amount: 19.99 },
    { name: 'Premium Pack', amount: 49.99 },
    { name: 'Ultimate Pack', amount: 99.99 },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Auto-fill amount when package is selected
    if (name === 'packageName') {
      const selectedPackage = defaultPackages.find(pkg => pkg.name === value);
      if (selectedPackage) {
        setFormData(prev => ({
          ...prev,
          amount: selectedPackage.amount.toString(),
        }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.targetId.trim()) {
      setError('Please enter your Game ID');
      return;
    }
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please select a valid package or enter an amount');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const newOrder = await createOrder({
        gameName: game.name,
        targetId: formData.targetId.trim(),
        amount: parseFloat(formData.amount),
        packageName: formData.packageName || null,
      });
      
      setOrder(newOrder);
      setShowSuccess(true);
      
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess(newOrder);
      }
    } catch (err) {
      console.error('Error creating order:', err);
      setError(err.message || 'Failed to create order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (showSuccess) {
      setShowSuccess(false);
      setOrder(null);
      setFormData({ targetId: '', packageName: '', amount: '' });
    }
    if (onClose) {
      onClose();
    }
  };

  if (showSuccess && order) {
    const qrData = generatePaymentQRData(order);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg max-w-md w-full p-6 md:p-8 shadow-xl">
          <div className="text-center">
            <div className="mb-4">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Order Created Successfully!</h3>
            <p className="text-gray-600 mb-6">Please scan the QR code to complete payment</p>
            
            {/* Order Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID:</span>
                  <span className="font-semibold text-gray-900">{order.orderId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Game:</span>
                  <span className="font-semibold text-gray-900">{order.gameName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Game ID:</span>
                  <span className="font-semibold text-gray-900">{order.targetId}</span>
                </div>
                {order.packageName && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Package:</span>
                    <span className="font-semibold text-gray-900">{order.packageName}</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="text-gray-600">Amount:</span>
                  <span className="font-bold text-[#F97316] text-lg">${order.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* QR Code */}
            <div className="flex justify-center mb-6">
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <QRCodeSVG 
                  value={qrData}
                  size={200}
                  level="H"
                  includeMargin={true}
                />
              </div>
            </div>
            
            <p className="text-xs text-gray-500 mb-6">
              Scan this QR code with your payment app to complete the transaction
            </p>
            
            <button
              onClick={handleClose}
              className="w-full bg-[#F97316] text-white px-6 py-3 rounded-lg hover:bg-[#EA580C] transition-colors duration-200 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 md:p-8 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Top Up Order</h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Game Info */}
        <div className="bg-[#F97316] bg-opacity-10 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-4">
            {game.imageUrl && (
              <img
                src={game.imageUrl}
                alt={game.name}
                className="w-16 h-16 object-cover rounded"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            )}
            <div>
              <h4 className="font-bold text-gray-900">{game.name}</h4>
              <p className="text-sm text-gray-600">{game.category}</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="targetId" className="block text-sm font-medium text-gray-700 mb-1">
              Game ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="targetId"
              name="targetId"
              value={formData.targetId}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none"
              placeholder="Enter your Game ID"
            />
            <p className="text-xs text-gray-500 mt-1">Your in-game username or ID</p>
          </div>

          <div>
            <label htmlFor="packageName" className="block text-sm font-medium text-gray-700 mb-1">
              Select Package
            </label>
            <select
              id="packageName"
              name="packageName"
              value={formData.packageName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none"
            >
              <option value="">Select a package...</option>
              {defaultPackages.map((pkg) => (
                <option key={pkg.name} value={pkg.name}>
                  {pkg.name} - ${pkg.amount.toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount (USD) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              required
              min="0.01"
              step="0.01"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent outline-none"
              placeholder="0.00"
            />
            <p className="text-xs text-gray-500 mt-1">Enter custom amount or select a package above</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-6 py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#EA580C] transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Creating...' : 'Confirm Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderForm;
