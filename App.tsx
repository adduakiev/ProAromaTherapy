import React, { useState, useMemo } from 'react';
import { Logo } from './components/Logo';
import { PRODUCTS, FX_EUR_TO_UAH, PACK_COST_UAH } from './data';
import { Product, CartItem } from './types';
import { Search, ShoppingBasket, Settings } from './components/Icons';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(FX_EUR_TO_UAH || 52);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // 1. Групування та фільтрація
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

  const addToCart = (product: Product, volume: number, price: number) => {
    const newItem: CartItem = {
      id: Math.random().toString(36).substr(2, 9),
      product,
      selectedVolume: volume,
      selectedPrice: price
    };
    setCart([...cart, newItem]);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans antialiased text-slate-900">
      {/* Header з ефектом скла */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-4 py-3">
        <div className="max-w-md mx-auto flex items-center justify-between gap-4">
          <Logo />
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="p-2.5 rounded-xl hover:bg-slate-100 transition-colors text-slate-500"
            >
              <Settings className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl bg-slate-900 text-white shadow-lg shadow-slate-200 transition-transform active:scale-95"
            >
              <ShoppingBasket className="w-6 h-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-slate-900 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mt-4 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Пошук олії або властивості..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-slate-100 border-none rounded-2xl focus:ring-2 focus:ring-amber-400/50 transition-all placeholder:text-slate-400"
          />
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 mt-6">
        {isSettingsOpen && (
          <div className="mb-6 p-4 bg-amber-50 rounded-2xl border border-amber-100 animate-in fade-in slide-in-from-top-4">
            <label className="block text-xs font-bold text-amber-800 uppercase tracking-wider mb-2">Курс EUR/UAH</label>
            <input 
              type="number" 
              value={exchangeRate}
              onChange={(e) => setExchangeRate(Number(e.target.value))}
              className="w-full bg-white border-amber-200 rounded-xl px-4 py-2 text-lg font-semibold focus:ring-amber-400"
            />
          </div>
        )}

        {/* Список товарів за категоріями */}
        <div className="space-y-8">
          {Object.entries(groupedProducts).map(([category, items]) => (
            <section key={category}>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4 ml-1 flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${category === 'Ефірні олії' ? 'bg-amber-400' : 'bg-teal-400'}`} />
                {category}
              </h2>
              <div className="grid gap-3">
                {items.map(product => (
                  <button
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="group w-full text-left p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-amber-200 hover:shadow-md transition-all flex justify-between items-center"
                  >
                    <div>
                      <h3 className="font-bold text-slate-800 group-hover:text-amber-600 transition-colors">{product.name}</h3>
                      <p className="text-xs text-slate-400 italic mt-0.5">{product.latinName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter mb-1">{product.rawMaterial}</p>
                      <div className="flex gap-1 justify-end">
                        {product.retailPrices.map(rp => (
                          <span key={rp.volume} className="text-[10px] px-2 py-1 bg-slate-50 text-slate-600 rounded-md border border-slate-100">
                            {rp.volume}ml
                          </span>
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Модальні вікна */}
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
        packCosts={PACK_COST_UAH}
      />
    </div>
  );
}


