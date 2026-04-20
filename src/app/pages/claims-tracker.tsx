import { useState, useEffect } from "react";
import { Plus, Search, Filter, Eye, Clock, CheckCircle2, AlertCircle, FileSearch, Loader2 } from "lucide-react";
import { useAuth } from "../../lib/auth-context";
import { getClaims, getClaimStats, type Claim, type ClaimFilters } from "../../lib/services/claims";
import { AddClaimDialog } from "../components/add-claim-dialog";

export function ClaimsTracker() {
  const { advisor } = useAuth();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [stats, setStats] = useState({ total: 0, submitted: 0, inReview: 0, pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    if (advisor?.id) fetchData();
  }, [advisor?.id, filterStatus]);

  const fetchData = async () => {
    if (!advisor) return;
    setLoading(true);
    try {
      const filters: ClaimFilters = {};
      if (filterStatus !== "all") filters.status = filterStatus;

      const [claimsData, statsData] = await Promise.all([
        getClaims(advisor.id, filters),
        getClaimStats(advisor.id),
      ]);
      setClaims(claimsData);
      setStats(statsData);
    } catch (err) {
      console.error("Error fetching claims:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredClaims = searchQuery
    ? claims.filter(c =>
        c.client_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.policy_number?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : claims;

  const getStatusConfig = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case "submitted": return { color: "text-blue-600 bg-blue-50 dark:bg-blue-950/20", icon: Clock };
      case "in_review": case "under_review": return { color: "text-purple-600 bg-purple-50 dark:bg-purple-950/20", icon: FileSearch };
      case "pending": case "pending_documents": return { color: "text-orange-600 bg-orange-50 dark:bg-orange-950/20", icon: AlertCircle };
      case "approved": case "completed": return { color: "text-green-600 bg-green-50 dark:bg-green-950/20", icon: CheckCircle2 };
      case "rejected": return { color: "text-red-600 bg-red-50 dark:bg-red-950/20", icon: AlertCircle };
      default: return { color: "text-gray-600 bg-gray-50 dark:bg-gray-950/20", icon: Clock };
    }
  };

  if (loading && claims.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading claims...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Pipeline Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-card rounded-xl p-5 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Submitted</p>
          <p className="text-2xl font-bold text-blue-600">{stats.submitted}</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <p className="text-sm text-muted-foreground mb-1">In Review</p>
          <p className="text-2xl font-bold text-purple-600">{stats.inReview}</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Pending</p>
          <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Approved</p>
          <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Rejected</p>
          <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by client or policy number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="submitted">Submitted</option>
            <option value="in_review">In Review</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <button
            onClick={() => setShowAddDialog(true)}
            className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus className="size-4" />
            File New Claim
          </button>
        </div>
      </div>

      {/* Claims Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Client</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Policy</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Type</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Amount</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Submitted</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Notes</th>
                <th className="text-center px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredClaims.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    {claims.length === 0 ? "No claims filed yet. Click 'File New Claim' to get started." : "No claims match your search."}
                  </td>
                </tr>
              ) : (
                filteredClaims.map((claim) => {
                  const statusConfig = getStatusConfig(claim.status);
                  const StatusIcon = statusConfig.icon;
                  return (
                    <tr key={claim.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium">{claim.client_name}</td>
                      <td className="px-6 py-4 text-muted-foreground">{claim.policy_number}</td>
                      <td className="px-6 py-4 text-muted-foreground">{claim.policy_type || "—"}</td>
                      <td className="px-6 py-4 font-medium">
                        {claim.claim_amount ? `₹${claim.claim_amount.toLocaleString()}` : "—"}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {claim.submitted_at ? new Date(claim.submitted_at).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">
                        {claim.note || "—"}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
                          <StatusIcon className="size-3.5" />
                          {claim.status?.charAt(0).toUpperCase() + (claim.status?.slice(1).replace(/_/g, ' ') || '')}
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

      {/* Add Claim Dialog */}
      {advisor && (
        <AddClaimDialog
          advisorId={advisor.id}
          open={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onCreated={fetchData}
        />
      )}
    </div>
  );
}
