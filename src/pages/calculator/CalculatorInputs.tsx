import { useState } from "react";
import Icon from "@/components/ui/icon";
import { CostItem, CalcResult, fmt, parseNum, MARKET_PRICES, CHECKLIST_ITEMS } from "./types";

interface Props {
  area: string;
  setArea: (v: string) => void;
  costs: CostItem[];
  updateCost: (id: string, val: string) => void;
  yield_: string;
  setYield: (v: string) => void;
  price: string;
  setPrice: (v: string) => void;
  taxRate: string;
  setTaxRate: (v: string) => void;
  extraCosts: number;
  setExtraCosts: (v: number) => void;
  calc: CalcResult;
}

export default function CalculatorInputs({
  area, setArea, costs, updateCost, yield_, setYield, price, setPrice,
  taxRate, setTaxRate, extraCosts, setExtraCosts, calc,
}: Props) {
  const [showPrices, setShowPrices] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [sliderPrice, setSliderPrice] = useState<number | null>(null);

  const priceNum = parseNum(price);
  const costPerUnit = calc.costPerUnit;
  const minSlider = Math.max(1, Math.floor(costPerUnit * 0.5));
  const maxSlider = Math.max(minSlider + 10, Math.ceil(costPerUnit * 2.5));

  const effectiveSliderPrice = sliderPrice ?? priceNum;
  const sliderProfit = calc.totalProduction > 0
    ? effectiveSliderPrice * calc.totalProduction - calc.totalCosts
    : 0;
  const sliderInProfit = sliderProfit >= 0;

  const toggleChecklist = (id: string, defaultValue: number) => {
    const next = new Set(checkedItems);
    if (next.has(id)) {
      next.delete(id);
      setExtraCosts(extraCosts - defaultValue);
    } else {
      next.add(id);
      setExtraCosts(extraCosts + defaultValue);
    }
    setCheckedItems(next);
  };

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

        {/* Checklist trigger */}
        <div className="px-6 py-4 border-t border-border bg-secondary/30">
          <button
            onClick={() => setShowChecklist(!showChecklist)}
            className="flex items-center gap-2 text-sm text-primary font-semibold hover:opacity-80 transition-opacity"
          >
            <Icon name={showChecklist ? "ChevronUp" : "CheckSquare"} size={15} className="text-primary" />
            Чек-лист: затраты которые часто забывают
            {checkedItems.size > 0 && (
              <span className="ml-auto text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5 font-mono">
                +{fmt(extraCosts)} ₽
              </span>
            )}
          </button>

          {showChecklist && (
            <div className="mt-4 space-y-2">
              {CHECKLIST_ITEMS.map((item) => {
                const checked = checkedItems.has(item.id);
                return (
                  <label
                    key={item.id}
                    className={`flex items-center gap-3 p-3 rounded border cursor-pointer transition-all ${
                      checked
                        ? "bg-primary/8 border-primary/30"
                        : "bg-background border-border hover:border-primary/30"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleChecklist(item.id, item.defaultValue)}
                      className="accent-primary w-4 h-4"
                    />
                    <span className="flex-1 text-sm text-foreground/80 font-medium">{item.label}</span>
                    <span className="text-xs font-mono text-muted-foreground">
                      ~{fmt(item.defaultValue)} ₽
                    </span>
                  </label>
                );
              })}
              <p className="text-xs text-muted-foreground pt-1">
                Суммы примерные — вы можете скорректировать их в поле «Прочие расходы»
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Yield & Price */}
      <div className="bg-card border border-border rounded overflow-hidden">
        <div className="border-b border-border px-6 py-4 bg-primary/4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="Sprout" size={16} className="text-primary" />
              <h2 className="font-bold text-sm text-foreground uppercase tracking-wider">
                Урожайность и цена
              </h2>
            </div>
            <button
              onClick={() => setShowPrices(!showPrices)}
              className="flex items-center gap-1.5 text-xs bg-accent/15 text-accent border border-accent/30 rounded px-3 py-1.5 font-semibold hover:bg-accent/25 transition-colors"
            >
              <Icon name="Tag" size={13} className="text-accent" />
              Примерные цены
            </button>
          </div>
        </div>

        {/* Market prices panel */}
        {showPrices && (
          <div className="border-b border-border bg-secondary/20 px-6 py-4">
            <p className="text-xs text-muted-foreground mb-3 font-medium">
              Средние рыночные цены — нажмите на культуру, чтобы подставить данные:
            </p>
            <div className="grid grid-cols-1 gap-2">
              {MARKET_PRICES.map((mp) => (
                <button
                  key={mp.crop}
                  onClick={() => {
                    const avg = Math.round((mp.minPrice + mp.maxPrice) / 2);
                    setPrice(String(avg));
                    setYield(String(mp.avgYield));
                    setShowPrices(false);
                  }}
                  className="flex items-center justify-between px-4 py-2.5 rounded border border-border bg-card hover:border-primary/40 hover:bg-primary/5 transition-all text-left"
                >
                  <span className="text-sm font-semibold text-foreground">{mp.crop}</span>
                  <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                    <span>{mp.minPrice}–{mp.maxPrice} {mp.unit}</span>
                    <span className="text-foreground/50">ур. ~{fmt(mp.avgYield)} кг/га</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

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

      {/* Breakeven slider */}
      {calc.totalCosts > 0 && calc.totalProduction > 0 && (
        <div className="bg-card border border-border rounded overflow-hidden">
          <div className="border-b border-border px-6 py-4 bg-primary/4">
            <div className="flex items-center gap-2">
              <Icon name="SlidersHorizontal" size={16} className="text-primary" />
              <h2 className="font-bold text-sm text-foreground uppercase tracking-wider">
                Точка безубыточности — «на глаз»
              </h2>
            </div>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground font-medium">Цена продажи:</span>
              <span className="font-mono font-black text-lg text-foreground">
                {fmt(effectiveSliderPrice)} ₽/кг
              </span>
            </div>
            <input
              type="range"
              min={minSlider}
              max={maxSlider}
              step={0.5}
              value={effectiveSliderPrice}
              onChange={(e) => setSliderPrice(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
              <span>{minSlider} ₽</span>
              <span>{maxSlider} ₽</span>
            </div>
            <div
              className={`rounded p-4 text-center border transition-all ${
                sliderInProfit
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className={`text-xs font-semibold mb-1 ${sliderInProfit ? "text-green-700" : "text-red-600"}`}>
                {sliderInProfit ? "В плюсе" : "В минусе"}
              </div>
              <div className={`text-xl font-black font-mono ${sliderInProfit ? "text-green-700" : "text-red-600"}`}>
                {sliderInProfit ? "+" : ""}{fmt(sliderProfit)} ₽
              </div>
              {costPerUnit > 0 && (
                <div className="text-xs text-muted-foreground mt-2">
                  Себестоимость: {fmt(costPerUnit)} ₽/кг — минимальная цена для выхода в ноль
                </div>
              )}
            </div>
            {sliderPrice !== null && (
              <button
                onClick={() => { setPrice(String(effectiveSliderPrice)); setSliderPrice(null); }}
                className="w-full text-xs text-primary font-semibold border border-primary/30 rounded py-2 hover:bg-primary/5 transition-colors"
              >
                Применить эту цену ({fmt(effectiveSliderPrice)} ₽/кг) в расчёт
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tax */}
      <div className="bg-card border border-border rounded overflow-hidden">
        <div className="border-b border-border px-6 py-4 bg-primary/4">
          <div className="flex items-center gap-2">
            <Icon name="Landmark" size={16} className="text-primary" />
            <h2 className="font-bold text-sm text-foreground uppercase tracking-wider">
              Налогообложение
            </h2>
          </div>
        </div>
        <div className="px-6 py-5 space-y-3">
          <label className="block text-sm text-muted-foreground font-medium">
            Ставка налога на прибыль (%)
          </label>
          <div className="flex gap-2 flex-wrap">
            {[0, 6, 15, 20].map((rate) => (
              <button
                key={rate}
                onClick={() => setTaxRate(String(rate))}
                className={`px-4 py-2 rounded text-sm font-mono font-bold border transition-all ${
                  taxRate === String(rate)
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:border-primary/50"
                }`}
              >
                {rate}%
              </button>
            ))}
            <div className="relative flex-1 min-w-[100px]">
              <input
                type="number"
                min="0"
                max="100"
                placeholder="Свой %"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="w-full border border-input rounded px-3 py-2 text-right font-mono text-sm text-foreground bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs pointer-events-none font-mono">
                %
              </span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            УСН «Доходы» — 6%, УСН «Доходы минус расходы» — 15%, ОСНО — 20%
          </p>
        </div>
      </div>
    </div>
  );
}
