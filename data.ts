import { Product } from './types';

// DATA INSTRUCTIONS:
// 1. purchasePriceEur is the cost per 1000ml (1 Litre).
// 2. retailPrices is an array of available volumes and their UAH price.
// 3. keywords should include all variations (latin, ua, ru) for search.

export const PRODUCTS: Product[] = [
  // --- ЕФІРНІ ОЛІЇ (OILS) ---
  {
    id: 'oil_1',
    name: 'Шафран (Saffron)',
    keywords: 'шафран saffron crocus sativus ефірна олія',
    type: 'oil',
    origin: 'Індія',
    purchasePriceEur: 25000, // Example: Very expensive per liter
    retailPrices: [
      { volume: 1, price: 900 },
      { volume: 3, price: 2160 },
      { volume: 5, price: 3260 },
    ]
  },
  {
    id: 'oil_2',
    name: 'Троянда Дамаська (Rose)',
    keywords: 'троянда роза rose damascena ефірна олія',
    type: 'oil',
    origin: 'Болгарія',
    purchasePriceEur: 12000, 
    retailPrices: [
      { volume: 1, price: 600 },
      { volume: 2, price: 1100 },
      { volume: 5, price: 2500 },
    ]
  },
  {
    id: 'oil_3',
    name: 'Лаванда (Lavender)',
    keywords: 'лаванда lavender lavandula angustifolia',
    type: 'oil',
    origin: 'Франція',
    purchasePriceEur: 250, 
    retailPrices: [
      { volume: 5, price: 150 },
      { volume: 10, price: 280 },
      { volume: 30, price: 750 },
    ]
  },
  {
    id: 'oil_4',
    name: 'Чайне Дерево (Tea Tree)',
    keywords: 'чайне дерево tea tree melaleuca',
    type: 'oil',
    origin: 'Австралія',
    purchasePriceEur: 180,
    retailPrices: [
      { volume: 10, price: 220 },
      { volume: 30, price: 600 },
    ]
  },
  
  // --- ГІДРОЛАТИ (HYDROLATS) ---
  {
    id: 'hydro_1',
    name: 'Гідролат Троянди',
    keywords: 'гідролат троянди роза rose water hydrolat',
    type: 'hydrolat',
    purchasePriceEur: 25, // Cheap per liter
    retailPrices: [
      { volume: 100, price: 250 },
      { volume: 200, price: 450 },
      { volume: 500, price: 1000 },
    ]
  },
  {
    id: 'hydro_2',
    name: 'Гідролат Ромашки',
    keywords: 'гідролат ромашки chamomile ромашка',
    type: 'hydrolat',
    purchasePriceEur: 20,
    retailPrices: [
      { volume: 100, price: 200 },
      { volume: 200, price: 380 },
    ]
  },
  {
    id: 'hydro_3',
    name: 'Гідролат Волошки',
    keywords: 'гідролат волошки centaurea cyanus cornflower',
    type: 'hydrolat',
    purchasePriceEur: 30,
    retailPrices: [
      { volume: 100, price: 280 },
      { volume: 250, price: 600 },
    ]
  }
];