cat << 'EOF' > components/CartDrawer.tsx
import React from 'react';
import { ShoppingBasket, X, Trash2, Zap } from './Icons';
import { CartItem } from '../types';
import { getPackCost } from '../data';

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
      const price = Number(item.selectedPrice) || 0;
      const volume = Number(item.selectedVolume) || 0;
      const purchasePriceKg = Number(item.product?.purchasePriceEurPerKg) || 0;
      
      const costProductEur = (purchasePriceKg / 1000) * volume;
      const costProductUah = costProductEur * exchangeRate;
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
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300" 
        onClick={onClose} 
      />
      
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#D4A373] rounded-xl shadow-lg shadow-orange-100">
                <ShoppingBasket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-800 tracking-tight">Кошик</h2>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Обрані товари</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 hover:bg-white hover:shadow-md rounded-full transition-all text-slate-400 hover:text-slate-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-30">
                <ShoppingBasket className="w-16 h-16 text-slate-200" />
                <p className="text-slate-400 font-medium">Кошик порожній</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="group flex justify-between items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-slate-800 leading-tight">{item.product?.name}</h4>
                      {item.selectedVolume === 101 && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded font-black uppercase tracking-tighter border border-blue-100">
                          Скло
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-medium text-slate-500">
                      {item.selectedVolume === 101 ? '100 мл' : `${item.selectedVolume} мл`} 
                      <span className="mx-2 text-slate-200">•</span>
                      <span className="text-slate-900 font-bold">{item.selectedPrice} грн</span>
                    </p>
                  </div>
                  <button 
                    onClick={() => removeItem(item.id)} 
                    className="ml-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-8 bg-slate-50 border-t border-slate-200 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Сума</p>
                  <p className="text-3xl font-black text-slate-900 tracking-tighter">
                    {stats.total}<span className="text-sm ml-1 text-slate-400">грн</span>
                  </p>
                </div>
                <div className="space-y-1 text-right">
                  <p className="text-[10px] font-black uppercase text-emerald-600/60 tracking-widest">Прибуток</p>
                  <div className="flex items-center justify-end gap-1.5">
                    <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                    <p className="text-3xl font-black text-emerald-600 tracking-tighter">
                      {Math.round(stats.profit)}<span className="text-sm ml-1 opacity-60">грн</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
EOF