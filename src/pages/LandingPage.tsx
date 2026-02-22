import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Zap,
  Bot,
  GitBranch,
  Mail,
  BarChart3,
  LogOut,
  ArrowRight,
  Sparkles,
  Shield,
  Clock,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { dashboardStats } from "@/data/mockData";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const quickActions = [
  {
    title: "View Agents",
    description: "Monitor and manage your AI agents",
    icon: Bot,
    path: "/agents",
    color: "hsl(199, 89%, 48%)",
    bgColor: "hsl(199 89% 48% / 0.1)",
  },
  {
    title: "Workflows",
    description: "Design and track automation workflows",
    icon: GitBranch,
    path: "/workflows",
    color: "hsl(167, 72%, 42%)",
    bgColor: "hsl(167 72% 42% / 0.1)",
  },
  {
    title: "Mail Automation",
    description: "Manage email templates and campaigns",
    icon: Mail,
    path: "/mail",
    color: "hsl(262, 83%, 58%)",
    bgColor: "hsl(262 83% 58% / 0.1)",
  },
  {
    title: "Analytics",
    description: "View performance insights and reports",
    icon: BarChart3,
    path: "/analytics",
    color: "hsl(38, 92%, 50%)",
    bgColor: "hsl(38 92% 50% / 0.1)",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -60, 40, 0],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, hsl(199 89% 48% / 0.08) 0%, transparent 70%)",
          }}
        />
        <motion.div
          animate={{
            x: [0, -60, 40, 0],
            y: [0, 80, -60, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, hsl(167 72% 42% / 0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 md:px-10 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary ai-glow">
            <Zap className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            NexusAI
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sign out</span>
        </button>
      </header>

      {/* Main content */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 py-8 md:py-16"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium text-primary mb-6"
          >
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Business Automation
          </motion.div>
          <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3">
            Welcome back,{" "}
            <span className="gradient-text">{user?.name || "Admin"}</span>
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto">
            Your AI agents are working around the clock. Here's a quick overview
            of what's happening.
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-10"
        >
          {[
            { label: "Active Agents", value: `${dashboardStats.activeAgents}/${dashboardStats.totalAgents}`, icon: Bot, color: "text-primary" },
            { label: "Workflows", value: dashboardStats.runningWorkflows, icon: GitBranch, color: "text-accent" },
            { label: "Completed Today", value: dashboardStats.completedToday, icon: Clock, color: "text-warning" },
            { label: "System Health", value: "99.9%", icon: Shield, color: "text-success" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass-card rounded-2xl p-4 text-center"
            >
              <stat.icon className={`h-5 w-5 mx-auto mb-2 ${stat.color}`} />
              <div className="text-xl md:text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Agent Dashboard CTA */}
        <motion.div variants={itemVariants} className="mb-10">
          <motion.button
            onClick={() => navigate("/dashboard")}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full group relative overflow-hidden rounded-2xl p-[1px]"
          >
            {/* Animated gradient border */}
            <div
              className="absolute inset-0 rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"
              style={{
                background:
                  "linear-gradient(135deg, hsl(199 89% 48%), hsl(167 72% 42%), hsl(262 83% 58%), hsl(199 89% 48%))",
                backgroundSize: "300% 300%",
                animation: "gradientShift 4s ease infinite",
              }}
            />
            <div className="relative rounded-2xl bg-card px-6 md:px-8 py-6 md:py-8 flex items-center justify-between">
              <div className="flex items-center gap-4 md:gap-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Zap className="h-7 w-7 text-primary" />
                </div>
                <div className="text-left">
                  <h2 className="text-lg md:text-xl font-bold text-foreground">
                    Agent Dashboard
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Open the full dashboard to monitor agents, workflows & analytics
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-primary font-semibold text-sm shrink-0">
                <span className="hidden md:inline">Open Dashboard</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.button>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants}>
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {quickActions.map((action) => (
              <motion.button
                key={action.title}
                onClick={() => navigate(action.path)}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="glass-card-hover rounded-2xl p-5 text-left group"
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl mb-3 transition-colors"
                  style={{ background: action.bgColor }}
                >
                  <action.icon
                    className="h-5 w-5"
                    style={{ color: action.color }}
                  />
                </div>
                <h4 className="text-sm font-semibold text-foreground mb-1">
                  {action.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {action.description}
                </p>
                <ArrowRight className="h-4 w-4 text-muted-foreground mt-3 group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.main>
    </div>
  );
};

export default LandingPage;
