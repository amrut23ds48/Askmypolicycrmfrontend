import { useState } from "react";
import { Link } from "react-router";
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  Edit, 
  Eye,
  Mail,
  Phone,
  MapPin,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const clients = [
  {
    id: 1,
    name: "Sarah Mitchell",
    email: "sarah.mitchell@email.com",
    phone: "+1 (555) 123-4567",
    city: "New York",
    totalPolicies: 3,
    activePolicies: 2,
    lastInteraction: "2026-03-12",
    advisor: "John Doe",
    riskProfile: "Medium",
    status: "Active"
  },
  {
    id: 2,
    name: "David Chen",
    email: "david.chen@email.com",
    phone: "+1 (555) 234-5678",
    city: "San Francisco",
    totalPolicies: 5,
    activePolicies: 4,
    lastInteraction: "2026-03-10",
    advisor: "John Doe",
    riskProfile: "Low",
    status: "Active"
  },
  {
    id: 3,
    name: "Emma Wilson",
    email: "emma.wilson@email.com",
    phone: "+1 (555) 345-6789",
    city: "Chicago",
    totalPolicies: 2,
    activePolicies: 2,
    lastInteraction: "2026-03-11",
    advisor: "Jane Smith",
    riskProfile: "High",
    status: "Active"
  },
  {
    id: 4,
    name: "Michael Brown",
    email: "michael.brown@email.com",
    phone: "+1 (555) 456-7890",
    city: "Boston",
    totalPolicies: 4,
    activePolicies: 3,
    lastInteraction: "2026-03-09",
    advisor: "John Doe",
    riskProfile: "Medium",
    status: "Inactive"
  },
  {
    id: 5,
    name: "Olivia Martinez",
    email: "olivia.martinez@email.com",
    phone: "+1 (555) 567-8901",
    city: "Los Angeles",
    totalPolicies: 6,
    activePolicies: 5,
    lastInteraction: "2026-03-13",
    advisor: "Jane Smith",
    riskProfile: "Low",
    status: "Active"
  },
  {
    id: 6,
    name: "James Taylor",
    email: "james.taylor@email.com",
    phone: "+1 (555) 678-9012",
    city: "Seattle",
    totalPolicies: 3,
    activePolicies: 3,
    lastInteraction: "2026-03-08",
    advisor: "John Doe",
    riskProfile: "High",
    status: "Active"
  },
];

export function ClientManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCity, setFilterCity] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "text-green-600 bg-green-50 dark:bg-green-950/20";
      case "Medium": return "text-orange-600 bg-orange-50 dark:bg-orange-950/20";
      case "High": return "text-red-600 bg-red-50 dark:bg-red-950/20";
      default: return "text-gray-600 bg-gray-50 dark:bg-gray-950/20";
    }
  };

  const getStatusColor = (status: string) => {
    return status === "Active" 
      ? "text-green-600 bg-green-50 dark:bg-green-950/20" 
      : "text-gray-600 bg-gray-50 dark:bg-gray-950/20";
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
              placeholder="Search clients by name, email, or phone..."
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
            Add Client
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-lg border border-border">
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">City:</label>
          <select 
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
            className="px-3 py-1.5 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Cities</option>
            <option value="New York">New York</option>
            <option value="San Francisco">San Francisco</option>
            <option value="Chicago">Chicago</option>
            <option value="Boston">Boston</option>
            <option value="Los Angeles">Los Angeles</option>
            <option value="Seattle">Seattle</option>
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
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="ml-auto text-sm text-muted-foreground">
          Showing {clients.length} clients
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
                <th className="text-center px-6 py-4 text-sm font-medium text-muted-foreground">Total Policies</th>
                <th className="text-center px-6 py-4 text-sm font-medium text-muted-foreground">Active Policies</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Last Interaction</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Risk Profile</th>
                <th className="text-center px-6 py-4 text-sm font-medium text-muted-foreground">Status</th>
                <th className="text-center px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <span className="text-sm text-primary-foreground font-semibold">
                          {client.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-sm text-muted-foreground">{client.advisor}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="size-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">{client.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="size-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">{client.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="size-3.5" />
                      {client.city}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-medium">{client.totalPolicies}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="font-medium">{client.activePolicies}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-muted-foreground">
                      {new Date(client.lastInteraction).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getRiskColor(client.riskProfile)}`}>
                      {client.riskProfile}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        to={`/clients/${client.id}`}
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
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">1</span> to <span className="font-medium">{clients.length}</span> of{" "}
            <span className="font-medium">{clients.length}</span> results
          </p>
          <div className="flex items-center gap-2">
            <button 
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground">
              1
            </button>
            <button className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors">
              2
            </button>
            <button className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors">
              3
            </button>
            <button className="p-2 rounded-lg border border-border hover:bg-muted transition-colors">
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
