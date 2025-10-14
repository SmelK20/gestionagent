import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UserPlus, 
  FileText, 
  Clock, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  Eye,
  Calendar
} from "lucide-react";

export default function Besoins() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Liste des besoins</h1>
        <p className="text-muted-foreground mt-2">
          Gestion des besoins en personnel et demandes entre directions
        </p>
      </div>

      <Tabs defaultValue="besoins" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="besoins">Besoins en personnel</TabsTrigger>
          <TabsTrigger value="demandes">Demandes d'agents</TabsTrigger>
          <TabsTrigger value="historique">Historique</TabsTrigger>
        </TabsList>

        {/* Besoins en personnel */}
        <TabsContent value="besoins" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Nouveau besoin */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Nouveau besoin
                </CardTitle>
                <CardDescription>
                  Recenser un nouveau besoin en personnel
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="service">Service demandeur</Label>
                  <Input id="service" placeholder="Ex: Service de Gestion du Personnel" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="poste">Poste/Fonction</Label>
                  <Input id="poste" placeholder="Ex: Agent Administratif" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre d'agents requis</Label>
                  <Input id="nombre" type="number" defaultValue="1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="competences">Compétences requises</Label>
                  <Textarea 
                    id="competences" 
                    placeholder="Décrivez les compétences et qualifications nécessaires..."
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priorite">Priorité</Label>
                  <Input id="priorite" placeholder="Urgent, Normal, Faible" />
                </div>
                <Button className="w-full bg-gradient-primary text-primary-foreground">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Enregistrer le besoin
                </Button>
              </CardContent>
            </Card>

            {/* Besoins actifs */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Besoins actifs
                </CardTitle>
                <CardDescription>
                  Liste des besoins en cours de traitement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">Agent Administratif</h4>
                        <p className="text-sm text-muted-foreground">Service RH - 2 postes</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Compétences: Bureautique, Gestion administrative
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="destructive" className="text-xs">Urgent</Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">Chef de Projet</h4>
                        <p className="text-sm text-muted-foreground">Direction Emploi - 1 poste</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Compétences: Management, Conduite de projet
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge variant="default" className="text-xs">Normal</Badge>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Demandes d'agents */}
        <TabsContent value="demandes" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Nouvelle demande */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="h-5 w-5" />
                  Nouvelle demande
                </CardTitle>
                <CardDescription>
                  Demander des agents à une autre direction
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="direction-source">Direction source</Label>
                  <Input id="direction-source" placeholder="Direction des Ressources Humaines" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direction-cible">Direction cible</Label>
                  <Input id="direction-cible" placeholder="Direction de l'Emploi" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nombre-agents">Nombre d'agents demandés</Label>
                  <Input id="nombre-agents" type="number" defaultValue="1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profil-requis">Profil requis</Label>
                  <Input id="profil-requis" placeholder="Ex: Agent Administratif niveau 2" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duree">Durée de la mission</Label>
                  <Input id="duree" placeholder="Ex: 6 mois, 1 an, indéterminée" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="justification">Justification</Label>
                  <Textarea 
                    id="justification" 
                    placeholder="Motif de la demande et contexte..."
                    rows={3}
                  />
                </div>
                <Button className="w-full bg-gradient-primary text-primary-foreground">
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer la demande
                </Button>
              </CardContent>
            </Card>

            {/* Demandes reçues */}
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Demandes reçues
                </CardTitle>
                <CardDescription>
                  Demandes d'autres directions à traiter
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium">Direction de l'Emploi</h4>
                        <p className="text-sm text-muted-foreground">
                          Demande: 1 Agent Administratif - 3 mois
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Reçue le 15/01/2024
                        </p>
                      </div>
                      <Badge className="bg-warning-bg-light-green/10 text-warning border-warning-bg-light-green/20">
                        En attente
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-gradient-success text-accent-foreground">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Approuver
                      </Button>
                      <Button size="sm" variant="outline">
                        <XCircle className="h-3 w-3 mr-1" />
                        Refuser
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mes demandes envoyées */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Mes demandes envoyées
              </CardTitle>
              <CardDescription>
                Suivi des demandes que vous avez envoyées
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">Direction de la Formation</h4>
                    <p className="text-sm text-muted-foreground">
                      2 Agents Formateurs - 6 mois
                    </p>
                    <p className="text-xs text-muted-foreground">Envoyée le 12/01/2024</p>
                  </div>
                  <Badge className="bg-success-green/10 text-success-green border-success-green/20">
                    Approuvée
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium">Direction Juridique</h4>
                    <p className="text-sm text-muted-foreground">
                      1 Juriste - 2 semaines
                    </p>
                    <p className="text-xs text-muted-foreground">Envoyée le 10/01/2024</p>
                  </div>
                  <Badge variant="destructive">
                    Refusée
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Historique */}
        <TabsContent value="historique" className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Historique des échanges
              </CardTitle>
              <CardDescription>
                Historique complet des demandes et échanges entre directions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">Dir. RH → Dir. Formation</h4>
                      <Badge className="bg-success-green/10 text-success-green border-success-green/20">
                        Réussie
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Transfer de 1 Agent Administratif - Durée: 3 mois
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Période: Nov 2023 - Jan 2024
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3 mr-1" />
                    Détails
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">Dir. Emploi → Dir. RH</h4>
                      <Badge variant="destructive">
                        Annulée
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Demande de 2 Conseillers Emploi - Durée: 6 mois
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Période: Oct 2023
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    <Eye className="h-3 w-3 mr-1" />
                    Détails
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}