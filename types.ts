export interface Product {
  id: string;
  code: string;
  name: string;
  latinName: string;
  type: 'oil' | 'hydrolat';
  rawMaterial: string;
  purchasePriceEurPerKg: number;
  retailPrices: { volume: number; price: number }[];
  keywords: string;
}

export interface CartItem {
  id: string;
  product: Product;
  selectedVolume: number;
  selectedPrice: number;
}

export interface Order {
  id: string;
  date: string;
  customer: {
    name: string;
    phone: string;
    np: string;
  };
  items: CartItem[];
  total: number;
  profit: number;
  status: 'draft' | 'shipped';
}
