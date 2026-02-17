import React from 'react';
import { ShoppingBasket, X, Trash2 } from './Icons';
import { CartItem } from '../types';
import { getPackCost } from '../data'; // Імпортуємо функцію

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  exchangeRate: number;
}

export function CartDrawer({ isOpen, onClose, cart, setCart, exchangeRate }: CartDrawerProps) {
  if (!isOpen) return null;

  const removeItem = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculateStats = () => {
    return cart.reduce((acc, item) => {
      const price = item.selectedPrice || 0;
      const volume = item.selectedVolume || 0;
      const purchasePriceKg = item.product?.purchasePriceEurPerKg || 0;
      
      const costProductEur = (purchasePriceKg / 1000) * volume;
      const costProductUah = costProductEur * exchangeRate;
      
      // Використовуємо функцію замість об'єкта
      const packCost = getPackCost(volume); 
      
      const profit = price - costProductUah - packCost;

      return {
        total: acc.total + price,
        profit: acc.profit + profit
      };
    }, { total: 0, profit: 0 });
  };

  const stats = calculateStats();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBasket className="w-6 h-6 text-amber-500" />
              <h2 className="text-xl font-bold text-slate-800">Кошик</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-6 h-6 text-slate-400" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800">{item.product?.name}</h4>
                  <p className="text-xs text-slate-500">
                    {item.selectedVolume === 101 ? '100 мл (скло)' : `${item.selectedVolume} мл`} — {item.selectedPrice} грн
                  </p>
                </div>
                <button onClick={() => removeItem(item.id)} className="ml-4 p-2 text-slate-300 hover:text-red-500 transition-all">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {cart.length > 0 && (
            <div className="p-6 bg-white border-t border-slate-100 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Сума</p>
                  <p className="text-2xl font-black text-slate-800">{stats.total} грн</p>
                </div>
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100">
                  <p className="text-[10px] font-black uppercase text-emerald-600/50 mb-1">Прибуток</p>
                  <p className="text-2xl font-black text-emerald-600">{Math.round(stats.profit)} грн</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}