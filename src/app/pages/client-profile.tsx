import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Briefcase, DollarSign, FileText, Edit, Download, Eye, Plus, Loader2 } from "lucide-react";
import { useAuth } from "../../lib/auth-context";
import { getClientById, type Client } from "../../lib/services/clients";
import { getPoliciesByClient, type Policy } from "../../lib/services/policies";
import { getClaimsByClient, type Claim } from "../../lib/services/claims";

export function ClientProfile() {
  const { id } = useParams();
  const { advisor } = useAuth();
  const [client, setClient] = useState<Client | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [clientData, policiesData, claimsData] = await Promise.all([
        getClientById(id),
        getPoliciesByClient(id),
        getClaimsByClient(id),
      ]);
      setClient(clientData);
      setPolicies(policiesData);
      setClaims(claimsData);
    } catch (err) {
      console.error("Error loading client profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "personal", label: "Personal Details" },
    { id: "policies", label: `Policies (${policies.length})` },
    { id: "claims", label: `Claims (${claims.length})` },
  ];

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active": return "text-green-600 bg-green-50 dark:bg-green-950/20";
      case "expired": case "cancelled": return "text-gray-600 bg-gray-50 dark:bg-gray-950/20";
      case "pending": case "submitted": return "text-orange-600 bg-orange-50 dark:bg-orange-950/20";
      case "approved": case "completed": return "text-green-600 bg-green-50 dark:bg-green-950/20";
      case "rejected": return "text-red-600 bg-red-50 dark:bg-red-950/20";
      default: return "text-gray-600 bg-gray-50 dark:bg-gray-950/20";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Client not found.</p>
        <Link to="/dashboard/clients" className="text-primary hover:underline mt-2 inline-block">Back to Clients</Link>
      </div>
    );
  }

  const initials = client.full_name?.split(' ').map(n => n[0]).join('') || '?';

  return (
    <div className="p-6 space-y-6">
      {/* Back Button */}
      <Link to="/dashboard/clients" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="size-4" />
        Back to Clients
      </Link>

      {/* Client Header */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-20 rounded-full bg-primary flex items-center justify-center">
              <span className="text-2xl text-primary-foreground font-semibold">{initials}</span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-1">{client.full_name}</h2>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                {client.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="size-4" />
                    {client.email}
                  </div>
                )}
                {client.mobile_number && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="size-4" />
                    {client.mobile_number}
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-4" />
                  Member since {new Date(client.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2">
              <Download className="size-4" />
              Export
            </button>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
              <Edit className="size-4" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-950/20 rounded-lg">
              <FileText className="size-5 text-blue-600" />
            </div>
            <p className="text-sm text-muted-foreground">Total Policies</p>
          </div>
          <p className="text-2xl font-semibold">{policies.length}</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-950/20 rounded-lg">
              <FileText className="size-5 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground">Active Policies</p>
          </div>
          <p className="text-2xl font-semibold">{policies.filter(p => p.status === "active").length}</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-950/20 rounded-lg">
              <FileText className="size-5 text-orange-600" />
            </div>
            <p className="text-sm text-muted-foreground">Total Claims</p>
          </div>
          <p className="text-2xl font-semibold">{claims.length}</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 dark:bg-purple-950/20 rounded-lg">
              <DollarSign className="size-5 text-purple-600" />
            </div>
            <p className="text-sm text-muted-foreground">Risk Profile</p>
          </div>
          <p className="text-2xl font-semibold capitalize">{client.risk_profile || "—"}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="border-b border-border">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* Personal Details Tab */}
          {activeTab === "personal" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Full Name</label>
                  <p className="font-medium">{client.full_name}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Email Address</label>
                  <p className="font-medium">{client.email || "—"}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Phone Number</label>
                  <p className="font-medium">{client.mobile_number || "—"}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Date of Birth</label>
                  <p className="font-medium">
                    {client.dob ? new Date(client.dob).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : "—"}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Address</label>
                  <p className="font-medium">{client.address || "—"}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">City / State</label>
                  <p className="font-medium">{[client.city, client.state].filter(Boolean).join(', ') || "—"}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Occupation</label>
                  <p className="font-medium">{client.occupation || "—"}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Risk Profile</label>
                  {client.risk_profile ? (
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(client.risk_profile)}`}>
                      {client.risk_profile.charAt(0).toUpperCase() + client.risk_profile.slice(1)}
                    </span>
                  ) : <p className="font-medium">—</p>}
                </div>
              </div>
              {client.note && (
                <div className="md:col-span-2">
                  <label className="text-sm text-muted-foreground mb-1 block">Notes</label>
                  <p className="font-medium whitespace-pre-wrap">{client.note}</p>
                </div>
              )}
            </div>
          )}

          {/* Policies Tab */}
          {activeTab === "policies" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">{policies.length} policies found</p>
              </div>
              {policies.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No policies found for this client.</p>
              ) : (
                <div className="space-y-3">
                  {policies.map((policy) => (
                    <div key={policy.id} className="p-5 rounded-lg border border-border hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-semibold">{policy.policy_type || "Policy"}</h4>
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(policy.status || '')}`}>
                              {policy.status?.charAt(0).toUpperCase() + (policy.status?.slice(1) || '')}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{policy.company_name}</p>
                          <div className="flex flex-wrap gap-4 text-sm">
                            <span className="text-muted-foreground"><strong>Number:</strong> {policy.policy_number || 'N/A'}</span>
                            {policy.premium_amount && (
                              <span className="text-muted-foreground"><strong>Premium:</strong> ₹{policy.premium_amount.toLocaleString()}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {policy.start_date && <span>Start: {new Date(policy.start_date).toLocaleDateString()}</span>}
                          {policy.end_date && <span>Expiry: {new Date(policy.end_date).toLocaleDateString()}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Claims Tab */}
          {activeTab === "claims" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">{claims.length} claims found</p>
              {claims.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No claims found for this client.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50 border-b border-border">
                      <tr>
                        <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Policy</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Description</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Amount</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Date</th>
                        <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {claims.map((claim) => (
                        <tr key={claim.id} className="hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3 text-muted-foreground">{claim.policy_number}</td>
                          <td className="px-4 py-3 text-muted-foreground">{claim.note || "—"}</td>
                          <td className="px-4 py-3 font-medium">{claim.claim_amount ? `₹${claim.claim_amount.toLocaleString()}` : "—"}</td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {claim.submitted_at ? new Date(claim.submitted_at).toLocaleDateString() : "—"}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status || '')}`}>
                              {claim.status?.charAt(0).toUpperCase() + (claim.status?.slice(1).replace(/_/g, ' ') || '')}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
