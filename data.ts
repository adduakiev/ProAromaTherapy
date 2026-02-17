import { oils } from './data/oils';
import { hydrolats } from './data/hydrolats';
import { Product } from './types';

export const FX_EUR_TO_UAH = 52;

// Розумна функція розрахунку тари
export const getPackCost = (volume: number): number => {
  if (volume === 101) return 25; // Скло
  return 15; // Пластик
};

export const PRODUCTS: Product[] = [...oils, ...hydrolats];