// Mock data for the entire dashboard

export const agents = [
  { id: 1, name: "Manager Agent", role: "Orchestrator", status: "running" as const, tasksCompleted: 1247, lastActivity: "2 min ago", performance: 98, description: "Coordinates all agents and manages workflow orchestration" },
  { id: 2, name: "Research Agent", role: "Data Collection", status: "thinking" as const, tasksCompleted: 892, lastActivity: "5 min ago", performance: 94, description: "Gathers and analyzes data from multiple sources" },
  { id: 3, name: "Analytics Agent", role: "Data Analysis", status: "running" as const, tasksCompleted: 1053, lastActivity: "1 min ago", performance: 96, description: "Processes data and generates actionable insights" },
  { id: 4, name: "Content Agent", role: "Content Generation", status: "idle" as const, tasksCompleted: 634, lastActivity: "15 min ago", performance: 91, description: "Creates reports, summaries, and documentation" },
  { id: 5, name: "Decision Agent", role: "Decision Making", status: "running" as const, tasksCompleted: 445, lastActivity: "3 min ago", performance: 97, description: "Makes data-driven decisions and recommendations" },
  { id: 6, name: "Communication Agent", role: "Messaging", status: "thinking" as const, tasksCompleted: 2103, lastActivity: "30 sec ago", performance: 99, description: "Handles Slack, email, and notification delivery" },
  { id: 7, name: "Scheduler Agent", role: "Task Scheduling", status: "idle" as const, tasksCompleted: 387, lastActivity: "20 min ago", performance: 93, description: "Schedules and prioritizes tasks across workflows" },
  { id: 8, name: "Integration Agent", role: "System Bridge", status: "running" as const, tasksCompleted: 1589, lastActivity: "1 min ago", performance: 95, description: "Manages API connections and data synchronization" },
];

export const workflows = [
  { id: 1, name: "Customer Onboarding Pipeline", status: "running" as const, steps: ["Trigger", "Research Agent", "CRM Update", "Email Welcome", "Slack Notify"], completedSteps: 3, lastRun: "2 min ago", totalRuns: 342 },
  { id: 2, name: "Bug Report Automation", status: "running" as const, steps: ["Jira Trigger", "Analytics Agent", "Decision Agent", "Email Alert", "Slack Update"], completedSteps: 4, lastRun: "5 min ago", totalRuns: 891 },
  { id: 3, name: "Weekly Report Generation", status: "completed" as const, steps: ["Schedule Trigger", "Research Agent", "Analytics Agent", "Content Agent", "Email Send"], completedSteps: 5, lastRun: "1 hour ago", totalRuns: 52 },
  { id: 4, name: "Lead Scoring Pipeline", status: "paused" as const, steps: ["CRM Trigger", "Research Agent", "Analytics Agent", "Decision Agent", "CRM Update"], completedSteps: 0, lastRun: "3 hours ago", totalRuns: 1204 },
  { id: 5, name: "ERP Data Sync", status: "running" as const, steps: ["Schedule Trigger", "Integration Agent", "Analytics Agent", "ERP Sync", "Slack Report"], completedSteps: 2, lastRun: "10 min ago", totalRuns: 4521 },
];

export const integrations = [
  { id: 1, name: "Jira", icon: "🎯", connected: true, lastSync: "2 min ago", syncStatus: "synced" as const, category: "Project Management" },
  { id: 2, name: "Slack", icon: "💬", connected: true, lastSync: "30 sec ago", syncStatus: "syncing" as const, category: "Communication" },
  { id: 3, name: "Gmail", icon: "📧", connected: true, lastSync: "1 min ago", syncStatus: "synced" as const, category: "Email" },
  { id: 4, name: "Zoho CRM", icon: "📊", connected: true, lastSync: "5 min ago", syncStatus: "synced" as const, category: "CRM" },
  { id: 5, name: "SAP ERP", icon: "🏢", connected: true, lastSync: "10 min ago", syncStatus: "synced" as const, category: "ERP" },
  { id: 6, name: "Google Drive", icon: "📁", connected: true, lastSync: "3 min ago", syncStatus: "synced" as const, category: "Storage" },
  { id: 7, name: "API Connector", icon: "🔌", connected: false, lastSync: "Never", syncStatus: "disconnected" as const, category: "Custom" },
  { id: 8, name: "HubSpot", icon: "🧲", connected: false, lastSync: "Never", syncStatus: "disconnected" as const, category: "Marketing" },
];

export const emailTemplates = [
  { id: 1, name: "Weekly Report", subject: "Weekly Automation Report - {{week}}", status: "active" as const, lastUsed: "1 day ago", sentCount: 52 },
  { id: 2, name: "Bug Alert", subject: "🐛 Critical Bug Detected - {{project}}", status: "active" as const, lastUsed: "2 hours ago", sentCount: 234 },
  { id: 3, name: "CRM Follow-up", subject: "Follow-up: {{lead_name}}", status: "active" as const, lastUsed: "30 min ago", sentCount: 1203 },
  { id: 4, name: "Decision Alert", subject: "⚡ Action Required - {{decision}}", status: "draft" as const, lastUsed: "Never", sentCount: 0 },
  { id: 5, name: "Onboarding Welcome", subject: "Welcome to {{company}}!", status: "active" as const, lastUsed: "5 min ago", sentCount: 342 },
];

