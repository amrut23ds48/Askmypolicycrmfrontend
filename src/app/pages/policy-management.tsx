import { useState, useEffect } from "react";
import { Plus, Search, Download, Eye, Edit, FileText, AlertCircle, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "../../lib/auth-context";
import { getPolicies, getPolicyStats, type Policy, type PolicyFilters } from "../../lib/services/policies";
import { AddPolicyDialog } from "../components/add-policy-dialog";

export function PolicyManagement() {
  const { advisor } = useAuth();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [stats, setStats] = useState({ total: 0, active: 0, expired: 0, expiringSoon: 0, typeDistribution: {} as Record<string, number> });

  useEffect(() => {
    if (advisor?.id) {
      fetchData();
    }
  }, [advisor?.id, filterType, filterStatus]);

  const fetchData = async () => {
    if (!advisor) return;
    setLoading(true);
    try {
      const filters: PolicyFilters = {};
      if (filterType !== "all") filters.policy_type = filterType;
      if (filterStatus !== "all") filters.status = filterStatus;

      const [policiesData, statsData] = await Promise.all([
        getPolicies(advisor.id, filters),
        getPolicyStats(advisor.id),
      ]);
      setPolicies(policiesData);
      setStats(statsData);
    } catch (err) {
      console.error("Error fetching policies:", err);
    } finally {
      setLoading(false);
    }
  };

  // Client-side search
  const filteredPolicies = searchQuery
    ? policies.filter(p =>
        (p.client_name?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.policy_number?.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.policy_type?.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : policies;

  const getStatusConfig = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case "active": return { color: "text-green-600 bg-green-50 dark:bg-green-950/20", icon: CheckCircle2 };
      case "expired": return { color: "text-gray-600 bg-gray-50 dark:bg-gray-950/20", icon: AlertCircle };
      case "cancelled": return { color: "text-red-600 bg-red-50 dark:bg-red-950/20", icon: AlertCircle };
      default: return { color: "text-gray-600 bg-gray-50 dark:bg-gray-950/20", icon: Clock };
    }
  };

  const isExpiringSoon = (endDate: string | null) => {
    if (!endDate) return false;
    const end = new Date(endDate);
    const now = new Date();
    const diffDays = (end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
    return diffDays > 0 && diffDays <= 30;
  };

  const policyTypes = [...new Set(policies.map(p => p.policy_type).filter(Boolean))] as string[];

  if (loading && policies.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading policies...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-950/20 rounded-lg">
              <FileText className="size-5 text-blue-600" />
            </div>
            <p className="text-sm text-muted-foreground">Total Policies</p>
          </div>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-950/20 rounded-lg">
              <CheckCircle2 className="size-5 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground">Active</p>
          </div>
          <p className="text-2xl font-bold">{stats.active}</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-950/20 rounded-lg">
              <Clock className="size-5 text-orange-600" />
            </div>
            <p className="text-sm text-muted-foreground">Expiring Soon</p>
          </div>
          <p className="text-2xl font-bold text-orange-600">{stats.expiringSoon}</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gray-100 dark:bg-gray-950/20 rounded-lg">
              <AlertCircle className="size-5 text-gray-600" />
            </div>
            <p className="text-sm text-muted-foreground">Expired</p>
          </div>
          <p className="text-2xl font-bold">{stats.expired}</p>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by policy number, type, or client..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Types</option>
            {policyTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={() => setShowAddDialog(true)}
            className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus className="size-4" />
            Add Policy
          </button>
        </div>
      </div>

      {/* Policies Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Policy Number</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Client</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Company</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Premium</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Expiry</th>
                <th className="text-center px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPolicies.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    {policies.length === 0 ? "No policies yet. Click 'Add Policy' to get started." : "No policies match your search."}
                  </td>
                </tr>
              ) : (
                filteredPolicies.map((policy) => {
                  const statusConfig = getStatusConfig(policy.status);
                  const expiring = isExpiringSoon(policy.end_date);
                  return (
                    <tr key={policy.id} className={`hover:bg-muted/30 transition-colors ${expiring ? "bg-orange-50/50 dark:bg-orange-950/10" : ""}`}>
                      <td className="px-6 py-4">
                        <span className="font-medium">{policy.policy_number || policy.id.slice(0, 12)}</span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{policy.client_name}</td>
                      <td className="px-6 py-4 text-muted-foreground">{policy.policy_type || "—"}</td>
                      <td className="px-6 py-4 text-muted-foreground">{policy.company_name || "—"}</td>
                      <td className="px-6 py-4 font-medium">
                        {policy.premium_amount ? `₹${policy.premium_amount.toLocaleString()}` : "—"}
                      </td>
                      <td className="px-6 py-4">
                        {policy.end_date ? (
                          <div>
                            <p className={`text-sm ${expiring ? "text-orange-600 font-medium" : "text-muted-foreground"}`}>
                              {new Date(policy.end_date).toLocaleDateString()}
                            </p>
                            {expiring && <p className="text-xs text-orange-500">Expiring soon</p>}
                          </div>
                        ) : "—"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          {policy.status?.charAt(0).toUpperCase() + (policy.status?.slice(1) || '')}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Policy Dialog */}
      {advisor && (
        <AddPolicyDialog
          advisorId={advisor.id}
          open={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onCreated={fetchData}
        />
      )}
    </div>
  );
}
