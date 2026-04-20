import { useState, useEffect } from "react";
import { Bell, Check, CheckCheck, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "../../lib/auth-context";
import { getAlerts, markAsRead, markAllAsRead, deleteAlert, type Alert } from "../../lib/services/alerts";
import { toast } from "sonner";

export function Notifications() {
  const { advisor } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    if (advisor?.id) {
      fetchAlerts();
    }
  }, [advisor?.id, filter]);

  const fetchAlerts = async () => {
    if (!advisor) return;
    setLoading(true);
    try {
      const data = await getAlerts(advisor.id, filter === "unread");
      setAlerts(data);
    } catch (err) {
      console.error("Error fetching alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (alertId: string) => {
    try {
      await markAsRead(alertId);
      setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, is_read: true } : a));
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleMarkAllRead = async () => {
    if (!advisor) return;
    try {
      await markAllAsRead(advisor.id);
      setAlerts(prev => prev.map(a => ({ ...a, is_read: true })));
      toast.success("All notifications marked as read");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (alertId: string) => {
    try {
      await deleteAlert(alertId);
      setAlerts(prev => prev.filter(a => a.id !== alertId));
      toast.success("Notification deleted");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const getAlertTypeColor = (type: string | null) => {
    switch (type) {
      case "urgent": return "border-l-red-500 bg-red-50 dark:bg-red-950/20";
      case "warning": return "border-l-orange-500 bg-orange-50 dark:bg-orange-950/20";
      case "info": return "border-l-blue-500 bg-blue-50 dark:bg-blue-950/20";
      case "success": return "border-l-green-500 bg-green-50 dark:bg-green-950/20";
      default: return "border-l-gray-500 bg-gray-50 dark:bg-gray-950/20";
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Notifications</h2>
          <p className="text-sm text-muted-foreground">
            {alerts.filter(a => !a.is_read).length} unread notifications
          </p>
        </div>
        <div className="flex gap-2">
          <div className="flex bg-muted rounded-lg p-1">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                filter === "all" ? "bg-card shadow-sm" : "hover:bg-card/50"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                filter === "unread" ? "bg-card shadow-sm" : "hover:bg-card/50"
              }`}
            >
              Unread
            </button>
          </div>
          <button
            onClick={handleMarkAllRead}
            className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2 text-sm"
          >
            <CheckCheck className="size-4" />
            Mark all read
          </button>
        </div>
      </div>

      {alerts.length === 0 ? (
        <div className="bg-card rounded-xl border border-border p-12 text-center">
          <Bell className="size-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No notifications</h3>
          <p className="text-sm text-muted-foreground">
            {filter === "unread" ? "You're all caught up!" : "No notifications yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border-l-4 border border-border transition-all ${
                getAlertTypeColor(alert.alert_type)
              } ${!alert.is_read ? "ring-1 ring-primary/20" : "opacity-75"}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {!alert.is_read && (
                      <span className="size-2 bg-primary rounded-full flex-shrink-0" />
                    )}
                    <span className="text-xs font-medium uppercase text-muted-foreground">
                      {alert.alert_type || "notification"}
                    </span>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(alert.created_at)}
                    </span>
                  </div>
                  <p className="text-sm">{alert.message}</p>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  {!alert.is_read && (
                    <button
                      onClick={() => handleMarkAsRead(alert.id)}
                      className="p-1.5 rounded-lg hover:bg-white/50 transition-colors"
                      title="Mark as read"
                    >
                      <Check className="size-4 text-muted-foreground" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(alert.id)}
                    className="p-1.5 rounded-lg hover:bg-white/50 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="size-4 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
