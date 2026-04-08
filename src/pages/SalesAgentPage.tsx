import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Bot,
  Brain,
  CheckCircle2,
  Clock3,
  Loader2,
  Mail,
  Play,
  RefreshCw,
  Send,
  Sparkles,
  UserRoundPlus,
  XCircle,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const API = "http://localhost:5000/sales";

type CrmStatus = "new" | "contacted" | "interested" | "closed" | "lost";

type Lead = {
  _id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  course?: string;
  interest?: string;
  stage: string;
  crmStatus: CrmStatus;
  followUpCount: number;
  lastContactedAt?: string;
  nextFollowUpAt?: string;
  automationEnabled?: boolean;
  replyStatus?: string;
  dealValue?: number;
  createdAt?: string;
  notes?: Array<{ text?: string; createdAt?: string }>;
};

type SalesLog = {
  _id: string;
  type: string;
  action: string;
  detail: string;
  createdAt: string;
  leadId?: { _id: string; name?: string; company?: string } | string;
};

type AgentStats = {
  totalLeads: number;
  closedWon: number;
  closedLost: number;
  conversionRate: string;
  activePipeline?: { totalValue: number; count: number };
  crmBreakdown?: Array<{ _id: CrmStatus; count: number }>;
};

type AutomationSummary = {
  scanned: number;
  initialOutreachSent: number;
  followUpsSent: number;
  markedLost: number;
};

type LeadForm = {
  name: string;
  email: string;
  course: string;
  company: string;
  phone: string;
};

const initialForm: LeadForm = {
  name: "",
  email: "",
  course: "",
  company: "",
  phone: "",
};

const crmTone: Record<CrmStatus, string> = {
  new: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  contacted: "bg-primary/10 text-primary border-primary/20",
  interested: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  closed: "bg-success/10 text-success border-success/20",
  lost: "bg-destructive/10 text-destructive border-destructive/20",
};

