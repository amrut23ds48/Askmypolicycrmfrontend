import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { createClaim, type CreateClaimData } from "../../lib/services/claims";
import { getPolicies, type Policy } from "../../lib/services/policies";
import { getClients, type Client } from "../../lib/services/clients";
import { toast } from "sonner";

interface AddClaimDialogProps {
  advisorId: string;
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function AddClaimDialog({ advisorId, open, onClose, onCreated }: AddClaimDialogProps) {
  const [saving, setSaving] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [filteredPolicies, setFilteredPolicies] = useState<Policy[]>([]);
  const [formData, setFormData] = useState({
    client_id: "",
    policy_id: "",
    claim_amount: "",
    note: "",
  });

  useEffect(() => {
    if (open) {
      getClients(advisorId).then(setClients).catch(console.error);
      getPolicies(advisorId).then(setPolicies).catch(console.error);
    }
  }, [open, advisorId]);

  useEffect(() => {
    if (formData.client_id) {
      setFilteredPolicies(policies.filter(p => p.client_id === formData.client_id));
    } else {
      setFilteredPolicies(policies);
    }
  }, [formData.client_id, policies]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.client_id || !formData.policy_id) {
      toast.error("Client and Policy are required");
      return;
    }

    setSaving(true);
    try {
      const data: CreateClaimData = {
        client_id: formData.client_id,
        policy_id: formData.policy_id,
        advisor_id: advisorId,
        claim_amount: formData.claim_amount ? parseFloat(formData.claim_amount) : undefined,
        note: formData.note || undefined,
        status: "submitted",
      };

      await createClaim(data);
      toast.success("Claim filed successfully");
      setFormData({ client_id: "", policy_id: "", claim_amount: "", note: "" });
      onCreated();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to file claim");
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card rounded-xl border border-border shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto m-4">
        <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-lg font-semibold">File New Claim</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg"><X className="size-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Client <span className="text-destructive">*</span></label>
            <select name="client_id" value={formData.client_id} onChange={handleChange} required
              className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Select client</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Policy <span className="text-destructive">*</span></label>
            <select name="policy_id" value={formData.policy_id} onChange={handleChange} required
              className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">Select policy</option>
              {filteredPolicies.map(p => (
                <option key={p.id} value={p.id}>
                  {p.policy_number || p.id.slice(0, 8)} — {p.policy_type || "Policy"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Claim Amount (₹)</label>
            <input name="claim_amount" type="number" value={formData.claim_amount} onChange={handleChange} placeholder="0.00"
              className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Notes / Description</label>
            <textarea name="note" value={formData.note} onChange={handleChange} placeholder="Describe the claim..." rows={3}
              className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2.5 bg-card border border-border rounded-lg hover:bg-accent transition-colors">Cancel</button>
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
              {saving ? <Loader2 className="size-4 animate-spin" /> : null}
              {saving ? "Filing..." : "File Claim"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
