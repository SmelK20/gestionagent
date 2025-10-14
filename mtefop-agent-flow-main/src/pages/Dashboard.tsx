import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  Briefcase, 
  Calendar, 
  FileText, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Building2,
  UserPlus
} from "lucide-react";

export default function Dashboard() {
  // Données simulées
  const stats = {
    totalAgents: 847,
    activeAgents: 792,
    totalMissions: 156,
    completedMissions: 124,
    pendingLeaves: 23,
    documentsToReview: 12,
    directions: 8,
    services: 24,
    besoinsActifs: 15,
    demandesEnCours: 7
  };

  const recentActivities = [
    {
      id: 1,
      type: "agent",
      message: "Nouvel agent ajouté: Marie Dupont",
      time: "Il y a 2 heures",
      status: "success"
    },
    {
      id: 2,
      type: "mission",
      message: "Mission 'Audit Formation' assignée à Jean Martin",
      time: "Il y a 4 heures",
      status: "info"
    },
    {
      id: 3,
      type: "leave",
      message: "Demande de congé en attente de validation",
      time: "Il y a 6 heures",
      status: "warning"
    },
    {
      id: 4,
      type: "document",
      message: "Contrat de Sophie Bernard à renouveler",
      time: "Hier",
      status: "error"
    },
    {
      id: 5,
      type: "admin",
      message: "Nouveau service créé dans Direction RH",
      time: "Il y a 8 heures",
      status: "success"
    },
    {
      id: 6,
      type: "besoin",
      message: "Besoin urgent: 2 Agents Administratifs",
      time: "Il y a 1 jour",
      status: "warning"
    }
  ];

  const missions = [
    {
      id: 1,
      title: "Audit Formation Professionnelle",
      assignee: "Jean Martin",
      progress: 75,
      deadline: "2024-01-15",
      priority: "haute"
    },
    {
      id: 2,
      title: "Révision Procédures RH",
      assignee: "Marie Dupont",
      progress: 45,
      deadline: "2024-01-20",
      priority: "moyenne"
    },
    {
      id: 3,
      title: "Formation Nouveaux Agents",
      assignee: "Pierre Durand",
      progress: 90,
      deadline: "2024-01-10",
      priority: "basse"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "haute": return "destructive";
      case "moyenne": return "warning";
      case "basse": return "success";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success": return <CheckCircle className="h-4 w-4 text-success" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "error": return <AlertTriangle className="h-4 w-4 text-destructive" />;
      default: return <Clock className="h-4 w-4 text-info" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Tableau de bord</h1>
        <p className="text-muted-foreground mt-2">
          Vue d'ensemble de la gestion des agents - MTEFOP
        </p>
      </div>

      {/* Métriques principales */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium truncate">Total Agents</CardTitle>
            <Users className="h-4 w-4 text-institutional-blue flex-shrink-0" />
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-xl font-bold">{stats.totalAgents}</div>
            <p className="text-xs text-muted-foreground truncate">
              <span className="text-success">+12</span> ce mois
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium truncate">Agents Actifs</CardTitle>
            <Users className="h-4 w-4 text-institutional-green flex-shrink-0" />
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-xl font-bold">{stats.activeAgents}</div>
            <p className="text-xs text-muted-foreground truncate">
              {((stats.activeAgents / stats.totalAgents) * 100).toFixed(0)}% actifs
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium truncate">Missions</CardTitle>
            <Briefcase className="h-4 w-4 text-warning flex-shrink-0" />
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-lg font-bold">{stats.completedMissions}/{stats.totalMissions}</div>
            <p className="text-xs text-muted-foreground truncate">
              {((stats.completedMissions / stats.totalMissions) * 100).toFixed(0)}% faites
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium truncate">Directions</CardTitle>
            <Building2 className="h-4 w-4 text-institutional-blue flex-shrink-0" />
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-xl font-bold">{stats.directions}</div>
            <p className="text-xs text-muted-foreground truncate">
              {stats.services} services
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium truncate">Besoins</CardTitle>
            <UserPlus className="h-4 w-4 text-warning flex-shrink-0" />
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-xl font-bold">{stats.besoinsActifs}</div>
            <p className="text-xs text-muted-foreground truncate">
              {stats.demandesEnCours} demandes
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium truncate">Congés</CardTitle>
            <Calendar className="h-4 w-4 text-info flex-shrink-0" />
          </CardHeader>
          <CardContent className="pb-2">
            <div className="text-xl font-bold">{stats.pendingLeaves}</div>
            <p className="text-xs text-muted-foreground truncate">
              En attente
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Missions en cours */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Missions en cours
            </CardTitle>
            <CardDescription>Suivi des missions prioritaires</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {missions.map((mission) => (
              <div key={mission.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{mission.title}</h4>
                  <Badge variant={getPriorityColor(mission.priority) as any} className="text-xs">
                    {mission.priority}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Assigné à: {mission.assignee} • Échéance: {mission.deadline}
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Progression</span>
                    <span>{mission.progress}%</span>
                  </div>
                  <Progress value={mission.progress} className="h-2" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Activités récentes */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Activités récentes
            </CardTitle>
            <CardDescription>Dernières actions dans le système</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                {getStatusIcon(activity.status)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {activity.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
          <CardDescription>Accès direct aux tâches fréquentes</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <div className="flex items-center space-x-3 p-3 bg-gradient-primary rounded-lg cursor-pointer hover:scale-105 transition-transform">
            <Users className="h-6 w-6 text-primary-foreground flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-primary-foreground text-sm truncate">Ajouter agent</h3>
              <p className="text-xs text-primary-foreground/80 truncate">Recrutement</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gradient-success rounded-lg cursor-pointer hover:scale-105 transition-transform">
            <Briefcase className="h-6 w-6 text-accent-foreground flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-accent-foreground text-sm truncate">Créer mission</h3>
              <p className="text-xs text-accent-foreground/80 truncate">Nouvelle tâche</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gradient-secondary rounded-lg cursor-pointer hover:scale-105 transition-transform">
            <FileText className="h-6 w-6 text-secondary-foreground flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-secondary-foreground text-sm truncate">Documents</h3>
              <p className="text-xs text-secondary-foreground/80 truncate">Contrats</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gradient-primary rounded-lg cursor-pointer hover:scale-105 transition-transform">
            <Building2 className="h-6 w-6 text-primary-foreground flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-primary-foreground text-sm truncate">Administration</h3>
              <p className="text-xs text-primary-foreground/80 truncate">Structure</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gradient-success rounded-lg cursor-pointer hover:scale-105 transition-transform">
            <UserPlus className="h-6 w-6 text-accent-foreground flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-accent-foreground text-sm truncate">Besoins</h3>
              <p className="text-xs text-accent-foreground/80 truncate">Personnel</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}