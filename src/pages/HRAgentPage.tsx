// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   UserPlus,
//   Brain,
//   CalendarCheck,
//   CheckCircle2,
//   XCircle,
//   FileText,
//   Mail,
//   Video,
//   Clock,
//   Star,
//   Upload,
//   Loader2,
//   ArrowRight,
//   ChevronDown,
//   ChevronUp,
//   Briefcase,
//   GraduationCap,
//   MapPin,
//   Phone,
//   User,
//   Sparkles,
//   Send,
//   CalendarDays,
//   Trophy,
//   AlertCircle,
// } from "lucide-react";
// import { DashboardLayout } from "@/components/layout/DashboardLayout";
// import { KpiCard } from "@/components/dashboard/KpiCard";
// import { cn } from "@/lib/utils";

// // ─── Types ────────────────────────────────────────────────────────────────────
// type CandidateStatus = "applied" | "screening" | "shortlisted" | "interview_scheduled" | "hired" | "rejected";

// interface Candidate {
//   id: number;
//   name: string;
//   email: string;
//   phone: string;
//   position: string;
//   location: string;
//   experience: string;
//   education: string;
//   resumeScore: number | null;
//   status: CandidateStatus;
//   appliedAt: string;
//   interviewDate?: string;
//   meetLink?: string;
//   notes?: string;
// }

// // ─── Mock Data ────────────────────────────────────────────────────────────────
// const initialCandidates: Candidate[] = [
//   { id: 1, name: "Priya Sharma", email: "priya.sharma@gmail.com", phone: "+91 98765 43210", position: "Senior Frontend Developer", location: "Bangalore, India", experience: "6 years", education: "B.Tech Computer Science, IIT Delhi", resumeScore: 87, status: "shortlisted", appliedAt: "2 hours ago", notes: "Strong React & TypeScript skills. Led 3 major product launches." },
//   { id: 2, name: "Rahul Mehta", email: "rahul.mehta@outlook.com", phone: "+91 87654 32109", position: "Backend Engineer", location: "Mumbai, India", experience: "4 years", education: "M.Tech Software Engineering, BITS Pilani", resumeScore: 72, status: "interview_scheduled", appliedAt: "5 hours ago", interviewDate: "2026-02-24 10:00 AM", meetLink: "https://meet.google.com/abc-defg-hij", notes: "Good Node.js experience. Has worked with microservices." },
//   { id: 3, name: "Ananya Gupta", email: "ananya.g@yahoo.com", phone: "+91 76543 21098", position: "UI/UX Designer", location: "Pune, India", experience: "3 years", education: "BDes, NID Ahmedabad", resumeScore: 91, status: "hired", appliedAt: "1 day ago", notes: "Exceptional portfolio. Figma expert with design system experience." },
//   { id: 4, name: "Vikram Singh", email: "vikram.s@gmail.com", phone: "+91 65432 10987", position: "DevOps Engineer", location: "Hyderabad, India", experience: "2 years", education: "B.Tech IT, VIT Vellore", resumeScore: 38, status: "rejected", appliedAt: "1 day ago", notes: "Limited hands-on experience. No CI/CD pipeline work." },
//   { id: 5, name: "Sneha Patel", email: "sneha.patel@gmail.com", phone: "+91 54321 09876", position: "Data Scientist", location: "Chennai, India", experience: "5 years", education: "MS Data Science, ISI Kolkata", resumeScore: null, status: "applied", appliedAt: "30 min ago" },
//   { id: 6, name: "Arjun Reddy", email: "arjun.r@protonmail.com", phone: "+91 43210 98765", position: "Full Stack Developer", location: "Delhi, India", experience: "7 years", education: "B.Tech CSE, NIT Trichy", resumeScore: null, status: "screening", appliedAt: "15 min ago" },
// ];

// const hrStats = {
//   totalApplications: 156,
//   shortlisted: 42,
//   interviewsScheduled: 18,
//   hiredThisMonth: 7,
//   rejectedThisMonth: 89,
//   avgResumeScore: 64,
// };

// const statusConfig: Record<CandidateStatus, { label: string; color: string; bgColor: string; icon: typeof UserPlus }> = {
//   applied: { label: "Applied", color: "text-blue-400", bgColor: "bg-blue-400/10", icon: UserPlus },
//   screening: { label: "AI Screening", color: "text-amber-400", bgColor: "bg-amber-400/10", icon: Brain },
//   shortlisted: { label: "Shortlisted", color: "text-emerald-400", bgColor: "bg-emerald-400/10", icon: Star },
//   interview_scheduled: { label: "Interview Scheduled", color: "text-purple-400", bgColor: "bg-purple-400/10", icon: CalendarCheck },
//   hired: { label: "Hired", color: "text-green-400", bgColor: "bg-green-400/10", icon: CheckCircle2 },
//   rejected: { label: "Rejected", color: "text-red-400", bgColor: "bg-red-400/10", icon: XCircle },
// };

// // ─── Sub-components ───────────────────────────────────────────────────────────

// function ScoreBadge({ score }: { score: number | null }) {
//   if (score === null) return <span className="text-xs text-muted-foreground italic">Pending</span>;
//   const color = score >= 70 ? "text-green-400 bg-green-400/10" : score >= 50 ? "text-amber-400 bg-amber-400/10" : "text-red-400 bg-red-400/10";
//   return (
//     <span className={cn("text-xs font-bold px-2.5 py-1 rounded-lg", color)}>
//       {score}/100
//     </span>
//   );
// }

