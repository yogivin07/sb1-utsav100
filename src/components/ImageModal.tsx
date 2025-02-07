import React from 'react';
import { X } from 'lucide-react';

interface ImageModalProps {
  imageUrl: string;
  altText: string;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, altText, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="relative max-w-4xl w-full">
        <button 
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-white rounded-full p-1 hover:bg-gray-100"
        >
          <X className="w-6 h-6" />
        </button>
        <img 
          src={imageUrl} 
          alt={altText}
          className="w-full h-auto rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  );
}