import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Cpu,
  WifiOff,
  Wrench,
} from 'lucide-react';
import type { ContainerVisualCategory } from '../utils/wasteLogic';

export function ContainerStatusLabel({
  category,
}: {
  category: ContainerVisualCategory;
}) {
  switch (category) {
    case 'nivel_critico':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-medium text-red-800 whitespace-nowrap">
          <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Nível crítico
        </span>
      );
    case 'sem_comunicacao':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-800 whitespace-nowrap">
          <WifiOff className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Sem comunicação
        </span>
      );
    case 'possivel_falha':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-violet-200 bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-800 whitespace-nowrap">
          <Wrench className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Sensor com possível falha
        </span>
      );
    case 'atencao':
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800 whitespace-nowrap">
          <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Atenção
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800 whitespace-nowrap">
          <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Operação normal
        </span>
      );
  }
}

export function PriorityLabel({
  priority,
}: {
  priority: 'Crítica' | 'Alta' | 'Média' | 'Baixa';
}) {
  const styles: Record<string, string> = {
    Crítica: 'border-red-200 bg-red-50 text-red-800',
    Alta: 'border-amber-200 bg-amber-50 text-amber-800',
    Média: 'border-sky-200 bg-sky-50 text-sky-800',
    Baixa: 'border-slate-200 bg-slate-100 text-slate-700',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap ${styles[priority]}`}
    >
      Prioridade {priority.toLowerCase()}
    </span>
  );
}

export function QualityLabel({
  condition,
}: {
  condition: 'Íntegro' | 'Atraso' | 'Duplicidade' | 'Lacuna' | 'Fora da faixa';
}) {
  const styles: Record<string, string> = {
    Íntegro: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    Atraso: 'border-amber-200 bg-amber-50 text-amber-800',
    Duplicidade: 'border-sky-200 bg-sky-50 text-sky-800',
    Lacuna: 'border-slate-300 bg-slate-100 text-slate-800',
    'Fora da faixa': 'border-violet-200 bg-violet-50 text-violet-800',
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap ${styles[condition]}`}
    >
      <Cpu className="h-3 w-3 shrink-0" aria-hidden="true" />
      {condition}
    </span>
  );
}
