import { useState, useEffect } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router";
import { supabase } from "../../lib/supabase";

import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  ClipboardList, 
  CheckSquare, 
  BarChart3, 
  Bell, 
  Settings, 
  Menu, 
  X,
  Search,
  Moon,
  Sun,
  ChevronDown,
  LogOut
} from "lucide-react";

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState<{ full_name: string; role_name?: string } | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      const { data: advisor } = await supabase
        .from("advisors")
        .select("full_name, roles(name)")
        .eq("id", authUser.id)
        .single();
      
      if (advisor) {
        setUser({
          full_name: advisor.full_name,
          role_name: (advisor.roles as any)?.name || "Financial Advisor"
        });
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Clients", path: "/dashboard/clients" },
    { icon: FileText, label: "Policies", path: "/dashboard/policies" },
    { icon: ClipboardList, label: "Claims", path: "/dashboard/claims" },
    { icon: CheckSquare, label: "Tasks", path: "/dashboard/tasks" },
    { icon: BarChart3, label: "Reports", path: "/dashboard/reports" },
    { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          {sidebarOpen ? (
            <img src="/images/logo.png" alt="Ask My Policy" className="h-10" />
          ) : (
            <img src="/images/logo.png" alt="Ask My Policy" className="h-8 mx-auto" />
          )}
          {sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground"
            >
              <X className="size-5" />
            </button>
          )}
        </div>

        {/* Toggle Button when Collapsed */}
        {!sidebarOpen && (
          <div className="px-3 py-2">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full p-2 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground"
            >
              <Menu className="size-5 mx-auto" />
            </button>
          </div>
        )}

        {/* Search */}
        <div className="p-4">
          {sidebarOpen ? (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 bg-input-background rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">/</kbd>
            </div>
          ) : (
            <button className="w-full p-2 rounded-lg hover:bg-sidebar-accent">
              <Search className="size-5 mx-auto text-sidebar-foreground" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <Icon className="size-5 flex-shrink-0" />
                {sidebarOpen && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-sidebar-border space-y-1">
          <Link
            to="/notifications"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors`}
          >
            <Bell className="size-5 flex-shrink-0" />
            {sidebarOpen && <span>Notifications</span>}
          </Link>
          <Link
            to="/dashboard/settings"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              isActive("/dashboard/settings")
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent"
            }`}
          >
            <Settings className="size-5 flex-shrink-0" />
            {sidebarOpen && <span>Settings</span>}
          </Link>
        </div>

        {/* Pro Plan Notice */}
        {sidebarOpen && (
          <div className="m-3 p-4 bg-muted rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-2">
              <div className="size-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-sm text-primary-foreground font-semibold">AMP</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Ask My Policy</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Your Pro plan will end in <strong>4 days</strong>
            </p>
            <button className="w-full py-2 px-3 bg-primary text-primary-foreground rounded-lg text-sm hover:opacity-90 transition-opacity">
              Select plan →
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold text-foreground">
              {navItems.find(item => isActive(item.path))?.label || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              {darkMode ? (
                <Sun className="size-5 text-foreground" />
              ) : (
                <Moon className="size-5 text-foreground" />
              )}
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
              <Bell className="size-5 text-foreground" />
              <span className="absolute top-1 right-1 size-2 bg-destructive rounded-full"></span>
            </button>

            {/* Profile */}
            <div className="flex items-center gap-2 pl-3 border-l border-border">
              <div className="size-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-sm text-primary-foreground font-semibold">
                  {user?.full_name ? user.full_name.split(" ").map(n => n[0]).join("").toUpperCase() : "JD"}
                </span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">{user?.full_name || "John Doe"}</p>
                <p className="text-xs text-muted-foreground">{user?.role_name || "Financial Advisor"}</p>
              </div>
              <button className="p-1 rounded hover:bg-muted">
                <ChevronDown className="size-4 text-muted-foreground" />
              </button>
            </div>

            <button 
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-destructive"
            >
              <LogOut className="size-5" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
}