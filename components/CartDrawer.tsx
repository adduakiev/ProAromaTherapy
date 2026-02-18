import React, { useState } from 'react';
import { ShoppingBasket, X, Trash2, Zap, ChevronRight } from './Icons';
import { CartItem } from '../types';
import { getPackCost } from '../data';

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

  const removeItem = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const calculateDetails = () => {
    let totalProductCost = 0;
    let totalTaraCost = 0;
    let totalLabels = 0;
    
    const items = cart.map(item => {
      const volume = Number(item.selectedVolume) || 0;
      const price = Number(item.selectedPrice) || 0;
      const purchasePriceKg = Number(item.product?.purchasePriceEurPerKg) || 0;
      
      const productCostUah = (purchasePriceKg / 1000) * volume * exchangeRate;
      const taraCost = volume === 101 ? costs.glassPack : costs.plasticPack;
      const labelCost = costs.label;
      
      totalProductCost += productCostUah;
      totalTaraCost += taraCost;
      totalLabels += labelCost;
      
      return {
        name: item.product?.name,
        volume,
        price,
        cost: productCostUah + taraCost + labelCost,
        profit: price - (productCostUah + taraCost + labelCost)
      };
    });

    const shippingCosts = cart.length > 0 ? (costs.packingPaper + costs.shippingBox + costs.boxLabel) : 0;
    const totalRevenue = cart.reduce((sum, item) => sum + (Number(item.selectedPrice) || 0), 0);
    const totalExpenses = totalProductCost + totalTaraCost + totalLabels + shippingCosts;
    const netProfit = totalRevenue - totalExpenses;

    return { items, totalRevenue, totalExpenses, netProfit, totalProductCost, totalTaraCost, totalLabels, shippingCosts };
  };

  const stats = calculateDetails();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 max-w-full flex">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
          
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#D4A373] rounded-xl shadow-lg"><ShoppingBasket className="w-6 h-6 text-white" /></div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Кошик</h2>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
            {cart.length === 0 ? (
              <div className="text-center py-20 text-slate-300 font-medium">Кошик порожній</div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 text-sm">{item.product?.name}</h4>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.selectedVolume === 101 ? '100 мл (скло)' : `${item.selectedVolume} мл`} — {item.selectedPrice} грн</p>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="p-2 text-slate-200 hover:text-red-400 transition-colors"><Trash2 className="w-5 h-5" /></button>
                </div>
              ))
            )}
          </div>

          {cart.length > 0 && (
            <div className="p-6 bg-slate-50 border-t border-slate-200 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-black uppercase text-slate-400 mb-1">Дохід</p>
                  <p className="text-xl font-black text-slate-800">{stats.totalRevenue} грн</p>
                </div>
                <button 
                  onClick={() => setShowProfitTable(true)}
                  className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 text-left hover:bg-emerald-100 transition-all group"
                >
                  <div className="flex justify-between items-start">
                    <p className="text-[9px] font-black uppercase text-emerald-600/60 mb-1">Прибуток</p>
                    <ChevronRight className="w-3 h-3 text-emerald-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-xl font-black text-emerald-600">{Math.round(stats.netProfit)} грн</p>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Таблиця розрахунку прибутку */}
      {showProfitTable && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl" onClick={() => setShowProfitTable(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm">Деталізація витрат</h3>
              <button onClick={() => setShowProfitTable(false)} className="p-2 text-slate-300 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Витрати на позиції</p>
                <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>Собівартість продукту (рідина)</span>
                    <span>{stats.totalProductCost.toFixed(1)} грн</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>Тара та помпа</span>
                    <span>{stats.totalTaraCost} грн</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-slate-600">
                    <span>Етикетки на флакони</span>
                    <span>{stats.totalLabels} грн</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Витрати на пакування замовлення</p>
                <div className="bg-orange-50/50 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between text-xs font-bold text-orange-800/70">
                    <span>Папір ежик</span>
                    <span>{costs.packingPaper} грн</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-orange-800/70">
                    <span>Коробочка крафт</span>
                    <span>{costs.shippingBox} грн</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-orange-800/70">
                    <span>Етикетка на коробку</span>
                    <span>{costs.boxLabel} грн</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Всі витрати</p>
                  <p className="text-xl font-black text-red-500">{stats.totalExpenses.toFixed(1)} грн</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-emerald-600/50 mb-1">Чистий прибуток</p>
                  <p className="text-xl font-black text-emerald-600">{Math.round(stats.netProfit)} грн</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-slate-50 text-center">
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter italic">* розраховано за курсом {exchangeRate} грн/€</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
