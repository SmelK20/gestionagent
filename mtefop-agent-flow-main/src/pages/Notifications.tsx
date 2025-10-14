import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle, AlertTriangle, Info, Clock } from "lucide-react";

export default function Notifications() {
  const notifications = [
    {
      id: 1,
      type: "urgent",
      titre: "Demande de congé en attente",
      message: "Marie Dupont a soumis une demande de congé nécessitant votre validation",
      time: "Il y a 2 heures",
      read: false
    },
    {
      id: 2,
      type: "info",
      titre: "Mission terminée",
      message: "La mission 'Formation Nouveaux Agents' a été marquée comme terminée",
      time: "Il y a 4 heures",
      read: false
    },
    {
      id: 3,
      type: "warning",
      titre: "Document à renouveler",
      message: "Le contrat de Sophie Bernard expire dans 30 jours",
      time: "Il y a 1 jour",
      read: true
    },
    {
      id: 4,
      type: "success",
      titre: "Nouvel agent ajouté",
      message: "L'agent Pierre Martin a été ajouté avec succès au système",
      time: "Il y a 2 jours",
      read: true
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "urgent": return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "warning": return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "success": return <CheckCircle className="h-4 w-4 text-success" />;
      case "info": return <Info className="h-4 w-4 text-info" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
        <p className="text-muted-foreground mt-2">
          Alertes et notifications du système de gestion
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-destructive">3</div>
            <p className="text-sm text-muted-foreground">Notifications urgentes</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">5</div>
            <p className="text-sm text-muted-foreground">Alertes</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-info">12</div>
            <p className="text-sm text-muted-foreground">Informations</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-muted-foreground">20</div>
            <p className="text-sm text-muted-foreground">Total</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Notifications récentes</CardTitle>
          <CardDescription>Dernières alertes et informations importantes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`flex items-start space-x-4 p-4 rounded-lg border transition-colors hover:bg-muted/50 ${
                  !notif.read ? 'bg-accent/5 border-accent/20' : 'bg-background'
                }`}
              >
                <div className="mt-1">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-foreground">{notif.titre}</h4>
                    {!notif.read && (
                      <Badge variant="secondary" className="ml-2">
                        Nouveau
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {notif.message}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{notif.time}</span>
                    </div>
                    {!notif.read && (
                      <Button variant="ghost" size="sm" className="text-xs">
                        Marquer comme lu
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}