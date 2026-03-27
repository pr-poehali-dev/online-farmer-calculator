import Icon from "@/components/ui/icon";
import { CostItem, CalcResult, fmt, parseNum } from "./types";

interface Props {
  calc: CalcResult;
  costs: CostItem[];
  area: string;
  yield_: string;
  price: string;
  pdfLoading: boolean;
  onDownloadPDF: () => void;
}

export default function CalculatorResults({
  calc, costs, area, yield_, price, pdfLoading, onDownloadPDF,
}: Props) {
  const hasData = calc.totalCosts > 0 || calc.totalProduction > 0;

  if (!hasData) {
    return (
      <div className="space-y-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
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
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up" style={{ animationDelay: "0.1s" }}>
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
            { label: "Объём продукции", value: `${fmt(calc.totalProduction)} кг`, icon: "Package" },
            { label: "Себестоимость 1 кг", value: `${fmt(calc.costPerUnit)} ₽`, icon: "Tag" },
            {
              label: "Точка безубыточности",
              value: calc.breakeven > 0 ? `${fmt(calc.breakeven)} кг` : "—",
              icon: "Target",
            },
            {
              label: "Прибыль с 1 га",
              value: calc.areaNum > 0 ? `${fmt(calc.profit / calc.areaNum)} ₽` : "—",
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
                    <span className="font-mono text-foreground font-bold">{fmt(pct)}%</span>
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
          calc.profit >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
        }`}
      >
        <div className="flex items-start gap-3">
          <Icon
            name={calc.profit >= 0 ? "CheckCircle" : "AlertCircle"}
            size={20}
            className={calc.profit >= 0 ? "text-green-600 mt-0.5" : "text-red-500 mt-0.5"}
          />
          <div>
            <p className={`font-bold text-sm mb-1 ${calc.profit >= 0 ? "text-green-800" : "text-red-700"}`}>
              {calc.profit >= 0 ? "Проект прибыльный" : "Проект убыточный"}
            </p>
            <p className={`text-xs leading-relaxed ${calc.profit >= 0 ? "text-green-700" : "text-red-600"}`}>
              {calc.profit >= 0
                ? `Рентабельность составляет ${fmt(calc.margin)}%. При объёме ${fmt(calc.totalProduction)} кг вы получите прибыль ${fmt(calc.profit)} ₽.`
                : `Затраты превышают выручку на ${fmt(Math.abs(calc.profit))} ₽. Снизьте расходы или увеличьте цену реализации.`}
            </p>
          </div>
        </div>
      </div>

      {/* PDF button */}
      <button
        onClick={onDownloadPDF}
        disabled={pdfLoading}
        className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded bg-primary text-primary-foreground text-sm font-bold hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <Icon name={pdfLoading ? "Loader" : "Download"} size={16} className={pdfLoading ? "animate-spin" : ""} />
        {pdfLoading ? "Формирую PDF..." : "Скачать PDF с результатами"}
      </button>
    </div>
  );
}
