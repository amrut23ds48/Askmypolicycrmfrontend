import { 
  Users, 
  FileText, 
  Clock, 
  ClipboardList, 
  DollarSign, 
  BarChart3,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  AlertCircle,
  Plus,
  Download
} from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { AIInsights } from "../components/ai-insights";

const kpiCards = [
  { 
    title: "Total Clients", 
    value: "16,341", 
    change: "+15.3%", 
    trend: "up", 
    icon: Users,
    color: "bg-blue-500"
  },
  { 
    title: "Active Policies", 
    value: "125", 
    change: "+2.3%", 
    trend: "up", 
    icon: FileText,
    color: "bg-green-500"
  },
  { 
    title: "Policies Expiring Soon", 
    value: "17", 
    change: "+7.5%", 
    trend: "down", 
    icon: Clock,
    color: "bg-orange-500"
  },
  { 
    title: "Claims In Progress", 
    value: "8", 
    change: "-12.5%", 
    trend: "up", 
    icon: ClipboardList,
    color: "bg-purple-500"
  },
  { 
    title: "Monthly Revenue", 
    value: "₹84,250", 
    change: "+18.2%", 
    trend: "up", 
    icon: DollarSign,
    color: "bg-primary"
  },
  { 
    title: "Reports Generated", 
    value: "42", 
    change: "+5.1%", 
    trend: "up", 
    icon: BarChart3,
    color: "bg-cyan-500"
  },
];

const clientGrowthData = [
  { month: "Jan", clients: 14200, policies: 98, revenue: 62000 },
  { month: "Feb", clients: 14800, policies: 105, revenue: 68000 },
  { month: "Mar", clients: 15200, policies: 110, revenue: 71000 },
  { month: "Apr", clients: 15600, policies: 115, revenue: 75000 },
  { month: "May", clients: 15900, policies: 118, revenue: 78000 },
  { month: "Jun", clients: 16341, policies: 125, revenue: 84250 },
];

const policyDistribution = [
  { name: "Health Insurance", value: 35, count: 44 },
  { name: "Life Insurance", value: 28, count: 35 },
  { name: "Investment Plans", value: 20, count: 25 },
  { name: "Property Insurance", value: 12, count: 15 },
  { name: "Auto Insurance", value: 5, count: 6 },
];

const COLORS = ["#ff6b35", "#4ecdc4", "#ffe66d", "#95e1d3", "#f38181"];

const claimsStatus = [
  { status: "Submitted", count: 15 },
  { status: "Under Review", count: 8 },
  { status: "Approved", count: 42 },
  { status: "Rejected", count: 3 },
  { status: "Pending Docs", count: 5 },
];

const alerts = [
  { 
    type: "warning", 
    title: "Policies Expiring Soon", 
    message: "17 policies are expiring within 30 days",
    time: "2 hours ago"
  },
  { 
    type: "info", 
    title: "Pending Documents", 
    message: "12 clients have pending document submissions",
    time: "5 hours ago"
  },
  { 
    type: "urgent", 
    title: "Claims Awaiting Update", 
    message: "8 claims require your immediate attention",
    time: "1 day ago"
  },
];

const recentActivities = [
  {
    id: 1,
    action: "New client registered",
    client: "Sarah Mitchell",
    details: "Health Insurance inquiry",
    time: "10 minutes ago",
    avatar: "SM"
  },
  {
    id: 2,
    action: "Policy renewal completed",
    client: "David Chen",
    details: "Life Insurance Policy #LI-4521",
    time: "1 hour ago",
    avatar: "DC"
  },
  {
    id: 3,
    action: "Claim approved",
    client: "Emma Wilson",
    details: "Claim #CLM-8832 - $15,000",
    time: "3 hours ago",
    avatar: "EW"
  },
  {
    id: 4,
    action: "Task completed",
    client: "Michael Brown",
    details: "Follow-up call scheduled",
    time: "5 hours ago",
    avatar: "MB"
  },
];

export function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      {/* Quick Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-muted rounded-lg text-sm hover:bg-accent transition-colors border border-border">
            Year: 2025
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
            <Download className="size-4" />
            Export CSV
          </button>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition-opacity flex items-center gap-2">
            <Plus className="size-4" />
            Add New Client
          </button>
          <button className="px-4 py-2 bg-card border border-border rounded-lg text-sm hover:bg-accent transition-colors flex items-center gap-2">
            <Plus className="size-4" />
            Add Policy
          </button>
          <button className="px-4 py-2 bg-card border border-border rounded-lg text-sm hover:bg-accent transition-colors flex items-center gap-2">
            <Plus className="size-4" />
            Create Task
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-card rounded-xl p-5 border border-border hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={`${card.color} p-2.5 rounded-lg`}>
                  <Icon className="size-5 text-white" />
                </div>
                {card.trend === "up" ? (
                  <TrendingUp className="size-4 text-green-500" />
                ) : (
                  <TrendingDown className="size-4 text-red-500" />
                )}
              </div>
              <p className="text-2xl font-semibold mb-1">{card.value}</p>
              <p className="text-xs text-muted-foreground mb-2">{card.title}</p>
              <div className="flex items-center gap-1">
                <span className={`text-xs font-medium ${card.trend === "up" ? "text-green-500" : "text-red-500"}`}>
                  {card.change}
                </span>
                <span className="text-xs text-muted-foreground">vs Last Year</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Growth Trend */}
        <div className="lg:col-span-2 bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-1">Client Growth & Revenue Trend</h3>
              <p className="text-sm text-muted-foreground">Monthly overview of client acquisition</p>
            </div>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <ArrowUpRight className="size-5 text-muted-foreground" />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={clientGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '8px'
                }} 
              />
              <Legend />
              <Line key="clients-line" type="monotone" dataKey="clients" stroke="#ff6b35" strokeWidth={2} name="Total Clients" />
              <Line key="policies-line" type="monotone" dataKey="policies" stroke="#4ecdc4" strokeWidth={2} name="Active Policies" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Policy Distribution */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-1">Policy Distribution</h3>
              <p className="text-sm text-muted-foreground">By insurance type</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={policyDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {policyDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '8px'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-4">
            {policyDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="size-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Claims Status */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-1">Claims Status</h3>
              <p className="text-sm text-muted-foreground">Current claims overview</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={claimsStatus}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="status" stroke="var(--muted-foreground)" tick={{ fontSize: 10 }} />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '8px'
                }} 
              />
              <Bar dataKey="count" fill="#ff6b35" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* AI Insights */}
        <AIInsights />

        {/* Recent Activities */}
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Activities</h3>
            <button className="text-sm text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="size-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-xs text-primary-foreground font-semibold">{activity.avatar}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium mb-0.5">{activity.action}</p>
                  <p className="text-sm text-muted-foreground mb-0.5">{activity.client}</p>
                  <p className="text-xs text-muted-foreground">{activity.details}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Important Alerts */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Important Alerts</h3>
          <button className="text-sm text-primary hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {alerts.map((alert, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                alert.type === "urgent" 
                  ? "bg-red-50 dark:bg-red-950/20 border-red-500" 
                  : alert.type === "warning"
                  ? "bg-orange-50 dark:bg-orange-950/20 border-orange-500"
                  : "bg-blue-50 dark:bg-blue-950/20 border-blue-500"
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertCircle className={`size-5 flex-shrink-0 mt-0.5 ${
                  alert.type === "urgent" 
                    ? "text-red-500" 
                    : alert.type === "warning"
                    ? "text-orange-500"
                    : "text-blue-500"
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm mb-1">{alert.title}</p>
                  <p className="text-xs text-muted-foreground mb-2">{alert.message}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}