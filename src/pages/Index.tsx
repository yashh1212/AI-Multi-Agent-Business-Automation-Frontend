import { motion } from "framer-motion";
import { Bot, GitBranch, Mail, BarChart3, Zap, Users, Target, DollarSign, Loader2, IndianRupee } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { useDashboard } from "@/lib/api";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const SkeletonCard = () => (
  <div className="glass-card rounded-2xl p-5 animate-pulse">
    <div className="h-4 w-24 bg-muted rounded mb-2" />
    <div className="h-8 w-16 bg-muted rounded mb-1" />
    <div className="h-3 w-20 bg-muted rounded" />
  </div>
);

const Dashboard = () => {
  const { data, isLoading, error, dataUpdatedAt } = useDashboard();
  const stats = data?.stats;
  const chartData = data?.chartData;
  const agents = data?.agents;

  const runningAgents = agents?.filter(a => a.status === "running" || a.status === "thinking") || [];

  return (
    <DashboardLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            {dataUpdatedAt > 0 && (
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                {isLoading && <Loader2 className="h-3 w-3 animate-spin" />}
                Live · refreshes every 30s
              </span>
            )}
          </div>
          <p className="text-muted-foreground text-sm">AI agents are managing your business workflows</p>
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            Failed to load dashboard data. Retrying...
          </div>
        )}

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading && !stats ? (
            Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <>
              <KpiCard title="Total Candidates" value={stats?.totalCandidates ?? 0} change={`${stats?.activeCandidates ?? 0} active`} icon={Users} delay={0} />
              <KpiCard title="Hired" value={stats?.hiredTotal ?? 0} change={`${stats?.hiredToday ?? 0} today`} changeType={stats?.hiredToday ? "positive" : "neutral"} icon={Zap} delay={0.1} />
              <KpiCard title="Total Leads" value={stats?.totalLeads ?? 0} change={`${stats?.activeLeads ?? 0} in pipeline`} icon={Target} delay={0.2} />
              <KpiCard title="Revenue" value={`₹${((stats?.totalRevenue ?? 0) / 1000).toFixed(1)}k`} change={`${stats?.conversionRate ?? "0%"} conversion`} icon={IndianRupee} delay={0.3} />
            </>
          )}
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading && !stats ? (
            Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <>
              <KpiCard title="Interviews" value={stats?.interviewScheduled ?? 0} change="Scheduled" changeType="neutral" icon={GitBranch} delay={0.4} />
              {/* <KpiCard title="Emails Today" value={stats?.emailsSentToday ?? 0} change="Today" changeType="neutral" icon={Mail} delay={0.2} /> */}
              <KpiCard title="Won Deals" value={stats?.closedWon ?? 0} change={`${stats?.closedLost ?? 0} lost`} icon={BarChart3} delay={0.6} />
              <KpiCard title="Completed Today" value={stats?.completedToday ?? 0} change="HR + Sales actions" changeType="neutral" icon={Bot} delay={0.7} />
            </>
          )}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Agent Performance */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Agent Performance</h3>
            {chartData?.agentPerformance && chartData.agentPerformance.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={chartData.agentPerformance}>
                  <defs>
                    <linearGradient id="colorScreening" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(167, 72%, 42%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(167, 72%, 42%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
                  <XAxis dataKey="name" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} domain={[70, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222, 44%, 9%)", border: "1px solid hsl(222, 30%, 16%)", borderRadius: "8px", color: "hsl(210, 40%, 96%)" }} />
                  <Area type="monotone" dataKey="screening" name="HR Screening" stroke="hsl(199, 89%, 48%)" fill="url(#colorScreening)" strokeWidth={2} />
                  <Area type="monotone" dataKey="sales" name="Sales" stroke="hsl(167, 72%, 42%)" fill="url(#colorSales)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[260px] text-sm text-muted-foreground">
                No performance data yet — run HR or Sales flows to populate
              </div>
            )}
          </motion.div>

          {/* Workflow Execution Trend */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Workflow Executions</h3>
            {chartData?.workflowTrend && chartData.workflowTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={chartData.workflowTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
                  <XAxis dataKey="name" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222, 44%, 9%)", border: "1px solid hsl(222, 30%, 16%)", borderRadius: "8px", color: "hsl(210, 40%, 96%)" }} />
                  <Bar dataKey="successful" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="failed" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[260px] text-sm text-muted-foreground">
                No workflow data yet — activity will appear here weekly
              </div>
            )}
          </motion.div>
        </div>

        {/* Active Agents Strip */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Live Agent Activity</h3>
          {runningAgents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {runningAgents.map((agent) => (
                <div key={agent.id} className="flex items-center gap-3 rounded-xl bg-muted/50 p-3">
                  <div className={`status-dot ${agent.status === "running" ? "status-running" : "status-thinking"}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.status === "running" ? "Running" : "Thinking"} · {agent.lastActivity}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">All agents are idle — trigger an HR or Sales flow to activate</p>
          )}
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
