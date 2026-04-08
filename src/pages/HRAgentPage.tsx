import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  Brain,
  Briefcase,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Clock3,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Search,
  Send,
  Sparkles,
  Trophy,
  Upload,
  User,
  UserPlus,
  Video,
  X,
  GraduationCap,
  Star,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const API_BASE = "http://localhost:5000";

type CandidateStatus = "applied" | "screening" | "shortlisted" | "interview_scheduled" | "hired" | "rejected";
type LogType = "apply" | "screen" | "schedule" | "hire" | "reject" | "email";
type ToastType = "success" | "error" | "info";

type Candidate = {
  id: string | number;
  name: string;
  email: string;
  phone: string;
  position: string;
  location: string;
  experience: string;
  education: string;
  resumeScore: number | null;
  status: CandidateStatus;
  appliedAt: string;
  interviewDate: string | null;
  meetLink: string | null;
  notes: string;
};

type ActivityLog = {
  id: string | number;
  type: LogType;
  action: string;
  detail: string;
  time: string;
};

type ApplicationFormValues = {
  name: string;
  email: string;
  phone: string;
  position: string;
  location: string;
  experience: string;
  education: string;
  resumeText: string;
  resumeFile: File | null;
};

type StatusConfigItem = {
  label: string;
  badgeClassName: string;
  iconClassName: string;
};

const statusConfig: Record<CandidateStatus, StatusConfigItem> = {
  applied: {
    label: "Applied",
    badgeClassName: "bg-primary/10 text-primary border-primary/20",
    iconClassName: "text-primary bg-primary/10",
  },
  screening: {
    label: "AI Screening",
    badgeClassName: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    iconClassName: "text-amber-500 bg-amber-500/10",
  },
  shortlisted: {
    label: "Shortlisted",
    badgeClassName: "bg-accent/10 text-accent border-accent/20",
    iconClassName: "text-accent bg-accent/10",
  },
  interview_scheduled: {
    label: "Interview Scheduled",
    badgeClassName: "bg-violet-500/10 text-violet-500 border-violet-500/20",
    iconClassName: "text-violet-500 bg-violet-500/10",
  },
  hired: {
    label: "Hired",
    badgeClassName: "bg-success/10 text-success border-success/20",
    iconClassName: "text-success bg-success/10",
  },
  rejected: {
    label: "Rejected",
    badgeClassName: "bg-destructive/10 text-destructive border-destructive/20",
    iconClassName: "text-destructive bg-destructive/10",
  },
};

const logStyleMap: Record<LogType, { icon: typeof UserPlus; className: string }> = {
  apply: { icon: UserPlus, className: "bg-primary/10 text-primary" },
  screen: { icon: Brain, className: "bg-amber-500/10 text-amber-500" },
  schedule: { icon: Calendar, className: "bg-violet-500/10 text-violet-500" },
  hire: { icon: Trophy, className: "bg-success/10 text-success" },
  reject: { icon: X, className: "bg-destructive/10 text-destructive" },
  email: { icon: Mail, className: "bg-accent/10 text-accent" },
};

const logTypeMap: Record<string, LogType> = {
  "Application Received": "apply",
  "AI Screening": "screen",
  "Interview Scheduled": "schedule",
  "Candidate Hired": "hire",
  "Candidate Rejected": "reject",
  "Email Sent": "email",
  "Shortlist Email": "email",
  "Rejection Email": "email",
  "Offer Letter": "email",
  "Onboarding Plan": "email",
};

const initialFormValues: ApplicationFormValues = {
  name: "",
  email: "",
  phone: "",
  position: "",
  location: "",
  experience: "",
  education: "",
  resumeText: "",
  resumeFile: null,
};

async function apiCall(endpoint: string, body: unknown) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "API error");
  return data;
}

function formatTimeAgo(timestamp: string | Date): string {
  if (!timestamp) return "Unknown";

  const ts = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - ts.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin} min ago`;
  if (diffHr < 24) return `${diffHr} hour${diffHr > 1 ? "s" : ""} ago`;
  if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? "s" : ""} ago`;

  return ts.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

function guessLogType(action: string): LogType {
  for (const [key, type] of Object.entries(logTypeMap)) {
    if (action.toLowerCase().includes(key.toLowerCase())) return type;
  }
  if (action.toLowerCase().includes("screen") || action.toLowerCase().includes("score")) return "screen";
  if (action.toLowerCase().includes("interview") || action.toLowerCase().includes("schedule")) return "schedule";
  if (action.toLowerCase().includes("hire") || action.toLowerCase().includes("offer")) return "hire";
  if (action.toLowerCase().includes("reject")) return "reject";
  if (action.toLowerCase().includes("email") || action.toLowerCase().includes("sent")) return "email";
  return "apply";
}

