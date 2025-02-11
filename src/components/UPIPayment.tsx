import React, { useState } from 'react';
import { IndianRupee, CreditCard, QrCode } from 'lucide-react';

interface PaymentDetails {
  amount: number;
  description: string;
  upiId: string;
}

// UPI transaction limits as per NPCI guidelines
const UPI_LIMITS = {
  MIN_AMOUNT: 1,
  MAX_AMOUNT: 100000, // ₹1,00,000 per transaction
  MAX_DAILY: 200000,  // ₹2,00,000 per day
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
    setError(''); // Clear any previous errors

    if (name === 'amount') {
      // Ensure amount is a valid number and within limits
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
      setError(`Maximum transaction amount is ₹${UPI_LIMITS.MAX_AMOUNT.toLocaleString()}`);
      return false;
    }
    return true;
  };

  const handleUPIPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validate amount
    if (!validateAmount(paymentDetails.amount)) {
      return;
    }

    // Validate UPI ID format
    if (!paymentDetails.upiId.includes('@')) {
      setError('Please enter a valid UPI ID (e.g., username@upi)');
      return;
    }

    try {
      // Format amount to exactly 2 decimal places
      const formattedAmount = paymentDetails.amount.toFixed(2);
      
      // Construct UPI URL with proper encoding and formatted amount
      const upiParams = new URLSearchParams({
        pa: paymentDetails.upiId,
        pn: 'Merchant',
        tn: paymentDetails.description,
        am: formattedAmount,
        cu: 'INR'
      });
      
      const upiUrl = `upi://pay?${upiParams.toString()}`;

      // For mobile devices, try to open the UPI app directly
      if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
        window.location.href = upiUrl;
      } else {
        // For desktop, show a message that this needs to be opened on a mobile device
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
                step="0.01"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-7 pr-12 sm:text-sm border border-gray-300 rounded-md p-2"
                placeholder="0.00"
                value={paymentDetails.amount || ''}
                onChange={handleInputChange}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Limit: ₹{UPI_LIMITS.MIN_AMOUNT} - ₹{UPI_LIMITS.MAX_AMOUNT.toLocaleString()} per transaction
            </p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <input
              type="text"
              name="description"
              id="description"
              required
              className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md p-2"
              placeholder="Payment for..."
              value={paymentDetails.description}
              onChange={handleInputChange}
            />
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
              pattern="[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z][a-zA-Z]{2,64}"
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