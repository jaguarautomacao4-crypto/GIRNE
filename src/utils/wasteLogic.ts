import type {
  AlertItem,
  AlertStatus,
  AlertType,
  CollectionRoute,
  Container,
  DataQualityCondition,
  DeviceSensor,
  DeviceState,
  HistoryEvent,
  HistoryPeriod,
  OccurrenceType,
  PriorityLevel,
} from '../types/waste';

export type ContainerVisualCategory =
  | 'sem_comunicacao'
  | 'possivel_falha'
  | 'nivel_critico'
  | 'atencao'
  | 'normal';

/**
 * Clearly separates communication loss, suspected sensor failure, and genuine critical fill/incident.
 */
export function getContainerVisualCategory(
  container: Container
): ContainerVisualCategory {
  if (
    container.connectivity === 'Sem comunicação' ||
    container.sensorStatus === 'Sem comunicação'
  ) {
    return 'sem_comunicacao';
  }
  if (container.sensorStatus === 'Possível falha') {
    return 'possivel_falha';
  }
  if (container.priority === 'Crítica' || container.levelPct >= 85) {
    return 'nivel_critico';
  }
  if (container.priority === 'Alta' || container.levelPct >= 70) {
    return 'atencao';
  }
  return 'normal';
}

export interface OverviewKPIs {
  totalContainers: number;
  criticalContainers: number;
  plannedCollectionsToday: number;
  offlineDevices: number;
  pendingAlerts: number;
}

export function computeOverviewKPIs(
  containers: Container[],
  routes: CollectionRoute[],
  alerts: AlertItem[],
  devices: DeviceSensor[]
): OverviewKPIs {
  const criticalContainers = containers.filter(
    (c) => getContainerVisualCategory(c) === 'nivel_critico'
  ).length;

  const plannedCollectionsToday = routes
    .filter((r) => r.status !== 'Concluída')
    .reduce((acc, r) => acc + r.stops.filter((s) => !s.completed).length, 0);

  const offlineDevices = devices.filter(
    (d) => d.state === 'Sem comunicação'
  ).length;

  const pendingAlerts = alerts.filter((a) => a.status === 'Pendente').length;

  return {
    totalContainers: containers.length,
    criticalContainers,
    plannedCollectionsToday,
    offlineDevices,
    pendingAlerts,
  };
}

export interface AlertFilters {
  priority: 'Todas' | 'Crítica' | 'Alta' | 'Média';
  type: 'Todos' | AlertType;
  status: 'Todos' | AlertStatus;
}

export function filterAlerts(
  alerts: AlertItem[],
  filters: AlertFilters
): AlertItem[] {
  return alerts.filter((alert) => {
    if (filters.priority !== 'Todas' && alert.priority !== filters.priority) {
      return false;
    }
    if (filters.type !== 'Todos' && alert.type !== filters.type) {
      return false;
    }
    if (filters.status !== 'Todos' && alert.status !== filters.status) {
      return false;
    }
    return true;
  });
}

export interface HistoryFilters {
  period: HistoryPeriod;
  type: 'Todos' | OccurrenceType;
  search: string;
}

export function filterHistoryEvents(
  events: HistoryEvent[],
  filters: HistoryFilters
): HistoryEvent[] {
  const normalizedSearch = filters.search.trim().toLowerCase();
  return events.filter((event) => {
    if (filters.period === 'hoje' && event.periodBucket !== 'hoje') {
      return false;
    }
    if (
      filters.period === '7d' &&
      event.periodBucket !== 'hoje' &&
      event.periodBucket !== '7d'
    ) {
      return false;
    }
    if (filters.type !== 'Todos' && event.type !== filters.type) {
      return false;
    }
    if (normalizedSearch.length > 0) {
      const haystack = `${event.summary} ${event.detail} ${
        event.containerId ?? ''
      } ${event.routeCode ?? ''}`.toLowerCase();
      if (!haystack.includes(normalizedSearch)) {
        return false;
      }
    }
    return true;
  });
}

export interface DeviceFilters {
  state: 'Todos' | DeviceState;
  quality: 'Todas' | DataQualityCondition;
  search: string;
}

export function filterDevices(
  devices: DeviceSensor[],
  filters: DeviceFilters
): DeviceSensor[] {
  const normalizedSearch = filters.search.trim().toLowerCase();
  return devices.filter((device) => {
    if (filters.state !== 'Todos' && device.state !== filters.state) {
      return false;
    }
    if (
      filters.quality !== 'Todas' &&
      device.qualityCondition !== filters.quality
    ) {
      return false;
    }
    if (normalizedSearch.length > 0) {
      const haystack = `${device.deviceId} ${device.containerId} ${device.location} ${device.neighborhood} ${device.gatewayId}`.toLowerCase();
      if (!haystack.includes(normalizedSearch)) {
        return false;
      }
    }
    return true;
  });
}

const PRIORITY_WEIGHT: Record<PriorityLevel, number> = {
  Crítica: 400,
  Alta: 300,
  Média: 200,
  Baixa: 100,
};

/**
 * Simulated VRP-inspired stop re-ordering based on predicted level, overflow risk,
 * local criticality, and active anomalies. Completed stops remain first in order.
 */
export function recalculateRouteStops(
  route: CollectionRoute,
  containers: Container[],
  nowLabel = '13:12 (Simulação)'
): CollectionRoute {
  const containerMap = new Map(containers.map((c) => [c.id, c]));

  const completedStops = route.stops.filter((s) => s.completed);
  const pendingStops = route.stops.filter((s) => !s.completed);

  const scoredPending = pendingStops
    .map((stop) => {
      const latest = containerMap.get(stop.containerId);
      const priority = latest ? latest.priority : stop.priority;
      const predictedLevel = latest
        ? latest.predictedLevelPct
        : stop.predictedLevelPct;
      const anomalyBoost =
        latest && (latest.temperatureC >= 40 || latest.tiltDeg >= 25) ? 120 : 0;
      const score = PRIORITY_WEIGHT[priority] + predictedLevel + anomalyBoost;

      const updatedJustification = latest
        ? `Reavaliado (${nowLabel}): nível ${latest.levelPct}% (prev. ${latest.predictedLevelPct}%) · ${latest.priorityReason}`
        : stop.justification;

      return {
        score,
        stop: {
          ...stop,
          currentLevelPct: latest ? latest.levelPct : stop.currentLevelPct,
          predictedLevelPct: predictedLevel,
          priority,
          justification: updatedJustification,
        },
      };
    })
    .sort((a, b) => b.score - a.score)
    .map((item) => item.stop);

  const reordered = [...completedStops, ...scoredPending].map((stop, idx) => ({
    ...stop,
    order: idx + 1,
  }));

  return {
    ...route,
    stops: reordered,
    lastRecalculatedAt: nowLabel,
  };
}
