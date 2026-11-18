export type NavSection =
  | 'visao-geral'
  | 'mapa'
  | 'rotas'
  | 'alertas'
  | 'historico'
  | 'dispositivos';

export type WasteType = 'Orgânico' | 'Reciclável' | 'Misto' | 'Vidro';

export type PriorityLevel = 'Crítica' | 'Alta' | 'Média' | 'Baixa';

export type ConnectivityState = 'Online' | 'Instável' | 'Sem comunicação';

export type SensorOperationalStatus =
  | 'Normal'
  | 'Nível crítico'
  | 'Possível falha'
  | 'Sem comunicação';

export type DataQualityCondition =
  | 'Íntegro'
  | 'Atraso'
  | 'Duplicidade'
  | 'Lacuna'
  | 'Fora da faixa';

export interface ReadingPoint {
  time: string;
  levelPct: number | null;
  temperatureC: number | null;
  note?: string;
}

export interface Container {
  id: string;
  name: string;
  location: string;
  neighborhood: string;
  capacityLiters: number;
  wasteType: WasteType;
  mapX: number; // 0..1000 SVG coordinate
  mapY: number; // 0..600 SVG coordinate
  levelPct: number;
  predictedLevelPct: number;
  predictedOverflowWindow: string;
  temperatureC: number;
  tiltDeg: number;
  lidOpen: boolean;
  lastReadingAt: string;
  batteryPct: number;
  connectivity: ConnectivityState;
  sensorStatus: SensorOperationalStatus;
  qualityCondition: DataQualityCondition;
  qualityDetail: string;
  priority: PriorityLevel;
  priorityReason: string;
  localCriticality: string;
  aiConfidencePct: number;
  gatewayId: string;
  recentReadings: ReadingPoint[];
}

export type AlertType =
  | 'Risco de transbordamento'
  | 'Aumento incomum de temperatura'
  | 'Possível tombamento'
  | 'Sensor sem variação'
  | 'Sem comunicação';

export type AlertStatus = 'Pendente' | 'Reconhecido';

export interface AlertItem {
  id: string;
  timestamp: string;
  containerId: string;
  containerName: string;
  neighborhood: string;
  type: AlertType;
  priority: 'Crítica' | 'Alta' | 'Média';
  status: AlertStatus;
  description: string;
  explanation: string;
  confidencePct: number | null;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
}

export type RouteStatus =
  | 'Em andamento'
  | 'Planejada'
  | 'Aprovada (Simulação)'
  | 'Concluída';

export interface RouteStop {
  order: number;
  containerId: string;
  containerName: string;
  location: string;
  neighborhood: string;
  currentLevelPct: number;
  predictedLevelPct: number;
  wasteType: WasteType;
  priority: PriorityLevel;
  justification: string;
  completed: boolean;
}

export interface CollectionRoute {
  id: string;
  code: string;
  name: string;
  zone: string;
  vehicle: string;
  plate: string;
  driver: string;
  status: RouteStatus;
  progressPct: number;
  estimatedDurationMin: number;
  distanceKm: number;
  lastRecalculatedAt?: string;
  approvalNote?: string;
  stops: RouteStop[];
}

export type HistoryPeriod = 'hoje' | '7d' | '30d';

export type OccurrenceType =
  | 'Coleta realizada'
  | 'Alerta gerado'
  | 'Anomalia de sensor'
  | 'Aprovação de rota'
  | 'Falha de comunicação';

export interface HistoryEvent {
  id: string;
  timestampDisplay: string;
  periodBucket: HistoryPeriod;
  type: OccurrenceType;
  containerId?: string;
  routeCode?: string;
  summary: string;
  detail: string;
  qualityCondition?: DataQualityCondition;
}

export type DeviceState = 'Ativo' | 'Bateria baixa' | 'Sem comunicação';

export interface DeviceSensor {
  deviceId: string;
  containerId: string;
  location: string;
  neighborhood: string;
  protocol: 'LoRaWAN 915 MHz' | 'NB-IoT (Contingência)';
  gatewayId: string;
  state: DeviceState;
  batteryPct: number;
  firmware: string;
  rssiDbm: number | null;
  edgeBufferPending: number;
  lastCommunicationAt: string;
  qualityCondition: DataQualityCondition;
  securityNote: string;
}

export interface HourlyEvolutionPoint {
  hour: string;
  observedAvgPct: number;
  predictedAvgPct: number | null;
  criticalCount: number;
}
