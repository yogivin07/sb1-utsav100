import React, { useState, useEffect } from 'react';
import { IndianRupee, CreditCard, QrCode, Smartphone } from 'lucide-react';


interface PaymentDetails {
  amount: number;
  upiId: string;
}

const UPI_LIMITS = {
  MIN_AMOUNT: 1,
  MAX_AMOUNT: 5000,
};

const DEMO_UPI_ID = 'yogendra.pawar@okicici'; // Replace with your actual UPI ID

export default function PaymentPage() {
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    amount: 0,
    upiId: DEMO_UPI_ID,
  });
  const [error, setError] = useState<string>('');
  const [qrCode, setQrCode] = useState<string>('');
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (showQR && paymentDetails.amount > 0) {
      generateQRCode();
    }
  }, [showQR, paymentDetails.amount]);

  const generateQRCode = async () => {
    try {
      const upiUrl = `upi://pay?pa=${encodeURIComponent(paymentDetails.upiId)}&pn=DemoStore&am=${paymentDetails.amount}&cu=INR`;
      const qrCodeDataUrl = await QRCode.toDataURL(upiUrl, {
        width: 256,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#ffffff',
        },
      });
      setQrCode(qrCodeDataUrl);
    } catch (err) {
      setError('Failed to generate QR code. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setError('');
    setShowQR(false);

    if (name === 'amount') {
      const numValue = parseFloat(value);
      if (numValue > UPI_LIMITS.MAX_AMOUNT) {
        setError(`Maximum transaction amount is ₹${UPI_LIMITS.MAX_AMOUNT.toLocaleString()}`);
        return;
      }
      setPaymentDetails(prev => ({ ...prev, amount: numValue || 0 }));
    }
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

  const handleShowQR = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateAmount(paymentDetails.amount)) {
      return;
    }

    setShowQR(true);
  };

  const handleDirectUPIPayment = () => {
    if (!validateAmount(paymentDetails.amount)) {
      return;
    }

    const upiUrl = `upi://pay?pa=${encodeURIComponent(paymentDetails.upiId)}&pn=DemoStore&am=${paymentDetails.amount}&cu=INR`;
    window.location.href = upiUrl;
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
            Choose your preferred payment method
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleShowQR} className="space-y-6">
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
              Amount range: ₹{UPI_LIMITS.MIN_AMOUNT} - ₹{UPI_LIMITS.MAX_AMOUNT}
            </p>
          </div>

          {showQR && qrCode && (
            <div className="text-center space-y-4">
              <div className="bg-white p-4 rounded-lg inline-block shadow-md">
                <img src={qrCode} alt="Payment QR Code" className="mx-auto" />
              </div>
              <p className="text-sm text-gray-600">
                Scan this QR code with any UPI app to pay
              </p>
            </div>
          )}

          <div className="space-y-4">
            <button
              type="submit"
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <QrCode className="mr-2 h-5 w-5" />
              Show QR Code
            </button>

            <button
              type="button"
              onClick={handleDirectUPIPayment}
              className="w-full flex justify-center items-center py-3 px-4 border border-indigo-600 rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <Smartphone className="mr-2 h-5 w-5" />
              Open UPI App
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