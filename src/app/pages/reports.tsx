import { useState, useEffect } from "react";
import { BarChart3, FileText, Users, DollarSign, TrendingUp, Download, Loader2 } from "lucide-react";
import { useAuth } from "../../lib/auth-context";
import { supabase } from "../../lib/supabase";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Legend } from "recharts";

const PIE_COLORS = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899", "#eab308", "#14b8a6"];

interface ReportData {
  totalClients: number;
  totalPolicies: number;
  totalPremium: number;
  activePolicies: number;
  totalClaims: number;
  claimsByStatus: { status: string; count: number }[];
  policiesByType: { type: string; count: number }[];
  monthlyGrowth: { month: string; clients: number; policies: number }[];
}

export function Reports() {
  const { advisor } = useAuth();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ReportData | null>(null);

  useEffect(() => {
    if (advisor?.id) fetchReportData();
  }, [advisor?.id]);

  const fetchReportData = async () => {
    if (!advisor) return;
    setLoading(true);
    try {
      const [clientsRes, policiesRes, claimsRes] = await Promise.all([
        supabase.from('clients').select('id, created_at').eq('advisor_id', advisor.id),
        supabase.from('policies').select('id, status, policy_type, premium_amount, start_date').eq('advisor_id', advisor.id),
        supabase.from('claims').select('id, status').eq('advisor_id', advisor.id),
      ]);

      const clients = clientsRes.data || [];
      const policies = policiesRes.data || [];
      const claims = claimsRes.data || [];

      // Total premium
      const totalPremium = policies.reduce((sum: number, p: any) => sum + (p.premium_amount || 0), 0);

      // Claims by status
      const claimStatusMap: Record<string, number> = {};
      claims.forEach((c: any) => {
        const s = c.status || "unknown";
        claimStatusMap[s] = (claimStatusMap[s] || 0) + 1;
      });
      const claimsByStatus = Object.entries(claimStatusMap).map(([status, count]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " "),
        count,
      }));

      // Policies by type
      const typeMap: Record<string, number> = {};
      policies.forEach((p: any) => {
        const t = p.policy_type || "Other";
        typeMap[t] = (typeMap[t] || 0) + 1;
      });
      const policiesByType = Object.entries(typeMap).map(([type, count]) => ({ type, count }));

      // Monthly growth (last 6 months)
      const months: string[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        months.push(d.toISOString().slice(0, 7)); // YYYY-MM
      }

      const monthlyGrowth = months.map(m => {
        const clientCount = clients.filter((c: any) => c.created_at?.startsWith(m)).length;
        const policyCount = policies.filter((p: any) => p.start_date?.startsWith(m)).length;
        const monthLabel = new Date(m + "-01").toLocaleDateString("en-US", { month: "short", year: "2-digit" });
        return { month: monthLabel, clients: clientCount, policies: policyCount };
      });

      setData({
        totalClients: clients.length,
        totalPolicies: policies.length,
        totalPremium,
        activePolicies: policies.filter((p: any) => p.status === "active").length,
        totalClaims: claims.length,
        claimsByStatus,
        policiesByType,
        monthlyGrowth,
      });
    } catch (err) {
      console.error("Error fetching report data:", err);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = (dataArray: any[], filename: string) => {
    if (!dataArray.length) return;
    const headers = Object.keys(dataArray[0]).join(',');
    const rows = dataArray.map(row => Object.values(row).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Generating reports...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Reports & Analytics</h2>
          <p className="text-sm text-muted-foreground">Overview of your portfolio performance</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => exportCSV(data.policiesByType, "policy_distribution")}
            className="px-4 py-2.5 bg-card border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2 text-sm"
          >
            <Download className="size-4" />
            Export Policy Data
          </button>
          <button
            onClick={() => exportCSV(data.claimsByStatus, "claims_by_status")}
            className="px-4 py-2.5 bg-card border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2 text-sm"
          >
            <Download className="size-4" />
            Export Claims Data
          </button>
        </div>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-950/20 rounded-lg">
              <Users className="size-5 text-blue-600" />
            </div>
            <p className="text-sm text-muted-foreground">Total Clients</p>
          </div>
          <p className="text-2xl font-bold">{data.totalClients}</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-950/20 rounded-lg">
              <FileText className="size-5 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground">Total Policies</p>
          </div>
          <p className="text-2xl font-bold">{data.totalPolicies}</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-950/20 rounded-lg">
              <FileText className="size-5 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground">Active Policies</p>
          </div>
          <p className="text-2xl font-bold">{data.activePolicies}</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-950/20 rounded-lg">
              <DollarSign className="size-5 text-orange-600" />
            </div>
            <p className="text-sm text-muted-foreground">Total Premium</p>
          </div>
          <p className="text-2xl font-bold">₹{data.totalPremium.toLocaleString()}</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-950/20 rounded-lg">
              <BarChart3 className="size-5 text-purple-600" />
            </div>
            <p className="text-sm text-muted-foreground">Total Claims</p>
          </div>
          <p className="text-2xl font-bold">{data.totalClaims}</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Policy Type Distribution */}
        <div className="bg-card rounded-xl p-5 border border-border">
          <h3 className="text-lg font-semibold mb-4">Policy Type Distribution</h3>
          {data.policiesByType.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No policy data</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.policiesByType}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={110}
                  fill="#8884d8"
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="type"
                  label={({ type, count }) => `${type} (${count})`}
                >
                  {data.policiesByType.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Claims by Status */}
        <div className="bg-card rounded-xl p-5 border border-border">
          <h3 className="text-lg font-semibold mb-4">Claims by Status</h3>
          {data.claimsByStatus.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No claims data</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.claimsByStatus}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="status" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="var(--primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Monthly Growth Chart */}
      <div className="bg-card rounded-xl p-5 border border-border">
        <h3 className="text-lg font-semibold mb-4">Monthly Growth (Last 6 Months)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.monthlyGrowth}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="clients" stroke="#3b82f6" strokeWidth={2} name="New Clients" />
            <Line type="monotone" dataKey="policies" stroke="#10b981" strokeWidth={2} name="New Policies" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
