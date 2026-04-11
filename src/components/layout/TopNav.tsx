import { useState, useEffect, useRef } from "react";
import { useNavigate  } from "react-router-dom";
import { Search, Bell, ChevronDown, Moon, Sun, User, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function TopNav() {
  const navi = useNavigate();
  const [darkMode, setDarkMode] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  // ✅ Correct way (instead of useState)
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  // ✅ Close modal on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // console.log("Logout clicked");
    // router.push("/login");
    navi("/login");
    sessionStorage.removeItem("login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-6">
      
      {/* Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search agents, workflows, integrations..."
            className="w-full rounded-lg border border-border bg-muted/50 py-2 pl-10 pr-4 text-sm"
          />
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        
        {/* Theme Toggle */}
        <button onClick={toggleTheme} className="rounded-lg p-2 hover:bg-muted">
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </button>

        {/* Notification */}
        <button className="relative rounded-lg p-2 hover:bg-muted">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </button>

        {/* ✅ Profile Section */}
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-1.5 hover:bg-muted"
          >
            <div className="h-7 w-7 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <span className="hidden sm:inline text-sm font-medium">Admin</span>
            <ChevronDown className="h-4 w-4" />
          </button>

          {/* ✅ Dropdown Modal */}
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute right-0 top-12 w-40 rounded-xl border border-border bg-card p-2 shadow-xl z-50"
              >
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted transition"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
}