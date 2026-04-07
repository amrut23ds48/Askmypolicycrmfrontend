import { useState } from "react";
import { useParams, Link } from "react-router";
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Briefcase,
  DollarSign,
  FileText,
  Edit,
  Download,
  Eye,
  Plus
} from "lucide-react";

const clientData = {
  id: 1,
  name: "Sarah Mitchell",
  email: "sarah.mitchell@email.com",
  phone: "+1 (555) 123-4567",
  dateOfBirth: "1985-06-15",
  address: "123 Park Avenue, Apt 4B, New York, NY 10016",
  occupation: "Software Engineer",
  incomeRange: "$100,000 - $150,000",
  riskProfile: "Medium",
  joinDate: "2022-03-15",
};

const policies = [
  {
    id: "POL-1001",
    name: "Comprehensive Health Insurance",
    provider: "HealthFirst Insurance",
    type: "Health Insurance",
    premium: "$450/month",
    startDate: "2023-01-01",
    expiryDate: "2026-12-31",
    status: "Active",
    documents: 3
  },
  {
    id: "POL-1002",
    name: "Term Life Insurance - 20 Year",
    provider: "SecureLife Corp",
    type: "Life Insurance",
    premium: "$85/month",
    startDate: "2022-06-01",
    expiryDate: "2042-05-31",
    status: "Active",
    documents: 2
  },
  {
    id: "POL-1003",
    name: "Investment Growth Plan",
    provider: "WealthBuilder Financial",
    type: "Investment Plan",
    premium: "$500/month",
    startDate: "2023-09-01",
    expiryDate: "2033-08-31",
    status: "Expired",
    documents: 4
  },
];

const claims = [
  {
    id: "CLM-8832",
    policy: "POL-1001",
    amount: "$15,000",
    claimDate: "2026-02-10",
    status: "Approved",
    description: "Medical treatment for surgery"
  },
  {
    id: "CLM-7721",
    policy: "POL-1001",
    amount: "$2,500",
    claimDate: "2025-11-22",
    status: "Approved",
    description: "Prescription medications"
  },
  {
    id: "CLM-6643",
    policy: "POL-1002",
    amount: "$500",
    claimDate: "2025-08-15",
    status: "Pending",
    description: "Health checkup coverage"
  },
];

const notes = [
  {
    id: 1,
    date: "2026-03-10",
    author: "John Doe",
    content: "Client interested in adding property insurance. Schedule follow-up for next month.",
    type: "Follow-up"
  },
  {
    id: 2,
    date: "2026-02-15",
    author: "John Doe",
    content: "Discussed investment options. Client prefers low-risk mutual funds.",
    type: "Meeting"
  },
  {
    id: 3,
    date: "2026-01-20",
    author: "Jane Smith",
    content: "Policy renewal reminder sent. Client confirmed interest in renewal.",
    type: "Reminder"
  },
];

export function ClientProfile() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    { id: "personal", label: "Personal Details" },
    { id: "policies", label: "Policies Owned" },
    { id: "claims", label: "Claims History" },
    { id: "notes", label: "Advisor Notes" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "text-green-600 bg-green-50 dark:bg-green-950/20";
      case "Expired": return "text-gray-600 bg-gray-50 dark:bg-gray-950/20";
      case "Pending": return "text-orange-600 bg-orange-50 dark:bg-orange-950/20";
      case "Approved": return "text-green-600 bg-green-50 dark:bg-green-950/20";
      case "Rejected": return "text-red-600 bg-red-50 dark:bg-red-950/20";
      default: return "text-gray-600 bg-gray-50 dark:bg-gray-950/20";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Back Button */}
      <Link 
        to="/clients"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to Clients
      </Link>

      {/* Client Header */}
      <div className="bg-card rounded-xl p-6 border border-border">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="size-20 rounded-full bg-primary flex items-center justify-center">
              <span className="text-2xl text-primary-foreground font-semibold">SM</span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold mb-1">{clientData.name}</h2>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Mail className="size-4" />
                  {clientData.email}
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="size-4" />
                  {clientData.phone}
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-4" />
                  Member since {new Date(clientData.joinDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
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
          <p className="text-2xl font-semibold">{policies.filter(p => p.status === "Active").length}</p>
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
          <p className="text-2xl font-semibold">{clientData.riskProfile}</p>
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
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
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
                  <p className="font-medium">{clientData.name}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Email Address</label>
                  <p className="font-medium">{clientData.email}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Phone Number</label>
                  <p className="font-medium">{clientData.phone}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Date of Birth</label>
                  <p className="font-medium">
                    {new Date(clientData.dateOfBirth).toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Address</label>
                  <p className="font-medium">{clientData.address}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Occupation</label>
                  <p className="font-medium">{clientData.occupation}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Annual Income Range</label>
                  <p className="font-medium">{clientData.incomeRange}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1 block">Risk Profile</label>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-orange-600 bg-orange-50 dark:bg-orange-950/20">
                    {clientData.riskProfile}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Policies Tab */}
          {activeTab === "policies" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  {policies.length} policies found
                </p>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                  <Plus className="size-4" />
                  Add Policy
                </button>
              </div>
              <div className="space-y-3">
                {policies.map((policy) => (
                  <div key={policy.id} className="p-5 rounded-lg border border-border hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{policy.name}</h4>
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(policy.status)}`}>
                            {policy.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{policy.provider}</p>
                        <div className="flex flex-wrap gap-4 text-sm">
                          <span className="text-muted-foreground">
                            <strong>ID:</strong> {policy.id}
                          </span>
                          <span className="text-muted-foreground">
                            <strong>Type:</strong> {policy.type}
                          </span>
                          <span className="text-muted-foreground">
                            <strong>Premium:</strong> {policy.premium}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <Eye className="size-4 text-muted-foreground" />
                        </button>
                        <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                          <Download className="size-4 text-muted-foreground" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Start: {new Date(policy.startDate).toLocaleDateString()}</span>
                        <span>Expiry: {new Date(policy.expiryDate).toLocaleDateString()}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {policy.documents} documents
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Claims Tab */}
          {activeTab === "claims" && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                {claims.length} claims found
              </p>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Claim ID</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Policy</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Description</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Amount</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Claim Date</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {claims.map((claim) => (
                      <tr key={claim.id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-medium">{claim.id}</td>
                        <td className="px-4 py-3 text-muted-foreground">{claim.policy}</td>
                        <td className="px-4 py-3 text-muted-foreground">{claim.description}</td>
                        <td className="px-4 py-3 font-medium">{claim.amount}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(claim.claimDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(claim.status)}`}>
                            {claim.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === "notes" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  {notes.length} notes
                </p>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                  <Plus className="size-4" />
                  Add Note
                </button>
              </div>
              <div className="space-y-3">
                {notes.map((note) => (
                  <div key={note.id} className="p-5 rounded-lg border border-border bg-muted/20">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-primary flex items-center justify-center">
                          <span className="text-xs text-primary-foreground font-semibold">
                            {note.author.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{note.author}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(note.date).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                        {note.type}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{note.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
