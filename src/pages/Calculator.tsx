import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

interface CostItem {
  id: string;
  label: string;
  value: string;
}

const DEFAULT_COSTS: CostItem[] = [
  { id: "seeds", label: "Семена и посадочный материал", value: "" },
  { id: "fertilizers", label: "Удобрения", value: "" },
  { id: "pesticides", label: "Средства защиты растений", value: "" },
  { id: "fuel", label: "Топливо и ГСМ", value: "" },
  { id: "labor", label: "Оплата труда", value: "" },
  { id: "rent", label: "Аренда земли", value: "" },
  { id: "equipment", label: "Амортизация техники", value: "" },
  { id: "other", label: "Прочие расходы", value: "" },
];

function fmt(n: number) {
  return n.toLocaleString("ru-RU", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
}

function parseNum(s: string) {
  return parseFloat(s.replace(",", ".")) || 0;
}

export default function Calculator() {
  const [area, setArea] = useState("");
  const [costs, setCosts] = useState<CostItem[]>(DEFAULT_COSTS);
  const [yield_, setYield] = useState("");
  const [price, setPrice] = useState("");

  const updateCost = (id: string, val: string) => {
    setCosts((prev) => prev.map((c) => (c.id === id ? { ...c, value: val } : c)));
  };

  const calc = useMemo(() => {
    const areaNum = parseNum(area);
    const totalCosts = costs.reduce((acc, c) => acc + parseNum(c.value), 0);
    const yieldNum = parseNum(yield_);
    const priceNum = parseNum(price);

    const totalProduction = areaNum * yieldNum;
    const revenue = totalProduction * priceNum;
    const profit = revenue - totalCosts;
    const costPerUnit = totalProduction > 0 ? totalCosts / totalProduction : 0;
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0;
    const breakeven = priceNum > costPerUnit ? totalCosts / (priceNum - costPerUnit) : 0;

    return { totalCosts, totalProduction, revenue, profit, costPerUnit, margin, breakeven, areaNum };
  }, [area, costs, yield_, price]);

  const hasData = calc.totalCosts > 0 || calc.totalProduction > 0;

  return (
    <div className="min-h-screen bg-background font-golos">
      {/* Header */}
      <header className="border-b border-border bg-primary sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent rounded flex items-center justify-center">
              <Icon name="Wheat" size={18} className="text-primary" />
            </div>
            <span className="text-primary-foreground font-bold text-lg tracking-wide">
              АгроРасчёт
            </span>
          </div>
          <nav className="flex items-center gap-8">
            <Link
              to="/"
              className="text-primary-foreground/60 text-sm font-medium hover:text-primary-foreground transition-colors"
            >
              Главная
            </Link>
            <span className="text-primary-foreground text-sm font-medium">Калькулятор</span>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Page title */}
        <div className="mb-8 animate-fade-in">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
            Финансовый калькулятор
          </p>
          <h1 className="text-3xl font-black text-foreground tracking-tight">
            Расчёт затрат и рентабельности
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: Input */}
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

          {/* Right: Results */}
          <div className="space-y-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            {!hasData ? (
              <div className="bg-card border border-dashed border-border rounded p-12 flex flex-col items-center justify-center text-center gap-4">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
                  <Icon name="BarChart3" size={28} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="text-foreground font-bold mb-1">Результаты появятся здесь</p>
                  <p className="text-muted-foreground text-sm">
                    Заполните данные слева — расчёт выполнится автоматически
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Main metrics */}
                <div className="bg-primary rounded overflow-hidden">
                  <div className="px-6 py-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Icon name="TrendingUp" size={16} className="text-accent" />
                      <h2 className="font-bold text-sm text-primary-foreground/80 uppercase tracking-wider">
                        Итоговые показатели
                      </h2>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-px bg-white/10">
                    {[
                      { label: "Общие затраты", value: `${fmt(calc.totalCosts)} ₽`, sub: "все расходы" },
                      { label: "Выручка", value: `${fmt(calc.revenue)} ₽`, sub: "объём × цена" },
                      {
                        label: "Прибыль",
                        value: `${calc.profit >= 0 ? "+" : ""}${fmt(calc.profit)} ₽`,
                        sub: calc.profit >= 0 ? "доход" : "убыток",
                        highlight: true,
                        positive: calc.profit >= 0,
                      },
                      { label: "Рентабельность", value: `${fmt(calc.margin)}%`, sub: "маржа" },
                    ].map((m) => (
                      <div key={m.label} className="bg-primary px-6 py-5">
                        <div className="text-primary-foreground/50 text-xs uppercase tracking-wider font-mono mb-1">
                          {m.label}
                        </div>
                        <div
                          className={`text-2xl font-black font-mono ${
                            m.highlight
                              ? m.positive
                                ? "text-green-400"
                                : "text-destructive-foreground"
                              : "text-accent"
                          }`}
                        >
                          {m.value}
                        </div>
                        <div className="text-primary-foreground/40 text-xs mt-0.5">{m.sub}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Detailed */}
                <div className="bg-card border border-border rounded overflow-hidden">
                  <div className="border-b border-border px-6 py-4 bg-primary/4">
                    <div className="flex items-center gap-2">
                      <Icon name="FileText" size={16} className="text-primary" />
                      <h2 className="font-bold text-sm text-foreground uppercase tracking-wider">
                        Детальный анализ
                      </h2>
                    </div>
                  </div>
                  <div className="divide-y divide-border">
                    {[
                      {
                        label: "Объём продукции",
                        value: `${fmt(calc.totalProduction)} кг`,
                        icon: "Package",
                      },
                      {
                        label: "Себестоимость 1 кг",
                        value: `${fmt(calc.costPerUnit)} ₽`,
                        icon: "Tag",
                      },
                      {
                        label: "Точка безубыточности",
                        value: calc.breakeven > 0 ? `${fmt(calc.breakeven)} кг` : "—",
                        icon: "Target",
                      },
                      {
                        label: "Прибыль с 1 га",
                        value:
                          calc.areaNum > 0
                            ? `${fmt(calc.profit / calc.areaNum)} ₽`
                            : "—",
                        icon: "Layers",
                      },
                    ].map((r) => (
                      <div key={r.label} className="px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon name={r.icon} fallback="Circle" size={15} className="text-muted-foreground" />
                          <span className="text-sm text-foreground/80 font-medium">{r.label}</span>
                        </div>
                        <span className="font-mono font-bold text-foreground text-sm">{r.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cost breakdown */}
                <div className="bg-card border border-border rounded overflow-hidden">
                  <div className="border-b border-border px-6 py-4 bg-primary/4">
                    <div className="flex items-center gap-2">
                      <Icon name="PieChart" size={16} className="text-primary" />
                      <h2 className="font-bold text-sm text-foreground uppercase tracking-wider">
                        Структура затрат
                      </h2>
                    </div>
                  </div>
                  <div className="px-6 py-4 space-y-3">
                    {costs
                      .filter((c) => parseNum(c.value) > 0)
                      .sort((a, b) => parseNum(b.value) - parseNum(a.value))
                      .map((c) => {
                        const val = parseNum(c.value);
                        const pct = calc.totalCosts > 0 ? (val / calc.totalCosts) * 100 : 0;
                        return (
                          <div key={c.id}>
                            <div className="flex justify-between text-xs mb-1">
                              <span className="text-foreground/70 font-medium">{c.label}</span>
                              <span className="font-mono text-foreground font-bold">
                                {fmt(pct)}%
                              </span>
                            </div>
                            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    {costs.every((c) => parseNum(c.value) === 0) && (
                      <p className="text-muted-foreground text-sm text-center py-2">
                        Введите затраты для отображения структуры
                      </p>
                    )}
                  </div>
                </div>

                {/* Verdict */}
                <div
                  className={`rounded p-6 border ${
                    calc.profit >= 0
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon
                      name={calc.profit >= 0 ? "CheckCircle" : "AlertCircle"}
                      size={20}
                      className={calc.profit >= 0 ? "text-green-600 mt-0.5" : "text-red-500 mt-0.5"}
                    />
                    <div>
                      <p
                        className={`font-bold text-sm mb-1 ${
                          calc.profit >= 0 ? "text-green-800" : "text-red-700"
                        }`}
                      >
                        {calc.profit >= 0 ? "Проект прибыльный" : "Проект убыточный"}
                      </p>
                      <p
                        className={`text-xs leading-relaxed ${
                          calc.profit >= 0 ? "text-green-700" : "text-red-600"
                        }`}
                      >
                        {calc.profit >= 0
                          ? `Рентабельность составляет ${fmt(calc.margin)}%. При объёме ${fmt(calc.totalProduction)} кг вы получите прибыль ${fmt(calc.profit)} ₽.`
                          : `Затраты превышают выручку на ${fmt(Math.abs(calc.profit))} ₽. Снизьте расходы или увеличьте цену реализации.`}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