// function FlowDiagram() {
//   const steps = [
//     { icon: UserPlus, label: "Apply", desc: "POST /hr/apply" },
//     { icon: Brain, label: "AI Screen", desc: "Groq AI (0-100)" },
//     { icon: CalendarCheck, label: "Interview", desc: "Google Calendar" },
//     { icon: CheckCircle2, label: "Hire / Reject", desc: "Offer + Onboard" },
//   ];

//   return (
//     <div className="flex items-center justify-between gap-2 py-3 overflow-x-auto">
//       {steps.map((step, i) => (
//         <div key={step.label} className="flex items-center gap-2 min-w-0">
//           <motion.div
//             initial={{ scale: 0 }}
//             animate={{ scale: 1 }}
//             transition={{ delay: i * 0.15, type: "spring", stiffness: 200 }}
//             className="flex flex-col items-center gap-1.5"
//           >
//             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
//               <step.icon className="h-5 w-5 text-primary" />
//             </div>
//             <span className="text-xs font-semibold text-foreground whitespace-nowrap">{step.label}</span>
//             <span className="text-[10px] text-muted-foreground whitespace-nowrap">{step.desc}</span>
//           </motion.div>
//           {i < steps.length - 1 && (
//             <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0 mx-1" />
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }

// // ─── Application Form Modal ──────────────────────────────────────────────────
// function ApplicationForm({ onSubmit, onClose }: { onSubmit: (c: Omit<Candidate, "id" | "resumeScore" | "status" | "appliedAt">) => void; onClose: () => void }) {
//   const [form, setForm] = useState({ name: "", email: "", phone: "", position: "", location: "", experience: "", education: "" });
//   const update = (key: string, val: string) => setForm((p) => ({ ...p, [key]: val }));

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
//       onClick={onClose}
//     >
//       <motion.div
//         initial={{ scale: 0.95, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         exit={{ scale: 0.95, opacity: 0 }}
//         className="glass-card rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
//         onClick={(e) => e.stopPropagation()}
//       >
//         <h2 className="text-lg font-bold text-foreground flex items-center gap-2 mb-5">
//           <UserPlus className="h-5 w-5 text-primary" /> New Application
//         </h2>
//         <div className="space-y-4">
//           {[
//             { key: "name", label: "Full Name", icon: User, placeholder: "John Doe" },
//             { key: "email", label: "Email", icon: Mail, placeholder: "john@example.com", type: "email" },
//             { key: "phone", label: "Phone", icon: Phone, placeholder: "+91 99999 99999" },
//             { key: "position", label: "Position Applied", icon: Briefcase, placeholder: "Senior Frontend Developer" },
//             { key: "location", label: "Location", icon: MapPin, placeholder: "Bangalore, India" },
//             { key: "experience", label: "Experience", icon: Clock, placeholder: "5 years" },
//             { key: "education", label: "Education", icon: GraduationCap, placeholder: "B.Tech CS, IIT Delhi" },
//           ].map((field) => (
//             <div key={field.key} className="space-y-1.5">
//               <label className="text-xs font-medium text-foreground">{field.label}</label>
//               <div className="relative">
//                 <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <input
//                   type={field.type || "text"}
//                   value={form[field.key as keyof typeof form]}
//                   onChange={(e) => update(field.key, e.target.value)}
//                   placeholder={field.placeholder}
//                   className="w-full rounded-xl border border-border bg-muted/50 py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
//                 />
//               </div>
//             </div>
//           ))}

//           {/* Resume upload area */}
//           <div className="space-y-1.5">
//             <label className="text-xs font-medium text-foreground">Resume</label>
//             <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center gap-2 text-muted-foreground hover:border-primary/40 transition-colors cursor-pointer">
//               <Upload className="h-6 w-6" />
//               <span className="text-xs">Drop resume or click to upload</span>
//               <span className="text-[10px] text-muted-foreground/60">PDF, DOCX (max 5MB)</span>
//             </div>
//           </div>
//         </div>

//         <div className="flex gap-3 mt-6">
//           <button onClick={onClose} className="flex-1 rounded-xl border border-border py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
//             Cancel
//           </button>
//           <button
//             onClick={() => {
//               if (form.name && form.email && form.position) {
//                 onSubmit(form);
//               }
//             }}
//             className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl transition-all flex items-center justify-center gap-2"
//           >
//             <Send className="h-4 w-4" /> Submit Application
//           </button>
//         </div>
//       </motion.div>
//     </motion.div>
//   );
// }

// // ─── Candidate Card ──────────────────────────────────────────────────────────
// function CandidateCard({
//   candidate,
//   onAction,
// }: {
//   candidate: Candidate;
//   onAction: (id: number, action: "screen" | "schedule" | "hire" | "reject") => void;
// }) {
//   const [expanded, setExpanded] = useState(false);
//   const config = statusConfig[candidate.status];

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="glass-card-hover rounded-2xl overflow-hidden"
//     >
//       {/* Header */}
//       <div className="p-5">
//         <div className="flex items-start justify-between mb-3">
//           <div className="flex items-center gap-3 min-w-0">
//             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 shrink-0">
//               <User className="h-5 w-5 text-primary" />
//             </div>
//             <div className="min-w-0">
//               <h3 className="text-sm font-semibold text-foreground truncate">{candidate.name}</h3>
//               <p className="text-xs text-muted-foreground truncate">{candidate.position}</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-2 shrink-0">
//             <span className={cn("text-[10px] px-2 py-1 rounded-full font-semibold flex items-center gap-1", config.bgColor, config.color)}>
//               <config.icon className="h-3 w-3" />
//               {config.label}
//             </span>
//           </div>
//         </div>

