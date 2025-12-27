import { 
  Users, 
  Briefcase, 
  Calendar, 
  FileText, 
  Building2,
  UserPlus,
  Bell, 
  BarChart3, 
  Settings,
  Home,
  ChevronLeft,
  Clock,
  ChevronRight,
  FileCheck2
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import mtefopLogo from "@/assets/mtefop-logo.png";

const menuItems = [
  { title: "Tableau de bord", url: "/", icon: Home },
  { title: "Agents", url: "/agentsnouveau", icon: UserPlus },
  { title: "Carrières", url: "/carrieres", icon: Briefcase },
  { title: "Congés", url: "/conges", icon: Calendar },

  // ✅ NOUVEAU : Attestations (Admin)
  { title: "Attestations", url: "/admin/attestations", icon: FileCheck2 },

  //{ title: "Rapports", url: "/statistiques", icon: BarChart3 },
  { title: "Paramètres", url: "/parametres", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") return currentPath === "/";
    return currentPath.startsWith(path);
  };

  const getNavClasses = (path: string) => {
    if (isActive(path)) {
      return "bg-gradient-primary text-primary-foreground font-medium shadow-soft";
    }
    return "hover:bg-secondary/60 text-foreground/80 hover:text-foreground transition-colors";
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-[hsl(var(--sidebar-background))] border-r border-border">
        {/* Header avec logo */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <img
              src={mtefopLogo}
              alt="MTEFOP"
              className={`transition-all duration-200 ${
                isCollapsed ? "h-8 w-8" : "h-10 w-auto"
              }`}
            />
            {!isCollapsed && (
              <div>
                <h1 className="font-bold text-sm text-foreground">MTEFOP</h1>
                <p className="text-xs text-muted-foreground">Gestion des agents</p>
              </div>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Navigation principale
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-200 ${getNavClasses(
                        item.url
                      )}`}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      {!isCollapsed && (
                        <span className="font-medium">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
