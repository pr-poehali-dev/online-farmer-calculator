import Icon from "@/components/ui/icon";
import { CostItem, CalcResult, fmt } from "./types";

interface Props {
  area: string;
  setArea: (v: string) => void;
  costs: CostItem[];
  updateCost: (id: string, val: string) => void;
  yield_: string;
  setYield: (v: string) => void;
  price: string;
  setPrice: (v: string) => void;
  calc: CalcResult;
}

export default function CalculatorInputs({
  area, setArea, costs, updateCost, yield_, setYield, price, setPrice, calc,
}: Props) {
  return (
    <div className="space-y-6 animate-slide-up">
      {/* Area */}
      <div className="bg-card border border-border rounded overflow-hidden">
        <div className="border-b border-border px-6 py-4 bg-primary/4">
          <div className="flex items-center gap-2">
            <Icon name="Map" size={16} className="text-primary" />
            <h2 className="font-bold text-sm text-foreground uppercase tracking-wider">
              Площадь и культура
            </h2>
          </div>
        </div>
        <div className="px-6 py-5">
          <label className="block text-sm text-muted-foreground mb-2 font-medium">
            Площадь поля (га)
          </label>
          <input
            type="number"
            min="0"
            placeholder="Например: 50"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="w-full border border-input rounded px-4 py-2.5 text-foreground bg-background font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Costs */}
      <div className="bg-card border border-border rounded overflow-hidden">
        <div className="border-b border-border px-6 py-4 bg-primary/4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Receipt" size={16} className="text-primary" />
              <h2 className="font-bold text-sm text-foreground uppercase tracking-wider">
                Статьи затрат (₽)
              </h2>
            </div>
            <span className="text-xs font-mono text-accent font-bold">
              {fmt(calc.totalCosts)} ₽
            </span>
          </div>
        </div>
        <div className="divide-y divide-border">
          {costs.map((c) => (
            <div key={c.id} className="px-6 py-3.5 flex items-center gap-4">
              <label className="flex-1 text-sm text-foreground/80 font-medium leading-tight">
                {c.label}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={c.value}
                  onChange={(e) => updateCost(c.id, e.target.value)}
                  className="w-36 border border-input rounded px-3 py-2 text-right font-mono text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs pointer-events-none font-mono">
                  ₽
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Yield & Price */}
      <div className="bg-card border border-border rounded overflow-hidden">
        <div className="border-b border-border px-6 py-4 bg-primary/4">
          <div className="flex items-center gap-2">
            <Icon name="Sprout" size={16} className="text-primary" />
            <h2 className="font-bold text-sm text-foreground uppercase tracking-wider">
              Урожайность и цена
            </h2>
          </div>
        </div>
        <div className="divide-y divide-border">
          <div className="px-6 py-4 flex items-center gap-4">
            <label className="flex-1 text-sm text-foreground/80 font-medium">
              Урожайность (кг/га)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                placeholder="0"
                value={yield_}
                onChange={(e) => setYield(e.target.value)}
                className="w-36 border border-input rounded px-3 py-2 text-right font-mono text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs pointer-events-none font-mono">
                кг
              </span>
            </div>
          </div>
          <div className="px-6 py-4 flex items-center gap-4">
            <label className="flex-1 text-sm text-foreground/80 font-medium">
              Цена реализации (₽/кг)
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                placeholder="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-36 border border-input rounded px-3 py-2 text-right font-mono text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs pointer-events-none font-mono">
                ₽
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
