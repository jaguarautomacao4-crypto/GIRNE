import { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Info,
  RefreshCw,
  ShieldCheck,
  Truck,
  UserCheck,
} from 'lucide-react';
import type { CollectionRoute, Container } from '../types/waste';
import { NovaEsperancaMap } from './NovaEsperancaMap';
import { PriorityLabel } from './StatusBadge';

interface RoutesViewProps {
  routes: CollectionRoute[];
  containers: Container[];
  onRecalculateRoute: (routeId: string) => void;
  onApproveRoute: (routeId: string) => void;
  onInspectContainer: (containerId: string) => void;
}

export function RoutesView({
  routes,
  containers,
  onRecalculateRoute,
  onApproveRoute,
  onInspectContainer,
}: RoutesViewProps) {
  const [selectedRouteId, setSelectedRouteId] = useState<string>(
    routes.find((r) => r.status === 'Planejada')?.id ?? routes[0]?.id ?? ''
  );
  const [simulationFeedback, setSimulationFeedback] = useState<string | null>(
    null
  );

  const selectedRoute =
    routes.find((r) => r.id === selectedRouteId) ?? routes[0];

  const handleRecalculate = (route: CollectionRoute) => {
    onRecalculateRoute(route.id);
    setSimulationFeedback(
      `Rota ${route.code} recalculada em modo de simulação: paradas reordenadas por nível previsto, criticidade local e anomalias ativas.`
    );
  };

  const handleApprove = (route: CollectionRoute) => {
    onApproveRoute(route.id);
    setSimulationFeedback(
      `Aprovação registrada para ${route.code} (${route.vehicle}). Atenção: esta aprovação é uma simulação demonstrativa e não envia comando real para veículo ou equipe em campo.`
    );
  };

  return (
    <div className="space-y-5">
      {/* Human-in-the-loop principle banner */}
      <div className="rounded-xl border border-sky-200 bg-sky-50/80 px-4 py-3 flex items-start gap-3">
        <UserCheck
          className="mt-0.5 h-5 w-5 text-sky-800 shrink-0"
          aria-hidden="true"
        />
        <div className="text-xs text-slate-800 leading-relaxed">
          <p className="font-semibold text-[#0B2545]">
            Supervisão humana obrigatória no planejamento de coleta
          </p>
          <p className="mt-0.5">
            As rotas sugeridas consideram nível previsto, risco de
            transbordamento, criticidade do local e anomalias. Nenhuma rota é
            despachada automaticamente sem revisão e aprovação humana.
          </p>
        </div>
      </div>

      {simulationFeedback && (
        <div
          role="status"
          className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 flex items-start justify-between gap-3 text-xs text-emerald-950"
        >
          <div className="flex items-start gap-2.5">
            <Info className="mt-0.5 h-4 w-4 text-emerald-700 shrink-0" aria-hidden="true" />
            <p className="leading-relaxed font-medium">{simulationFeedback}</p>
          </div>
          <button
            type="button"
            onClick={() => setSimulationFeedback(null)}
            className="text-xs font-semibold text-emerald-800 underline shrink-0"
          >
            Ocultar
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        {/* Route List */}
        <section
          aria-label="Lista de rotas de coleta"
          className="xl:col-span-5 space-y-3"
        >
          <h2 className="font-display text-base font-bold text-[#0B2545]">
            Rotas do dia ({routes.length})
          </h2>

          <div className="space-y-3">
            {routes.map((route) => {
              const isSelected = route.id === selectedRoute?.id;
              const statusColors =
                route.status === 'Concluída'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                  : route.status === 'Aprovada (Simulação)'
                  ? 'border-emerald-300 bg-emerald-50 text-emerald-900'
                  : route.status === 'Em andamento'
                  ? 'border-sky-200 bg-sky-50 text-sky-800'
                  : 'border-amber-200 bg-amber-50 text-amber-800';

              return (
                <button
                  key={route.id}
                  type="button"
                  onClick={() => setSelectedRouteId(route.id)}
                  aria-pressed={isSelected}
                  className={`w-full text-left rounded-xl border p-4 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${
                    isSelected
                      ? 'border-[#0B2545] bg-white ring-2 ring-[#0B2545]/15'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-[#0B2545]">
                      {route.code} · {route.zone}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap ${statusColors}`}
                    >
                      {route.status}
                    </span>
                  </div>

                  <p className="mt-1.5 font-display text-sm font-bold text-slate-900">
                    {route.name}
                  </p>

                  <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      <Truck className="h-3.5 w-3.5" aria-hidden="true" />
                      {route.vehicle}
                    </span>
                    <span>Motorista: {route.driver}</span>
                  </div>

                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full rounded-full ${
                          route.status === 'Concluída'
                            ? 'bg-emerald-600'
                            : 'bg-sky-600'
                        }`}
                        style={{ width: `${route.progressPct}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono tabular-nums text-slate-700">
                      {route.stops.length} paradas · {route.progressPct}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Selected Route Details */}
        {selectedRoute && (
          <section
            aria-label={`Detalhes da rota ${selectedRoute.code}`}
            className="xl:col-span-7 rounded-xl border border-slate-200 bg-white p-5 space-y-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <p className="font-mono text-xs font-semibold text-sky-800">
                  {selectedRoute.code} · {selectedRoute.plate}
                </p>
                <h2 className="mt-0.5 font-display text-lg font-bold text-[#0B2545]">
                  {selectedRoute.name}
                </h2>
                <p className="mt-1 text-xs text-slate-600">
                  {selectedRoute.vehicle} · Motorista: {selectedRoute.driver} ·
                  Distância estimada{' '}
                  <span className="tabular-nums font-medium">
                    {selectedRoute.distanceKm} km
                  </span>{' '}
                  · Duração estimada{' '}
                  <span className="tabular-nums font-medium">
                    {selectedRoute.estimatedDurationMin} min
                  </span>
                </p>
                {selectedRoute.lastRecalculatedAt && (
                  <p className="mt-1 text-xs font-medium text-sky-800">
                    Último recálculo simulado: {selectedRoute.lastRecalculatedAt}
                  </p>
                )}
                {selectedRoute.approvalNote && (
                  <p className="mt-1 text-xs font-medium text-emerald-800">
                    {selectedRoute.approvalNote}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleRecalculate(selectedRoute)}
                  disabled={selectedRoute.status === 'Concluída'}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-[#0B2545] hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[40px] whitespace-nowrap"
                >
                  <RefreshCw className="h-4 w-4" aria-hidden="true" />
                  <span>Recalcular rota</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleApprove(selectedRoute)}
                  disabled={
                    selectedRoute.status === 'Concluída' ||
                    selectedRoute.status === 'Aprovada (Simulação)'
                  }
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 disabled:bg-slate-300 disabled:text-slate-600 disabled:cursor-not-allowed transition-colors min-h-[40px] whitespace-nowrap"
                >
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  <span>
                    {selectedRoute.status === 'Aprovada (Simulação)'
                      ? 'Rota aprovada (Simulação)'
                      : 'Aprovar rota'}
                  </span>
                </button>
              </div>
            </div>

            {/* Route preview on Nova Esperança illustrative map */}
            <NovaEsperancaMap
              containers={containers}
              onSelectContainer={onInspectContainer}
              highlightedRoute={selectedRoute}
              compact
            />

            {/* Ordered stops */}
            <div>
              <h3 className="font-display text-sm font-bold text-[#0B2545] mb-3">
                Sequência de paradas e justificativa de inclusão
              </h3>

              <ol className="space-y-3">
                {selectedRoute.stops.map((stop) => (
                  <li
                    key={`${selectedRoute.id}-${stop.containerId}`}
                    className={`rounded-lg border p-3.5 ${
                      stop.completed
                        ? 'border-emerald-200 bg-emerald-50/40'
                        : 'border-slate-200 bg-slate-50/60'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex items-start gap-3">
                        <span
                          className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md font-mono text-xs font-bold ${
                            stop.completed
                              ? 'bg-emerald-700 text-white'
                              : 'bg-[#0B2545] text-white'
                          }`}
                        >
                          {stop.order}
                        </span>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-semibold text-[#0B2545]">
                              {stop.containerId}
                            </span>
                            <span className="text-sm font-bold text-slate-900">
                              {stop.containerName}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-slate-600">
                            {stop.location} · {stop.neighborhood} ·{' '}
                            {stop.wasteType}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <PriorityLabel priority={stop.priority} />
                        {stop.completed ? (
                          <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
                            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                            Coletada
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-0.5 text-xs font-medium text-slate-700">
                            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                            Pendente
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-2.5 flex flex-wrap items-center justify-between gap-3 pl-10">
                      <p className="text-xs text-slate-700 leading-relaxed flex-1 min-w-[200px]">
                        <span className="font-semibold text-slate-900">
                          Justificativa:{' '}
                        </span>
                        {stop.justification}
                      </p>

                      <div className="flex items-center gap-3 shrink-0">
                        <span className="font-mono text-xs tabular-nums text-slate-800">
                          Nível{' '}
                          <strong className="text-[#0B2545]">
                            {stop.currentLevelPct}%
                          </strong>{' '}
                          (prev. {stop.predictedLevelPct}%)
                        </span>
                        <button
                          type="button"
                          onClick={() => onInspectContainer(stop.containerId)}
                          className="text-xs font-semibold text-sky-700 hover:text-sky-900 underline whitespace-nowrap"
                        >
                          Ver contêiner
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
