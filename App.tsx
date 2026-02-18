import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Logo } from './components/Logo';
import { PRODUCTS, FX_EUR_TO_UAH, DEFAULT_COSTS } from './data';
import { Product, CartItem } from './types';
import { Search, ShoppingBasket, Settings, X } from './components/Icons';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(FX_EUR_TO_UAH);
  const [costs, setCosts] = useState(DEFAULT_COSTS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        if (currentScrollY < 20) setIsVisible(true);
        else if (currentScrollY > lastScrollY && currentScrollY > 80) setIsVisible(false);
        else if (currentScrollY < lastScrollY) setIsVisible(true);
        setLastScrollY(currentScrollY);
      }
    };
    window.addEventListener('scroll', controlNavbar, { passive: true });
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  const groupedProducts = useMemo(() => {
    const lowerTerm = searchTerm.toLowerCase();
    const filtered = PRODUCTS.filter(p => 
      p.keywords.toLowerCase().includes(lowerTerm) || 
      p.name.toLowerCase().includes(lowerTerm) ||
      p.latinName.toLowerCase().includes(lowerTerm)
    );
    return filtered.reduce((acc, product) => {
      const typeLabel = product.type === 'oil' ? 'Ефірні олії' : 'Гідролати';
      if (!acc[typeLabel]) acc[typeLabel] = [];
      acc[typeLabel].push(product);
      return acc;
    }, {} as Record<string, Product[]>);
  }, [searchTerm]);

  const addToCart = (product: Product, option: any) => {
    const newItem: CartItem = {
      id: Math.random().toString(36).substr(2, 9),
      product,
      selectedVolume: option.volume,
      selectedPrice: option.price
    };
    setCart([...cart, newItem]);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] pb-20 font-sans antialiased text-slate-800">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,#F8F3EF_0%,#FDFBF9_100%)] pointer-events-none" />

      <header className="sticky top-0 z-30 px-4 py-4 transition-all duration-300">
        <div className="max-w-md mx-auto flex flex-col">
          <div className={`grid transition-all duration-500 ease-in-out ${isVisible ? 'grid-rows-[1fr] opacity-100 mb-4' : 'grid-rows-[0fr] opacity-0 mb-0'}`}>
            <div className="overflow-hidden">
              <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-[2.5rem] p-3 shadow-sm flex items-center justify-between gap-4">
                <div className="pl-3 opacity-90"><Logo /></div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="p-2.5 rounded-full hover:bg-white text-slate-400">
                    <Settings className="w-5 h-5" />
                  </button>
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
        {isSettingsOpen && (
          <div className="mb-8 p-6 bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-xl">
            <h3 className="text-center text-[10px] font-black uppercase tracking-widest text-[#D4A373] mb-6">Налаштування бізнесу</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-white/50 p-3 rounded-2xl">
                <span className="text-xs font-bold text-slate-500 tracking-tight">Курс EUR (€)</span>
                <input type="number" value={exchangeRate} onChange={(e) => setExchangeRate(Number(e.target.value))} className="w-20 bg-white border-none rounded-xl text-right font-bold text-slate-800 outline-none p-2 shadow-sm" />
              </div>

              <div className="space-y-3">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Тара Олії (3 / 5 / 15 мл)</p>
                <div className="grid grid-cols-3 gap-2">
                  {['oil3', 'oil5', 'oil15'].map(k => (
                    <input key={k} type="number" value={costs[k as keyof typeof costs]} onChange={(e) => setCosts({...costs, [k]: Number(e.target.value)})} className="w-full bg-white border-none rounded-xl p-2 text-center font-bold text-slate-700 shadow-sm" />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Тара Гідролати (100P / 100G / 200 / 500 мл)</p>
                <div className="grid grid-cols-4 gap-2">
                  {['hydro100p', 'hydro100g', 'hydro200', 'hydro500'].map(k => (
                    <input key={k} type="number" value={costs[k as keyof typeof costs]} onChange={(e) => setCosts({...costs, [k]: Number(e.target.value)})} className="w-full bg-white border-none rounded-xl p-2 text-center font-bold text-slate-700 shadow-sm" />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase">Етикетка фл.</p>
                  <input type="number" value={costs.label} onChange={(e) => setCosts({...costs, label: Number(e.target.value)})} className="w-full bg-white border-none rounded-xl p-2 text-center font-bold text-slate-700 shadow-sm" />
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase">Коробка крафт</p>
                  <input type="number" value={costs.shippingBox} onChange={(e) => setCosts({...costs, shippingBox: Number(e.target.value)})} className="w-full bg-white border-none rounded-xl p-2 text-center font-bold text-slate-700 shadow-sm" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-12">
          {Object.entries(groupedProducts).map(([category, items]) => (
            <section key={category}>
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-6 bg-[#E8E0D9]" /><h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#A69080]">{category}</h2><div className="h-px w-6 bg-[#E8E0D9]" />
              </div>
              <div className="grid gap-4">
                {items.map(product => (
                  <button key={product.id} onClick={() => setSelectedProduct(product)} className="w-full text-left p-5 bg-white/70 backdrop-blur-[2px] rounded-[2rem] border border-white shadow-sm hover:shadow-md transition-all flex justify-between items-center group active:scale-[0.98]">
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
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={addToCart} />}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} cart={cart} setCart={setCart} exchangeRate={exchangeRate} costs={costs} />
    </div>
  );
}

export default App;