//         {/* Quick info */}
//         <div className="flex flex-wrap gap-3 text-xs text-muted-foreground mb-3">
//           <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{candidate.location}</span>
//           <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{candidate.experience}</span>
//           <span className="flex items-center gap-1"><GraduationCap className="h-3 w-3" />{candidate.education}</span>
//         </div>

//         {/* Score + Time */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <span className="text-xs text-muted-foreground">AI Score:</span>
//             <ScoreBadge score={candidate.resumeScore} />
//           </div>
//           <span className="text-[10px] text-muted-foreground">{candidate.appliedAt}</span>
//         </div>

//         {/* Interview info */}
//         {candidate.interviewDate && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="mt-3 rounded-xl bg-purple-400/5 border border-purple-400/10 p-3 flex items-center gap-3"
//           >
//             <CalendarDays className="h-4 w-4 text-purple-400 shrink-0" />
//             <div className="min-w-0">
//               <p className="text-xs font-medium text-foreground">{candidate.interviewDate}</p>
//               {candidate.meetLink && (
//                 <a href={candidate.meetLink} target="_blank" rel="noreferrer" className="text-[10px] text-primary hover:underline flex items-center gap-1">
//                   <Video className="h-3 w-3" /> Join Google Meet
//                 </a>
//               )}
//             </div>
//           </motion.div>
//         )}

//         {/* Expand toggle */}
//         <button
//           onClick={() => setExpanded(!expanded)}
//           className="mt-3 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors w-full justify-center"
//         >
//           {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
//           {expanded ? "Less" : "Actions & Details"}
//         </button>
//       </div>

//       {/* Expanded section */}
//       <AnimatePresence>
//         {expanded && (
//           <motion.div
//             initial={{ height: 0, opacity: 0 }}
//             animate={{ height: "auto", opacity: 1 }}
//             exit={{ height: 0, opacity: 0 }}
//             className="overflow-hidden"
//           >
//             <div className="px-5 pb-5 pt-0 space-y-3 border-t border-border/50">
//               {candidate.notes && (
//                 <div className="pt-3">
//                   <p className="text-xs text-muted-foreground">
//                     <span className="font-semibold text-foreground">AI Notes: </span>
//                     {candidate.notes}
//                   </p>
//                 </div>
//               )}

//               {/* Contact */}
//               <div className="flex gap-4 text-xs text-muted-foreground pt-1">
//                 <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{candidate.email}</span>
//                 <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{candidate.phone}</span>
//               </div>

//               {/* Action Buttons */}
//               <div className="flex flex-wrap gap-2 pt-2">
//                 {candidate.status === "applied" && (
//                   <button
//                     onClick={() => onAction(candidate.id, "screen")}
//                     className="flex items-center gap-1.5 rounded-lg bg-amber-400/10 px-3 py-2 text-xs font-semibold text-amber-400 hover:bg-amber-400/20 transition-colors"
//                   >
//                     <Brain className="h-3.5 w-3.5" /> Screen with AI
//                   </button>
//                 )}
//                 {candidate.status === "screening" && (
//                   <div className="flex items-center gap-2 rounded-lg bg-amber-400/10 px-3 py-2 text-xs font-semibold text-amber-400">
//                     <Loader2 className="h-3.5 w-3.5 animate-spin" /> AI Screening in Progress...
//                   </div>
//                 )}
//                 {candidate.status === "shortlisted" && (
//                   <>
//                     <button
//                       onClick={() => onAction(candidate.id, "schedule")}
//                       className="flex items-center gap-1.5 rounded-lg bg-purple-400/10 px-3 py-2 text-xs font-semibold text-purple-400 hover:bg-purple-400/20 transition-colors"
//                     >
//                       <CalendarCheck className="h-3.5 w-3.5" /> Schedule Interview
//                     </button>
//                     <button
//                       onClick={() => onAction(candidate.id, "reject")}
//                       className="flex items-center gap-1.5 rounded-lg bg-red-400/10 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-400/20 transition-colors"
//                     >
//                       <XCircle className="h-3.5 w-3.5" /> Reject
//                     </button>
//                   </>
//                 )}
//                 {candidate.status === "interview_scheduled" && (
//                   <>
//                     <button
//                       onClick={() => onAction(candidate.id, "hire")}
//                       className="flex items-center gap-1.5 rounded-lg bg-green-400/10 px-3 py-2 text-xs font-semibold text-green-400 hover:bg-green-400/20 transition-colors"
//                     >
//                       <CheckCircle2 className="h-3.5 w-3.5" /> Hire
//                     </button>
//                     <button
//                       onClick={() => onAction(candidate.id, "reject")}
//                       className="flex items-center gap-1.5 rounded-lg bg-red-400/10 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-400/20 transition-colors"
//                     >
//                       <XCircle className="h-3.5 w-3.5" /> Reject
//                     </button>
//                   </>
//                 )}
//                 {candidate.status === "hired" && (
//                   <div className="flex items-center gap-2 rounded-lg bg-green-400/10 px-3 py-2 text-xs font-semibold text-green-400">
//                     <Trophy className="h-3.5 w-3.5" /> Offer Sent · Onboarding Started
//                   </div>
//                 )}
//                 {candidate.status === "rejected" && (
//                   <div className="flex items-center gap-2 rounded-lg bg-red-400/10 px-3 py-2 text-xs font-semibold text-red-400">
//                     <AlertCircle className="h-3.5 w-3.5" /> Rejection Email Sent
//                   </div>
//                 )}
//               </div>
//             </div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </motion.div>
//   );
// }

