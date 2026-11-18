import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Container as ContainerIcon,
  Truck,
  WifiOff,
} from 'lucide-react';
import { LEVEL_EVOLUTION_SERIES } from '../data/mockWasteData';
import type {
  AlertItem,
  CollectionRoute,
  Container,
  DeviceSensor,
  NavSection,
} from '../types/waste';
import {
  computeOverviewKPIs,
  getContainerVisualCategory,
} from '../utils/wasteLogic';
import { NovaEsperancaMap } from './NovaEsperancaMap';
import { ContainerStatusLabel } from './StatusBadge';

interface OverviewViewProps {
  containers: Container[];
  routes: CollectionRoute[];
  alerts: AlertItem[];
  devices: DeviceSensor[];
  selectedContainerId: string | null;
  onInspectContainer: (containerId: string) => void;
  onNavigate: (section: NavSection) => void;
}

export function OverviewView({
  containers,
  routes,
  alerts,
  devices,
  selectedContainerId,
  onInspectContainer,
  onNavigate,
}: OverviewViewProps) {
  const kpis = computeOverviewKPIs(containers, routes, alerts, devices);

  const recommendedContainers = [...containers]
    .filter(
      (c) =>
        c.priority === 'Crítica' ||
        c.priority === 'Alta' ||
        c.sensorStatus === 'Possível falha'
    )
    .sort((a, b) => {
      const rank = { Crítica: 0, Alta: 1, Média: 2, Baixa: 3 };
      return rank[a.priority] - rank[b.priority] || b.predictedLevelPct - a.predictedLevelPct;
    })
    .slice(0, 5);

  const activeRouteForMap =
    routes.find((r) => r.status === 'Em andamento') ?? routes[0] ?? null;

  // Group alerts by category for chart
  const alertCategoryCounts = [
    {
      label: 'Transbordamento',
      count: alerts.filter((a) => a.type === 'Risco de transbordamento').length,
      color: '#DC2626',
    },
    {
      label: 'Temperatura',
      count: alerts.filter((a) => a.type === 'Aumento incomum de temperatura')
        .length,
      color: '#EA580C',
    },
    {
      label: 'Tombamento',
      count: alerts.filter((a) => a.type === 'Possível tombamento').length,
      color: '#D97706',
    },
    {
      label: 'Sensor sem variação',
      count: alerts.filter((a) => a.type === 'Sensor sem variação').length,
      color: '#7C3AED',
    },
    {
      label: 'Sem comunicação',
      count: alerts.filter((a) => a.type === 'Sem comunicação').length,
      color: '#475569',
    },
  ];
  const maxCategoryCount = Math.max(
    1,
    ...alertCategoryCounts.map((item) => item.count)
  );

  // SVG coordinates for Level Evolution Chart
  const chartW = 520;
  const chartH = 190;
  const padL = 36;
  const padR = 16;
  const padT = 18;
  const padB = 28;
  const innerW = chartW - padL - padR;
  const innerH = chartH - padT - padB;

  const xForIdx = (i: number) =>
    padL + (i / (LEVEL_EVOLUTION_SERIES.length - 1)) * innerW;
  const yForPct = (pct: number) => padT + innerH - (pct / 100) * innerH;

  const observedPoints = LEVEL_EVOLUTION_SERIES.slice(0, 5)
    .map((pt, i) => `${xForIdx(i)},${yForPct(pt.observedAvgPct)}`)
    .join(' ');

  const predictedPoints = LEVEL_EVOLUTION_SERIES.map((pt, i) =>
    pt.predictedAvgPct !== null ? `${xForIdx(i)},${yForPct(pt.predictedAvgPct)}` : null
  )
    .filter((v): v is string => v !== null)
    .join(' ');

  return (
    <div className="space-y-6">
      {/* KPI Strip */}
      <section aria-label="Indicadores principais simulados">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-slate-600">
                Contêineres monitorados
              </p>
              <ContainerIcon
                className="h-4 w-4 text-[#0B2545]"
                aria-hidden="true"
              />
            </div>
            <p className="mt-2 font-display text-3xl font-bold tabular-nums text-[#0B2545]">
              {kpis.totalContainers}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Rede simulada · 7 bairros de Nova Esperança
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-slate-600">
                Contêineres em nível crítico
              </p>
              <AlertTriangle
                className="h-4 w-4 text-red-600"
                aria-hidden="true"
              />
            </div>
            <p className="mt-2 font-display text-3xl font-bold tabular-nums text-red-700">
              {kpis.criticalContainers}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {kpis.pendingAlerts} alertas pendentes de reconhecimento
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-slate-600">
                Coletas planejadas para hoje
              </p>
              <Truck className="h-4 w-4 text-sky-700" aria-hidden="true" />
            </div>
            <p className="mt-2 font-display text-3xl font-bold tabular-nums text-sky-800">
              {kpis.plannedCollectionsToday}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Paradas pendentes em {routes.filter((r) => r.status !== 'Concluída').length} rotas ativas/planejadas
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-slate-600">
                Dispositivos sem comunicação
              </p>
              <WifiOff className="h-4 w-4 text-slate-600" aria-hidden="true" />
            </div>
            <p className="mt-2 font-display text-3xl font-bold tabular-nums text-slate-900">
              {kpis.offlineDevices}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Separados de falhas internas e nível crítico
            </p>
          </div>
        </div>
      </section>

      {/* Main Map + Recommended Action split */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <section className="xl:col-span-7 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-base font-bold text-[#0B2545]">
                Mapa demonstrativo de Nova Esperança
              </h2>
              <p className="text-xs text-slate-600">
                Clique em qualquer marcador para abrir os detalhes do contêiner.
                Traçado azul indica a rota {activeRouteForMap?.code ?? 'em curso'}.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('mapa')}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#0B2545] hover:bg-slate-50 transition-colors whitespace-nowrap"
            >
              <span>Abrir mapa completo</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </div>

          <NovaEsperancaMap
            containers={containers}
            selectedContainerId={selectedContainerId}
            onSelectContainer={onInspectContainer}
            highlightedRoute={activeRouteForMap}
            compact
          />
        </section>

        {/* Recommended Action */}
        <section className="xl:col-span-5 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 flex flex-col">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-base font-bold text-[#0B2545]">
                Ação recomendada (apoio à decisão)
              </h2>
              <p className="text-xs text-slate-600">
                Priorização sugerida por nível previsto, criticidade local e anomalias.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('alertas')}
              className="text-xs font-semibold text-sky-700 hover:text-sky-900 whitespace-nowrap"
            >
              Ver fila ({kpis.pendingAlerts})
            </button>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {recommendedContainers.map((container) => {
              const cat = getContainerVisualCategory(container);
              return (
                <div
                  key={container.id}
                  className="py-3 first:pt-1 last:pb-1 flex flex-col gap-2"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-[#0B2545]">
                          {container.id}
                        </span>
                        <span className="text-sm font-semibold text-slate-900 truncate">
                          {container.name}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-600">
                        {container.neighborhood} · Leitura às{' '}
                        <span className="tabular-nums font-medium">
                          {container.lastReadingAt}
                        </span>{' '}
                        · Nível atual{' '}
                        <span className="tabular-nums font-semibold text-slate-900">
                          {container.levelPct}%
                        </span>{' '}
                        (prev.{' '}
                        <span className="tabular-nums">
                          {container.predictedLevelPct}%
                        </span>
                        )
                      </p>
                    </div>
                    <ContainerStatusLabel category={cat} />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs text-slate-700 leading-relaxed flex-1 min-w-[200px]">
                      {container.priorityReason}
                    </p>
                    <button
                      type="button"
                      onClick={() => onInspectContainer(container.id)}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-[#0B2545] hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0"
                    >
                      <span>Inspecionar</span>
                      <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* Routes Summary + Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Routes Summary */}
        <section className="lg:col-span-5 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-base font-bold text-[#0B2545]">
                Resumo das rotas e veículos
              </h2>
              <p className="text-xs text-slate-600">
                Estado operacional simulado da frota municipal.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('rotas')}
              className="text-xs font-semibold text-sky-700 hover:text-sky-900 whitespace-nowrap"
            >
              Gerenciar rotas
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {routes.map((route) => {
              const statusStyle =
                route.status === 'Concluída'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : route.status === 'Em andamento'
                  ? 'border-sky-200 bg-sky-50 text-sky-800'
                  : route.status === 'Aprovada (Simulação)'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                  : 'border-amber-200 bg-amber-50 text-amber-800';
              return (
                <div key={route.id} className="py-3 first:pt-1 last:pb-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        <span className="font-mono text-xs text-slate-600 mr-1.5">
                          {route.code}
                        </span>
                        {route.vehicle}
                      </p>
                      <p className="text-xs text-slate-600">
                        {route.driver} · {route.stops.length} paradas ·{' '}
                        <span className="tabular-nums">{route.distanceKm} km</span>
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap ${statusStyle}`}
                    >
                      {route.status === 'Concluída' ||
                      route.status === 'Aprovada (Simulação)' ? (
                        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                      ) : null}
                      {route.status}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div
                      className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100"
                      role="progressbar"
                      aria-valuenow={route.progressPct}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Progresso da rota ${route.code}`}
                    >
                      <div
                        className={`h-full rounded-full transition-all ${
                          route.status === 'Concluída'
                            ? 'bg-emerald-600'
                            : 'bg-sky-600'
                        }`}
                        style={{ width: `${route.progressPct}%` }}
                      />
                    </div>
                    <span className="w-10 text-right font-mono text-xs tabular-nums text-slate-700">
                      {route.progressPct}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Chart 1: Level Evolution */}
        <section className="lg:col-span-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="mb-2">
            <h2 className="font-display text-base font-bold text-[#0B2545]">
              Evolução do nível médio (%)
            </h2>
            <p className="text-xs text-slate-600">
              Série simulada (observado vs. tendência prevista até 17h).
            </p>
          </div>

          <svg
            viewBox={`0 0 ${chartW} ${chartH}`}
            className="w-full h-44"
            role="img"
            aria-label="Gráfico simulado de evolução do nível médio dos contêineres"
          >
            {[0, 25, 50, 75, 100].map((tick) => {
              const y = yForPct(tick);
              return (
                <g key={tick}>
                  <line
                    x1={padL}
                    y1={y}
                    x2={chartW - padR}
                    y2={y}
                    stroke={tick === 75 ? '#FCA5A5' : '#E2E8F0'}
                    strokeDasharray={tick === 75 ? '4 4' : undefined}
                    strokeWidth="1"
                  />
                  <text
                    x={padL - 6}
                    y={y + 4}
                    textAnchor="end"
                    fill="#64748B"
                    fontSize="10"
                    className="tabular-nums"
                  >
                    {tick}%
                  </text>
                </g>
              );
            })}

            {/* Predicted dashed line */}
            <polyline
              points={predictedPoints}
              fill="none"
              stroke="#0284C7"
              strokeWidth="2.5"
              strokeDasharray="6 4"
            />
            {/* Observed solid line */}
            <polyline
              points={observedPoints}
              fill="none"
              stroke="#0B2545"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {LEVEL_EVOLUTION_SERIES.map((pt, i) => {
              const x = xForIdx(i);
              const yObs = i <= 4 ? yForPct(pt.observedAvgPct) : null;
              const yPred =
                pt.predictedAvgPct !== null ? yForPct(pt.predictedAvgPct) : null;
              return (
                <g key={pt.hour}>
                  {yObs !== null && (
                    <circle cx={x} cy={yObs} r="3.5" fill="#0B2545" />
                  )}
                  {yPred !== null && (
                    <circle
                      cx={x}
                      cy={yPred}
                      r="3.5"
                      fill="#FFFFFF"
                      stroke="#0284C7"
                      strokeWidth="2"
                    />
                  )}
                  <text
                    x={x}
                    y={chartH - 8}
                    textAnchor="middle"
                    fill="#475569"
                    fontSize="10"
                  >
                    {pt.hour}
                  </text>
                </g>
              );
            })}
          </svg>

          <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-0.5 w-4 bg-[#0B2545]" aria-hidden="true" />
              Média observada (simulada)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span
                className="h-0.5 w-4 border-t-2 border-dashed border-sky-600"
                aria-hidden="true"
              />
              Projeção IA (simulada)
            </span>
          </div>
        </section>

        {/* Chart 2: Alerts by category */}
        <section className="lg:col-span-3 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="mb-3">
            <h2 className="font-display text-base font-bold text-[#0B2545]">
              Alertas por categoria
            </h2>
            <p className="text-xs text-slate-600">
              Distribuição simulada das ocorrências ativas e reconhecidas.
            </p>
          </div>

          <div className="space-y-3">
            {alertCategoryCounts.map((item) => {
              const widthPct = Math.round((item.count / maxCategoryCount) * 100);
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700">
                      {item.label}
                    </span>
                    <span className="font-mono font-semibold tabular-nums text-slate-900">
                      {item.count}
                    </span>
                  </div>
                  <div className="h-2.5 w-full overflow-hidden rounded-md bg-slate-100">
                    <div
                      className="h-full rounded-md"
                      style={{
                        width: `${Math.max(widthPct, item.count > 0 ? 12 : 0)}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs text-slate-600">
            <span className="font-mono tabular-nums font-medium text-slate-800">
              {alerts.length} alertas ({kpis.pendingAlerts} pendentes)
            </span>
            <button
              type="button"
              onClick={() => onNavigate('alertas')}
              className="font-semibold text-sky-700 hover:text-sky-900 whitespace-nowrap"
            >
              Abrir fila
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
