import { Download, FileText, Calendar, TrendingUp, Users, DollarSign, FileBarChart } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const revenueData = [
  { month: "Jan", revenue: 62000, commission: 3100 },
  { month: "Feb", revenue: 68000, commission: 3400 },
  { month: "Mar", revenue: 71000, commission: 3550 },
  { month: "Apr", revenue: 75000, commission: 3750 },
  { month: "May", revenue: 78000, commission: 3900 },
  { month: "Jun", revenue: 84250, commission: 4213 },
];

const reportTypes = [
  {
    id: 1,
    title: "Client Portfolio Report",
    description: "Comprehensive overview of all client portfolios and their policies",
    icon: Users,
    color: "bg-blue-100 dark:bg-blue-950/20 text-blue-600",
    lastGenerated: "2026-03-10"
  },
  {
    id: 2,
    title: "Policy Expiry Report",
    description: "List of policies expiring in the next 30, 60, and 90 days",
    icon: Calendar,
    color: "bg-orange-100 dark:bg-orange-950/20 text-orange-600",
    lastGenerated: "2026-03-12"
  },
  {
    id: 3,
    title: "Claims Summary Report",
    description: "Detailed analysis of all claims filed and their current status",
    icon: FileBarChart,
    color: "bg-purple-100 dark:bg-purple-950/20 text-purple-600",
    lastGenerated: "2026-03-11"
  },
  {
    id: 4,
    title: "Revenue & Commission Report",
    description: "Monthly and quarterly revenue breakdown with commission tracking",
    icon: DollarSign,
    color: "bg-green-100 dark:bg-green-950/20 text-green-600",
    lastGenerated: "2026-03-13"
  },
  {
    id: 5,
    title: "Performance Analytics",
    description: "Key performance indicators and metrics for business growth",
    icon: TrendingUp,
    color: "bg-cyan-100 dark:bg-cyan-950/20 text-cyan-600",
    lastGenerated: "2026-03-09"
  },
  {
    id: 6,
    title: "Client Activity Report",
    description: "Track client interactions, meetings, and engagement metrics",
    icon: FileText,
    color: "bg-pink-100 dark:bg-pink-950/20 text-pink-600",
    lastGenerated: "2026-03-08"
  },
];

export function Reports() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Reports & Analytics</h2>
          <p className="text-sm text-muted-foreground">Generate insights and export data</p>
        </div>
        <button className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
          <Download className="size-4" />
          Export All Reports
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-950/20 rounded-lg">
              <FileText className="size-5 text-blue-600" />
            </div>
            <p className="text-sm text-muted-foreground">Total Reports</p>
          </div>
          <p className="text-2xl font-semibold">24</p>
          <p className="text-xs text-muted-foreground mt-1">This month</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-950/20 rounded-lg">
              <DollarSign className="size-5 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
          </div>
          <p className="text-2xl font-semibold">$84,250</p>
          <p className="text-xs text-green-600 mt-1">+18.2% vs last month</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-950/20 rounded-lg">
              <Users className="size-5 text-orange-600" />
            </div>
            <p className="text-sm text-muted-foreground">Active Clients</p>
          </div>
          <p className="text-2xl font-semibold">16,341</p>
          <p className="text-xs text-green-600 mt-1">+15.3% growth</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-950/20 rounded-lg">
              <TrendingUp className="size-5 text-purple-600" />
            </div>
            <p className="text-sm text-muted-foreground">Commission</p>
          </div>
          <p className="text-2xl font-semibold">$4,213</p>
          <p className="text-xs text-green-600 mt-1">+18.2% vs last month</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-1">Monthly Revenue</h3>
              <p className="text-sm text-muted-foreground">Last 6 months performance</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenueData}>
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
              <Line type="monotone" dataKey="revenue" stroke="#ff6b35" strokeWidth={2} name="Revenue ($)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold mb-1">Commission Tracking</h3>
              <p className="text-sm text-muted-foreground">Monthly commission breakdown</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueData}>
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
              <Bar dataKey="commission" fill="#4ecdc4" radius={[8, 8, 0, 0]} name="Commission ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Report Types Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Available Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon;
            return (
              <div key={report.id} className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className={`${report.color} p-3 rounded-lg flex-shrink-0`}>
                    <Icon className="size-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold mb-1">{report.title}</h4>
                    <p className="text-sm text-muted-foreground">{report.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    Last: {new Date(report.lastGenerated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-card border border-border rounded-lg hover:bg-accent transition-colors text-sm flex items-center gap-1.5">
                      <FileText className="size-3.5" />
                      View
                    </button>
                    <button className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm flex items-center gap-1.5">
                      <Download className="size-3.5" />
                      Export
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Export Options */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-lg font-semibold mb-4">Export Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all text-left">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 dark:bg-red-950/20 rounded-lg">
                <FileText className="size-5 text-red-600" />
              </div>
              <span className="font-medium">Export as PDF</span>
            </div>
            <p className="text-sm text-muted-foreground">Generate formatted PDF reports</p>
          </button>
          <button className="p-4 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all text-left">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 dark:bg-green-950/20 rounded-lg">
                <FileText className="size-5 text-green-600" />
              </div>
              <span className="font-medium">Export as Excel</span>
            </div>
            <p className="text-sm text-muted-foreground">Download data in spreadsheet format</p>
          </button>
          <button className="p-4 rounded-lg border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all text-left">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-950/20 rounded-lg">
                <FileText className="size-5 text-blue-600" />
              </div>
              <span className="font-medium">Export as CSV</span>
            </div>
            <p className="text-sm text-muted-foreground">Export raw data for analysis</p>
          </button>
        </div>
      </div>
    </div>
  );
}
