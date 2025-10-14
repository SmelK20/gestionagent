import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Plus, 
  Search, 
  Filter,
  Calendar,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

export default function Conges() {
  const [searchTerm, setSearchTerm] = useState("");

  // Données simulées des demandes de congé
  const demandesConges = [
    {
      id: 1,
      agent: "Marie Dupont",
      poste: "Directrice RH",
      typeConge: "Congés payés",
      dateDebut: "2024-01-22",
      dateFin: "2024-02-02",
      duree: 12,
      statut: "en_attente",
      dateDepot: "2024-01-08",
      motif: "Vacances familiales",
      remplacant: "Sophie Bernard"
    },
    {
      id: 2,
      agent: "Jean Martin",
      poste: "Auditeur Senior", 
      typeConge: "Congé maladie",
      dateDebut: "2024-01-15",
      dateFin: "2024-01-17",
      duree: 3,
      statut: "approuve",
      dateDepot: "2024-01-14",
      motif: "Certificat médical joint",
      remplacant: "Pierre Durand"
    },
    {
      id: 3,
      agent: "Sophie Bernard",
      poste: "Juriste",
      typeConge: "Congé maternité", 
      dateDebut: "2024-02-15",
      dateFin: "2024-08-15",
      duree: 112,
      statut: "approuve",
      dateDepot: "2023-12-20",
      motif: "Naissance prévue février 2024",
      remplacant: "Claire Moreau"
    },
    {
      id: 4,
      agent: "Pierre Durand",
      poste: "Formateur",
      typeConge: "RTT",
      dateDebut: "2024-01-19",
      dateFin: "2024-01-19", 
      duree: 1,
      statut: "refuse",
      dateDepot: "2024-01-10",
      motif: "Formation urgente programmée",
      remplacant: "-"
    },
    {
      id: 5,
      agent: "Claire Moreau",
      poste: "Secrétaire Générale",
      typeConge: "Congé sans solde",
      dateDebut: "2024-03-01",
      dateFin: "2024-03-31",
      duree: 31,
      statut: "en_attente",
      dateDepot: "2024-01-05",
      motif: "Projet personnel",
      remplacant: "Marie Dupont"
    }
  ];

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "approuve": return "success";
      case "refuse": return "destructive";
      case "en_attente": return "warning";
      default: return "secondary";
    }
  };

  const getStatutIcon = (statut: string) => {
    switch (statut) {
      case "approuve": return <CheckCircle className="h-4 w-4" />;
      case "refuse": return <XCircle className="h-4 w-4" />;
      case "en_attente": return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case "approuve": return "Approuvé";
      case "refuse": return "Refusé";
      case "en_attente": return "En attente";
      default: return statut;
    }
  };

  const getTypeCongeColor = (type: string) => {
    switch (type) {
      case "Congés payés": return "info";
      case "Congé maladie": return "destructive";
      case "Congé maternité": return "success";
      case "RTT": return "secondary";
      case "Congé sans solde": return "warning";
      default: return "secondary";
    }
  };

  const filteredDemandes = demandesConges.filter(demande =>
    demande.agent.toLowerCase().includes(searchTerm.toLowerCase()) ||
    demande.typeConge.toLowerCase().includes(searchTerm.toLowerCase()) ||
    demande.motif.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statsConges = {
    total: demandesConges.length,
    enAttente: demandesConges.filter(d => d.statut === "en_attente").length,
    approuves: demandesConges.filter(d => d.statut === "approuve").length,
    refuses: demandesConges.filter(d => d.statut === "refuse").length
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Congés</h1>
          <p className="text-muted-foreground mt-2">
            Suivi des demandes de congés et gestion des absences
          </p>
        </div>
        <Button className="bg-gradient-primary text-primary-foreground hover:scale-105 transition-transform shadow-soft">
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle demande
        </Button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">{statsConges.total}</div>
            <p className="text-sm text-muted-foreground">Total demandes</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">{statsConges.enAttente}</div>
            <p className="text-sm text-muted-foreground">En attente</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-success">{statsConges.approuves}</div>
            <p className="text-sm text-muted-foreground">Approuvées</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-destructive">{statsConges.refuses}</div>
            <p className="text-sm text-muted-foreground">Refusées</p>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="shadow-soft cursor-pointer hover:scale-105 transition-transform">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-warning-bg-light-green/10 rounded-lg">
                <AlertCircle className="h-6 w-6 text-warning" />
              </div>
              <div>
                <h3 className="font-medium">Demandes en attente</h3>
                <p className="text-sm text-muted-foreground">
                  {statsConges.enAttente} demande(s) à traiter
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft cursor-pointer hover:scale-105 transition-transform">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-info/10 rounded-lg">
                <Calendar className="h-6 w-6 text-info" />
              </div>
              <div>
                <h3 className="font-medium">Planificateur</h3>
                <p className="text-sm text-muted-foreground">
                  Voir le planning des absences
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft cursor-pointer hover:scale-105 transition-transform">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <User className="h-6 w-6 text-success" />
              </div>
              <div>
                <h3 className="font-medium">Solde des congés</h3>
                <p className="text-sm text-muted-foreground">
                  Consulter les soldes par agent
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par agent, type de congé ou motif..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtres
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Liste des demandes */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Demandes de Congés</CardTitle>
          <CardDescription>
            {filteredDemandes.length} demande(s) trouvée(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Type de congé</TableHead>
                <TableHead>Période</TableHead>
                <TableHead>Durée</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Motif</TableHead>
                <TableHead>Remplaçant</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDemandes.map((demande) => (
                <TableRow key={demande.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{demande.agent}</div>
                      <div className="text-sm text-muted-foreground">{demande.poste}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getTypeCongeColor(demande.typeConge) as any}>
                      {demande.typeConge}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        Du {new Date(demande.dateDebut).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="text-sm">
                        Au {new Date(demande.dateFin).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="font-medium">{demande.duree}</div>
                      <div className="text-xs text-muted-foreground">
                        jour{demande.duree > 1 ? 's' : ''}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatutIcon(demande.statut)}
                      <Badge variant={getStatutColor(demande.statut) as any}>
                        {getStatutLabel(demande.statut)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{demande.motif}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {demande.remplacant === "-" ? "Aucun" : demande.remplacant}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {demande.statut === "en_attente" && (
                        <>
                          <Button size="sm" variant="outline" className="text-success border-success hover:bg-success hover:text-success-foreground">
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                            <XCircle className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}