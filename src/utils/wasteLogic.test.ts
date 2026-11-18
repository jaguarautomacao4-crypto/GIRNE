import test from 'node:test';
import assert from 'node:assert/strict';
import {
  INITIAL_ALERTS,
  INITIAL_CONTAINERS,
  INITIAL_DEVICES,
  INITIAL_HISTORY_EVENTS,
  INITIAL_ROUTES,
} from '../data/mockWasteData';
import {
  computeOverviewKPIs,
  filterAlerts,
  filterDevices,
  filterHistoryEvents,
  getContainerVisualCategory,
  recalculateRouteStops,
} from './wasteLogic';

test('getContainerVisualCategory separates offline, suspected sensor failure, and critical level', () => {
  const critical = INITIAL_CONTAINERS.find((c) => c.id === 'NE-00101')!;
  const offline = INITIAL_CONTAINERS.find((c) => c.id === 'NE-00105')!;
  const failure = INITIAL_CONTAINERS.find((c) => c.id === 'NE-00106')!;
  const normal = INITIAL_CONTAINERS.find((c) => c.id === 'NE-00111')!;

  assert.equal(getContainerVisualCategory(critical), 'nivel_critico');
  assert.equal(getContainerVisualCategory(offline), 'sem_comunicacao');
  assert.equal(getContainerVisualCategory(failure), 'possivel_falha');
  assert.equal(getContainerVisualCategory(normal), 'normal');
});

test('computeOverviewKPIs computes exact counts from initial demo state', () => {
  const kpis = computeOverviewKPIs(
    INITIAL_CONTAINERS,
    INITIAL_ROUTES,
    INITIAL_ALERTS,
    INITIAL_DEVICES
  );

  assert.equal(kpis.totalContainers, 12);
  assert.equal(kpis.criticalContainers, 4);
  assert.equal(kpis.offlineDevices, 2);
  assert.equal(kpis.pendingAlerts, 5);
  assert.equal(kpis.plannedCollectionsToday, 8);
});

test('filterAlerts filters accurately by priority, type, and status', () => {
  const onlyCritical = filterAlerts(INITIAL_ALERTS, {
    priority: 'Crítica',
    type: 'Todos',
    status: 'Todos',
  });
  assert.equal(onlyCritical.length, 3);

  const onlyAcknowledged = filterAlerts(INITIAL_ALERTS, {
    priority: 'Todas',
    type: 'Todos',
    status: 'Reconhecido',
  });
  assert.equal(onlyAcknowledged.length, 1);
  assert.equal(onlyAcknowledged[0].id, 'ALT-2026-06');

  const emptyCombination = filterAlerts(INITIAL_ALERTS, {
    priority: 'Média',
    type: 'Possível tombamento',
    status: 'Pendente',
  });
  assert.equal(emptyCombination.length, 0);
});

test('filterHistoryEvents handles period cascade and search queries', () => {
  const todayOnly = filterHistoryEvents(INITIAL_HISTORY_EVENTS, {
    period: 'hoje',
    type: 'Todos',
    search: '',
  });
  assert.equal(todayOnly.length, 6);

  const sevenDays = filterHistoryEvents(INITIAL_HISTORY_EVENTS, {
    period: '7d',
    type: 'Todos',
    search: '',
  });
  assert.equal(sevenDays.length, 9);

  const searchMatch = filterHistoryEvents(INITIAL_HISTORY_EVENTS, {
    period: '30d',
    type: 'Todos',
    search: 'NE-00102',
  });
  assert.equal(searchMatch.length, 2);
});

test('filterDevices filters by connectivity state and data quality condition', () => {
  const offline = filterDevices(INITIAL_DEVICES, {
    state: 'Sem comunicação',
    quality: 'Todas',
    search: '',
  });
  assert.equal(offline.length, 2);

  const outlier = filterDevices(INITIAL_DEVICES, {
    state: 'Todos',
    quality: 'Fora da faixa',
    search: '',
  });
  assert.equal(outlier.length, 1);
  assert.equal(outlier[0].containerId, 'NE-00106');
});

test('recalculateRouteStops prioritizes critical and thermal-anomaly stops while preserving completed stops', () => {
  const route2 = INITIAL_ROUTES.find((r) => r.id === 'route-02')!;
  const recalculated = recalculateRouteStops(
    route2,
    INITIAL_CONTAINERS,
    '13:15 (Simulação)'
  );

  assert.equal(recalculated.lastRecalculatedAt, '13:15 (Simulação)');
  assert.equal(recalculated.stops.length, 4);
  assert.equal(recalculated.stops[0].containerId, 'NE-00102');
  assert.equal(recalculated.stops[0].order, 1);
  assert.equal(recalculated.stops[3].containerId, 'NE-00104');
  assert.equal(recalculated.stops[3].order, 4);
});
