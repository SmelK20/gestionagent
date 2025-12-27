// mtefop-agent-flow-main/src/pages/Agentsnouveau.tsx
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
  Upload,
  Download,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import api, { exportAgentsNouveau, importAgentsNouveau } from "@/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type RefItem = { id: number; libelle: string };

// ✅ Ce que l’API peut renvoyer côté agents_nouveau (on tolère plusieurs formes)
type LibelleObj = { id: number; libelle: string };

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

  // ⚠️ selon ton backend, ça peut être ministere (string) ou ministere_id
  ministere?: string;
  ministere_id?: number | null;

  // ✅ nouvelle structure (FK)
  direction_id?: number | null;
  service_id?: number | null;
  fonction_id?: number | null;

  // ✅ parfois l’API renvoie aussi les relations (optionnel)
  direction?: LibelleObj | string | null;
  service?: LibelleObj | string | null;
  fonction?: LibelleObj | string | null;

  // ⚠️ mot de passe masqué en principe
  mot_de_passe?: string;
}

const MTEFOP_NAME = "MTEFOP";

function normalize(s: string) {
  return (s || "").toLowerCase().trim();
}

function getLibelle(value: AgentNouveau["direction"]): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value.libelle ?? "";
}

export default function Agentsnouveau() {
  const [agents, setAgents] = useState<AgentNouveau[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [openProfil, setOpenProfil] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentNouveau | null>(null);
  const [editingAgent, setEditingAgent] = useState<AgentNouveau | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Import / export
  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // ✅ Référentiels
  const [directions, setDirections] = useState<RefItem[]>([]);
  const [services, setServices] = useState<RefItem[]>([]);
  const [fonctions, setFonctions] = useState<RefItem[]>([]);

  const { toast } = useToast();

  // ✅ FormData basé sur IDs
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

    // ✅ FK
    direction_id: "" as string | number,
    service_id: "" as string | number,
    fonction_id: "" as string | number,
  });

  async function fetchAgents() {
    try {
      const agentsRes = await api.get("/agents_nouveau");
      setAgents(agentsRes.data || []);
    } catch (error) {
      console.error("Erreur récupération agents_nouveau :", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger la liste des agents.",
      });
    }
  }

  async function fetchReferentiels() {
    try {
      const [dirRes, servRes, foncRes] = await Promise.all([
        api.get("/directions"),
        api.get("/services"),
        api.get("/fonctions"),
      ]);
      setDirections(dirRes.data || []);
      setServices(servRes.data || []);
      setFonctions(foncRes.data || []);
    } catch (error) {
      console.error("Erreur récupération référentiels :", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de charger directions/services/fonctions.",
      });
    }
  }

  useEffect(() => {
    fetchAgents();
    fetchReferentiels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function resetForm() {
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
      direction_id: "",
      service_id: "",
      fonction_id: "",
    });
    setErrors({});
  }

  function validateForm() {
    const newErrors: { [key: string]: string } = {};

    if (formData.nom && !/^[a-zA-ZÀ-ÿ\s'-]+$/.test(formData.nom))
      newErrors.nom = "Le nom ne doit contenir que des lettres.";

    if (formData.prenom && !/^[a-zA-ZÀ-ÿ\s'-]+$/.test(formData.prenom))
      newErrors.prenom = "Le prénom ne doit contenir que des lettres.";

    if (formData.cin && !/^\d+$/.test(formData.cin))
      newErrors.cin = "Le CIN doit contenir uniquement des chiffres.";

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Email invalide.";

    if (formData.telephone && !/^\d{8,15}$/.test(formData.telephone))
      newErrors.telephone = "Numéro de téléphone invalide (8 à 15 chiffres).";

    if (formData.immatricule && !/^[a-zA-Z0-9]+$/.test(formData.immatricule))
      newErrors.immatricule =
        "L'immatricule doit contenir lettres et chiffres seulement.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleAddOrEditAgent(e: React.FormEvent) {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      // ✅ préparer payload avec conversion -> number | null
      const payload: any = {
        ...formData,
        direction_id: formData.direction_id ? Number(formData.direction_id) : null,
        service_id: formData.service_id ? Number(formData.service_id) : null,
        fonction_id: formData.fonction_id ? Number(formData.fonction_id) : null,
      };

      // ✅ empêcher modification de ministere/direction/service/fonction en mode edit
      if (editingAgent) {
        payload.ministere = editingAgent.ministere ?? MTEFOP_NAME;
        payload.direction_id = editingAgent.direction_id ?? null;
        payload.service_id = editingAgent.service_id ?? null;
        payload.fonction_id = editingAgent.fonction_id ?? null;
      }

      if (editingAgent) {
        const response = await api.put(`/agents_nouveau/${editingAgent.id}`, payload);
        setAgents((prev) =>
          prev.map((a) => (a.id === editingAgent.id ? response.data : a))
        );
        toast({
          title: "Agent mis à jour",
          description: "Les informations de l’agent ont été modifiées.",
        });
      } else {
        const response = await api.post("/agents_nouveau", payload);

        const createdAgent: AgentNouveau =
          (response.data && response.data.agent) || response.data;

        setAgents((prev) => [createdAgent, ...prev]);
        toast({
          title: "Agent ajouté",
          description: "L’agent a été créé avec succès.",
        });
      }

      setOpen(false);
      setEditingAgent(null);
      resetForm();
    } catch (error: any) {
      console.error("Erreur lors de l’ajout/modification :", error);

      // Si Laravel renvoie errors {}
      const msg =
        error?.response?.data?.message ||
        (error?.response?.data?.errors
          ? Object.values(error.response.data.errors).flat().join(" ")
          : null) ||
        "Une erreur est survenue lors de l’enregistrement.";

      toast({
        variant: "destructive",
        title: "Erreur",
        description: msg,
      });
    }
  }

  const handleViewProfil = (agent: AgentNouveau) => {
    setSelectedAgent(agent);
    setOpenProfil(true);
  };

  const handleEditAgent = (agent: AgentNouveau) => {
    setEditingAgent(agent);

    // ✅ remplir le form avec IDs
    setFormData({
      immatricule: agent.immatricule ?? "",
      cin: agent.cin ?? "",
      nom: agent.nom ?? "",
      prenom: agent.prenom ?? "",
      date_naissance: agent.date_naissance ?? "",
      adresse: agent.adresse ?? "",
      situation_matrimoniale: agent.situation_matrimoniale ?? "",
      sexe: agent.sexe ?? "",
      email: agent.email ?? "",
      telephone: agent.telephone ?? "",
      corps: agent.corps ?? "",
      grade: agent.grade ?? "",
      categorie: agent.categorie ?? "",
      diplome: agent.diplome ?? "",
      specialisation: agent.specialisation ?? "",
      service_affectation: agent.service_affectation ?? "",
      date_affectation: agent.date_affectation ?? "",
      ministere: agent.ministere ?? MTEFOP_NAME,

      direction_id: agent.direction_id ?? "",
      service_id: agent.service_id ?? "",
      fonction_id: agent.fonction_id ?? "",
    });

    setOpen(true);
  };

  const filteredAgents = agents.filter((a) => {
    const term = normalize(searchTerm);
    if (!term) return true;

    return (
      normalize(a.nom).includes(term) ||
      normalize(a.prenom).includes(term) ||
      normalize(a.immatricule).includes(term) ||
      normalize(a.service_affectation).includes(term)
    );
  });

  // === EXPORT CSV ===
  const handleExport = async () => {
    try {
      setIsExporting(true);
      const blob = await exportAgentsNouveau();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      const fileName = `agents_${new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[:T]/g, "-")}.csv`;

      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Export réussi",
        description: "Le fichier CSV a été téléchargé.",
      });
    } catch (error) {
      console.error("Erreur export :", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d’exporter la liste des agents.",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // === IMPORT CSV ===
  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importFile) {
      toast({
        variant: "destructive",
        title: "Fichier manquant",
        description: "Choisis un fichier CSV à importer.",
      });
      return;
    }

    try {
      setIsImporting(true);
      const result = await importAgentsNouveau(importFile);
      toast({
        title: "Import terminé",
        description: `Créés : ${result.created ?? 0}, mis à jour : ${result.updated ?? 0}.`,
      });

      await fetchAgents();
      setOpenImportDialog(false);
      setImportFile(null);
    } catch (error) {
      console.error("Erreur import :", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible d’importer le fichier. Vérifie le format du CSV.",
      });
    } finally {
      setIsImporting(false);
    }
  };

  // Helpers affichage (si relations non renvoyées par l’API)
  const displayDirection = (a: AgentNouveau) =>
    getLibelle(a.direction) || (a.direction_id ? `#${a.direction_id}` : "—");
  const displayService = (a: AgentNouveau) =>
    getLibelle(a.service) || (a.service_id ? `#${a.service_id}` : "—");
  const displayFonction = (a: AgentNouveau) =>
    getLibelle(a.fonction) || (a.fonction_id ? `#${a.fonction_id}` : "—");

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestion des Agents
          </h1>
          <p className="text-muted-foreground mt-2">
            Les agents sont enregistrés dans <b>agents_nouveau</b>.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 justify-end">
          <Button variant="outline" onClick={handleExport} disabled={isExporting}>
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? "Export..." : "Exporter"}
          </Button>

          <Button variant="outline" onClick={() => setOpenImportDialog(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Importer
          </Button>

          <Button
            className="bg-gradient-primary text-primary-foreground hover:scale-105 transition-transform shadow-soft"
            onClick={() => {
              setEditingAgent(null);
              resetForm();
              setOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter un agent
          </Button>
        </div>
      </div>

      {/* Dialog AJOUT / MODIFICATION */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[50vw] max-w-none max-h-[100vh] overflow-y-auto">
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
                <Input
                  value={formData.immatricule}
                  onChange={(e) =>
                    setFormData({ ...formData, immatricule: e.target.value })
                  }
                />
                {errors.immatricule && (
                  <p className="text-xs text-red-500">{errors.immatricule}</p>
                )}

                <Label>CIN</Label>
                <Input
                  value={formData.cin}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cin: e.target.value.replace(/\D/g, ""),
                    })
                  }
                />
                {errors.cin && <p className="text-xs text-red-500">{errors.cin}</p>}

                <Label>Nom</Label>
                <Input
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                />
                {errors.nom && <p className="text-xs text-red-500">{errors.nom}</p>}

                <Label>Prénom</Label>
                <Input
                  value={formData.prenom}
                  onChange={(e) =>
                    setFormData({ ...formData, prenom: e.target.value })
                  }
                />
                {errors.prenom && (
                  <p className="text-xs text-red-500">{errors.prenom}</p>
                )}

                <Label>Date de naissance</Label>
                <Input
                  type="date"
                  value={formData.date_naissance}
                  onChange={(e) =>
                    setFormData({ ...formData, date_naissance: e.target.value })
                  }
                />

                <Label>Adresse</Label>
                <Input
                  value={formData.adresse}
                  onChange={(e) =>
                    setFormData({ ...formData, adresse: e.target.value })
                  }
                />

                <Label>Situation matrimoniale</Label>
                <Input
                  value={formData.situation_matrimoniale}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      situation_matrimoniale: e.target.value,
                    })
                  }
                />

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
                <Input
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}

                <Label>Téléphone</Label>
                <Input
                  value={formData.telephone}
                  onChange={(e) =>
                    setFormData({ ...formData, telephone: e.target.value })
                  }
                />
                {errors.telephone && (
                  <p className="text-xs text-red-500">{errors.telephone}</p>
                )}
              </div>

              {/* Informations professionnelles */}
              <div>
                <h3 className="font-semibold text-primary mb-2 col-span-2">
                  Informations professionnelles
                </h3>

                <Label>Corps</Label>
                <Input
                  value={formData.corps}
                  onChange={(e) => setFormData({ ...formData, corps: e.target.value })}
                />

                <Label>Grade</Label>
                <Input
                  value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                />

                <Label>Catégorie</Label>
                <Input
                  value={formData.categorie}
                  onChange={(e) =>
                    setFormData({ ...formData, categorie: e.target.value })
                  }
                />

                <Label>Diplôme</Label>
                <Input
                  value={formData.diplome}
                  onChange={(e) =>
                    setFormData({ ...formData, diplome: e.target.value })
                  }
                />

                <Label>Spécialisation</Label>
                <Input
                  value={formData.specialisation}
                  onChange={(e) =>
                    setFormData({ ...formData, specialisation: e.target.value })
                  }
                />

                <Label>Service d'affectation</Label>
                <Input
                  value={formData.service_affectation}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      service_affectation: e.target.value,
                    })
                  }
                />

                <Label>Date d'affectation</Label>
                <Input
                  type="date"
                  value={formData.date_affectation}
                  onChange={(e) =>
                    setFormData({ ...formData, date_affectation: e.target.value })
                  }
                />

                <Label>Ministère</Label>
                <Input value={formData.ministere} disabled={!!editingAgent} />

                {/* ✅ FK selects (IDs) - non modifiables en edit */}
                <Label>Direction</Label>
                <select
                  value={formData.direction_id}
                  onChange={(e) =>
                    setFormData({ ...formData, direction_id: e.target.value })
                  }
                  className="w-full border rounded-md p-2"
                  disabled={!!editingAgent}
                >
                  <option value="">Sélectionner</option>
                  {directions.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.libelle}
                    </option>
                  ))}
                </select>

                <Label>Service</Label>
                <select
                  value={formData.service_id}
                  onChange={(e) =>
                    setFormData({ ...formData, service_id: e.target.value })
                  }
                  className="w-full border rounded-md p-2"
                  disabled={!!editingAgent}
                >
                  <option value="">Sélectionner</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.libelle}
                    </option>
                  ))}
                </select>

                <Label>Fonction</Label>
                <select
                  value={formData.fonction_id}
                  onChange={(e) =>
                    setFormData({ ...formData, fonction_id: e.target.value })
                  }
                  className="w-full border rounded-md p-2"
                  disabled={!!editingAgent}
                >
                  <option value="">Sélectionner</option>
                  {fonctions.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.libelle}
                    </option>
                  ))}
                </select>

                {editingAgent && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Direction / Service / Fonction non modifiables en mode modification.
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="submit">
                {editingAgent ? "Modifier" : "Enregistrer"}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  setEditingAgent(null);
                }}
              >
                Annuler
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Dialog IMPORT */}
      <Dialog open={openImportDialog} onOpenChange={setOpenImportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Importer des agents (CSV)</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleImportSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Fichier CSV</Label>
              <Input
                type="file"
                accept=".csv,text/csv"
                onChange={(e) =>
                  setImportFile(e.target.files ? e.target.files[0] : null)
                }
              />
              <p className="text-xs text-muted-foreground">
                Format attendu : immatricule;nom;prenom;email;telephone;corps;grade;categorie;service_affectation;date_affectation
              </p>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isImporting}>
                {isImporting ? "Import..." : "Importer"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpenImportDialog(false)}
              >
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
          <CardDescription>{filteredAgents.length} agent(s) trouvé(s)</CardDescription>
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
                    <Badge>{agent.service_affectation || "—"}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <Mail className="inline h-3 w-3 mr-1" />
                      {agent.email || "—"}
                    </div>
                    <div className="text-sm">
                      <Phone className="inline h-3 w-3 mr-1" />
                      {agent.telephone || "—"}
                    </div>
                  </TableCell>
                  <TableCell>{displayFonction(agent) || "—"}</TableCell>

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

              {filteredAgents.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-sm text-muted-foreground">
                    Aucun agent trouvé.
                  </TableCell>
                </TableRow>
              )}
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
              <p><strong>CIN :</strong> {selectedAgent.cin || "—"}</p>
              <p><strong>Email :</strong> {selectedAgent.email || "—"}</p>
              <p><strong>Téléphone :</strong> {selectedAgent.telephone || "—"}</p>
              <p><strong>Adresse :</strong> {selectedAgent.adresse || "—"}</p>
              <p><strong>Date de naissance :</strong> {selectedAgent.date_naissance || "—"}</p>
              <p><strong>Situation matrimoniale :</strong> {selectedAgent.situation_matrimoniale || "—"}</p>
              <p><strong>Sexe :</strong> {selectedAgent.sexe || "—"}</p>

              <hr />

              <h3 className="font-semibold text-primary border-b pb-1">
                Informations professionnelles
              </h3>

              <p><strong>Corps :</strong> {selectedAgent.corps || "—"}</p>
              <p><strong>Grade :</strong> {selectedAgent.grade || "—"}</p>
              <p><strong>Catégorie :</strong> {selectedAgent.categorie || "—"}</p>
              <p><strong>Diplôme :</strong> {selectedAgent.diplome || "—"}</p>
              <p><strong>Spécialisation :</strong> {selectedAgent.specialisation || "—"}</p>
              <p><strong>Service d’affectation :</strong> {selectedAgent.service_affectation || "—"}</p>
              <p><strong>Date d’affectation :</strong> {selectedAgent.date_affectation || "—"}</p>

              <hr />

              <h3 className="font-semibold text-primary border-b pb-1">
                Affectation hiérarchique
              </h3>

              <p><strong>Ministère :</strong> {selectedAgent.ministere || MTEFOP_NAME}</p>
              <p><strong>Direction :</strong> {displayDirection(selectedAgent) || "—"}</p>
              <p><strong>Service :</strong> {displayService(selectedAgent) || "—"}</p>
              <p><strong>Fonction :</strong> {displayFonction(selectedAgent) || "—"}</p>
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