// // ─── Activity Log ─────────────────────────────────────────────────────────────
// interface HrLogEntry {
//   id: number;
//   action: string;
//   detail: string;
//   time: string;
//   type: "apply" | "screen" | "schedule" | "hire" | "reject" | "email";
// }

// const initialLogs: HrLogEntry[] = [
//   { id: 1, action: "Application Received", detail: "Sneha Patel applied for Data Scientist", time: "30 min ago", type: "apply" },
//   { id: 2, action: "AI Screening Started", detail: "Arjun Reddy — Full Stack Developer", time: "15 min ago", type: "screen" },
//   { id: 3, action: "Interview Scheduled", detail: "Rahul Mehta — Feb 24, 10:00 AM (Google Meet)", time: "1 hour ago", type: "schedule" },
//   { id: 4, action: "Candidate Hired", detail: "Ananya Gupta — UI/UX Designer — Offer letter + onboarding plan sent", time: "1 day ago", type: "hire" },
//   { id: 5, action: "Candidate Rejected", detail: "Vikram Singh — DevOps Engineer — Score: 38/100", time: "1 day ago", type: "reject" },
//   { id: 6, action: "Shortlist Email Sent", detail: "Priya Sharma — Score: 87/100 — Interview invite pending", time: "2 hours ago", type: "email" },
// ];

// const logTypeColors: Record<HrLogEntry["type"], string> = {
//   apply: "text-blue-400 bg-blue-400/10",
//   screen: "text-amber-400 bg-amber-400/10",
//   schedule: "text-purple-400 bg-purple-400/10",
//   hire: "text-green-400 bg-green-400/10",
//   reject: "text-red-400 bg-red-400/10",
//   email: "text-primary bg-primary/10",
// };

// const logTypeIcons: Record<HrLogEntry["type"], typeof UserPlus> = {
//   apply: UserPlus,
//   screen: Brain,
//   schedule: CalendarCheck,
//   hire: CheckCircle2,
//   reject: XCircle,
//   email: Mail,
// };

// // ─── Main Page ────────────────────────────────────────────────────────────────
// const HRAgentPage = () => {
//   const [candidates, setCandidates] = useState<Candidate[]>(initialCandidates);
//   const [logs, setLogs] = useState<HrLogEntry[]>(initialLogs);
//   const [showForm, setShowForm] = useState(false);
//   const [filter, setFilter] = useState<CandidateStatus | "all">("all");
//   const [actionLoading, setActionLoading] = useState<number | null>(null);

//   const addLog = (action: string, detail: string, type: HrLogEntry["type"]) => {
//     setLogs((prev) => [{ id: Date.now(), action, detail, time: "Just now", type }, ...prev]);
//   };

//   const handleSubmitApplication = (form: Omit<Candidate, "id" | "resumeScore" | "status" | "appliedAt">) => {
//     const newCandidate: Candidate = {
//       ...form,
//       id: Date.now(),
//       resumeScore: null,
//       status: "applied",
//       appliedAt: "Just now",
//     };
//     setCandidates((prev) => [newCandidate, ...prev]);
//     addLog("Application Received", `${form.name} applied for ${form.position}`, "apply");
//     setShowForm(false);
//   };

//   const handleAction = async (id: number, action: "screen" | "schedule" | "hire" | "reject") => {
//     setActionLoading(id);

//     // Simulate API call delay
//     await new Promise((r) => setTimeout(r, 1500));

//     setCandidates((prev) =>
//       prev.map((c) => {
//         if (c.id !== id) return c;
//         switch (action) {
//           case "screen": {
//             const score = Math.floor(Math.random() * 60) + 30; // 30-89
//             const newStatus: CandidateStatus = score >= 50 ? "shortlisted" : "rejected";
//             addLog(
//               score >= 50 ? "Candidate Shortlisted" : "Candidate Rejected (Low Score)",
//               `${c.name} — ${c.position} — AI Score: ${score}/100`,
//               score >= 50 ? "screen" : "reject"
//             );
//             if (score >= 50) {
//               addLog("Shortlist Email Sent", `${c.name} — Interview invite pending`, "email");
//             } else {
//               addLog("Rejection Email Sent", `${c.name} — Score below threshold`, "email");
//             }
//             return { ...c, resumeScore: score, status: newStatus, notes: score >= 50 ? `AI screened: Score ${score}/100. Skills match the role requirements.` : `AI screened: Score ${score}/100. Did not meet minimum requirements.` };
//           }
//           case "schedule": {
//             const date = "2026-02-26 02:30 PM";
//             const link = `https://meet.google.com/${Math.random().toString(36).slice(2, 5)}-${Math.random().toString(36).slice(2, 6)}-${Math.random().toString(36).slice(2, 5)}`;
//             addLog("Interview Scheduled", `${c.name} — ${date} (Google Meet)`, "schedule");
//             addLog("Interview Email Sent", `${c.name} — Google Meet link + calendar invite`, "email");
//             return { ...c, status: "interview_scheduled", interviewDate: date, meetLink: link };
//           }
//           case "hire":
//             addLog("Candidate Hired", `${c.name} — ${c.position}`, "hire");
//             addLog("Offer Letter Generated", `AI-generated offer letter sent to ${c.email}`, "email");
//             addLog("Onboarding Plan Created", `5-day onboarding plan sent to ${c.email}`, "email");
//             return { ...c, status: "hired", notes: (c.notes || "") + " Offer letter generated & sent. 5-day onboarding plan created." };
//           case "reject":
//             addLog("Candidate Rejected", `${c.name} — ${c.position}`, "reject");
//             addLog("Rejection Email Sent", `Post-interview rejection sent to ${c.email}`, "email");
//             return { ...c, status: "rejected" };
//           default:
//             return c;
//         }
//       })
//     );

