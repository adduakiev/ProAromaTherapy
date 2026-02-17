export type ProductType = 'oil' | 'hydrolat';

export interface RetailPriceOption {
  volume: number; // volume in ml
  price: number;  // price in UAH
}

export interface Product {
  id: string;
  name: string; // Main display name
  keywords: string; // String containing RU, UA, Latin names for search
  type: ProductType;
  origin?: string; // Only for oils
  retailPrices: RetailPriceOption[];
  purchasePriceEur: number; // Cost in EUR per 1000ml (1 Litre/Kg)
}

export interface CartItem {
  cartId: string;
  product: Product;
  selectedVolume: number;
  selectedPrice: number;
}
