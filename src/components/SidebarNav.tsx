import {
  AlertTriangle,
  BarChart3,
  Cpu,
  LayoutDashboard,
  MapPin,
  Recycle,
  Route as RouteIcon,
  X,
} from 'lucide-react';
import type { NavSection } from '../types/waste';

interface SidebarNavProps {
  activeSection: NavSection;
  onSelectSection: (section: NavSection) => void;
  pendingAlertsCount: number;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS: Array<{
  id: NavSection;
  label: string;
  icon: typeof LayoutDashboard;
}> = [
  { id: 'visao-geral', label: 'Visão geral', icon: LayoutDashboard },
  { id: 'mapa', label: 'Mapa de contêineres', icon: MapPin },
  { id: 'rotas', label: 'Rotas de coleta', icon: RouteIcon },
  { id: 'alertas', label: 'Alertas e anomalias', icon: AlertTriangle },
  { id: 'historico', label: 'Histórico e relatórios', icon: BarChart3 },
  { id: 'dispositivos', label: 'Dispositivos e sensores', icon: Cpu },
];

export function SidebarNav({
  activeSection,
  onSelectSection,
  pendingAlertsCount,
  mobileOpen,
  onCloseMobile,
}: SidebarNavProps) {
  const handleSelect = (section: NavSection) => {
    onSelectSection(section);
    onCloseMobile();
  };

  const navContent = (
    <div className="flex h-full flex-col bg-[#0B2545] text-slate-100">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <Recycle className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="font-display text-sm font-bold leading-tight text-white truncate">
              Nova Esperança
            </p>
            <p className="text-xs text-sky-200/80 truncate">
              Gestão de Resíduos
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Fechar menu de navegação"
          className="lg:hidden rounded-md p-2 text-slate-300 hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <nav
        aria-label="Navegação principal"
        className="flex-1 space-y-1 overflow-y-auto px-3 py-4"
      >
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              aria-current={isActive ? 'page' : undefined}
              className={`flex w-full items-center justify-between gap-3 rounded-lg px-3.5 py-2.5 text-left text-sm font-medium transition-colors min-h-[42px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-400 ${
                isActive
                  ? 'bg-sky-600 text-white'
                  : 'text-slate-200 hover:bg-white/10 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-3 min-w-0">
                <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{item.label}</span>
              </span>
              {item.id === 'alertas' && pendingAlertsCount > 0 && (
                <span
                  aria-label={`${pendingAlertsCount} alertas pendentes`}
                  className={`tabular-nums rounded px-1.5 py-0.5 text-xs font-semibold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-red-500/90 text-white'
                  }`}
                >
                  {pendingAlertsCount}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-4 text-xs text-slate-300 space-y-1.5">
        <p className="font-medium text-white">Ambiente de demonstração</p>
        <p className="leading-relaxed text-slate-300/90">
          Protótipo navegável com dados simulados. Sem conexão real com
          sensores LoRaWAN ou serviços externos.
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block lg:w-64 border-r border-slate-200">
        {navContent}
      </aside>

      {/* Mobile slide-over drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navegação"
        >
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={onCloseMobile}
            className="fixed inset-0 bg-slate-950/60"
          />
          <div className="relative z-10 w-72 max-w-[85vw] h-full shadow-xl">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
