import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Logo } from './components/Logo';
import { PRODUCTS, FX_EUR_TO_UAH, DEFAULT_COSTS } from './data';
import { Product, CartItem, Order } from './types';
import { Search, ShoppingBasket, Settings, X, ChevronRight } from './components/Icons';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { OrdersSidebar } from './components/OrdersSidebar';
import { OrderDetailsModal } from './components/OrderDetailsModal';

const ProductCard = React.memo(({ product, onClick }: { product: Product, onClick: (p: Product) => void }) => (
  <button onClick={() => onClick(product)} className="w-full text-left p-5 bg-white/70 backdrop-blur-[2px] rounded-[2rem] border border-white shadow-sm hover:shadow-md transition-all flex justify-between items-center group active:scale-[0.98]">
    <div>
      <h3 className="font-medium text-slate-800 text-[15px] group-hover:text-[#D4A373] transition-colors">{product.name}</h3>
      <p className="text-[11px] text-slate-400 italic mt-0.5 font-serif opacity-70">{product.latinName}</p>
    </div>
    <div className="flex -space-x-1.5">
      {product.retailPrices.map(rp => (
        <div key={rp.volume} className="w-8 h-8 rounded-full bg-[#F8F3EF] border-2 border-white flex items-center justify-center shadow-sm">
          <span className="text-[8px] font-bold text-[#A69080]">{rp.volume === 101 ? 'G' : rp.volume}</span>
        </div>
      ))}
    </div>
  </button>
));

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // ДЛЯ ПЕРЕГЛЯДУ
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('aroma_orders') : null;
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
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  const addToCart = useCallback((product: Product, option: any) => {
    setCart(prev => [...prev, { id: Math.random().toString(36).substr(2, 9), product, selectedVolume: option.volume, selectedPrice: option.price }]);
    setSelectedProduct(null);
  }, []);

  const saveOrder = (orderData: Order) => {
    setOrders([orderData, ...orders]);
    setCart([]);
  };

  const deleteOrder = (id: string) => setOrders(orders.filter(o => o.id !== id));
  const toggleOrderStatus = (id: string) => setOrders(orders.map(o => o.id === id ? {...o, status: o.status === 'draft' ? 'shipped' : 'draft'} : o));

  return (
    <div className="min-h-screen bg-[#FDFBF9] pb-20 font-sans antialiased text-slate-800">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,#F8F3EF_0%,#FDFBF9_100%)] pointer-events-none" />
      <header className="sticky top-0 z-30 px-4 py-4 transition-all duration-300">
        <div className="max-w-md mx-auto flex flex-col">
          <div className={`grid transition-all duration-500 ease-in-out ${isVisible ? 'grid-rows-[1fr] opacity-100 mb-4' : 'grid-rows-[0fr] opacity-0 mb-0'}`}>
            <div className="overflow-hidden">
              <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-[2.5rem] p-3 shadow-sm flex items-center justify-between gap-4">
                <button onClick={() => setIsOrdersOpen(true)} className="p-2.5 rounded-full hover:bg-white text-slate-400 transition-all ml-1"><ChevronRight className="w-5 h-5 rotate-180" /></button>
                <div className="opacity-90"><Logo /></div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="p-2.5 rounded-full hover:bg-white text-slate-400"><Settings className="w-5 h-5" /></button>
                  <button onClick={() => setIsCartOpen(true)} className="relative p-3 rounded-full bg-slate-900 text-white shadow-lg active:scale-95 transition-all">
                    <ShoppingBasket className="w-5 h-5" />
                    {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-[#D4A373] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#FDFBF9]">{cart.length}</span>}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={`relative group transition-transform duration-500 ease-in-out ${!isVisible ? '-translate-y-2' : 'translate-y-0'}`}>
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#D4A373] transition-colors" />
            <input ref={searchInputRef} type="text" placeholder="Знайти магію рослин..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-12 py-4 bg-white/40 border border-white rounded-full focus:bg-white focus:ring-4 focus:ring-orange-50/20 transition-all placeholder:text-slate-300 text-sm shadow-sm outline-none" />
            {searchTerm && <button onClick={() => { setSearchTerm(''); searchInputRef.current?.focus(); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-slate-100/50 text-slate-400 hover:text-slate-600 transition-all"><X className="w-4 h-4" /></button>}
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 mt-4 relative z-10">
        <div className="space-y-12">
          {Object.entries(groupedProducts).map(([category, items]) => (
            <section key={category}>
              <div className="flex items-center justify-center gap-3 mb-6"><div className="h-px w-6 bg-[#E8E0D9]" /><h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#A69080]">{category}</h2><div className="h-px w-6 bg-[#E8E0D9]" /></div>
              <div className="grid gap-4">{items.map((p: any) => (<ProductCard key={p.id} product={p} onClick={setSelectedProduct} />))}</div>
            </section>
          ))}
        </div>
      </main>

      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} />}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} setCart={setCart} exchangeRate={exchangeRate} costs={costs} onSaveOrder={saveOrder} />
      
      <OrdersSidebar 
        isOpen={isOrdersOpen} 
        onClose={() => setIsOrdersOpen(false)} 
        orders={orders} 
        onDelete={deleteOrder} 
        onToggleStatus={toggleOrderStatus}
        onSelect={(o) => { setSelectedOrder(o); setIsOrdersOpen(false); }} 
      />

      <OrderDetailsModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
    </div>
  );
}

export default App;
