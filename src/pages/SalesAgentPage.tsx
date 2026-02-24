import { useState, useEffect, useCallback, useRef, useMemo } from "react";

// ─── API Config ───────────────────────────────────────────────────────────────
const API = "http://localhost:5000/sales";
const SESSION_ID = crypto.randomUUID();

async function api(path: string, opts?: RequestInit) {
  const res = await fetch(`${API}${path}`, opts);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "API error");
  return data;
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface Lead {
  _id: string;
  name: string;
  email: string;
  company: string;
  phone?: string;
  stage: string;
  temperature: string;
  dealValue?: number;
  bant?: { budget: number; authority: number; need: number; timeline: number };
  lastContactedAt?: string;
  isStale?: boolean;
  emails?: any[];
  notes?: any[];
  tasks?: any[];
  followUpTasks?: any[];
  createdAt?: string;
  updatedAt?: string;
}

interface Activity {
  _id: string;
  leadId?: any;
  type: string;
  emailType?: string;
  noteType?: string;
  stage?: string;
  createdAt: string;
}

interface ChatMsg {
  role: "user" | "agent";
  content: string;
  actionsLog?: any[];
  toolsUsed?: string[];
}

// ─── Constants ────────────────────────────────────────────────────────────────
const STAGES = [
  "NEW_LEAD", "CONTACTED", "QUALIFIED", "DEMO_SCHEDULED",
  "PROPOSAL_SENT", "NEGOTIATION", "CLOSED_WON", "CLOSED_LOST",
] as const;

const STAGE_COLORS: Record<string, { border: string; bg: string; text: string }> = {
  NEW_LEAD:       { border: "#64748B", bg: "rgba(100,116,139,0.10)", text: "#94A3B8" },
  CONTACTED:      { border: "#3B82F6", bg: "rgba(59,130,246,0.10)",  text: "#60A5FA" },
  QUALIFIED:      { border: "#6366F1", bg: "rgba(99,102,241,0.10)",  text: "#818CF8" },
  DEMO_SCHEDULED: { border: "#8B5CF6", bg: "rgba(139,92,246,0.10)",  text: "#A78BFA" },
  PROPOSAL_SENT:  { border: "#F59E0B", bg: "rgba(245,158,11,0.10)", text: "#FBBF24" },
  NEGOTIATION:    { border: "#F97316", bg: "rgba(249,115,22,0.10)", text: "#FB923C" },
  CLOSED_WON:     { border: "#22C55E", bg: "rgba(34,197,94,0.10)",  text: "#4ADE80" },
  CLOSED_LOST:    { border: "#EF4444", bg: "rgba(239,68,68,0.10)",  text: "#F87171" },
};

const TEMP_COLORS: Record<string, { bg: string; text: string }> = {
  HOT:  { bg: "rgba(239,68,68,0.15)", text: "#F87171" },
  WARM: { bg: "rgba(245,158,11,0.15)", text: "#FBBF24" },
  COOL: { bg: "rgba(59,130,246,0.15)", text: "#60A5FA" },
  COLD: { bg: "rgba(100,116,139,0.15)", text: "#94A3B8" },
};

const QUICK_ACTIONS = [
  { label: "📋 Show pipeline stats", msg: "Show pipeline stats" },
  { label: "🔥 Show hot leads", msg: "Show hot leads" },
  { label: "⚠️ Show stale leads", msg: "Show stale leads" },
  { label: "➕ Add new lead", msg: "Add a new lead" },
];

// ─── Utility ──────────────────────────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  if (!dateStr) return "";
  const ms = Date.now() - new Date(dateStr).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const d = Math.floor(hr / 24);
  return `${d}d ago`;
}

function daysSince(dateStr?: string): number {
  if (!dateStr) return 0;
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}

