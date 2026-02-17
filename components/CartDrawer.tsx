import React from 'react';
import { CartItem } from '../types';
import { X, Trash2, ShoppingBasket } from './Icons';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (cartId: string) => void;
  totalRevenue: number;
  totalProfit: number;
  exchangeRate: number;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onRemove,
  totalRevenue,
  totalProfit,
  exchangeRate
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <div className="flex items-center gap-2">
            <ShoppingBasket className="text-blue-600" />
            <h2 className="text-xl font-bold text-gray-800">Кошик</h2>
            <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
              {items.length}
            </span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <ShoppingBasket size={64} className="mx-auto mb-4 opacity-20" />
              <p>Кошик порожній</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.cartId} className="flex justify-between items-center p-3 bg-white border rounded-xl shadow-sm">
                <div>
                  <h3 className="font-semibold text-gray-800">{item.product.name}</h3>
                  <p className="text-sm text-gray-500">
                    {item.selectedVolume} мл 
                    <span className="mx-2 text-gray-300">|</span> 
                    {item.product.type === 'oil' ? 'Олія' : 'Гідролат'}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-lg">{item.selectedPrice} ₴</span>
                  <button 
                    onClick={() => onRemove(item.cartId)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Сума для клієнта:</span>
            <span className="text-2xl font-bold text-gray-900">{totalRevenue.toFixed(0)} ₴</span>
          </div>
          
          <div className="pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Ваш заробіток:</span>
              <span className="text-xl font-bold text-green-600">+{totalProfit.toFixed(0)} ₴</span>
            </div>
            <p className="text-xs text-right text-gray-400 mt-1">
              (Курс: {exchangeRate} ₴/€)
            </p>
          </div>

          <button 
            className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg active:scale-[0.98] transition-transform"
            onClick={() => alert("Замовлення сформовано!")}
          >
            Оформити замовлення
          </button>
        </div>
      </div>
    </div>
  );
};