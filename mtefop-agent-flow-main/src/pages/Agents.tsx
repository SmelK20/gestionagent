import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Filter, Edit, Eye, MoreHorizontal, Mail, Phone } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import api from "@/api";

// Dialog components (uniquement ajoutés pour le formulaire)
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Agent {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  poste: string;
  service: string;
  telephone: string;
  statut: string;
  dateentree: string;
  mission: string;
}

export default function Agents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // --- Nouveaux états pour le formulaire/modal (ajout uniquement) ---
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    poste: "",
    service: "",
    telephone: "",
    statut: "actif",
    dateentree: "",
    mission: "",
  });

  useEffect(() => {
    async function fetchAgents() {
      try {
        const response = await api.get("/agents"); // Récupération depuis Laravel/PostgreSQL
        setAgents(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des agents :", error);
      }
    }

    fetchAgents();
  }, []);

  // --- Fonction d'envoi du formulaire (ajout d'agent) ---
  async function handleAddAgent(e: React.FormEvent) {
    e.preventDefault();
    try {
      // Si ton backend exige un cookie CSRF (Sanctum), décommente la ligne suivante :
      // await api.get("/sanctum/csrf-cookie");

      const response = await api.post("/agents", formData); // envoie au backend
      // on ajoute le nouvel agent en tête de liste sans recharger
      setAgents(prev => [response.data, ...prev]);
      setOpen(false);
      setFormData({
        nom: "",
        prenom: "",
        email: "",
        poste: "",
        service: "",
        telephone: "",
        statut: "actif",
        dateentree: "",
        mission: "",
      });
    } catch (error) {
      console.error("Erreur lors de l’ajout :", error);
      // tu peux afficher un toast/alerte ici si besoin
    }
  }

  const getStatutColor = (statut: string) => {
    switch (statut) {
      case "actif": return "success";
      case "en_conge": return "warning";
      case "inactif": return "secondary";
      default: return "secondary";
    }
  };

  const getStatutLabel = (statut: string) => {
    switch (statut) {
      case "actif": return "Actif";
      case "en_conge": return "En congé";
      case "inactif": return "Inactif";
      default: return statut;
    }
  };

  const filteredAgents = agents.filter(agent =>
    agent.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.poste.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agent.service.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestion des Agents</h1>
          <p className="text-muted-foreground mt-2">
            Gérez les informations et le suivi de tous les agents du ministère
          </p>
        </div>

        {/* === Bouton "Ajouter un agent" transformé en DialogTrigger (UI inchangée sinon) === */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-primary text-primary-foreground hover:scale-105 transition-transform shadow-soft">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un agent
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un agent</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleAddAgent} className="space-y-4">
              <Input
                placeholder="Nom"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
              />
              <Input
                placeholder="Prénom"
                value={formData.prenom}
                onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
              />
              <Input
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                placeholder="Poste"
                value={formData.poste}
                onChange={(e) => setFormData({ ...formData, poste: e.target.value })}
              />
              <Input
                placeholder="Service"
                value={formData.service}
                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              />
              <Input
                placeholder="Téléphone"
                value={formData.telephone}
                onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
              />
              <div>
                <label className="text-sm text-muted-foreground">Statut</label>
                <select
                  value={formData.statut}
                  onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                  className="w-full rounded-md border px-2 py-1"
                >
                  <option value="actif">Actif</option>
                  <option value="en_conge">En congé</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>
              <Input
                placeholder="Date d'entrée"
                type="date"
                value={formData.dateentree}
                onChange={(e) => setFormData({ ...formData, dateentree: e.target.value })}
              />
              <Input
                placeholder="Mission"
                value={formData.mission}
                onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
              />

              <DialogFooter>
                <Button type="submit">Enregistrer</Button>
                <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistiques rapides */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-foreground">{agents.length}</div>
            <p className="text-sm text-muted-foreground">Total agents</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-success">{agents.filter(a => a.statut === "actif").length}</div>
            <p className="text-sm text-muted-foreground">Agents actifs</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-warning">{agents.filter(a => a.statut === "en_conge").length}</div>
            <p className="text-sm text-muted-foreground">En congé</p>
          </CardContent>
        </Card>
        <Card className="shadow-soft">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-muted-foreground">{agents.filter(a => a.statut === "inactif").length}</div>
            <p className="text-sm text-muted-foreground">Inactifs</p>
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
                placeholder="Rechercher par nom, prénom, poste ou service..."
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

      {/* Liste des agents */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle>Liste des Agents</CardTitle>
          <CardDescription>
            {filteredAgents.length} agent(s) trouvé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Poste</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Mission actuelle</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgents.map(agent => (
                <TableRow key={agent.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div>
                      <div className="font-medium">{agent.prenom} {agent.nom}</div>
                      <div className="text-sm text-muted-foreground">
                        Depuis le {agent.dateentree ? new Date(agent.dateentree).toLocaleDateString('fr-FR') : ""}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{agent.poste}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{agent.service}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        <span>{agent.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Phone className="h-3 w-3" />
                        <span>{agent.telephone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatutColor(agent.statut) as any}>
                      {getStatutLabel(agent.statut)}
                    </Badge>
                  </TableCell>
                  <TableCell>{agent.mission}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir le profil
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Modifier
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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







