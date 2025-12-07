import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "@/components/Layout";

// Pages Admin
import Dashboard from "./pages/Dashboard";
import Agents from "./pages/Agents";
import Missions from "./pages/Missions";
import Conges from "./pages/Conges";
import Documents from "./pages/Documents";
import Administration from "./pages/Administration";
import Besoins from "./pages/Besoins";
import Notifications from "./pages/Notifications";
import Statistiques from "./pages/Statistiques";
import Parametres from "./pages/Parametres";
import NotFound from "./pages/NotFound";
import Agentsnouveau from "@/pages/Agentsnouveau";
import Presences from "./pages/Presence"; // ✅ ajouté
import Carrieres from "./pages/carrieres";

// Pages Agent
import AgentLayout from "./pages/AgentEspace/AgentLayout";
import AgentDashboard from "./pages/AgentEspace/AgentDashbord";
import AgentProfil from "./pages/AgentEspace/AgentProfil";
import AgentConger from "./pages/AgentEspace/Conger";
import AgentPresence from "./pages/AgentEspace/AgentPresence"; // ✅ ajouté


// Login (Admin + Agent)
import Login from "./pages/Login";

const queryClient = new QueryClient();

// ✅ Route privée admin
const PrivateAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const role = localStorage.getItem("role");
  if (role !== "admin") return <Navigate to="/login" replace />;
  return <>{children}</>;
};

// ✅ Route privée agent
const PrivateAgentRoute = ({ children }: { children: React.ReactNode }) => {
  const role = localStorage.getItem("role");
  if (role !== "agent") return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* 🔐 Login universel */}
          <Route path="/login" element={<Login />} />

          {/* 🌐 Espace AGENT */}
          <Route
            path="/agent/espace/*"
            element={
              <PrivateAgentRoute>
                <AgentLayout />
              </PrivateAgentRoute>
            }
          >
            <Route index element={<AgentDashboard />} />
            <Route path="profil" element={<AgentProfil />} />
            <Route path="conger" element={<AgentConger />} />
            <Route path="presence" element={<AgentPresence />} /> {/* ✅ ajouté */}
          </Route>

          {/* 🧭 Espace ADMIN */}
          <Route
            path="/*"
            element={
              <PrivateAdminRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/agents" element={<Agents />} />
                    <Route path="/missions" element={<Missions />} />
                    <Route path="/conges" element={<Conges />} />
                    <Route path="/documents" element={<Documents />} />
                    <Route path="/administration" element={<Administration />} />
                    <Route path="/besoins" element={<Besoins />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/statistiques" element={<Statistiques />} />
                    <Route path="/parametres" element={<Parametres />} />
                    <Route path="/agentsnouveau" element={<Agentsnouveau />} />
                    <Route path="/presences" element={<Presences />} /> {/* ✅ ajouté */}
                    <Route path="/carrieres" element={<Carrieres />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
              </PrivateAdminRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
