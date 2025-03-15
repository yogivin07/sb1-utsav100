


import React, { useState } from 'react';
import axios from 'axios';
import { Send, MessageSquare, FileText, ShoppingCart } from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface OrderItem {
  description: string;
  quantity: number;
  price: number;
  total: number;
}

interface OrderDetails {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItem[];
}

function App() {
  const [orderDetails, setOrderDetails] = useState<OrderDetails>({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    items: [
      { description: '', quantity: 1, price: 0, total: 0 }
    ]
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const updateItem = (index: number, field: keyof OrderItem, value: string | number) => {
    const newItems = [...orderDetails.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
      total: field === 'quantity' || field === 'price' 
        ? Number(newItems[index].quantity) * Number(newItems[index].price)
        : newItems[index].total
    };
    setOrderDetails({ ...orderDetails, items: newItems });
  };

  const addItem = () => {
    setOrderDetails({
      ...orderDetails,
      items: [...orderDetails.items, { description: '', quantity: 1, price: 0, total: 0 }]
    });
  };

  const removeItem = (index: number) => {
    if (orderDetails.items.length > 1) {
      const newItems = orderDetails.items.filter((_, i) => i !== index);
      setOrderDetails({ ...orderDetails, items: newItems });
    }
  };

  const generatePDFReceipt = () => {
    // Create new PDF document
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set initial coordinates
    const pageWidth = doc.internal.pageSize.width;
    const margin = 20;
    let yPos = margin;

    // Add company logo and header
    doc.setFillColor(41, 128, 185); // Professional blue color
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('INVOICE', pageWidth / 2, 25, { align: 'center' });

    // Add company information
    yPos = 50;
    doc.setTextColor(51, 51, 51);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Your Company Name', margin, yPos);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    yPos += 7;
    doc.text('123 Business Street', margin, yPos);
    yPos += 5;
    doc.text('City, State 12345', margin, yPos);
    yPos += 5;
    doc.text('Phone: (555) 123-4567', margin, yPos);
    yPos += 5;
    doc.text('Email: contact@yourcompany.com', margin, yPos);

    // Add invoice details
    const invoiceNumber = 'INV-' + Date.now().toString().slice(-6);
    const date = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    doc.setFont('helvetica', 'bold');
    doc.text(`Invoice: ${invoiceNumber}`, pageWidth - margin - 60, 50);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${date}`, pageWidth - margin - 60, 57);

    // Add billing information
    yPos += 20;
    doc.setDrawColor(41, 128, 185);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);

    yPos += 10;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Bill To:', margin, yPos);
    
    yPos += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(orderDetails.customerName, margin, yPos);
    yPos += 5;
    doc.text(orderDetails.email, margin, yPos);
    yPos += 5;
    doc.text(orderDetails.phone, margin, yPos);
    yPos += 5;
    
    // Handle multi-line address
    const addressLines = doc.splitTextToSize(orderDetails.address, 80);
    addressLines.forEach((line: string) => {
      doc.text(line, margin, yPos);
      yPos += 5;
    });

    // Add items table
    yPos += 10;
    const tableHeaders = [['Item Description', 'Quantity', 'Unit Price', 'Total']];
    const tableData = orderDetails.items.map(item => [
      item.description,
      item.quantity.toString(),
      `$${item.price.toFixed(2)}`,
      `$${item.total.toFixed(2)}`
    ]);

    // Calculate totals
    const subtotal = orderDetails.items.reduce((sum, item) => sum + item.total, 0);
    const taxRate = 0.10; // 10% tax
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    (doc as any).autoTable({
      startY: yPos,
      head: tableHeaders,
      body: tableData,
      theme: 'striped',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9
      },
      columnStyles: {
        0: { cellWidth: 'auto' },
        1: { cellWidth: 25, halign: 'center' },
        2: { cellWidth: 35, halign: 'right' },
        3: { cellWidth: 35, halign: 'right' }
      },
      margin: { left: margin, right: margin },
      styles: {
        cellPadding: 5,
        fontSize: 10,
        valign: 'middle'
      }
    });

    // Add totals section
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    const totalsX = pageWidth - margin - 80;
    
    // Add summary box
    doc.setDrawColor(41, 128, 185);
    doc.setFillColor(249, 249, 249);
    doc.rect(totalsX - 10, finalY - 5, 90, 40, 'F');
    
    doc.setFontSize(10);
    doc.setTextColor(51, 51, 51);
    
    // Subtotal
    doc.text('Subtotal:', totalsX, finalY);
    doc.text(`$${subtotal.toFixed(2)}`, pageWidth - margin, finalY, { align: 'right' });
    
    // Tax
    doc.text(`Tax (${(taxRate * 100)}%):`, totalsX, finalY + 8);
    doc.text(`$${tax.toFixed(2)}`, pageWidth - margin, finalY + 8, { align: 'right' });
    
    // Total
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Total:', totalsX, finalY + 20);
    doc.text(`$${total.toFixed(2)}`, pageWidth - margin, finalY + 20, { align: 'right' });

    // Add footer
    const footerY = doc.internal.pageSize.height - 20;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(128, 128, 128);
    
    // Add payment terms
    doc.text('Payment Terms: Net 30', margin, footerY - 15);
    doc.text('Please include invoice number with your payment', margin, footerY - 10);
    
    // Add thank you message
    doc.setTextColor(41, 128, 185);
    doc.setFont('helvetica', 'bold');
    doc.text('Thank you for your business!', pageWidth / 2, footerY, { align: 'center' });

    return { doc, total };
  };

  const saveOrderToDatabase = async (total: number) => {
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: orderDetails.customerName,
        email: orderDetails.email,
        phone: orderDetails.phone,
        address: orderDetails.address,
        total_amount: total
      })
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems = orderDetails.items.map(item => ({
      order_id: orderData.id,
      description: item.description,
      quantity: item.quantity,
      price: item.price,
      total: item.total
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return orderData;
  };

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-numeric characters
    const cleaned = phone.replace(/\D/g, '');
    
    // Add the country code if not present
    if (!cleaned.startsWith('1')) {
      return `+1${cleaned}`;
    }
    return `+${cleaned}`;
  };

  const sendSMSReceipt = async () => {
    setLoading(true);
    setStatus('idle');
    setErrorMessage('');
    
    try {
      const { doc, total } = generatePDFReceipt();
      
      // Save order to database
      await saveOrderToDatabase(total);
      
      // In a real application, you would:
      // 1. Upload the PDF to a cloud storage (e.g., AWS S3)
      // 2. Get a public URL for the PDF
      const pdfUrl = 'https://your-cloud-storage.com/receipts/latest.pdf'; // Replace with actual URL
      
      // Replace these with your actual Twilio credentials
      const TWILIO_ACCOUNT_SID = 'ACe5b30c89920ee2501a72da682895236b';
      const TWILIO_AUTH_TOKEN = '657648698cad6907527aeeb88e3e49c6';
      const TWILIO_PHONE_NUMBER = '+19305291906'; // Verified Twilio phone number
      
      // Format the recipient's phone number
      const formattedPhone = formatPhoneNumber(orderDetails.phone);
      
      // Validate phone number format before sending
      if (!formattedPhone.match(/^\+1\d{10}$/)) {
        throw new Error('Invalid phone number format. Please use format: +1XXXXXXXXXX');
      }
      
      const response = await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
        new URLSearchParams({
          To: formattedPhone,
          From: TWILIO_PHONE_NUMBER,
          Body: `Thank you for your purchase! Your total amount is $${total.toFixed(2)}. View your receipt here: ${pdfUrl}`
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`)
          },
        }
      );

      if (response.status === 201) {
        setStatus('success');
      }
    } catch (error) {
      setStatus('error');
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.message || 'Failed to send SMS message');
      } else if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  const previewReceipt = () => {
    const { doc } = generatePDFReceipt();
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
          </div>

          <div className="space-y-6">
            {/* Customer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={orderDetails.customerName}
                  onChange={(e) => setOrderDetails({ ...orderDetails, customerName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={orderDetails.email}
                  onChange={(e) => setOrderDetails({ ...orderDetails, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number (US format: +1XXXXXXXXXX)
                </label>
                <input
                  type="tel"
                  value={orderDetails.phone}
                  onChange={(e) => setOrderDetails({ ...orderDetails, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="+1234567890"
                  pattern="^\+?1?\d{10,12}$"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Enter US phone number with country code (e.g., +12345678900)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={orderDetails.address}
                  onChange={(e) => setOrderDetails({ ...orderDetails, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="123 Main St, City, Country"
                />
              </div>
            </div>

            {/* Order Items */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Order Items</h2>
                <button
                  onClick={addItem}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  Add Item
                </button>
              </div>
              
              <div className="space-y-4">
                {orderDetails.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Product description"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="1"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price
                      </label>
                      <input
                        type="number"
                        value={item.price}
                        onChange={(e) => updateItem(index, 'price', parseFloat(e.target.value) || 0)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Total
                        </label>
                        <input
                          type="text"
                          value={`$${item.total.toFixed(2)}`}
                          className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-md"
                          readOnly
                        />
                      </div>
                      {orderDetails.items.length > 1 && (
                        <button
                          onClick={() => removeItem(index)}
                          className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          ×
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <button
                onClick={previewReceipt}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                Preview Receipt
              </button>

              <button
                onClick={sendSMSReceipt}
                disabled={loading || !orderDetails.phone}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Receipt
                  </>
                )}
              </button>
            </div>

            {status === 'success' && (
              <p className="text-green-600 text-sm text-center">
                Receipt sent successfully!
              </p>
            )}
            
            {status === 'error' && (
              <p className="text-red-600 text-sm text-center">
                {errorMessage}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

