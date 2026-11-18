import type { CollectionRoute, Container } from '../types/waste';
import {
  getContainerVisualCategory,
  type ContainerVisualCategory,
} from '../utils/wasteLogic';

interface NovaEsperancaMapProps {
  containers: Container[];
  selectedContainerId?: string | null;
  onSelectContainer: (containerId: string) => void;
  highlightedRoute?: CollectionRoute | null;
  compact?: boolean;
}

const CATEGORY_COLORS: Record<
  ContainerVisualCategory,
  { fill: string; stroke: string; text: string; label: string }
> = {
  nivel_critico: {
    fill: '#DC2626',
    stroke: '#7F1D1D',
    text: '#FFFFFF',
    label: 'Nível crítico / incidente',
  },
  atencao: {
    fill: '#D97706',
    stroke: '#78350F',
    text: '#FFFFFF',
    label: 'Atenção (70%–84%)',
  },
  possivel_falha: {
    fill: '#7C3AED',
    stroke: '#4C1D95',
    text: '#FFFFFF',
    label: 'Sensor com possível falha',
  },
  sem_comunicacao: {
    fill: '#475569',
    stroke: '#1E293B',
    text: '#FFFFFF',
    label: 'Sem comunicação',
  },
  normal: {
    fill: '#15803D',
    stroke: '#14532D',
    text: '#FFFFFF',
    label: 'Operação normal',
  },
};

const GATEWAYS = [
  { id: 'GW-CENTRO', label: 'Gateway Centro', x: 490, y: 290 },
  { id: 'GW-OESTE', label: 'Gateway Vila Nova', x: 245, y: 225 },
  { id: 'GW-LESTE', label: 'Gateway Leste', x: 745, y: 245 },
  { id: 'GW-SUL', label: 'Gateway Parque/Sul', x: 410, y: 470 },
];

