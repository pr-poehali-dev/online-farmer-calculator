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

export function fmt(n: number) {
  return n.toLocaleString("ru-RU", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

export function parseNum(s: string) {
  return parseFloat(s.replace(",", ".")) || 0;
}
