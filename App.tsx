import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Logo } from './components/Logo';
import { PRODUCTS, FX_EUR_TO_UAH, DEFAULT_COSTS } from './data';
import { Product, CartItem, Order } from './types';
import { Search, ShoppingBasket, Settings, X, ChevronRight } from './components/Icons';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { OrdersSidebar } from './components/OrdersSidebar';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  
  // Завантаження замовлень з пам'яті
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('aroma_orders');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('aroma_orders', JSON.stringify(orders));
  }, [orders]);

  const [exchangeRate, setExchangeRate] = useState(FX_EUR_TO_UAH);
  const [costs, setCosts] = useState(DEFAULT_COSTS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Скрол логіка...
  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 20) setIsVisible(true);
      else if (currentScrollY > lastScrollY && currentScrollY > 80) setIsVisible(false);
      else if (currentScrollY < lastScrollY) setIsVisible(true);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  const groupedProducts = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    const filtered = PRODUCTS.filter(p => p.keywords.toLowerCase().includes(lower) || p.name.toLowerCase().includes(lower));
    return filtered.reduce((acc, p) => {
      const label = p.type === 'oil' ? 'Ефірні олії' : 'Гідролати';
      if (!acc[label]) acc[label] = [];
      acc[label].push(p);
      return acc;
    }, {} as any);
  }, [searchTerm]);

  const saveOrder = (orderData: Order) => {
    setOrders([orderData, ...orders]);
    setCart([]); // Очищуємо кошик після збереження
  };

  const deleteOrder = (id: string) => setOrders(orders.filter(o => o.id !== id));
  const toggleOrderStatus = (id: string) => setOrders(orders.map(o => o.id === id ? {...o, status: o.status === 'draft' ? 'shipped' : 'draft'} : o));

  return (
    <div className="min-h-screen bg-[#FDFBF9] pb-20 font-sans antialiased text-slate-800">
      <header className="sticky top-0 z-30 px-4 py-4 transition-all duration-300">
        <div className="max-w-md mx-auto flex flex-col">
          <div className={`grid transition-all duration-500 ease-in-out ${isVisible ? 'grid-rows-[1fr] opacity-100 mb-4' : 'grid-rows-[0fr] opacity-0 mb-0'}`}>
            <div className="overflow-hidden">
              <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-[2.5rem] p-3 shadow-sm flex items-center justify-between gap-4">
                <button onClick={() => setIsOrdersOpen(true)} className="p-2.5 rounded-full hover:bg-white text-slate-400 transition-all ml-1">
                   <ChevronRight className="w-5 h-5 rotate-180" />
                </button>
                <div className="opacity-90"><Logo /></div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="p-2.5 rounded-full hover:bg-white text-slate-400 transition-all"><Settings className="w-5 h-5" /></button>
                  <button onClick={() => setIsCartOpen(true)} className="relative p-3 rounded-full bg-slate-900 text-white shadow-lg active:scale-95 transition-all">
                    <ShoppingBasket className="w-5 h-5" />
                    {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-[#D4A373] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#FDFBF9]">{cart.length}</span>}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* Пошук як був... */}
        </div>
      </header>

      {/* Main content... */}
      
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
        setCart={setCart} 
        exchangeRate={exchangeRate} 
        costs={costs} 
        onSaveOrder={saveOrder}
      />
      
      <OrdersSidebar 
        isOpen={isOrdersOpen} 
        onClose={() => setIsOrdersOpen(false)} 
        orders={orders} 
        onDelete={deleteOrder} 
        onToggleStatus={toggleOrderStatus}
        onSelect={(o) => console.log('Selected', o)}
      />
    </div>
  );
}

export default App;
