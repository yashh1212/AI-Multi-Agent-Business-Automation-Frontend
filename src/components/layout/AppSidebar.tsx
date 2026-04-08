import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Bot,
  GitBranch,
  Plug,
  Mail,
  BarChart3,
  Settings,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  Zap,
  UserRoundSearch,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/agents", label: "Agents", icon: Bot },
  { path: "/hr-agent", label: "HR Agent", icon: UserRoundSearch },
  { path: "/sales-agent", label: "Sales Agent", icon: TrendingUp },
  { path: "/workflows", label: "Workflows", icon: GitBranch },
  { path: "/integrations", label: "Integrations", icon: Plug },
  { path: "/mail", label: "Mail Automation", icon: Mail },
  // { path: "/analytics", label: "Analytics", icon: BarChart3 },
  // { path: "/logs", label: "Activity Logs", icon: ScrollText },
  { path: "/settings", label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className="fixed left-0 top-0 z-40 h-screen border-r border-border bg-sidebar flex flex-col"
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-border px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary ai-glow">
          <Zap className="h-5 w-5 text-primary-foreground" />
        </div>
        <AnimatePresence>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="text-lg font-bold tracking-tight text-foreground overflow-hidden whitespace-nowrap"
            >
              NexusAI
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto no-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className={cn("h-5 w-5 shrink-0", isActive && "text-primary")} />
              <AnimatePresence>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
              {isActive && !collapsed && (
                <motion.div
                  layoutId="active-indicator"
                  className="ml-auto h-1.5 w-1.5 rounded-full bg-primary"
                />
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Collapse Toggle */}
      <div className="border-t border-border p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex w-full items-center justify-center rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </motion.aside>
  );
}
