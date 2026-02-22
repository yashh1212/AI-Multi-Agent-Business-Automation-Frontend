import { motion } from "framer-motion";
import { Bot, Mail, GitBranch, MessageSquare, Target } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { activityLogs } from "@/data/mockData";
import { cn } from "@/lib/utils";

const typeConfig = {
  agent: { icon: Bot, color: "bg-primary/10 text-primary border-primary/30" },
  email: { icon: Mail, color: "bg-success/10 text-success border-success/30" },
  workflow: { icon: GitBranch, color: "bg-accent/10 text-accent border-accent/30" },
  slack: { icon: MessageSquare, color: "bg-warning/10 text-warning border-warning/30" },
  jira: { icon: Target, color: "bg-destructive/10 text-destructive border-destructive/30" },
};

const LogsPage = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Activity Logs</h1>
        <p className="text-sm text-muted-foreground">Real-time timeline of all platform activity</p>
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2">
        {["All", "Agent", "Email", "Workflow", "Slack", "Jira"].map((f) => (
          <button key={f} className={cn(
            "rounded-full px-4 py-1.5 text-xs font-medium border transition-colors",
            f === "All" ? "bg-primary/10 text-primary border-primary/30" : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
          )}>
            {f}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />
        <div className="space-y-1">
          {activityLogs.map((log, i) => {
            const config = typeConfig[log.type];
            const Icon = config.icon;
            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
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
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  </DashboardLayout>
);

export default LogsPage;