//     setActionLoading(null);
//   };

//   const filtered = filter === "all" ? candidates : candidates.filter((c) => c.status === filter);

//   const statusCounts = candidates.reduce(
//     (acc, c) => {
//       acc[c.status] = (acc[c.status] || 0) + 1;
//       return acc;
//     },
//     {} as Record<string, number>
//   );

//   return (
//     <DashboardLayout>
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
//               <Sparkles className="h-6 w-6 text-primary" /> HR Agent
//             </h1>
//             <p className="text-sm text-muted-foreground">AI-powered hiring: screen resumes, schedule interviews, and onboard candidates</p>
//           </div>
//           <button
//             onClick={() => setShowForm(true)}
//             className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:shadow-xl transition-all shrink-0"
//           >
//             <UserPlus className="h-4 w-4" /> New Application
//           </button>
//         </div>

//         {/* Flow Diagram */}
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-5">
//           <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-2">
//             <FileText className="h-4 w-4 text-primary" /> HR Agent Workflow
//           </h3>
//           <FlowDiagram />
//         </motion.div>

//         {/* KPI Cards */}
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//           <KpiCard title="Total Applications" value={hrStats.totalApplications} change="+12 this week" icon={UserPlus} delay={0} />
//           <KpiCard title="Shortlisted" value={hrStats.shortlisted} change={`${Math.round((hrStats.shortlisted / hrStats.totalApplications) * 100)}% rate`} icon={Star} delay={0.1} />
//           <KpiCard title="Interviews Scheduled" value={hrStats.interviewsScheduled} change="3 this week" changeType="neutral" icon={CalendarCheck} delay={0.2} />
//           <KpiCard title="Hired This Month" value={hrStats.hiredThisMonth} change="+2 vs last month" icon={Trophy} delay={0.3} />
//         </div>

//         {/* Filter Tabs */}
//         <div className="flex flex-wrap gap-2">
//           {[
//             { key: "all" as const, label: "All", count: candidates.length },
//             ...Object.entries(statusConfig).map(([key, val]) => ({ key: key as CandidateStatus, label: val.label, count: statusCounts[key] || 0 })),
//           ].map((tab) => (
//             <button
//               key={tab.key}
//               onClick={() => setFilter(tab.key)}
//               className={cn(
//                 "flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-medium transition-all border",
//                 filter === tab.key
//                   ? "border-primary/30 bg-primary/10 text-primary"
//                   : "border-border text-muted-foreground hover:bg-muted"
//               )}
//             >
//               {tab.label}
//               <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-bold", filter === tab.key ? "bg-primary/20" : "bg-muted")}>
//                 {tab.count}
//               </span>
//             </button>
//           ))}
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Candidate Cards */}
//           <div className="lg:col-span-2 space-y-4">
//             {filtered.length === 0 ? (
//               <div className="glass-card rounded-2xl p-10 text-center">
//                 <UserPlus className="h-10 w-10 mx-auto text-muted-foreground/40 mb-3" />
//                 <p className="text-sm text-muted-foreground">No candidates with this status</p>
//               </div>
//             ) : (
//               filtered.map((c) => (
//                 <CandidateCard
//                   key={c.id}
//                   candidate={actionLoading === c.id ? { ...c, status: c.status === "applied" ? "screening" : c.status } : c}
//                   onAction={handleAction}
//                 />
//               ))
//             )}
//           </div>

//           {/* Activity Log Sidebar */}
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-5 h-fit lg:sticky lg:top-24">
//             <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4">
//               <Clock className="h-4 w-4 text-primary" /> Recent Activity
//             </h3>
//             <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
//               {logs.slice(0, 10).map((log) => {
//                 const Icon = logTypeIcons[log.type];
//                 return (
//                   <motion.div
//                     key={log.id}
//                     initial={{ opacity: 0, x: -10 }}
//                     animate={{ opacity: 1, x: 0 }}
//                     className="flex gap-3"
//                   >
//                     <div className={cn("flex h-7 w-7 items-center justify-center rounded-lg shrink-0", logTypeColors[log.type])}>
//                       <Icon className="h-3.5 w-3.5" />
//                     </div>
//                     <div className="min-w-0">
//                       <p className="text-xs font-medium text-foreground">{log.action}</p>
//                       <p className="text-[10px] text-muted-foreground truncate">{log.detail}</p>
//                       <p className="text-[10px] text-muted-foreground/60 mt-0.5">{log.time}</p>
//                     </div>
//                   </motion.div>
//                 );
//               })}
//             </div>
//           </motion.div>
//         </div>
//       </div>

