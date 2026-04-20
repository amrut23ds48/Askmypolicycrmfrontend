import { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { createClient, type CreateClientData } from "../../lib/services/clients";
import { toast } from "sonner";

interface AddClientDialogProps {
  advisorId: string;
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function AddClientDialog({ advisorId, open, onClose, onCreated }: AddClientDialogProps) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    mobile_number: "",
    city: "",
    state: "",
    address: "",
    occupation: "",
    dob: "",
    risk_profile: "medium",
    note: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name.trim()) {
      toast.error("Client name is required");
      return;
    }

    setSaving(true);
    try {
      const clientData: CreateClientData = {
        advisor_id: advisorId,
        full_name: formData.full_name,
        email: formData.email || undefined,
        mobile_number: formData.mobile_number || undefined,
        city: formData.city || undefined,
        state: formData.state || undefined,
        address: formData.address || undefined,
        occupation: formData.occupation || undefined,
        dob: formData.dob || undefined,
        risk_profile: formData.risk_profile || undefined,
        note: formData.note || undefined,
        status: "active",
      };

      await createClient(clientData);
      toast.success("Client added successfully");
      setFormData({ full_name: "", email: "", mobile_number: "", city: "", state: "", address: "", occupation: "", dob: "", risk_profile: "medium", note: "" });
      onCreated();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to add client");
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
          <h2 className="text-lg font-semibold">Add New Client</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Full Name <span className="text-destructive">*</span></label>
              <input name="full_name" type="text" value={formData.full_name} onChange={handleChange} placeholder="Enter full name" required
                className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="email@example.com"
                className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Mobile Number</label>
              <input name="mobile_number" type="tel" value={formData.mobile_number} onChange={handleChange} placeholder="+91 98765 43210"
                className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Occupation</label>
              <input name="occupation" type="text" value={formData.occupation} onChange={handleChange} placeholder="e.g. Software Engineer"
                className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Date of Birth</label>
              <input name="dob" type="date" value={formData.dob} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Risk Profile</label>
              <select name="risk_profile" value={formData.risk_profile} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">City</label>
              <input name="city" type="text" value={formData.city} onChange={handleChange} placeholder="City"
                className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">State</label>
              <input name="state" type="text" value={formData.state} onChange={handleChange} placeholder="State"
                className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Address</label>
            <input name="address" type="text" value={formData.address} onChange={handleChange} placeholder="Full address"
              className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Notes</label>
            <textarea name="note" value={formData.note} onChange={handleChange} placeholder="Any additional notes..." rows={3}
              className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2.5 bg-card border border-border rounded-lg hover:bg-accent transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
              {saving ? <Loader2 className="size-4 animate-spin" /> : null}
              {saving ? "Adding..." : "Add Client"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
