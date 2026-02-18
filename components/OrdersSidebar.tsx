import React from 'react';
import { X, Trash2, CheckCircle, Clock } from './Icons';
import { Order } from '../types';

interface OrdersSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onSelect: (order: Order) => void;
}

export function OrdersSidebar({ isOpen, onClose, orders, onDelete, onToggleStatus, onSelect }: OrdersSidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-xs bg-[#FDFBF9] shadow-2xl flex flex-col border-r border-slate-200">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
            <h2 className="font-black text-slate-800 uppercase tracking-widest text-sm">Історія замовлень</h2>
            <button onClick={onClose} className="p-2 text-slate-400"><X className="w-5 h-5" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
            {orders.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs italic">Замовлень ще немає</div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-[#D4A373] transition-all cursor-pointer" onClick={() => onSelect(order)}>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] font-black text-slate-300 uppercase">{order.date}</span>
                    <button onClick={(e) => { e.stopPropagation(); onDelete(order.id); }} className="text-slate-200 hover:text-red-400"><Trash2 className="w-3 h-3" /></button>
                  </div>
                  <h4 className="font-bold text-slate-800 text-xs truncate">{order.customer.name || 'Клієнт'}</h4>
                  <p className="text-[10px] text-slate-500 mb-2">{order.total} грн</p>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onToggleStatus(order.id); }}
                    className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter transition-all ${
                      order.status === 'shipped' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {order.status === 'shipped' ? <CheckCircle className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                    {order.status === 'shipped' ? 'Відправлено' : 'Чорновик'}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
