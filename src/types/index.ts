export type HousingType = 'apartment' | 'independent_house' | 'villa' | 'penthouse';
export type PhaseType = 'single_phase' | 'three_phase';
export type TariffStructure = 'flat' | 'slab';
export type TelemetrySource = 'dataset_historical' | 'virtual_simulator' | 'physical_sensors';
export type ApplianceStatus = 'normal' | 'high_draw' | 'possible_leak';
export type AnomalySeverity = 'low' | 'medium' | 'high' | 'critical';
export type AnomalyStatus = 'active' | 'investigating' | 'resolved' | 'ignored';

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  nodeId: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Household {
  id: string;
  profileId: string;
  residenceName: string;
  residentsCount: number;
  city: string;
  state: string;
  housingType: HousingType;
  sanctionedLoadKw: number;
  phaseType: PhaseType;
  
  // Tariff
  discomName: string;
  discomCode: string;
  tariffStructure: TariffStructure;
  baseTariffInr: number;
  monthlyBudgetInr: number;

  // Telemetry
  telemetrySource: TelemetrySource;
  hardwareBridgeConnected: boolean;
  hardwareNodeId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Appliance {
  id: string;
  householdId: string;
  name: string;
  category: string;
  count: number;
  wattage: number;
  hoursPerDay: number;
  dailyKwh: number;
  icon: string;
  status: ApplianceStatus;
  isCustom: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TelemetryLog {
  id: string;
  householdId: string;
  timestamp: string;
  date: string;
  dayLabel: string;
  energyKwh: number;
  typicalBaselineKwh: number;
  costInr: number;
  peakPowerWatts: number;
  isAnomalous: boolean;
  anomalyReason?: string | null;
}

export interface Anomaly {
  id: string;
  householdId: string;
  title: string;
  description: string;
  applianceTag: string;
  timeWindow: string;
  excessCostInr: number;
  estimatedExcessKwh: number;
  severity: AnomalySeverity;
  status: AnomalyStatus;
  recommendedAction: string;
  createdAt: string;
  resolvedAt?: string | null;
}

export interface TelemetryOverview {
  todayUsageKwh: number;
  todayCostInr: number;
  projectedMonthBillInr: number;
  alertsCount: number;
  baselineKwh: number;
  budgetCapInr: number;
  budgetUtilizationPct: number;
  hardwareStatus: {
    connected: boolean;
    nodeId: string;
    protocol: string;
    syncLatencyMs: number;
  };
}
