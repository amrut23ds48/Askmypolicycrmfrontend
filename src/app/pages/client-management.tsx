import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Plus, Search, Download, Edit, Eye, Mail, Phone, MapPin, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useAuth } from "../../lib/auth-context";
import { getClients, type Client, type ClientFilters } from "../../lib/services/clients";
import { AddClientDialog } from "../components/add-client-dialog";

export function ClientManagement() {
  const { advisor } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRisk, setFilterRisk] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const itemsPerPage = 10;

  useEffect(() => {
    if (advisor?.id) {
      fetchClients();
    }
  }, [advisor?.id, searchQuery, filterStatus, filterRisk]);

  const fetchClients = async () => {
    if (!advisor) return;
    setLoading(true);
    try {
      const filters: ClientFilters = {};
      if (filterStatus !== 'all') filters.status = filterStatus;
      if (filterRisk !== 'all') filters.risk_profile = filterRisk;
      if (searchQuery) filters.search = searchQuery;

      const data = await getClients(advisor.id, filters);
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case "low": return "text-green-600 bg-green-50 dark:bg-green-950/20";
      case "medium": return "text-orange-600 bg-orange-50 dark:bg-orange-950/20";
      case "high": return "text-red-600 bg-red-50 dark:bg-red-950/20";
      default: return "text-gray-600 bg-gray-50 dark:bg-gray-950/20";
    }
  };

  const getStatusColor = (status: string) => {
    return status?.toLowerCase() === "active"
      ? "text-green-600 bg-green-50 dark:bg-green-950/20"
      : "text-gray-600 bg-gray-50 dark:bg-gray-950/20";
  };

  const totalPages = Math.ceil(clients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = clients.slice(startIndex, startIndex + itemsPerPage);

  if (loading && clients.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading clients...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search clients by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2.5 bg-card border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2">
            <Download className="size-4" />
            Export
          </button>
          <button
            onClick={() => setShowAddDialog(true)}
            className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus className="size-4" />
            Add Client
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-lg border border-border">
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => { setFilterStatus(e.target.value); setCurrentPage(1); }}
            className="px-3 py-1.5 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Risk Profile:</label>
          <select
            value={filterRisk}
            onChange={(e) => { setFilterRisk(e.target.value); setCurrentPage(1); }}
            className="px-3 py-1.5 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Risk Levels</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="low">Low Risk</option>
          </select>
        </div>
        <div className="ml-auto text-sm text-muted-foreground">
          Showing {paginatedClients.length} of {clients.length} clients
        </div>
      </div>

      {/* Client Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Client Name</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Contact</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Location</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Last Interaction</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Risk Profile</th>
                <th className="text-center px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-center px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedClients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    {clients.length === 0 ? "No clients yet. Click 'Add Client' to get started." : "No clients match your filters."}
                  </td>
                </tr>
              ) : (
                paginatedClients.map((client) => (
                  <tr key={client.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <span className="text-sm text-primary-foreground font-semibold">
                            {client.full_name?.split(' ').map(n => n[0]).join('') || '?'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{client.full_name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {client.email && (
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="size-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">{client.email}</span>
                          </div>
                        )}
                        {client.mobile_number && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="size-3.5 text-muted-foreground" />
                            <span className="text-muted-foreground">{client.mobile_number}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {(client.city || client.state) ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="size-3.5" />
                          {[client.city, client.state].filter(Boolean).join(', ')}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">
                        {client.last_interaction
                          ? new Date(client.last_interaction).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {client.risk_profile ? (
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getRiskColor(client.risk_profile)}`}>
                          {client.risk_profile.charAt(0).toUpperCase() + client.risk_profile.slice(1)}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                        {client.status?.charAt(0).toUpperCase() + client.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/dashboard/clients/${client.id}`}
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="size-4 text-muted-foreground" />
                        </Link>
                        <button
                          className="p-2 hover:bg-muted rounded-lg transition-colors"
                          title="Edit Client"
                        >
                          <Edit className="size-4 text-muted-foreground" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">{Math.min(startIndex + itemsPerPage, clients.length)}</span> of{" "}
              <span className="font-medium">{clients.length}</span> results
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-border hover:bg-accent transition-colors disabled:opacity-50"
              >
                <ChevronLeft className="size-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) pageNum = i + 1;
                else if (currentPage <= 3) pageNum = i + 1;
                else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                else pageNum = currentPage - 2 + i;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === pageNum ? 'bg-primary text-primary-foreground' : 'border border-border hover:bg-accent'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-border hover:bg-accent transition-colors disabled:opacity-50"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Client Dialog */}
      {advisor && (
        <AddClientDialog
          advisorId={advisor.id}
          open={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onCreated={fetchClients}
        />
      )}
    </div>
  );
}