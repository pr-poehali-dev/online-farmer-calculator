import { useState, useMemo } from "react";
import { DEFAULT_COSTS, parseNum, fmt } from "./calculator/types";
import CalculatorHeader from "./calculator/CalculatorHeader";
import CalculatorInputs from "./calculator/CalculatorInputs";
import CalculatorResults from "./calculator/CalculatorResults";
import type { CostItem, CalcResult } from "./calculator/types";

function printPDF(area: string, yield_: string, price: string, costs: CostItem[], calc: CalcResult) {
  const date = new Date().toLocaleDateString("ru-RU");
  const costRows = costs
    .filter((c) => parseNum(c.value) > 0)
    .sort((a, b) => parseNum(b.value) - parseNum(a.value))
    .map((c) => {
      const val = parseNum(c.value);
      const pct = calc.totalCosts > 0 ? ((val / calc.totalCosts) * 100).toFixed(1) : "0";
      return `<tr><td>${c.label}</td><td>${fmt(val)} руб</td><td>${pct}%</td></tr>`;
    }).join("");

  const verdict = calc.profit >= 0
    ? `Проект прибыльный. Рентабельность ${fmt(calc.margin)}%. При объёме ${fmt(calc.totalProduction)} кг прибыль составит ${fmt(calc.profit)} руб.`
    : `Проект убыточный. Затраты превышают выручку на ${fmt(Math.abs(calc.profit))} руб. Снизьте расходы или увеличьте цену реализации.`;

  const html = `
    <!DOCTYPE html>
    <html lang="ru">
    <head>
      <meta charset="UTF-8"/>
      <title>Расчёт рентабельности — ${date}</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 13px; color: #111; margin: 32px; }
        h1 { font-size: 18px; margin-bottom: 4px; }
        .meta { color: #555; font-size: 12px; margin-bottom: 24px; }
        h2 { font-size: 14px; margin: 20px 0 8px; border-bottom: 2px solid #2d6a2d; padding-bottom: 4px; color: #2d6a2d; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
        th { background: #2d6a2d; color: #fff; padding: 7px 10px; text-align: left; font-size: 12px; }
        td { padding: 6px 10px; border-bottom: 1px solid #e0e0e0; }
        tr:nth-child(even) td { background: #f5f9f5; }
        .verdict { padding: 12px 16px; border-radius: 6px; margin-top: 16px; font-size: 13px; }
        .profit { background: #f0fdf0; border: 1px solid #86efac; color: #166534; }
        .loss { background: #fff1f1; border: 1px solid #fca5a5; color: #991b1b; }
        @media print { body { margin: 16px; } }
      </style>
    </head>
    <body>
      <h1>Калькулятор рентабельности фермерского хозяйства</h1>
      <p class="meta">Дата расчёта: ${date} &nbsp;|&nbsp; Площадь: ${area} га &nbsp;|&nbsp; Урожайность: ${yield_} кг/га &nbsp;|&nbsp; Цена: ${price} руб/кг</p>

      <h2>Основные показатели</h2>
      <table>
        <thead><tr><th>Показатель</th><th>Значение</th></tr></thead>
        <tbody>
          <tr><td>Общие затраты</td><td>${fmt(calc.totalCosts)} руб</td></tr>
          <tr><td>Объём производства</td><td>${fmt(calc.totalProduction)} кг</td></tr>
          <tr><td>Выручка</td><td>${fmt(calc.revenue)} руб</td></tr>
          <tr><td>Прибыль / Убыток</td><td>${calc.profit >= 0 ? "+" : ""}${fmt(calc.profit)} руб</td></tr>
          <tr><td>Рентабельность</td><td>${fmt(calc.margin)}%</td></tr>
          <tr><td>Себестоимость 1 кг</td><td>${fmt(calc.costPerUnit)} руб</td></tr>
          <tr><td>Точка безубыточности</td><td>${calc.breakeven > 0 ? fmt(calc.breakeven) + " кг" : "—"}</td></tr>
          <tr><td>Прибыль на 1 га</td><td>${calc.areaNum > 0 ? fmt(calc.profit / calc.areaNum) + " руб" : "—"}</td></tr>
        </tbody>
      </table>

      <h2>Структура затрат</h2>
      <table>
        <thead><tr><th>Статья затрат</th><th>Сумма</th><th>Доля</th></tr></thead>
        <tbody>${costRows || "<tr><td colspan='3'>Затраты не указаны</td></tr>"}</tbody>
      </table>

      <div class="verdict ${calc.profit >= 0 ? "profit" : "loss"}">
        <strong>Вывод:</strong> ${verdict}
      </div>
    </body>
    </html>
  `;

  const win = window.open("", "_blank");
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); }, 300);
}

export default function Calculator() {
  const [area, setArea] = useState("");
  const [costs, setCosts] = useState(DEFAULT_COSTS);
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

  const downloadPDF = () => {
    printPDF(area, yield_, price, costs, calc);
  };

  return (
    <div className="min-h-screen bg-background font-golos">
      <CalculatorHeader />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8 animate-fade-in">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">
            Финансовый калькулятор
          </p>
          <h1 className="text-3xl font-black text-foreground tracking-tight">
            Расчёт затрат и рентабельности
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <CalculatorInputs
            area={area}
            setArea={setArea}
            costs={costs}
            updateCost={updateCost}
            yield_={yield_}
            setYield={setYield}
            price={price}
            setPrice={setPrice}
            calc={calc}
          />
          <CalculatorResults
            calc={calc}
            costs={costs}
            area={area}
            yield_={yield_}
            price={price}
            pdfLoading={false}
            onDownloadPDF={downloadPDF}
          />
        </div>
      </div>
    </div>
  );
}