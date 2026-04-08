import { useState, useEffect, useCallback } from "react";

// ─── Icons (inline SVG components to avoid lucide dependency issues) ──────────
const Icon = ({ d, size = 16, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d={d} />
  </svg>
);

const Icons = {
  UserPlus: ({ size, className }) => <svg width={size||16} height={size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,
  Brain: ({ size, className }) => <svg width={size||16} height={size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-1.77-4.27A3 3 0 0 1 3 11c0-.68.14-1.32.38-1.9a2.5 2.5 0 0 1 .4-4.8A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.77-4.27A3 3 0 0 0 21 11c0-.68-.14-1.32-.38-1.9a2.5 2.5 0 0 0-.4-4.8A2.5 2.5 0 0 0 14.5 2Z"/></svg>,
  Calendar: ({ size, className }) => <svg width={size||16} height={size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Check: ({ size, className }) => <svg width={size||16} height={size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="20 6 9 17 4 12"/></svg>,
  X: ({ size, className }) => <svg width={size||16} height={size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Mail: ({ size, className }) => <svg width={size||16} height={size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Video: ({ size, className }) => <svg width={size||16} height={size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m22 8-6 4 6 4V8z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>,
  Clock: ({ size, className }) => <svg width={size||16} height={size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Star: ({ size, className }) => <svg width={size||16} height={size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Upload: ({ size, className }) => <svg width={size||16} height={size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  Loader: ({ size, className }) => <svg width={size||16} height={size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="12" y1="2" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"/><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"/><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"/></svg>,
  Arrow: ({ size, className }) => <svg width={size||16} height={size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
  ChevronDown: ({ size, className }) => <svg width={size||16} height={size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="6 9 12 15 18 9"/></svg>,
  ChevronUp: ({ size, className }) => <svg width={size||16} height={size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polyline points="18 15 12 9 6 15"/></svg>,
  Briefcase: ({ size, className }) => <svg width={size||16} height={size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  GradCap: ({ size, className }) => <svg width={size||16} height={size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>,
  MapPin: ({ size, className }) => <svg width={size||16} height={size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  Phone: ({ size, className }) => <svg width={size||16} height={size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 14 19.79 19.79 0 0 1 1.61 5.4 2 2 0 0 1 3.59 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17z"/></svg>,
  User: ({ size, className }) => <svg width={size||16} height={size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  Send: ({ size, className }) => <svg width={size||16} height={size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>,
  Trophy: ({ size, className }) => <svg width={size||16} height={size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/></svg>,
  Alert: ({ size, className }) => <svg width={size||16} height={size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
  Sparkles: ({ size, className }) => <svg width={size||16} height={size||16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>,
};

// ─── API Config ───────────────────────────────────────────────────────────────
const API_BASE = "http://localhost:5000";

async function apiCall(endpoint, body) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "API error");
  return data;
}

// ─── Status Config ────────────────────────────────────────────────────────────
const statusConfig = {
  applied:              { label: "Applied",              color: "#60a5fa", bg: "rgba(96,165,250,0.1)",  Icon: Icons.UserPlus },
  screening:            { label: "AI Screening",         color: "#fbbf24", bg: "rgba(251,191,36,0.1)",  Icon: Icons.Brain },
  shortlisted:          { label: "Shortlisted",          color: "#34d399", bg: "rgba(52,211,153,0.1)",  Icon: Icons.Star },
  interview_scheduled:  { label: "Interview Scheduled",  color: "#a78bfa", bg: "rgba(167,139,250,0.1)", Icon: Icons.Calendar },
  hired:                { label: "Hired",                color: "#4ade80", bg: "rgba(74,222,128,0.1)",  Icon: Icons.Trophy },
  rejected:             { label: "Rejected",             color: "#f87171", bg: "rgba(248,113,113,0.1)", Icon: Icons.X },
};

// ─── Utility: Time difference formatter ────────────────────────────────────────
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

// Log type mapping from backend action strings to UI log types
const logTypeMap: Record<string, string> = {
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

function guessLogType(action: string): string {
  for (const [key, type] of Object.entries(logTypeMap)) {
    if (action.toLowerCase().includes(key.toLowerCase())) return type;
  }
  if (action.toLowerCase().includes("screen") || action.toLowerCase().includes("score")) return "screen";
  if (action.toLowerCase().includes("interview") || action.toLowerCase().includes("schedule")) return "schedule";
  if (action.toLowerCase().includes("hire") || action.toLowerCase().includes("offer")) return "hire";
  if (action.toLowerCase().includes("reject")) return "reject";
  if (action.toLowerCase().includes("email") || action.toLowerCase().includes("sent")) return "email";
  if (action.toLowerCase().includes("appl")) return "apply";
  return "apply";
}

// ─── Score Badge ──────────────────────────────────────────────────────────────
function ScoreBadge({ score }) {
  if (score === null) return <span style={{ fontSize: 11, color: "#6b7f8e", fontStyle: "italic" }}>Pending</span>;
  const color = score >= 70 ? "#4ade80" : score >= 50 ? "#fbbf24" : "#f87171";
  const bg    = score >= 70 ? "rgba(74,222,128,0.1)" : score >= 50 ? "rgba(251,191,36,0.1)" : "rgba(248,113,113,0.1)";
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color, background: bg, padding: "3px 8px", borderRadius: 8 }}>
      {score}/100
    </span>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ title, value, sub, color = "#0099dd", IconComp }) {
  return (
    <div style={{ background: "#101824", border: "1px solid #1a2530", borderRadius: 16, padding: "18px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: 11, color: "#6b7f8e", marginBottom: 6, fontFamily: "monospace", letterSpacing: 1, textTransform: "uppercase" }}>{title}</p>
          <p style={{ fontSize: 28, fontWeight: 800, color: "#f0f6fc" }}>{value}</p>
          {sub && <p style={{ fontSize: 11, color: "#6b7f8e", marginTop: 4 }}>{sub}</p>}
        </div>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <IconComp size={20} className="" style={{ color }} />
        </div>
      </div>
    </div>
  );
}

// ─── Application Form Modal ───────────────────────────────────────────────────
function ApplicationForm({ onSubmit, onClose, loading }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", position: "", location: "", experience: "", education: "", resumeText: "", resumeFile: null });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      set("resumeFile", file);
    }
  };

  const fields = [
    { key: "name",       label: "Full Name",        Icon: Icons.User,      placeholder: "John Doe",              type: "text" },
    { key: "email",      label: "Email Address",    Icon: Icons.Mail,      placeholder: "john@example.com",      type: "email" },
    { key: "phone",      label: "Phone Number",     Icon: Icons.Phone,     placeholder: "+91 99999 99999",       type: "text" },
    { key: "position",   label: "Position Applied", Icon: Icons.Briefcase, placeholder: "Senior Frontend Dev",   type: "text" },
    { key: "location",   label: "Location",         Icon: Icons.MapPin,    placeholder: "Bangalore, India",      type: "text" },
    { key: "experience", label: "Experience",       Icon: Icons.Clock,     placeholder: "5 years",               type: "text" },
    { key: "education",  label: "Education",        Icon: Icons.GradCap,   placeholder: "B.Tech CS, IIT Delhi",  type: "text" },
  ];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(13,22,33,0.85)", backdropFilter: "blur(8px)", padding: 16 }} onClick={onClose}>
      <div style={{ background: "#101824", border: "1px solid #1a2530", borderRadius: 20, padding: 28, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#f0f6fc", display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <Icons.UserPlus size={20} /> New Application
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {fields.map(f => (
            <div key={f.key}>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#f0f6fc", display: "block", marginBottom: 5 }}>{f.label}</label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6b7f8e", pointerEvents: "none" }}>
                  <f.Icon size={14} />
                </div>
                <input
                  type={f.type}
                  value={form[f.key]}
                  onChange={e => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  style={{ width: "100%", background: "#1a2530", border: "1px solid #1a2530", borderRadius: 10, padding: "10px 12px 10px 34px", fontSize: 13, color: "#f0f6fc", outline: "none", boxSizing: "border-box" }}
                />
              </div>
            </div>
          ))}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#f0f6fc", display: "block", marginBottom: 8 }}>Upload Resume (PDF, DOC)</label>
            <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 12, padding: "14px 12px", background: "#1a2530", border: "1px dashed #0099dd40", borderRadius: 10, cursor: "pointer", transition: "all 0.2s" }}>
              <Icons.Upload size={16} style={{ color: "#0099dd", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }}
                />
                <p style={{ fontSize: 13, color: "#f0f6fc", fontWeight: 500 }}>
                  {form.resumeFile ? form.resumeFile.name : "Click to upload or drag and drop"}
                </p>
                {!form.resumeFile && <p style={{ fontSize: 10, color: "#6b7f8e", marginTop: 2 }}>PDF, DOC or DOCX (Max 5MB)</p>}
              </div>
            </div>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#f0f6fc", display: "block", marginBottom: 5 }}>Resume / Skills Summary (Optional)</label>
            <textarea
              value={form.resumeText}
              onChange={e => set("resumeText", e.target.value)}
              placeholder="Paste resume text or summarize skills, experience, and achievements..."
              rows={4}
              style={{ width: "100%", background: "#1a2530", border: "1px solid #1a2530", borderRadius: 10, padding: "10px 12px", fontSize: 13, color: "#f0f6fc", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }}
            />
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={{ flex: 1, background: "transparent", border: "1px solid #1a2530", borderRadius: 10, padding: "10px 0", fontSize: 13, color: "#6b7f8e", cursor: "pointer", fontWeight: 600 }}>
            Cancel
          </button>
          <button
            onClick={() => { if (form.name && form.email && form.position) onSubmit(form); }}
            disabled={loading || !form.name || !form.email || !form.position}
            style={{ flex: 2, background: "#0099dd", border: "none", borderRadius: 10, padding: "10px 0", fontSize: 13, color: "#fff", cursor: "pointer", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, opacity: (!form.name || !form.email || !form.position) ? 0.5 : 1 }}
          >
            {loading ? <><Icons.Loader size={14} className="spin" /> Submitting...</> : <><Icons.Send size={14} /> Submit Application</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Candidate Card ───────────────────────────────────────────────────────────
function CandidateCard({ candidate, onAction, actionLoading }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = statusConfig[candidate.status];
  const isLoading = actionLoading === candidate.id;

  return (
    <div style={{ background: "#101824", border: "1px solid #1a2530", borderRadius: 16, overflow: "hidden", transition: "border-color 0.2s" }}>
      <div style={{ padding: "18px 20px" }}>
        {/* Top Row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(0,153,221,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icons.User size={18} style={{ color: "#0099dd" }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#f0f6fc", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{candidate.name}</p>
              <p style={{ fontSize: 12, color: "#6b7f8e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{candidate.position}</p>
            </div>
          </div>
          <span style={{ fontSize: 10, fontWeight: 700, color: cfg.color, background: cfg.bg, padding: "4px 10px", borderRadius: 20, whiteSpace: "nowrap", flexShrink: 0, display: "flex", alignItems: "center", gap: 4 }}>
            <cfg.Icon size={11} /> {cfg.label}
          </span>
        </div>

        {/* Info Row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 16px", fontSize: 11, color: "#6b7f8e", marginBottom: 12 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icons.MapPin size={11} />{candidate.location}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icons.Clock size={11} />{candidate.experience}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icons.GradCap size={11} />{candidate.education}</span>
        </div>

        {/* Score Row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 11, color: "#6b7f8e" }}>AI Score:</span>
            <ScoreBadge score={candidate.resumeScore} />
          </div>
          <span style={{ fontSize: 10, color: "#3d4f5c" }}>{candidate.appliedAt}</span>
        </div>

        {/* Interview info */}
        {candidate.interviewDate && (
          <div style={{ marginTop: 12, background: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.15)", borderRadius: 10, padding: "10px 12px", display: "flex", alignItems: "center", gap: 10 }}>
            <Icons.Calendar size={14} style={{ color: "#a78bfa", flexShrink: 0 }} />
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: "#f0f6fc" }}>{candidate.interviewDate}</p>
              {candidate.meetLink && (
                <a href={candidate.meetLink} target="_blank" rel="noreferrer" style={{ fontSize: 10, color: "#0099dd", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                  <Icons.Video size={10} /> Join Google Meet
                </a>
              )}
            </div>
          </div>
        )}

        {/* Expand toggle */}
        <button onClick={() => setExpanded(!expanded)} style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#6b7f8e", background: "none", border: "none", cursor: "pointer", width: "100%", justifyContent: "center", padding: "4px 0" }}>
          {expanded ? <Icons.ChevronUp size={12} /> : <Icons.ChevronDown size={12} />}
          {expanded ? "Collapse" : "Show Actions & Details"}
        </button>
      </div>

      {/* Expanded */}
      {expanded && (
        <div style={{ padding: "0 20px 20px", borderTop: "1px solid #1a2530" }}>
          {candidate.notes && (
            <p style={{ fontSize: 12, color: "#6b7f8e", paddingTop: 14, paddingBottom: 10 }}>
              <span style={{ fontWeight: 700, color: "#f0f6fc" }}>AI Notes: </span>{candidate.notes}
            </p>
          )}
          <div style={{ display: "flex", gap: 16, fontSize: 11, color: "#6b7f8e", marginBottom: 12 }}>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icons.Mail size={11} />{candidate.email}</span>
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Icons.Phone size={11} />{candidate.phone}</span>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {isLoading && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#fbbf24", background: "rgba(251,191,36,0.1)", padding: "8px 14px", borderRadius: 8, fontWeight: 600 }}>
                <Icons.Loader size={13} className="spin" /> Processing API call...
              </div>
            )}
            {!isLoading && candidate.status === "applied" && (
              <ActionBtn onClick={() => onAction(candidate.id, "screen", candidate)} color="#fbbf24" bg="rgba(251,191,36,0.1)" Icon={Icons.Brain} label="Screen with AI" />
            )}
            {!isLoading && candidate.status === "shortlisted" && (
              <>
                <ActionBtn onClick={() => onAction(candidate.id, "schedule", candidate)} color="#a78bfa" bg="rgba(167,139,250,0.1)" Icon={Icons.Calendar} label="Schedule Interview" />
                <ActionBtn onClick={() => onAction(candidate.id, "reject", candidate)} color="#f87171" bg="rgba(248,113,113,0.1)" Icon={Icons.X} label="Reject" />
              </>
            )}
            {!isLoading && candidate.status === "interview_scheduled" && (
              <>
                <ActionBtn onClick={() => onAction(candidate.id, "hire", candidate)} color="#4ade80" bg="rgba(74,222,128,0.1)" Icon={Icons.Check} label="Hire Candidate" />
                <ActionBtn onClick={() => onAction(candidate.id, "reject", candidate)} color="#f87171" bg="rgba(248,113,113,0.1)" Icon={Icons.X} label="Reject After Interview" />
              </>
            )}
            {!isLoading && candidate.status === "hired" && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#4ade80", background: "rgba(74,222,128,0.1)", padding: "8px 14px", borderRadius: 8, fontWeight: 600 }}>
                <Icons.Trophy size={13} /> Offer Sent · Onboarding Started
              </div>
            )}
            {!isLoading && candidate.status === "rejected" && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#f87171", background: "rgba(248,113,113,0.1)", padding: "8px 14px", borderRadius: 8, fontWeight: 600 }}>
                <Icons.Alert size={13} /> Rejection Email Sent
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ActionBtn({ onClick, color, bg, Icon, label }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color, background: hover ? color + "30" : bg, border: "none", padding: "8px 14px", borderRadius: 8, cursor: "pointer", transition: "background 0.15s" }}
    >
      <Icon size={13} /> {label}
    </button>
  );
}

// ─── Flow Diagram ─────────────────────────────────────────────────────────────
function FlowDiagram() {
  const steps = [
    { Icon: Icons.UserPlus, label: "Apply",      desc: "POST /hr/apply",              color: "#60a5fa" },
    { Icon: Icons.Brain,    label: "AI Screen",  desc: "Groq AI scores 0–100",        color: "#fbbf24" },
    { Icon: Icons.Calendar, label: "Interview",  desc: "Google Calendar + Meet",      color: "#a78bfa" },
    { Icon: Icons.Trophy,   label: "Hire",       desc: "Offer + Onboarding emails",   color: "#4ade80" },
  ];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, overflowX: "auto", padding: "8px 0" }}>
      {steps.map((s, i) => (
        <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: s.color + "18", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <s.Icon size={20} style={{ color: s.color }} />
            </div>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#f0f6fc" }}>{s.label}</span>
            <span style={{ fontSize: 10, color: "#6b7f8e", fontFamily: "monospace" }}>{s.desc}</span>
          </div>
          {i < steps.length - 1 && <Icons.Arrow size={16} style={{ color: "#3d4f5c", flexShrink: 0, marginBottom: 18 }} />}
        </div>
      ))}
    </div>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  const colors = { success: "#0099dd", error: "#f87171", info: "#60a5fa" };
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 999, background: "#101824", border: `1px solid ${colors[type]}40`, borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, boxShadow: `0 8px 32px ${colors[type]}20`, maxWidth: 380, animation: "slideIn 0.3s ease" }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors[type], flexShrink: 0 }} />
      <p style={{ fontSize: 13, color: "#f0f6fc", flex: 1 }}>{message}</p>
      <button onClick={onClose} style={{ background: "none", border: "none", color: "#6b7f8e", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>×</button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HRAgentPage() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [candidatesLoading, setCandidatesLoading] = useState(true);
  const [logsLoading, setLogsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [toast, setToast] = useState(null);

  // ── Fetch candidates from /hr/candidates endpoint ──────────────────────────
  const fetchCandidates = useCallback(async () => {
    try {
      setCandidatesLoading(true);
      const res = await fetch(`${API_BASE}/hr/candidates`);
      const data = await res.json();
      const rawCandidates = data.data || data.candidates || data.result || [];
      const mapped = rawCandidates.map((c: any) => ({
        id: c._id || c.id || Date.now(),
        name: c.candidateName || c.name || "Unknown",
        email: c.email || "—",
        phone: c.phone || "—",
        position: c.jobRole || c.position || "—",
        location: c.location || "—",
        experience: c.experience || "—",
        education: c.education || "—",
        resumeScore: c.score || c.resumeScore || null,
        status: c.status || "applied",
        appliedAt: formatTimeAgo(c.createdAt || c.created_at || new Date()),
        interviewDate: c.interviewDate || null,
        meetLink: c.meetLink || null,
        notes: c.summary || c.notes || "",
      }));
      setCandidates(mapped);
    } catch (err) {
      console.error("Failed to fetch candidates:", err);
    } finally {
      setCandidatesLoading(false);
    }
  }, []);

  // ── Fetch logs from backend ──────────────────────────────────────────────────
  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/hr/logs`);
      const data = await res.json();
      const rawLogs = Array.isArray(data) ? data : (data.data || data.logs || data.result || []);
      const mapped = rawLogs.map((log: any, index: number) => ({
        id: log.id || log._id || Date.now() + index,
        type: log.type || guessLogType(log.action || ""),
        action: log.action || "Activity",
        detail: log.detail || log.details || log.message || "",
        time: formatTimeAgo(log.createdAt || log.created_at || log.timestamp),
      }));
      setLogs(mapped);
    } catch (err) {
      console.error("Failed to fetch logs:", err);
    } finally {
      setLogsLoading(false);
    }
  }, []);

  // ── Initial load and auto-refresh every 10 seconds ───────────────────────
  useEffect(() => {
    fetchCandidates();
    fetchLogs();
    const interval = setInterval(() => {
      fetchCandidates();
      fetchLogs();
    }, 10000);
    return () => clearInterval(interval);
  }, [fetchCandidates, fetchLogs]);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const addLog = (type: string, action: string, detail: string) => {
    setTimeout(() => fetchLogs(), 500);
  };

  // ── Submit Application → POST /hr/apply ──────────────────────────────────
  const handleSubmitApplication = async (form) => {
    setFormLoading(true);
    try {
      // Use FormData to handle file upload if present
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
      const score     = screening?.score ?? null;
      const decision  = screening?.decision ?? "pending";
      const newStatus = decision === "selected" ? "shortlisted" : decision === "rejected" ? "rejected" : "applied";

      const newCandidate = {
        id:          Date.now(),
        name:        form.name,
        email:       form.email,
        phone:       form.phone || "—",
        position:    form.position,
        location:    form.location || "—",
        experience:  form.experience || "—",
        education:   form.education || "—",
        resumeScore: score,
        status:      newStatus,
        appliedAt:   "Just now",
        notes:       screening?.summary || "",
      };

      setCandidates(prev => [newCandidate, ...prev]);
      addLog("apply",  "Application Received", `${form.name} applied for ${form.position}`);
      if (score !== null) addLog("screen", `AI Score: ${score}/100`, `${form.name} → ${decision}`);
      addLog("email", `${decision === "selected" ? "Shortlist" : "Rejection"} Email Sent`, form.email);

      showToast(`✅ Application submitted!`, "success");
      setShowForm(false);
      setTimeout(() => fetchCandidates(), 800);
    } catch (err) {
      showToast(`❌ Error: ${err.message}`, "error");
    } finally {
      setFormLoading(false);
    }
  };

  // ── Candidate Actions ────────────────────────────────────────────────────
  const handleAction = async (id, action, candidate) => {
    setActionLoading(id);
    try {
      if (action === "screen") {
        const res = await apiCall("/hr/apply", {
          name: candidate.name,
          email: candidate.email,
          role: candidate.position,
          resumeText: candidate.notes || candidate.position,
        });
        showToast(`🤖 Screening complete!`, "success");
      }
      if (action === "schedule") {
        await apiCall("/hr/schedule-interview", {
          name: candidate.name,
          email: candidate.email,
          role: candidate.position,
        });
        showToast("📅 Interview scheduled!", "success");
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
        showToast("🎉 Candidate hired!", "success");
      }
      if (action === "reject") {
        await apiCall("/hr/reject", {
          name: candidate.name,
          email: candidate.email,
          role: candidate.position,
        });
        showToast("Rejection email sent.", "info");
      }
      setTimeout(() => {
        fetchCandidates();
        fetchLogs();
      }, 1000);
    } catch (err) {
      showToast(`❌ API Error: ${err.message}`, "error");
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = candidates.filter(c => {
    const statusMatch = filter === "all" || c.status === filter;
    const searchMatch = searchQuery === "" || c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase());
    const roleMatch = roleFilter === "" || c.position.toLowerCase().includes(roleFilter.toLowerCase());
    return statusMatch && searchMatch && roleMatch;
  });
  const uniqueRoles = [...new Set(candidates.map(c => c.position).filter(p => p !== "—"))].sort();
  const counts = candidates.reduce((a, c) => ({ ...a, [c.status]: (a[c.status] || 0) + 1 }), {});

  const logColors = { apply: "#60a5fa", screen: "#fbbf24", schedule: "#a78bfa", hire: "#4ade80", reject: "#f87171", email: "#0099dd" };
  const logIcons  = { apply: Icons.UserPlus, screen: Icons.Brain, schedule: Icons.Calendar, hire: Icons.Trophy, reject: Icons.X, email: Icons.Mail };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', system-ui, sans-serif; background: #0d1621; color: #f0f6fc; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1a2530; border-radius: 4px; }
        input:focus, textarea:focus { border-color: #0099dd !important; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0d1621", padding: "28px 24px", maxWidth: 1400, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#f0f6fc", display: "flex", alignItems: "center", gap: 10 }}>
              <Icons.Sparkles size={26} style={{ color: "#0099dd" }} /> HR Agent
            </h1>
            <p style={{ fontSize: 13, color: "#6b7f8e", marginTop: 4 }}>AI-powered hiring — screen resumes, schedule interviews, send offers & onboard</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "#0099dd", border: "none", borderRadius: 12, padding: "11px 20px", fontSize: 13, fontWeight: 800, color: "#fff", cursor: "pointer", boxShadow: "0 4px 20px rgba(0,153,221,0.3)" }}
          >
            <Icons.UserPlus size={16} /> New Application
          </button>
        </div>

        {/* Flow Diagram */}
        <div style={{ background: "#101824", border: "1px solid #1a2530", borderRadius: 16, padding: "18px 20px", marginBottom: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#f0f6fc", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
            <Icons.Arrow size={14} style={{ color: "#0099dd" }} /> HR Agent Workflow
          </p>
          <FlowDiagram />
        </div>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
          <KpiCard title="Total Candidates"    value={candidates.length}                    sub="All time"            color="#60a5fa" IconComp={Icons.UserPlus} />
          <KpiCard title="Shortlisted"         value={counts.shortlisted || 0}              sub={`${Math.round(((counts.shortlisted||0)/candidates.length)*100)||0}% pass rate`} color="#fbbf24" IconComp={Icons.Star} />
          <KpiCard title="Interviews Scheduled" value={counts.interview_scheduled || 0}    sub="Pending interviews"  color="#a78bfa" IconComp={Icons.Calendar} />
          <KpiCard title="Hired"               value={counts.hired || 0}                   sub="Offer letters sent"  color="#4ade80" IconComp={Icons.Trophy} />
          <KpiCard title="Rejected"            value={counts.rejected || 0}                sub="Emails sent"         color="#f87171" IconComp={Icons.X} />
        </div>

        {/* Search and Filters */}
        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            style={{ flex: 1, minWidth: 200, background: "#101824", border: "1px solid #1a2530", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#f0f6fc", outline: "none" }}
          />
          {uniqueRoles.length > 0 && (
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              style={{ background: "#101824", border: "1px solid #1a2530", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#f0f6fc", outline: "none", cursor: "pointer", minWidth: 180 }}
            >
              <option value="">All Roles</option>
              {uniqueRoles.map(role => <option key={role} value={role}>{role}</option>)}
            </select>
          )}
        </div>

        {/* Filter Tabs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {[{ key: "all", label: "All", count: candidates.length }, ...Object.entries(statusConfig).map(([k, v]) => ({ key: k, label: v.label, count: counts[k] || 0 }))].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, border: `1px solid ${filter === tab.key ? "#0099dd30" : "#1a2530"}`, background: filter === tab.key ? "rgba(0,153,221,0.08)" : "transparent", color: filter === tab.key ? "#0099dd" : "#6b7f8e", cursor: "pointer", transition: "all 0.15s" }}
            >
              {tab.label}
              <span style={{ fontSize: 10, fontWeight: 800, padding: "1px 5px", borderRadius: 8, background: filter === tab.key ? "rgba(0,229,160,0.15)" : "#161c24" }}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Main Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 20, alignItems: "start" }}>

          {/* Candidate Cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {candidatesLoading ? (
              <div style={{ background: "#101824", border: "1px solid #1a2530", borderRadius: 16, padding: "48px 24px", textAlign: "center" }}>
                <Icons.Loader size={40} style={{ color: "#0099dd", display: "block", margin: "0 auto 12px", animation: "spin 1s linear infinite" }} />
                <p style={{ fontSize: 13, color: "#6b7f8e" }}>Loading candidates...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div style={{ background: "#101824", border: "1px solid #1a2530", borderRadius: 16, padding: "48px 24px", textAlign: "center" }}>
                <Icons.UserPlus size={40} style={{ color: "#3d4f5c", display: "block", margin: "0 auto 12px" }} />
                <p style={{ fontSize: 13, color: "#6b7f8e" }}>
                  {searchQuery || roleFilter ? `No candidates matching your filters` : `No candidates yet`}
                </p>
                {(searchQuery || roleFilter) && (
                  <p style={{ fontSize: 12, color: "#3d4f5c", marginTop: 8 }}>Try adjusting your search or filters</p>
                )}
              </div>
            ) : filtered.map(c => (
              <CandidateCard key={c.id} candidate={c} onAction={handleAction} actionLoading={actionLoading} />
            ))}
          </div>

          {/* Activity Log */}
          <div style={{ background: "#101824", border: "1px solid #1a2530", borderRadius: 16, padding: "18px 20px", position: "sticky", top: 24 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#f0f6fc", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
              <Icons.Clock size={14} style={{ color: "#0099dd" }} /> Live Activity Log
            </h3>
            <p style={{ fontSize: 10, color: "#3d4f5c", marginBottom: 12, fontStyle: "italic" }}>Auto-refreshes every 10 seconds</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: 480, overflowY: "auto", paddingRight: 4 }}>
              {logsLoading ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 0", gap: 8 }}>
                  <Icons.Loader size={16} className="spin" style={{ color: "#0099dd" }} />
                  <span style={{ fontSize: 12, color: "#6b7f8e" }}>Loading activity logs...</span>
                </div>
              ) : logs.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <Icons.Clock size={28} style={{ color: "#3d4f5c", display: "block", margin: "0 auto 8px" }} />
                  <p style={{ fontSize: 12, color: "#6b7f8e" }}>No activity logs yet</p>
                </div>
              ) : logs.slice(0, 20).map(log => {
                const LogIcon = logIcons[log.type] || Icons.Alert;
                const col = logColors[log.type] || "#6b7f8e";
                return (
                  <div key={log.id} style={{ display: "flex", gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: col + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <LogIcon size={13} style={{ color: col }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "#f0f6fc" }}>{log.action}</p>
                      <p style={{ fontSize: 11, color: "#6b7f8e", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{log.detail}</p>
                      <p style={{ fontSize: 10, color: "#3d4f5c", marginTop: 2 }}>{log.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* API Endpoints Reference */}
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid #1a2530" }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#3d4f5c", fontFamily: "monospace", letterSpacing: 1, textTransform: "uppercase", marginBottom: 10 }}>API Endpoints</p>
              {[
                { method: "GET",  path: "/hr/logs",               color: "#0099dd" },
                { method: "POST", path: "/hr/apply",              color: "#60a5fa" },
                { method: "POST", path: "/hr/schedule-interview", color: "#a78bfa" },
                { method: "POST", path: "/hr/hire",               color: "#4ade80" },
                { method: "POST", path: "/hr/reject",             color: "#f87171" },
              ].map(ep => (
                <div key={ep.path} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: 9, fontWeight: 800, color: ep.color, background: ep.color + "15", padding: "2px 5px", borderRadius: 4, fontFamily: "monospace" }}>{ep.method}</span>
                  <span style={{ fontSize: 10, color: "#6b7f8e", fontFamily: "monospace" }}>{ep.path}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && <ApplicationForm onSubmit={handleSubmitApplication} onClose={() => setShowForm(false)} loading={formLoading} />}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </>
  );
}