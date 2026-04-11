import { motion } from "framer-motion";
import { Users, Shield, Bell, Palette, Globe } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { workspaces } from "@/data/mockData";

const SettingsPage = () => (
  <DashboardLayout>
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Workspace Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your workspace configuration</p>
      </div>

      {/* Workspace Info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2"><Globe className="h-4 w-4 text-primary" />General</h3>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Workspace Name</label>
            <input defaultValue={workspaces[0].name} className="mt-1 w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Workspace ID</label>
            <input defaultValue="ws_Business Auto_prod_001" readOnly className="mt-1 w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground" />
          </div>
        </div>
      </motion.div>

      {/* Team */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card rounded-2xl p-6 space-y-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2"><Users className="h-4 w-4 text-primary" />Team Members</h3>
        <div className="space-y-2">
          {[
            { name: "Alex Chen", role: "Admin", email: "alex@nexus.ai" },
            { name: "Sarah Kim", role: "Editor", email: "sarah@nexus.ai" },
            { name: "Mike Ross", role: "Viewer", email: "mike@nexus.ai" },
          ].map((m) => (
            <div key={m.email} className="flex items-center justify-between rounded-xl bg-muted/30 p-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {m.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.email}</p>
                </div>
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{m.role}</span>
            </div>
          ))}
        </div>
        <button className="text-xs text-primary hover:underline">+ Invite Member</button>
      </motion.div>

      {/* Settings sections */}
      {[
        { icon: Shield, title: "Security", desc: "Two-factor auth, API keys, session management" },
        { icon: Bell, title: "Notifications", desc: "Email, Slack, in-app notification preferences" },
        { icon: Palette, title: "Appearance", desc: "Theme, density, and display preferences" },
      ].map((section, i) => (
        <motion.div
          key={section.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.1 }}
          className="glass-card-hover rounded-2xl p-6 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-primary/10 p-2.5"><section.icon className="h-4 w-4 text-primary" /></div>
            <div>
              <h3 className="font-semibold text-foreground text-sm">{section.title}</h3>
              <p className="text-xs text-muted-foreground">{section.desc}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </DashboardLayout>
);

export default SettingsPage;
