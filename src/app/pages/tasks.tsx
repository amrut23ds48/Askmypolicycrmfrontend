import { useState } from "react";
import { Plus, Search, Filter, Calendar as CalendarIcon, CheckSquare, Square, Clock } from "lucide-react";

const tasks = [
  {
    id: 1,
    title: "Follow-up call with Sarah Mitchell",
    client: "Sarah Mitchell",
    priority: "High",
    dueDate: "2026-03-15",
    status: "Pending",
    category: "Follow-up",
    description: "Discuss property insurance options"
  },
  {
    id: 2,
    title: "Policy renewal reminder - David Chen",
    client: "David Chen",
    priority: "Medium",
    dueDate: "2026-03-18",
    status: "Pending",
    category: "Renewal",
    description: "Life insurance policy expiring in 30 days"
  },
  {
    id: 3,
    title: "Document verification for Emma Wilson",
    client: "Emma Wilson",
    priority: "High",
    dueDate: "2026-03-14",
    status: "In Progress",
    category: "Documentation",
    description: "Verify submitted claim documents"
  },
  {
    id: 4,
    title: "Schedule meeting with Michael Brown",
    client: "Michael Brown",
    priority: "Low",
    dueDate: "2026-03-20",
    status: "Pending",
    category: "Meeting",
    description: "Investment portfolio review"
  },
  {
    id: 5,
    title: "Send policy documents to Olivia Martinez",
    client: "Olivia Martinez",
    priority: "Medium",
    dueDate: "2026-03-16",
    status: "Completed",
    category: "Documentation",
    description: "Email new auto insurance documents"
  },
  {
    id: 6,
    title: "Claims follow-up - James Taylor",
    client: "James Taylor",
    priority: "High",
    dueDate: "2026-03-14",
    status: "In Progress",
    category: "Claims",
    description: "Update on health insurance claim status"
  },
];

export function Tasks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [view, setView] = useState<"list" | "calendar">("list");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "text-red-600 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900";
      case "Medium": return "text-orange-600 bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-900";
      case "Low": return "text-blue-600 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900";
      default: return "text-gray-600 bg-gray-50 dark:bg-gray-950/20 border-gray-200 dark:border-gray-900";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "text-green-600 bg-green-50 dark:bg-green-950/20";
      case "In Progress": return "text-orange-600 bg-orange-50 dark:bg-orange-950/20";
      case "Pending": return "text-gray-600 bg-gray-50 dark:bg-gray-950/20";
      default: return "text-gray-600 bg-gray-50 dark:bg-gray-950/20";
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && tasks.find(t => t.dueDate === dueDate)?.status !== "Completed";
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
              placeholder="Search tasks by title or client..."
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
          <div className="flex bg-muted rounded-lg p-1">
            <button 
              onClick={() => setView("list")}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                view === "list" ? "bg-card shadow-sm" : "hover:bg-card/50"
              }`}
            >
              List
            </button>
            <button 
              onClick={() => setView("calendar")}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                view === "calendar" ? "bg-card shadow-sm" : "hover:bg-card/50"
              }`}
            >
              Calendar
            </button>
          </div>
          <button className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
            <Plus className="size-4" />
            Create Task
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-950/20 rounded-lg">
              <CheckSquare className="size-5 text-blue-600" />
            </div>
            <p className="text-sm text-muted-foreground">Total Tasks</p>
          </div>
          <p className="text-2xl font-semibold">{tasks.length}</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 dark:bg-orange-950/20 rounded-lg">
              <Clock className="size-5 text-orange-600" />
            </div>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </div>
          <p className="text-2xl font-semibold">{tasks.filter(t => t.status === "In Progress").length}</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 dark:bg-green-950/20 rounded-lg">
              <CheckSquare className="size-5 text-green-600" />
            </div>
            <p className="text-sm text-muted-foreground">Completed</p>
          </div>
          <p className="text-2xl font-semibold">{tasks.filter(t => t.status === "Completed").length}</p>
        </div>
        <div className="bg-card rounded-xl p-5 border border-border">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 dark:bg-red-950/20 rounded-lg">
              <Clock className="size-5 text-red-600" />
            </div>
            <p className="text-sm text-muted-foreground">Overdue</p>
          </div>
          <p className="text-2xl font-semibold">
            {tasks.filter(t => isOverdue(t.dueDate)).length}
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-card rounded-lg border border-border">
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground">Priority:</label>
          <select 
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-1.5 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
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
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <div className="ml-auto text-sm text-muted-foreground">
          Showing {tasks.length} tasks
        </div>
      </div>

      {/* Tasks List */}
      {view === "list" && (
        <div className="space-y-3">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className={`bg-card rounded-xl p-5 border-l-4 border-r border-t border-b transition-all hover:shadow-lg ${
                task.status === "Completed" 
                  ? "border-l-green-500 opacity-60"
                  : isOverdue(task.dueDate)
                  ? "border-l-red-500"
                  : task.priority === "High"
                  ? "border-l-red-500"
                  : task.priority === "Medium"
                  ? "border-l-orange-500"
                  : "border-l-blue-500"
              }`}
            >
              <div className="flex items-start gap-4">
                <button 
                  className="mt-1 flex-shrink-0"
                  onClick={() => {}}
                >
                  {task.status === "Completed" ? (
                    <CheckSquare className="size-6 text-green-600" />
                  ) : (
                    <Square className="size-6 text-muted-foreground hover:text-primary transition-colors" />
                  )}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <h3 className={`font-semibold ${task.status === "Completed" ? "line-through text-muted-foreground" : ""}`}>
                      {task.title}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-3">{task.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <CalendarIcon className="size-4" />
                      <span>Due: {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      {isOverdue(task.dueDate) && (
                        <span className="text-xs text-red-600 font-medium ml-1">(Overdue)</span>
                      )}
                    </div>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">Client: <span className="font-medium text-foreground">{task.client}</span></span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-xs px-2 py-1 bg-muted rounded-md">{task.category}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Calendar View */}
      {view === "calendar" && (
        <div className="bg-card rounded-xl p-6 border border-border">
          <div className="text-center py-12">
            <CalendarIcon className="size-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Calendar View</h3>
            <p className="text-sm text-muted-foreground">
              Calendar integration would display tasks in a monthly or weekly view
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
