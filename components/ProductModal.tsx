import React from 'react';
import { Product, RetailPriceOption } from '../types';
import { X, ShoppingBasket } from './Icons';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, option: RetailPriceOption) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl transform transition-transform duration-300 translate-y-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${
              product.type === 'oil' 
                ? 'bg-amber-100 text-amber-700' 
                : 'bg-teal-100 text-teal-700'
            }`}>
              {product.type === 'oil' ? 'Ефірна Олія' : 'Гідролат'}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mt-2 leading-tight">
              {product.name}
            </h2>
            {product.origin && (
              <p className="text-gray-500 text-sm mt-1">Виробництво: {product.origin}</p>
            )}
          </div>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="space-y-3 mt-6">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Оберіть об'єм:</p>
          <div className="grid gap-3">
            {product.retailPrices.map((option, index) => (
              <button
                key={index}
                onClick={() => {
                  onAddToCart(product, option);
                  onClose();
                }}
                className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl hover:border-blue-500 hover:bg-blue-50 active:bg-blue-100 transition-all group"
              >
                <span className="font-semibold text-lg text-gray-700 group-hover:text-blue-700">
                  {option.volume} мл
                </span>
                <span className="font-bold text-xl text-gray-900 group-hover:text-blue-900">
                  {option.price} ₴
                </span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-gray-400">
          Натисніть на ціну, щоб додати в кошик
        </div>
      </div>
    </div>
  );
};