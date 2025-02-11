import React, { useState } from 'react';
import { IndianRupee, CreditCard, QrCode } from 'lucide-react';

interface PaymentDetails {
  amount: number;
  description: string;
  upiId: string;
}

// Updated UPI transaction limits to be more conservative
const UPI_LIMITS = {
  MIN_AMOUNT: 1,
  MAX_AMOUNT: 5000,
  MAX_DAILY: 25000,
};

export default function PaymentPage() {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    amount: 0,
    description: '',
    upiId: '',
  });
  const [error, setError] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setError('');

    if (name === 'amount') {
      const numValue = parseFloat(value);
      if (numValue > UPI_LIMITS.MAX_AMOUNT) {
        setError(`Maximum transaction amount is ₹${UPI_LIMITS.MAX_AMOUNT.toLocaleString()}`);
        return;
      }
    }

    setPaymentDetails(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  const validateAmount = (amount: number): boolean => {
    if (isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount');
      return false;
    }
    if (amount < UPI_LIMITS.MIN_AMOUNT) {
      setError(`Minimum transaction amount is ₹${UPI_LIMITS.MIN_AMOUNT}`);
      return false;
    }
    if (amount > UPI_LIMITS.MAX_AMOUNT) {
      setError(`Maximum transaction amount is ₹${UPI_LIMITS.MAX_AMOUNT.toLocaleString()}. Please try a smaller amount.`);
      return false;
    }
    return true;
  };

  const handleUPIPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateAmount(paymentDetails.amount)) {
      return;
    }

    if (!paymentDetails.upiId.includes('@')) {
      setError('Please enter a valid UPI ID (e.g., username@upi)');
      return;
    }

    try {
      // Remove any trailing zeros and decimal if whole number
      const formattedAmount = Number(paymentDetails.amount).toString();
      
      // Create a minimal UPI URL with just the essential parameters
      const upiUrl = `upi://pay?pa=${encodeURIComponent(paymentDetails.upiId)}&am=${formattedAmount}&cu=INR`;

      // For mobile devices, directly open the UPI app
      if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        window.location.href = upiUrl;
      } else {
        setError('Please open this payment page on your mobile device to use UPI payment.');
      }
    } catch (err) {
      setError('Failed to initiate UPI payment. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <IndianRupee className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Make Payment
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            For testing, try with small amounts (₹1 - ₹10)
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleUPIPayment} className="space-y-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
              Amount (₹)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₹</span>
              </div>
              <input
                type="number"
                name="amount"
                id="amount"
                required
                min={UPI_LIMITS.MIN_AMOUNT}
                max={UPI_LIMITS.MAX_AMOUNT}
                step="1"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border border-gray-300 rounded-md p-2"
                placeholder="Enter amount"
                value={paymentDetails.amount || ''}
                onChange={handleInputChange}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Start with small amounts for testing
            </p>
          </div>

          <div>
            <label htmlFor="upiId" className="block text-sm font-medium text-gray-700">
              UPI ID
            </label>
            <input
              type="text"
              name="upiId"
              id="upiId"
              required
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md p-2"
              placeholder="example@upi"
              value={paymentDetails.upiId}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <QrCode className="mr-2 h-5 w-5" />
              Pay with UPI
            </button>

            <button
              type="button"
              disabled
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-50 cursor-not-allowed"
            >
              <CreditCard className="mr-2 h-5 w-5" />
              Pay with Card (Coming Soon)
            </button>
          </div>
        </form>

        <div className="mt-6">
          <p className="text-center text-sm text-gray-500">
            Secure payments powered by UPI
          </p>
        </div>
      </div>
    </div>
  );
}