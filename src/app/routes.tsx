import { createBrowserRouter } from "react-router";
import { Layout } from "./components/layout";
import { Dashboard } from "./pages/dashboard";
import { ClientManagement } from "./pages/client-management";
import { ClientProfile } from "./pages/client-profile";
import { PolicyManagement } from "./pages/policy-management";
import { ClaimsTracker } from "./pages/claims-tracker";
import { Tasks } from "./pages/tasks";
import { Reports } from "./pages/reports";
import { Settings } from "./pages/settings";
import { Login } from "./pages/login";
import { Signup } from "./pages/signup";
import { Landing } from "./pages/landing";
import { NotFound } from "./pages/not-found";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/signup",
    Component: Signup,
  },
  {
    path: "/dashboard",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "clients", Component: ClientManagement },
      { path: "clients/:id", Component: ClientProfile },
      { path: "policies", Component: PolicyManagement },
      { path: "claims", Component: ClaimsTracker },
      { path: "tasks", Component: Tasks },
      { path: "reports", Component: Reports },
      { path: "settings", Component: Settings },
      { path: "*", Component: NotFound },
    ],
  },
]);