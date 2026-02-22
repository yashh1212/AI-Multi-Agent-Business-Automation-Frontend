import { motion } from "framer-motion";
import { TrendingUp, Clock, CheckCircle2, BarChart3 } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, RadialBarChart, RadialBar } from "recharts";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { chartData } from "@/data/mockData";

const radialData = [
  { name: "Manager", value: 98, fill: "hsl(199, 89%, 48%)" },
  { name: "Communication", value: 99, fill: "hsl(167, 72%, 42%)" },
  { name: "Analytics", value: 96, fill: "hsl(262, 83%, 58%)" },
  { name: "Research", value: 94, fill: "hsl(38, 92%, 50%)" },
];

const AnalyticsPage = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">Performance insights across your automation platform</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Time Saved" value="142h" change="This month" changeType="neutral" icon={Clock} delay={0} />
        <KpiCard title="Success Rate" value="97.2%" change="+1.8% vs last month" icon={CheckCircle2} delay={0.1} />
        <KpiCard title="Automations" value="2,847" change="+23% growth" icon={TrendingUp} delay={0.2} />
        <KpiCard title="Avg Score" value="95.6%" change="Across all agents" changeType="neutral" icon={BarChart3} delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Comparison */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Agent Performance Comparison</h3>
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
        </motion.div>

        {/* Workflow Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Automation Growth</h3>
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
        </motion.div>
      </div>

      {/* Communication Analytics */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Communication Analytics (Slack + Email)</h3>
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
      </motion.div>
    </div>
  </DashboardLayout>
);

export default AnalyticsPage;
