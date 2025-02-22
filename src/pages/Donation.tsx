import React from 'react';
import { UPIPayment } from '../components/UPIPayment';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <UPIPayment 
        upiId=""
        merchantName="TEST"
      />
    </div>
  );
}

export default App;