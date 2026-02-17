import React, { useState, useMemo, useEffect } from 'react';
import { Logo } from './components/Logo';
import { PRODUCTS, FX_EUR_TO_UAH, PACK_COST_UAH } from './data';
import { Product, CartItem, RetailPriceOption } from './types';
import { Search, ShoppingBasket, Settings, Euro, Check } from './components/Icons';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';

// Helper to generate unique IDs
const generateId = () => Math.random().toString(36).substr(2, 9);

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [exchangeRate, setExchangeRate] = useState(FX_EUR_TO_UAH || 52); // Use default from data or 52
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Filter and Sort Logic
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return PRODUCTS; // Show all by default

    const lowerTerm = searchTerm.toLowerCase();
    
    // Filter
    const filtered = PRODUCTS.filter(p => 
      p.keywords.toLowerCase().includes(lowerTerm) || 
      p.name.toLowerCase().includes(lowerTerm)
    );

    // Sort: Oils first, then Hydrolats
    return filtered.sort((a, b) => {
      if (a.type === b.type) return 0;
      return a.type === 'oil' ? -1 : 1;
    });
  }, [searchTerm]);

  const addToCart = (product: Product, option: RetailPriceOption) => {
    const newItem: CartItem = {
      cartId: generateId(),
      product,
      selectedVolume: option.volume,
      selectedPrice: option.price
    };
    setCart(prev => [...prev, newItem]);
  };

  const removeFromCart = (cartId: string) => {
    setCart(prev => prev.filter(item => item.cartId !== cartId));
  };

  // Calculations
  const totalRevenue = cart.reduce((sum, item) => sum + item.selectedPrice, 0);
  
  const totalProfit = cart.reduce((sum, item) => {
    // 1. Calculate Cost of Oil/Hydrolat in EUR
    // item.product.purchasePriceEurPerKg is price per 1000ml/g
    let costProductEur = 0;
    if (item.product.purchasePriceEurPerKg) {
        costProductEur = (item.product.purchasePriceEurPerKg / 1000) * item.selectedVolume;
    }

    // 2. Convert Product Cost to UAH
    const costProductUah = costProductEur * exchangeRate;

    // 3. Add Packing Cost (Bottle + Label etc)
    // PACK_COST_UAH keys are numbers (volumes)
    const packCost = PACK_COST_UAH[item.selectedVolume] || 0;

    // 4. Calculate Profit
    // If purchase price is missing (null), assume 0 cost for product (profit = price - pack), 
    // or arguably we might want to flag this. For now, we calculate what we can.
    const profit = item.selectedPrice - costProductUah - packCost;
    
    return sum + profit;
  }, 0);

  return (
    <div className="min-h-screen pb-24">
      <Logo />

      {/* Main Container */}
      <div className="max-w-xl mx-auto px-4">
        
        {/* Search Bar (Sticky) */}
        <div className="sticky top-[80px] z-10 bg-gray-50 pt-2 pb-4">
          <div className="relative shadow-md rounded-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Пошук (напр. Роза, Лаванда)..."
              className="block w-full pl-12 pr-4 py-4 rounded-2xl border-none focus:ring-2 focus:ring-blue-500 bg-white text-lg placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
            />
          </div>
          
          {/* Settings Toggle (Small) */}
          <div className="flex justify-end mt-2">
             <button 
               onClick={() => setIsSettingsOpen(!isSettingsOpen)}
               className="text-xs text-gray-400 flex items-center gap-1 hover:text-gray-600"
             >
               <Settings size={12} /> Курс: {exchangeRate}
             </button>
          </div>

          {/* Settings Panel (Inline) */}
          {isSettingsOpen && (
            <div className="mt-2 p-3 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center gap-2 animate-in slide-in-from-top-2">
              <Euro size={16} className="text-gray-500"/>
              <span className="text-sm font-medium">Курс ЄВРО:</span>
              <input 
                type="number" 
                value={exchangeRate}
                onChange={(e) => setExchangeRate(Number(e.target.value))}
                className="w-20 p-1 border rounded text-center font-bold"
              />
              <span className="text-sm text-gray-500">₴</span>
            </div>
          )}
        </div>

        {/* Product List */}
        <div className="mt-2 space-y-3">
          {filteredProducts.map(product => (
            <div 
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className={`p-4 rounded-xl cursor-pointer transition-all active:scale-[0.99] shadow-sm border-l-4 ${
                product.type === 'oil' 
                  ? 'bg-white border-l-amber-500' 
                  : 'bg-white border-l-teal-500'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-800 leading-tight">
                    {product.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                     {product.latinName && (
                      <span className="text-xs text-gray-500 italic">
                        {product.latinName}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                     <span className="text-[10px] uppercase font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                        {product.type === 'oil' ? 'Ефірна олія' : 'Гідролат'}
                     </span>
                     {product.rawMaterial && (
                        <span className="text-[10px] text-gray-400">
                           • {product.rawMaterial}
                        </span>
                     )}
                  </div>
                </div>
                {product.type === 'oil' ? (
                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-2 shrink-0"></div>
                ) : (
                   <div className="w-2 h-2 rounded-full bg-teal-500 mt-2 shrink-0"></div>
                )}
              </div>
            </div>
          ))}
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              Нічого не знайдено
            </div>
          )}
        </div>
      </div>

      {/* Sticky Bottom Summary (Call to Action) */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20">
          <div className="max-w-xl mx-auto flex justify-between items-center">
            <div onClick={() => setIsCartOpen(true)} className="flex flex-col cursor-pointer">
              <span className="text-xs text-gray-500">В кошику {cart.length} поз.</span>
              <span className="text-2xl font-bold text-gray-900">{totalRevenue} ₴</span>
            </div>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 active:bg-blue-700"
            >
              <ShoppingBasket size={20} />
              Кошик
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        onAddToCart={addToCart}
      />

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemove={removeFromCart}
        totalRevenue={totalRevenue}
        totalProfit={totalProfit}
        exchangeRate={exchangeRate}
      />
    </div>
  );
}

export default App;