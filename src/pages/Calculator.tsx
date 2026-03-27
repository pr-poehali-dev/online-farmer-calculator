import { useState, useMemo } from "react";
import { DEFAULT_COSTS, parseNum, fmt } from "./calculator/types";
import CalculatorHeader from "./calculator/CalculatorHeader";
import CalculatorInputs from "./calculator/CalculatorInputs";
import CalculatorResults from "./calculator/CalculatorResults";

export default function Calculator() {
  const [area, setArea] = useState("");
  const [costs, setCosts] = useState(DEFAULT_COSTS);
  const [yield_, setYield] = useState("");
  const [price, setPrice] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);

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

  const downloadPDF = async () => {
    setPdfLoading(true);
    const { default: jsPDFModule } = await import("jspdf");
    const { default: autoTableModule } = await import("jspdf-autotable");

    const doc = new jsPDFModule();
    const date = new Date().toLocaleDateString("ru-RU");

    const fontUrl = "https://fonts.gstatic.com/s/roboto/v32/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2";
    const fontResp = await fetch(fontUrl);
    const fontBuffer = await fontResp.arrayBuffer();
    const fontBase64 = btoa(String.fromCharCode(...new Uint8Array(fontBuffer)));
    doc.addFileToVFS("Roboto-Regular.ttf", fontBase64);
    doc.addFont("Roboto-Regular.ttf", "Roboto", "normal");

    const fontBoldUrl = "https://fonts.gstatic.com/s/roboto/v32/KFOlCnqEu92Fr1MmWUlfBBc4AMP6lQ.woff2";
    const fontBoldResp = await fetch(fontBoldUrl);
    const fontBoldBuffer = await fontBoldResp.arrayBuffer();
    const fontBoldBase64 = btoa(String.fromCharCode(...new Uint8Array(fontBoldBuffer)));
    doc.addFileToVFS("Roboto-Bold.ttf", fontBoldBase64);
    doc.addFont("Roboto-Bold.ttf", "Roboto", "bold");

    doc.setFont("Roboto", "bold");
    doc.setFontSize(16);
    doc.text("Калькулятор рентабельности фермерского хозяйства", 14, 18);

    doc.setFont("Roboto", "normal");
    doc.setFontSize(10);
    doc.text(`Дата расчёта: ${date}`, 14, 27);
    doc.text(`Площадь поля: ${area} га   |   Урожайность: ${yield_} кг/га   |   Цена: ${price} руб/кг`, 14, 33);

    doc.setFontSize(13);
    doc.setFont("Roboto", "bold");
    doc.text("Основные показатели", 14, 45);

    autoTableModule(doc, {
      startY: 49,
      head: [["Показатель", "Значение"]],
      body: [
        ["Общие затраты", `${fmt(calc.totalCosts)} руб`],
        ["Объём производства", `${fmt(calc.totalProduction)} кг`],
        ["Выручка", `${fmt(calc.revenue)} руб`],
        ["Прибыль / Убыток", `${calc.profit >= 0 ? "+" : ""}${fmt(calc.profit)} руб`],
        ["Рентабельность", `${fmt(calc.margin)}%`],
        ["Себестоимость 1 кг", `${fmt(calc.costPerUnit)} руб`],
        ["Точка безубыточности", calc.breakeven > 0 ? `${fmt(calc.breakeven)} кг` : "—"],
        ["Прибыль на 1 га", calc.areaNum > 0 ? `${fmt(calc.profit / calc.areaNum)} руб` : "—"],
      ],
      styles: { fontSize: 10, font: "Roboto" },
      headStyles: { fillColor: [34, 197, 94], font: "Roboto", fontStyle: "bold" },
    });

    const afterMain = (doc as typeof doc & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;

    doc.setFontSize(13);
    doc.setFont("Roboto", "bold");
    doc.text("Структура затрат", 14, afterMain);

    const costRows = costs
      .filter((c) => parseNum(c.value) > 0)
      .map((c) => {
        const val = parseNum(c.value);
        const pct = calc.totalCosts > 0 ? ((val / calc.totalCosts) * 100).toFixed(1) : "0";
        return [c.label, `${fmt(val)} руб`, `${pct}%`];
      });

    autoTableModule(doc, {
      startY: afterMain + 4,
      head: [["Статья затрат", "Сумма", "Доля"]],
      body: costRows.length > 0 ? costRows : [["Затраты не указаны", "—", "—"]],
      styles: { fontSize: 10, font: "Roboto" },
      headStyles: { fillColor: [34, 197, 94], font: "Roboto", fontStyle: "bold" },
    });

    const afterCosts = (doc as typeof doc & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.setFont("Roboto", "bold");
    const verdict = calc.profit >= 0
      ? `Вывод: Проект прибыльный. Рентабельность ${fmt(calc.margin)}%.`
      : `Вывод: Проект убыточный. Затраты превышают выручку на ${fmt(Math.abs(calc.profit))} руб.`;
    doc.text(verdict, 14, afterCosts);

    doc.save(`ferma_raschet_${date.replace(/\./g, "-")}.pdf`);
    setPdfLoading(false);
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
            pdfLoading={pdfLoading}
            onDownloadPDF={downloadPDF}
          />
        </div>
      </div>
    </div>
  );
}
