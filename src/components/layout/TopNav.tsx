import { useState } from "react";
import { Search, Bell, ChevronDown, Moon, Sun, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { workspaces } from "@/data/mockData";

export function TopNav() {
  const [darkMode, setDarkMode] = useState(true);
  const [wsOpen, setWsOpen] = useState(false);
  const [currentWs, setCurrentWs] = useState(workspaces[0]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  // Set dark mode on mount
  useState(() => {
    document.documentElement.classList.add("dark");
  });

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-6">
      {/* Workspace Switcher */}
      <div className="relative">
        <button
          onClick={() => setWsOpen(!wsOpen)}
          className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          <div className="h-5 w-5 rounded bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
            {currentWs.name.charAt(0)}
          </div>
          <span className="hidden sm:inline">{currentWs.name}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </button>

        <AnimatePresence>
          {wsOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute left-0 top-12 w-64 rounded-xl border border-border bg-card p-2 shadow-xl z-50"
            >
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => { setCurrentWs(ws); setWsOpen(false); }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-muted transition-colors text-left"
                >
                  <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                    {ws.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">{ws.name}</div>
                    <div className="text-xs text-muted-foreground">{ws.members} members · {ws.agents} agents</div>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search agents, workflows, integrations..."
            className="w-full rounded-lg border border-border bg-muted/50 py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        <button onClick={toggleTheme} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>
        <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>
        <div className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5">
          <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <span className="hidden sm:inline text-sm font-medium text-foreground">Admin</span>
        </div>
      </div>
    </header>
  );
}