async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API}${path}`, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "API error");
  return data;
}

function timeAgo(date?: string) {
  if (!date) return "Never";
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function formatStage(stage?: string) {
  return (stage || "new_lead").replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function countByCrm(stats: AgentStats | null, status: CrmStatus) {
  return stats?.crmBreakdown?.find((item) => item._id === status)?.count || 0;
}

function LeadStatusBadge({ status }: { status: CrmStatus }) {
  return <span className={cn("rounded-full border px-2.5 py-1 text-[11px] font-semibold", crmTone[status])}>{status}</span>;
}

function AutomationResults({ summary }: { summary: AutomationSummary | null }) {
  if (!summary) return null;

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm text-foreground">
      <p className="font-medium">Automation cycle completed</p>
      <p className="mt-1 text-muted-foreground">
        Scanned {summary.scanned} leads, sent {summary.initialOutreachSent} first-touch emails, {summary.followUpsSent} follow-ups, and marked {summary.markedLost} lost.
      </p>
    </div>
  );
}

export default function SalesAgentPage() {
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [logs, setLogs] = useState<SalesLog[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [form, setForm] = useState<LeadForm>(initialForm);
  const [formLoading, setFormLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [automationLoading, setAutomationLoading] = useState(false);
  const [actionLeadId, setActionLeadId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<CrmStatus | "all">("all");
  const [toast, setToast] = useState<string | null>(null);
  const [automationSummary, setAutomationSummary] = useState<AutomationSummary | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 4000);
  };

  const loadAll = useCallback(async () => {
    try {
      const [statsResponse, leadsResponse, logsResponse] = await Promise.all([
        api<{ data: AgentStats }>("/stats"),
        api<{ data: Lead[] }>(selectedStatus === "all" ? "/leads" : `/leads?crmStatus=${selectedStatus}`),
        api<{ data: SalesLog[] }>("/logs?limit=20"),
      ]);

      setStats(statsResponse.data);
      setLeads(leadsResponse.data || []);
      setLogs(logsResponse.data || []);
    } catch (error: any) {
      showToast(error.message);
    } finally {
      setPageLoading(false);
    }
  }, [selectedStatus]);

  useEffect(() => {
    loadAll();
    const interval = window.setInterval(loadAll, 30000);
    return () => window.clearInterval(interval);
  }, [loadAll]);

  const refreshSelectedLead = useCallback(async (leadId: string) => {
    try {
      const response = await api<{ data: Lead & { timeline?: SalesLog[] } }>(`/lead/${leadId}`);
      setSelectedLead(response.data);
    } catch {
      // keep page resilient if details fail
    }
  }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.course) return;
    setFormLoading(true);
    try {
      await api("/agent/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      showToast("Lead captured and first AI outreach sent.");
      setForm(initialForm);
      await loadAll();
    } catch (error: any) {
      showToast(error.message);
    } finally {
      setFormLoading(false);
    }
  };
  const handleLifecycle = async (leadId: string, crmStatus: "interested" | "closed" | "lost") => {
    setActionLeadId(leadId);
    try {
      await api(`/lead/${leadId}/lifecycle`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ crmStatus }),
      });
      showToast(`Lead marked ${crmStatus}.`);
      await loadAll();
      if (selectedLead?._id === leadId) {
        await refreshSelectedLead(leadId);
      }
    } catch (error: any) {
      showToast(error.message);
    } finally {
      setActionLeadId(null);
    }
  };

  const handleAutomationRun = async () => {
    setAutomationLoading(true);
    try {
      const response = await api<{ summary: AutomationSummary }>("/agent/automation/run", {
        method: "POST",
      });
      setAutomationSummary(response.summary);
      showToast("Automation engine executed.");
      await loadAll();
      if (selectedLead?._id) {
        await refreshSelectedLead(selectedLead._id);
      }
    } catch (error: any) {
      showToast(error.message);
    } finally {
      setAutomationLoading(false);
    }
  };

  const activeLeads = useMemo(() => leads.filter((lead) => !["closed", "lost"].includes(lead.crmStatus)).length, [leads]);
  const followUpDue = useMemo(
    () => leads.filter((lead) => lead.crmStatus === "contacted" && lead.nextFollowUpAt && new Date(lead.nextFollowUpAt) <= new Date()).length,
    [leads],
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground">
              <div className="rounded-2xl bg-primary/10 p-2.5 text-primary">
                <Sparkles className="h-6 w-6" />
              </div>
              AI Sales Agent
            </h1>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
              Autonomous lead nurturing system with AI-generated outreach, CRM lifecycle management, follow-up automation, and demo-mode controls for interested, closed, and lost outcomes.
            </p>
          </div>

          <Button onClick={handleAutomationRun} disabled={automationLoading} className="rounded-full">
            {automationLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            Run Automation
          </Button>
        </div>

        <AutomationResults summary={automationSummary} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <KpiCard title="Total Leads" value={stats?.totalLeads ?? 0} change={`${activeLeads} active`} changeType="neutral" icon={UserRoundPlus} delay={0} />
          <KpiCard title="Contacted" value={countByCrm(stats, "contacted")} change={`${followUpDue} due now`} changeType={followUpDue > 0 ? "negative" : "neutral"} icon={Mail} delay={0.05} />
          <KpiCard title="Interested" value={countByCrm(stats, "interested")} change="Nurturing" changeType="neutral" icon={Brain} delay={0.1} />
          <KpiCard title="Closed" value={countByCrm(stats, "closed")} change={stats?.conversionRate || "0% conversion"} changeType="positive" icon={CheckCircle2} delay={0.15} />
          <KpiCard title="Lost" value={countByCrm(stats, "lost")} change="Stopped after automation" changeType="negative" icon={XCircle} delay={0.2} />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[380px_minmax(0,1fr)_360px]">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-5">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
              <UserRoundPlus className="h-4 w-4 text-primary" />
              Lead Capture
            </div>
            <p className="mb-4 text-sm text-muted-foreground">Form submission creates a lead, sets CRM status to `new`, and immediately triggers the first AI email.</p>
            <div className="space-y-3">
              <Input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Full name" />
              <Input value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} placeholder="Email address" type="email" />
              <Input value={form.course} onChange={(e) => setForm((prev) => ({ ...prev, course: e.target.value }))} placeholder="Course / offer of interest" />
              <Input value={form.company} onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))} placeholder="Company (optional)" />
              <Input value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} placeholder="Phone (optional)" />
              <Button onClick={handleSubmit} disabled={formLoading || !form.name || !form.email || !form.course} className="w-full rounded-xl">
                {formLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Launch AI Outreach
              </Button>
            </div>

            <div className="mt-5 rounded-2xl bg-muted/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Automation Logic</p>
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <p>{"`new` to first email to `contacted`"}</p>
                <p>{"`contacted` plus no reply after 24h to follow-up"}</p>
                <p>{"After 3 unanswered follow-ups to `lost`"}</p>
                <p>Manual demo controls: `interested`, `closed`, `lost`</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-5">
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-sm font-semibold text-foreground">CRM Lifecycle Board</h2>
                <p className="text-sm text-muted-foreground">Central brain for lead nurturing, conversion funnel automation, and autonomous follow-ups.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {(["all", "new", "contacted", "interested", "closed", "lost"] as const).map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setSelectedStatus(status)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                      selectedStatus === status ? "border-primary/20 bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground",
                    )}
                  >
                    {status}
                  </button>
                ))}
                <Button variant="outline" size="sm" onClick={loadAll}>
                  <RefreshCw className="h-3.5 w-3.5" /> Refresh
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              {pageLoading ? (
                <div className="flex items-center justify-center py-12 text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading leads...</div>
              ) : leads.length === 0 ? (
                <div className="rounded-2xl bg-muted/30 px-4 py-10 text-center text-sm text-muted-foreground">No leads found for this lifecycle state yet.</div>
              ) : (
                leads.map((lead) => (
                  <button
                    key={lead._id}
                    type="button"
                    onClick={() => refreshSelectedLead(lead._id)}
                    className={cn(
                      "w-full rounded-2xl border p-4 text-left transition-colors hover:border-primary/30 hover:bg-muted/20",
                      selectedLead?._id === lead._id ? "border-primary/30 bg-primary/5" : "border-border",
                    )}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-foreground">{lead.name}</p>
                        <p className="text-sm text-muted-foreground">{lead.email}</p>
                        <p className="mt-1 text-xs text-muted-foreground">{lead.course || lead.interest || "General interest"} • {formatStage(lead.stage)}</p>
                      </div>
                      <LeadStatusBadge status={lead.crmStatus} />
                    </div>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>Follow-ups: {lead.followUpCount || 0}</span>
                      <span>Last contact: {timeAgo(lead.lastContactedAt)}</span>
                      <span>Next follow-up: {lead.nextFollowUpAt ? timeAgo(lead.nextFollowUpAt) : "Not scheduled"}</span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="glass-card rounded-3xl p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Bot className="h-4 w-4 text-primary" />
                Lead Intelligence
              </div>

              {!selectedLead ? (
                <div className="rounded-2xl bg-muted/30 px-4 py-10 text-center text-sm text-muted-foreground">Select a lead to inspect lifecycle status and run demo actions.</div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-foreground">{selectedLead.name}</h3>
                      <LeadStatusBadge status={selectedLead.crmStatus} />
                    </div>
                    <p className="text-sm text-muted-foreground">{selectedLead.email}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{selectedLead.course || selectedLead.interest || "No course set"}</p>
                  </div>

                  <div className="rounded-2xl bg-muted/30 p-4 text-sm text-muted-foreground">
                    <p>Current stage: <span className="font-medium text-foreground">{formatStage(selectedLead.stage)}</span></p>
                    <p className="mt-1">Reply status: <span className="font-medium text-foreground">{selectedLead.replyStatus || "none"}</span></p>
                    <p className="mt-1">Automation: <span className="font-medium text-foreground">{selectedLead.automationEnabled ? "Enabled" : "Disabled"}</span></p>
                    <p className="mt-1">Created: <span className="font-medium text-foreground">{timeAgo(selectedLead.createdAt)}</span></p>
                  </div>

                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Demo Controls</p>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" onClick={() => handleLifecycle(selectedLead._id, "interested")} disabled={actionLeadId === selectedLead._id || selectedLead.crmStatus === "interested"}>
                        {actionLeadId === selectedLead._id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Brain className="h-3.5 w-3.5" />}
                        Mark Interested
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleLifecycle(selectedLead._id, "closed")} disabled={actionLeadId === selectedLead._id || selectedLead.crmStatus === "closed"}>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Mark Closed
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleLifecycle(selectedLead._id, "lost")} disabled={actionLeadId === selectedLead._id || selectedLead.crmStatus === "lost"}>
                        <XCircle className="h-3.5 w-3.5" />
                        Mark Lost
                      </Button>
                    </div>
                  </div>

                  {selectedLead.notes && selectedLead.notes.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Notes</p>
                      <div className="space-y-2">
                        {selectedLead.notes.slice(-4).reverse().map((note, index) => (
                          <div key={index} className="rounded-2xl bg-background/60 p-3 text-sm text-muted-foreground">
                            <p>{note.text}</p>
                            <p className="mt-1 text-xs">{timeAgo(note.createdAt)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="glass-card rounded-3xl p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
                <Clock3 className="h-4 w-4 text-primary" />
                Recent Sales Activity
              </div>
              <div className="space-y-3">
                {pageLoading ? (
                  <div className="flex items-center justify-center py-8 text-sm text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading activity...</div>
                ) : logs.length === 0 ? (
                  <div className="rounded-2xl bg-muted/30 px-4 py-8 text-center text-sm text-muted-foreground">No sales activity yet.</div>
                ) : (
                  logs.map((log) => {
                    const leadName = typeof log.leadId === "object" ? log.leadId?.name : "Lead";
                    return (
                      <div key={log._id} className="rounded-2xl bg-background/50 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-foreground">{log.action}</p>
                          <span className="text-xs text-muted-foreground">{timeAgo(log.createdAt)}</span>
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{leadName ? `${leadName} • ` : ""}{log.detail}</p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-primary/20 bg-background px-4 py-3 text-sm text-foreground shadow-xl">
          {toast}
        </div>
      )}
    </DashboardLayout>
  );
}

