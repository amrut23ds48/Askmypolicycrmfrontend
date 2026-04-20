import { useState, useEffect } from "react";
import { Plus, Search, CheckCircle2, Clock, AlertTriangle, Calendar, Loader2, Circle, Trash2 } from "lucide-react";
import { useAuth } from "../../lib/auth-context";
import { getTasks, toggleTaskStatus, deleteTask, getTaskStats, type Task, type TaskFilters } from "../../lib/services/tasks";
import { AddTaskDialog } from "../components/add-task-dialog";
import { toast } from "sonner";

export function Tasks() {
  const { advisor } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0, overdue: 0 });
  const [viewMode, setViewMode] = useState<"list" | "board">("list");

  useEffect(() => {
    if (advisor?.id) fetchData();
  }, [advisor?.id, filterPriority, filterStatus]);

  const fetchData = async () => {
    if (!advisor) return;
    setLoading(true);
    try {
      const filters: TaskFilters = {};
      if (filterPriority !== "all") filters.priority = filterPriority;
      if (filterStatus !== "all") filters.status = filterStatus;

      const [tasksData, statsData] = await Promise.all([
        getTasks(advisor.id, filters),
        getTaskStats(advisor.id),
      ]);
      setTasks(tasksData);
      setStats(statsData);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (task: Task) => {
    try {
      await toggleTaskStatus(task.id, task.status || "pending");
      toast.success(task.status === "completed" ? "Task reopened" : "Task completed");
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      toast.success("Task deleted");
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const filteredTasks = searchQuery
    ? tasks.filter(t =>
        t.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.client_name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : tasks;

  const getPriorityConfig = (priority: string | null) => {
    switch (priority?.toLowerCase()) {
      case "high": return { color: "text-red-600 bg-red-50 dark:bg-red-950/20", dot: "bg-red-500" };
      case "medium": return { color: "text-orange-600 bg-orange-50 dark:bg-orange-950/20", dot: "bg-orange-500" };
      case "low": return { color: "text-blue-600 bg-blue-50 dark:bg-blue-950/20", dot: "bg-blue-500" };
      default: return { color: "text-gray-600 bg-gray-50 dark:bg-gray-950/20", dot: "bg-gray-500" };
    }
  };

  const isOverdue = (dueDate: string | null, status: string | null) => {
    if (status === "completed" || !dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const formatDueDate = (dueDate: string | null) => {
    if (!dueDate) return "No due date";
    const date = new Date(dueDate);
    const now = new Date();
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)}d`;
    if (diffDays === 0) return "Due today";
    if (diffDays === 1) return "Due tomorrow";
    if (diffDays <= 7) return `Due in ${diffDays}d`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="ml-2 text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-card rounded-xl p-5 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Total Tasks</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Pending</p>
          <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <p className="text-sm text-muted-foreground mb-1">In Progress</p>
          <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Completed</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <p className="text-sm text-muted-foreground mb-1">Overdue</p>
          <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="all">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2.5 bg-card border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button
            onClick={() => setShowAddDialog(true)}
            className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            <Plus className="size-4" />
            Create Task
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="px-6 py-12 text-center text-muted-foreground">
            {tasks.length === 0 ? "No tasks yet. Click 'Create Task' to get started." : "No tasks match your filters."}
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredTasks.map((task) => {
              const priorityConfig = getPriorityConfig(task.priority);
              const overdue = isOverdue(task.due_date, task.status);
              const completed = task.status === "completed";

              return (
                <div key={task.id} className={`p-5 hover:bg-muted/30 transition-colors ${completed ? "opacity-60" : ""}`}>
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => handleToggle(task)}
                      className="flex-shrink-0 mt-0.5"
                      title={completed ? "Mark as pending" : "Mark as completed"}
                    >
                      {completed ? (
                        <CheckCircle2 className="size-5 text-green-600" />
                      ) : (
                        <Circle className="size-5 text-muted-foreground hover:text-primary transition-colors" />
                      )}
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className={`font-medium ${completed ? "line-through text-muted-foreground" : ""}`}>
                          {task.title}
                        </h4>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priorityConfig.color}`}>
                          {task.priority?.charAt(0).toUpperCase() + (task.priority?.slice(1) || '')}
                        </span>
                      </div>
                      {task.description && (
                        <p className="text-sm text-muted-foreground mb-2">{task.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        {task.client_name && (
                          <span className="flex items-center gap-1">
                            👤 {task.client_name}
                          </span>
                        )}
                        <span className={`flex items-center gap-1 ${overdue ? "text-red-600 font-medium" : ""}`}>
                          <Calendar className="size-3.5" />
                          {formatDueDate(task.due_date)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors flex-shrink-0"
                      title="Delete task"
                    >
                      <Trash2 className="size-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Task Dialog */}
      {advisor && (
        <AddTaskDialog
          advisorId={advisor.id}
          open={showAddDialog}
          onClose={() => setShowAddDialog(false)}
          onCreated={fetchData}
        />
      )}
    </div>
  );
}
