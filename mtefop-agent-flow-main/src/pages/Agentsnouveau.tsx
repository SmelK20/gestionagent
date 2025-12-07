import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Edit,
  Eye,
  MoreHorizontal,
  Mail,
  Phone,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import api from "@/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface AgentNouveau {
  id: number;
  immatricule: string;
  cin: string;
  nom: string;
  prenom: string;
  date_naissance: string;
  adresse: string;
  situation_matrimoniale: string;
  sexe: string;
  email: string;
  telephone: string;
  corps: string;
  grade: string;
  categorie: string;
  diplome: string;
  specialisation: string;
  service_affectation: string;
  date_affectation: string;
  ministere: string;
  direction: string;
  service: string;
  fonction: string;
  mot_de_passe: string;
}

const MTEFOP_NAME = "MTEFOP";

export default function Agentsnouveau() {
  const [agents, setAgents] = useState<AgentNouveau[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [openProfil, setOpenProfil] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentNouveau | null>(null);
  const [editingAgent, setEditingAgent] = useState<AgentNouveau | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    immatricule: "",
    cin: "",
    nom: "",
    prenom: "",
    date_naissance: "",
    adresse: "",
    situation_matrimoniale: "",
    sexe: "",
    email: "",
    telephone: "",
    corps: "",
    grade: "",
    categorie: "",
    diplome: "",
    specialisation: "",
    service_affectation: "",
    date_affectation: "",
    ministere: MTEFOP_NAME,
    direction: "",
    service: "",
    fonction: "",
    mot_de_passe: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const agentsRes = await api.get("/agents_nouveau");
        setAgents(agentsRes.data);
      } catch (error) {
        console.error("Erreur récupération :", error);
      }
    }
    fetchData();
  }, []);

  function validateForm() {
    const newErrors: { [key: string]: string } = {};

    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(formData.nom))
      newErrors.nom = "Le nom ne doit contenir que des lettres.";

    if (!/^[a-zA-ZÀ-ÿ\s'-]+$/.test(formData.prenom))
      newErrors.prenom = "Le prénom ne doit contenir que des lettres.";

    if (!/^\d+$/.test(formData.cin))
      newErrors.cin = "Le CIN doit contenir uniquement des chiffres.";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Email invalide.";

    if (!/^\d{8,15}$/.test(formData.telephone))
      newErrors.telephone = "Numéro de téléphone invalide (8 à 15 chiffres).";

    if (!/^[a-zA-Z0-9]+$/.test(formData.immatricule))
      newErrors.immatricule = "L'immatricule doit contenir lettres et chiffres seulement.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleAddOrEditAgent(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editingAgent) {
        const response = await api.put(`/agents_nouveau/${editingAgent.id}`, formData);
        setAgents((prev) =>
          prev.map((agent) => (agent.id === editingAgent.id ? response.data : agent))
        );
      } else {
        const response = await api.post("/agents_nouveau", formData);
        setAgents((prev) => [response.data, ...prev]);
      }

      setOpen(false);
      setEditingAgent(null);

      // Reset
      setFormData({
        immatricule: "",
        cin: "",
        nom: "",
        prenom: "",
        date_naissance: "",
        adresse: "",
        situation_matrimoniale: "",
        sexe: "",
        email: "",
        telephone: "",
        corps: "",
        grade: "",
        categorie: "",
        diplome: "",
        specialisation: "",
        service_affectation: "",
        date_affectation: "",
        ministere: MTEFOP_NAME,
        direction: "",
        service: "",
        fonction: "",
        mot_de_passe: "",
      });

      setErrors({});
    } catch (error) {
      console.error("Erreur lors de l’ajout/modification :", error);
    }
  }

  const handleViewProfil = (agent: AgentNouveau) => {
    setSelectedAgent(agent);
    setOpenProfil(true);
  };

  const handleEditAgent = (agent: AgentNouveau) => {
    setEditingAgent(agent);
    setFormData({ ...agent });
    setOpen(true);
  };

  const filteredAgents = agents.filter(
    (agent) =>
      agent.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.immatricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.service_affectation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestion des Agents
          </h1>
          <p className="text-muted-foreground mt-2">
            Gérez les informations personnelles et professionnelles des agents
          </p>
        </div>

        {/* Bouton OUVERTURE DIALOG contrôlé manuellement */}
        <Button
          className="bg-gradient-primary text-primary-foreground hover:scale-105 transition-transform shadow-soft"
          onClick={() => {
            setEditingAgent(null);
            setOpen(true);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Ajouter un agent
        </Button>
      </div>

      {/* Dialog AJOUT / MODIFICATION */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[50vw] max-w-none">
          <DialogHeader>
            <DialogTitle>
              {editingAgent ? "Modifier un agent" : "Ajouter un agent"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddOrEditAgent} className="space-y-4">
            <div className="grid grid-cols-2 gap-6">

              {/* Info perso */}
              <div>
                <h3 className="font-semibold text-primary mb-2 col-span-2">
                  Informations personnelles
                </h3>

                <Label>Immatricule</Label>
                <Input value={formData.immatricule} onChange={(e) => setFormData({ ...formData, immatricule: e.target.value })} />

                <Label>CIN</Label>
                <Input value={formData.cin} onChange={(e) => setFormData({ ...formData, cin: e.target.value.replace(/\D/g, "") })} />

                <Label>Nom</Label>
                <Input value={formData.nom} onChange={(e) => setFormData({ ...formData, nom: e.target.value })} />

                <Label>Prénom</Label>
                <Input value={formData.prenom} onChange={(e) => setFormData({ ...formData, prenom: e.target.value })} />

                <Label>Date de naissance</Label>
                <Input type="date" value={formData.date_naissance} onChange={(e) => setFormData({ ...formData, date_naissance: e.target.value })} />

                <Label>Adresse</Label>
                <Input value={formData.adresse} onChange={(e) => setFormData({ ...formData, adresse: e.target.value })} />

                <Label>Situation matrimoniale</Label>
                <Input value={formData.situation_matrimoniale} onChange={(e) => setFormData({ ...formData, situation_matrimoniale: e.target.value })} />

                <Label>Sexe</Label>
                <select
                  value={formData.sexe}
                  onChange={(e) => setFormData({ ...formData, sexe: e.target.value })}
                  className="w-full border rounded-md p-2"
                >
                  <option value="">Sélectionner</option>
                  <option value="Masculin">Masculin</option>
                  <option value="Féminin">Féminin</option>
                </select>

                <Label>Email</Label>
                <Input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />

                <Label>Téléphone</Label>
                <Input value={formData.telephone} onChange={(e) => setFormData({ ...formData, telephone: e.target.value })} />
              </div>

              {/* Informations professionnelles */}
              <div>
                <h3 className="font-semibold text-primary mb-2 col-span-2">
                  Informations professionnelles
                </h3>

                <Label>Corps</Label>
                <Input value={formData.corps} onChange={(e) => setFormData({ ...formData, corps: e.target.value })} />

                <Label>Grade</Label>
                <Input value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })} />

                <Label>Catégorie</Label>
                <Input value={formData.categorie} onChange={(e) => setFormData({ ...formData, categorie: e.target.value })} />

                <Label>Diplôme</Label>
                <Input value={formData.diplome} onChange={(e) => setFormData({ ...formData, diplome: e.target.value })} />

                <Label>Spécialisation</Label>
                <Input value={formData.specialisation} onChange={(e) => setFormData({ ...formData, specialisation: e.target.value })} />

                <Label>Service d'affectation</Label>
                <Input value={formData.service_affectation} onChange={(e) => setFormData({ ...formData, service_affectation: e.target.value })} />

                <Label>Date d'affectation</Label>
                <Input type="date" value={formData.date_affectation} onChange={(e) => setFormData({ ...formData, date_affectation: e.target.value })} />

                <Label>Direction</Label>
                <Input value={formData.direction} onChange={(e) => setFormData({ ...formData, direction: e.target.value })} />

                <Label>Service</Label>
                <Input value={formData.service} onChange={(e) => setFormData({ ...formData, service: e.target.value })} />

                <Label>Fonction</Label>
                <Input value={formData.fonction} onChange={(e) => setFormData({ ...formData, fonction: e.target.value })} />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">
                {editingAgent ? "Modifier" : "Enregistrer"}
              </Button>

              <Button variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Recherche */}
      <Card className="shadow-soft">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
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
                <TableHead>Nom complet</TableHead>
                <TableHead>Immatricule</TableHead>
                <TableHead>Service actuel</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Fonction</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredAgents.map((agent) => (
                <TableRow key={agent.id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="font-medium">
                      {agent.prenom} {agent.nom}
                    </div>
                  </TableCell>
                  <TableCell>{agent.immatricule}</TableCell>
                  <TableCell>
                    <Badge>{agent.service_affectation}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <Mail className="inline h-3 w-3 mr-1" />
                      {agent.email}
                    </div>
                    <div className="text-sm">
                      <Phone className="inline h-3 w-3 mr-1" />
                      {agent.telephone}
                    </div>
                  </TableCell>
                  <TableCell>{agent.fonction || "—"}</TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewProfil(agent)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir le profil
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => handleEditAgent(agent)}>
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

      {/* Profil Agent */}
      {selectedAgent && (
        <Dialog open={openProfil} onOpenChange={setOpenProfil}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Profil de {selectedAgent.prenom} {selectedAgent.nom}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3 text-sm">
              <h3 className="font-semibold text-primary border-b pb-1">
                Informations personnelles
              </h3>

              <p><strong>Immatricule :</strong> {selectedAgent.immatricule}</p>
              <p><strong>CIN :</strong> {selectedAgent.cin}</p>
              <p><strong>Email :</strong> {selectedAgent.email}</p>
              <p><strong>Téléphone :</strong> {selectedAgent.telephone}</p>
              <p><strong>Adresse :</strong> {selectedAgent.adresse}</p>
              <p><strong>Date de naissance :</strong> {selectedAgent.date_naissance}</p>
              <p><strong>Situation matrimoniale :</strong> {selectedAgent.situation_matrimoniale}</p>
              <p><strong>Sexe :</strong> {selectedAgent.sexe}</p>

              <hr />

              <h3 className="font-semibold text-primary border-b pb-1">
                Informations professionnelles
              </h3>

              <p><strong>Corps :</strong> {selectedAgent.corps}</p>
              <p><strong>Grade :</strong> {selectedAgent.grade}</p>
              <p><strong>Catégorie :</strong> {selectedAgent.categorie}</p>
              <p><strong>Diplôme :</strong> {selectedAgent.diplome}</p>
              <p><strong>Spécialisation :</strong> {selectedAgent.specialisation}</p>
              <p><strong>Service d’affectation :</strong> {selectedAgent.service_affectation}</p>
              <p><strong>Date d’affectation :</strong> {selectedAgent.date_affectation}</p>

              <hr />

              <h3 className="font-semibold text-primary border-b pb-1">
                Affectation hiérarchique
              </h3>

              <p><strong>Ministère :</strong> {selectedAgent.ministere}</p>
              <p><strong>Direction :</strong> {selectedAgent.direction || "—"}</p>
              <p><strong>Service :</strong> {selectedAgent.service || "—"}</p>
              <p><strong>Fonction :</strong> {selectedAgent.fonction || "—"}</p>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenProfil(false)}>
                Fermer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
