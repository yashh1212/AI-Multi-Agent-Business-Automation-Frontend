import { motion } from "framer-motion";
import { Mail, Eye, Send, AlertTriangle, FileText, Edit, BarChart3 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { emailTemplates, emailLogs, chartData } from "@/data/mockData";
import { cn } from "@/lib/utils";

const statusColors = {
  delivered: "bg-success/10 text-success",
  opened: "bg-primary/10 text-primary",
  failed: "bg-destructive/10 text-destructive",
};

const MailPage = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mail Automation</h1>
        <p className="text-sm text-muted-foreground">Manage email templates, workflows, and analytics</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Emails Sent" value="1,831" change="+12% this week" icon={Send} delay={0} />
        <KpiCard title="Open Rate" value="82.3%" change="+3.2%" icon={Eye} delay={0.1} />
        <KpiCard title="Success Rate" value="97.8%" change="Stable" changeType="neutral" icon={Mail} delay={0.2} />
        <KpiCard title="Failed" value="41" change="-8 vs last week" icon={AlertTriangle} delay={0.3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Templates */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><FileText className="h-4 w-4 text-primary" />Email Templates</h3>
            <button className="text-xs text-primary hover:underline">+ New</button>
          </div>
          <div className="space-y-2">
            {emailTemplates.map((t) => (
              <div key={t.id} className="flex items-center justify-between rounded-xl bg-muted/30 p-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground truncate">{t.name}</p>
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", t.status === "active" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground")}>
                      {t.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{t.subject}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  <span className="text-xs text-muted-foreground">{t.sentCount} sent</span>
                  <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors">
                    <Edit className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Email Analytics Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4"><BarChart3 className="h-4 w-4 text-primary" />Email Analytics</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData.emailAnalytics}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
              <XAxis dataKey="name" stroke="hsl(215, 20%, 55%)" fontSize={12} />
              <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
              <Tooltip contentStyle={{ backgroundColor: "hsl(222, 44%, 9%)", border: "1px solid hsl(222, 30%, 16%)", borderRadius: "8px", color: "hsl(210, 40%, 96%)" }} />
              <Bar dataKey="sent" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="opened" fill="hsl(167, 72%, 42%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="clicked" fill="hsl(262, 83%, 58%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Logs Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4">Recent Email Logs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground">Recipient</th>
                <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground">Subject</th>
                <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground">Status</th>
                <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {emailLogs.map((log) => (
                <tr key={log.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-3 text-foreground font-medium">{log.recipient}</td>
                  <td className="py-3 px-3 text-muted-foreground">{log.subject}</td>
                  <td className="py-3 px-3">
                    <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", statusColors[log.status])}>
                      {log.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-muted-foreground">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  </DashboardLayout>
);

export default MailPage;