//       {/* Application Form Modal */}
//       <AnimatePresence>
//         {showForm && <ApplicationForm onSubmit={handleSubmitApplication} onClose={() => setShowForm(false)} />}
//       </AnimatePresence>
//     </DashboardLayout>
//   );
// };

// export default HRAgentPage;


import { useState } from "react";

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

// ─── Initial Mock Data ────────────────────────────────────────────────────────
const mockCandidates = [
  { id: 1, name: "Priya Sharma", email: "priya.sharma@gmail.com", phone: "+91 98765 43210", position: "Senior Frontend Developer", location: "Bangalore", experience: "6 years", education: "B.Tech CSE, IIT Delhi", resumeScore: 87, status: "shortlisted", appliedAt: "2 hours ago", notes: "Strong React & TypeScript. Led 3 major product launches." },
  { id: 2, name: "Rahul Mehta",  email: "rahul.mehta@outlook.com", phone: "+91 87654 32109", position: "Backend Engineer", location: "Mumbai", experience: "4 years", education: "M.Tech, BITS Pilani", resumeScore: 72, status: "interview_scheduled", appliedAt: "5 hours ago", interviewDate: "Feb 26, 2026 — 10:00 AM", meetLink: "https://meet.google.com/abc-defg-hij" },
  { id: 3, name: "Ananya Gupta", email: "ananya.g@yahoo.com",     phone: "+91 76543 21098", position: "UI/UX Designer",         location: "Pune",      experience: "3 years", education: "BDes, NID Ahmedabad", resumeScore: 91, status: "hired",     appliedAt: "1 day ago",   notes: "Exceptional portfolio. Figma expert." },
  { id: 4, name: "Vikram Singh", email: "vikram.s@gmail.com",     phone: "+91 65432 10987", position: "DevOps Engineer",        location: "Hyderabad", experience: "2 years", education: "B.Tech IT, VIT", resumeScore: 38, status: "rejected",  appliedAt: "1 day ago",   notes: "Limited CI/CD experience." },
  { id: 5, name: "Sneha Patel",  email: "sneha.patel@gmail.com",  phone: "+91 54321 09876", position: "Data Scientist",         location: "Chennai",   experience: "5 years", education: "MS Data Science, ISI", resumeScore: null, status: "applied",   appliedAt: "30 min ago" },
];

