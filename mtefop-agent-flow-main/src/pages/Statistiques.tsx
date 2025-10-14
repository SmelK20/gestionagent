import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, Briefcase, Calendar, FileText, AlertTriangle, Bell } from "lucide-react";

export default function Statistiques() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Statistiques et Rapports</h1>
        <p className="text-muted-foreground mt-2">
          Analyses et métriques de performance du ministère
        </p>
      </div>

      {/* Métriques générales */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Agents actifs</p>
                <p className="text-2xl font-bold">792</p>
                <p className="text-xs text-success">+5.2% ce mois</p>
              </div>
              <Users className="h-8 w-8 text-institutional-blue" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Missions terminées</p>
                <p className="text-2xl font-bold">124</p>
                <p className="text-xs text-success">+12.5% ce mois</p>
              </div>
              <Briefcase className="h-8 w-8 text-institutional-green" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Jours de congés</p>
                <p className="text-2xl font-bold">1,247</p>
                <p className="text-xs text-warning">+2.1% ce mois</p>
              </div>
              <Calendar className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Documents traités</p>
                <p className="text-2xl font-bold">456</p>
                <p className="text-xs text-success">+8.3% ce mois</p>
              </div>
              <FileText className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Besoins en cours</p>
                <p className="text-2xl font-bold">34</p>
                <p className="text-xs text-warning">+15.2% ce mois</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Notifications</p>
                <p className="text-2xl font-bold">89</p>
                <p className="text-xs text-info">+4.8% ce mois</p>
              </div>
              <Bell className="h-8 w-8 text-info" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques et analyses */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance mensuelle
            </CardTitle>
            <CardDescription>Évolution des indicateurs clés</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 flex items-center justify-center bg-gradient-secondary rounded-lg">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-institutional-blue mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">Graphique interactif</p>
                <p className="text-xs text-muted-foreground">Données de performance mensuelle</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tendances annuelles
            </CardTitle>
            <CardDescription>Comparaison par rapport à l'année précédente</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 flex items-center justify-center bg-gradient-success rounded-lg">
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-accent-foreground mx-auto mb-4" />
                <p className="text-sm text-accent-foreground">Analyse des tendances</p>
                <p className="text-xs text-accent-foreground/80">Évolution sur 12 mois</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rapports par service */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Performance par service</CardTitle>
          <CardDescription>Analyse comparative des différents services du ministère</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { service: "Ressources Humaines", agents: 45, missions: 23, besoins: 8, notifications: 15, performance: 92 },
              { service: "Audit Interne", agents: 12, missions: 8, besoins: 3, notifications: 6, performance: 87 },
              { service: "Affaires Juridiques", agents: 18, missions: 15, besoins: 5, notifications: 12, performance: 89 },
              { service: "Formation", agents: 25, missions: 18, besoins: 12, notifications: 28, performance: 94 },
              { service: "Direction Générale", agents: 8, missions: 12, besoins: 6, notifications: 28, performance: 96 }
            ].map((service, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{service.service}</h4>
                  <p className="text-sm text-muted-foreground">
                    {service.agents} agents • {service.missions} missions • {service.besoins} besoins • {service.notifications} notifications
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-success">{service.performance}%</div>
                  <p className="text-xs text-muted-foreground">Performance</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}