import { useMemo, useState } from 'react';
import {
  BatteryLow,
  CheckCircle2,
  Cpu,
  Lock,
  Radio,
  Search,
  Server,
  WifiOff,
} from 'lucide-react';
import type {
  DataQualityCondition,
  DeviceSensor,
  DeviceState,
} from '../types/waste';
import { filterDevices } from '../utils/wasteLogic';
import { QualityLabel } from './StatusBadge';

interface DevicesSensorsViewProps {
  devices: DeviceSensor[];
  onInspectContainer: (containerId: string) => void;
}

export function DevicesSensorsView({
  devices,
  onInspectContainer,
}: DevicesSensorsViewProps) {
  const [stateFilter, setStateFilter] = useState<'Todos' | DeviceState>('Todos');
  const [qualityFilter, setQualityFilter] = useState<
    'Todas' | DataQualityCondition
  >('Todas');
  const [search, setSearch] = useState('');

  const filtered = useMemo(
    () =>
      filterDevices(devices, {
        state: stateFilter,
        quality: qualityFilter,
        search,
      }),
    [devices, stateFilter, qualityFilter, search]
  );

  const activeCount = devices.filter((d) => d.state === 'Ativo').length;
  const lowBatteryCount = devices.filter(
    (d) => d.state === 'Bateria baixa'
  ).length;
  const offlineCount = devices.filter(
    (d) => d.state === 'Sem comunicação'
  ).length;

  return (
    <div className="space-y-5">
      {/* Device State Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-600">
              Dispositivos ativos
            </p>
            <CheckCircle2
              className="h-4 w-4 text-emerald-700"
              aria-hidden="true"
            />
          </div>
          <p className="mt-1 font-display text-2xl font-bold tabular-nums text-emerald-700">
            {activeCount}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-600">Bateria baixa</p>
            <BatteryLow
              className="h-4 w-4 text-amber-600"
              aria-hidden="true"
            />
          </div>
          <p className="mt-1 font-display text-2xl font-bold tabular-nums text-amber-700">
            {lowBatteryCount}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-slate-600">
              Sem comunicação
            </p>
            <WifiOff className="h-4 w-4 text-slate-700" aria-hidden="true" />
          </div>
          <p className="mt-1 font-display text-2xl font-bold tabular-nums text-slate-900">
            {offlineCount}
          </p>
        </div>
      </div>

      {/* Filters */}
      <section
        aria-label="Filtros de dispositivos e sensores"
        className="rounded-xl border border-slate-200 bg-white p-4"
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
          <div className="md:col-span-5">
            <label
              htmlFor="device-search"
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Buscar dispositivo, contêiner ou gateway
            </label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400"
                aria-hidden="true"
              />
              <input
                id="device-search"
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ex.: DEV-LORA-106, NE-00105, GW-NE..."
                className="w-full rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20"
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <label
              htmlFor="device-state-filter"
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Estado do dispositivo
            </label>
            <select
              id="device-state-filter"
              value={stateFilter}
              onChange={(e) =>
                setStateFilter(e.target.value as 'Todos' | DeviceState)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20"
            >
              <option value="Todos">Todos os estados</option>
              <option value="Ativo">Ativo</option>
              <option value="Bateria baixa">Bateria baixa</option>
              <option value="Sem comunicação">Sem comunicação</option>
            </select>
          </div>

          <div className="md:col-span-4">
            <label
              htmlFor="device-quality-filter"
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Condição de qualidade dos dados
            </label>
            <select
              id="device-quality-filter"
              value={qualityFilter}
              onChange={(e) =>
                setQualityFilter(
                  e.target.value as 'Todas' | DataQualityCondition
                )
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20"
            >
              <option value="Todas">Todas as condições</option>
              <option value="Íntegro">Íntegro</option>
              <option value="Atraso">Atraso (buffer de borda)</option>
              <option value="Duplicidade">Duplicidade tratada</option>
              <option value="Lacuna">Lacuna de transmissão</option>
              <option value="Fora da faixa">Fora da faixa (outlier)</option>
            </select>
          </div>
        </div>
      </section>

      {/* Devices Table */}
      <section className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="flex items-center justify-between gap-2 border-b border-slate-200 px-5 py-3.5">
          <h2 className="font-display text-sm font-bold text-[#0B2545] flex items-center gap-2">
            <Cpu className="h-4 w-4 text-sky-700" aria-hidden="true" />
            Inventário simulado de dispositivos ({filtered.length})
          </h2>
          {(stateFilter !== 'Todos' || qualityFilter !== 'Todas' || search) && (
            <button
              type="button"
              onClick={() => {
                setStateFilter('Todos');
                setQualityFilter('Todas');
                setSearch('');
              }}
              className="text-xs font-semibold text-sky-700 hover:text-sky-900"
            >
              Limpar filtros
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm font-semibold text-slate-800">
              Nenhum dispositivo corresponde aos filtros aplicados.
            </p>
            <p className="mt-1 text-xs text-slate-600">
              Limpe os filtros para visualizar todos os nós IoT simulados.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Dispositivo
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Contêiner
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Conectividade / Rede
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Estado
                  </th>
                  <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">
                    Bateria
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Firmware
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Qualidade do dado
                  </th>
                  <th className="px-4 py-3 font-semibold whitespace-nowrap">
                    Última comunicação
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((dev) => {
                  const stateStyle =
                    dev.state === 'Ativo'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                      : dev.state === 'Bateria baixa'
                      ? 'border-amber-200 bg-amber-50 text-amber-800'
                      : 'border-slate-300 bg-slate-100 text-slate-800';

                  return (
                    <tr key={dev.deviceId} className="hover:bg-slate-50/70">
                      <td className="px-4 py-3 font-mono font-semibold text-[#0B2545] whitespace-nowrap">
                        {dev.deviceId}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onInspectContainer(dev.containerId)}
                          className="font-mono font-semibold text-sky-700 hover:text-sky-900 underline"
                        >
                          {dev.containerId}
                        </button>
                        <p className="text-[11px] text-slate-600 truncate max-w-[180px]">
                          {dev.location}
                        </p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="font-medium text-slate-900">
                          {dev.protocol}
                        </p>
                        <p className="font-mono text-[11px] text-slate-500">
                          {dev.gatewayId}
                          {dev.rssiDbm !== null ? ` · ${dev.rssiDbm} dBm` : ''}
                        </p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium ${stateStyle}`}
                        >
                          {dev.state}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-mono tabular-nums whitespace-nowrap">
                        <span
                          className={
                            dev.batteryPct < 20
                              ? 'font-bold text-amber-700'
                              : 'text-slate-900 font-medium'
                          }
                        >
                          {dev.batteryPct}%
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700 whitespace-nowrap">
                        {dev.firmware}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <QualityLabel condition={dev.qualityCondition} />
                        {dev.edgeBufferPending > 0 && (
                          <p className="mt-0.5 text-[11px] text-amber-800">
                            Buffer de borda: {dev.edgeBufferPending} pcts
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono tabular-nums text-slate-700 whitespace-nowrap">
                        {dev.lastCommunicationAt}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Demonstrative architecture & governance cards */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-[#0B2545]">
            <Radio className="h-4 w-4 text-sky-700" aria-hidden="true" />
            <h3 className="font-display text-sm font-bold">
              Conectividade LPWAN e Borda Offline (Demonstrativo)
            </h3>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            As leituras de nível ocorrem periodicamente para economizar bateria,
            enquanto variações bruscas de temperatura, inclinação ou abertura de
            tampa geram eventos imediatos. Quando o gateway de borda fica
            temporariamente sem saída para a nuvem, o buffer local armazena os
            pacotes e sincroniza posteriormente, expondo eventuais{' '}
            <strong>atrasos</strong>, <strong>duplicidades</strong>,{' '}
            <strong>lacunas</strong> ou valores <strong>fora da faixa</strong>.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-2.5">
          <div className="flex items-center gap-2 text-[#0B2545]">
            <Lock className="h-4 w-4 text-emerald-700" aria-hidden="true" />
            <h3 className="font-display text-sm font-bold">
              Segurança e Governança Operacional (Informativo)
            </h3>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            Em operação real, o sistema contempla autenticação por dispositivo,
            criptografia ponta a ponta, controle de acesso por perfil, firmware
            assinado e trilha de logs auditáveis. Neste protótipo demonstrativo,
            esses atributos aparecem apenas como referência informativa, sem
            autenticação ou criptografia de rede ativas.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-medium text-slate-600">
            <span className="inline-flex items-center gap-1">
              <Server className="h-3.5 w-3.5 text-sky-700" aria-hidden="true" />
              4 gateways simulados
            </span>
            <span>·</span>
            <span>Regras de qualidade visíveis na interface</span>
          </div>
        </div>
      </section>
    </div>
  );
}
