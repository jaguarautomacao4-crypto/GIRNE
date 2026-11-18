import { useMemo, useState } from 'react';
import {
  AlertCircle,
  Battery,
  Compass,
  DoorOpen,
  Search,
  Thermometer,
  Wifi,
} from 'lucide-react';
import type { AlertItem, Container, NavSection, WasteType } from '../types/waste';
import {
  getContainerVisualCategory,
  type ContainerVisualCategory,
} from '../utils/wasteLogic';
import { NovaEsperancaMap } from './NovaEsperancaMap';
import {
  ContainerStatusLabel,
  PriorityLabel,
  QualityLabel,
} from './StatusBadge';

interface ContainersMapViewProps {
  containers: Container[];
  alerts: AlertItem[];
  selectedContainerId: string;
  onSelectContainer: (containerId: string) => void;
  onNavigate: (section: NavSection) => void;
}

export function ContainersMapView({
  containers,
  alerts,
  selectedContainerId,
  onSelectContainer,
  onNavigate,
}: ContainersMapViewProps) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<
    'Todos' | ContainerVisualCategory
  >('Todos');
  const [wasteFilter, setWasteFilter] = useState<'Todos' | WasteType>('Todos');

  const filteredContainers = useMemo(() => {
    const q = search.trim().toLowerCase();
    return containers.filter((c) => {
      if (
        categoryFilter !== 'Todos' &&
        getContainerVisualCategory(c) !== categoryFilter
      ) {
        return false;
      }
      if (wasteFilter !== 'Todos' && c.wasteType !== wasteFilter) {
        return false;
      }
      if (q.length > 0) {
        const hay = `${c.id} ${c.name} ${c.location} ${c.neighborhood}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [containers, categoryFilter, wasteFilter, search]);

  const activeContainer =
    containers.find((c) => c.id === selectedContainerId) ??
    filteredContainers[0] ??
    containers[0];

  const linkedAlerts = alerts.filter(
    (a) => a.containerId === activeContainer?.id
  );

  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <section
        aria-label="Filtros do mapa de contêineres"
        className="rounded-xl border border-slate-200 bg-white p-4"
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          <div className="md:col-span-5">
            <label
              htmlFor="container-search"
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Buscar por código, ponto ou bairro
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                aria-hidden="true"
              />
              <input
                id="container-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ex.: NE-00102, Mercado, Centro..."
                className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20"
              />
            </div>
          </div>

          <div className="md:col-span-4">
            <label
              htmlFor="category-filter"
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Condição operacional
            </label>
            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(
                  e.target.value as 'Todos' | ContainerVisualCategory
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20"
            >
              <option value="Todos">Todas as condições ({containers.length})</option>
              <option value="nivel_critico">Nível crítico / incidente</option>
              <option value="atencao">Atenção (70%–84%)</option>
              <option value="possivel_falha">Sensor com possível falha</option>
              <option value="sem_comunicacao">Sem comunicação</option>
              <option value="normal">Operação normal</option>
            </select>
          </div>

          <div className="md:col-span-3">
            <label
              htmlFor="waste-filter"
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Tipo de resíduo
            </label>
            <select
              id="waste-filter"
              value={wasteFilter}
              onChange={(e) =>
                setWasteFilter(e.target.value as 'Todos' | WasteType)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20"
            >
              <option value="Todos">Todos os tipos</option>
              <option value="Orgânico">Orgânico</option>
              <option value="Reciclável">Reciclável</option>
              <option value="Misto">Misto</option>
              <option value="Vidro">Vidro</option>
            </select>
          </div>
        </div>
      </section>

      {/* Main Split: Map + List on left, Detail on right */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-7 space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <NovaEsperancaMap
              containers={filteredContainers}
              selectedContainerId={activeContainer?.id ?? null}
              onSelectContainer={onSelectContainer}
            />
          </div>

          {/* Synchronized container list */}
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-display text-sm font-bold text-[#0B2545]">
                Contêineres filtrados ({filteredContainers.length})
              </h2>
              {(search ||
                categoryFilter !== 'Todos' ||
                wasteFilter !== 'Todos') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    setCategoryFilter('Todos');
                    setWasteFilter('Todos');
                  }}
                  className="text-xs font-semibold text-sky-700 hover:text-sky-900"
                >
                  Limpar filtros
                </button>
              )}
            </div>

            {filteredContainers.length === 0 ? (
              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                <p className="text-sm font-medium text-slate-800">
                  Nenhum contêiner corresponde aos filtros aplicados.
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  Ajuste a condição operacional ou limpe o termo de busca.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {filteredContainers.map((c) => {
                  const cat = getContainerVisualCategory(c);
                  const isSelected = c.id === activeContainer?.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => onSelectContainer(c.id)}
                      className={`text-left rounded-lg border p-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 ${
                        isSelected
                          ? 'border-[#0B2545] bg-sky-50/70'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-xs font-semibold text-[#0B2545]">
                          {c.id}
                        </span>
                        <ContainerStatusLabel category={cat} />
                      </div>
                      <p className="mt-1 text-sm font-semibold text-slate-900 truncate">
                        {c.name}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-600">
                        {c.neighborhood} · {c.wasteType} ·{' '}
                        <span className="font-mono tabular-nums font-semibold text-slate-900">
                          {c.levelPct}%
                        </span>
                      </p>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Container Detail Panel */}
        {activeContainer && (
          <aside
            aria-label={`Detalhes do contêiner ${activeContainer.id}`}
            className="xl:col-span-5 rounded-xl border border-slate-200 bg-white p-5 space-y-5 self-start"
          >
            <div className="border-b border-slate-200 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-sm font-bold text-[#0B2545]">
                  {activeContainer.id}
                </span>
                <ContainerStatusLabel
                  category={getContainerVisualCategory(activeContainer)}
                />
              </div>
              <h2 className="mt-1.5 font-display text-lg font-bold text-slate-900">
                {activeContainer.name}
              </h2>
              <p className="mt-1 text-xs text-slate-600">
                {activeContainer.location} · {activeContainer.neighborhood} ·
                Capacidade{' '}
                <span className="tabular-nums font-medium">
                  {activeContainer.capacityLiters} L
                </span>{' '}
                · Resíduo {activeContainer.wasteType}
              </p>
            </div>

            {/* Key sensor readings grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-[11px] font-medium text-slate-600">
                  Nível estimado
                </p>
                <p className="mt-1 font-display text-xl font-bold tabular-nums text-[#0B2545]">
                  {activeContainer.levelPct}%
                </p>
                <p className="text-[11px] text-slate-500 tabular-nums">
                  Previsto: {activeContainer.predictedLevelPct}%
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="flex items-center gap-1 text-[11px] font-medium text-slate-600">
                  <Thermometer className="h-3.5 w-3.5" aria-hidden="true" />
                  Temperatura
                </p>
                <p
                  className={`mt-1 font-display text-xl font-bold tabular-nums ${
                    activeContainer.temperatureC >= 40
                      ? 'text-red-700'
                      : 'text-[#0B2545]'
                  }`}
                >
                  {activeContainer.temperatureC} °C
                </p>
                <p className="text-[11px] text-slate-500">Leitura validada</p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="flex items-center gap-1 text-[11px] font-medium text-slate-600">
                  <Compass className="h-3.5 w-3.5" aria-hidden="true" />
                  Inclinação
                </p>
                <p
                  className={`mt-1 font-display text-xl font-bold tabular-nums ${
                    activeContainer.tiltDeg >= 25
                      ? 'text-red-700'
                      : 'text-[#0B2545]'
                  }`}
                >
                  {activeContainer.tiltDeg}°
                </p>
                <p className="text-[11px] text-slate-500">
                  {activeContainer.tiltDeg >= 25
                    ? 'Acima do limite (25°)'
                    : 'Posição vertical normal'}
                </p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="flex items-center gap-1 text-[11px] font-medium text-slate-600">
                  <DoorOpen className="h-3.5 w-3.5" aria-hidden="true" />
                  Estado da tampa
                </p>
                <p className="mt-1 text-sm font-bold text-slate-900">
                  {activeContainer.lidOpen ? 'Aberta' : 'Fechada'}
                </p>
                <p className="text-[11px] text-slate-500">Sensor magnético</p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="flex items-center gap-1 text-[11px] font-medium text-slate-600">
                  <Battery className="h-3.5 w-3.5" aria-hidden="true" />
                  Bateria
                </p>
                <p
                  className={`mt-1 font-display text-xl font-bold tabular-nums ${
                    activeContainer.batteryPct < 20
                      ? 'text-amber-700'
                      : 'text-[#0B2545]'
                  }`}
                >
                  {activeContainer.batteryPct}%
                </p>
                <p className="text-[11px] text-slate-500">Nó IoT alimentado</p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="flex items-center gap-1 text-[11px] font-medium text-slate-600">
                  <Wifi className="h-3.5 w-3.5" aria-hidden="true" />
                  Conectividade
                </p>
                <p className="mt-1 text-sm font-bold text-slate-900">
                  {activeContainer.connectivity}
                </p>
                <p className="text-[11px] text-slate-500 tabular-nums">
                  Última: {activeContainer.lastReadingAt}
                </p>
              </div>
            </div>

            {/* Priority & Explainable AI Decision Support */}
            <div className="rounded-lg border border-slate-200 bg-sky-50/60 p-4 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <PriorityLabel priority={activeContainer.priority} />
                <span className="text-xs font-medium text-slate-600 tabular-nums">
                  Confiança estimada do modelo: {activeContainer.aiConfidencePct}%
                </span>
              </div>
              <p className="text-xs font-semibold text-[#0B2545]">
                Explicação da prioridade (apoio à decisão humana)
              </p>
              <p className="text-xs text-slate-700 leading-relaxed">
                {activeContainer.priorityReason}
              </p>
              <p className="text-xs text-slate-600">
                Criticidade do local: {activeContainer.localCriticality} · Janela
                estimada: {activeContainer.predictedOverflowWindow}
              </p>
            </div>

            {/* Data Quality Transparency */}
            <div className="rounded-lg border border-slate-200 p-4 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-semibold text-[#0B2545]">
                  Qualidade e integridade dos dados
                </p>
                <QualityLabel condition={activeContainer.qualityCondition} />
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {activeContainer.qualityDetail}
              </p>
              <p className="text-[11px] font-mono text-slate-500">
                Gateway associado: {activeContainer.gatewayId}
              </p>
            </div>

            {/* Recent Readings History Table */}
            <div>
              <h3 className="font-display text-sm font-bold text-[#0B2545] mb-2">
                Histórico recente de leituras (simulado)
              </h3>
              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                    <tr>
                      <th className="px-3 py-2 font-semibold">Horário</th>
                      <th className="px-3 py-2 font-semibold text-right">
                        Nível
                      </th>
                      <th className="px-3 py-2 font-semibold text-right">
                        Temp.
                      </th>
                      <th className="px-3 py-2 font-semibold">Observação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeContainer.recentReadings.map((reading) => (
                      <tr key={reading.time} className="hover:bg-slate-50/70">
                        <td className="px-3 py-2 font-mono tabular-nums text-slate-800">
                          {reading.time}
                        </td>
                        <td className="px-3 py-2 font-mono tabular-nums text-right text-slate-900 font-medium">
                          {reading.levelPct !== null
                            ? `${reading.levelPct}%`
                            : '—'}
                        </td>
                        <td className="px-3 py-2 font-mono tabular-nums text-right text-slate-700">
                          {reading.temperatureC !== null
                            ? `${reading.temperatureC} °C`
                            : '—'}
                        </td>
                        <td className="px-3 py-2 text-slate-600">
                          {reading.note ?? 'Leitura periódica'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Linked alerts action */}
            {linkedAlerts.length > 0 && (
              <div className="flex items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50/70 px-3.5 py-2.5">
                <div className="flex items-center gap-2 text-xs text-amber-900">
                  <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>
                    {linkedAlerts.length} ocorrência(s) vinculada(s) a este
                    contêiner
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('alertas')}
                  className="text-xs font-semibold text-[#0B2545] underline hover:text-sky-800 whitespace-nowrap"
                >
                  Ver em Alertas
                </button>
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}
