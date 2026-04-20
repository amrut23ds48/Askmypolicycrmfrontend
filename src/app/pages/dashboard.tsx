import { useState, useEffect } from "react";
import { Users, FileText, ClipboardList, CheckSquare, TrendingUp, AlertTriangle, Plus, ArrowRight, Loader2, Clock, DollarSign } from "lucide-react";
import { useAuth } from "../../lib/auth-context";
import { getDashboardKPIs, getPolicyDistribution, getClaimsStatusDistribution, getRecentActivities, type DashboardKPIs, type PolicyDistribution, type ClaimsStatusData, type RecentActivity } from "../../lib/services/dashboard";
import { AddClientDialog } from "../components/add-client-dialog";
import { AddPolicyDialog } from "../components/add-policy-dialog";
import { AddTaskDialog } from "../components/add-task-dialog";
import { Link } from "react-router";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const PIE_COLORS = ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899", "#eab308"];

export function Dashboard() {
  const { advisor } = useAuth();
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [policyDist, setPolicyDist] = useState<PolicyDistribution[]>([]);
  const [claimsDist, setClaimsDist] = useState<ClaimsStatusData[]>([]);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddClient, setShowAddClient] = useState(false);
  const [showAddPolicy, setShowAddPolicy] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);

  useEffect(() => {
    if (advisor?.id) fetchDashboardData();
  }, [advisor?.id]);

  const fetchDashboardData = async () => {
    if (!advisor) return;
    setLoading(true);
    try {
      const [kpiData, policyData, claimsData, activityData] = await Promise.all([
        getDashboardKPIs(advisor.id),
        getPolicyDistribution(advisor.id),
        getClaimsStatusDistribution(advisor.id),
        getRecentActivities(advisor.id),
      ]);
      setKpis(kpiData);
      setPolicyDist(policyData);
      setClaimsDist(claimsData);
      setActivities(activityData);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const kpiCards = kpis ? [
    {
      title: "Total Clients",
      value: kpis.totalClients,
      icon: Users,
      iconBg: "bg-blue-100 dark:bg-blue-950/20",
      iconColor: "text-blue-600",
      link: "/dashboard/clients",
    },
    {
      title: "Active Policies",
      value: kpis.activePolicies,
      icon: FileText,
      iconBg: "bg-green-100 dark:bg-green-950/20",
      iconColor: "text-green-600",
      link: "/dashboard/policies",
    },
    {
      title: "Expiring Soon",
      value: kpis.expiringSoon,
      icon: AlertTriangle,
      iconBg: "bg-orange-100 dark:bg-orange-950/20",
      iconColor: "text-orange-600",
      link: "/dashboard/policies",
    },
    {
      title: "Claims In Progress",
      value: kpis.claimsInProgress,
      icon: ClipboardList,
      iconBg: "bg-purple-100 dark:bg-purple-950/20",
      iconColor: "text-purple-600",
      link: "/dashboard/claims",
    },
    {
      title: "Pending Tasks",
      value: kpis.pendingTasks,
      icon: CheckSquare,
      iconBg: "bg-cyan-100 dark:bg-cyan-950/20",
      iconColor: "text-cyan-600",
      link: "/dashboard/tasks",
    },
  ] : [];

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent rounded-xl p-6 border border-border">
        <h2 className="text-2xl font-semibold mb-1">
          Welcome back, {advisor?.full_name?.split(' ')[0] || "Advisor"} 👋
        </h2>
        <p className="text-muted-foreground">Here's what's happening with your portfolio today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Link
              key={index}
              to={card.link}
              className="bg-card rounded-xl p-5 border border-border hover:shadow-lg hover:border-primary/30 transition-all group"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${card.iconBg}`}>
                  <Icon className={`size-5 ${card.iconColor}`} />
                </div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
              </div>
              <p className="text-3xl font-bold">{card.value}</p>
              <p className="text-xs text-primary mt-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                View details <ArrowRight className="size-3" />
              </p>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-card rounded-xl p-5 border border-border">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setShowAddClient(true)}
            className="px-4 py-2.5 bg-blue-50 dark:bg-blue-950/20 text-blue-600 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-950/40 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <Plus className="size-4" /> Add Client
          </button>
          <button
            onClick={() => setShowAddPolicy(true)}
            className="px-4 py-2.5 bg-green-50 dark:bg-green-950/20 text-green-600 rounded-lg hover:bg-green-100 dark:hover:bg-green-950/40 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <Plus className="size-4" /> Add Policy
          </button>
          <button
            onClick={() => setShowAddTask(true)}
            className="px-4 py-2.5 bg-purple-50 dark:bg-purple-950/20 text-purple-600 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-950/40 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <Plus className="size-4" /> Create Task
          </button>
          <Link
            to="/dashboard/claims"
            className="px-4 py-2.5 bg-orange-50 dark:bg-orange-950/20 text-orange-600 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-950/40 transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <ClipboardList className="size-4" /> View Claims
          </Link>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Policy Distribution */}
        <div className="bg-card rounded-xl p-5 border border-border">
          <h3 className="text-lg font-semibold mb-4">Policy Distribution</h3>
          {policyDist.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <p>No policy data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={policyDist}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={4}
                  dataKey="count"
                  nameKey="type"
                  label={({ type, count }) => `${type} (${count})`}
                >
                  {policyDist.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Claims Status */}
        <div className="bg-card rounded-xl p-5 border border-border">
          <h3 className="text-lg font-semibold mb-4">Claims by Status</h3>
          {claimsDist.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <p>No claims data yet</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={claimsDist}>
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

      {/* Recent Activity */}
      <div className="bg-card rounded-xl p-5 border border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
          <Link to="/dashboard/notifications" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4">No recent activity.</p>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {activity.entity_type === 'client' ? (
                    <Users className="size-4 text-primary" />
                  ) : (
                    <Clock className="size-4 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    {activity.action}
                    {activity.entity_name && <strong className="ml-1">{activity.entity_name}</strong>}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{formatTime(activity.time)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dialogs */}
      {advisor && (
        <>
          <AddClientDialog advisorId={advisor.id} open={showAddClient} onClose={() => setShowAddClient(false)} onCreated={fetchDashboardData} />
          <AddPolicyDialog advisorId={advisor.id} open={showAddPolicy} onClose={() => setShowAddPolicy(false)} onCreated={fetchDashboardData} />
          <AddTaskDialog advisorId={advisor.id} open={showAddTask} onClose={() => setShowAddTask(false)} onCreated={fetchDashboardData} />
        </>
      )}
    </div>
  );
}