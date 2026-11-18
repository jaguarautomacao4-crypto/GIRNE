import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  Eye,
  Filter,
} from 'lucide-react';
import type { AlertItem, AlertStatus, AlertType } from '../types/waste';
import { filterAlerts } from '../utils/wasteLogic';
import { PriorityLabel } from './StatusBadge';

interface AlertsViewProps {
  alerts: AlertItem[];
  onAcknowledgeAlert: (alertId: string) => void;
  onInspectContainer: (containerId: string) => void;
}

export function AlertsView({
  alerts,
  onAcknowledgeAlert,
  onInspectContainer,
}: AlertsViewProps) {
  const [priorityFilter, setPriorityFilter] = useState<
    'Todas' | 'Crítica' | 'Alta' | 'Média'
  >('Todas');
  const [typeFilter, setTypeFilter] = useState<'Todos' | AlertType>('Todos');
  const [statusFilter, setStatusFilter] = useState<'Todos' | AlertStatus>(
    'Todos'
  );

  const filtered = useMemo(
    () =>
      filterAlerts(alerts, {
        priority: priorityFilter,
        type: typeFilter,
        status: statusFilter,
      }),
    [alerts, priorityFilter, typeFilter, statusFilter]
  );

  const pendingCount = alerts.filter((a) => a.status === 'Pendente').length;
  const recognizedCount = alerts.filter((a) => a.status === 'Reconhecido').length;

  const resetFilters = () => {
    setPriorityFilter('Todas');
    setTypeFilter('Todos');
    setStatusFilter('Todos');
  };

  return (
    <div className="space-y-5">
      {/* Queue summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium text-slate-600">
            Alertas pendentes
          </p>
          <p className="mt-1 font-display text-2xl font-bold tabular-nums text-red-700">
            {pendingCount}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium text-slate-600">
            Reconhecidos pela equipe
          </p>
          <p className="mt-1 font-display text-2xl font-bold tabular-nums text-emerald-700">
            {recognizedCount}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-medium text-slate-600">
            Total na fila demonstrativa
          </p>
          <p className="mt-1 font-display text-2xl font-bold tabular-nums text-[#0B2545]">
            {alerts.length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <section
        aria-label="Filtros de alertas e anomalias"
        className="rounded-xl border border-slate-200 bg-white p-4"
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          <div>
            <label
              htmlFor="alert-priority-filter"
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Prioridade
            </label>
            <select
              id="alert-priority-filter"
              value={priorityFilter}
              onChange={(e) =>
                setPriorityFilter(
                  e.target.value as 'Todas' | 'Crítica' | 'Alta' | 'Média'
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20"
            >
              <option value="Todas">Todas as prioridades</option>
              <option value="Crítica">Crítica</option>
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="alert-type-filter"
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Tipo de ocorrência
            </label>
            <select
              id="alert-type-filter"
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value as 'Todos' | AlertType)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20"
            >
              <option value="Todos">Todos os tipos</option>
              <option value="Risco de transbordamento">
                Risco de transbordamento
              </option>
              <option value="Aumento incomum de temperatura">
                Aumento incomum de temperatura
              </option>
              <option value="Possível tombamento">Possível tombamento</option>
              <option value="Sensor sem variação">Sensor sem variação</option>
              <option value="Sem comunicação">Sem comunicação</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="alert-status-filter"
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Estado
            </label>
            <select
              id="alert-status-filter"
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as 'Todos' | AlertStatus)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20"
            >
              <option value="Todos">Todos os estados</option>
              <option value="Pendente">Pendente</option>
              <option value="Reconhecido">Reconhecido</option>
            </select>
          </div>
        </div>
      </section>

      {/* Alert Queue */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <Filter
            className="mx-auto h-7 w-7 text-slate-400"
            aria-hidden="true"
          />
          <p className="mt-3 text-sm font-semibold text-slate-900">
            Nenhum alerta encontrado para os filtros selecionados.
          </p>
          <p className="mt-1 text-xs text-slate-600">
            Tente ampliar os critérios de prioridade, tipo ou estado.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 inline-flex items-center rounded-lg bg-[#0B2545] px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
          >
            Limpar filtros
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((alert) => {
            const isAck = alert.status === 'Reconhecido';
            return (
              <article
                key={alert.id}
                className={`rounded-xl border p-4 sm:p-5 transition-colors ${
                  isAck
                    ? 'border-slate-200 bg-slate-50/70'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-mono font-semibold tabular-nums text-slate-600">
                        {alert.timestamp}
                      </span>
                      <span aria-hidden="true" className="text-slate-400">
                        ·
                      </span>
                      <span className="font-mono font-bold text-[#0B2545]">
                        {alert.containerId}
                      </span>
                      <span className="font-medium text-slate-700">
                        {alert.containerName} ({alert.neighborhood})
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display text-base font-bold text-slate-900 flex items-center gap-2">
                        <AlertTriangle
                          className={`h-4 w-4 shrink-0 ${
                            alert.priority === 'Crítica'
                              ? 'text-red-600'
                              : alert.priority === 'Alta'
                              ? 'text-amber-600'
                              : 'text-sky-700'
                          }`}
                          aria-hidden="true"
                        />
                        {alert.type}
                      </h3>
                      <PriorityLabel priority={alert.priority} />
                      {isAck ? (
                        <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
                          <CheckCircle2
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                          />
                          Reconhecido
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-900">
                          Pendente
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-slate-800 leading-relaxed">
                      {alert.description}
                    </p>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      <strong className="text-slate-800">
                        Explicação analítica:{' '}
                      </strong>
                      {alert.explanation}
                      {alert.confidencePct !== null && (
                        <span className="ml-2 font-mono tabular-nums text-slate-700">
                          (Confiança simulada: {alert.confidencePct}%)
                        </span>
                      )}
                    </p>

                    {isAck && alert.acknowledgedAt && (
                      <p className="text-xs text-emerald-800 font-medium">
                        Reconhecido às {alert.acknowledgedAt} por{' '}
                        {alert.acknowledgedBy}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onAcknowledgeAlert(alert.id)}
                      disabled={isAck}
                      aria-label={`Reconhecer alerta ${alert.id} de ${alert.containerId}`}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B2545] px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors min-h-[40px] whitespace-nowrap"
                    >
                      <Check className="h-4 w-4" aria-hidden="true" />
                      <span>{isAck ? 'Reconhecido' : 'Reconhecer'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onInspectContainer(alert.containerId)}
                      aria-label={`Ver contêiner ${alert.containerId}`}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-[#0B2545] hover:bg-slate-50 transition-colors min-h-[40px] whitespace-nowrap"
                    >
                      <Eye className="h-4 w-4" aria-hidden="true" />
                      <span>Ver contêiner</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
