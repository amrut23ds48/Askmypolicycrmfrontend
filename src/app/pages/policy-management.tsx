import { useState } from "react";
import { Plus, Search, Filter, Download, Eye, Edit, Upload, FileText } from "lucide-react";

const policies = [
  {
    id: "POL-1001",
    clientName: "Sarah Mitchell",
    policyName: "Comprehensive Health Insurance",
    type: "Health Insurance",
    provider: "HealthFirst Insurance",
    premium: "$450/month",
    startDate: "2023-01-01",
    expiryDate: "2026-12-31",
    status: "Active",
    documents: 3
  },
  {
    id: "POL-1002",
    clientName: "David Chen",
    policyName: "Term Life Insurance - 20 Year",
    type: "Life Insurance",
    provider: "SecureLife Corp",
    premium: "$85/month",
    startDate: "2022-06-01",
    expiryDate: "2042-05-31",
    status: "Active",
    documents: 2
  },
  {
    id: "POL-1003",
    clientName: "Emma Wilson",
    policyName: "Property Insurance - Home",
    type: "Property Insurance",
    provider: "SafeHome Insurance",
    premium: "$120/month",
    startDate: "2024-01-15",
    expiryDate: "2027-01-14",
    status: "Active",
    documents: 5
  },
  {
    id: "POL-1004",
    clientName: "Michael Brown",
    policyName: "Investment Growth Plan",
    type: "Investment Plan",
    provider: "WealthBuilder Financial",
    premium: "$500/month",
    startDate: "2023-09-01",
    expiryDate: "2033-08-31",
    status: "Active",
    documents: 4
  },
  {
    id: "POL-1005",
    clientName: "Olivia Martinez",
    policyName: "Auto Insurance - Premium",
    type: "Auto Insurance",
    provider: "DriveSecure Insurance",
    premium: "$180/month",
    startDate: "2025-03-01",
    expiryDate: "2026-02-28",
    status: "Expiring Soon",
    documents: 2
  },
  {
    id: "POL-1006",
    clientName: "James Taylor",
    policyName: "Critical Illness Cover",
    type: "Health Insurance",
    provider: "HealthFirst Insurance",
    premium: "$200/month",
    startDate: "2021-11-01",
    expiryDate: "2025-10-31",
    status: "Expired",
    documents: 3
  },
];

export function PolicyManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "text-green-600 bg-green-50 dark:bg-green-950/20";
      case "Expired": return "text-gray-600 bg-gray-50 dark:bg-gray-950/20";
      case "Expiring Soon": return "text-orange-600 bg-orange-50 dark:bg-orange-950/20";
      default: return "text-gray-600 bg-gray-50 dark:bg-gray-950/20";
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      "Health Insurance": "text-blue-600 bg-blue-50 dark:bg-blue-950/20",
      "Life Insurance": "text-purple-600 bg-purple-50 dark:bg-purple-950/20",
      "Property Insurance": "text-green-600 bg-green-50 dark:bg-green-950/20",
      "Investment Plan": "text-orange-600 bg-orange-50 dark:bg-orange-950/20",
      "Auto Insurance": "text-cyan-600 bg-cyan-50 dark:bg-cyan-950/20",
    };
    return colors[type] || "text-gray-600 bg-gray-50 dark:bg-gray-950/20";
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
              placeholder="Search policies by name, client, or ID..."
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
            <Upload className="size-4" />
            Upload Document
          </button>
          <button className="px-4 py-2.5 bg-card border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2">
            <Download className="size-4" />
            Export
          </button>
          <button className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
            <Plus className="size-4" />
            Add Policy
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-950/20 rounded-lg">
              <FileText className="size-5 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground">Total Policies</p>
          </div>
          <p className="text-2xl font-semibold">{policies.length}</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-950/20 rounded-lg">
              <FileText className="size-5 text-blue-600" />
            </div>
            <p className="text-sm text-muted-foreground">Active Policies</p>
          </div>
          <p className="text-2xl font-semibold">{policies.filter(p => p.status === "Active").length}</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-950/20 rounded-lg">
              <FileText className="size-5 text-orange-600" />
            </div>
            <p className="text-sm text-muted-foreground">Expiring Soon</p>
          </div>
          <p className="text-2xl font-semibold">{policies.filter(p => p.status === "Expiring Soon").length}</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gray-100 dark:bg-gray-950/20 rounded-lg">
              <FileText className="size-5 text-gray-600" />
            </div>
            <p className="text-sm text-muted-foreground">Expired Policies</p>
          </div>
          <p className="text-2xl font-semibold">{policies.filter(p => p.status === "Expired").length}</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-lg border border-border">
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Policy Type:</label>
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Types</option>
            <option value="Health Insurance">Health Insurance</option>
            <option value="Life Insurance">Life Insurance</option>
            <option value="Property Insurance">Property Insurance</option>
            <option value="Investment Plan">Investment Plan</option>
            <option value="Auto Insurance">Auto Insurance</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Status:</label>
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-1.5 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Expired">Expired</option>
          </select>
        </div>
        <div className="ml-auto text-sm text-muted-foreground">
          Showing {policies.length} policies
        </div>
      </div>

      {/* Policy Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {policies.map((policy) => (
          <div key={policy.id} className="bg-card rounded-xl p-6 border border-border hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-lg">{policy.policyName}</h3>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(policy.status)}`}>
                    {policy.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{policy.provider}</p>
                <p className="text-sm text-muted-foreground">Client: <span className="font-medium text-foreground">{policy.clientName}</span></p>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="View Details">
                  <Eye className="size-4 text-muted-foreground" />
                </button>
                <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Edit Policy">
                  <Edit className="size-4 text-muted-foreground" />
                </button>
                <button className="p-2 hover:bg-muted rounded-lg transition-colors" title="Download Documents">
                  <Download className="size-4 text-muted-foreground" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Policy ID</p>
                <p className="text-sm font-medium">{policy.id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Policy Type</p>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(policy.type)}`}>
                  {policy.type}
                </span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Premium</p>
                <p className="text-sm font-medium">{policy.premium}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Documents</p>
                <p className="text-sm font-medium">{policy.documents} files</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div>
                  <p className="text-xs mb-0.5">Start Date</p>
                  <p className="font-medium text-foreground">{new Date(policy.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-xs mb-0.5">Expiry Date</p>
                  <p className="font-medium text-foreground">{new Date(policy.expiryDate).toLocaleDateString()}</p>
                </div>
              </div>
              <button className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition-colors">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
