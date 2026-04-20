import { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";
import { createTask, type CreateTaskData } from "../../lib/services/tasks";
import { getClients, type Client } from "../../lib/services/clients";
import { toast } from "sonner";

interface AddTaskDialogProps {
  advisorId: string;
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function AddTaskDialog({ advisorId, open, onClose, onCreated }: AddTaskDialogProps) {
  const [saving, setSaving] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    client_id: "",
    priority: "medium",
    due_date: "",
  });

  useEffect(() => {
    if (open) {
      getClients(advisorId).then(setClients).catch(console.error);
    }
  }, [open, advisorId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) { toast.error("Task title is required"); return; }

    setSaving(true);
    try {
      const data: CreateTaskData = {
        advisor_id: advisorId,
        title: formData.title,
        description: formData.description || undefined,
        client_id: formData.client_id || undefined,
        priority: formData.priority,
        due_date: formData.due_date || undefined,
        status: "pending",
      };

      await createTask(data);
      toast.success("Task created successfully");
      setFormData({ title: "", description: "", client_id: "", priority: "medium", due_date: "" });
      onCreated();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to create task");
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
          <h2 className="text-lg font-semibold">Create New Task</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg"><X className="size-5" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Title <span className="text-destructive">*</span></label>
            <input name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Follow-up call with client" required
              className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Description</label>
            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Task details..." rows={3}
              className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Client (Optional)</label>
              <select name="client_id" value={formData.client_id} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">No client</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.full_name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Priority</label>
              <select name="priority" value={formData.priority} onChange={handleChange}
                className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Due Date</label>
            <input name="due_date" type="date" value={formData.due_date} onChange={handleChange}
              className="w-full px-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2.5 bg-card border border-border rounded-lg hover:bg-accent transition-colors">Cancel</button>
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
              {saving ? <Loader2 className="size-4 animate-spin" /> : null}
              {saving ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
