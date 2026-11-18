import { Info, Layers, Menu } from 'lucide-react';
import { DEMO_DATE_LABEL } from '../data/mockWasteData';

interface TopHeaderProps {
  sectionTitle: string;
  onOpenMobileMenu: () => void;
  onOpenArchitecture: () => void;
}

export function TopHeader({
  sectionTitle,
  onOpenMobileMenu,
  onOpenArchitecture,
}: TopHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur-xs">
      <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Abrir menu de navegação"
            className="lg:hidden inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>

          <div className="min-w-0">
            <h1 className="font-display text-sm sm:text-lg font-bold tracking-tight text-[#0B2545] truncate">
              <span className="sm:hidden">Resíduos · Nova Esperança</span>
              <span className="hidden sm:inline">
                Gestão Inteligente de Resíduos em Nova Esperança
              </span>
            </h1>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-600">
              <span className="font-medium text-slate-800">{sectionTitle}</span>
              <span aria-hidden="true">·</span>
              <span className="hidden sm:inline">Município de Nova Esperança</span>
              <span className="sm:hidden">Nova Esperança</span>
              <span aria-hidden="true" className="hidden sm:inline">
                ·
              </span>
              <span className="hidden sm:inline tabular-nums">
                {DEMO_DATE_LABEL}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <div
            className="hidden md:flex items-center gap-1.5 rounded-md border border-sky-200 bg-sky-50 px-2.5 py-1.5 text-xs font-medium text-sky-900 whitespace-nowrap"
            title="Todos os dados, previsões e aprovações deste protótipo são simulados"
          >
            <Info className="h-3.5 w-3.5 text-sky-700 shrink-0" aria-hidden="true" />
            <span>Ambiente de demonstração</span>
          </div>

          <button
            type="button"
            onClick={onOpenArchitecture}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-[#0B2545] hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0 min-h-[40px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          >
            <Layers className="h-4 w-4 text-sky-700 shrink-0" aria-hidden="true" />
            <span className="hidden sm:inline">Fluxo do sistema (IoT → IA)</span>
            <span className="sm:hidden">Fluxo</span>
          </button>
        </div>
      </div>

      {/* Mobile demo indicator bar (single-line, well under 15% sticky height cap) */}
      <div className="md:hidden flex items-center justify-between gap-2 border-t border-slate-100 bg-sky-50/90 px-4 py-1 text-[11px] font-medium text-sky-900">
        <span className="truncate">Ambiente de demonstração (simulado)</span>
        <span className="tabular-nums shrink-0">18/11/2026 · 13:10</span>
      </div>
    </header>
  );
}
