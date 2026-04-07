import { useState } from "react";
import { Plus, Search, Filter, Download, Upload, Eye, MessageSquare } from "lucide-react";

const claims = [
  {
    id: "CLM-8832",
    clientName: "Emma Wilson",
    policyName: "Comprehensive Health Insurance",
    policyId: "POL-1001",
    amount: "$15,000",
    claimDate: "2026-02-10",
    lastUpdated: "2026-03-12",
    status: "Approved",
    stage: "completed",
    description: "Medical treatment for surgery",
    documents: 5
  },
  {
    id: "CLM-8821",
    clientName: "David Chen",
    policyName: "Term Life Insurance",
    policyId: "POL-1002",
    amount: "$5,000",
    claimDate: "2026-03-01",
    lastUpdated: "2026-03-10",
    status: "Under Review",
    stage: "review",
    description: "Medical checkup claim",
    documents: 3
  },
  {
    id: "CLM-8810",
    clientName: "Sarah Mitchell",
    policyName: "Property Insurance - Home",
    policyId: "POL-1003",
    amount: "$12,500",
    claimDate: "2026-02-28",
    lastUpdated: "2026-03-08",
    status: "Pending Documents",
    stage: "pending",
    description: "Water damage repair",
    documents: 2
  },
  {
    id: "CLM-8799",
    clientName: "Michael Brown",
    policyName: "Auto Insurance",
    policyId: "POL-1005",
    amount: "$8,200",
    claimDate: "2026-03-05",
    lastUpdated: "2026-03-05",
    status: "Submitted",
    stage: "submitted",
    description: "Vehicle accident claim",
    documents: 4
  },
  {
    id: "CLM-8788",
    clientName: "Olivia Martinez",
    policyName: "Critical Illness Cover",
    policyId: "POL-1006",
    amount: "$2,500",
    claimDate: "2026-02-15",
    lastUpdated: "2026-02-20",
    status: "Rejected",
    stage: "rejected",
    description: "Illness treatment claim",
    documents: 2
  },
];

const statusStages = [
  { id: "submitted", label: "Submitted", count: 1 },
  { id: "review", label: "Under Review", count: 1 },
  { id: "pending", label: "Pending Documents", count: 1 },
  { id: "completed", label: "Approved", count: 1 },
  { id: "rejected", label: "Rejected", count: 1 },
];

export function ClaimsTracker() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Submitted": return "text-blue-600 bg-blue-50 dark:bg-blue-950/20";
      case "Under Review": return "text-orange-600 bg-orange-50 dark:bg-orange-950/20";
      case "Pending Documents": return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950/20";
      case "Approved": return "text-green-600 bg-green-50 dark:bg-green-950/20";
      case "Rejected": return "text-red-600 bg-red-50 dark:bg-red-950/20";
      default: return "text-gray-600 bg-gray-50 dark:bg-gray-950/20";
    }
  };

  const getStageIndex = (stage: string) => {
    const stages = ["submitted", "review", "pending", "completed", "rejected"];
    return stages.indexOf(stage);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search claims by ID, client, or policy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button className="px-4 py-2.5 bg-card border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2">
            <Filter className="size-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2.5 bg-card border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2">
            <Download className="size-4" />
            Export
          </button>
          <button className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
            <Plus className="size-4" />
            File New Claim
          </button>
        </div>
      </div>

      {/* Status Pipeline */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <h3 className="text-lg font-semibold mb-6">Claims Pipeline</h3>
        <div className="flex items-center justify-between gap-2">
          {statusStages.map((stage, index) => (
            <div key={stage.id} className="flex items-center flex-1">
              <div className="flex-1">
                <div className={`p-4 rounded-lg text-center transition-all ${
                  stage.count > 0 
                    ? "bg-primary/10 border-2 border-primary" 
                    : "bg-muted border-2 border-transparent"
                }`}>
                  <p className="text-sm font-medium mb-1">{stage.label}</p>
                  <p className="text-2xl font-semibold text-primary">{stage.count}</p>
                </div>
              </div>
              {index < statusStages.length - 1 && (
                <div className="w-8 mx-2">
                  <div className="h-0.5 bg-border"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {statusStages.map((stage) => {
          const count = claims.filter(c => c.stage === stage.id).length;
          return (
            <div key={stage.id} className="bg-card rounded-xl p-5 border border-border">
              <p className="text-sm text-muted-foreground mb-2">{stage.label}</p>
              <p className="text-2xl font-semibold">{count}</p>
            </div>
          );
        })}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-lg border border-border">
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Filter by Status:</label>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="Pending Documents">Pending Documents</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        <div className="ml-auto text-sm text-muted-foreground">
          Total Claims: {claims.length}
        </div>
      </div>

      {/* Claims List */}
      <div className="space-y-4">
        {claims.map((claim) => (
          <div key={claim.id} className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">{claim.id}</h3>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                    {claim.status}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                  <span>Client: <span className="font-medium text-foreground">{claim.clientName}</span></span>
                  <span className="hidden sm:inline">•</span>
                  <span>Policy: <span className="font-medium text-foreground">{claim.policyId}</span></span>
                  <span className="hidden sm:inline">•</span>
                  <span>Amount: <span className="font-medium text-foreground">{claim.amount}</span></span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2 text-sm">
                  <Upload className="size-4" />
                  Upload Docs
                </button>
                <button className="px-3 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2 text-sm">
                  <MessageSquare className="size-4" />
                  Add Note
                </button>
                <button className="px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-2 text-sm">
                  <Eye className="size-4" />
                  View
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Policy Name</p>
                <p className="text-sm font-medium">{claim.policyName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Claim Date</p>
                <p className="text-sm font-medium">{new Date(claim.claimDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Last Updated</p>
                <p className="text-sm font-medium">{new Date(claim.lastUpdated).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Documents</p>
                <p className="text-sm font-medium">{claim.documents} files</p>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-1">Description</p>
              <p className="text-sm">{claim.description}</p>
            </div>

            {/* Progress Bar */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2">
                {statusStages.slice(0, 4).map((stage, index) => {
                  const currentStageIndex = getStageIndex(claim.stage);
                  const isActive = index <= currentStageIndex;
                  return (
                    <div key={stage.id} className="flex items-center flex-1">
                      <div className={`h-2 flex-1 rounded-full transition-all ${
                        isActive ? "bg-primary" : "bg-muted"
                      }`}></div>
                      {index < 3 && (
                        <div className={`w-2 h-2 rounded-full mx-1 ${
                          isActive ? "bg-primary" : "bg-muted"
                        }`}></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
