import { oils } from './data/oils';
import { hydrolats } from './data/hydrolats';
import { Product } from './types';

export const FX_EUR_TO_UAH = 52;

// Константи витрат за замовчуванням
export const COSTS = {
  plasticPack: 15,    // Тара пластик + помпа
  glassPack: 20,      // Тара скло + помпа
  label: 1,           // Етикетка на флакон
  packingPaper: 1,    // Папір ежик
  shippingBox: 15,    // Коробочка крафт
  boxLabel: 1         // Етикетка на коробку
};

export const getPackCost = (volume: number, costs = COSTS): number => {
  const basePack = volume === 101 ? costs.glassPack : costs.plasticPack;
  return basePack + costs.label;
};

export const PRODUCTS: Product[] = [...oils, ...hydrolats];