const mockLogs = [
  { id: 1, type: "apply",    action: "Application Received",    detail: "Sneha Patel applied for Data Scientist",                   time: "30 min ago" },
  { id: 2, type: "screen",   action: "AI Screening Started",    detail: "Arjun Reddy — Full Stack Developer",                       time: "15 min ago" },
  { id: 3, type: "schedule", action: "Interview Scheduled",     detail: "Rahul Mehta — Feb 24, 10:00 AM (Google Meet)",             time: "1 hour ago" },
  { id: 4, type: "hire",     action: "Candidate Hired",         detail: "Ananya Gupta — Offer letter + onboarding plan sent",       time: "1 day ago"  },
  { id: 5, type: "reject",   action: "Candidate Rejected",      detail: "Vikram Singh — DevOps Engineer — Score: 38/100",           time: "1 day ago"  },
  { id: 6, type: "email",    action: "Shortlist Email Sent",    detail: "Priya Sharma — Score: 87/100",                             time: "2 hours ago"},
];

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
function KpiCard({ title, value, sub, color = "#00e5a0", IconComp }) {
  return (
    <div style={{ background: "#0f1318", border: "1px solid #1e2830", borderRadius: 16, padding: "18px 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontSize: 11, color: "#6b7f8e", marginBottom: 6, fontFamily: "monospace", letterSpacing: 1, textTransform: "uppercase" }}>{title}</p>
          <p style={{ fontSize: 28, fontWeight: 800, color: "#e8edf2" }}>{value}</p>
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
  const [form, setForm] = useState({ name: "", email: "", phone: "", position: "", location: "", experience: "", education: "", resumeText: "" });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

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
    <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(8,11,15,0.85)", backdropFilter: "blur(8px)", padding: 16 }} onClick={onClose}>
      <div style={{ background: "#0f1318", border: "1px solid #1e2830", borderRadius: 20, padding: 28, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: "#e8edf2", display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
          <Icons.UserPlus size={20} /> New Application
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {fields.map(f => (
            <div key={f.key}>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#e8edf2", display: "block", marginBottom: 5 }}>{f.label}</label>
              <div style={{ position: "relative" }}>
                <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#6b7f8e", pointerEvents: "none" }}>
                  <f.Icon size={14} />
                </div>
                <input
                  type={f.type}
                  value={form[f.key]}
                  onChange={e => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  style={{ width: "100%", background: "#161c24", border: "1px solid #1e2830", borderRadius: 10, padding: "10px 12px 10px 34px", fontSize: 13, color: "#e8edf2", outline: "none", boxSizing: "border-box" }}
                />
              </div>
            </div>
          ))}
          <div>
            <label style={{ fontSize: 11, fontWeight: 600, color: "#e8edf2", display: "block", marginBottom: 5 }}>Resume / Skills Summary</label>
            <textarea
              value={form.resumeText}
              onChange={e => set("resumeText", e.target.value)}
              placeholder="Paste resume text or summarize skills, experience, and achievements..."
              rows={4}
              style={{ width: "100%", background: "#161c24", border: "1px solid #1e2830", borderRadius: 10, padding: "10px 12px", fontSize: 13, color: "#e8edf2", outline: "none", resize: "vertical", boxSizing: "border-box", fontFamily: "inherit" }}
            />
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
          <button onClick={onClose} style={{ flex: 1, background: "transparent", border: "1px solid #1e2830", borderRadius: 10, padding: "10px 0", fontSize: 13, color: "#6b7f8e", cursor: "pointer", fontWeight: 600 }}>
            Cancel
          </button>
          <button
            onClick={() => { if (form.name && form.email && form.position) onSubmit(form); }}
            disabled={loading || !form.name || !form.email || !form.position}
            style={{ flex: 2, background: "#00e5a0", border: "none", borderRadius: 10, padding: "10px 0", fontSize: 13, color: "#080b0f", cursor: "pointer", fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, opacity: (!form.name || !form.email || !form.position) ? 0.5 : 1 }}
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
    <div style={{ background: "#0f1318", border: "1px solid #1e2830", borderRadius: 16, overflow: "hidden", transition: "border-color 0.2s" }}>
      <div style={{ padding: "18px 20px" }}>
        {/* Top Row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(0,229,160,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icons.User size={18} style={{ color: "#00e5a0" }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#e8edf2", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{candidate.name}</p>
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
              <p style={{ fontSize: 12, fontWeight: 600, color: "#e8edf2" }}>{candidate.interviewDate}</p>
              {candidate.meetLink && (
                <a href={candidate.meetLink} target="_blank" rel="noreferrer" style={{ fontSize: 10, color: "#00e5a0", textDecoration: "none", display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
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
              <span style={{ fontWeight: 700, color: "#e8edf2" }}>AI Notes: </span>{candidate.notes}
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
            <span style={{ fontSize: 12, fontWeight: 700, color: "#e8edf2" }}>{s.label}</span>
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
  const colors = { success: "#00e5a0", error: "#f87171", info: "#60a5fa" };
  return (
    <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 999, background: "#0f1318", border: `1px solid ${colors[type]}40`, borderRadius: 12, padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, boxShadow: `0 8px 32px ${colors[type]}20`, maxWidth: 380, animation: "slideIn 0.3s ease" }}>
      <div style={{ width: 8, height: 8, borderRadius: "50%", background: colors[type], flexShrink: 0 }} />
      <p style={{ fontSize: 13, color: "#e8edf2", flex: 1 }}>{message}</p>
      <button onClick={onClose} style={{ background: "none", border: "none", color: "#6b7f8e", cursor: "pointer", fontSize: 16, lineHeight: 1 }}>×</button>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function HRAgentPage() {
  const [candidates, setCandidates] = useState(mockCandidates);
  const [logs, setLogs]             = useState(mockLogs);
  const [showForm, setShowForm]     = useState(false);
  const [filter, setFilter]         = useState("all");
  const [actionLoading, setActionLoading] = useState(null);
  const [formLoading, setFormLoading]     = useState(false);
  const [toast, setToast]           = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const addLog = (type, action, detail) => {
    setLogs(prev => [{ id: Date.now(), type, action, detail, time: "Just now" }, ...prev]);
  };

  // ── Submit Application → POST /hr/apply ──────────────────────────────────
  const handleSubmitApplication = async (form) => {
    setFormLoading(true);
    try {
      const res = await apiCall("/hr/apply", {
        name:       form.name,
        email:      form.email,
        role:       form.position,
        salary:     "To be discussed",
        startDate:  "To be confirmed",
        resumeText: form.resumeText || `${form.experience} experience. ${form.education}.`,
      });

      const screening = res.result?.screening;
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

      showToast(`✅ Application submitted! AI Score: ${score ?? "pending"}/100 — ${decision}`, "success");
      setShowForm(false);
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
        // Re-screen via /hr/apply
        const res = await apiCall("/hr/apply", {
          name: candidate.name, email: candidate.email,
          role: candidate.position, resumeText: candidate.notes || candidate.position,
        });
        const screening = res.result?.screening;
        const score     = screening?.score ?? Math.floor(Math.random() * 60) + 30;
        const decision  = screening?.decision ?? (score >= 50 ? "selected" : "rejected");
        const newStatus = decision === "selected" ? "shortlisted" : "rejected";
        setCandidates(prev => prev.map(c => c.id === id ? { ...c, resumeScore: score, status: newStatus, notes: screening?.summary || c.notes } : c));
        addLog("screen", `AI Score: ${score}/100 → ${decision}`, candidate.name);
        addLog("email", `${newStatus === "shortlisted" ? "Shortlist" : "Rejection"} email sent`, candidate.email);
        showToast(`🤖 Score: ${score}/100 — ${decision}`, score >= 50 ? "success" : "error");
      }

      if (action === "schedule") {
        await apiCall("/hr/schedule-interview", {
          name: candidate.name, email: candidate.email, role: candidate.position,
        });
        const dateStr = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) + " — 10:00 AM";
        const meetLink = `https://meet.google.com/${Math.random().toString(36).slice(2,5)}-${Math.random().toString(36).slice(2,6)}-${Math.random().toString(36).slice(2,5)}`;
        setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: "interview_scheduled", interviewDate: dateStr, meetLink } : c));
        addLog("schedule", "Interview Scheduled + Google Meet", `${candidate.name} — ${dateStr}`);
        addLog("email", "Calendar invite + Meet link sent", candidate.email);
        showToast("📅 Interview scheduled! Calendar invite sent.", "success");
      }

      if (action === "hire") {
        await apiCall("/hr/hire", {
          name: candidate.name, email: candidate.email, role: candidate.position,
          salary: "$80,000/year", startDate: "March 1, 2026",
          resumeText: candidate.notes || candidate.position,
        });
        setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: "hired" } : c));
        addLog("hire",  "Candidate Hired",           `${candidate.name} — ${candidate.position}`);
        addLog("email", "Offer Letter Sent",          candidate.email);
        addLog("email", "5-Day Onboarding Plan Sent", candidate.email);
        showToast("🎉 Hired! Offer letter + onboarding plan sent.", "success");
      }

      if (action === "reject") {
        await apiCall("/hr/reject", {
          name: candidate.name, email: candidate.email, role: candidate.position,
        });
        setCandidates(prev => prev.map(c => c.id === id ? { ...c, status: "rejected" } : c));
        addLog("reject", "Candidate Rejected",      `${candidate.name} — ${candidate.position}`);
        addLog("email",  "Rejection Email Sent",    candidate.email);
        showToast("Rejection email sent to candidate.", "info");
      }
    } catch (err) {
      showToast(`❌ API Error: ${err.message}`, "error");
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = filter === "all" ? candidates : candidates.filter(c => c.status === filter);
  const counts   = candidates.reduce((a, c) => ({ ...a, [c.status]: (a[c.status] || 0) + 1 }), {});

  const logColors = { apply: "#60a5fa", screen: "#fbbf24", schedule: "#a78bfa", hire: "#4ade80", reject: "#f87171", email: "#00e5a0" };
  const logIcons  = { apply: Icons.UserPlus, screen: Icons.Brain, schedule: Icons.Calendar, hire: Icons.Trophy, reject: Icons.X, email: Icons.Mail };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Segoe UI', system-ui, sans-serif; background: #080b0f; color: #e8edf2; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1e2830; border-radius: 4px; }
        input:focus, textarea:focus { border-color: #00e5a0 !important; }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#080b0f", padding: "28px 24px", maxWidth: 1400, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "#e8edf2", display: "flex", alignItems: "center", gap: 10 }}>
              <Icons.Sparkles size={26} style={{ color: "#00e5a0" }} /> HR Agent
            </h1>
            <p style={{ fontSize: 13, color: "#6b7f8e", marginTop: 4 }}>AI-powered hiring — screen resumes, schedule interviews, send offers & onboard</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            style={{ display: "flex", alignItems: "center", gap: 8, background: "#00e5a0", border: "none", borderRadius: 12, padding: "11px 20px", fontSize: 13, fontWeight: 800, color: "#080b0f", cursor: "pointer", boxShadow: "0 4px 20px rgba(0,229,160,0.3)" }}
          >
            <Icons.UserPlus size={16} /> New Application
          </button>
        </div>

        {/* Flow Diagram */}
        <div style={{ background: "#0f1318", border: "1px solid #1e2830", borderRadius: 16, padding: "18px 20px", marginBottom: 24 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: "#e8edf2", marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
            <Icons.Arrow size={14} style={{ color: "#00e5a0" }} /> HR Agent Workflow
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

        {/* Filter Tabs */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {[{ key: "all", label: "All", count: candidates.length }, ...Object.entries(statusConfig).map(([k, v]) => ({ key: k, label: v.label, count: counts[k] || 0 }))].map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, border: `1px solid ${filter === tab.key ? "#00e5a030" : "#1e2830"}`, background: filter === tab.key ? "rgba(0,229,160,0.08)" : "transparent", color: filter === tab.key ? "#00e5a0" : "#6b7f8e", cursor: "pointer", transition: "all 0.15s" }}
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
            {filtered.length === 0 ? (
              <div style={{ background: "#0f1318", border: "1px solid #1e2830", borderRadius: 16, padding: "48px 24px", textAlign: "center" }}>
                <Icons.UserPlus size={40} style={{ color: "#3d4f5c", display: "block", margin: "0 auto 12px" }} />
                <p style={{ fontSize: 13, color: "#6b7f8e" }}>No candidates with this status</p>
              </div>
            ) : filtered.map(c => (
              <CandidateCard key={c.id} candidate={c} onAction={handleAction} actionLoading={actionLoading} />
            ))}
          </div>

          {/* Activity Log */}
          <div style={{ background: "#0f1318", border: "1px solid #1e2830", borderRadius: 16, padding: "18px 20px", position: "sticky", top: 24 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "#e8edf2", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
              <Icons.Clock size={14} style={{ color: "#00e5a0" }} /> Live Activity Log
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, maxHeight: 520, overflowY: "auto", paddingRight: 4 }}>
              {logs.slice(0, 12).map(log => {
                const LogIcon = logIcons[log.type] || Icons.Alert;
                const col = logColors[log.type] || "#6b7f8e";
                return (
                  <div key={log.id} style={{ display: "flex", gap: 10 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: col + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <LogIcon size={13} style={{ color: col }} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "#e8edf2" }}>{log.action}</p>
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