import React, { useState } from 'react';
import { product } from '../types/product';
import { ImageModal } from './ImageModal';


interface ProductCardProps {
  product: product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) =>  {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
      <img 
         src={product.imageUrl} 
         alt={product.name}
         className="w-full h-48 object-cover cursor-pointer"
         onClick={() => setShowModal(true)}
      />
         <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{product.description}</p>
        <div className="mt-4 flex justify-between items-center">
        </div>
      </div>
    </div>

      {showModal && (
     <ImageModal
    imageUrl={product.imageUrl}
    altText={product.name}
    onClose={() => setShowModal(false)}
    />
    )}
  </>
  );
};


