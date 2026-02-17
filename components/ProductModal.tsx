import React from 'react';
import { Product, RetailPriceOption } from '../types';
// Ми імпортуємо getPackCost, але у цьому файлі він навіть не потрібен, 
// бо розрахунок йде в кошику. Залишаємо для стабільності.
import { getPackCost } from '../data'; 
import { X } from './Icons';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, option: RetailPriceOption) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div 
        className="bg-white w-full max-w-md rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl transform transition-transform duration-300 translate-y-0"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className={`text-xs font-bold uppercase px-2 py-1 rounded-full ${
              product.type === 'oil' 
                ? 'bg-amber-100 text-amber-700' 
                : 'bg-teal-100 text-teal-700'
            }`}>
              {product.type === 'oil' ? 'Ефірна Олія' : 'Гідролат'}
            </span>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h2>
            {product.latinName && (
              <p className="text-gray-500 italic mt-1 font-serif">{product.latinName}</p>
            )}
             {product.rawMaterial && (
              <p className="text-xs text-gray-400 mt-2 uppercase tracking-wide">
                Сировина: <span className="text-gray-600">{product.rawMaterial}</span>
              </p>
            )}
        </div>

        <div className="space-y-3 mt-4">
          <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">Оберіть варіант:</p>
          <div className="grid gap-3">
            {product.retailPrices.length > 0 ? (
              product.retailPrices.map((option, index) => (
                <button
                  key={index}
                  onClick={() => {
                    onAddToCart(product, option);
                    onClose();
                  }}
                  className="flex items-center justify-between p-4 border-2 border-gray-100 rounded-xl hover:border-amber-500 hover:bg-amber-50 active:bg-amber-100 transition-all group"
                >
                  <div className="flex flex-col items-start">
                    <span className="font-semibold text-lg text-gray-700 group-hover:text-amber-700">
                      {/* ЗАМІНА ТЕКСТУ ДЛЯ СКЛА */}
                      {option.volume === 101 ? '100 мл (скло)' : `${option.volume} мл`}
                    </span>
                    {option.volume === 101 && (
                      <span className="text-[10px] text-amber-600 font-bold uppercase">Преміум упаковка</span>
                    )}
                  </div>
                  <span className="font-bold text-xl text-gray-900 group-hover:text-amber-900">
                    {option.price} ₴
                  </span>
                </button>
              ))
            ) : (
               <div className="p-4 bg-gray-50 text-gray-500 rounded-xl text-center">
                 Немає доступних роздрібних цін
               </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 text-center text-xs text-gray-400">
          Натисніть на ціну, щоб додати в кошик
        </div>
      </div>
    </div>
  );
};