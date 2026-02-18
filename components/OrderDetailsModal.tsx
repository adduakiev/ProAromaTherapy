import React from 'react';
import { X, User, Phone, Truck, Package, Zap } from './Icons';
import { Order } from '../types';

interface OrderDetailsModalProps {
  order: Order | null;
  onClose: () => void;
}

export function OrderDetailsModal({ order, onClose }: OrderDetailsModalProps) {
  if (!order) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 font-sans">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-[#FDFBF9] rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Хедер */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
          <div>
            <h3 className="font-black text-slate-800 uppercase tracking-widest text-xs">Замовлення #{order.id}</h3>
            <p className="text-[10px] text-slate-400 font-bold mt-1">{order.date}</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-300 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar">
          {/* Дані клієнта */}
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase text-[#D4A373] tracking-widest">Клієнт та доставка</p>
            <div className="bg-white p-5 rounded-[2rem] border border-slate-100 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-full"><User className="w-4 h-4 text-slate-400" /></div>
                <span className="text-sm font-bold text-slate-700">{order.customer.name || 'Не вказано'}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-full"><Phone className="w-4 h-4 text-slate-400" /></div>
                <span className="text-sm font-medium text-slate-600">{order.customer.phone || 'Не вказано'}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-50 rounded-full"><Truck className="w-4 h-4 text-slate-400" /></div>
                <span className="text-sm font-medium text-slate-600">{order.customer.np || 'Відділення не вказано'}</span>
              </div>
            </div>
          </div>

          {/* Товари */}
          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase text-[#D4A373] tracking-widest tracking-widest flex items-center gap-2">
              <Package className="w-3 h-3" /> Склад замовлення
            </p>
            <div className="space-y-2">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-white rounded-2xl border border-slate-50 shadow-sm">
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800 text-xs">{item.product?.name}</h4>
                    <p className="text-[9px] font-black text-slate-400 uppercase mt-0.5">
                      {item.selectedVolume === 101 ? '100 мл (G)' : `${item.selectedVolume} мл`}
                    </p>
                  </div>
                  <span className="font-black text-slate-700 text-sm">{item.selectedPrice} <span className="text-[10px]">грн</span></span>
                </div>
              ))}
            </div>
          </div>

          {/* Фінанси */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-900 p-5 rounded-[2rem] text-white">
              <p className="text-[9px] font-black uppercase opacity-50 mb-1 tracking-widest">Чек</p>
              <p className="text-2xl font-black tracking-tighter">{order.total} <span className="text-xs">грн</span></p>
            </div>
            <div className="bg-emerald-500 p-5 rounded-[2rem] text-white">
              <div className="flex justify-between items-center mb-1">
                <p className="text-[9px] font-black uppercase opacity-70 tracking-widest">Прибуток</p>
                <Zap className="w-3 h-3 fill-white/50 text-transparent" />
              </div>
              <p className="text-2xl font-black tracking-tighter">{order.profit} <span className="text-xs">грн</span></p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 flex gap-3">
          <button 
            onClick={onClose}
            className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-slate-100 transition-all"
          >
            Закрити
          </button>
        </div>
      </div>
    </div>
  );
}
