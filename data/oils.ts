import { Product } from "../types";

export const oils: Product[] = [
  {
    id: "EO23-1",
    code: "EO23-1",
    name: "Абельмош мускусний",
    latinName: "Abelmoschus moschatus",
    type: "oil",
    rawMaterial: "насіння",
    keywords: "Абельмош мускусний мускусный Abelmoschus moschatus",
    purchasePriceEurPerKg: 16800,
    retailPrices: [
      { volume: 3, price: 4350 },
      { volume: 5, price: 6110 }
    ]
  },
  {
    id: "EO23-3",
    code: "EO23-3",
    name: "Ажгон(Україна)",
    latinName: "Trachyspеrmum аmmi",
    type: "oil",
    rawMaterial: "насіння",
    keywords: "Ажгон(Україна) Ажгон Trachyspеrmum аmmi",
    purchasePriceEurPerKg: 1220,
    retailPrices: [
      { volume: 5, price: 640 },
      { volume: 15, price: 1420 }
    ]
  },
  {
    id: "EO23-2",
    code: "EO23-2",
    name: "Аїр болотний (Україна)",
    latinName: "Acorus calamus",
    type: "oil",
    rawMaterial: "коріння",
    purchasePriceEurPerKg: 1380,
    retailPrices: [
      { volume: 5, price: 710 },
      { volume: 15, price: 1600 }
    ],
    keywords: "Аїр болотний (Україна) Аир болотный Acorus calamus"
  },
  {
    id: "EO23-8",
    code: "EO23-8",
    name: "Апельсин солодкий (прес.)",
    latinName: "Citrus sinensis",
    type: "oil",
    rawMaterial: "плоди",
    purchasePriceEurPerKg: 310,
    retailPrices: [
      { volume: 5, price: 300 },
      { volume: 15, price: 630 }
    ],
    keywords: "Апельсин солодкий (прес.) Апельсин сладкий(прес.) Citrus sinensis"
  }
];
