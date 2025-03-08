import React, { useState } from 'react';
import { ProductGrid } from './ProductGrid';

import { products } from './data/products';

export const ProductCatalog: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredProducts = products.filter(products =>
    products.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    products.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">"गणपती फोटो संग्रह"</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search photo.."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>  
      </div>
      <ProductGrid products={filteredProducts} />
    </div>
  );
};