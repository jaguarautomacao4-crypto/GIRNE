/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AlertsView } from './components/AlertsView';
import { ArchitectureModal } from './components/ArchitectureModal';
import { ContainersMapView } from './components/ContainersMapView';
import { DevicesSensorsView } from './components/DevicesSensorsView';
import { HistoryReportsView } from './components/HistoryReportsView';
import { OverviewView } from './components/OverviewView';
import { RoutesView } from './components/RoutesView';
import { SidebarNav } from './components/SidebarNav';
import { TopHeader } from './components/TopHeader';
import {
  INITIAL_ALERTS,
  INITIAL_CONTAINERS,
  INITIAL_DEVICES,
  INITIAL_HISTORY_EVENTS,
  INITIAL_ROUTES,
} from './data/mockWasteData';
import type {
  AlertItem,
  CollectionRoute,
  HistoryEvent,
  NavSection,
} from './types/waste';
import { recalculateRouteStops } from './utils/wasteLogic';

const SECTION_TITLES: Record<NavSection, string> = {
  'visao-geral': 'Visão geral',
  mapa: 'Mapa de contêineres',
  rotas: 'Rotas de coleta',
  alertas: 'Alertas e anomalias',
  historico: 'Histórico e relatórios',
  dispositivos: 'Dispositivos e sensores',
};

export default function App() {
  const [activeSection, setActiveSection] = useState<NavSection>('visao-geral');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [architectureOpen, setArchitectureOpen] = useState(false);

  const [containers] = useState(INITIAL_CONTAINERS);
  const [routes, setRoutes] = useState<CollectionRoute[]>(INITIAL_ROUTES);
  const [alerts, setAlerts] = useState<AlertItem[]>(INITIAL_ALERTS);
  const [devices] = useState(INITIAL_DEVICES);
  const [historyEvents, setHistoryEvents] = useState<HistoryEvent[]>(
    INITIAL_HISTORY_EVENTS
  );
  const [selectedContainerId, setSelectedContainerId] = useState<string>(
    INITIAL_CONTAINERS[0].id
  );

  const pendingAlertsCount = alerts.filter(
    (a) => a.status === 'Pendente'
  ).length;

  const handleInspectContainer = (containerId: string) => {
    setSelectedContainerId(containerId);
    setActiveSection('mapa');
  };

  const handleAcknowledgeAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((item) =>
        item.id === alertId
          ? {
              ...item,
              status: 'Reconhecido',
              acknowledgedAt: '13:12',
              acknowledgedBy: 'Supervisão Municipal (Simulação)',
            }
          : item
      )
    );
  };

  const handleRecalculateRoute = (routeId: string) => {
    setRoutes((prev) =>
      prev.map((route) =>
        route.id === routeId
          ? recalculateRouteStops(route, containers, '13:12 (Simulação)')
          : route
      )
    );
  };

  const handleApproveRoute = (routeId: string) => {
    const target = routes.find((r) => r.id === routeId);
    setRoutes((prev) =>
      prev.map((route) =>
        route.id === routeId
          ? {
              ...route,
              status: 'Aprovada (Simulação)',
              approvalNote:
                'Aprovada em 13:12 (Simulação demonstrativa — sem despacho real).',
            }
          : route
      )
    );

    if (target) {
      const newEvent: HistoryEvent = {
        id: `HIST-SIM-${Date.now()}`,
        timestampDisplay: 'Hoje · 13:12',
        periodBucket: 'hoje',
        type: 'Aprovação de rota',
        routeCode: target.code,
        summary: `${target.name} aprovada pela supervisão (simulação)`,
        detail: `Aprovação demonstrativa registrada para ${target.vehicle} (${target.stops.length} paradas).`,
      };
      setHistoryEvents((prev) => [newEvent, ...prev]);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] text-slate-900">
      <SidebarNav
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        pendingAlertsCount={pendingAlertsCount}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="lg:pl-64 flex min-h-screen flex-col">
        <TopHeader
          sectionTitle={SECTION_TITLES[activeSection]}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          onOpenArchitecture={() => setArchitectureOpen(true)}
        />

        <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8 max-w-[1440px] w-full mx-auto">
          {activeSection === 'visao-geral' && (
            <OverviewView
              containers={containers}
              routes={routes}
              alerts={alerts}
              devices={devices}
              selectedContainerId={selectedContainerId}
              onInspectContainer={handleInspectContainer}
              onNavigate={setActiveSection}
            />
          )}

          {activeSection === 'mapa' && (
            <ContainersMapView
              containers={containers}
              alerts={alerts}
              selectedContainerId={selectedContainerId}
              onSelectContainer={setSelectedContainerId}
              onNavigate={setActiveSection}
            />
          )}

          {activeSection === 'rotas' && (
            <RoutesView
              routes={routes}
              containers={containers}
              onRecalculateRoute={handleRecalculateRoute}
              onApproveRoute={handleApproveRoute}
              onInspectContainer={handleInspectContainer}
            />
          )}

          {activeSection === 'alertas' && (
            <AlertsView
              alerts={alerts}
              onAcknowledgeAlert={handleAcknowledgeAlert}
              onInspectContainer={handleInspectContainer}
            />
          )}

          {activeSection === 'historico' && (
            <HistoryReportsView
              events={historyEvents}
              onInspectContainer={handleInspectContainer}
            />
          )}

          {activeSection === 'dispositivos' && (
            <DevicesSensorsView
              devices={devices}
              onInspectContainer={handleInspectContainer}
            />
          )}
        </main>

        <footer className="border-t border-slate-200 bg-white px-4 py-3 sm:px-6 lg:px-8 text-xs text-slate-600">
          <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-2">
            <span>
              Prefeitura Municipal de Nova Esperança · Protótipo demonstrativo de
              gestão inteligente de resíduos
            </span>
            <span>
              Dados, previsões e aprovações simulados · Sem integração externa
              ativa
            </span>
          </div>
        </footer>
      </div>

      <ArchitectureModal
        open={architectureOpen}
        onClose={() => setArchitectureOpen(false)}
      />
    </div>
  );
}