export function NovaEsperancaMap({
  containers,
  selectedContainerId,
  onSelectContainer,
  highlightedRoute,
  compact = false,
}: NovaEsperancaMapProps) {
  const containerById = new Map(containers.map((c) => [c.id, c]));

  const routePoints = highlightedRoute
    ? highlightedRoute.stops
        .map((s) => containerById.get(s.containerId))
        .filter((c): c is Container => Boolean(c))
    : [];

  const routePolyline = routePoints.map((c) => `${c.mapX},${c.mapY}`).join(' ');

  return (
    <div className="space-y-3">
      <div className="relative z-0 overflow-hidden rounded-xl border border-slate-200 bg-[#EBF3F9]">
        {/* Illustrative Map Canvas */}
        <svg
          viewBox="0 0 1000 560"
          role="img"
          aria-label="Mapa demonstrativo ilustrativo dos contêineres de Nova Esperança"
          className={`w-full block ${compact ? 'aspect-[16/9] sm:h-[350px]' : 'aspect-[16/9] sm:h-[420px]'}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background urban blocks */}
          <rect x="0" y="0" width="1000" height="560" fill="#EDF4FA" />

          {/* Green parks */}
          <path
            d="M 90 340 Q 220 310 310 385 Q 320 480 180 510 Q 80 470 90 340 Z"
            fill="#D7EFE0"
            stroke="#B6DEC5"
            strokeWidth="1.5"
          />
          <rect
            x="410"
            y="225"
            width="115"
            height="75"
            rx="10"
            fill="#DDF2E5"
            stroke="#B6DEC5"
            strokeWidth="1.5"
          />

          {/* Rio Esperança */}
          <path
            d="M -20 430 C 180 410, 290 525, 480 495 C 660 465, 810 370, 1020 390"
            fill="none"
            stroke="#93C5FD"
            strokeWidth="26"
            strokeLinecap="round"
            opacity="0.7"
          />
          <path
            d="M -20 430 C 180 410, 290 525, 480 495 C 660 465, 810 370, 1020 390"
            fill="none"
            stroke="#60A5FA"
            strokeWidth="4"
            strokeDasharray="10 8"
            opacity="0.7"
          />

          {/* Secondary street grid */}
          <g stroke="#DCE7F1" strokeWidth="2">
            <line x1="120" y1="70" x2="880" y2="70" />
            <line x1="100" y1="150" x2="900" y2="150" />
            <line x1="80" y1="330" x2="920" y2="330" />
            <line x1="180" y1="50" x2="180" y2="520" />
            <line x1="360" y1="50" x2="360" y2="520" />
            <line x1="620" y1="50" x2="620" y2="520" />
            <line x1="800" y1="50" x2="800" y2="520" />
          </g>

          {/* Primary arterial avenues */}
          <g stroke="#CBD5E1" strokeWidth="7" strokeLinecap="round">
            <line x1="60" y1="210" x2="940" y2="210" />
            <line x1="490" y1="30" x2="490" y2="530" />
            <line x1="140" y1="455" x2="890" y2="455" />
          </g>
          <g stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round">
            <line x1="60" y1="210" x2="940" y2="210" />
            <line x1="490" y1="30" x2="490" y2="530" />
            <line x1="140" y1="455" x2="890" y2="455" />
          </g>

          {/* Neighborhood labels positioned cleanly away from pins */}
          <g
            fill="#475569"
            fontSize="12"
            fontWeight="600"
            fontFamily="Public Sans, sans-serif"
          >
            <text x="385" y="62">
              Alto da Colina
            </text>
            <text x="155" y="142">
              Vila Nova
            </text>
            <text x="395" y="238">
              Centro
            </text>
            <text x="655" y="140">
              Jardim Esperança
            </text>
            <text x="720" y="315">
              Conjunto Solaris
            </text>
            <text x="135" y="445">
              Parque das Águas
            </text>
            <text x="635" y="542">
              Bairro Industrial
            </text>
            <text x="585" y="422" fill="#1D4ED8" fontSize="11">
              Rio Esperança
            </text>
          </g>

          {/* Simulated route overlay */}
          {routePoints.length >= 2 && (
            <g>
              <polyline
                points={routePolyline}
                fill="none"
                stroke="#0284C7"
                strokeWidth="4.5"
                strokeDasharray="10 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {routePoints.map((pt, idx) => (
                <g key={`order-${pt.id}`}>
                  <circle
                    cx={pt.mapX - 34}
                    cy={pt.mapY - 18}
                    r="11"
                    fill="#0B2545"
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                  <text
                    x={pt.mapX - 34}
                    y={pt.mapY - 14}
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="11"
                    fontWeight="700"
                  >
                    {idx + 1}
                  </text>
                </g>
              ))}
            </g>
          )}

          {/* LoRaWAN Gateways */}
          {GATEWAYS.map((gw) => (
            <g key={gw.id} opacity="0.85">
              <circle
                cx={gw.x}
                cy={gw.y}
                r="42"
                fill="none"
                stroke="#0284C7"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="0.35"
              />
              <rect
                x={gw.x - 6}
                y={gw.y - 6}
                width="12"
                height="12"
                rx="2"
                fill="#0284C7"
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
              <text
                x={gw.x + 10}
                y={gw.y + 4}
                fill="#0369A1"
                fontSize="10"
                fontWeight="600"
              >
                {gw.label}
              </text>
            </g>
          ))}
        </svg>

        {/* Accessible interactive container markers positioned over SVG coordinates */}
        <div className="pointer-events-none absolute inset-0">
          {containers.map((container) => {
            const cat = getContainerVisualCategory(container);
            const palette = CATEGORY_COLORS[cat];
            const isSelected = selectedContainerId === container.id;
            const leftPct = (container.mapX / 1000) * 100;
            const topPct = (container.mapY / 560) * 100;

            return (
              <button
                key={container.id}
                type="button"
                onClick={() => onSelectContainer(container.id)}
                aria-label={`Selecionar contêiner ${container.id} (${container.name}) - ${palette.label}, nível ${container.levelPct}%`}
                aria-pressed={isSelected}
                style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                className={`pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 inline-flex items-center gap-1 rounded-md border bg-white/90 px-1 py-0.5 text-[11px] font-semibold shadow-sm transition-transform whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B2545] ${
                  isSelected ? 'scale-110 z-20 ring-2 ring-[#0B2545]' : 'z-10 hover:scale-105'
                }`}
              >
                <span
                  className="inline-flex items-center justify-center rounded-sm px-1.5 py-0.5 text-[10px] sm:text-[11px] font-mono tabular-nums leading-none whitespace-nowrap"
                  style={{
                    backgroundColor: palette.fill,
                    color: palette.text,
                    border: `1.5px solid ${palette.stroke}`,
                  }}
                >
                  {cat === 'sem_comunicacao'
                    ? 'OFF'
                    : cat === 'possivel_falha'
                    ? 'FALHA'
                    : `${container.levelPct}%`}
                </span>
                <span className="hidden xl:inline text-slate-900 px-1 font-mono text-[10px] leading-tight whitespace-nowrap">
                  {container.id}
                </span>
              </button>
            );
          })}
        </div>

        {/* Bottom-left clear caption */}
        <div className="pointer-events-none absolute bottom-2.5 left-3 rounded-md border border-slate-300/80 bg-white/90 px-2.5 py-1 text-[11px] font-medium text-slate-700">
          Mapa demonstrativo ilustrativo · Coordenadas simuladas de Nova Esperança
        </div>
      </div>

      {/* Explicit legend (color + text, never color alone) */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-700">
        {(
          Object.entries(CATEGORY_COLORS) as Array<
            [ContainerVisualCategory, (typeof CATEGORY_COLORS)['normal']]
          >
        ).map(([key, item]) => (
          <div key={key} className="flex items-center gap-1.5">
            <span
              className="inline-block h-3 w-3 rounded-xs border"
              style={{ backgroundColor: item.fill, borderColor: item.stroke }}
              aria-hidden="true"
            />
            <span>{item.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <span
            className="inline-block h-3 w-3 rounded-xs border border-white bg-[#0284C7]"
            aria-hidden="true"
          />
          <span>Gateway LoRaWAN (simulado)</span>
        </div>
      </div>
    </div>
  );
}
