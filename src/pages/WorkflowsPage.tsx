import { motion } from "framer-motion";
import { Play, Pause, ChevronRight, Clock, RotateCcw, CheckCircle2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { workflows } from "@/data/mockData";
import { cn } from "@/lib/utils";

const statusConfig = {
  running: { label: "Running", class: "bg-primary/10 text-primary border-primary/30" },
  completed: { label: "Completed", class: "bg-success/10 text-success border-success/30" },
  paused: { label: "Paused", class: "bg-warning/10 text-warning border-warning/30" },
} as const;

const WorkflowsPage = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Workflows</h1>
          <p className="text-sm text-muted-foreground">Visual automation pipelines</p>
        </div>
        <button className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          + New Workflow
        </button>
      </div>

      <div className="space-y-4">
        {workflows.map((wf, i) => (
          <motion.div
            key={wf.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card-hover rounded-2xl p-5"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-foreground">{wf.name}</h3>
                <span className={cn("text-xs px-2.5 py-0.5 rounded-full border font-medium", statusConfig[wf.status].class)}>
                  {statusConfig[wf.status].label}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" />{wf.lastRun}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><RotateCcw className="h-3 w-3" />{wf.totalRuns} runs</span>
                <button className="ml-2 rounded-lg p-2 text-muted-foreground hover:bg-muted transition-colors">
                  {wf.status === "running" ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Visual Pipeline */}
            <div className="flex items-center gap-1 overflow-x-auto pb-2">
              {wf.steps.map((step, idx) => {
                const isCompleted = idx < wf.completedSteps;
                const isActive = idx === wf.completedSteps && wf.status === "running";
                return (
                  <div key={idx} className="flex items-center gap-1 shrink-0">
                    <div className={cn(
                      "flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-medium border transition-all",
                      isCompleted ? "bg-primary/10 border-primary/30 text-primary" :
                      isActive ? "bg-warning/10 border-warning/30 text-warning ai-pulse" :
                      "bg-muted/50 border-border text-muted-foreground"
                    )}>
                      {isCompleted && <CheckCircle2 className="h-3.5 w-3.5" />}
                      {isActive && <div className="status-dot status-thinking" />}
                      {step}
                    </div>
                    {idx < wf.steps.length - 1 && (
                      <ChevronRight className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Progress bar */}
            <div className="mt-3 h-1.5 w-full rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(wf.completedSteps / wf.steps.length) * 100}%` }}
                transition={{ duration: 1, delay: i * 0.1 + 0.3 }}
                className="h-full rounded-full bg-primary"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default WorkflowsPage;
