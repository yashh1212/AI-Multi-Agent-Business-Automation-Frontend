import { motion } from "framer-motion";
import { RefreshCw, Settings, Check, X, Loader2 } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { integrations } from "@/data/mockData";
import { cn } from "@/lib/utils";

const syncIcon = {
  synced: <Check className="h-3.5 w-3.5 text-success" />,
  syncing: <Loader2 className="h-3.5 w-3.5 text-primary animate-spin" />,
  disconnected: <X className="h-3.5 w-3.5 text-destructive" />,
};

const IntegrationsPage = () => (
  <DashboardLayout>
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Integrations</h1>
          <p className="text-sm text-muted-foreground">Connected business tools and services</p>
        </div>
        <button className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          + Add Integration
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {integrations.map((integ, i) => (
          <motion.div
            key={integ.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.08 }}
            className={cn(
              "glass-card-hover rounded-2xl p-5 flex flex-col gap-4",
              !integ.connected && "opacity-60"
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{integ.icon}</div>
                <div>
                  <h3 className="font-semibold text-foreground text-sm">{integ.name}</h3>
                  <p className="text-xs text-muted-foreground">{integ.category}</p>
                </div>
              </div>
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full font-medium",
                integ.connected ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
              )}>
                {integ.connected ? "Connected" : "Disconnected"}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                {syncIcon[integ.syncStatus]}
                {integ.syncStatus === "syncing" ? "Syncing..." : `Last: ${integ.lastSync}`}
              </span>
            </div>

            <div className="flex gap-2 pt-2 border-t border-border">
              <button className="flex-1 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors flex items-center justify-center gap-1.5">
                <Settings className="h-3 w-3" /> Configure
              </button>
              <button className="rounded-lg border border-border px-3 py-2 text-xs text-muted-foreground hover:bg-muted transition-colors">
                <RefreshCw className="h-3 w-3" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </DashboardLayout>
);

export default IntegrationsPage;
