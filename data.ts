import { oils } from './data/oils';
import { hydrolats } from './data/hydrolats';
import { Product } from './types';

export const FX_EUR_TO_UAH = 52;

// Розширені витрати за замовчуванням
export const DEFAULT_COSTS = {
  // Ефірні олії (Тара)
  oil3: 5,
  oil5: 6,
  oil15: 7,
  // Гідролати (Тара)
  hydro100p: 15, // пластик
  hydro100g: 16, // скло (код 101)
  hydro200: 15,
  hydro500: 17,
  // Етикетка на флакон
  label: 1,
  // Пакування замовлення (фіксовано на кошик)
  packingPaper: 1,
  shippingBox: 15,
  boxLabel: 1
};

export const PRODUCTS: Product[] = [...oils, ...hydrolats];
