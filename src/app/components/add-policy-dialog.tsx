import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { createPolicy, type CreatePolicyData } from "../../lib/services/policies";
import { getClients, type Client } from "../../lib/services/clients";
import { getInsuranceCompanies, type InsuranceCompany } from "../../lib/services/insurance-companies";
import { toast } from "sonner";

interface AddPolicyDialogProps {
  advisorId: string;
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
  preselectedClientId?: string;
}

export function AddPolicyDialog({ advisorId, open, onClose, onCreated, preselectedClientId }: AddPolicyDialogProps) {
  const [saving, setSaving] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [companies, setCompanies] = useState<InsuranceCompany[]>([]);
  const [formData, setFormData] = useState({
    client_id: preselectedClientId || "",
    company_id: "",
    policy_type: "",
    policy_number: "",
    premium_amount: "",
    start_date: "",
    end_date: "",
    status: "active",
  });

  useEffect(() => {
    if (open) {
      getClients(advisorId).then(setClients).catch(console.error);
      getInsuranceCompanies().then(setCompanies).catch(console.error);
      if (preselectedClientId) {
        setFormData(prev => ({ ...prev, client_id: preselectedClientId }));
      }
    }
  }, [open, advisorId, preselectedClientId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const policyTypes = ["Health Insurance", "Life Insurance", "Motor Insurance", "Property Insurance", "Travel Insurance", "Investment Plan", "Other"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client_id) { toast.error("Please select a client"); return; }

    setSaving(true);
    try {
      const data: CreatePolicyData = {
        client_id: formData.client_id,
        advisor_id: advisorId,
        company_id: formData.company_id || undefined,
        policy_type: formData.policy_type || undefined,
        policy_number: formData.policy_number || undefined,
        premium_amount: formData.premium_amount ? parseFloat(formData.premium_amount) : undefined,
        start_date: formData.start_date || undefined,
        end_date: formData.end_date || undefined,
        status: formData.status,
      };

      await createPolicy(data);
      toast.success("Policy added successfully");
      setFormData({ client_id: "", company_id: "", policy_type: "", policy_number: "", premium_amount: "", start_date: "", end_date: "", status: "active" });
      onCreated();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to add policy");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-xl border border-border shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-lg font-semibold">Add New Policy</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg"><X className="size-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Client <span className="text-destructive">*</span></label>
              <select name="client_id" value={formData.client_id} onChange={handleChange} required
                className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select client</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Insurance Company</label>
              <select name="company_id" value={formData.company_id} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select company</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.company_name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Policy Type</label>
              <select name="policy_type" value={formData.policy_type} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Select type</option>
                {policyTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Policy Number</label>
              <input name="policy_number" value={formData.policy_number} onChange={handleChange} placeholder="e.g. POL-1001"
                className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Premium Amount (₹)</label>
              <input name="premium_amount" type="number" value={formData.premium_amount} onChange={handleChange} placeholder="0.00"
                className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Status</label>
              <select name="status" value={formData.status} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Start Date</label>
              <input name="start_date" type="date" value={formData.start_date} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">End Date</label>
              <input name="end_date" type="date" value={formData.end_date} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2.5 bg-card border border-border rounded-lg hover:bg-accent transition-colors">Cancel</button>
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
              {saving ? <Loader2 className="size-4 animate-spin" /> : null}
              {saving ? "Adding..." : "Add Policy"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
