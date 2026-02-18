import React, { useState } from 'react';
import { ShoppingBasket, X, Trash2, Zap, ChevronRight } from './Icons';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  exchangeRate: number;
  costs: any;
}

export function CartDrawer({ isOpen, onClose, cart, setCart, exchangeRate, costs }: CartDrawerProps) {
  const [showProfitTable, setShowProfitTable] = useState(false);
  
  if (!isOpen) return null;

  const removeItem = (id: string) => setCart(cart.filter(item => item.id !== id));

  const calculateDetails = () => {
    let totalProductCost = 0;
    let totalTaraCost = 0;
    let totalLabels = 0;
    
    cart.forEach(item => {
      const volume = Number(item.selectedVolume) || 0;
      const type = item.product?.type;
      
      // Рідина
      const purchasePriceKg = Number(item.product?.purchasePriceEurPerKg) || 0;
      totalProductCost += (purchasePriceKg / 1000) * volume * exchangeRate;
      
      // Тара
      if (type === 'oil') {
        if (volume <= 3) totalTaraCost += costs.oil3;
        else if (volume <= 5) totalTaraCost += costs.oil5;
        else totalTaraCost += costs.oil15;
      } else {
        if (volume === 101) totalTaraCost += costs.hydro100g;
        else if (volume <= 100) totalTaraCost += costs.hydro100p;
        else if (volume <= 200) totalTaraCost += costs.hydro200;
        else totalTaraCost += costs.hydro500;
      }

      // Етикетка
      totalLabels += costs.label;
    });

    const shippingTotal = cart.length > 0 ? (costs.packingPaper + costs.shippingBox + costs.boxLabel) : 0;
    const revenue = cart.reduce((sum, item) => sum + (Number(item.selectedPrice) || 0), 0);
    const expenses = totalProductCost + totalTaraCost + totalLabels + shippingTotal;

    return { totalProductCost, totalTaraCost, totalLabels, shippingTotal, revenue, expenses, netProfit: revenue - expenses };
  };

  const stats = calculateDetails();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
          
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#D4A373] rounded-xl shadow-lg shadow-orange-100"><ShoppingBasket className="w-6 h-6 text-white" /></div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Ваш кошик</h2>
            </div>
            <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-600 transition-colors"><X className="w-6 h-6" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar bg-white">
            {cart.length === 0 ? (
              <div className="text-center py-20 text-slate-300 font-medium">Кошик порожній</div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-4 bg-[#FDFBF9] rounded-2xl border border-slate-100">
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 text-sm leading-tight">{item.product?.name}</h4>
                    <p className="text-[10px] font-black text-slate-400 uppercase mt-1">
                      {item.selectedVolume === 101 ? '100 мл (G)' : `${item.selectedVolume} мл`} — {item.selectedPrice} грн
                    </p>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="p-2 text-slate-300 hover:text-red-400 transition-colors"><Trash2 className="w-5 h-5" /></button>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 bg-[#F8F3EF] border-t border-slate-200 space-y-4 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-3xl border border-white shadow-sm">
                  <p className="text-[9px] font-black uppercase text-slate-400 mb-1 tracking-widest">Дохід</p>
                  <p className="text-xl font-black text-slate-800">{stats.revenue} грн</p>
                </div>
                <button 
                  onClick={() => setShowProfitTable(true)}
                  className="bg-emerald-500 p-4 rounded-3xl text-left hover:bg-emerald-600 transition-all group shadow-lg shadow-emerald-100"
                >
                  <div className="flex justify-between items-start">
                    <p className="text-[9px] font-black uppercase text-white/70 mb-1 tracking-widest">Прибуток</p>
                    <ChevronRight className="w-3 h-3 text-white/50 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-xl font-black text-white">{Math.round(stats.netProfit)} грн</p>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {showProfitTable && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl" onClick={() => setShowProfitTable(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">Аналітика замовлення</h3>
              <button onClick={() => setShowProfitTable(false)} className="p-2 text-slate-300 hover:text-slate-600 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase text-[#D4A373] tracking-widest text-center">Прямі витрати (товари)</p>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                    <span className="text-xs font-bold text-slate-600">Собівартість рідини</span>
                    <span className="font-black text-slate-800">{stats.totalProductCost.toFixed(1)} грн</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                    <span className="text-xs font-bold text-slate-600">Собівартість тари (баночки)</span>
                    <span className="font-black text-slate-800">{stats.totalTaraCost} грн</span>
                  </div>
                  <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                    <span className="text-xs font-bold text-slate-600">Етикетки ({cart.length} шт)</span>
                    <span className="font-black text-slate-800">{stats.totalLabels} грн</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase text-[#D4A373] tracking-widest text-center">Витрати на пакування</p>
                <div className="bg-orange-50/30 p-4 rounded-2xl space-y-3 border border-orange-50">
                  <div className="flex justify-between text-xs font-bold text-orange-900/60">
                    <span>Коробочка + Папір + Етикетка</span>
                    <span>{stats.shippingTotal} грн</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-6 text-center">
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Разом витрат</p>
                  <p className="text-2xl font-black text-red-400">{stats.expenses.toFixed(1)} <span className="text-xs font-bold">грн</span></p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-emerald-600 mb-1">Чистий прибуток</p>
                  <p className="text-2xl font-black text-emerald-600 tracking-tighter">{Math.round(stats.netProfit)} <span className="text-xs font-bold">грн</span></p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-slate-900 text-center">
              <p className="text-[9px] text-white/40 font-black uppercase tracking-[0.2em]">Математика бізнесу • Курс {exchangeRate} грн/€</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