function fmtCurrency(v: number): string {
  if (v >= 1000000) return `$${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `$${(v / 1000).toFixed(0)}K`;
  return `$${v}`;
}

function stageName(s: string): string {
  return s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
const I = {
  Users: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Trophy: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>,
  TrendUp: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  Dollar: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  Clock: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Mail: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  File: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>,
  Phone: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 14 19.79 19.79 0 0 1 1.61 5.4 2 2 0 0 1 3.59 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17z"/></svg>,
  Send: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Trash: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>,
  X: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Bot: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>,
  Zap: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  Check: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  AlertTriangle: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  ChevronDown: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>,
  ChevronUp: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>,
  Sparkles: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>,
  Building: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>,
};

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-md bg-[#1E1E2E] ${className}`} />;
}

// ─── Error Toast ──────────────────────────────────────────────────────────────
function Toast({ msg, onClose }: { msg: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[999] flex items-center gap-3 rounded-xl border border-red-500/30 bg-[#111118] px-5 py-3.5 shadow-[0_8px_32px_rgba(239,68,68,0.2)]"
      style={{ animation: "slideUp 0.3s ease" }}>
      <div className="h-2 w-2 rounded-full bg-red-500 flex-shrink-0" />
      <p className="text-sm text-[#F1F5F9] max-w-[300px]">{msg}</p>
      <button onClick={onClose} className="text-[#64748B] hover:text-[#F1F5F9] ml-2 text-lg leading-none">×</button>
    </div>
  );
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar({ stats, loading }: { stats: any; loading: boolean }) {
  const items = [
    { label: "Total Leads", key: "totalLeads", icon: <I.Users />, color: "#6366F1" },
    { label: "Closed Won", key: "closedWon", icon: <I.Trophy />, color: "#22C55E" },
    { label: "Conversion Rate", key: "conversionRate", icon: <I.TrendUp />, color: "#6366F1", suffix: "%" },
    { label: "Pipeline Value", key: "pipelineValue", icon: <I.Dollar />, color: "#F59E0B", fmt: true },
    { label: "Stale Leads", key: "staleLeads", icon: <I.Clock />, color: "#EF4444", warnIf: true },
  ];

  return (
    <div className="grid grid-cols-5 gap-3">
      {items.map(it => (
        <div key={it.key} className="rounded-xl border border-[#1E1E2E] bg-[#111118] p-4 relative overflow-hidden group hover:border-[#2E2E3E] transition-colors">
          <div className="absolute top-3.5 right-3.5" style={{ color: it.warnIf && stats?.[it.key] > 0 ? "#EF4444" : it.color }}>
            {it.icon}
          </div>
          {loading ? (
            <>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-16" />
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-[#F1F5F9]" style={{ fontFamily: "'DM Mono', monospace" }}>
                {it.fmt ? fmtCurrency(stats?.[it.key] || 0) : (stats?.[it.key] ?? 0)}{it.suffix || ""}
              </p>
              <p className="text-xs text-[#64748B] mt-1">{it.label}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Lead Card (Kanban) ───────────────────────────────────────────────────────
function LeadCard({ lead, onClick }: { lead: Lead; onClick: () => void }) {
  const tmp = TEMP_COLORS[lead.temperature] || TEMP_COLORS.COOL;
  const days = daysSince(lead.lastContactedAt);

  return (
    <div onClick={onClick}
      className="rounded-lg border border-[#1E1E2E] bg-[#0A0A0F] p-3 cursor-pointer hover:border-[#6366F1]/30 hover:bg-[#111118] transition-all group">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-[#F1F5F9] truncate">{lead.name}</p>
          <p className="text-xs text-[#64748B] truncate flex items-center gap-1">
            <I.Building />{lead.company || "—"}
          </p>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ background: tmp.bg, color: tmp.text }}>
          {lead.temperature}
        </span>
      </div>
      <div className="flex items-center justify-between text-[10px] text-[#64748B]">
        {lead.dealValue && lead.dealValue > 0 ? (
          <span className="font-semibold text-[#FBBF24]" style={{ fontFamily: "'DM Mono', monospace" }}>
            {fmtCurrency(lead.dealValue)}
          </span>
        ) : <span />}
        <div className="flex items-center gap-1.5">
          {lead.isStale && <span title="Stale lead">⚠️</span>}
          {days > 0 && <span>{days}d ago</span>}
        </div>
      </div>
    </div>
  );
}

// ─── Pipeline Board ───────────────────────────────────────────────────────────
function PipelineBoard({ pipeline, loading, onLeadClick }: {
  pipeline: Record<string, Lead[]>; loading: boolean; onLeadClick: (id: string) => void;
}) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scroll-smooth" style={{ scrollbarWidth: "thin" }}>
      {STAGES.map(stage => {
        const leads = pipeline[stage] || [];
        const sc = STAGE_COLORS[stage];
        return (
          <div key={stage} className="min-w-[200px] max-w-[220px] flex-shrink-0">
            <div className="flex items-center gap-2 mb-2.5 px-1">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: sc.border }} />
              <span className="text-xs font-semibold text-[#F1F5F9] truncate">{stageName(stage)}</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md ml-auto flex-shrink-0"
                style={{ background: sc.bg, color: sc.text }}>
                {leads.length}
              </span>
            </div>
            <div className="rounded-xl border border-[#1E1E2E] bg-[#111118]/50 p-2 space-y-2 min-h-[120px]"
              style={{ borderLeftWidth: 3, borderLeftColor: sc.border }}>
              {loading ? (
                <>
                  <Skeleton className="h-[72px] w-full" />
                  <Skeleton className="h-[72px] w-full" />
                </>
              ) : leads.length === 0 ? (
                <p className="text-[10px] text-[#64748B] text-center py-6">No leads</p>
              ) : leads.map(l => (
                <LeadCard key={l._id} lead={l} onClick={() => onLeadClick(l._id)} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Activity Log ─────────────────────────────────────────────────────────────
function ActivityLog({ activities, loading }: { activities: Activity[]; loading: boolean }) {
  const iconFor = (type: string) => {
    if (type === "email") return <I.Mail />;
    if (type === "call") return <I.Phone />;
    return <I.File />;
  };

  return (
    <div className="rounded-xl border border-[#1E1E2E] bg-[#111118] p-4">
      <h3 className="text-sm font-semibold text-[#F1F5F9] mb-3 flex items-center gap-2">
        <span className="text-[#6366F1]"><I.Clock /></span> Recent Activity
      </h3>
      <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1" style={{ scrollbarWidth: "thin" }}>
        {loading ? Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        )) : activities.length === 0 ? (
          <p className="text-xs text-[#64748B] text-center py-6">No activity yet</p>
        ) : activities.slice(0, 15).map(a => {
          const leadName = typeof a.leadId === "object" ? (a.leadId?.name || "Unknown") : "Lead";
          const company = typeof a.leadId === "object" ? (a.leadId?.company || "") : "";
          const desc = a.emailType || a.noteType || a.type;

          return (
            <div key={a._id} className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-[#0A0A0F] transition-colors">
              <div className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 text-[#64748B]"
                style={{ background: "rgba(99,102,241,0.08)" }}>
                {iconFor(a.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[#F1F5F9] truncate">
                  <span className="font-semibold">{leadName}</span>
                  {company && <span className="text-[#64748B]"> · {company}</span>}
                </p>
                <p className="text-[10px] text-[#64748B] truncate">{desc}</p>
              </div>
              {a.stage && (
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                  style={{ background: STAGE_COLORS[a.stage]?.bg || "rgba(100,116,139,0.1)", color: STAGE_COLORS[a.stage]?.text || "#94A3B8" }}>
                  {stageName(a.stage)}
                </span>
              )}
              <span className="text-[10px] text-[#64748B] flex-shrink-0 whitespace-nowrap" style={{ fontFamily: "'DM Mono', monospace" }}>
                {timeAgo(a.createdAt)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Lead Drawer ──────────────────────────────────────────────────────────────
function LeadDrawer({ lead, loading, onClose }: { lead: Lead | null; loading: boolean; onClose: () => void }) {
  if (!lead && !loading) return null;

  const sc = lead ? STAGE_COLORS[lead.stage] : null;
  const tmp = lead ? TEMP_COLORS[lead.temperature] : null;

  return (
    <div className="fixed inset-0 z-[100]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-[440px] bg-[#0A0A0F] border-l border-[#1E1E2E] overflow-y-auto"
        style={{ animation: "slideInRight 0.25s ease" }}>
        <div className="sticky top-0 bg-[#0A0A0F]/95 backdrop-blur-sm border-b border-[#1E1E2E] p-4 flex items-center justify-between z-10">
          <h3 className="text-sm font-semibold text-[#F1F5F9]">Lead Details</h3>
          <button onClick={onClose} className="text-[#64748B] hover:text-[#F1F5F9] transition-colors"><I.X /></button>
        </div>
        <div className="p-5">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : lead ? (
            <div className="space-y-5">
              {/* Header */}
              <div>
                <h2 className="text-lg font-bold text-[#F1F5F9]">{lead.name}</h2>
                <p className="text-sm text-[#64748B] flex items-center gap-1.5 mt-0.5">
                  <I.Building /> {lead.company || "—"}
                </p>
                <div className="flex gap-2 mt-3">
                  {sc && (
                    <span className="text-[10px] font-bold px-2 py-1 rounded-md" style={{ background: sc.bg, color: sc.text }}>
                      {stageName(lead.stage)}
                    </span>
                  )}
                  {tmp && (
                    <span className="text-[10px] font-bold px-2 py-1 rounded-md" style={{ background: tmp.bg, color: tmp.text }}>
                      {lead.temperature}
                    </span>
                  )}
                </div>
              </div>

              {/* Contact */}
              <div className="rounded-lg border border-[#1E1E2E] bg-[#111118] p-3 space-y-2">
                <p className="text-xs text-[#64748B]">Contact</p>
                <div className="flex items-center gap-2 text-xs text-[#F1F5F9]"><I.Mail /> {lead.email}</div>
                {lead.phone && <div className="flex items-center gap-2 text-xs text-[#F1F5F9]"><I.Phone /> {lead.phone}</div>}
              </div>

              {/* Deal value */}
              {lead.dealValue != null && lead.dealValue > 0 && (
                <div className="rounded-lg border border-[#1E1E2E] bg-[#111118] p-3">
                  <p className="text-xs text-[#64748B] mb-1">Deal Value</p>
                  <p className="text-xl font-bold text-[#FBBF24]" style={{ fontFamily: "'DM Mono', monospace" }}>
                    {fmtCurrency(lead.dealValue)}
                  </p>
                </div>
              )}

              {/* BANT */}
              {lead.bant && (
                <div className="rounded-lg border border-[#1E1E2E] bg-[#111118] p-3 space-y-3">
                  <p className="text-xs text-[#64748B]">BANT Scores</p>
                  {["budget", "authority", "need", "timeline"].map(dim => (
                    <div key={dim}>
                      <div className="flex justify-between text-[10px] mb-1">
                        <span className="text-[#94A3B8] capitalize">{dim}</span>
                        <span className="text-[#F1F5F9] font-bold" style={{ fontFamily: "'DM Mono', monospace" }}>
                          {(lead.bant as any)[dim]}/10
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[#1E1E2E] overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{
                          width: `${((lead.bant as any)[dim] / 10) * 100}%`,
                          background: `linear-gradient(90deg, #6366F1, #818CF8)`,
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Emails */}
              {lead.emails && lead.emails.length > 0 && (
                <div className="rounded-lg border border-[#1E1E2E] bg-[#111118] p-3">
                  <p className="text-xs text-[#64748B] mb-2">Email Log ({lead.emails.length})</p>
                  <div className="space-y-2 max-h-[160px] overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
                    {lead.emails.map((e: any, i: number) => (
                      <div key={i} className="text-[11px] border-l-2 border-[#6366F1]/30 pl-2.5 py-1">
                        <p className="text-[#F1F5F9] font-medium">{e.type || e.emailType || "Email"}</p>
                        <p className="text-[#64748B] truncate">{e.subject || ""}</p>
                        <p className="text-[10px] text-[#64748B]" style={{ fontFamily: "'DM Mono', monospace" }}>{timeAgo(e.sentAt || e.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {lead.notes && lead.notes.length > 0 && (
                <div className="rounded-lg border border-[#1E1E2E] bg-[#111118] p-3">
                  <p className="text-xs text-[#64748B] mb-2">Notes ({lead.notes.length})</p>
                  <div className="space-y-2 max-h-[160px] overflow-y-auto" style={{ scrollbarWidth: "thin" }}>
                    {lead.notes.map((n: any, i: number) => (
                      <div key={i} className="text-[11px] border-l-2 border-[#F59E0B]/30 pl-2.5 py-1">
                        <p className="text-[#F1F5F9]">{n.content || n.text || n.note || JSON.stringify(n)}</p>
                        <p className="text-[10px] text-[#64748B]" style={{ fontFamily: "'DM Mono', monospace" }}>{timeAgo(n.createdAt)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Follow-up Tasks */}
              {((lead.tasks && lead.tasks.length > 0) || (lead.followUpTasks && lead.followUpTasks.length > 0)) && (
                <div className="rounded-lg border border-[#1E1E2E] bg-[#111118] p-3">
                  <p className="text-xs text-[#64748B] mb-2">Follow-up Tasks</p>
                  <div className="space-y-1.5">
                    {(lead.followUpTasks || lead.tasks || []).map((t: any, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-[11px]">
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 ${t.completed ? "bg-[#22C55E]/20 border-[#22C55E]/40 text-[#22C55E]" : "border-[#1E1E2E]"}`}>
                          {t.completed && <I.Check />}
                        </div>
                        <span className={`${t.completed ? "text-[#64748B] line-through" : "text-[#F1F5F9]"}`}>
                          {t.description || t.task || t.title || JSON.stringify(t)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ─── Tools Used Accordion ─────────────────────────────────────────────────────
function ToolsAccordion({ actionsLog }: { actionsLog: any[] }) {
  const [open, setOpen] = useState(false);
  if (!actionsLog || actionsLog.length === 0) return null;

  return (
    <div className="mt-2">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-[11px] text-[#6366F1] hover:text-[#818CF8] transition-colors">
        <I.Zap /> <span className="font-semibold">{actionsLog.length} tool{actionsLog.length > 1 ? "s" : ""} used</span>
        {open ? <I.ChevronUp /> : <I.ChevronDown />}
      </button>
      {open && (
        <div className="mt-2 space-y-1.5 pl-1">
          {actionsLog.map((tool: any, i: number) => (
            <div key={i} className="flex items-start gap-2 text-[10px] rounded-md bg-[#0A0A0F] border border-[#1E1E2E] p-2">
              <span className={`mt-0.5 flex-shrink-0 ${tool.error ? "text-red-400" : "text-green-400"}`}>
                {tool.error ? <I.X /> : <I.Check />}
              </span>
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-[#94A3B8]" style={{ fontFamily: "'DM Mono', monospace" }}>
                  {tool.tool || tool.name || `Tool ${i + 1}`}
                </span>
                {tool.result && (
                  <pre className="text-[#64748B] mt-1 overflow-hidden text-ellipsis whitespace-pre-wrap"
                    style={{ maxHeight: 48, fontFamily: "'DM Mono', monospace" }}>
                    {typeof tool.result === "string" ? tool.result.slice(0, 200) : JSON.stringify(tool.result, null, 1).slice(0, 200)}
                  </pre>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Chat Component ───────────────────────────────────────────────────────────
function AgentChat({ onNewActivity }: { onNewActivity: () => void }) {
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    {
      role: "agent",
      content: "👋 Hi! I'm your Sales Agent. I can help you manage leads, send emails, schedule demos, close deals, and track your pipeline. What would you like to do?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  const autoResize = () => {
    const el = textareaRef.current;
    if (el) { el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 96) + "px"; }
  };

  const send = async (text?: string) => {
    const message = (text || input).trim();
    if (!message || loading) return;
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setMsgs(p => [...p, { role: "user", content: message }]);
    setLoading(true);
    try {
      const res = await api("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, sessionId: SESSION_ID }),
      });
      setMsgs(p => [...p, {
        role: "agent",
        content: res.reply || res.response || res.message || "",
        actionsLog: res.actionsLog || res.actions || [],
        toolsUsed: res.toolsUsed || [],
      }]);
      onNewActivity();
    } catch (err: any) {
      setMsgs(p => [...p, { role: "agent", content: `❌ Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = async () => {
    try { await fetch(`${API}/chat/${SESSION_ID}`, { method: "DELETE" }); } catch {}
    setMsgs([{
      role: "agent",
      content: "👋 Chat cleared! How can I help you?",
    }]);
  };

  return (
    <div className="flex flex-col h-full rounded-xl border border-[#1E1E2E] bg-[#111118] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1E1E2E] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#6366F1]/10 flex items-center justify-center text-[#6366F1]"><I.Bot /></div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#F1F5F9]">Sales Agent</span>
              <span className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)]" style={{ animation: "pulse 2s infinite" }} />
            </div>
            <p className="text-[10px] text-[#64748B]">Powered by Groq · llama-3.3-70b</p>
          </div>
        </div>
        <button onClick={clearChat} className="text-[#64748B] hover:text-red-400 transition-colors p-1.5 rounded-md hover:bg-red-500/10" title="Clear chat">
          <I.Trash />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollbarWidth: "thin" }}>
        {msgs.map((m, i) =>
          m.role === "user" ? (
            /* User bubble */
            <div key={i} className="flex justify-end gap-2">
              <div className="max-w-[85%] rounded-xl rounded-br-sm px-4 py-2.5 text-sm text-white bg-[#6366F1]">
                {m.content}
              </div>
              <div className="w-7 h-7 rounded-full bg-[#6366F1]/20 flex items-center justify-center text-[10px] font-bold text-[#6366F1] flex-shrink-0">
                You
              </div>
            </div>
          ) : (
            /* Agent bubble */
            <div key={i} className="flex gap-2">
              <div className="w-7 h-7 rounded-full bg-[#6366F1]/10 flex items-center justify-center flex-shrink-0 text-[#6366F1]">
                <I.Bot />
              </div>
              <div className="max-w-[85%]">
                <div className="rounded-xl rounded-bl-sm px-4 py-2.5 text-sm text-[#F1F5F9] bg-[#0A0A0F] border border-[#1E1E2E] border-l-2 border-l-[#6366F1]"
                  dangerouslySetInnerHTML={{ __html: m.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>") }}>
                </div>
                {m.actionsLog && <ToolsAccordion actionsLog={m.actionsLog} />}
              </div>
            </div>
          )
        )}

        {/* Loading bubbles */}
        {loading && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-[#6366F1]/10 flex items-center justify-center flex-shrink-0 text-[#6366F1]">
              <I.Bot />
            </div>
            <div className="rounded-xl rounded-bl-sm px-4 py-3 bg-[#0A0A0F] border border-[#1E1E2E] border-l-2 border-l-[#6366F1] flex items-center gap-1.5">
              <span className="text-xs text-[#64748B]">Agent is thinking</span>
              <span className="flex gap-1">
                {[0, 1, 2].map(d => (
                  <span key={d} className="w-1.5 h-1.5 rounded-full bg-[#6366F1]"
                    style={{ animation: `bounce 1.2s ease-in-out ${d * 0.2}s infinite` }} />
                ))}
              </span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick actions + Input */}
      <div className="border-t border-[#1E1E2E] p-3 flex-shrink-0">
        <div className="flex flex-wrap gap-1.5 mb-2.5">
          {QUICK_ACTIONS.map(qa => (
            <button key={qa.msg} onClick={() => send(qa.msg)}
              className="text-[10px] font-medium text-[#64748B] bg-[#0A0A0F] border border-[#1E1E2E] rounded-lg px-2.5 py-1 hover:border-[#6366F1]/40 hover:text-[#818CF8] transition-all">
              {qa.label}
            </button>
          ))}
        </div>
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={e => { setInput(e.target.value); autoResize(); }}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }}}
            placeholder="Ask the agent anything..."
            className="flex-1 bg-[#0A0A0F] border border-[#1E1E2E] rounded-xl px-3.5 py-2.5 text-sm text-[#F1F5F9] placeholder-[#64748B] outline-none focus:border-[#6366F1]/50 resize-none transition-colors"
            style={{ maxHeight: 96 }}
          />
          <button onClick={() => send()} disabled={loading || !input.trim()}
            className="w-9 h-9 rounded-xl bg-[#6366F1] flex items-center justify-center text-white flex-shrink-0 disabled:opacity-40 hover:bg-[#5558E3] transition-colors">
            <I.Send />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Stale Banner ─────────────────────────────────────────────────────────────
function StaleBanner({ count, onReview }: { count: number; onReview: () => void }) {
  if (count <= 0) return null;
  return (
    <div className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 mb-3">
      <div className="flex items-center gap-2 text-sm text-red-400">
        <I.AlertTriangle />
        <span className="font-semibold">{count} lead{count > 1 ? "s" : ""} need attention</span>
      </div>
      <button onClick={onReview}
        className="text-xs font-semibold text-red-400 border border-red-500/30 rounded-lg px-3 py-1 hover:bg-red-500/10 transition-colors">
        Review
      </button>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function SalesAgentPage() {
  // ─── State ──────────────────────────────────────────────────────────────
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [pipeline, setPipeline] = useState<Record<string, Lead[]>>({});
  const [pipelineLoading, setPipelineLoading] = useState(true);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [staleCount, setStaleCount] = useState(0);
  const [showStaleOnly, setShowStaleOnly] = useState(false);
  const [drawerLeadId, setDrawerLeadId] = useState<string | null>(null);
  const [drawerLead, setDrawerLead] = useState<Lead | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showError = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 5000); };

  // ─── Fetch functions ────────────────────────────────────────────────────
  const fetchStats = useCallback(async () => {
    try {
      const data = await api("/stats");
      setStats(data.data || data.stats || data);
    } catch (e: any) { showError(`Stats error: ${e.message}`); }
    finally { setStatsLoading(false); }
  }, []);

  const fetchPipeline = useCallback(async () => {
    try {
      const data = await api("/pipeline");
      const raw = data.data || data.pipeline || data;
      // Could be an array of leads or an object keyed by stage
      if (Array.isArray(raw)) {
        const grouped: Record<string, Lead[]> = {};
        STAGES.forEach(s => grouped[s] = []);
        raw.forEach((l: Lead) => {
          const stage = l.stage || "NEW_LEAD";
          if (!grouped[stage]) grouped[stage] = [];
          grouped[stage].push(l);
        });
        setPipeline(grouped);
      } else {
        // Already keyed by stage
        const grouped: Record<string, Lead[]> = {};
        STAGES.forEach(s => grouped[s] = raw[s] || []);
        setPipeline(grouped);
      }
    } catch (e: any) { showError(`Pipeline error: ${e.message}`); }
    finally { setPipelineLoading(false); }
  }, []);

  const fetchActivity = useCallback(async () => {
    try {
      const data = await api("/activity");
      setActivities(data.data || data.activities || data || []);
    } catch (e: any) { showError(`Activity error: ${e.message}`); }
    finally { setActivityLoading(false); }
  }, []);

  const fetchStale = useCallback(async () => {
    try {
      const data = await api("/stale");
      const arr = data.data || data.leads || data;
      setStaleCount(Array.isArray(arr) ? arr.length : (data.count || 0));
    } catch {} // silent fail
  }, []);

  // ─── Lead drawer ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!drawerLeadId) { setDrawerLead(null); return; }
    let cancelled = false;
    setDrawerLoading(true);
    api(`/leads/${drawerLeadId}`).then(data => {
      if (!cancelled) setDrawerLead(data.data || data.lead || data);
    }).catch(e => showError(`Lead error: ${e.message}`))
      .finally(() => { if (!cancelled) setDrawerLoading(false); });
    return () => { cancelled = true; };
  }, [drawerLeadId]);

  // ─── Initial load + intervals ───────────────────────────────────────────
  useEffect(() => {
    fetchStats(); fetchPipeline(); fetchActivity(); fetchStale();
    const statsIv = setInterval(fetchStats, 30000);
    const actIv = setInterval(fetchActivity, 60000);
    return () => { clearInterval(statsIv); clearInterval(actIv); };
  }, [fetchStats, fetchPipeline, fetchActivity, fetchStale]);

  const refreshAll = useCallback(() => {
    setTimeout(() => { fetchStats(); fetchPipeline(); fetchActivity(); fetchStale(); }, 1500);
  }, [fetchStats, fetchPipeline, fetchActivity, fetchStale]);

  // ─── Pipeline filtering (stale) ─────────────────────────────────────────
  const displayPipeline = useMemo(() => {
    if (!showStaleOnly) return pipeline;
    const filtered: Record<string, Lead[]> = {};
    STAGES.forEach(s => {
      filtered[s] = (pipeline[s] || []).filter(l => l.isStale);
    });
    return filtered;
  }, [pipeline, showStaleOnly]);

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=DM+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
        .sales-page { font-family: 'DM Sans', system-ui, sans-serif; }
        .sales-page ::-webkit-scrollbar { width: 4px; height: 4px; }
        .sales-page ::-webkit-scrollbar-track { background: transparent; }
        .sales-page ::-webkit-scrollbar-thumb { background: #1E1E2E; border-radius: 4px; }
      `}</style>

      <div className="sales-page min-h-screen bg-[#0A0A0F] text-[#F1F5F9]">
        {/* Page Header */}
        <div className="px-6 pt-5 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#6366F1]/10 flex items-center justify-center text-[#6366F1]"><I.Sparkles /></div>
            <div>
              <h1 className="text-lg font-bold text-[#F1F5F9]">Sales Agent</h1>
              <p className="text-xs text-[#64748B]">AI-powered lead management & deal pipeline</p>
            </div>
          </div>
        </div>

        {/* Main split layout */}
        <div className="flex gap-4 px-6 pb-6" style={{ height: "calc(100vh - 80px)" }}>

          {/* ─── LEFT PANEL (60%) ─────────────────────────────────── */}
          <div className="w-[60%] flex flex-col gap-4 min-h-0">
            {/* Stale Banner */}
            <StaleBanner count={staleCount} onReview={() => setShowStaleOnly(prev => !prev)} />

            {/* Stats */}
            <StatsBar stats={stats} loading={statsLoading} />

            {/* Pipeline Kanban */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <div className="flex items-center justify-between mb-2.5">
                <h2 className="text-sm font-semibold text-[#F1F5F9]">Pipeline</h2>
                {showStaleOnly && (
                  <button onClick={() => setShowStaleOnly(false)}
                    className="text-[10px] text-[#6366F1] font-semibold border border-[#6366F1]/30 rounded-lg px-2.5 py-1 hover:bg-[#6366F1]/10 transition-colors">
                    Show All
                  </button>
                )}
              </div>
              <div className="h-[calc(100%-32px)] overflow-y-auto overflow-x-auto" style={{ scrollbarWidth: "thin" }}>
                <PipelineBoard pipeline={displayPipeline} loading={pipelineLoading} onLeadClick={setDrawerLeadId} />
              </div>
            </div>

            {/* Activity Log */}
            <div className="flex-shrink-0">
              <ActivityLog activities={activities} loading={activityLoading} />
            </div>
          </div>

          {/* ─── RIGHT PANEL (40%) ────────────────────────────────── */}
          <div className="w-[40%] min-h-0">
            <AgentChat onNewActivity={refreshAll} />
          </div>
        </div>
      </div>

      {/* Lead Drawer */}
      {(drawerLeadId) && (
        <LeadDrawer lead={drawerLead} loading={drawerLoading} onClose={() => setDrawerLeadId(null)} />
      )}

      {/* Error Toast */}
      {toast && <Toast msg={toast} onClose={() => setToast(null)} />}
    </>
  );
}
