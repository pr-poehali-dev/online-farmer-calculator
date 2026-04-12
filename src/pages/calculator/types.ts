export interface CostItem {
  id: string;
  label: string;
  value: string;
}

export interface CalcResult {
  totalCosts: number;
  totalProduction: number;
  revenue: number;
  profit: number;
  netProfit: number;
  costPerUnit: number;
  margin: number;
  breakeven: number;
  areaNum: number;
}

export const DEFAULT_COSTS: CostItem[] = [
  { id: "seeds", label: "Семена и посадочный материал", value: "" },
  { id: "fertilizers", label: "Удобрения", value: "" },
  { id: "pesticides", label: "Средства защиты растений", value: "" },
  { id: "fuel", label: "Топливо и ГСМ", value: "" },
  { id: "labor", label: "Оплата труда", value: "" },
  { id: "rent", label: "Аренда земли", value: "" },
  { id: "equipment", label: "Амортизация техники", value: "" },
  { id: "other", label: "Прочие расходы", value: "" },
];

export interface ChecklistItem {
  id: string;
  label: string;
  defaultValue: number;
}

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: "packaging", label: "Упаковка и тара", defaultValue: 15000 },
  { id: "transport", label: "Транспортировка и логистика", defaultValue: 25000 },
  { id: "storage", label: "Хранение урожая", defaultValue: 10000 },
  { id: "insurance", label: "Страхование посевов", defaultValue: 8000 },
  { id: "water", label: "Полив и водоснабжение", defaultValue: 12000 },
  { id: "certification", label: "Сертификация и документы", defaultValue: 5000 },
  { id: "marketing", label: "Реклама и сбыт", defaultValue: 7000 },
  { id: "veterinary", label: "Ветеринарные услуги", defaultValue: 6000 },
];

export interface MarketPrice {
  crop: string;
  minPrice: number;
  maxPrice: number;
  avgYield: number;
  unit: string;
}

export const MARKET_PRICES: MarketPrice[] = [
  { crop: "Пшеница", minPrice: 12, maxPrice: 18, avgYield: 3000, unit: "₽/кг" },
  { crop: "Ячмень", minPrice: 10, maxPrice: 15, avgYield: 2800, unit: "₽/кг" },
  { crop: "Кукуруза", minPrice: 11, maxPrice: 16, avgYield: 6000, unit: "₽/кг" },
  { crop: "Подсолнечник", minPrice: 25, maxPrice: 38, avgYield: 2000, unit: "₽/кг" },
  { crop: "Соя", minPrice: 30, maxPrice: 45, avgYield: 1800, unit: "₽/кг" },
  { crop: "Картофель", minPrice: 15, maxPrice: 30, avgYield: 25000, unit: "₽/кг" },
  { crop: "Сахарная свёкла", minPrice: 5, maxPrice: 8, avgYield: 40000, unit: "₽/кг" },
  { crop: "Рапс", minPrice: 28, maxPrice: 42, avgYield: 2200, unit: "₽/кг" },
  { crop: "Лук", minPrice: 18, maxPrice: 35, avgYield: 30000, unit: "₽/кг" },
  { crop: "Морковь", minPrice: 14, maxPrice: 28, avgYield: 35000, unit: "₽/кг" },
];

export function fmt(n: number) {
  return n.toLocaleString("ru-RU", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export function parseNum(s: string) {
  return parseFloat(s.replace(",", ".")) || 0;
}
