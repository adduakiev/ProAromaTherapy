import { oils } from './data/oils';
import { hydrolats } from './data/hydrolats';
import { Product } from './types';

export const FX_EUR_TO_UAH = 52;

// Нова функція замість старого об'єкта PACK_COST_UAH
export const getPackCost = (volume: number): number => {
  if (volume === 101) return 25; // Собівартість скла
  return 15; // Собівартість пластику для всіх інших об'ємів
};

export const PRODUCTS: Product[] = [...oils, ...hydrolats];