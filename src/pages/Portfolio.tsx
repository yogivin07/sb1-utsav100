import React from 'react';

import { ProductCatalog } from '../components/ProductCatalog' ;



export default function Portfolio() {
  return (
    
    
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-lg bg-white p-8 shadow-sm">
        <h1 className="mb-4 text-3xl font-bold text-gray-900">"गणपती फोटो संग्रह"</h1>
        <p className="text-gray-600">
          Explore our collection of successful achievements.
        
        </p>
        </div>
        
      <div className="min-h-screen bg-gray-100">
        
      <ProductCatalog />
        
        </div>

      </div>
            



  );
  }