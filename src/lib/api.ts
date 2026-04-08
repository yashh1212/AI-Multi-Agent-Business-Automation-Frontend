import { useQuery } from "@tanstack/react-query";

const BASE_URL = "http://localhost:5000";

// ─── Generic fetch wrapper ──────────────────────────────────────────────────────

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  const json = await res.json();
  if (json.success === false) {
    throw new Error(json.error || "Unknown API error");
  }
  return json.data ?? json;
}

// ─── Type Definitions ───────────────────────────────────────────────────────────

export interface DashboardStats {
  totalCandidates: number;
  activeCandidates: number;
  hiredTotal: number;
  hiredToday: number;
  rejectedTotal: number;
  interviewScheduled: number;
  totalLeads: number;
  activeLeads: number;
  activePipelineValue: number;
  closedWon: number;
  closedLost: number;
  totalRevenue: number;
  conversionRate: string;
  emailsSentToday: number;
  completedToday: number;
  candidatesByStatus: Record<string, number>;
  leadsByStage: Record<string, { count: number; value: number }>;
}

export interface ChartPoint {
  name: string;
  [key: string]: string | number;
}

export interface AgentInfo {
  id: number;
  name: string;
  role: string;
  description: string;
  status: "running" | "thinking" | "idle";
  lastActivity: string;
  tasksCompleted: number;
  performance: number;
}

export interface WorkflowInfo {
  id: number;
  name: string;
  status: "running" | "completed" | "paused";
  steps: string[];
  completedSteps: number;
  lastRun: string;
  totalRuns: number;
}

export interface ActivityLogEntry {
  id: string;
  type: "agent" | "email" | "workflow" | "slack" | "jira";
  agent: string;
  action: string;
  detail: string;
  timestamp: string;
  createdAt: string;
}

export interface IntegrationInfo {
  id: number;
  name: string;
  icon: string;
  connected: boolean;
  lastSync: string;
  syncStatus: "synced" | "syncing" | "disconnected";
  category: string;
}

export interface EmailTemplateInfo {
  id: number;
  name: string;
  subject: string;
  status: "active" | "draft";
  lastUsed: string;
  sentCount: number;
}

export interface DashboardData {
  stats: DashboardStats;
  chartData: {
    agentPerformance: ChartPoint[];
    workflowTrend: ChartPoint[];
    emailAnalytics: ChartPoint[];
  };
  agents: AgentInfo[];
  workflows: WorkflowInfo[];
  activityLogs: ActivityLogEntry[];
  integrations: IntegrationInfo[];
  emailTemplates: EmailTemplateInfo[];
  timestamp: string;
}

// ─── React Query Hooks — 30 second auto-refresh ─────────────────────────────────

const REFETCH_INTERVAL = 30_000; // 30 seconds

export function useDashboard() {
  return useQuery<DashboardData>({
    queryKey: ["dashboard"],
    queryFn: () => apiFetch<DashboardData>("/api/dashboard"),
    refetchInterval: REFETCH_INTERVAL,
    refetchIntervalInBackground: false,
    staleTime: 10_000,
    retry: 2,
  });
}

// Convenience accessors that share the same cache key
export function useDashboardStats() {
  const query = useDashboard();
  return { ...query, data: query.data?.stats };
}

export function useDashboardAgents() {
  const query = useDashboard();
  return { ...query, data: query.data?.agents };
}

export function useDashboardWorkflows() {
  const query = useDashboard();
  return { ...query, data: query.data?.workflows };
}

export function useDashboardLogs() {
  const query = useDashboard();
  return { ...query, data: query.data?.activityLogs };
}

export function useDashboardCharts() {
  const query = useDashboard();
  return { ...query, data: query.data?.chartData };
}

export function useDashboardIntegrations() {
  const query = useDashboard();
  return { ...query, data: query.data?.integrations };
}

export function useDashboardEmailTemplates() {
  const query = useDashboard();
  return { ...query, data: query.data?.emailTemplates };
}
