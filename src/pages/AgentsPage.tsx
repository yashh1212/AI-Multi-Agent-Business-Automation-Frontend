import { motion } from "framer-motion";
import { Bot, Activity, Clock, Gauge, Cpu } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { agents } from "@/data/mockData";
import { cn } from "@/lib/utils";

const statusLabel = { running: "Running", thinking: "Thinking", idle: "Idle" } as const;
const statusClass = { running: "status-running", thinking: "status-thinking", idle: "status-idle" } as const;

const AgentsPage = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">AI Agents</h1>
        <p className="text-sm text-muted-foreground">Monitor and manage your AI workforce</p>
      </div>

      {/* Summary strip */}
      <div className="flex flex-wrap gap-4">
        {(["running", "thinking", "idle"] as const).map((s) => {
          const count = agents.filter(a => a.status === s).length;
          return (
            <div key={s} className="flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm">
              <span className={cn("status-dot", statusClass[s])} />
              <span className="font-medium text-foreground">{count}</span>
              <span className="text-muted-foreground">{statusLabel[s]}</span>
            </div>
          );
        })}
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {agents.map((agent, i) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={cn(
              "glass-card-hover rounded-2xl p-5 flex flex-col gap-4",
              agent.status === "running" && "border-primary/20"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-xl",
                  agent.status === "running" ? "bg-primary/15 ai-glow" : agent.status === "thinking" ? "bg-warning/15" : "bg-muted"
                )}>
                  {agent.status === "thinking" ? (
                    <Cpu className="h-5 w-5 text-warning ai-pulse" />
                  ) : (
                    <Bot className={cn("h-5 w-5", agent.status === "running" ? "text-primary" : "text-muted-foreground")} />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{agent.name}</h3>
                  <p className="text-xs text-muted-foreground">{agent.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={cn("status-dot", statusClass[agent.status])} />
                <span className="text-xs text-muted-foreground">{statusLabel[agent.status]}</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">{agent.description}</p>

            <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Activity className="h-3 w-3" />
                </div>
                <p className="text-sm font-semibold text-foreground">{agent.tasksCompleted}</p>
                <p className="text-[10px] text-muted-foreground">Tasks</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Clock className="h-3 w-3" />
                </div>
                <p className="text-sm font-semibold text-foreground">{agent.lastActivity}</p>
                <p className="text-[10px] text-muted-foreground">Last Active</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                  <Gauge className="h-3 w-3" />
                </div>
                <p className="text-sm font-semibold text-foreground">{agent.performance}%</p>
                <p className="text-[10px] text-muted-foreground">Score</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default AgentsPage;
