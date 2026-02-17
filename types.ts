export type ProductType = 'oil' | 'hydrolat';

export interface RetailPriceOption {
  volume: number; // volume in ml
  price: number;  // price in UAH
}

export interface Product {
  id: string;
  code?: string;
  name: string; // Main display name (UA)
  nameRu?: string;
  latinName?: string;
  keywords: string; // String containing RU, UA, Latin names for search
  type: ProductType;
  rawMaterial?: string;
  origin?: string; 
  retailPrices: RetailPriceOption[];
  purchasePriceEurPerKg: number | null; // Cost in EUR per 1000ml (1 Litre/Kg)
}

export interface CartItem {
  cartId: string;
  product: Product;
  selectedVolume: number;
  selectedPrice: number;
}