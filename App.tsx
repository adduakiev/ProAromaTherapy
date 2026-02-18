import React, { useState, useMemo, useEffect } from 'react';
import { Logo } from './components/Logo';
import { PRODUCTS, FX_EUR_TO_UAH, getPackCost } from './data';
import { Product, CartItem } from './types';
import { Search, ShoppingBasket, Settings } from './components/Icons';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(FX_EUR_TO_UAH);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;
        if (currentScrollY < 20) {
          setIsVisible(true);
        } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
          setIsVisible(false);
        } else if (currentScrollY < lastScrollY) {
          setIsVisible(true);
        }
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
          
          {/* Контейнер Лого: плавно згортається через grid-rows */}
          <div className={`grid transition-all duration-500 ease-in-out ${
            isVisible ? 'grid-rows-[1fr] opacity-100 mb-4' : 'grid-rows-[0fr] opacity-0 mb-0'
          }`}>
            <div className="overflow-hidden">
              <div className="bg-white/60 backdrop-blur-xl border border-white/40 rounded-[2.5rem] p-3 shadow-sm flex items-center justify-between gap-4">
                <div className="pl-3 opacity-90">
                  <Logo />
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="p-2.5 rounded-full hover:bg-white text-slate-400">
                    <Settings className="w-5 h-5" />
                  </button>
                  <button onClick={() => setIsCartOpen(true)} className="relative p-3 rounded-full bg-slate-900 text-white shadow-lg active:scale-95 transition-all">
                    <ShoppingBasket className="w-5 h-5" />
                    {cart.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-[#D4A373] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#FDFBF9]">
                        {cart.length}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Пошук: плавно піднімається, коли лого зникає */}
          <div className={`relative group transition-transform duration-500 ease-in-out ${
            !isVisible ? '-translate-y-2' : 'translate-y-0'
          }`}>
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#D4A373] transition-colors" />
            <input
              type="text"
              placeholder="Знайти магію рослин..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/40 border border-white rounded-full focus:bg-white focus:ring-4 focus:ring-orange-50/20 transition-all placeholder:text-slate-300 text-sm shadow-sm outline-none"
            />
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 mt-4 relative z-10">
        {isSettingsOpen && (
          <div className="mb-8 p-6 bg-white/60 backdrop-blur-sm rounded-[2rem] border border-white shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
            <label className="block text-[10px] font-black text-[#D4A373] uppercase tracking-[0.2em] mb-3 text-center text-slate-400 font-sans">Курс EUR/UAH</label>
            <div className="relative">
              <input 
                type="number" 
                value={exchangeRate} 
                onChange={(e) => setExchangeRate(Number(e.target.value))} 
                className="w-full bg-white/80 border-none rounded-2xl px-4 py-3 text-center text-xl font-light text-slate-600 focus:ring-2 focus:ring-orange-100 outline-none" 
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300 uppercase font-sans">UAH</span>
            </div>
          </div>
        )}

        <div className="space-y-12">
          {Object.entries(groupedProducts).map(([category, items]) => (
            <section key={category}>
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="h-px w-6 bg-[#E8E0D9]" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#A69080] font-sans">{category}</h2>
                <div className="h-px w-6 bg-[#E8E0D9]" />
              </div>
              <div className="grid gap-4">
                {items.map(product => (
                  <button 
                    key={product.id} 
                    onClick={() => setSelectedProduct(product)} 
                    className="w-full text-left p-5 bg-white/70 backdrop-blur-[2px] rounded-[2rem] border border-white shadow-[0_4px_20px_-4px_rgba(232,224,217,0.2)] hover:shadow-[0_8px_30px_-4px_rgba(232,224,217,0.4)] hover:bg-white transition-all flex justify-between items-center group active:scale-[0.98]"
                  >
                    <div>
                      <h3 className="font-medium text-slate-800 text-[15px] group-hover:text-[#D4A373] transition-colors">{product.name}</h3>
                      <p className="text-[11px] text-slate-400 italic mt-0.5 font-serif opacity-70">{product.latinName}</p>
                    </div>
                    <div className="flex -space-x-1.5">
                      {product.retailPrices.map(rp => (
                        <div key={rp.volume} className="w-8 h-8 rounded-full bg-[#F8F3EF] border-2 border-white flex items-center justify-center shadow-sm">
                          <span className="text-[8px] font-bold text-[#A69080]">
                            {rp.volume === 101 ? 'G' : rp.volume}
                          </span>
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

      {selectedProduct && (
        <ProductModal 
          product={selectedProduct} 
          onClose={() => setSelectedProduct(null)}
          onAddToCart={addToCart}
        />
      )}
      
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        setCart={setCart}
        exchangeRate={exchangeRate}
      />
    </div>
  );
}

export default App;
