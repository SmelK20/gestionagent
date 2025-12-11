import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { Home, User, Calendar,Clock , Bell, FileText } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import mtefopLogo from "@/assets/mtefop-logo.png";

const agentMenu = [
  { title: "Tableau de bord", url: "/agent/espace", icon: Home },
  { title: "Mon profil", url: "/agent/espace/profil", icon: User },
  { title: "Mes congés", url: "/agent/espace/conger", icon: Calendar },
  //{ title: "Mes présences", url: "/agent/espace/presence", icon: Clock }, // ✅ nouvelle ligne
  // Tu peux ajouter Documents et Notifications plus tard si tu crées les pages
];


export function AgentSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";

  const getNavClasses = (path: string) => {
    if (currentPath === path) {
      return "bg-gradient-primary text-primary-foreground font-medium shadow-soft";
    }
    return "hover:bg-secondary/60 text-foreground/80 hover:text-foreground transition-colors";
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-card border-r border-border">
        {/* Logo */}
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
                <p className="text-xs text-muted-foreground">Espace Agent</p>
              </div>
            )}
          </div>
        </div>

        {/* Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {agentMenu.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={`flex items-center space-x-2 p-2 rounded-lg transition-all duration-200 ${getNavClasses(
                        item.url
                      )}`}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
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
