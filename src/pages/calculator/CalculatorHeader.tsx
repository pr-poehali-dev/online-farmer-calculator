import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

export default function CalculatorHeader() {
  return (
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
  );
}
