import { motion } from "framer-motion";
import { Bot, GitBranch, Mail, BarChart3, Zap, MessageSquare, Target, Database } from "lucide-react";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { dashboardStats, chartData, agents } from "@/data/mockData";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const Dashboard = () => {
  const runningAgents = agents.filter(a => a.status === "running" || a.status === "thinking");

  return (
    <DashboardLayout>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm">AI agents are managing your business workflows</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Active Agents" value={`${dashboardStats.activeAgents}/${dashboardStats.totalAgents}`} change="+2 since yesterday" icon={Bot} delay={0} />
          <KpiCard title="Running Workflows" value={dashboardStats.runningWorkflows} change="3 in progress" changeType="neutral" icon={GitBranch} delay={0.1} />
          <KpiCard title="Emails Sent Today" value={dashboardStats.emailsSent} change="+12% vs last week" icon={Mail} delay={0.2} />
          <KpiCard title="Completed Today" value={dashboardStats.completedToday} change="+8% vs yesterday" icon={Zap} delay={0.3} />
        </div>

        {/* Secondary Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Jira Tickets" value={dashboardStats.jiraTickets} change="5 resolved" icon={Target} delay={0.4} />
          <KpiCard title="Slack Messages" value={dashboardStats.slackMessages} change="+18% engagement" icon={MessageSquare} delay={0.5} />
          <KpiCard title="CRM Leads" value={dashboardStats.crmLeads} change="23 qualified" icon={BarChart3} delay={0.6} />
          <KpiCard title="ERP Syncs" value={dashboardStats.erpSyncs} change="All synced" changeType="neutral" icon={Database} delay={0.7} />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Agent Performance */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Agent Performance</h3>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData.agentPerformance}>
                <defs>
                  <linearGradient id="colorManager" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorComm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(167, 72%, 42%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(167, 72%, 42%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
                <XAxis dataKey="name" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} domain={[80, 100]} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(222, 44%, 9%)", border: "1px solid hsl(222, 30%, 16%)", borderRadius: "8px", color: "hsl(210, 40%, 96%)" }} />
                <Area type="monotone" dataKey="manager" stroke="hsl(199, 89%, 48%)" fill="url(#colorManager)" strokeWidth={2} />
                <Area type="monotone" dataKey="communication" stroke="hsl(167, 72%, 42%)" fill="url(#colorComm)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Workflow Execution Trend */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Workflow Executions</h3>
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
          </motion.div>
        </div>

        {/* Active Agents Strip */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Live Agent Activity</h3>
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
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
