import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Mail, GitBranch, MessageSquare, Target, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useDashboardLogs } from "@/lib/api";
import { cn } from "@/lib/utils";

const typeConfig: Record<string, { icon: typeof Bot; color: string }> = {
  agent: { icon: Bot, color: "bg-primary/10 text-primary border-primary/30" },
  email: { icon: Mail, color: "bg-success/10 text-success border-success/30" },
  workflow: { icon: GitBranch, color: "bg-accent/10 text-accent border-accent/30" },
  slack: { icon: MessageSquare, color: "bg-warning/10 text-warning border-warning/30" },
  jira: { icon: Target, color: "bg-destructive/10 text-destructive border-destructive/30" },
};

const defaultConfig = { icon: Bot, color: "bg-muted/10 text-muted-foreground border-border" };

const filterOptions = ["All", "Agent", "Email", "Workflow", "Slack", "Jira"] as const;

const SkeletonLogItem = () => (
  <div className="relative flex items-start gap-4 py-3 pl-2 animate-pulse">
    <div className="h-8 w-8 rounded-full bg-muted shrink-0" />
    <div className="flex-1 pt-0.5 space-y-1.5">
      <div className="h-3 w-40 bg-muted rounded" />
      <div className="h-3 w-64 bg-muted rounded" />
    </div>
  </div>
);

const LogsPage = () => {
  const { data: logs, isLoading, error } = useDashboardLogs();
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const safeLogs = logs || [];
  const filteredLogs = activeFilter === "All"
    ? safeLogs
    : safeLogs.filter(log => log.type === activeFilter.toLowerCase());

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Activity Logs</h1>
            <p className="text-sm text-muted-foreground">Real-time timeline of all platform activity</p>
          </div>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            Failed to load activity logs. Retrying...
          </div>
        )}

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                "rounded-full px-4 py-1.5 text-xs font-medium border transition-colors cursor-pointer",
                activeFilter === f
                  ? "bg-primary/10 text-primary border-primary/30"
                  : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
              )}
            >
              {f}
              {f !== "All" && (
                <span className="ml-1.5 text-[10px] opacity-70">
                  ({safeLogs.filter(l => l.type === f.toLowerCase()).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-1">
            {isLoading && safeLogs.length === 0 ? (
              Array(8).fill(0).map((_, i) => <SkeletonLogItem key={i} />)
            ) : filteredLogs.length === 0 ? (
              <div className="relative pl-14 py-8 text-sm text-muted-foreground">
                {safeLogs.length === 0
                  ? "No activity yet — run HR or Sales flows to generate logs"
                  : `No ${activeFilter.toLowerCase()} logs found`}
              </div>
            ) : (
              filteredLogs.map((log, i) => {
                const config = typeConfig[log.type] || defaultConfig;
                const Icon = config.icon;
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="relative flex items-start gap-4 py-3 pl-2"
                  >
                    <div className={cn("relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border", config.color)}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0 pt-0.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-semibold text-foreground">{log.agent}</span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">{log.timestamp}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{log.action}</p>
                      {log.detail && (
                        <p className="text-xs text-muted-foreground/70 mt-0.5 truncate">{log.detail}</p>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LogsPage;
