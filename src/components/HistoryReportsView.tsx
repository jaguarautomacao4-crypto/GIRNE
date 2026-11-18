import { useMemo, useState } from 'react';
import { Calendar, FileSpreadsheet, Search } from 'lucide-react';
import type {
  HistoryEvent,
  HistoryPeriod,
  OccurrenceType,
} from '../types/waste';
import { filterHistoryEvents } from '../utils/wasteLogic';
import { QualityLabel } from './StatusBadge';

interface HistoryReportsViewProps {
  events: HistoryEvent[];
  onInspectContainer: (containerId: string) => void;
}

const SIMULATED_DAILY_COLLECTIONS = [
  { day: 'Seg', completed: 14, alerts: 3 },
  { day: 'Ter', completed: 16, alerts: 4 },
  { day: 'Qua', completed: 13, alerts: 2 },
  { day: 'Qui', completed: 18, alerts: 5 },
  { day: 'Sex', completed: 19, alerts: 4 },
  { day: 'Sáb', completed: 15, alerts: 3 },
  { day: 'Hoje*', completed: 9, alerts: 5 },
];

export function HistoryReportsView({
  events,
  onInspectContainer,
}: HistoryReportsViewProps) {
  const [period, setPeriod] = useState<HistoryPeriod>('30d');
  const [typeFilter, setTypeFilter] = useState<'Todos' | OccurrenceType>(
    'Todos'
  );
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      filterHistoryEvents(events, {
        period,
        type: typeFilter,
        search,
      }),
    [events, period, typeFilter, search]
  );

  const collectionsCount = filtered.filter(
    (e) => e.type === 'Coleta realizada'
  ).length;
  const alertsCount = filtered.filter(
    (e) => e.type === 'Alerta gerado' || e.type === 'Anomalia de sensor'
  ).length;
  const commCount = filtered.filter(
    (e) => e.type === 'Falha de comunicação'
  ).length;

  const maxBar = Math.max(
    1,
    ...SIMULATED_DAILY_COLLECTIONS.map((d) => d.completed)
  );

  return (
    <div className="space-y-5">
      {/* Explicit disclaimer */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3 text-xs text-amber-950">
        <strong>Indicadores e séries históricas simuladas:</strong> os gráficos
        e métricas abaixo servem apenas para demonstrar como a equipe municipal
        acompanharia coletas, ocorrências e qualidade da rede ao longo do tempo.
        Não representam resultados reais de implantação nem economia apurada.
      </div>

      {/* Filters */}
      <section
        aria-label="Filtros de histórico e relatórios"
        className="rounded-xl border border-slate-200 bg-white p-4"
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          <div className="md:col-span-4">
            <span className="block text-xs font-medium text-slate-700 mb-1">
              Período (simulado)
            </span>
            <div className="inline-flex w-full rounded-lg border border-slate-200 bg-slate-100 p-1">
              {(
                [
                  { id: 'hoje', label: 'Hoje' },
                  { id: '7d', label: '7 dias' },
                  { id: '30d', label: '30 dias' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setPeriod(opt.id)}
                  className={`flex-1 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                    period === opt.id
                      ? 'bg-white text-[#0B2545] shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-4">
            <label
              htmlFor="history-type-filter"
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Tipo de ocorrência
            </label>
            <select
              id="history-type-filter"
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value as 'Todos' | OccurrenceType)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20"
            >
              <option value="Todos">Todas as ocorrências</option>
              <option value="Coleta realizada">Coleta realizada</option>
              <option value="Alerta gerado">Alerta gerado</option>
              <option value="Anomalia de sensor">Anomalia de sensor</option>
              <option value="Aprovação de rota">Aprovação de rota</option>
              <option value="Falha de comunicação">Falha de comunicação</option>
            </select>
          </div>

          <div className="md:col-span-4">
            <label
              htmlFor="history-search"
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Buscar registro
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                aria-hidden="true"
              />
              <input
                id="history-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ex.: NE-00101, RT-02, buffer..."
                className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Summary metrics + Simulated bar chart */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="lg:col-span-5 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-1">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-slate-600">
              Coletas registradas no filtro (simulado)
            </p>
            <p className="mt-1 font-display text-2xl font-bold tabular-nums text-emerald-700">
              {collectionsCount}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-slate-600">
              Alertas e anomalias no filtro (simulado)
            </p>
            <p className="mt-1 font-display text-2xl font-bold tabular-nums text-amber-700">
              {alertsCount}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-xs font-medium text-slate-600">
              Eventos de rede/qualidade no filtro (simulado)
            </p>
            <p className="mt-1 font-display text-2xl font-bold tabular-nums text-[#0B2545]">
              {commCount}
            </p>
          </div>
        </div>

        <section className="lg:col-span-7 rounded-xl border border-slate-200 bg-white p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-base font-bold text-[#0B2545]">
                Coletas e alertas diários (série simulada · 7 dias)
              </h2>
              <p className="text-xs text-slate-600">
                Valores ilustrativos para demonstração de acompanhamento
                operacional.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              *Hoje até 13:10
            </span>
          </div>

          <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-40 pt-4">
            {SIMULATED_DAILY_COLLECTIONS.map((item) => {
              const colH = Math.round((item.completed / maxBar) * 100);
              const altH = Math.round((item.alerts / maxBar) * 100);
              return (
                <div
                  key={item.day}
                  className="flex flex-col items-center gap-1.5 h-full justify-end"
                >
                  <div className="flex items-end gap-1 h-28 w-full justify-center">
                    <div
                      title={`${item.completed} coletas simuladas`}
                      className="w-3 sm:w-4 rounded-t-sm bg-sky-600"
                      style={{ height: `${Math.max(colH, 10)}%` }}
                    />
                    <div
                      title={`${item.alerts} alertas simulados`}
                      className="w-3 sm:w-4 rounded-t-sm bg-amber-500"
                      style={{ height: `${Math.max(altH, 8)}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-medium text-slate-700">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-5 border-t border-slate-100 pt-3 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-xs bg-sky-600" aria-hidden="true" />
              Coletas simuladas
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-xs bg-amber-500" aria-hidden="true" />
              Alertas simulados
            </span>
          </div>
        </section>
      </div>

      {/* Events Table */}
      <section className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-5 py-3.5">
          <h2 className="font-display text-sm font-bold text-[#0B2545] flex items-center gap-2">
            <FileSpreadsheet className="h-4 w-4 text-sky-700" aria-hidden="true" />
            Registro de eventos ({filtered.length})
          </h2>
          {(period !== '30d' || typeFilter !== 'Todos' || search) && (
            <button
              type="button"
              onClick={() => {
                setPeriod('30d');
                setTypeFilter('Todos');
                setSearch('');
              }}
              className="text-xs font-semibold text-sky-700 hover:text-sky-900"
            >
              Redefinir filtros
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm font-semibold text-slate-800">
              Nenhuma ocorrência encontrada para esse período e filtro.
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Amplie o período para 7 ou 30 dias ou limpe o campo de busca.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Data / Hora
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Tipo
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Referência
                  </th>
                  <th className="px-4 py-3 font-semibold">Descrição</th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Qualidade do dado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((event) => (
                  <tr key={event.id} className="hover:bg-slate-50/70">
                    <td className="px-4 py-3 font-mono tabular-nums text-slate-700 whitespace-nowrap">
                      {event.timestampDisplay}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900 whitespace-nowrap">
                      {event.type}
                    </td>
                    <td className="px-4 py-3 font-mono whitespace-nowrap">
                      {event.containerId ? (
                        <button
                          type="button"
                          onClick={() => onInspectContainer(event.containerId!)}
                          className="font-semibold text-sky-700 hover:text-sky-900 underline"
                        >
                          {event.containerId}
                        </button>
                      ) : (
                        <span className="text-slate-600">
                          {event.routeCode ?? 'Sistema'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      <p className="font-semibold text-slate-900">
                        {event.summary}
                      </p>
                      <p className="mt-0.5 text-slate-600">{event.detail}</p>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {event.qualityCondition ? (
                        <QualityLabel condition={event.qualityCondition} />
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
