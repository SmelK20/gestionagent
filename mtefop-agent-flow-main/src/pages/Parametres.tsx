import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Database, 
  Mail,
  Save
} from "lucide-react";

export default function Parametres() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Paramètres</h1>
        <p className="text-muted-foreground mt-2">
          Configuration du système et préférences d'administration
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Paramètres du profil */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profil administrateur
            </CardTitle>
            <CardDescription>
              Gestion des informations de votre compte administrateur
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nom">Nom complet</Label>
              <Input id="nom" defaultValue="Administrateur MTEFOP" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="admin@mtefop.gov" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone">Téléphone</Label>
              <Input id="telephone" defaultValue="+33 1 23 45 67 89" />
            </div>
            <Button className="w-full bg-gradient-primary text-primary-foreground">
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder les modifications
            </Button>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configurer les alertes et notifications système
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Nouvelles demandes de congé</Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir un email pour chaque nouvelle demande
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Missions en retard</Label>
                <p className="text-sm text-muted-foreground">
                  Alertes pour les missions dépassant leur échéance
                </p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Rapports hebdomadaires</Label>
                <p className="text-sm text-muted-foreground">
                  Recevoir un résumé d'activité chaque semaine
                </p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Sécurité */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Sécurité
            </CardTitle>
            <CardDescription>
              Paramètres de sécurité et accès au système
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Mot de passe actuel</Label>
              <Input id="current-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">Nouveau mot de passe</Label>
              <Input id="new-password" type="password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Authentification à deux facteurs</Label>
                <p className="text-sm text-muted-foreground">
                  Sécurité renforcée pour la connexion
                </p>
              </div>
              <Switch />
            </div>
            <Button variant="outline" className="w-full">
              Changer le mot de passe
            </Button>
          </CardContent>
        </Card>

        {/* Système */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Système
            </CardTitle>
            <CardDescription>
              Configuration générale du système MTEFOP
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="org-name">Nom de l'organisation</Label>
              <Input id="org-name" defaultValue="Ministère du Travail et d'Emploi de la Fonction Publique" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Fuseau horaire</Label>
              <Input id="timezone" defaultValue="Europe/Paris (UTC+1)" disabled />
            </div>
            <Separator />
            <div className="space-y-3">
              <h4 className="font-medium">Actions système</h4>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Database className="h-4 w-4 mr-2" />
                  Sauvegarder la base de données
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Tester les notifications email
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informations système */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Informations système
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold">Version</h4>
              <p className="text-2xl font-bold text-institutional-blue">2.1.0</p>
              <p className="text-xs text-muted-foreground">Système de gestion MTEFOP</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold">Base de données</h4>
              <p className="text-2xl font-bold text-institutional-green">99.9%</p>
              <p className="text-xs text-muted-foreground">Disponibilité</p>
            </div>
            <div className="text-center p-4 bg-muted/30 rounded-lg">
              <h4 className="font-semibold">Dernière sauvegarde</h4>
              <p className="text-sm font-medium">Aujourd'hui</p>
              <p className="text-xs text-muted-foreground">03:00 - Automatique</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}