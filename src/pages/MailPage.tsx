import { motion } from "framer-motion";
import { Mail, Eye, Send, AlertTriangle, FileText, Edit, BarChart3, Loader2 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { useDashboard } from "@/lib/api";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  delivered: "bg-success/10 text-success",
  opened: "bg-primary/10 text-primary",
  failed: "bg-destructive/10 text-destructive",
  active: "bg-success/10 text-success",
  draft: "bg-muted text-muted-foreground",
};

const MailPage = () => {
  const { data, isLoading, error } = useDashboard();
  const stats = data?.stats;
  const chartData = data?.chartData;
  const emailTemplates = data?.emailTemplates || [];
  const activityLogs = data?.activityLogs || [];

  // Email logs from activity logs
  const emailLogs = activityLogs
    .filter(log => log.type === "email")
    .map(log => ({
      id: log.id,
      recipient: log.detail?.split("—")[0]?.trim() || "—",
      subject: log.action,
      status: "delivered" as const,
      timestamp: log.timestamp,
    }));

  const totalEmailsSent = emailTemplates.reduce((sum, t) => sum + t.sentCount, 0);
  const activeTemplates = emailTemplates.filter(t => t.status === "active").length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Mail Automation</h1>
            <p className="text-sm text-muted-foreground">Manage email templates, workflows, and analytics</p>
          </div>
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>

        {error && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            Failed to load mail data. Retrying...
          </div>
        )}

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard title="Total Emails Sent" value={totalEmailsSent} change="All time" changeType="neutral" icon={Send} delay={0} />
          <KpiCard title="Active Templates" value={activeTemplates} change={`${emailTemplates.length} total`} changeType="neutral" icon={Eye} delay={0.1} />
          <KpiCard title="Emails Today" value={stats?.emailsSentToday ?? 0} change="Today" changeType="neutral" icon={Mail} delay={0.2} />
          <KpiCard title="Completed Actions" value={stats?.completedToday ?? 0} change="Today" changeType="neutral" icon={AlertTriangle} delay={0.3} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Templates */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2"><FileText className="h-4 w-4 text-primary" />Email Templates</h3>
              <button className="text-xs text-primary hover:underline">+ New</button>
            </div>
            <div className="space-y-2">
              {emailTemplates.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No email templates yet</p>
              ) : (
                emailTemplates.map((t) => (
                  <div key={t.id} className="flex items-center justify-between rounded-xl bg-muted/30 p-3">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground truncate">{t.name}</p>
                        <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-medium", statusColors[t.status] || "bg-muted text-muted-foreground")}>
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
                ))
              )}
            </div>
          </motion.div>

          {/* Email Analytics Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2 mb-4"><BarChart3 className="h-4 w-4 text-primary" />Email Analytics</h3>
            {chartData?.emailAnalytics && chartData.emailAnalytics.some((d: Record<string, unknown>) => (d.sent as number) > 0) ? (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={chartData.emailAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
                  <XAxis dataKey="name" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(222, 44%, 9%)", border: "1px solid hsl(222, 30%, 16%)", borderRadius: "8px", color: "hsl(210, 40%, 96%)" }} />
                  <Bar dataKey="sent" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="opened" fill="hsl(167, 72%, 42%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[280px] text-sm text-muted-foreground">
                No email analytics yet — data will populate from activity
              </div>
            )}
          </motion.div>
        </div>

        {/* Recent Logs Table */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-foreground mb-4">Recent Email Logs</h3>
          {emailLogs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground">Detail</th>
                    <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground">Action</th>
                    <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-3 text-xs font-medium text-muted-foreground">When</th>
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
          ) : (
            <p className="text-sm text-muted-foreground py-4 text-center">No email logs yet — email activity will appear here</p>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default MailPage;