export const emailLogs = [
  { id: 1, recipient: "john@acme.com", subject: "Weekly Report - Week 8", status: "delivered" as const, timestamp: "2024-02-21 14:30" },
  { id: 2, recipient: "sarah@client.io", subject: "Follow-up: Enterprise Deal", status: "opened" as const, timestamp: "2024-02-21 14:15" },
  { id: 3, recipient: "dev-team@company.com", subject: "Bug Alert - Auth Service", status: "delivered" as const, timestamp: "2024-02-21 13:45" },
  { id: 4, recipient: "mike@partner.co", subject: "Welcome to Business Auto!", status: "failed" as const, timestamp: "2024-02-21 13:30" },
  { id: 5, recipient: "alerts@ops.team", subject: "Decision Required - Budget Q2", status: "delivered" as const, timestamp: "2024-02-21 13:00" },
  { id: 6, recipient: "lisa@marketing.io", subject: "CRM Lead Score Update", status: "opened" as const, timestamp: "2024-02-21 12:30" },
];

export const activityLogs = [
  { id: 1, type: "agent" as const, agent: "Manager Agent", action: "Orchestrated customer onboarding workflow", timestamp: "2 min ago" },
  { id: 2, type: "email" as const, agent: "Communication Agent", action: "Sent weekly report to stakeholders", timestamp: "5 min ago" },
  { id: 3, type: "workflow" as const, agent: "Integration Agent", action: "Completed ERP data sync cycle", timestamp: "8 min ago" },
  { id: 4, type: "slack" as const, agent: "Communication Agent", action: "Posted bug alert to #engineering", timestamp: "12 min ago" },
  { id: 5, type: "jira" as const, agent: "Research Agent", action: "Created ticket BUG-1432 for auth issue", timestamp: "15 min ago" },
  { id: 6, type: "agent" as const, agent: "Analytics Agent", action: "Generated performance insights report", timestamp: "20 min ago" },
  { id: 7, type: "workflow" as const, agent: "Decision Agent", action: "Approved budget allocation for Q2", timestamp: "25 min ago" },
  { id: 8, type: "email" as const, agent: "Communication Agent", action: "Sent CRM follow-up to 12 leads", timestamp: "30 min ago" },
  { id: 9, type: "slack" as const, agent: "Communication Agent", action: "Notified team of deployment success", timestamp: "35 min ago" },
  { id: 10, type: "jira" as const, agent: "Integration Agent", action: "Updated sprint progress in Jira", timestamp: "40 min ago" },
];

export const workspaces = [
  { id: 1, name: "Business Auto Production", members: 12, agents: 8, integrations: 6 },
  { id: 2, name: "Business Auto Staging", members: 8, agents: 8, integrations: 4 },
  { id: 3, name: "Client Portal", members: 5, agents: 4, integrations: 3 },
];

export const dashboardStats = {
  activeAgents: 5,
  totalAgents: 8,
  runningWorkflows: 3,
  completedToday: 47,
  emailsSent: 156,
  jiraTickets: 23,
  slackMessages: 342,
  crmLeads: 89,
  erpSyncs: 12,
};

export const chartData = {
  agentPerformance: [
    { name: "Mon", manager: 95, research: 88, analytics: 92, content: 85, communication: 97 },
    { name: "Tue", manager: 97, research: 90, analytics: 94, content: 88, communication: 96 },
    { name: "Wed", manager: 93, research: 92, analytics: 91, content: 90, communication: 98 },
    { name: "Thu", manager: 98, research: 87, analytics: 96, content: 86, communication: 99 },
    { name: "Fri", manager: 96, research: 94, analytics: 93, content: 91, communication: 97 },
    { name: "Sat", manager: 94, research: 89, analytics: 95, content: 87, communication: 95 },
    { name: "Sun", manager: 98, research: 93, analytics: 96, content: 92, communication: 99 },
  ],
  workflowTrend: [
    { name: "Week 1", executions: 120, successful: 115, failed: 5 },
    { name: "Week 2", executions: 145, successful: 140, failed: 5 },
    { name: "Week 3", executions: 168, successful: 160, failed: 8 },
    { name: "Week 4", executions: 190, successful: 185, failed: 5 },
    { name: "Week 5", executions: 210, successful: 205, failed: 5 },
    { name: "Week 6", executions: 235, successful: 228, failed: 7 },
    { name: "Week 7", executions: 260, successful: 254, failed: 6 },
    { name: "Week 8", executions: 285, successful: 279, failed: 6 },
  ],
  emailAnalytics: [
    { name: "Mon", sent: 22, opened: 18, clicked: 12 },
    { name: "Tue", sent: 28, opened: 24, clicked: 15 },
    { name: "Wed", sent: 19, opened: 16, clicked: 10 },
    { name: "Thu", sent: 35, opened: 30, clicked: 22 },
    { name: "Fri", sent: 31, opened: 26, clicked: 18 },
    { name: "Sat", sent: 12, opened: 10, clicked: 6 },
    { name: "Sun", sent: 9, opened: 8, clicked: 5 },
  ],
};
