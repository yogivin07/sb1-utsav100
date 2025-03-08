import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { IndianRupee, QrCode, Copy, CheckCircle2, User, Mail, Phone } from 'lucide-react';

interface UPIPaymentProps {
  upiId: string;
  merchantName: string;
}

interface UserDetails {
  name: string;
  email: string;
  phone: string;
  amount: number;
}

export function UPIPayment({ upiId, merchantName }: UPIPaymentProps) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    name: '',
    email: '',
    phone: '',
    amount: 0
  });

  // Generate UPI URL
  const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${userDetails.amount}&cu=INR`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(upiUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowQR(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!showQR) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 space-y-6">
        <div className="flex items-center space-x-2">
          <IndianRupee className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-800">Payment Details</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <User className="w-4 h-4" />
              <span>Full Name</span>
            </label>
            <input
              type="text"
              name="name"
              required
              value={userDetails.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </label>
            <input
              type="email"
              name="email"
              required
              value={userDetails.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your email"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <Phone className="w-4 h-4" />
              <span>Phone Number</span>
            </label>
            <input
              type="tel"
              name="phone"
              required
              value={userDetails.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your phone number"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <IndianRupee className="w-4 h-4" />
              <span>Amount (₹)</span>
            </label>
            <input
              type="number"
              name="amount"
              required
              min="1"
              step="0.01"
              value={userDetails.amount || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter amount"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            Generate Payment QR
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <IndianRupee className="w-6 h-6 text-green-600" />
        <h2 className="text-xl font-semibold text-gray-800">UPI Payment</h2>
      </div>

      <div className="space-y-4">
        <div className="text-center space-y-2">
          <p className="text-gray-600">Scan QR code to pay</p>
          <p className="text-2xl font-bold text-gray-800">₹{Number(userDetails.amount).toFixed(2)}</p>
          <p className="text-sm text-gray-600">Payment for: {userDetails.name}</p>
        </div>

        <div className="flex justify-center">
          <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
            <QRCodeSVG value={upiUrl} size={200} />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-600 text-center">Or use UPI ID</p>
          <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center space-x-2">
              <QrCode className="w-5 h-5 text-gray-500" />
              <span className="text-gray-700 font-medium">{upiId}</span>
            </div>
            <button
              onClick={handleCopy}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              title="Copy UPI ID"
            >
              {copied ? (
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              ) : (
                <Copy className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        <div className="text-center text-sm text-gray-500">
          <p>Paying to: {merchantName}</p>
        </div>

        <button
          onClick={() => setShowQR(false)}
          className="w-full mt-4 bg-gray-100 text-gray-600 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
        >
          Back to Form
        </button>
      </div>
    </div>
  );
}
