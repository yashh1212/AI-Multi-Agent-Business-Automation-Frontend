import { motion } from "framer-motion";
import { TrendingUp, Clock, CheckCircle2, BarChart3, Loader2 } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, RadialBarChart, RadialBar } from "recharts";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { useDashboard } from "@/lib/api";

const AnalyticsPage = () => {
  const { data, isLoading, error } = useDashboard();
  const stats = data?.stats;
  const chartData = data?.chartData;
  const agents = data?.agents || [];

  // Build radial data from live agent performance
  const colorPalette = [
    "hsl(199, 89%, 48%)",
    "hsl(167, 72%, 42%)",
    "hsl(262, 83%, 58%)",
    "hsl(38, 92%, 50%)",
    "hsl(346, 77%, 50%)",
    "hsl(142, 71%, 45%)",
    "hsl(217, 91%, 60%)",
    "hsl(25, 95%, 53%)",
  ];

  const radialData = agents.slice(0, 4).map((agent, i) => ({
    name: agent.name,
    value: agent.performance,
    fill: colorPalette[i % colorPalette.length],
  }));

  const totalTasks = agents.reduce((sum, a) => sum + a.tasksCompleted, 0);
  const avgPerformance = agents.length > 0
    ? (agents.reduce((sum, a) => sum + a.performance, 0) / agents.length).toFixed(1)
    : "0";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
            <p className="text-sm text-muted-foreground">Performance insights across your automation platform</p>
          </div>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            Failed to load analytics data. Retrying...
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Total Actions" value={totalTasks} change="Last 7 days" changeType="neutral" icon={Clock} delay={0} />
          <KpiCard
            title="Conversion Rate"
            value={stats?.conversionRate ?? "0%"}
            change="Leads → Closed Won"
            changeType="neutral"
            icon={CheckCircle2}
            delay={0.1}
          />
          <KpiCard title="Candidates Processed" value={stats?.totalCandidates ?? 0} change={`${stats?.hiredTotal ?? 0} hired`} icon={TrendingUp} delay={0.2} />
          <KpiCard
            title="Avg Agent Score"
            value={`${avgPerformance}%`}
            change="Across all agents"
            changeType="neutral"
            icon={BarChart3}
            delay={0.3}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Agent Comparison */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Agent Performance Comparison</h3>
            {radialData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <RadialBarChart innerRadius="30%" outerRadius="90%" data={radialData} startAngle={180} endAngle={0}>
                    <RadialBar dataKey="value" cornerRadius={10} />
                    <Tooltip contentStyle={{ backgroundColor: "hsl(222, 44%, 9%)", border: "1px solid hsl(222, 30%, 16%)", borderRadius: "8px", color: "hsl(210, 40%, 96%)" }} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center gap-4 mt-2">
                  {radialData.map(d => (
                    <div key={d.name} className="flex items-center gap-2 text-xs">
                      <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.fill }} />
                      <span className="text-muted-foreground">{d.name}: {d.value}%</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
                No agent data yet
              </div>
            )}
          </motion.div>

          {/* Workflow Trend */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Automation Growth</h3>
            {chartData?.workflowTrend && chartData.workflowTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData.workflowTrend}>
                  <defs>
                    <linearGradient id="execGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
                  <XAxis dataKey="name" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222, 44%, 9%)", border: "1px solid hsl(222, 30%, 16%)", borderRadius: "8px", color: "hsl(210, 40%, 96%)" }} />
                  <Area type="monotone" dataKey="executions" stroke="hsl(199, 89%, 48%)" fill="url(#execGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-sm text-muted-foreground">
                No workflow trend data yet
              </div>
            )}
          </motion.div>
        </div>

        {/* Communication Analytics */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Communication Analytics (Email Activity)</h3>
          {chartData?.emailAnalytics && chartData.emailAnalytics.some((d: Record<string, unknown>) => (d.sent as number) > 0) ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData.emailAnalytics}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
                <XAxis dataKey="name" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(222, 44%, 9%)", border: "1px solid hsl(222, 30%, 16%)", borderRadius: "8px", color: "hsl(210, 40%, 96%)" }} />
                <Bar dataKey="sent" name="Sent" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="opened" name="Opened" fill="hsl(167, 72%, 42%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[260px] text-sm text-muted-foreground">
              No email analytics yet — data will populate from HR & Sales email activity
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;
