import { useState, useEffect } from "react";
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
  ChevronRight,
  Loader2
} from "lucide-react";
import { supabase } from "../../lib/supabase";

interface Client {
  id: string;
  full_name: string;
  email: string;
  mobile_number: string;
  city: string;
  state: string;
  last_interaction: string;
  status: string;
  note: string;
  risk_profile: string;
}

export function ClientManagement() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterRisk, setFilterRisk] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [advisorId, setAdvisorId] = useState<string | null>(null);
  const itemsPerPage = 10;

  // Get current user and advisor ID
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          // FIXED: Use 'id' instead of 'user_id'
          const { data: advisor } = await supabase
            .from('advisors')
            .select('id')
            .eq('id', user.id)  // ← Changed from 'user_id' to 'id'
            .single();
          
          if (advisor) {
            setAdvisorId(advisor.id);
          }
        }
      } catch (error) {
        console.error('Error getting user:', error);
        setLoading(false);
      }
    };
    getUser();
  }, []);

  // Fetch clients when filters change
  useEffect(() => {
    if (advisorId) {
      fetchClients();
    }
  }, [advisorId, searchQuery, filterStatus, filterRisk]);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterStatus !== 'all') params.append('status', filterStatus.toLowerCase());
      if (filterRisk !== 'all') params.append('risk_profile', filterRisk.toLowerCase());
      if (searchQuery) params.append('search', searchQuery);
      
      const url = `http://localhost:3000/api/${advisorId}/clients${params.toString() ? '?' + params.toString() : ''}`;
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        setClients(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk?.toLowerCase()) {
      case "low": return "text-green-600 bg-green-50";
      case "medium": return "text-orange-600 bg-orange-50";
      case "high": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusColor = (status: string) => {
    return status?.toLowerCase() === "active" 
      ? "text-green-600 bg-green-50" 
      : "text-gray-600 bg-gray-50";
  };

  const totalPages = Math.ceil(clients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClients = clients.slice(startIndex, startIndex + itemsPerPage);

  if (loading && clients.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="size-8 animate-spin text-blue-600" />
        <p className="ml-2 text-gray-600">Loading clients...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download className="size-4" />
            Export
          </button>
          <button className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-opacity flex items-center gap-2">
            <Plus className="size-4" />
            Add Client
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Status:</label>
          <select 
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">Risk Profile:</label>
          <select 
            value={filterRisk}
            onChange={(e) => {
              setFilterRisk(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Risk Levels</option>
            <option value="high">High Risk</option>
            <option value="medium">Medium Risk</option>
            <option value="low">Low Risk</option>
          </select>
        </div>
        <div className="ml-auto text-sm text-gray-500">
          Showing {paginatedClients.length} of {clients.length} clients
        </div>
      </div>

      {/* Client Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Client Name</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Contact</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Location</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Last Interaction</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Risk Profile</th>
                <th className="text-center px-6 py-4 text-sm font-medium text-gray-600">Status</th>
                <th className="text-center px-6 py-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedClients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No clients found
                  </td>
                </tr>
              ) : (
                paginatedClients.map((client) => (
                  <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm text-white font-semibold">
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
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="size-3.5 text-gray-400" />
                          <span className="text-gray-600">{client.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="size-3.5 text-gray-400" />
                          <span className="text-gray-600">{client.mobile_number}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="size-3.5" />
                        {client.city}, {client.state}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {new Date(client.last_interaction).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getRiskColor(client.risk_profile)}`}>
                        {client.risk_profile?.charAt(0).toUpperCase() + client.risk_profile?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
                        {client.status?.charAt(0).toUpperCase() + client.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/clients/${client.id}`}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="size-4 text-gray-600" />
                        </Link>
                        <button 
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit Client"
                        >
                          <Edit className="size-4 text-gray-600" />
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
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
              <span className="font-medium">{Math.min(startIndex + itemsPerPage, clients.length)}</span> of{" "}
              <span className="font-medium">{clients.length}</span> results
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="size-4" />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}