function ScoreBadge({ score }: { score: number | null }) {
  if (score === null) {
    return <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">Pending</span>;
  }

  const className =
    score >= 70
      ? "bg-success/10 text-success"
      : score >= 50
        ? "bg-amber-500/10 text-amber-500"
        : "bg-destructive/10 text-destructive";

  return <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-semibold", className)}>{score}/100</span>;
}

function ApplicationForm({ onSubmit, onClose, loading }: { onSubmit: (form: ApplicationFormValues) => Promise<void>; onClose: () => void; loading: boolean }) {
  const [form, setForm] = useState<ApplicationFormValues>(initialFormValues);

  const setField = <K extends keyof ApplicationFormValues>(key: K, value: ApplicationFormValues[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const fields = [
    { key: "name", label: "Full Name", placeholder: "John Doe", icon: User, type: "text" },
    { key: "email", label: "Email Address", placeholder: "john@example.com", icon: Mail, type: "email" },
    { key: "phone", label: "Phone Number", placeholder: "+91 99999 99999", icon: Phone, type: "text" },
    { key: "position", label: "Position Applied", placeholder: "Senior Frontend Developer", icon: Briefcase, type: "text" },
    { key: "location", label: "Location", placeholder: "Bangalore, India", icon: MapPin, type: "text" },
    { key: "experience", label: "Experience", placeholder: "5 years", icon: Clock3, type: "text" },
    { key: "education", label: "Education", placeholder: "B.Tech CS, IIT Delhi", icon: GraduationCap, type: "text" },
  ] as const;

  const canSubmit = form.name && form.email && form.position;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 px-4 py-6 backdrop-blur-md" onClick={onClose}>
      <div className="glass-card w-full max-w-2xl  h-[700px] overflow-y-auto  rounded-3xl border border-border/60 p-6 shadow-2xl no-scrollbar " onClick={(event) => event.stopPropagation()}>
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-xl font-semibold text-foreground">
              <UserPlus className="h-5 w-5 text-primary" />
              New Application
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">Submit a candidate and let the HR automation pipeline take it from screening to offer.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {fields.map((field) => {
            const Icon = field.icon;
            return (
              <label key={field.key} className="space-y-2">
                <span className="text-sm font-medium text-foreground">{field.label}</span>
                <div className="relative">
                  <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type={field.type}
                    value={form[field.key] as string}
                    onChange={(event) => setField(field.key, event.target.value as never)}
                    placeholder={field.placeholder}
                    className="pl-9"
                  />
                </div>
              </label>
            );
          })}
        </div>
        <div className="mt-4 space-y-2">
          <span className="text-sm font-medium text-foreground">Upload Resume</span>
          <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 transition-colors hover:bg-primary/10">
            <div className="rounded-xl bg-primary/10 p-2 text-primary">
              <Upload className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{form.resumeFile ? form.resumeFile.name : "Click to upload PDF, DOC, or DOCX"}</p>
              <p className="text-xs text-muted-foreground">Maximum 5MB. Optional, but recommended for better AI screening.</p>
            </div>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={(event) => setField("resumeFile", event.target.files?.[0] || null)}
            />
          </label>
        </div>

        <div className="mt-4 space-y-2">
          <span className="text-sm font-medium text-foreground">Resume / Skills Summary</span>
          <Textarea
            rows={5}
            value={form.resumeText}
            onChange={(event) => setField("resumeText", event.target.value)}
            placeholder="Paste resume text or summarize skills, experience, and achievements..."
          />
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button disabled={loading || !canSubmit} onClick={() => canSubmit && onSubmit(form)}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {loading ? "Submitting..." : "Submit Application"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ActionButton({ onClick, label, icon: Icon, variant = "secondary", disabled = false }: { onClick: () => void; label: string; icon: typeof UserPlus; variant?: "secondary" | "destructive" | "default"; disabled?: boolean }) {
  return (
    <Button variant={variant} size="sm" onClick={onClick} disabled={disabled} className="rounded-full">
      <Icon className="h-3.5 w-3.5" />
      {label}
    </Button>
  );
}

function CandidateCard({ candidate, onAction, actionLoading }: { candidate: Candidate; onAction: (id: Candidate["id"], action: "screen" | "schedule" | "hire" | "reject", candidate: Candidate) => Promise<void>; actionLoading: Candidate["id"] | null }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = statusConfig[candidate.status];
  const isLoading = actionLoading === candidate.id;

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card-hover overflow-hidden rounded-3xl border border-border/60">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <div className={cn("rounded-2xl p-3", cfg.iconClassName)}>
              <User className="h-5 w-5" />
            </div>
            <div className="min-w-0 space-y-2">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <h3 className="truncate text-lg font-semibold text-foreground">{candidate.name}</h3>
                <span className={cn("inline-flex w-fit items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold", cfg.badgeClassName)}>
                  {cfg.label}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{candidate.position}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{candidate.location}</span>
                <span className="flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" />{candidate.experience}</span>
                <span className="flex items-center gap-1.5"><GraduationCap className="h-3.5 w-3.5" />{candidate.education}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>AI Score</span>
              <ScoreBadge score={candidate.resumeScore} />
            </div>
            <span className="text-xs text-muted-foreground">{candidate.appliedAt}</span>
          </div>
        </div>

        {candidate.interviewDate && (
          <div className="mt-4 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-4">
            <div className="flex items-start gap-3">
              <Calendar className="mt-0.5 h-4 w-4 text-violet-500" />
              <div>
                <p className="text-sm font-medium text-foreground">{candidate.interviewDate}</p>
                {candidate.meetLink && (
                  <a href={candidate.meetLink} target="_blank" rel="noreferrer" className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
                    <Video className="h-3.5 w-3.5" />
                    Join Google Meet
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-border bg-background/40 px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
        >
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          {expanded ? "Hide details and actions" : "Show details and actions"}
        </button>
      </div>

      {expanded && (
        <div className="border-t border-border/60 bg-muted/20 px-5 py-5 sm:px-6">
          {candidate.notes && (
            <div className="mb-4 rounded-2xl bg-background/70 p-4">
              <p className="text-sm font-medium text-foreground">AI Notes</p>
              <p className="mt-1 text-sm text-muted-foreground">{candidate.notes}</p>
            </div>
          )}

          <div className="mb-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-2"><Mail className="h-4 w-4" />{candidate.email}</span>
            <span className="flex items-center gap-2"><Phone className="h-4 w-4" />{candidate.phone}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {isLoading && (
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-500/10 px-4 py-2 text-sm font-medium text-amber-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing request...
              </div>
            )}

            {!isLoading && candidate.status === "applied" && (
              <ActionButton onClick={() => onAction(candidate.id, "screen", candidate)} icon={Brain} label="Screen with AI" />
            )}

            {!isLoading && candidate.status === "shortlisted" && (
              <>
                <ActionButton onClick={() => onAction(candidate.id, "schedule", candidate)} icon={Calendar} label="Schedule Interview" />
                <ActionButton onClick={() => onAction(candidate.id, "reject", candidate)} icon={X} label="Reject" variant="destructive" />
              </>
            )}
            {!isLoading && candidate.status === "interview_scheduled" && (
              <>
                <ActionButton onClick={() => onAction(candidate.id, "hire", candidate)} icon={Check} label="Hire Candidate" variant="default" />
                <ActionButton onClick={() => onAction(candidate.id, "reject", candidate)} icon={X} label="Reject After Interview" variant="destructive" />
              </>
            )}

            {!isLoading && candidate.status === "hired" && (
              <div className="inline-flex items-center gap-2 rounded-full bg-success/10 px-4 py-2 text-sm font-medium text-success">
                <Trophy className="h-4 w-4" />
                Offer sent and onboarding started
              </div>
            )}

            {!isLoading && candidate.status === "rejected" && (
              <div className="inline-flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive">
                <AlertCircle className="h-4 w-4" />
                Rejection email sent
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}

function FlowDiagram() {
  const steps = [
    { icon: UserPlus, label: "Apply", desc: "POST /hr/apply", iconClassName: "bg-primary/10 text-primary" },
    { icon: Brain, label: "AI Screen", desc: "Auto-score resumes", iconClassName: "bg-amber-500/10 text-amber-500" },
    { icon: Calendar, label: "Interview", desc: "Calendar + Meet link", iconClassName: "bg-violet-500/10 text-violet-500" },
    { icon: Trophy, label: "Hire", desc: "Offer + onboarding", iconClassName: "bg-success/10 text-success" },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-2">
      {steps.map((step, index) => {
        const Icon = step.icon;
        return (
          <div key={step.label} className="flex items-center gap-4">
            <div className="min-w-[150px] rounded-2xl border border-border/60 bg-background/60 p-4 text-center">
              <div className={cn("mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl", step.iconClassName)}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-foreground">{step.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{step.desc}</p>
            </div>
            {index < steps.length - 1 && <ArrowRight className="hidden h-4 w-4 shrink-0 text-muted-foreground sm:block" />}
          </div>
        );
      })}
    </div>
  );
}

function Toast({ message, type, onClose }: { message: string; type: ToastType; onClose: () => void }) {
  const tone = {
    success: "bg-success/10 text-success border-success/20",
    error: "bg-destructive/10 text-destructive border-destructive/20",
    info: "bg-primary/10 text-primary border-primary/20",
  }[type];

  return (
    <div className={cn("fixed bottom-6 right-6 z-50 flex max-w-sm items-center gap-3 rounded-2xl border px-4 py-3 shadow-xl backdrop-blur-xl", tone)}>
      <div className="h-2.5 w-2.5 rounded-full bg-current" />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button type="button" onClick={onClose} className="text-current/70 transition-opacity hover:opacity-100">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function HRAgentPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [candidatesLoading, setCandidatesLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | CandidateStatus>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [actionLoading, setActionLoading] = useState<Candidate["id"] | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const fetchCandidates = useCallback(async () => {
    try {
      setCandidatesLoading(true);
      const res = await fetch(`${API_BASE}/hr/candidates`);
      const data = await res.json();
      const rawCandidates = data.data || data.candidates || data.result || [];
      const mapped = rawCandidates.map((candidate: any) => ({
        id: candidate._id || candidate.id || Date.now(),
        name: candidate.candidateName || candidate.name || "Unknown",
        email: candidate.email || "-",
        phone: candidate.phone || "-",
        position: candidate.jobRole || candidate.position || "-",
        location: candidate.location || "-",
        experience: candidate.experience || "-",
        education: candidate.education || "-",
        resumeScore: candidate.score || candidate.resumeScore || null,
        status: candidate.status || "applied",
        appliedAt: formatTimeAgo(candidate.createdAt || candidate.created_at || new Date()),
        interviewDate: candidate.interviewDate || null,
        meetLink: candidate.meetLink || null,
        notes: candidate.summary || candidate.notes || "",
      }));
      setCandidates(mapped);
    } catch (error) {
      console.error("Failed to fetch candidates:", error);
    } finally {
      setCandidatesLoading(false);
    }
  }, []);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/hr/logs`);
      const data = await res.json();
      const rawLogs = Array.isArray(data) ? data : data.data || data.logs || data.result || [];
      const mapped = rawLogs.map((log: any, index: number) => ({
        id: log.id || log._id || `${Date.now()}-${index}`,
        type: (log.type || guessLogType(log.action || "")) as LogType,
        action: log.action || "Activity",
        detail: log.detail || log.details || log.message || "",
        time: formatTimeAgo(log.createdAt || log.created_at || log.timestamp),
      }));
      setLogs(mapped);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
    } finally {
      setLogsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCandidates();
    fetchLogs();

    const interval = setInterval(() => {
      fetchCandidates();
      fetchLogs();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchCandidates, fetchLogs]);

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 4000);
  };

  const refreshAfterAction = () => {
    window.setTimeout(() => {
      fetchCandidates();
      fetchLogs();
    }, 1000);
  };

  const handleSubmitApplication = async (form: ApplicationFormValues) => {
    setFormLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("role", form.position);
      formData.append("salary", "To be discussed");
      formData.append("startDate", "To be confirmed");
      formData.append("phone", form.phone);
      formData.append("location", form.location);
      formData.append("experience", form.experience);
      formData.append("education", form.education);
      formData.append("resumeText", form.resumeText || `${form.experience} experience. ${form.education}.`);

      if (form.resumeFile) {
        formData.append("resume", form.resumeFile);
      }

      const res = await fetch(`${API_BASE}/hr/apply`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "API error");

      const result = data.result || data;
      const screening = result.screening;
      const score = screening?.score ?? null;
      const decision = screening?.decision ?? "pending";
      const newStatus: CandidateStatus = decision === "selected" ? "shortlisted" : decision === "rejected" ? "rejected" : "applied";

      const newCandidate: Candidate = {
        id: Date.now(),
        name: form.name,
        email: form.email,
        phone: form.phone || "-",
        position: form.position,
        location: form.location || "-",
        experience: form.experience || "-",
        education: form.education || "-",
        resumeScore: score,
        status: newStatus,
        appliedAt: "Just now",
        interviewDate: null,
        meetLink: null,
        notes: screening?.summary || "",
      };

      setCandidates((prev) => [newCandidate, ...prev]);
      showToast("Application submitted successfully.", "success");
      setShowForm(false);
      window.setTimeout(() => fetchCandidates(), 800);
    } catch (error: any) {
      showToast(`Error: ${error.message}`, "error");
    } finally {
      setFormLoading(false);
    }
  };

  const handleAction = async (id: Candidate["id"], action: "screen" | "schedule" | "hire" | "reject", candidate: Candidate) => {
    setActionLoading(id);

    try {
      if (action === "screen") {
        await apiCall("/hr/apply", {
          name: candidate.name,
          email: candidate.email,
          role: candidate.position,
          resumeText: candidate.notes || candidate.position,
        });
        showToast("Screening complete.", "success");
      }

      if (action === "schedule") {
        await apiCall("/hr/schedule-interview", {
          name: candidate.name,
          email: candidate.email,
          role: candidate.position,
        });
        showToast("Interview scheduled.", "success");
      }

      if (action === "hire") {
        await apiCall("/hr/hire", {
          name: candidate.name,
          email: candidate.email,
          role: candidate.position,
          salary: "$80,000/year",
          startDate: "March 1, 2026",
          resumeText: candidate.notes || candidate.position,
        });
        showToast("Candidate hired.", "success");
      }

      if (action === "reject") {
        await apiCall("/hr/reject", {
          name: candidate.name,
          email: candidate.email,
          role: candidate.position,
        });
        showToast("Rejection email sent.", "info");
      }

      refreshAfterAction();
    } catch (error: any) {
      showToast(`API error: ${error.message}`, "error");
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = candidates.filter((candidate) => {
    const statusMatch = filter === "all" || candidate.status === filter;
    const searchMatch =
      searchQuery === "" ||
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase());
    const roleMatch = roleFilter === "" || candidate.position.toLowerCase().includes(roleFilter.toLowerCase());

    return statusMatch && searchMatch && roleMatch;
  });

  const uniqueRoles = [...new Set(candidates.map((candidate) => candidate.position).filter((position) => position !== "-"))].sort();
  const counts = candidates.reduce(
    (accumulator, candidate) => ({ ...accumulator, [candidate.status]: (accumulator[candidate.status] || 0) + 1 }),
    {} as Record<CandidateStatus, number>,
  );

  const passRate = candidates.length ? Math.round(((counts.shortlisted || 0) / candidates.length) * 100) : 0;
  const avgScore = useMemo(() => {
    const scored = candidates.filter((candidate) => candidate.resumeScore !== null);
    if (!scored.length) return 0;
    const total = scored.reduce((sum, candidate) => sum + (candidate.resumeScore || 0), 0);
    return Math.round(total / scored.length);
  }, [candidates]);

  const filterTabs: Array<{ key: "all" | CandidateStatus; label: string; count: number }> = [
    { key: "all", label: "All", count: candidates.length },
    ...Object.entries(statusConfig).map(([key, value]) => ({
      key: key as CandidateStatus,
      label: value.label,
      count: counts[key as CandidateStatus] || 0,
    })),
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-bold text-foreground">
              <div className="rounded-2xl bg-primary/10 p-2.5 text-primary">
                <Sparkles className="h-6 w-6" />
              </div>
              HR Agent
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Manage the hiring pipeline inside the same dashboard theme as the rest of the application, from intake to screening, interview scheduling, and offers.</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-muted px-3 py-2 text-xs text-muted-foreground">
              <span className="status-dot status-running" />
              Live refresh every 10s
            </span>
            <Button onClick={() => setShowForm(true)} className="rounded-full">
              <UserPlus className="h-4 w-4" />
              New Application
            </Button>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-5">
          <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-foreground">
            <ArrowRight className="h-4 w-4 text-primary" />
            HR workflow
          </div>
          <FlowDiagram />
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <KpiCard title="Total Candidates" value={candidates.length} change="Pipeline volume" changeType="neutral" icon={UserPlus} delay={0} />
          <KpiCard title="Shortlisted" value={counts.shortlisted || 0} change={`${passRate}% pass rate`} changeType="neutral" icon={Star} delay={0.05} />
          <KpiCard title="Interviews" value={counts.interview_scheduled || 0} change="Scheduled" changeType="neutral" icon={Calendar} delay={0.1} />
          <KpiCard title="Hired" value={counts.hired || 0} change="Offers sent" changeType="positive" icon={Trophy} delay={0.15} />
          <KpiCard title="Avg Score" value={avgScore ? `${avgScore}/100` : "-"} change="Scored resumes" changeType="neutral" icon={Brain} delay={0.2} />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-5">
            <div className="glass-card rounded-3xl p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search by candidate name or email"
                    className="pl-9"
                  />
                </div>

                {uniqueRoles.length > 0 && (
                  <select
                    value={roleFilter}
                    onChange={(event) => setRoleFilter(event.target.value)}
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">All Roles</option>
                    {uniqueRoles.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {filterTabs.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setFilter(tab.key)}
                    className={cn(
                      "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-xs font-semibold transition-colors",
                      filter === tab.key
                        ? "border-primary/20 bg-primary/10 text-primary"
                        : "border-border bg-background text-muted-foreground hover:border-primary/20 hover:text-primary",
                    )}
                  >
                    {tab.label}
                    <span className="rounded-full bg-background/80 px-2 py-0.5 text-[11px]">{tab.count}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {candidatesLoading ? (
                <div className="glass-card rounded-3xl px-6 py-12 text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
                  <p className="mt-3 text-sm text-muted-foreground">Loading candidate pipeline...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="glass-card rounded-3xl px-6 py-12 text-center">
                  <UserPlus className="mx-auto h-8 w-8 text-muted-foreground" />
                  <p className="mt-3 text-sm font-medium text-foreground">No candidates found</p>
                  <p className="mt-1 text-sm text-muted-foreground">Adjust your filters or add a new application to populate the pipeline.</p>
                </div>
              ) : (
                filtered.map((candidate) => (
                  <CandidateCard key={candidate.id} candidate={candidate} onAction={handleAction} actionLoading={actionLoading} />
                ))
              )}
            </div>
          </div>

          <div className="space-y-5 xl:sticky xl:top-24">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Clock3 className="h-4 w-4 text-primary" />
                    Live Activity Log
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">Recent HR events and outbound actions</p>
                </div>
                {logsLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
              </div>

              <div className="max-h-[480px] space-y-3 overflow-y-auto  no-scrollbar pr-1">
                {logsLoading ? (
                  <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading activity logs...
                  </div>
                ) : logs.length === 0 ? (
                  <div className="py-8 text-center">
                    <Clock3 className="mx-auto h-8 w-8 text-muted-foreground" />
                    <p className="mt-3 text-sm text-muted-foreground">No activity logs yet</p>
                  </div>
                ) : (
                  logs.slice(0, 20).map((log) => {
                    const style = logStyleMap[log.type] || logStyleMap.apply;
                    const Icon = style.icon;
                    return (
                      <div key={log.id} className="flex gap-3 rounded-2xl bg-background/50 p-3">
                        <div className={cn("mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", style.className)}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-foreground">{log.action}</p>
                          <p className="truncate text-xs text-muted-foreground">{log.detail}</p>
                          <p className="mt-1 text-[11px] text-muted-foreground">{log.time}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-3xl p-5">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <FileText className="h-4 w-4 text-primary" />
                API Endpoints
              </h3>
              <div className="mt-4 space-y-2 text-xs">
                {[
                  { method: "GET", path: "/hr/logs", className: "bg-primary/10 text-primary" },
                  { method: "GET", path: "/hr/candidates", className: "bg-accent/10 text-accent" },
                  { method: "POST", path: "/hr/apply", className: "bg-primary/10 text-primary" },
                  { method: "POST", path: "/hr/schedule-interview", className: "bg-violet-500/10 text-violet-500" },
                  { method: "POST", path: "/hr/hire", className: "bg-success/10 text-success" },
                  { method: "POST", path: "/hr/reject", className: "bg-destructive/10 text-destructive" },
                ].map((endpoint) => (
                  <div key={endpoint.path} className="flex items-center gap-3 rounded-2xl bg-background/50 px-3 py-2.5">
                    <span className={cn("rounded-md px-2 py-1 font-mono text-[11px] font-semibold", endpoint.className)}>{endpoint.method}</span>
                    <span className="font-mono text-muted-foreground">{endpoint.path}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {showForm && <ApplicationForm onSubmit={handleSubmitApplication} onClose={() => setShowForm(false)} loading={formLoading} />}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </DashboardLayout>
  );
}
