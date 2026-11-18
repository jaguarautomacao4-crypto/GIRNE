import {
  ArrowRight,
  Brain,
  CheckSquare,
  Cloud,
  Radio,
  Router,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react';

interface ArchitectureModalProps {
  open: boolean;
  onClose: () => void;
}

const PIPELINE_STAGES = [
  {
    step: '01',
    title: 'Sensores nos contêineres',
    icon: Trash2,
    bullets: [
      'Nível (ultrassônico/ToF), temperatura, inclinação e abertura de tampa',
      'Leituras periódicas e eventos instantâneos (ex.: tombamento)',
      'Metadados: identificador, local, capacidade, tipo de resíduo e bateria',
    ],
  },
  {
    step: '02',
    title: 'Rede LoRaWAN / LPWAN',
    icon: Radio,
    bullets: [
      'Nós LoRaWAN 915 MHz de baixo consumo nos contêineres',
      'Cobertura municipal via gateways distribuídos',
      'NB-IoT previsto como alternativa em zonas de sombra',
    ],
  },
  {
    step: '03',
    title: 'Gateway de borda',
    icon: Router,
    bullets: [
      'Sincronização, conversão de unidades e deduplicação',
      'Buffer offline temporário quando o link de saída cai',
      'Network Server, decodificação e mensageria MQTT',
    ],
  },
  {
    step: '04',
    title: 'Plataforma em nuvem',
    icon: Cloud,
    bullets: [
      'Ingestão, validação e padronização de séries temporais',
      'Sinalização visível de duplicidades, atrasos, lacunas e outliers',
      'Base histórica para acompanhamento operacional',
    ],
  },
  {
    step: '05',
    title: 'Inteligência artificial (apoio)',
    icon: Brain,
    bullets: [
      'Previsão de enchimento e detecção de anomalias explicável',
      'Índice de prioridade combina nível previsto, criticidade e anomalias',
      'Apoia a análise sem substituir a decisão humana',
    ],
  },
  {
    step: '06',
    title: 'Decisão humana e coleta',
    icon: CheckSquare,
    bullets: [
      'Sugestão de rotas e sequenciamento de paradas',
      'Aprovação e ajuste explícitos pela equipe municipal',
      'Retorno de ocorrências após a coleta em campo',
    ],
  },
];

export function ArchitectureModal({ open, onClose }: ArchitectureModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="arch-modal-title"
    >
      <button
        type="button"
        aria-label="Fechar janela de fluxo do sistema"
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60"
      />
      <div className="relative z-10 max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2
              id="arch-modal-title"
              className="font-display text-lg font-bold text-[#0B2545]"
            >
              Arquitetura conceitual do fluxo · Nova Esperança (Demonstrativo)
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Representação ilustrativa do caminho dos dados desde o contêiner até a
              aprovação humana da rota. Nenhum componente abaixo está conectado a
              sensores reais neste protótipo.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar janela"
            className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PIPELINE_STAGES.map((stage, idx) => {
            const Icon = stage.icon;
            return (
              <div
                key={stage.step}
                className="flex flex-col rounded-lg border border-slate-200 bg-slate-50/70 p-4"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#0B2545] font-mono text-xs font-semibold text-white">
                      {stage.step}
                    </span>
                    <h3 className="font-display text-sm font-bold text-[#0B2545]">
                      {stage.title}
                    </h3>
                  </div>
                  <Icon
                    className="h-4 w-4 text-sky-700 shrink-0"
                    aria-hidden="true"
                  />
                </div>
                <ul className="mt-3 space-y-1.5 text-xs text-slate-700 leading-relaxed">
                  {stage.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-1.5">
                      <ArrowRight
                        className="mt-0.5 h-3 w-3 shrink-0 text-emerald-700"
                        aria-hidden="true"
                      />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
                {idx < PIPELINE_STAGES.length - 1 && (
                  <p className="mt-auto pt-3 text-[11px] font-medium text-sky-800">
                    Encaminha para etapa {PIPELINE_STAGES[idx + 1].step}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-5 rounded-lg border border-slate-200 bg-[#0B2545] p-4 text-slate-100">
          <div className="flex items-start gap-3">
            <ShieldCheck
              className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400"
              aria-hidden="true"
            />
            <div className="text-xs leading-relaxed">
              <p className="font-semibold text-white">
                Segurança, governança e operação contínua (escopo demonstrativo)
              </p>
              <p className="mt-1 text-slate-200">
                Em implantação real, a arquitetura prevê autenticação por dispositivo,
                criptografia em trânsito, controle de acesso por perfil, firmware
                assinado, registro de logs, monitoramento de bateria/conectividade e
                acompanhamento de drift dos modelos. Neste protótipo, esses itens são
                exibidos apenas como referência informativa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
