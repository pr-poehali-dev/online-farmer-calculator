import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const features = [
  {
    icon: "Calculator",
    title: "Себестоимость",
    desc: "Учёт всех статей затрат: семена, удобрения, техника, труд и прочее",
  },
  {
    icon: "Sprout",
    title: "Урожайность",
    desc: "Расчёт объёма продукции с гектара и общего сбора по площади",
  },
  {
    icon: "TrendingUp",
    title: "Рентабельность",
    desc: "Прибыль, маржа и точка безубыточности вашего хозяйства",
  },
];

const steps = [
  { num: "01", text: "Укажите площадь поля и культуру" },
  { num: "02", text: "Введите затраты по каждой статье" },
  { num: "03", text: "Задайте урожайность и цену продажи" },
  { num: "04", text: "Получите полный финансовый расчёт" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-golos">
      {/* Header */}
      <header className="border-b border-border bg-primary">
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
            <span className="text-primary-foreground/60 text-sm font-medium">Главная</span>
            <Link
              to="/calculator"
              className="text-primary-foreground text-sm font-medium hover:text-accent transition-colors"
            >
              Калькулятор
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-primary text-primary-foreground py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/30 rounded px-3 py-1.5 mb-6">
              <Icon name="BarChart3" size={14} className="text-accent" />
              <span className="text-accent text-xs font-mono tracking-widest uppercase">
                Финансовый инструмент
              </span>
            </div>
            <h1 className="text-5xl font-black leading-tight mb-6 tracking-tight">
              Считайте<br />
              <span className="text-accent">прибыль</span> до<br />
              посева
            </h1>
            <p className="text-primary-foreground/70 text-lg leading-relaxed mb-10 max-w-lg">
              Профессиональный калькулятор для начинающих фермеров. 
              Точный расчёт затрат, урожайности и рентабельности 
              вашего хозяйства.
            </p>
            <Link
              to="/calculator"
              className="inline-flex items-center gap-3 bg-accent text-primary font-bold px-8 py-4 rounded text-base hover:bg-accent/90 transition-all hover:gap-4 group"
            >
              Открыть калькулятор
              <Icon name="ArrowRight" size={18} />
            </Link>
          </div>

          {/* Stats strip */}
          <div className="grid grid-cols-3 gap-px bg-white/10 rounded mt-16 overflow-hidden max-w-2xl">
            {[
              { val: "3 шага", label: "до результата" },
              { val: "100%", label: "бесплатно" },
              { val: "< 5 мин", label: "на расчёт" },
            ].map((s) => (
              <div key={s.val} className="bg-primary/80 px-6 py-5 text-center">
                <div className="text-2xl font-black text-accent font-mono">{s.val}</div>
                <div className="text-xs text-primary-foreground/50 mt-1 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-secondary/40">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
              Возможности
            </p>
            <h2 className="text-3xl font-black text-foreground tracking-tight">
              Что рассчитывает<br />калькулятор
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="bg-card border border-border p-8 rounded animate-slide-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-12 h-12 bg-primary/8 border border-primary/15 rounded flex items-center justify-center mb-6">
                  <Icon name={f.icon} fallback="Star" size={22} className="text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
              Процесс
            </p>
            <h2 className="text-3xl font-black text-foreground tracking-tight">
              Как это работает
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.num} className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-black text-accent/30 font-mono leading-none">{s.num}</span>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block flex-1 h-px bg-border mt-1" />
                  )}
                </div>
                <p className="text-foreground/80 text-sm leading-relaxed font-medium">{s.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 bg-primary rounded p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-primary-foreground font-black text-2xl mb-2">
                Готовы начать расчёт?
              </h3>
              <p className="text-primary-foreground/60 text-sm">
                Бесплатно. Без регистрации. Результат — мгновенно.
              </p>
            </div>
            <Link
              to="/calculator"
              className="whitespace-nowrap inline-flex items-center gap-2 bg-accent text-primary font-bold px-7 py-3.5 rounded hover:bg-accent/90 transition-all"
            >
              <Icon name="Calculator" size={16} />
              Начать расчёт
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon name="Wheat" size={16} className="text-muted-foreground" />
            <span className="text-muted-foreground text-sm font-medium">АгроРасчёт</span>
          </div>
          <p className="text-muted-foreground text-xs">
            Инструмент для начинающих фермеров
          </p>
        </div>
      </footer>
    </div>
  );
}